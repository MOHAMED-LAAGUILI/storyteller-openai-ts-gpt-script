"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { FaBook, FaEdit } from "react-icons/fa";
import { useEffect } from "react";
import Typed from "typed.js";
import Image from "next/image";
import LOGO from "../assets/images/agent.gif";

const Header = () => {
  useEffect(() => {
    const options = {
      strings: ["Create stories", "Explore your imagination", "Share your ideas", "Expose your Creativity"],
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
    };
    const typed = new Typed(".typed-text", options);
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <header className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-10 shadow-2xl rounded-xl mx-auto mt-10 max-w-screen-xl lg:px-10 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Image Section */}
        <div className="flex justify-center lg:justify-start lg:order-1">
          <Image
            src={LOGO}
            height={250}
            width={250}
            alt="AI Logo"
            className="mb-4 lg:mb-0 lg:w-72 xl:w-96 transition-all duration-500 transform hover:scale-110"
          />
        </div>

        {/* Text Section */}
        <div className="text-center lg:text-left lg:order-2">
          <Link href={"/"}>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity duration-300">
              Story-Teller.Ai
            </h1>
          </Link>
          <p className="text-xl sm:text-2xl font-light text-gray-100 mt-4">
            Bring your stories to <span className="font-semibold text-yellow-300">Life</span>
          </p>

          {/* Typed.js Animation */}
          <div className="mt-4 text-lg text-gray-200">
            <span className="typed-text"></span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center lg:justify-start mt-8 gap-6">
            <Link href={"/"}>
              <button className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
                <FaEdit className="text-2xl" />
                <span className="text-lg font-semibold">Edit</span>
              </button>
            </Link>

            <Link href={"/"}>
              <button className="flex items-center gap-2 bg-yellow-300 text-purple-900 py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
                <FaBook className="text-2xl" />
                <span className="text-lg font-semibold">Books</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-6">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
