'use client';
import Link from 'next/link';
import { useState } from 'react';

const UserDropdown = ({ userEmail, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = () => {
    // Menutup dropdown saat item di dalamnya diklik
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="p-2 hover:bg-black hover:text-white rounded-md"
        onClick={handleDropdownToggle}
      >
        <span className="mr-1">{userEmail}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-11 right-0 bg-white border  shadow-md w-full">
          <Link href="/organizer">
            <button
              className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
              onClick={handleMenuItemClick}
            >
              Manage My Event
            </button>
          </Link>
          <Link href="/user/tickets">
            <button
              className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
              onClick={handleMenuItemClick}
            >
              Ticket
            </button>
          </Link>
          <button
            className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
            onClick={handleMenuItemClick}
          >
            Credit
          </button>
          <button
            className="block px-4 py-2 text-black hover:bg-gray-200 w-full text-left"
            onClick={() => {
              onLogout();
              handleMenuItemClick();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
