"use client";
import Image from "next/image";
import LOGO from "../assets/images/ai.gif";
import Link from "next/link";
import StoryWriter from "../components/StoryWriter";


export default function Home() {
  return (
    <div className="flex justify-center items-center p-6 lg:p-12 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <section className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text, Input Fields */}
        <div className="flex flex-col justify-center items-center lg:items-start lg:text-left mt-8 lg:mt-0 space-y-8 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
          <StoryWriter />
        </div>

        {/* Right Side: Logo and Button */}
        <div className="flex flex-col justify-center items-center lg:items-start lg:text-center space-y-8 p-6 bg-[#001936] dark:bg-[#001936] rounded-lg shadow-lg">
          <Image
            src={LOGO}
            height={900}
            width={900}
            alt="AI Logo"
            className="rounded-lg shadow-lg "
            loading="lazy"
          />
          <button className="w-full flex justify-center items-center text-center bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300">
            <Link href="/">Explore Story Library</Link>
          </button>
        </div>
      </section>
    </div>
  );
}
