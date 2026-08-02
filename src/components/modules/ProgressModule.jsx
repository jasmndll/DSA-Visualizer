import { useState, useEffect } from "react";
import apiClient from "../../api/client";
import { useAuthStore } from "../../store/authStore";

export default function ProgressModule() {
  const { isAuthenticated } = useAuthStore();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get("/progress");
        if (mounted) setProgress(data);
      } catch (err) {
        if (mounted) setError("failed to load progress");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProgress();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <p className="font-body text-[12px] text-center p-4 border-2 border-ink rounded-win bg-white shadow-winSm">
          log in to track your progress
        </p>
      </div>
    );
  }

  if (loading && !progress) {
    return (
      <div className="space-y-3">
        <p className="font-body text-[12px]">loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="font-body text-[11px] text-swap bg-pink-100 border border-swap rounded-win px-2 py-1">
          {error}
        </p>
      </div>
    );
  }

  if (progress && progress.length === 0) {
    return (
      <div className="space-y-3">
        <p className="font-body text-[12px] text-center p-4 border-2 border-ink rounded-win bg-white shadow-winSm">
          no progress yet — try a module!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {progress?.map((item, idx) => {
        let badgeColor = "bg-sand-200";
        if (item.status === "IN_PROGRESS") badgeColor = "bg-blue-200";
        if (item.status === "COMPLETED") badgeColor = "bg-mint-200";

        return (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border-2 border-ink rounded-win bg-white shadow-winSm"
          >
            <span className="font-display font-bold text-[14px]">
              {item.moduleKey}
            </span>
            <span
              className={`font-body text-[10px] px-2 py-1 border-2 border-ink rounded-win ${badgeColor}`}
            >
              {item.status.replace("_", " ")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
