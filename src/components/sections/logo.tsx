import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10", className)}
    >
      {/* Background Shield */}
      <path
        d="M60 10L110 30V60C110 85 88 105 60 110C32 105 10 85 10 60V30L60 10Z"
        fill="#000000"
        stroke="#EF4444"
        strokeWidth="2"
      />

      {/* Military Star */}
      <path
        d="M60 25L65 40L80 40L68 50L73 65L60 55L47 65L52 50L40 40L55 40L60 25Z"
        fill="#EF4444"
      />

      {/* Letter M */}
      <path
        d="M35 45H45L60 70L75 45H85L65 85H55L35 45Z"
        fill="#FFFFFF"
        stroke="#EF4444"
        strokeWidth="1"
      />

      {/* Decorative Lines */}
      <path d="M20 35L100 35" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
      <path d="M20 85L100 85" stroke="#EF4444" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
