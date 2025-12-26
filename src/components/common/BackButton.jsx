import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group flex items-center gap-2 px-4 h-10 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-xl transition-all cursor-pointer w-fit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
      
      <span className="text-sm font-bold">رجوع</span>
    </button>
  );
};

export default BackButton;