import React from 'react';

interface KinesferaLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right';
  monochrome?: boolean;
}

/**
 * Official Vector Emblem and Typography for "Kinesfera - Creando Sentido Al Juego".
 * Reproduces the cyan/teal sunburst gear with two playing/celebrating children silhouettes.
 */
export const KinesferaLogo: React.FC<KinesferaLogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
  align = 'right',
  monochrome = false
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-3xl'
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const alignClasses = {
    left: 'flex-row items-center text-left',
    center: 'flex-col items-center text-center',
    right: 'flex-col items-end text-right'
  };

  const primaryColor = monochrome ? '#0f172a' : '#00A8B5'; // Kinesfera Cyan / Teal
  const secondaryColor = monochrome ? '#334155' : '#0284C7';

  return (
    <div className={`flex ${alignClasses[align]} gap-1.5 select-none ${className}`}>
      {/* Sunburst Gear Emblem with Two Joyful Children Silhouettes */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gear / Sunburst rays around the circle */}
          <g fill={primaryColor}>
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
              (deg, i) => (
                <rect
                  key={i}
                  x="45.5"
                  y="2"
                  width="9"
                  height="12"
                  rx="4.5"
                  transform={`rotate(${deg} 50 50)`}
                />
              )
            )}
            {/* Outer thick ring */}
            <circle cx="50" cy="50" r="42" fill="none" stroke={primaryColor} strokeWidth="6" />
          </g>

          {/* Inner circle background */}
          <circle cx="50" cy="50" r="38" fill="#ffffff" />

          {/* Child 1 silhouette (Left - jumping with arms open) */}
          <g fill={secondaryColor}>
            {/* Head */}
            <circle cx="36" cy="34" r="7.5" fill={primaryColor} />
            {/* Body */}
            <path
              d="M36 43 C31 43 27 47 28 54 L30 65 C30 67 32 68 34 68 L34 81 C34 83 37 83 37 81 L38 68 L40 81 C40 83 43 83 43 81 L43 68 C44 68 45 67 45 65 L46 54 C46 47 42 43 36 43 Z"
              fill={primaryColor}
            />
            {/* Left Arm reaching up */}
            <path
              d="M30 46 C24 40 18 35 17 38 C16 41 21 47 27 51 Z"
              fill={primaryColor}
            />
            {/* Right Arm touching / holding toward child 2 */}
            <path
              d="M42 48 C46 45 49 43 50 45 C51 47 47 51 43 53 Z"
              fill={primaryColor}
            />
          </g>

          {/* Child 2 silhouette (Right - active and smiling pose) */}
          <g fill={secondaryColor}>
            {/* Head */}
            <circle cx="64" cy="34" r="7.5" fill={secondaryColor} />
            {/* Body */}
            <path
              d="M64 43 C58 43 54 47 54 54 L55 65 C55 67 57 68 59 68 L59 81 C59 83 62 83 62 81 L63 68 L65 81 C65 83 68 83 68 81 L68 68 C70 68 71 67 71 65 L73 54 C74 47 70 43 64 43 Z"
              fill={secondaryColor}
            />
            {/* Left Arm touching toward child 1 */}
            <path
              d="M58 48 C54 45 51 43 50 45 C49 47 53 51 57 53 Z"
              fill={secondaryColor}
            />
            {/* Right Arm raised joyfully */}
            <path
              d="M70 46 C76 40 82 35 83 38 C84 41 79 47 73 51 Z"
              fill={secondaryColor}
            />
          </g>
        </svg>
      </div>

      {/* Typography: Kinesfera & Creando Sentido Al Juego */}
      <div className={`flex flex-col ${align === 'right' ? 'items-end' : align === 'center' ? 'items-center' : 'items-start'}`}>
        <span
          className={`font-black tracking-tight leading-none text-slate-900 ${titleSizes[size]}`}
          style={{ fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif" }}
        >
          Kinesfera
        </span>
        {showTagline && (
          <span
            className={`font-semibold tracking-wider text-slate-600 uppercase ${taglineSizes[size]} mt-0.5`}
            style={{ fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif" }}
          >
            Creando Sentido Al Juego
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Returns clean SVG markup string for embedding directly into Word (.doc) exports
 */
export function getKinesferaLogoSvgString(width = 160, height = 70): string {
  return `
    <div style="text-align: right; margin-bottom: 8px;">
      <svg width="${width}" height="${height}" viewBox="0 0 200 90" xmlns="http://www.w3.org/2000/svg">
        <!-- Sunburst gear -->
        <g fill="#00A8B5">
          <circle cx="160" cy="36" r="28" fill="none" stroke="#00A8B5" stroke-width="4"/>
          <!-- gear rays -->
          <rect x="157" y="4" width="6" height="8" rx="3" />
          <rect x="157" y="60" width="6" height="8" rx="3" />
          <rect x="128" y="33" width="8" height="6" rx="3" />
          <rect x="184" y="33" width="8" height="6" rx="3" />
          <rect x="137" y="13" width="6" height="8" rx="3" transform="rotate(-45 140 17)" />
          <rect x="177" y="53" width="6" height="8" rx="3" transform="rotate(-45 180 57)" />
          <rect x="177" y="13" width="6" height="8" rx="3" transform="rotate(45 180 17)" />
          <rect x="137" y="53" width="6" height="8" rx="3" transform="rotate(45 140 57)" />
          <!-- Child silhouettes -->
          <circle cx="151" cy="26" r="4.5" fill="#00A8B5" />
          <path d="M151 32 C148 32 145 35 145 40 L146 56 C146 58 148 58 149 58 L149 50 L152 50 L152 58 C153 58 155 58 155 56 L157 40 C157 35 154 32 151 32 Z" fill="#00A8B5"/>
          <circle cx="169" cy="26" r="4.5" fill="#0284C7" />
          <path d="M169 32 C166 32 163 35 163 40 L164 56 C164 58 166 58 167 58 L167 50 L170 50 L170 58 C171 58 173 58 173 56 L175 40 C175 35 172 32 169 32 Z" fill="#0284C7"/>
        </g>
        <!-- Text -->
        <text x="188" y="74" text-anchor="end" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14" font-weight="900" fill="#0f172a">Kinesfera</text>
        <text x="188" y="85" text-anchor="end" font-family="'Helvetica Neue', Arial, sans-serif" font-size="7.5" font-weight="bold" fill="#475569" letter-spacing="1">CREANDO SENTIDO AL JUEGO</text>
      </svg>
    </div>
  `;
}
