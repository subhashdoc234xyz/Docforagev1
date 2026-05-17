import React from "react";

export default function Header({ onToggleSettings, isKeyConfigured }) {
  return (
    <header className="border-b border-forge-border bg-forge-card/85 backdrop-blur px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-forge-accent flex items-center justify-center text-white font-bold text-xl glow cursor-pointer transition-transform duration-300 group-hover:scale-105 active:scale-95 select-none">
            <span className="group-hover:animate-hammer">⚒</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
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

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-3">
          {/* API Key Status Indicator */}
          <button
            onClick={onToggleSettings}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${
              isKeyConfigured
                ? "bg-forge-green/10 border-forge-green/30 text-forge-green glow-green"
                : "bg-forge-accent/10 border-forge-accent/30 text-forge-accent glow"
            }`}
            title="Click to configure your Gemini API Key"
          >
            <span className={`w-2 h-2 rounded-full ${isKeyConfigured ? "bg-forge-green animate-pulse" : "bg-forge-accent animate-ping"}`} />
            {isKeyConfigured ? "API Connected" : "Configure API Key"}
          </button>

          {/* Model info */}
          <span className="hidden sm:inline-flex text-xs bg-forge-bg border border-forge-border text-forge-muted px-3 py-1.5 rounded-full font-medium">
            Powered by Gemini 2.5 Flash
          </span>

          {/* Settings Button */}
          <button
            onClick={onToggleSettings}
            className="p-2 rounded-lg bg-forge-bg border border-forge-border text-forge-muted hover:text-white hover:border-forge-accent hover:bg-forge-card transition-all duration-200 cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
