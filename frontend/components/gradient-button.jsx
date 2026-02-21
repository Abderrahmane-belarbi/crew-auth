export default function GradientButton({ children }) {
  return (
    <button
      className={`h-12 w-full rounded-lg font-semibold text-primary-foreground transition-all 
        duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed 
        bg-linear-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20 cursor-pointer`}
    >
      {children}
    </button>
  );
}
