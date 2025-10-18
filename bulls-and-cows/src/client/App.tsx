import { navigateTo } from '@devvit/web/client';
import { useCounter } from './hooks/useCounter';
import Header from './components/Header';


export const App = () => {
  const { count, username, loading, increment, decrement } = useCounter();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex relative flex-col justify-center items-center min-h-[calc(100vh-4rem)] gap-4 p-6">
        {/* Existing small counter UI kept above the game (optional) */}
        <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-lg shadow mb-6">
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center bg-[#d93900] text-white w-12 h-12 text-2xl rounded-full cursor-pointer font-mono leading-none transition-colors"
              onClick={decrement}
              disabled={loading}
            >
              -
            </button>
            <span className="text-2xl font-medium mx-5 min-w-[50px] text-center leading-none text-gray-900">
              {loading ? '...' : count}
            </span>
            <button
              className="flex items-center justify-center bg-[#d93900] text-white w-12 h-12 text-2xl rounded-full cursor-pointer font-mono leading-none transition-colors"
              onClick={increment}
              disabled={loading}
            >
              +
            </button>
          </div>
        </div>

        {/* Bulls & Cows game component */}
        
      </main>

      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600">
        <button className="cursor-pointer" onClick={() => navigateTo('https://developers.reddit.com/docs')}>
          Docs
        </button>
        <span className="text-gray-300">|</span>
        <button className="cursor-pointer" onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}>
          r/Devvit
        </button>
        <span className="text-gray-300">|</span>
        <button className="cursor-pointer" onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}>
          Discord
        </button>
      </footer>
    </div>
  );
};