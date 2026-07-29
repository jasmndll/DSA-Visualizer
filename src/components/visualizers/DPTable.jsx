export default function DPTable({ step, items }) {
  if (!step || !step.dp) return null;

  const dp = step.dp;
  const numRows = dp.length;
  const numCols = dp[0].length;

  return (
    <div className="flex flex-col overflow-auto max-h-[400px]">
      <table className="border-collapse font-body text-xs text-center w-full">
        <thead>
          <tr>
            <th className="p-2 border border-ink/20 sticky top-0 bg-white z-10 text-ink/60">
              Item \ Cap
            </th>
            {Array.from({ length: numCols }).map((_, w) => (
              <th key={w} className="p-2 border border-ink/20 sticky top-0 bg-white z-10 text-ink/60 font-semibold w-10">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <td className="p-2 border border-ink/20 font-semibold bg-ink/5 sticky left-0 z-10 whitespace-nowrap">
                {i === 0 ? "0 (Base)" : `Item ${i} (W:${items[i - 1].weight}, V:${items[i - 1].value})`}
              </td>
              {row.map((cellValue, w) => {
                const isCurrent = step.i === i && step.w === w;
                const isComparing = step.comparing?.some(
                  ([compI, compW]) => compI === i && compW === w
                );

                let bgClass = "bg-white";
                let textClass = "text-ink";

                if (isCurrent) {
                  bgClass = "bg-pink-300";
                  textClass = "text-ink font-bold";
                } else if (isComparing) {
                  bgClass = "bg-lilac-300";
                  textClass = "text-ink font-bold";
                } else if (cellValue !== null) {
                  bgClass = "bg-mint-100";
                }

                return (
                  <td
                    key={w}
                    className={`p-2 border border-ink/20 transition-colors duration-300 ${bgClass} ${textClass}`}
                  >
                    {cellValue !== null ? cellValue : "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
