import React, { useState } from 'react';

interface KoalaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mascot-only' | 'badge' | 'compact';
  onClick?: () => void;
  withTagline?: boolean;
}

export const KoalaLogo: React.FC<KoalaLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  onClick,
  withTagline = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Height mappings based on size
  const sizeClasses = {
    xs: 'h-7',
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  }[size];

  // Mascot only view
  if (variant === 'mascot-only') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center justify-center relative select-none ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''} ${className}`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClasses} w-auto aspect-square drop-shadow-sm`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Ear */}
          <circle cx="22" cy="28" r="18" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <circle cx="22" cy="28" r="11" fill="#F8FAFC" />
          
          {/* Right Ear */}
          <circle cx="78" cy="28" r="18" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <circle cx="78" cy="28" r="11" fill="#F8FAFC" />
          
          {/* Body */}
          <ellipse cx="50" cy="74" rx="24" ry="20" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <ellipse cx="50" cy="74" rx="15" ry="13" fill="#F8FAFC" />
          
          {/* Feet */}
          <ellipse cx="36" cy="90" rx="9" ry="6" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />
          <ellipse cx="64" cy="90" rx="9" ry="6" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />

          {/* Left Arm (Waving) */}
          <path
            d="M28 65 C16 60 12 45 18 40 C22 36 28 46 34 56"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Right Arm */}
          <path
            d="M72 65 C84 64 88 52 82 46 C76 40 70 50 66 58"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Head */}
          <ellipse cx="50" cy="42" rx="30" ry="26" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />

          {/* Eyes (Happy arcs) */}
          <path
            d="M36 38 Q40 33 44 38"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M56 38 Q60 33 64 38"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Big Koala Nose */}
          <ellipse cx="50" cy="46" rx="9" ry="12" fill="#334155" stroke="#1E293B" strokeWidth="2" />
          {/* Nose highlight */}
          <ellipse cx="48" cy="42" rx="2.5" ry="4" fill="#64748B" opacity="0.6" />

          {/* Smile */}
          <path
            d="M44 60 Q50 65 56 60"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  // If the image is available and hasn't errored, prefer displaying the clean raster image inside an optimized container
  if (!imgError) {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center gap-2 select-none group ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
      >
        <div className={`relative flex items-center shrink-0 ${sizeClasses}`}>
          <img
            src="/koala-logo.png"
            alt="Koala Lo Tiene - Logo Oficial"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-auto object-contain rounded-lg drop-shadow-xs group-hover:scale-105 transition-transform"
          />
        </div>
        {withTagline && (
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              Casa Central & Fábrica
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Río Negro y Neuquén
            </span>
          </div>
        )}
      </div>
    );
  }

  // High-fidelity fallback SVG Vector with full mascot & styled typography
  return (
    <div 
      onClick={onClick} 
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 280 80"
        className={`${sizeClasses} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* KOALA TEXT in chunky bubble style */}
        <text
          x="10"
          y="52"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="48"
          fill="#EA580C"
          stroke="#1E293B"
          strokeWidth="4"
          strokeLinejoin="round"
          letterSpacing="-1px"
        >
          Koala
        </text>
        <text
          x="10"
          y="52"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="48"
          fill="#EA580C"
          letterSpacing="-1px"
        >
          Koala
        </text>

        {/* Subtitle "Lo tiene!" */}
        <text
          x="88"
          y="72"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="20"
          fill="#1E293B"
        >
          Lo tiene!
        </text>

        {/* Mascot on the right */}
        <g transform="translate(205, 5) scale(0.72)">
          {/* Left Ear */}
          <circle cx="22" cy="28" r="18" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <circle cx="22" cy="28" r="11" fill="#F8FAFC" />
          
          {/* Right Ear */}
          <circle cx="78" cy="28" r="18" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <circle cx="78" cy="28" r="11" fill="#F8FAFC" />
          
          {/* Body */}
          <ellipse cx="50" cy="74" rx="24" ry="20" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <ellipse cx="50" cy="74" rx="15" ry="13" fill="#F8FAFC" />
          
          {/* Arms */}
          <path
            d="M28 65 C16 60 12 45 18 40 C22 36 28 46 34 56"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M72 65 C84 64 88 52 82 46 C76 40 70 50 66 58"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Head */}
          <ellipse cx="50" cy="42" rx="30" ry="26" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />

          {/* Eyes */}
          <path d="M36 38 Q40 33 44 38" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M56 38 Q60 33 64 38" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Nose */}
          <ellipse cx="50" cy="46" rx="9" ry="12" fill="#334155" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="48" cy="42" rx="2.5" ry="4" fill="#64748B" opacity="0.6" />

          {/* Smile */}
          <path d="M44 60 Q50 65 56 60" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};
