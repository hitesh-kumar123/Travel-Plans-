import React, { useState } from "react";

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <pre className="code-block">
        <code>{code}</code>
      </pre>

      <button
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        className="copy-button"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Screen reader feedback */}
      <div aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </div>
    </div>
  );
};

export default CodeBlock;
