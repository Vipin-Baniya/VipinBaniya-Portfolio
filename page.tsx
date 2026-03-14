import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#1ED76005 1px, transparent 1px), linear-gradient(90deg, #1ED76005 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "44%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700, height: 700,
          background: "radial-gradient(circle, #1ED76008 0%, transparent 65%)",
        }}
      />

      <div className="relative text-center max-w-xl px-6">
        <p className="text-green font-mono text-xs tracking-[0.35em] mb-6 opacity-80">◈ STRUCTIFY</p>

        <h1 className="text-6xl md:text-7xl font-black text-text leading-none tracking-tight mb-5">
          Where Systems<br />
          <span className="text-green">Take Shape.</span>
        </h1>

        <p className="text-dim text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Engineering identity platform — projects, live code, achievements, and architecture.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/home"
            className="px-7 py-3 rounded-full bg-green text-bg font-mono font-bold text-sm
                       hover:scale-105 hover:shadow-[0_0_28px_#1ED76040] transition-all duration-200"
          >
            ▶ Explore Platform
          </Link>
          <Link
            href="/admin/login"
            className="px-7 py-3 rounded-full border border-border text-text font-mono font-semibold text-sm
                       hover:border-green/40 hover:scale-105 transition-all duration-200"
          >
            ⬡ Admin Login
          </Link>
        </div>

        <p className="mt-14 text-xs text-border font-mono">v1.0.0 · Structify</p>
      </div>
    </main>
  );
}
