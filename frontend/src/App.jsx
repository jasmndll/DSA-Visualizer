import { Routes, Route } from "react-router-dom";
import Desktop from "./components/Desktop";
import ChatPage from "./pages/ChatPage";
import EditorPage from "./pages/EditorPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <div className="w-full h-full min-h-screen">
      <Routes>
        <Route path="/" element={<Desktop />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </div>
  );
}

export default App;
