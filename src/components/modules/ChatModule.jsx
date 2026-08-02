import { useState, useRef, useEffect } from "react";
import apiClient from "../../api/client";
import ReactMarkdown from "react-markdown";

export default function ChatModule() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "hello! how can i help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await apiClient.post("/chat", {
        message: userMsg,
        moduleContext: null,
      });
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "error: failed to send message." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 min-h-[300px]">
      <div className="flex-1 overflow-y-auto p-3 space-y-3 border-2 border-ink rounded-win bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 border-2 border-ink rounded-win shadow-winSm font-body text-[12px] ${
                msg.role === "user"
                  ? "bg-mint-200"
                  : msg.role === "error"
                  ? "bg-pink-200"
                  : "bg-lilac-400"
              }`}
            >
              {msg.role === "bot" ? (
                <ReactMarkdown
                  components={{
                    code: ({ inline, children }) =>
                      inline
                        ? <code className="bg-ink/10 px-1 rounded-sm font-body text-[11px]">{children}</code>
                        : <pre className="bg-ink text-mint-200 font-body text-[11px] p-2 rounded-win overflow-x-auto my-1"><code>{children}</code></pre>,
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 border-2 border-ink rounded-win shadow-winSm font-body text-[12px] bg-lilac-400">
              ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 w-full font-body text-[12px] px-2 py-1.5 border-2 border-ink rounded-win bg-white"
          placeholder="type a message..."
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="retro-btn font-display text-[11px] px-3 py-1.5 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300 disabled:opacity-50 whitespace-nowrap"
        >
          send
        </button>
      </form>
    </div>
  );
}
