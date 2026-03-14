"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, redirect: false,
    });
    if (res?.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/30 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-green" />
          </div>
          <h1 className="text-2xl font-black text-text">Admin Login</h1>
          <p className="text-muted text-sm mt-1">Structify Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text outline-none focus:border-green/40 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-text outline-none focus:border-green/40 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green text-bg rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Logging in...</> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
