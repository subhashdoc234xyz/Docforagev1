import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forge-bg flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 select-none">
        <div className="w-11 h-11 rounded-xl bg-forge-accent flex items-center justify-center text-white font-bold text-2xl glow transition-transform duration-300 hover:scale-105 active:scale-95">
          <span className="animate-hammer">⚒</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            DocForge
            <span className="text-[10px] bg-forge-accent/15 border border-forge-accent/30 text-forge-accent px-1.5 py-0.2 rounded font-normal uppercase tracking-wider">
              v1.1
            </span>
          </h1>
          <p className="text-xs text-forge-muted font-medium">
            AI-Powered README Generator
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-forge-card border border-forge-border rounded-xl p-8 glass-panel animate-forge-glow shadow-2xl">

        {/* Toggle */}
        <div className="flex gap-1 bg-forge-bg border border-forge-border rounded-lg p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              isLogin
                ? "bg-forge-card text-white shadow-md border border-forge-border/40"
                : "text-forge-muted hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              !isLogin
                ? "bg-forge-card text-white shadow-md border border-forge-border/40"
                : "text-forge-muted hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold text-white mb-1">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-xs text-forge-muted mb-6">
          {isLogin
            ? "Sign in to start forging READMEs"
            : "Join DocForge for free — no credit card needed"}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-red-400 text-xs flex gap-2 items-start">
            <span>⚠️</span>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[10px] text-forge-muted font-bold uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="w-full bg-forge-bg border border-forge-border rounded-lg px-4 py-2.5 text-sm text-forge-text placeholder-forge-muted/70 focus:outline-none focus:border-forge-accent transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-forge-muted font-bold uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-forge-bg border border-forge-border rounded-lg px-4 py-2.5 text-sm text-forge-text placeholder-forge-muted/70 focus:outline-none focus:border-forge-accent transition-colors"
            />
            {!isLogin && (
              <p className="text-[10px] text-forge-muted mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${
            loading || !email || !password
              ? "bg-forge-border text-forge-muted cursor-not-allowed"
              : "bg-forge-accent hover:bg-orange-500 text-white glow hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {isLogin ? "Signing in..." : "Creating account..."}
            </span>
          ) : isLogin ? (
            "⚒ Sign In"
          ) : (
            "⚒ Create Account"
          )}
        </button>

        {/* Switch Mode */}
        <p className="text-xs text-forge-muted text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-forge-accent hover:underline font-bold cursor-pointer"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>

      <p className="text-[10px] text-forge-muted mt-6 select-none">
        Powered by <span className="text-forge-blue">Firebase</span>
      </p>
    </div>
  );
}
