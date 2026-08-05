import { Link, useNavigate } from "react-router-dom";
import MonitorFrame from "../components/MonitorFrame";
import CodeEditorModule from "../components/modules/CodeEditorModule";
import RetroWindow from "../components/RetroWindow";

export default function EditorPage() {
  const navigate = useNavigate();

  return (
    <MonitorFrame onOpenTool={(id) => {
      // If a user clicks a different tool from the toolbar, navigate back to desktop
      navigate("/");
    }}>
      <div className="flex flex-col h-full p-8 relative z-10 w-full max-w-4xl mx-auto">
        <div className="mb-4">
          <Link to="/" className="retro-btn inline-block font-display text-[11px] px-3 py-1.5 bg-paper border-2 border-ink rounded-win shadow-winSm hover:bg-white text-slate-800">
            &larr; Back to Desktop
          </Link>
        </div>
        <RetroWindow
          title="editor.exe"
          accent="pink"
          className="flex-1 w-full flex flex-col"
          bodyClassName="flex flex-col flex-1 min-h-0 overflow-y-auto"
          onClose={() => navigate("/")}
        >
          <CodeEditorModule />
        </RetroWindow>
      </div>
    </MonitorFrame>
  );
}
