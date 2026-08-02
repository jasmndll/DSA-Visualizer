import { useState, useEffect } from "react";
import apiClient from "../api/client";
import { useAuthStore } from "../store/authStore";
import { format, subDays, startOfWeek } from "date-fns";

export default function ProgressHeatmap() {
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/progress/heatmap");
        if (mounted) setData(res.data);
      } catch (err) {
        // silently fail or console error
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHeatmap();
    return () => { mounted = false; };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-4 border-2 border-ink rounded-win bg-white shadow-winSm text-center">
        <p className="font-body text-[12px]">log in to see your activity</p>
      </div>
    );
  }

  // Generate 14 weeks of days (98 days)
  const WEEKS = 14;
  const endDate = new Date();
  const startDate = startOfWeek(subDays(endDate, (WEEKS - 1) * 7));
  
  const days = [];
  let current = startDate;
  for (let i = 0; i < WEEKS * 7; i++) {
    days.push(current);
    current = new Date(current);
    current.setDate(current.getDate() + 1);
  }
  
  // Arrange in columns (weeks) of rows (days)
  const columns = [];
  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(days[w * 7 + d]);
    }
    columns.push(week);
  }
  
  const getColor = (count) => {
    if (!count || count === 0) return "bg-paper border border-ink/30";
    if (count === 1) return "bg-sand-200 border-2 border-ink shadow-winSm";
    if (count === 2) return "bg-mint-100 border-2 border-ink shadow-winSm";
    if (count >= 3 && count <= 4) return "bg-mint-200 border-2 border-ink shadow-winSm";
    return "bg-teal-btn border-2 border-ink shadow-winSm";
  };

  return (
    <div className="p-4 border-2 border-ink rounded-win bg-white shadow-winSm overflow-x-auto">
      {loading ? (
        <p className="font-body text-[12px]">loading activity...</p>
      ) : (
        <div className="flex gap-1 min-w-max">
          {columns.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day, dIdx) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const count = data[dateStr] || 0;
                
                // Don't show future days in the current week
                const isFuture = day > endDate;
                
                return (
                  <div
                    key={dIdx}
                    title={`${dateStr}: ${count} submissions`}
                    className={`w-3 h-3 rounded-sm ${isFuture ? "opacity-0" : getColor(count)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
