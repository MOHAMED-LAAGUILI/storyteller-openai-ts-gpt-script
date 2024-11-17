"use client";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                 rounded-full shadow-md border-2 border-gray-300 dark:border-gray-600
                 hover:bg-gray-300 dark:hover:bg-gray-700 
                 transition-all duration-300 ease-in-out"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <FaMoon className="text-xl" />
      ) : (
        <FaSun className="text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle;
