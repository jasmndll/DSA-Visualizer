import { useState } from "react";
import {
  Rows3, Layers, ArrowRightToLine, ArrowLeftRight, Link, Link2, 
  Network, GitMerge, Share2, ArrowUpDown, Calculator, Route, 
  Package, Terminal, MessageSquare, TrendingUp, User, Brain, Database, Cpu
} from "lucide-react";
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
import DynamicProgrammingModule from "./modules/DynamicProgrammingModule";
import AuthModule from "./modules/AuthModule";
import ProgressModule from "./modules/ProgressModule";

const MODULES = [
  { id: "array", label: "Array", icon: Rows3, accent: "sand", category: "Data Structures" },
  { id: "stack", label: "Stack", icon: Layers, accent: "mint", category: "Data Structures" },
  { id: "queue", label: "Queue", icon: ArrowRightToLine, accent: "blue", category: "Data Structures" },
  { id: "deque", label: "Deque", icon: ArrowLeftRight, accent: "blue", category: "Data Structures" },
  { id: "linkedlist", label: "Linked List", icon: Link, accent: "lilac", category: "Data Structures" },
  { id: "doubly_ll", label: "Doubly LL", icon: Link2, accent: "lilac", category: "Data Structures" },
  { id: "tree", label: "Tree", icon: Network, accent: "mint", category: "Data Structures" },
  { id: "redblack", label: "Red-Black Tree", icon: GitMerge, accent: "pink", category: "Data Structures" },
  { id: "graph", label: "Graph", icon: Share2, accent: "blue", category: "Data Structures" },
  { id: "sorting", label: "Sorting", icon: ArrowUpDown, accent: "sand", category: "Algorithms" },
  { id: "array_algos", label: "Array Algos", icon: Calculator, accent: "lilac", category: "Algorithms" },
  { id: "backtracking", label: "Backtracking", icon: Route, accent: "pink", category: "Algorithms" },
  { id: "dp", label: "Dynamic Programming", icon: Package, accent: "pink", category: "Algorithms" },
  // Tools are now in the MonitorFrame top toolbar — still openable via the frame
  { id: "editor", label: "Code Editor", icon: Terminal, accent: "pink", category: "Tools" },
  { id: "chatbot", label: "Ask Chatbot", icon: MessageSquare, accent: "pink", category: "Tools" },
  { id: "progress", label: "My Progress", icon: TrendingUp, accent: "lilac", category: "Tools" },
  { id: "account", label: "Account", icon: User, accent: "pink", category: "Tools" },
  
  // Coming Soon
  { id: "ml", label: "Machine Learning", icon: Brain, accent: "sand", category: "Coming Soon", disabled: true },
  { id: "db", label: "Databases", icon: Database, accent: "sand", category: "Coming Soon", disabled: true },
  { id: "sys", label: "Systems", icon: Cpu, accent: "sand", category: "Coming Soon", disabled: true },
];

// Only show DS + Algorithms categories on the desktop grid
const DESKTOP_CATEGORIES = ["Data Structures", "Algorithms", "Coming Soon"];

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
      <div className="flex flex-col flex-1 min-h-full pb-16 relative overflow-hidden">

        {/* Desktop icon grid */}
        <div className="relative z-10 flex flex-col gap-8 p-8 max-w-4xl">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-3">
              <h2 className="font-display text-sm font-bold text-slate-700 uppercase tracking-widest pb-1 w-max">
                {category}
              </h2>
              <div className="flex flex-wrap gap-6">
                {items.map((m) => (
                  <DesktopIcon
                    key={m.id}
                    label={m.label}
                    icon={m.icon}
                    disabled={m.disabled}
                    onClick={() => openModule(m.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Open windows */}
        <div className="relative z-20 flex flex-wrap gap-6 px-8 items-start">
          {openModulesData.map((m) => {
            const isDSOrAlgo = m.category === "Data Structures" || m.category === "Algorithms";
            return (
              <RetroWindow
                key={m.id}
                title={m.label.toLowerCase() + ".exe"}
                accent={m.accent}
                moduleKey={isDSOrAlgo ? m.id : undefined}
                className={m.id === "editor" ? "w-full max-w-2xl" : "w-full sm:w-[420px]"}
                onClose={() => closeModule(m.id)}
              >
                <ModulePlaceholder id={m.id} />
              </RetroWindow>
            );
          })}
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
  if (id === "array") return <LinearModule type="array" />;
  if (id === "stack") return <LinearModule type="stack" />;
  if (id === "queue") return <LinearModule type="queue" />;
  if (id === "deque") return <LinearModule type="deque" />;
  if (id === "linkedlist") return <LinkedListModule type="singly" />;
  if (id === "doubly_ll") return <LinkedListModule type="doubly" />;
  if (id === "tree") return <TreeModule />;
  if (id === "redblack") return <RedBlackModule />;
  if (id === "graph") return <GraphModule />;
  if (id === "dp") return <DynamicProgrammingModule />;
  if (id === "progress") return <ProgressModule />;

  return (
    <div className="flex items-center justify-center p-8 bg-ink/5 rounded border border-ink/10">
      <p className="font-body text-sm text-ink/60">
        {id}.exe is currently under construction.
      </p>
    </div>
  );
}
