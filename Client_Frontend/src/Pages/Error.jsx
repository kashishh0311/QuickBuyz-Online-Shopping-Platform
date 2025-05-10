import React from "react";
import { Link } from "react-router-dom";

function Error() {
  return (
    <div>
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <h1 className="text-6xl font-bold text-black">404</h1>
        <p className="mt-4 text-xl text-gray-700">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex space-x-4">
          <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-5">
            <Link to="/">Get Started</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Error;
