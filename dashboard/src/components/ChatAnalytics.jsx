import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatAnalytics({ page, filters }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);     // Chat history
  const [typedMessages, setTypedMessages] = useState([]);     // rendered text
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [typedMessages]);

  // Typewriter: populates an assistant message one char at a time
  function typeAssistantMessage(fullText, speed = 18) {
    let msgIndex = null;

    // Step 1: Add empty assistant message and capture correct index
    setTypedMessages(prev => {
      msgIndex = prev.length;       // <-- THIS is correct index
      return [...prev, { role: "assistant", content: "" }];
    });

    // Step 2: Start typing after React applies the state update
    setTimeout(() => {
      let i = 0;

      const interval = setInterval(() => {
        i++;

        setTypedMessages(prev => {
          if (!prev[msgIndex]) { 
            clearInterval(interval);
            return prev;
          }

          const updated = [...prev];
          updated[msgIndex] = {
            role: "assistant",
            content: fullText.slice(0, i)
          };

          return updated;
        });

        if (i >= fullText.length) clearInterval(interval);
      }, speed);
    }, 0);
  }

  function parseInlineMarkdown(text) {
    if (!text) return null;

    const elements = [];
    const regex =
      /\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`|\[([^\]]+)\]\(([^)]+)\)/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      // Bold (**text**)
      if (match[1]) {
        elements.push(
          <strong className="text-blue-600" key={match.index}>
            {match[1]}
          </strong>
        );
      }
      // Italic (*text*)
      else if (match[2]) {
        elements.push(
          <em className="italic" key={match.index}>
            {match[2]}
          </em>
        );
      }
      // Inline code (`code`)
      else if (match[3]) {
        elements.push(
          <code className="bg-gray-100 px-1 rounded" key={match.index}>
            {match[3]}
          </code>
        );
      }
      // Link [title](url)
      else if (match[4] && match[5]) {
        elements.push(
          <a
            key={match.index}
            href={match[5]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {match[4]}
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) elements.push(text.slice(lastIndex));

    return elements;
  }

  
  // Simple parser to split sections based on headings like ### and **
  function renderSummary(text) {
    if (!text) return null;

    const lines = text.split("\n");
    const elements = [];
    let currentList = null;

    const flushList = () => {
      if (currentList) {
        elements.push(currentList.element);
        currentList = null;
      }
    };

    lines.forEach((line, idx) => {
      line = line.trim();
      if (!line) return;

      // Headings
      if (line.startsWith("#")) {
        flushList();

        const level = line.match(/^#+/)[0].length;
        const content = line.replace(/^#+\s*/, "");
        const parts = parseInlineMarkdown(content);

        const H = `h${Math.min(level, 3)}`;

        elements.push(
          <H
            key={idx}
            className="font-bold mt-4 mb-2 border-b pb-1"
            style={{ fontSize: level === 1 ? "1.6rem" : level === 2 ? "1.3rem" : "1.1rem" }}
          >
            {parts}
          </H>
        );
        return;
      }

      // Numbered list
      if (/^\d+\./.test(line)) {
        const textContent = line.replace(/^\d+\.\s*/, "");
        const parsed = parseInlineMarkdown(textContent);

        if (!currentList || currentList.type !== "ol") {
          flushList();
          currentList = {
            type: "ol",
            element: <ol key={idx} className="list-decimal list-inside ml-4 mb-2"></ol>,
            items: []
          };
        }

        currentList.items.push(<li key={idx}>{parsed}</li>);
        currentList.element = (
          <ol key={idx} className="list-decimal list-inside ml-4 mb-2">
            {currentList.items}
          </ol>
        );
        return;
      }

      // Bullet list
      if (line.startsWith("* ")) {
        const textContent = line.replace(/^\* /, "");
        const parsed = parseInlineMarkdown(textContent);

        if (!currentList || currentList.type !== "ul") {
          flushList();
          currentList = {
            type: "ul",
            element: <ul key={idx} className="list-disc list-inside ml-4 mb-2"></ul>,
            items: []
          };
        }

        currentList.items.push(<li key={idx}>{parsed}</li>);
        currentList.element = (
          <ul key={idx} className="list-disc list-inside ml-4 mb-2">
            {currentList.items}
          </ul>
        );
        return;
      }

      // Paragraph
      flushList();

      const parsed = parseInlineMarkdown(line);

      elements.push(
        <p key={idx} className="text-sm mb-2">
          {parsed}
        </p>
      );
    });

    flushList();
    return elements;
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, newMessage]);
    setTypedMessages((prev) => [...prev, newMessage]);

    const historyForAPI = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://analytical-dashboard-vfwl.onrender.com/api/records/chat-analytics",
        {
          message: newMessage.content,
          filters,
          page,
          history: historyForAPI
        }
      );

      const reply = res.data.reply || "I could not generate a response.";
      const assistantRawReply = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantRawReply]);
      // const renderedReply = renderSummary(reply);
      // const assistantRenderedReply = { role: "assistant", content: renderedReply };
      // setTypedMessages((prev) => [...prev, assistantRenderedReply]);
      
      // show typing animation for assistant reply
      typeAssistantMessage(reply, 14); // speed in ms per char

    //   setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error fetching analytics." }
      ]);
    }

    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 bg-purple-500 text-white w-14 h-14 rounded-full shadow-lg text-3xl border border-gray-500 flex justify-center items-center z-60 hover:bg-purple-600"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-0 left-0 m-4 bg-white w-[90vw] max-w-md h-[70vh] 
                        shadow-xl rounded-lg flex flex-col border z-60
                        md:w-[65vw] md:max-w-md">

          {/* Header */}
          <div className="px-4 py-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Analytics Chatbot</h2>
            <button onClick={() => setOpen(false)} className="text-gray-600 text-xl">❌</button>
          </div>

          {/* Chat Area */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 max-h-full"
          >
            {typedMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-purple-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <span>
                  {msg.role === "assistant"
                    ? renderSummary(msg.content)  // convert only at render time
                    : msg.content}
                </span>
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 italic"><span className="animate-pulse">Analyzing dataset…</span></div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t flex gap-2 bg-white sticky bottom-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask ..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 px-4 text-white text-2xl rounded-lg hover:bg-purple-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
