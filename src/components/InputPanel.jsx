import React, { useState } from "react";

export default function InputPanel({ onGenerate, isLoading }) {
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState("description");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onGenerate(input, inputType);
  };

  const templates = {
    taskflow: {
      name: "📋 React TaskFlow",
      type: "description",
      content: `Project Name: TaskFlow
Description: A lightweight task management web app for developers and small teams.
Tech Stack: React, Node.js, Express, MongoDB, TailwindCSS, Framer Motion
Features: Kanban board, drag-and-drop tasks, team collaboration, dark mode, REST API, JWT auth
Target Users: Developers and small startup teams`
    },
    pycli: {
      name: "🐍 Python DataCLI",
      type: "code",
      content: `import sys
import pandas as pd

def parse_args():
    print("Parsing CLI arguments...")
    # Mock CLI processor for parsing CSV data
    return {"file": "dataset.csv", "operation": "summary"}

def main():
    """
    DataCLI: A simple command line interface for analyzing CSV files.
    Allows developers to fetch summary stats, filter rows, and output to JSON.
    """
    args = parse_args()
    print(f"DataCLI Initialized. Loading {args['file']}...")
    # Perform summary analytics

if __name__ == "__main__":
    main()`
    },
    portfolio: {
      name: "💼 Developer Portfolio",
      type: "description",
      content: `Project Name: DevCanvas Portfolio
Description: A modern, animated developer portfolio template that showcases repos, blogs, and skill radars.
Tech Stack: Next.js, TailwindCSS, Three.js, Resend (for contact forms)
Features: Live Github API integration, dark mode, 3D interactive model rendering, blog posts list
Target Users: Software engineers looking for a premium resume website`
    }
  };

  const applyTemplate = (key) => {
    const template = templates[key];
    setInputType(template.type);
    setInput(template.content);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Input Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputType("description")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${
            inputType === "description"
              ? "bg-forge-accent text-white glow hover:bg-orange-500"
              : "bg-forge-card border border-forge-border text-forge-muted hover:text-white hover:bg-forge-card/60"
          }`}
        >
          📝 Describe Project
        </button>
        <button
          onClick={() => setInputType("code")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${
            inputType === "code"
              ? "bg-forge-accent text-white glow hover:bg-orange-500"
              : "bg-forge-card border border-forge-border text-forge-muted hover:text-white hover:bg-forge-card/60"
          }`}
        >
          {"</>"} Paste Code
        </button>
      </div>

      {/* Templates / Examples Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-forge-card/35 border border-forge-border/60 rounded-lg p-2">
        <span className="text-[10px] text-forge-muted uppercase tracking-wider font-semibold mr-1 pl-1">
          Quick Templates:
        </span>
        {Object.entries(templates).map(([key, t]) => (
          <button
            key={key}
            onClick={() => applyTemplate(key)}
            className="text-xs bg-forge-bg border border-forge-border text-forge-muted hover:text-white hover:border-forge-accent hover:bg-forge-card px-2.5 py-1 rounded transition-all duration-150 cursor-pointer"
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Textarea Input */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        <label className="text-xs text-forge-muted mb-2 font-semibold uppercase tracking-wider select-none">
          {inputType === "description"
            ? "Describe your project (name, features, tech stack, purpose)"
            : "Paste your source code files or snippets"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            inputType === "description"
              ? "Example:\nProject Name: TaskFlow\nDescription: A lightweight task management web app..."
              : "// Paste your main files here...\n// e.g. main.py, index.js, App.jsx"
          }
          className="flex-1 w-full bg-forge-bg border border-forge-border rounded-lg p-4 text-forge-text text-sm font-mono resize-none focus:outline-none focus:border-forge-accent focus:ring-1 focus:ring-forge-accent/20 transition-all placeholder-forge-muted/70 leading-relaxed"
        />
      </div>

      {/* Count Stats & Clear button */}
      <div className="flex justify-between items-center text-xs text-forge-muted select-none">
        <div className="flex gap-4">
          <span>🔤 <strong className="text-forge-text">{input.length}</strong> chars</span>
          <span>📝 <strong className="text-forge-text">{input.split(/\s+/).filter(Boolean).length}</strong> words</span>
        </div>
        {input.trim() && (
          <button
            onClick={() => setInput("")}
            className="text-[11px] hover:text-forge-accent hover:underline cursor-pointer transition-colors duration-150"
          >
            Clear Input
          </button>
        )}
      </div>

      {/* Forge Trigger Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !input.trim()}
        className={`w-full py-3.5 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer select-none flex items-center justify-center gap-2 ${
          isLoading || !input.trim()
            ? "bg-forge-border text-forge-muted cursor-not-allowed border border-forge-border/40"
            : "bg-forge-accent hover:bg-orange-500 text-white glow hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="animate-pulse">Forging your README...</span>
          </>
        ) : (
          <>
            <span className="animate-sparkle">⚒</span> Forge README
          </>
        )}
      </button>

      {/* Guide Cards */}
      <div className="bg-forge-card/45 border border-forge-border rounded-lg p-3 select-none">
        <p className="text-xs text-white font-semibold mb-2 flex items-center gap-1.5">
          💡 Tips for Best Results:
        </p>
        <ul className="text-[11px] text-forge-muted space-y-1.5 list-disc pl-3">
          <li>Specify a clear <strong className="text-forge-text">Project Name</strong> and core utility.</li>
          <li>List <strong className="text-forge-text">3–6 features</strong> and libraries/technologies.</li>
          <li>For code inputs, include comments explaining complex logic.</li>
        </ul>
      </div>
    </div>
  );
}
