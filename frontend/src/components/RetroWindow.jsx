import { useState } from "react";
import apiClient from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function RetroWindow({ title, accent, className = "", bodyClassName = "", moduleKey, onClose, children }) {
  const { isAuthenticated } = useAuthStore();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineMessage, setInlineMessage] = useState("");
  // Map accent to background color
  const accentColors = {
    sand: "bg-sand-200",
    mint: "bg-mint-200",
    blue: "bg-blue-300",
    lilac: "bg-lilac-400",
    pink: "bg-pink-300"
  };

  const headerBg = accentColors[accent] || "bg-ink";
  const headerText = accent === "ink" ? "text-white" : "text-ink";

  const handleComplete = async () => {
    if (!isAuthenticated) {
      setInlineMessage("log in to save progress");
      return;
    }

    setLoading(true);
    setInlineMessage("");
    try {
      await apiClient.put(`/progress/${moduleKey}?status=COMPLETED`);
      setCompleted(true);
    } catch (err) {
      setInlineMessage("failed to save progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-paper border-2 border-ink rounded-win shadow-winSm ${className}`}>
      {/* Window Title Bar */}
      <div className={`flex items-center justify-between px-2 py-1 border-b-2 border-ink ${headerBg} ${headerText}`}>
        <div className="font-display text-[12px] font-bold tracking-wide">
          {title}
        </div>
        <button
          onClick={onClose}
          className="retro-btn w-5 h-5 flex items-center justify-center bg-paper border-2 border-ink shadow-winSm text-[10px] font-bold hover:bg-white"
          aria-label="Close"
        >
          X
        </button>
      </div>
      {/* Window Content */}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
        
        {moduleKey && (
          <div className="mt-6 flex items-center gap-3 border-t-2 border-ink/10 pt-4">
            <button
              onClick={handleComplete}
              disabled={completed || loading}
              className={`retro-btn px-3 py-1 font-display text-[12px] font-bold border-2 border-ink rounded-win shadow-winSm transition-colors ${
                completed
                  ? "bg-mint-400 text-ink opacity-80 cursor-not-allowed"
                  : "bg-mint-200 hover:bg-mint-100 text-ink"
              }`}
            >
              {completed ? "✓ completed" : loading ? "saving..." : "mark complete"}
            </button>
            
            {inlineMessage && (
              <span className="font-body text-[10px] text-pink-400 bg-pink-100 border border-pink-300 px-2 py-1 rounded">
                {inlineMessage}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
