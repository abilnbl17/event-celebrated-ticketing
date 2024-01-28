'use client';
import { useState } from 'react';

export const Navmobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden relative">
      <button className="text-3xl" onClick={toggleMenu}>
        ☰
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full  flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-2xl w-auto">
            <ul>
              <li>
                <a href="#">Option 1</a>
              </li>
              <li>
                <a href="#">Option 2</a>
              </li>
              <li>
                <a href="#">Option 3</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
