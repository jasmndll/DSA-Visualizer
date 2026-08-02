import { MODERN_CARD_CLASSES, MODERN_CARD_LABEL_CLASSES } from "../utils/design-tokens";

export default function DesktopIcon({ label, icon: Icon, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${MODERN_CARD_CLASSES} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {Icon && <Icon size={32} strokeWidth={2} className="text-slate-800" />}
      <span className={MODERN_CARD_LABEL_CLASSES}>
        {label}
      </span>
      {disabled && (
        <span className="font-display text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full absolute -bottom-3 shadow-sm border border-gray-200">
          SOON
        </span>
      )}
    </button>
  );
}
