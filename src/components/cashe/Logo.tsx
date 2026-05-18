export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-[30%] gradient-card shadow-glow" />
      <div className="absolute inset-0 rounded-[30%] flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gold/40 blur-md" />
          <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} className="relative">
            <circle cx="12" cy="12" r="9" fill="oklch(0.62 0.16 155)" />
            <circle cx="12" cy="12" r="4" fill="oklch(0.82 0.14 85)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
