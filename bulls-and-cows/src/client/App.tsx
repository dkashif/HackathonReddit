import { navigateTo } from '@devvit/web/client';
import { useCounter } from './hooks/useCounter';
import Header from './components/Header';
import { Game } from '../shared/Game';

export const App = () => {
  const { count, username, loading, increment, decrement } = useCounter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 gap-6">
      <Header />

      <img
        className="object-contain w-1/2 max-w-[250px] mx-auto"
        src="/snoo.png"
        alt="Snoo"
      />

      {/* Main Card */}
      <div className="flex flex-col items-center gap-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        {/* Game */}
        <Game />

        {/* Welcome Text */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {username ? `Hey ${username} 👋 Welcome!` : 'Loading...'}
        </h1>

        {/* Counter */}
        <div className="flex items-center justify-center gap-4">
          <button
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-16 h-16 text-3xl rounded-full transition-all shadow-md"
            onClick={decrement}
            disabled={loading}
          >
            -
          </button>
          <span className="text-2xl font-medium text-gray-800 min-w-[50px] text-center">
            {loading ? '...' : count}
          </span>
          <button
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-black w-16 h-16 text-3xl rounded-full transition-all shadow-md"
            onClick={increment}
            disabled={loading}
          >
            +
          </button>
        </div>

        {/* Instructions */}
        <p className="text-center text-gray-600 text-sm">
          Edit{' '}
          <span className="bg-gray-200 px-1 py-0.5 rounded font-mono">
            src/client/App.tsx
          </span>{' '}
          to customize the app.
        </p>
      </div>

      {/* Footer */}
      <footer className="flex gap-3 text-gray-500 text-sm mt-6">
        <button
          className="hover:text-gray-800 transition-colors"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span>|</span>
        <button
          className="hover:text-gray-800 transition-colors"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span>|</span>
        <button
          className="hover:text-gray-800 transition-colors"
          onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
          Discord
        </button>
      </footer>
    </div>
  );
};
