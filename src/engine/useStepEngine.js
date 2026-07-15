import { useState, useRef, useCallback, useEffect } from "react";

/**
 * useStepEngine — framework-agnostic playback engine for any algorithm
 * that's been reduced to an array of "step" snapshots.
 *
 * This replaces what BaseVisualizer.currentStepIndex + App.play()/pause()/
 * runLoop() did with manual DOM calls — here it's just React state, and
 * the visualizer component re-renders from `currentStep` automatically.
 *
 * Usage:
 *   const engine = useStepEngine(steps, { speed: 5 });
 *   engine.currentStep      -> the step object to render
 *   engine.play() / pause() / next() / prev() / reset()
 *   engine.isPlaying, engine.progressLabel
 */
export function useStepEngine(steps = [], { initialSpeed = 5 } = {}) {
  const [currentIndex, setCurrentIndex] = useState(steps.length ? 0 : -1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed); // 1 (slow) - 10 (fast)
  const timeoutRef = useRef(null);

  // Reset playback whenever a new steps array is loaded (e.g. randomize)
  useEffect(() => {
    setCurrentIndex(steps.length ? 0 : -1);
    setIsPlaying(false);
    clearTimeout(timeoutRef.current);
  }, [steps]);

  const getDelay = useCallback(() => Math.max(80, 1600 - speed * 150), [speed]);

  const next = useCallback(() => {
    setCurrentIndex((i) => {
      if (i < steps.length - 1) return i + 1;
      return i;
    });
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const reset = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setCurrentIndex(steps.length ? 0 : -1);
  }, [steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimeout(timeoutRef.current);
  }, []);

  const play = useCallback(() => {
    if (!steps.length) return;
    setIsPlaying(true);
  }, [steps.length]);

  // Drive the autoplay loop
  useEffect(() => {
    if (!isPlaying) return;
    if (currentIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, getDelay());
    return () => clearTimeout(timeoutRef.current);
  }, [isPlaying, currentIndex, steps.length, getDelay]);

  const total = steps.length;
  const progressLabel =
    total > 0 && currentIndex >= 0
      ? `step ${currentIndex + 1}/${total}`
      : "ready";

  return {
    currentStep: currentIndex >= 0 ? steps[currentIndex] : null,
    currentIndex,
    total,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    next,
    prev,
    reset,
    canNext: currentIndex < total - 1,
    canPrev: currentIndex > 0,
    progressLabel,
  };
}
