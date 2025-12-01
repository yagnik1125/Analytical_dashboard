import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";

export default function AISummaryWidget({ page, filters }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [typedSummary, setTypedSummary] = useState("");

  async function generateSummary() {
    setLoading(true);
    setTypedSummary(""); // reset typing effect
    try {
      const res = await axios.post("https://analytical-dashboard-vfwl.onrender.com//api/records/page-summary", {
        page,
        filters
      });
      setSummary(res.data.aiSummary);
    } catch (err) {
      console.error(err);
      setSummary("Failed to generate summary.");
    }
    setLoading(false);
  }

  // Typing animation effect
  useEffect(() => {
    if (!summary) return;

    let i = 0;
    const interval = setInterval(() => {
      setTypedSummary(prev => prev + summary[i]);
      i++;
      if (i >= summary.length) clearInterval(interval);
    }, 10); // 10ms per character (adjust speed here)

    return () => clearInterval(interval);
  }, [summary]);

  function parseInlineMarkdown(text) {
    if (!text) return null;

    const elements = [];

    // Regex patterns
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Push preceding text
        if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
        }

        const token = match[0];

        // Bold
        if (token.startsWith("**") && token.endsWith("**")) {
        elements.push(
            <strong className="text-blue-600" key={match.index}>
            {token.slice(2, -2)}
            </strong>
        );
        }
        // Italic
        else if (token.startsWith("*") && token.endsWith("*")) {
        elements.push(
            <em className="italic" key={match.index}>
            {token.slice(1, -1)}
            </em>
        );
        }
        // Inline code
        else if (token.startsWith("`") && token.endsWith("`")) {
        elements.push(
            <code className="bg-gray-100 px-1 rounded" key={match.index}>
            {token.slice(1, -1)}
            </code>
        );
        }
        // Link
        else if (token.startsWith("[") && token.includes("](")) {
        const title = token.slice(1, token.indexOf("]("));
        const url = token.slice(token.indexOf("](") + 2, -1);
        elements.push(
            <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
            key={match.index}
            >
            {title}
            </a>
        );
        }

      lastIndex = regex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  }

  // Simple parser to split sections based on headings like ### and **
  function renderSummary(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let currentList = null;

  lines.forEach((line, idx) => {
    line = line.trim();
    if (!line) return;

    // Level 1 heading
    if (line.startsWith("# ")) {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      elements.push(
        <h1 key={idx} className="text-2xl font-bold mt-4 mb-2 border-b pb-1">
          {line.replace("# ", "")}
        </h1>
      );
    }
    // Level 2 heading
    else if (line.startsWith("## ")) {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      elements.push(
        <h2 key={idx} className="text-xl font-bold mt-4 mb-2 border-b pb-1">
          {line.replace("## ", "")}
        </h2>
      );
    }
    // Level 3 heading
    else if (line.startsWith("### ")) {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      elements.push(
        <h3 key={idx} className="text-lg font-bold mt-4 mb-2 border-b pb-1">
          {line.replace("### ", "")}
        </h3>
      );
    }
    // Numbered list
    else if (/^\d+\./.test(line)) {
      if (!currentList || currentList.type !== "ol") {
        if (currentList) elements.push(currentList);
        currentList = <ol key={idx} className="list-decimal list-inside ml-4 mb-2">{[]}</ol>;
      }
      const items = React.Children.toArray(currentList.props.children);
      items.push(<li key={idx}>{line.replace(/^\d+\.\s*/, "")}</li>);
      currentList = <ol key={idx} className="list-decimal list-inside ml-4 mb-2">{items}</ol>;
    }
    // Bullet list
    else if (line.startsWith("* ")) {
      if (!currentList || currentList.type !== "ul") {
        if (currentList) elements.push(currentList);
        currentList = <ul key={idx} className="list-disc list-inside ml-4 mb-2">{[]}</ul>;
      }
      const items = React.Children.toArray(currentList.props.children);
      items.push(<li key={idx}>{line.replace(/^\* /, "")}</li>);
      currentList = <ul key={idx} className="list-disc list-inside ml-4 mb-2">{items}</ul>;
    }
    // Paragraph
    else {
      if (currentList) {
        elements.push(currentList);
        currentList = null;
      }
      // Replace **bold** inside the line
      const parts = parseInlineMarkdown(line);

      elements.push(
        <p key={idx} className="text-sm mb-2">
          {parts}
        </p>
      );
    }
  });

  if (currentList) elements.push(currentList);
  return elements;
}

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          if (!open) {
            setOpen(true);
            generateSummary();
          } else {
            setOpen(false);
          }
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-300 border border-gray-500 text-white rounded-full shadow-xl hover:bg-blue-700 flex items-center justify-center text-3xl"
      >
        🔍
      </button>

      {/* Popup Summary Box */}
      {open && (
        <div className="fixed bottom-20 right-6 bg-white w-96 max-h-[70vh] shadow-xl rounded-lg p-4 overflow-y-auto border border-gray-200">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-semibold text-lg">AI Summary Insights</h2>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
              ❌
            </button>
          </div>

          {loading && <Loader />}
          {/* {!loading && summary && <div className="mt-3">{renderSummary(summary)}</div>} */}
          {!loading && typedSummary && (
            <div className="mt-3 whitespace-pre-wrap text-sm">
              {renderSummary(typedSummary)}
              <span className="animate-pulse">|</span> {/* blinking cursor effect */}
            </div>
          )}
        </div>
      )}
    </>
  );
}
