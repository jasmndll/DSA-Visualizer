import { useState } from "react";
import DesktopIcon from "./DesktopIcon";
import RetroWindow from "./RetroWindow";
import Taskbar from "./Taskbar";
import MonitorFrame from "./MonitorFrame";
import SortingModule from "./modules/SortingModule";
import ArrayAlgorithmsModule from "./modules/ArrayAlgorithmsModule";
import BacktrackingModule from "./modules/BacktrackingModule";
import CodeEditorModule from "./modules/CodeEditorModule";
import LinearModule from "./modules/LinearModule";
import LinkedListModule from "./modules/LinkedListModule";
import TreeModule from "./modules/TreeModule";
import RedBlackModule from "./modules/RedBlackModule";
import GraphModule from "./modules/GraphModule";

const MODULES = [
  { id: "array", label: "Array", glyph: "🗂️", accent: "sand", category: "Data Structures" },
  { id: "stack", label: "Stack", glyph: "📚", accent: "mint", category: "Data Structures" },
  { id: "queue", label: "Queue", glyph: "🎟️", accent: "blue", category: "Data Structures" },
  { id: "deque", label: "Deque", glyph: "🎫", accent: "blue", category: "Data Structures" },
  { id: "linkedlist", label: "Linked List", glyph: "🔗", accent: "lilac", category: "Data Structures" },
  { id: "doubly_ll", label: "Doubly LL", glyph: "⛓️", accent: "lilac", category: "Data Structures" },
  { id: "tree", label: "Tree", glyph: "🌳", accent: "mint", category: "Data Structures" },
  { id: "redblack", label: "Red-Black Tree", glyph: "🔴", accent: "pink", category: "Data Structures" },
  { id: "graph", label: "Graph", glyph: "🕸️", accent: "blue", category: "Data Structures" },
  { id: "sorting", label: "Sorting", glyph: "🔀", accent: "sand", category: "Algorithms" },
  { id: "array_algos", label: "Array Algos", glyph: "🧮", accent: "lilac", category: "Algorithms" },
  { id: "backtracking", label: "Backtracking", glyph: "🔙", accent: "pink", category: "Algorithms" },
  // Tools are now in the MonitorFrame top toolbar — still openable via the frame
  { id: "editor", label: "Code Editor", glyph: "💻", accent: "pink", category: "Tools" },
  { id: "chatbot", label: "Ask Chatbot", glyph: "💬", accent: "pink", category: "Tools" },
  { id: "progress", label: "My Progress", glyph: "📈", accent: "lilac", category: "Tools" },
];

// Only show DS + Algorithms categories on the desktop grid
const DESKTOP_CATEGORIES = ["Data Structures", "Algorithms"];

export default function Desktop() {
  const [openIds, setOpenIds] = useState(["sorting"]);

  const openModule = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const closeModule = (id) =>
    setOpenIds((prev) => prev.filter((m) => m !== id));

  const openModulesData = MODULES.filter((m) => openIds.includes(m.id));

  // Group modules by category for desktop grid
  const categories = MODULES.reduce((acc, module) => {
    if (!DESKTOP_CATEGORIES.includes(module.category)) return acc;
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return (
    <MonitorFrame onOpenTool={openModule}>
      <div className="min-h-full pb-16 relative overflow-hidden">

        {/* Desktop icon grid */}
        <div className="relative z-10 flex flex-col gap-8 p-8 max-w-4xl">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-3">
              <h2 className="font-display text-sm font-bold text-ink/70 uppercase tracking-widest border-b-2 border-ink/20 pb-1 w-max">
                {category}
              </h2>
              <div className="flex flex-wrap gap-6">
                {items.map((m) => (
                  <DesktopIcon
                    key={m.id}
                    label={m.label}
                    glyph={m.glyph}
                    onClick={() => openModule(m.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Open windows */}
        <div className="relative z-20 flex flex-wrap gap-6 px-8 items-start">
          {openModulesData.map((m) => (
            <RetroWindow
              key={m.id}
              title={m.label.toLowerCase() + ".exe"}
              accent={m.accent}
              className={m.id === "editor" ? "w-full max-w-2xl" : "w-full sm:w-[420px]"}
              onClose={() => closeModule(m.id)}
            >
              <ModulePlaceholder id={m.id} />
            </RetroWindow>
          ))}
        </div>

        <Taskbar
          openWindows={openModulesData.map((m) => m.label)}
          xp={240}
          level={3}
        />
      </div>
    </MonitorFrame>
  );
}

// Placeholder dispatcher
function ModulePlaceholder({ id }) {
  if (id === "sorting") return <SortingModule />;
  if (id === "array_algos") return <ArrayAlgorithmsModule />;
  if (id === "backtracking") return <BacktrackingModule />;
  if (id === "editor") return <CodeEditorModule />;
  if (id === "array") return <LinearModule type="array" />;
  if (id === "stack") return <LinearModule type="stack" />;
  if (id === "queue") return <LinearModule type="queue" />;
  if (id === "deque") return <LinearModule type="deque" />;
  if (id === "linkedlist") return <LinkedListModule type="singly" />;
  if (id === "doubly_ll") return <LinkedListModule type="doubly" />;
  if (id === "tree") return <TreeModule />;
  if (id === "redblack") return <RedBlackModule />;
  if (id === "graph") return <GraphModule />;

  return (
    <div className="flex items-center justify-center p-8 bg-ink/5 rounded border border-ink/10">
      <p className="font-body text-sm text-ink/60">
        {id}.exe is currently under construction.
      </p>
    </div>
  );
}
