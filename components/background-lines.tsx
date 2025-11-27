"use client"

interface BackgroundLinesProps {
  opacity: number
  scale: number
}

export function BackgroundLines({ opacity, scale }: BackgroundLinesProps) {
  return (
    <div
      className="fixed inset-0 z-0 w-screen pointer-events-none transition-all duration-100"
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2269"
        height="2108"
        viewBox="0 0 2269 2108"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          opacity="0.05"
          d="M510.086 0.543457L507.556 840.047C506.058 1337.18 318.091 1803.4 1.875 2094.29"
          stroke="gray"
          strokeWidth="1"
          strokeMiterlimit="10"
        />
        <path
          opacity="0.05"
          d="M929.828 0.543457L927.328 829.877C925.809 1334 737.028 1807.4 418.435 2106"
          stroke="gray"
          strokeWidth="1"
          strokeMiterlimit="10"
        />
        <path
          opacity="0.05"
          d="M1341.9 0.543457L1344.4 829.876C1345.92 1334 1534.7 1807.4 1853.29 2106"
          stroke="gray"
          strokeWidth="1"
          strokeMiterlimit="10"
        />
        <path
          opacity="0.05"
          d="M1758.96 0.543457L1761.49 840.047C1762.99 1337.18 1950.96 1803.4 2267.17 2094.29"
          stroke="gray"
          strokeWidth="1"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  )
}
