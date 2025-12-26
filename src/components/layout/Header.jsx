import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { STORE_INFO } from "../../utils/constants";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const links = [
    { name: "الرئيسية", href: "/" },
    { name: "تيشيرتات", href: "/products" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-900 dark:border-gray-800 duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-screen-xl">
        {/* Logo */}
        <Link
          title="الشعار"
          to="/"
          className="text-xl font-black text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all tracking-tighter"
        >
          {STORE_INFO.NAME}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              title={link.name}
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions (Dark Mode & Mobile Toggle) */}
        <div className="flex items-center gap-4.5">
          <button
            title="تغير المود"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden dark:bg-gray-800 dark:hover:text-white transition-all p-1.5 text-gray-600 dark:text-gray-400 bg-gray-100 rounded-lg hover:text-black  cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 md:hidden bg-white dark:bg-gray-900 transition-all z-50 top-[68px] ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-6 gap-4 text-right">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
