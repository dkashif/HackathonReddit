import React, { useState, useEffect } from 'react';
import { GuessResponse, MatchStatus } from './shared/types/api';

type GuessHistoryItem = {
  guess: string;
  strikes: number;
  balls: number;
  matches: MatchStatus[];
};

const App = () => {
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<GuessHistoryItem[]>([]);
  const [gameState, setGameState] = useState({
    completed: false,
    attemptsLeft: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 4 characters
    if (/^\d{0,4}$/.test(value)) {
      setGuess(value);
      setError('');
    }
  };

  const handleSubmitGuess = async () => {
    if (guess.length !== 4) {
      setError('Please enter exactly 4 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit guess');
        setLoading(false);
        return;
      }

      const data: GuessResponse = await response.json();

      // Add the guess with its results to history
      setGuesses([...guesses, {
        guess,
        strikes: data.strikes,
        balls: data.balls,
        matches: data.matches,
      }]);

      // Update game state
      setGameState({
        completed: data.completed,
        attemptsLeft: data.attemptsLeft,
      });

      // Clear input
      setGuess('');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && guess.length === 4 && !loading) {
      handleSubmitGuess();
    }
  };

  const getColorForMatch = (status: MatchStatus): string => {
    switch (status) {
      case 'correct':
        return 'bg-green-500';
      case 'exists':
        return 'bg-yellow-500';
      case 'unmatched':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const handleNewGame = () => {
    setGuess('');
    setGuesses([]);
    setGameState({ completed: false, attemptsLeft: 10 });
    setError('');
    // Reload the page to start a new game with a new secret
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Bulls & Cows
          </h1>
          <p className="text-gray-600">
            Guess the 4-digit number
          </p>
        </div>

        {/* Game Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600">Attempts Left</p>
              <p className="text-2xl font-bold text-indigo-600">
                {gameState.attemptsLeft}
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600">Guesses Made</p>
              <p className="text-2xl font-bold text-indigo-600">
                {guesses.length}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Correct Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span>Wrong Position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-400"></div>
              <span>Not in Number</span>
            </div>
          </div>
        </div>

        {/* Game Won Message */}
        {gameState.completed && (
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-green-700 mb-4">
              You guessed the number in {guesses.length} attempts!
            </p>
            <button
              onClick={handleNewGame}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Game Lost Message */}
        {gameState.attemptsLeft === 0 && !gameState.completed && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Game Over
            </h2>
            <p className="text-red-700 mb-4">
              You've run out of attempts!
            </p>
            <button
              onClick={handleNewGame}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Input Section */}
        {!gameState.completed && gameState.attemptsLeft > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={guess}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter 4 digits"
                maxLength={4}
                className="flex-1 px-4 py-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-widest"
                disabled={loading}
              />
              <button
                onClick={handleSubmitGuess}
                disabled={guess.length !== 4 || loading}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Checking...' : 'Guess'}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        )}

        {/* Guess History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Guess History
          </h2>
          {guesses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No guesses yet. Start playing!
            </p>
          ) : (
            <div className="space-y-3">
              {guesses.slice().reverse().map((item, index) => (
                <div
                  key={guesses.length - index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-500 font-semibold w-8">
                    #{guesses.length - index}
                  </span>
                  <div className="flex gap-2">
                    {item.guess.split('').map((digit, digitIndex) => (
                      <div
                        key={digitIndex}
                        className={`w-12 h-12 flex items-center justify-center text-white text-xl font-bold rounded-lg ${getColorForMatch(item.matches[digitIndex])}`}
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                  <div className="ml-auto flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Bulls</p>
                      <p className="font-bold text-green-600">
                        {item.strikes}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Cows</p>
                      <p className="font-bold text-yellow-600">
                        {item.balls}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-2">How to Play</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Guess a 4-digit number</li>
            <li>• <span className="font-semibold">Bulls (Strikes)</span>: Correct digit in correct position</li>
            <li>• <span className="font-semibold">Cows (Balls)</span>: Correct digit in wrong position</li>
            <li>• You have 10 attempts to guess the number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;