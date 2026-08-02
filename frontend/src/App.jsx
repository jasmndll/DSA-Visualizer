import { Routes, Route } from "react-router-dom";
import Desktop from "./components/Desktop";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div className="w-full h-full min-h-screen">
      <Routes>
        <Route path="/" element={<Desktop />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
