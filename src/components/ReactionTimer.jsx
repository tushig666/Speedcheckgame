import React from 'react';

const ReactionTimer = ({ gameState, handleClick }) => {
  return (
    <div>
      {gameState === 'waiting' && (
        <p className="text-xl text-gray-700 animate-pulse">Бэлэн байгаарай...</p>
      )}
      {gameState === 'now' && (
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-red-500 text-white rounded-lg text-xl hover:bg-red-600 transition shadow-lg animate-bounce"
        >
          ОДОО! Дарна уу
        </button>
      )}
      {gameState === 'tooSoon' && (
        <p className="text-xl text-red-500">Хэтэрхий эрт дарлаа! Дахин оролдоно уу.</p>
      )}
    </div>
  );
};

export default ReactionTimer;
