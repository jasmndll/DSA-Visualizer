import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Desktop from "./components/Desktop";
import ChatPage from "./pages/ChatPage";
import EditorPage from "./pages/EditorPage";
import AccountPage from "./pages/AccountPage";
import ProgressPage from "./pages/ProgressPage";

function App() {
  // Global click sound for all clicks
  useEffect(() => {
    const handleClick = () => {
      import('./utils/sound').then(({ playGenericClick }) => playGenericClick());
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="w-full h-full min-h-screen">
      <Routes>
        <Route path="/" element={<Desktop />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
      
      {/* CRT Scanline Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 6px 100%"
        }}
      />
    </div>
  );
}

export default App;
