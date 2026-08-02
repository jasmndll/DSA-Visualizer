// Shared Tailwind CSS class combinations for the Modern UI theme

// Base focus rings for accessibility across all interactive elements
export const MODERN_FOCUS_CLASSES = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A71] focus-visible:ring-offset-2";

// Standard solid button (like START button)
export const MODERN_START_BTN_CLASSES = `bg-[#1F7A71] text-white font-display font-medium px-8 py-1.5 rounded-full shadow-sm hover:bg-teal-700 transition-colors active:scale-95 ${MODERN_FOCUS_CLASSES}`;

// Top toolbar tools (pill buttons)
export const MODERN_TOOLBAR_BTN_CLASSES = `group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3E4C5A] bg-[#E5E9EC] text-slate-800 shadow-sm hover:bg-white transition-colors active:scale-95 ${MODERN_FOCUS_CLASSES}`;

// Window/tab items (Taskbar open windows)
export const MODERN_TAB_CLASSES = `h-full px-4 flex items-center bg-white border border-gray-200 font-display text-sm font-medium text-slate-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors ${MODERN_FOCUS_CLASSES}`;

// Topic Cards (DesktopIcon container)
export const MODERN_CARD_CLASSES = `relative flex flex-col items-center justify-center gap-2 group w-24 h-24 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer ${MODERN_FOCUS_CLASSES}`;

// Inside Topic Card: The label text
export const MODERN_CARD_LABEL_CLASSES = "font-display text-[11px] text-slate-700 font-medium leading-tight px-1 transition-colors";
