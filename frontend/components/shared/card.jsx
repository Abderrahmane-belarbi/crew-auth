export default function Card({children}) {
  return (
    <div className="w-full max-w-md flex flex-col gap-2 animate-[fade-in_0.5s_ease-out_forwards]">
      <div className="px-8 py-10 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl">
        {children}
      </div>
    </div>
  )
}