import { context, reddit, redis } from '@devvit/web/server';

export const createPost = async () => {

  // create the secret number
  const secret = Array.from({ length: 4 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');

  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  const post = await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'bulls-and-cows',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Tap to Start',
      description: 'A Fun Number Guessing Game',
      entryUri: 'index.html',
      heading: 'Bulls and Cows',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'bulls-and-cows',
  });

  // store secret in redis
  await redis.set(`secret:${post.id}`, secret);
  await redis.set(`attempts:${post.id}`, '0');
  
  return post;
};
