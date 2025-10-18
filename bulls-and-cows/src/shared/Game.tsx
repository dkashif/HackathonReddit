import React from 'react';

export const Game = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(4).keys()].map((key) => (
        <div key={key} className="flex flex-col">
          <label htmlFor={key.toString()} className="mb-1 text-gray-700">
            Input {key + 1}
          </label>
          <input
            id={key.toString()}
            type="text"
            className="bg-gray-100 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          />
        </div>
      ))}
    </div>
  );
};
