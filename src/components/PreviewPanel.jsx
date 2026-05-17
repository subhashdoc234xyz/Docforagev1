import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PreviewPanel({ markdown }) {
  const [view, setView] = useState("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a); // Append to body so the browser processes the download attribute properly
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url);
  };

  // Custom code renderer for markdown code blocks using Prism syntax highlighter
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-md border border-forge-border/40 my-2"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  if (!markdown) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-forge-border rounded-xl bg-forge-card/10 select-none">
        <div className="text-5xl mb-4 animate-bounce">⚒️</div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Your README Will Appear Here
        </h3>
        <p className="text-forge-muted text-sm max-w-xs mb-6">
          Describe your project or paste your code on the left, then click{" "}
          <span className="text-forge-accent font-medium hover:underline">Forge README</span> to
          generate a professional document instantly.
        </p>
        
        {/* Decorative features grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mt-2">
          {[
            "🛡️ Shields.io Badges",
            "🚀 Install Instructions",
            "📈 API Documentation",
            "🛠️ Code Highlighted Blocks",
            "🤝 Contributing Guides",
            "📄 MIT License Included"
          ].map((f) => (
            <div
              key={f}
              className="bg-forge-card border border-forge-border/70 rounded-lg p-2 text-[11px] text-forge-muted font-medium hover:border-forge-accent/40 hover:text-white transition-all duration-200"
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const linesCount = markdown.split("\n").length;
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const charCount = markdown.length;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between select-none">
        {/* Toggle between Preview and Raw */}
        <div className="flex gap-1 bg-forge-bg border border-forge-border rounded-lg p-1">
          <button
            onClick={() => setView("preview")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 ${
              view === "preview"
                ? "bg-forge-card text-white glow-blue"
                : "text-forge-muted hover:text-white"
            }`}
          >
            👁 Visual Preview
          </button>
          <button
            onClick={() => setView("raw")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 ${
              view === "raw"
                ? "bg-forge-card text-white glow-blue"
                : "text-forge-muted hover:text-white"
            }`}
          >
            {"<>"} Raw Markdown
          </button>
        </div>

        {/* Copy / Download Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 bg-forge-card border rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              copied
                ? "border-forge-green text-forge-green glow-green bg-forge-green/5"
                : "border-forge-border text-forge-muted hover:text-white hover:border-forge-blue hover:bg-forge-card/85"
            }`}
          >
            {copied ? "✅ Copied!" : "📋 Copy Raw"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-forge-accent hover:bg-orange-500 rounded-lg text-xs text-white glow transition-all duration-300 font-bold cursor-pointer"
          >
            ⬇ Download README
          </button>
        </div>
      </div>

      {/* Content Render Screen */}
      <div className="flex-1 overflow-y-auto bg-forge-bg border border-forge-border rounded-lg p-6 min-h-[300px]">
        {view === "preview" ? (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="text-xs text-forge-text font-mono whitespace-pre-wrap leading-relaxed select-all">
            {markdown}
          </pre>
        )}
      </div>

      {/* Document stats */}
      <div className="flex gap-4 text-xs text-forge-muted select-none">
        <span>📄 <strong className="text-forge-text">{linesCount}</strong> lines</span>
        <span>📝 <strong className="text-forge-text">{wordCount}</strong> words</span>
        <span>🔤 <strong className="text-forge-text">{charCount}</strong> chars</span>
        <span className="ml-auto text-forge-green font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-forge-green animate-ping" />
          Generation complete
        </span>
      </div>
    </div>
  );
}
