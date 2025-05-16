import React from "react";

const TypingAnimation = () => {
  return (
    <div className="whitespace-pre-wrap break-words p-3 rounded-xl bg-gray-700 w-min flex gap-[5px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-full w-[5px] h-[5px]"
          style={{
            animation: "typing 1s infinite ease-in-out",
            animationDelay: `${index * 0.2}s`,
          }}
        ></div>
      ))}

      
      <style jsx>{`
        @keyframes typing {
          0%, 20% { opacity: 0.2; transform: translateY(0); }
          40%, 60% { opacity: 0.5; transform: translateY(-2px); }
          80%, 100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TypingAnimation;
