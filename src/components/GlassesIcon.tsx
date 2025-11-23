interface GlassesIconProps {
  className?: string;
}

export function GlassesIcon({ className = "" }: GlassesIconProps) {
  return (
    <svg 
      viewBox="0 0 80 40" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3D Glasses */}
      <g transform="translate(10, 5)">
        {/* Frame */}
        <rect x="0" y="10" width="28" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
        <rect x="32" y="10" width="28" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
        {/* Bridge */}
        <line x1="28" y1="19" x2="32" y2="19" stroke="currentColor" strokeWidth="2.5"/>
        {/* Left lens - Red/Pink */}
        <rect x="3" y="13" width="22" height="12" rx="2" fill="#ec4899" opacity="0.7"/>
        {/* Right lens - Cyan/Blue */}
        <rect x="35" y="13" width="22" height="12" rx="2" fill="#06b6d4" opacity="0.7"/>
        {/* Temple arms */}
        <line x1="0" y1="19" x2="-5" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="60" y1="19" x2="65" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
    </svg>
  );
}
