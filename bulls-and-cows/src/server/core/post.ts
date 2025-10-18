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
      description: 'An exciting interactive experience',
      entryUri: 'index.html',
      heading: 'Welcome to the Game!',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'bulls-and-cows',
  });

  await redis.set(`secret:${post.id}`, secret);
  
  return post;
};
