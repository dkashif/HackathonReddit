import React from 'react';

function Header() {
  return (
    <header className="bg-black border-b-gray-500 border-4 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl font-extrabold text-green-700 hover:text-green-500 transition duration-150"
            >
              Bulls and Cows
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
