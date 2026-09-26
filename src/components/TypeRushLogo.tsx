import React from 'react';

interface TypeRushLogoProps {
  className?: string;
  size?: number | 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full';
  showProBadge?: boolean;
}

/**
 * Custom TypeRush Brand Logo Mark
 * An abstract, geometric symbol fusing the precision typing cursor (|)
 * with rapid forward rush velocity (>), creating a distinctive, technical brand identity.
 */
export const TypeRushLogo: React.FC<TypeRushLogoProps> = ({
  className = '',
  size = 20,
  variant = 'icon',
  showProBadge = false,
}) => {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'sm' ? 18 : size === 'lg' ? 28 : 22;

  const icon = (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="TypeRush Logo"
    >
      {/* Precision Vertical Cursor Bar */}
      <rect 
        x="3.5" 
        y="3" 
        width="2.75" 
        height="18" 
        rx="1.375" 
        fill="#FF5A00" 
      />

      {/* Forward Velocity Precision Chevron */}
      <path
        d="M10 5L17 12L10 19"
        stroke="#FF5A00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Secondary Fast Rush Echo Line */}
      <path
        d="M16 6.5L21.5 12L16 17.5"
        stroke="#FF5A00"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.45"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {icon}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {icon}
      <span className="font-mono text-lg font-bold tracking-tight text-[#111111] dark:text-[#F5F5F5] leading-none">
        TypeRush
      </span>
      {showProBadge && (
        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#FF5A00]/15 text-[#FF5A00] border border-[#FF5A00]/30 leading-none">
          pro
        </span>
      )}
    </div>
  );
};
