import { useEffect, useState } from 'react';

export function useTicker(intervalMs: number) {
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return tick;
}
