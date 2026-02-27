import AnimatedBackground from "../animated-background";
export default function LoadingSpinner() {
  
  return <AnimatedBackground>
    <div className="min-h-dvh w-full flex items-center justify-center">
      <div className="size-10 rounded-full border-[3px] border-gray-200/20 border-t-primary animate-spin" />
    </div>
  </AnimatedBackground>
}