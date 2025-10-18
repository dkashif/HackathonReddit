import React from 'react';
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}


export const Game = () => {
  return (
    <div>
      {[...Array(10).keys()].map((key) => (
        <div>
          <label htmlFor={key.toString()}>{getRandomInt(10)}</label>
          <input id={key.toString()} type="text"  />
        </div>
      ))}
    </div>
  )

}