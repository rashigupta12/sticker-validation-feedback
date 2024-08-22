'use client';
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useDarkModeContext } from "@/provider/darkmodecontext";
import { FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar({ minimal, session }) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.replace('/login');
    window.location.reload();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`bg-gradient-to-r from-gray-800 to-gray-600 p-4 dark:bg-gray-900`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-bold">
          Sticker Validation DashBoard
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-md text-gray-100 dark:text-gray-300">
              {isDarkMode ? "Dark" : "Light"}
            </span>
            <div
              className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer ${
                isDarkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
              onClick={toggleDarkMode}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isDarkMode ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </div>
          </div>
          {!minimal && session && (
            <div className="relative">
              <Image
                src="/image.png"
                height={40}
                width={40}
                alt="User Icon"
                className="cursor-pointer rounded-full border-2 border-white transition-transform duration-300 hover:scale-105"
                onClick={handleDropdownToggle}
              />
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-600"
                >
                  <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-700">
                    <Image
                      src="/image.png"
                      alt="User Avatar"
                      width={50}
                      height={50}
                      className="rounded-full border border-gray-200 dark:border-gray-700"
                    />
                    <div className="ml-3">
                      <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                        {session.user.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {!minimal && !session && (
            <Link href="/register" legacyBehavior>
              <a className="px-4 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-150 ease-in-out">
                Signup
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
