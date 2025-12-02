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
