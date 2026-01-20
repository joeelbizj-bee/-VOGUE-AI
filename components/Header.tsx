
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-6 border-b border-white/10 flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <span className="text-amber-600">
          <i className="fa-solid fa-hat-cowboy text-3xl"></i>
        </span>
        <h1 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-white">
          VOGUE <span className="text-amber-600 font-normal">AI</span>
        </h1>
      </div>
      <p className="text-gray-400 text-sm md:text-base font-light tracking-widest uppercase mt-2">
        High Fashion • Cowboy Couture • Elite Portraits
      </p>
    </header>
  );
};
