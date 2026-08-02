import { motion } from "framer-motion";

/**
 * ArrayBars — renders one sorting step as bars.
 * Uses Framer Motion's `layout` prop so when an element's position in
 * the array changes (a swap), it animates smoothly to its new slot
 * instead of the DOM just wiping and redrawing (the jank issue in the
 * vanilla JS version, since every drawState() call did canvas.innerHTML = '').
 */
export default function ArrayBars({ step }) {
  if (!step) {
    return (
      <p className="font-body text-xs text-ink/60">
        Press play to generate the array.
      </p>
    );
  }

  const maxVal = Math.max(...step.array, 1);

  const colorFor = (idx) => {
    if (step.swapping.includes(idx)) return "bg-swap";
    if (step.comparing.includes(idx)) return "bg-compare";
    if (step.sorted.includes(idx)) return "bg-sorted";
    return "bg-blue-300";
  };

  return (
    <div className="bg-ink/95 rounded-win p-3 border-2 border-ink">
      <div className="flex items-end justify-center gap-1.5 h-32">
        {step.array.map((val, idx) => (
          <motion.div
            key={idx}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={`w-7 rounded-t-sm border border-ink flex items-start
                        justify-center text-[10px] font-display text-ink
                        pt-0.5 ${colorFor(idx)}`}
            style={{ height: `${Math.max(12, (val / maxVal) * 100)}%` }}
          >
            {val}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
