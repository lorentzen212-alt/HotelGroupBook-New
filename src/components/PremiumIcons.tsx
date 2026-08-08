import { cn } from "@/lib/utils";

/**
 * Premium black-and-gold SVG icons.
 * Charcoal fill with satin metallic gold outline, inner shadow and
 * upper-left highlight. Designed for luxury hotel branding.
 */

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const CHARCOAL_FILL = "#171717";
const GOLD_MAIN = "#F2C14E";
const GOLD_HIGHLIGHT = "#FFD978";
const GOLD_SHADOW = "#B87912";

function Base({
  size = 22,
  className,
  children,
}: {
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      className={cn(className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={GOLD_HIGHLIGHT} />
      <stop offset="45%" stopColor={GOLD_MAIN} />
      <stop offset="100%" stopColor={GOLD_SHADOW} />
    </linearGradient>
  );
}

function EdgeHighlight({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
      <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
  );
}

function InnerShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feOffset in="SourceAlpha" dx="1.4" dy="1.6" result="offset" />
      <feGaussianBlur in="offset" stdDeviation="1.8" result="blurred" />
      <feComposite in="SourceAlpha" in2="blurred" operator="out" result="shadow" />
      <feFlood floodColor="#000000" floodOpacity="0.55" result="color" />
      <feComposite in="color" in2="shadow" operator="in" result="innerShadow" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="innerShadow" />
      </feMerge>
    </filter>
  );
}

const STROKE = 5;

export function ShieldCheckPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="shieldGold" />
        <EdgeHighlight id="shieldHi" />
        <InnerShadow id="shieldIS" />
      </defs>
      <g filter="url(#shieldIS)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M64 16 L94 28 V54 C94 77 81 94 64 105 C47 94 34 77 34 54 V28 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#shieldGold)"
          strokeWidth={STROKE}
        />
        <path
          d="M64 16 L94 28 V54 C94 77 81 94 64 105 C47 94 34 77 34 54 V28 Z"
          fill="url(#shieldHi)"
          stroke="none"
        />
        <path
          d="M48 60 L59 71 L81 47"
          fill="none"
          stroke="url(#shieldGold)"
          strokeWidth={STROKE + 0.5}
        />
      </g>
    </Base>
  );
}

export function ClockPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="clockGold" />
        <EdgeHighlight id="clockHi" />
        <InnerShadow id="clockIS" />
      </defs>
      <g filter="url(#clockIS)" strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx="64"
          cy="64"
          r="44"
          fill={CHARCOAL_FILL}
          stroke="url(#clockGold)"
          strokeWidth={STROKE}
        />
        <circle cx="64" cy="64" r="44" fill="url(#clockHi)" stroke="none" />
        <path d="M64 38 V64 L82 74" fill="none" stroke="url(#clockGold)" strokeWidth={STROKE + 0.5} />
      </g>
    </Base>
  );
}

export function HeadsetPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="headsetGold" />
        <EdgeHighlight id="headsetHi" />
        <InnerShadow id="headsetIS" />
      </defs>
      <g filter="url(#headsetIS)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M31 66 V56 C31 38 46 24 64 24 C82 24 97 38 97 56 V66"
          fill="none"
          stroke="url(#headsetGold)"
          strokeWidth={STROKE}
        />
        <rect
          x="24"
          y="56"
          width="16"
          height="30"
          rx="7"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGold)"
          strokeWidth={STROKE - 0.5}
        />
        <rect x="24" y="56" width="16" height="30" rx="7" fill="url(#headsetHi)" stroke="none" />
        <rect
          x="88"
          y="56"
          width="16"
          height="30"
          rx="7"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGold)"
          strokeWidth={STROKE - 0.5}
        />
        <rect x="88" y="56" width="16" height="30" rx="7" fill="url(#headsetHi)" stroke="none" />
        <path
          d="M97 82 C97 94 88 99 78 99 H72"
          fill="none"
          stroke="url(#headsetGold)"
          strokeWidth={STROKE}
        />
        <rect
          x="62"
          y="94"
          width="16"
          height="10"
          rx="5"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGold)"
          strokeWidth={STROKE - 1}
        />
      </g>
    </Base>
  );
}

export function LockPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="lockGold" />
        <EdgeHighlight id="lockHi" />
        <InnerShadow id="lockIS" />
      </defs>
      <g filter="url(#lockIS)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M44 52 V42 C44 30 53 20 64 20 C75 20 84 30 84 42 V52"
          fill="none"
          stroke="url(#lockGold)"
          strokeWidth={STROKE}
        />
        <rect
          x="31"
          y="50"
          width="66"
          height="54"
          rx="8"
          fill={CHARCOAL_FILL}
          stroke="url(#lockGold)"
          strokeWidth={STROKE}
        />
        <rect x="31" y="50" width="66" height="54" rx="8" fill="url(#lockHi)" stroke="none" />
        <circle cx="64" cy="72" r="6" fill="url(#lockGold)" />
        <path d="M64 77 V88" stroke="url(#lockGold)" strokeWidth={STROKE} />
      </g>
    </Base>
  );
}

export function GroupPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="groupGold" />
        <EdgeHighlight id="groupHi" />
        <InnerShadow id="groupIS" />
      </defs>
      <g filter="url(#groupIS)" strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx="48"
          cy="42"
          r="14"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGold)"
          strokeWidth={STROKE - 0.5}
        />
        <circle cx="48" cy="42" r="14" fill="url(#groupHi)" stroke="none" />
        <circle
          cx="83"
          cy="45"
          r="12"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGold)"
          strokeWidth={STROKE - 0.5}
        />
        <circle cx="83" cy="45" r="12" fill="url(#groupHi)" stroke="none" />
        <path
          d="M23 96 C23 76 34 65 48 65 C62 65 73 76 73 96 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGold)"
          strokeWidth={STROKE - 0.5}
        />
        <path
          d="M23 96 C23 76 34 65 48 65 C62 65 73 76 73 96 Z"
          fill="url(#groupHi)"
          stroke="none"
        />
        <path
          d="M67 96 C67 80 75 70 86 70 C97 70 105 80 105 96 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGold)"
          strokeWidth={STROKE - 0.5}
        />
        <path
          d="M67 96 C67 80 75 70 86 70 C97 70 105 80 105 96 Z"
          fill="url(#groupHi)"
          stroke="none"
        />
      </g>
    </Base>
  );
}
