import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse, GuessResponse, MatchStatus } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, GuessResponse | { color: string; }, unknown>(
  '/api/guess',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    // Placeholder logic for handling a guess
    const color = _req.body.color || 'unknown';
    const completed = false; // Placeholder
    const strikes = 0; // Placeholder
    const balls = 0; // Placeholder
    const attemptsLeft = 10; // Placeholder  

    res.json({
      type: "guess",
      color,
      completed,
      strikes,
      balls,
      attemptsLeft,
      postId,
    });
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post<{ postId: string }, GuessResponse | { status: string; message: string }, { guess: string }>(
  '/api/guess',
  async (req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    try {
      // Get the guess from request body
      const guess = req.body.guess;
      
      if (!guess || typeof guess !== 'string') {
        res.status(400).json({
          status: 'error',
          message: 'guess is required and must be a string',
        });
        return;
      }

      // Get the secret number from Redis (you'll need to store this when creating a post)
      const secretKey = `secret:${postId}`;
      const secret = await redis.get(secretKey);
      
      if (!secret) {
        res.status(400).json({
          status: 'error',
          message: 'No secret found for this post',
        });
        return;
      }

      // Validate guess length matches secret length
      if (guess.length !== secret.length) {
        res.status(400).json({
          status: 'error',
          message: `Guess must be ${secret.length} digits`,
        });
        return;
      }

      // Calculate matches, strikes, and balls
      const matches: MatchStatus[] = [];
      let strikes = 0;
      let balls = 0;

      // Create arrays to track which positions have been matched
      const secretUsed = new Array(secret.length).fill(false);
      const guessUsed = new Array(guess.length).fill(false);

      // First pass: find all strikes (correct position and digit)
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === secret[i]) {
          matches[i] = 'correct';
          strikes++;
          secretUsed[i] = true;
          guessUsed[i] = true;
        }
      }

      // Second pass: find balls (correct digit, wrong position)
      for (let i = 0; i < guess.length; i++) {
        if (!guessUsed[i]) {
          let found = false;
          for (let j = 0; j < secret.length; j++) {
            if (!secretUsed[j] && guess[i] === secret[j]) {
              matches[i] = 'exists';
              balls++;
              secretUsed[j] = true;
              found = true;
              break;
            }
          }
          if (!found) {
            matches[i] = 'unmatched';
          }
        }
      }

      // Check if game is completed
      const completed = strikes === secret.length;

      // Get and update attempts
      const attemptsKey = `attempts:${postId}`;
      const currentAttempts = await redis.get(attemptsKey);
      const attempts = currentAttempts ? parseInt(currentAttempts) : 0;
      const newAttempts = attempts + 1;
      await redis.set(attemptsKey, newAttempts.toString());

      const maxAttempts = 10;
      const attemptsLeft = Math.max(0, maxAttempts - newAttempts);

      res.json({
        type: "guess",
        color: req.body.color || 'unknown',
        completed,
        strikes,
        balls,
        attemptsLeft,
        postId,
        matches,
      });
    } catch (error) {
      console.error(`API Guess Error for post ${postId}:`, error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);


// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
