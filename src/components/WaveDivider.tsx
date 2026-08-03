const WaveDivider = ({ color = "hsl(var(--pink-light))", flip = false, className = "" }: { color?: string; flip?: boolean; className?: string }) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      preserveAspectRatio="none"
    >
      <path
        d="M0 60C240 120 480 0 720 60C960 120 1200 0 1440 60V120H0V60Z"
        fill={color}
      />
    </svg>
  </div>
);

export default WaveDivider;
