import { useState, useEffect } from 'react';

export function useClock(updateIntervalMs = 1000) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), updateIntervalMs);
    return () => clearInterval(timer);
  }, [updateIntervalMs]);

  return time;
}
