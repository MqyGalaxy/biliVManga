import React from 'react';

export default function Logo({ className = "h-full w-auto" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 230 60" 
      className={className}
    >
      <defs>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF85A8" />
          <stop offset="100%" stopColor="#A87BF4" />
        </linearGradient>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#A87BF4" floodOpacity="0.3"/>
        </filter>

        <path id="sparkle" d="M 0 -10 Q 0 0 10 0 Q 0 0 0 10 Q 0 0 -10 0 Q 0 0 0 -10 Z" />
      </defs>

      <style>{`
        .custom-title-font {
          font-family: 'Nunito', sans-serif;
          font-weight: 900; 
          font-style: normal;
        }
      `}</style>

      <g transform="rotate(-2, 115, 30)">
          
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            className="custom-title-font"
            fontSize="42" 
            fill="url(#textGrad)" 
            stroke="#ffffff" 
            strokeWidth="6" 
            strokeLinejoin="round"
            strokeLinecap="round"
            paintOrder="stroke fill" 
            filter="url(#glow)" 
            letterSpacing="-1"
          >
            biliVManga
          </text>
          
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            className="custom-title-font"
            fontSize="42" 
            fill="url(#textGrad)" 
            letterSpacing="-1"
          >
            biliVManga
          </text>

          <use href="#sparkle" fill="#FF85A8" transform="translate(215, 15) scale(0.8)" />
          
          <use href="#sparkle" fill="#A87BF4" transform="translate(16, 44) scale(0.6)" />
      </g>
    </svg>
  );
}