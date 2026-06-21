type BrandLogoProps = {
  size?: number;
  className?: string;
};

export function BrandLogo({ size = 32, className = "" }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#f4eedf" />
      <circle cx="16" cy="16" r="9.5" stroke="#3d4e1e" strokeWidth="2" />
      <circle cx="16" cy="16" r="4.5" fill="#8a6b2e" />
    </svg>
  );
}
