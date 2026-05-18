import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import PreviewPanel from "./components/PreviewPanel";
import Footer from "./components/Footer";
import { generateREADME } from "./utils/gemini";

export default function App() {
  // --- States ---
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // API Key States
  const [customKey, setCustomKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState(false);
  
  // History States
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // --- Effects ---
  // Load API Key and History from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("docforge_custom_api_key") || "";
    setCustomKey(savedKey);

    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const hasEnvKey = envKey && envKey !== "your_gemini_api_key_here";
    
    setIsKeyConfigured(!!savedKey.trim() || !!hasEnvKey);

    // Load History
    const savedHistory = localStorage.getItem("docforge_readme_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse README history", e);
      }
    }
  }, []);

  // Save API Key changes
  const handleSaveKey = (key) => {
    const trimmedKey = key.trim();
    setCustomKey(trimmedKey);
    
    if (trimmedKey) {
      localStorage.setItem("docforge_custom_api_key", trimmedKey);
    } else {
      localStorage.removeItem("docforge_custom_api_key");
    }

    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const hasEnvKey = envKey && envKey !== "your_gemini_api_key_here";
    setIsKeyConfigured(!!trimmedKey || !!hasEnvKey);
    setShowSettings(false);
  };

  // Clear Saved API Key
  const handleClearKey = () => {
    setCustomKey("");
    localStorage.removeItem("docforge_custom_api_key");
    
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const hasEnvKey = envKey && envKey !== "your_gemini_api_key_here";
    setIsKeyConfigured(!!hasEnvKey);
  };

  // --- Generation Logic ---
  const handleGenerate = async (input, inputType) => {
    setIsLoading(true);
    setError("");
    setMarkdown("");
    
    // Resolve dynamic custom key
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const hasEnvKey = envKey && envKey !== "your_gemini_api_key_here";
    
    if (!customKey.trim() && !hasEnvKey) {
      setError("API_KEY_MISSING");
      setShowSettings(true);
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateREADME(input, inputType, customKey);
      setMarkdown(result);

      // Extract a plausible title from input
      let parsedTitle = "Untitled Project";
      const nameMatch = input.match(/(?:Project Name|Name):\s*([^\n]+)/i);
      if (nameMatch && nameMatch[1]) {
        parsedTitle = nameMatch[1].trim();
      } else {
        const firstLine = input.split("\n")[0].replace(/[#\/\/*-]/g, "").trim();
        if (firstLine.length > 0 && firstLine.length < 35) {
          parsedTitle = firstLine;
        }
      }

      // Add to History
      const newHistoryItem = {
        id: Date.now().toString(),
        title: parsedTitle,
        markdown: result,
        timestamp: new Date().toLocaleString(),
        inputType: inputType
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem("docforge_readme_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error(err);
      if (err.message === "API_KEY_MISSING") {
        setError("API Key is missing. Please set it up in the configuration settings.");
        setShowSettings(true);
      } else {
        setError(
          "Failed to connect to the AI engine. Please check if your API key is correct, verify your internet connection, or try again in a minute."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- History Actions ---
  const handleSelectHistory = (item) => {
    setMarkdown(item.markdown);
  };

  const handleDeleteHistory = (id, e) => {
    e.stopPropagation(); // Avoid selecting it when deleting
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("docforge_readme_history", JSON.stringify(updatedHistory));
    
    // Clear preview if deleted item was open
    const deletedItem = history.find((item) => item.id === id);
    if (deletedItem && markdown === deletedItem.markdown) {
      setMarkdown("");
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("docforge_readme_history");
    setMarkdown("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-forge-bg text-forge-text font-sans transition-all duration-300">
      {/* Header component */}
      <Header
        onToggleSettings={() => setShowSettings(!showSettings)}
        isKeyConfigured={isKeyConfigured}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-6">
        
        {/* Dynamic Settings Backdrop Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-[#070a0e]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel rounded-xl p-6 shadow-2xl relative animate-forge-glow">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-forge-muted hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                ⚙️ API Configuration Settings
              </h3>
              <p className="text-xs text-forge-muted mb-4 leading-relaxed">
                Provide your API Key to enable the README forging engine. Your key is saved locally in your own browser's <strong className="text-forge-text">localStorage</strong>.
              </p>

              {/* Status Indicators */}
              <div className="mb-4 p-3 bg-forge-bg/60 border border-forge-border rounded-lg text-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-forge-muted">Vite Env Secret (.env):</span>
                  {import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== "your_gemini_api_key_here" ? (
                    <span className="text-forge-green font-semibold">Configured</span>
                  ) : (
                    <span className="text-forge-muted">Not Found</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forge-muted">Local Storage Cache:</span>
                  {customKey ? (
                    <span className="text-forge-green font-semibold">Configured</span>
                  ) : (
                    <span className="text-forge-muted">Empty</span>
                  )}
                </div>
              </div>

              {/* Input for key */}
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-xs text-forge-muted font-bold uppercase tracking-wider">
                  API Key
                </label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm text-forge-text font-mono focus:outline-none focus:border-forge-accent transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end text-xs">
                {customKey && (
                  <button
                    onClick={handleClearKey}
                    className="px-4 py-2 border border-forge-border text-forge-muted hover:text-forge-accent rounded-lg cursor-pointer transition-colors"
                  >
                    Clear Cached Key
                  </button>
                )}
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-forge-border text-forge-muted hover:text-white rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveKey(customKey)}
                  className="px-4 py-2 bg-forge-accent hover:bg-orange-500 text-white font-bold rounded-lg cursor-pointer glow transition-colors"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mt-2 mb-2 select-none">
          <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight tracking-tight sm:text-4xl">
            Forge a <span className="text-forge-accent bg-clip-text">Professional README</span> in Seconds
          </h2>
        </div>

        {/* Action Controls for Workspace (History Toggle) */}
        <div className="flex justify-between items-center bg-forge-card/45 border border-forge-border/60 rounded-xl px-4 py-2 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all duration-300 cursor-pointer ${
                showHistory
                  ? "bg-forge-blue/10 border-forge-blue/30 text-forge-blue glow-blue"
                  : "bg-forge-bg border-forge-border text-forge-muted hover:text-white hover:border-forge-muted"
              }`}
            >
              📜 {showHistory ? "Hide History Sidebar" : `Show History (${history.length})`}
            </button>
          </div>
          <div className="text-xs text-forge-muted">
            Status: <span className={isKeyConfigured ? "text-forge-green font-medium" : "text-forge-accent font-medium animate-pulse"}>
              {isKeyConfigured ? "● Ready to Forge" : "● API Key Needed"}
            </span>
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex gap-3 items-start relative animate-pulse shadow-lg">
            <div className="text-lg">⚠️</div>
            <div className="flex-1">
              <strong className="font-bold block mb-0.5">Forging Interrupted</strong>
              <p className="leading-relaxed text-xs">{error}</p>
              {error === "API_KEY_MISSING" && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="mt-2 text-xs font-bold text-forge-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Configure API Key Now →
                </button>
              )}
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-400/50 hover:text-red-400 text-xs cursor-pointer absolute top-3 right-3"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px] relative">
          
          {/* History Sidebar Panel */}
          {showHistory && (
            <div className="lg:col-span-3 bg-forge-card border border-forge-border rounded-xl p-4 flex flex-col h-[550px] lg:h-auto animate-fade-in z-10">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-forge-border select-none">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>📜</span> Past Forges
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] text-forge-accent/80 hover:text-forge-accent hover:underline cursor-pointer font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Sidebar list items */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 select-none">
                    <span className="text-3xl opacity-20 mb-2">📭</span>
                    <p className="text-[11px] text-forge-muted leading-relaxed">
                      No document history yet. Successful readmes will show up here.
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className={`group p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-200 hover:border-forge-blue/50 hover:bg-forge-bg ${
                        markdown === item.markdown
                          ? "bg-forge-bg border-forge-accent/40"
                          : "bg-forge-bg/40 border-forge-border/60"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <strong className="text-xs text-white font-semibold truncate flex-1 block">
                          {item.title}
                        </strong>
                        <button
                          onClick={(e) => handleDeleteHistory(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-[10px] text-forge-muted hover:text-forge-accent cursor-pointer transition-opacity p-0.5"
                          title="Delete from history"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="text-[10px] text-forge-muted block mt-1">
                        {item.timestamp.split(",")[0]} · {item.inputType === "code" ? "Code" : "Desc"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Input Panel Column */}
          <div className={`${showHistory ? "lg:col-span-4" : "lg:col-span-6"} bg-forge-card border border-forge-border rounded-xl p-5 flex flex-col h-[550px] lg:h-auto`}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 select-none border-b border-forge-border/40 pb-2">
              <span className="w-5 h-5 rounded bg-forge-accent/25 text-forge-accent flex items-center justify-center text-xs font-bold shadow-inner">
                1
              </span>
              Your Project Input
            </h3>
            <div className="flex-1 overflow-y-auto">
              <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
          </div>

          {/* Generated Preview Column */}
          <div className={`${showHistory ? "lg:col-span-5" : "lg:col-span-6"} bg-forge-card border border-forge-border rounded-xl p-5 flex flex-col h-[550px] lg:h-auto`}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 select-none border-b border-forge-border/40 pb-2">
              <span className="w-5 h-5 rounded bg-forge-green/25 text-forge-green flex items-center justify-center text-xs font-bold shadow-inner">
                2
              </span>
              Forged README Document
            </h3>
            <div className="flex-1 overflow-y-auto">
              <PreviewPanel markdown={markdown} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
