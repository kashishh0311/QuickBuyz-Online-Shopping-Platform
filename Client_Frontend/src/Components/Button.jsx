import React, { useState } from "react";

function Button({ text, onClick }) {
  return (
    <div className="mt-2">
      <button
        className="mt-4 bg-black hover:bg-gray-800 font-bold text-white py-2 px-4 rounded w-32 h-4/5"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}

export default Button;
