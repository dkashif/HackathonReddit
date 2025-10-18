import React from 'react';

export const Game = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(4).keys()].map((key) => (
        <div key={key} className="flex flex-col">
          <label htmlFor={key.toString()} className="mb-1 font-medium text-gray-700">
            Your answer
          </label>
          <input
            id={key.toString()}
            type="text"
            placeholder="Type here..."
            className="
              bg-red-50
              border
              border-red-300
              rounded-xl
              p-3
              text-gray-800
              placeholder-gray-400
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-red-400
              focus:border-red-400
              transition-all
            "
          />
        </div>
      ))}
    </div>
  );
};
