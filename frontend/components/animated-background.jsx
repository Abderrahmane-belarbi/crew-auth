import FloatingBlobs from "./floating-blobs";

export default function AnimatedBackground({ children, className = "" }) {
  return (
    <div className={`relative min-h-dvh ${className}`}>
      {/* Background layer */}
      <div
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none
        bg-[linear-gradient(135deg,#0f0a1a_0%,#1a1030_50%,#0d0820_100%)]"
      >
        <FloatingBlobs
          color="bg-gradient-to-br from-[#4f46e5] to-[#06b6d4]"
          size="w-[520px] h-[520px]"
          top="-18%"
          left="-10%"
          opacity={0.14}
          blur="blur-3xl"
          duration={15}
          delay={0}
          animateX={[0, 120, -40, 0]}
          animateY={[0, 60, 140, 0]}
          animateRotation={[0, 18, 0]}
        />

        <FloatingBlobs
          color="bg-[linear-gradient(135deg,#06b6d4_0%,#4f46e5_100%)]"
          size="w-[420px] h-[420px]"
          top="18%"
          left="68%"
          opacity={0.12}
          blur="blur-3xl"
          duration={13}
          delay={0}
          animateX={[0, -90, 40, 0]}
          animateY={[0, 110, -60, 0]}
          animateRotation={[0, -14, 0]}
        />

        <FloatingBlobs
          color="bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4]"
          size="w-[320px] h-[320px]"
          top="62%"
          left="6%"
          opacity={0.1}
          blur="blur-2xl"
          duration={14}
          delay={0}
          animateX={[0, 70, -30, 0]}
          animateY={[0, -60, 80, 0]}
          animateRotation={[0, 10, 0]}
        />

        {/* Depth */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/50" />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay
          bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
          bg-size-[3px_3px]"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 min-h-dvh flex items-center justify-center animate-[fade-in_0.5s_ease-out_forwards]">{children}</div>
    </div>
  );
}
