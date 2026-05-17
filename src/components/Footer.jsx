import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-forge-border bg-forge-card/50 backdrop-blur px-6 py-4 mt-auto select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Author details */}
        <div className="text-center sm:text-left">
          <p className="text-xs text-forge-muted font-medium">
            Built with ❤️ by{" "}
            <span className="text-forge-accent font-semibold hover:underline">
              Subhash B, Anandhavel K, Suresh K, Sanjai
            </span>
          </p>
          <p className="text-[10px] text-forge-muted/70 mt-0.5">
            Team AI/ML Track · OSC AI Build 1.0
          </p>
        </div>

        {/* Brand slogan & model credits */}
        <div className="flex flex-col items-center sm:items-end gap-1">
          <p className="text-xs text-forge-muted font-medium">
            Powered by{" "}
            <span className="text-forge-blue font-semibold hover:underline">
              Google Gemini 2.5 Flash
            </span>
          </p>
          <span className="text-[10px] text-forge-muted/70 italic">
            "Stop writing. Start forging."
          </span>
        </div>
      </div>
    </footer>
  );
}
