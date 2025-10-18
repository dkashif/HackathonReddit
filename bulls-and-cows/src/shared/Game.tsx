import React from 'react';

export const Game = () => {
  return (
    <div>
      {[...Array(4).keys()].map((key) => (
        <div>
          <label htmlFor={key.toString()}></label>
          <input id={key.toString()} type="text"  />
        </div>
      ))}
    </div>
  )

}