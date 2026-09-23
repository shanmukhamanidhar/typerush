import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialDuration: number;
  onTimeUp?: () => void;
}

export function useTimer({ initialDuration, onTimeUp }: UseTimerProps) {
  const [duration, setDuration] = useState<number>(initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const startTimeRef = useRef<number | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Sync if initialDuration prop changes while idle
  useEffect(() => {
    if (!isActive && !isFinished) {
      setDuration(initialDuration);
      setTimeLeft(initialDuration);
    }
  }, [initialDuration, isActive, isFinished]);

  const startTimer = useCallback(() => {
    if (isActive) return;
    setIsActive(true);
    setIsFinished(false);
    startTimeRef.current = Date.now();
  }, [isActive]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((newDuration?: number) => {
    setIsActive(false);
    setIsFinished(false);
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    const dur = newDuration !== undefined ? newDuration : duration;
    setDuration(dur);
    setTimeLeft(dur);
    startTimeRef.current = null;
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsedSeconds);

      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsActive(false);
        setIsFinished(true);
        setTimeLeft(0);
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
        }
        if (onTimeUpRef.current) {
          onTimeUpRef.current();
        }
      }
    }, 100);

    timerIdRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isActive, duration]);

  // Formatted string (e.g., "00:24", "00:05")
  const secondsRounded = Math.ceil(timeLeft);
  const minutes = Math.floor(secondsRounded / 60);
  const seconds = secondsRounded % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const elapsedSeconds = Math.max(0, duration - timeLeft);
  const isLowTime = isActive && timeLeft <= 5 && timeLeft > 0;

  return {
    timeLeft,
    secondsRounded,
    formattedTime,
    elapsedSeconds,
    isActive,
    isFinished,
    isLowTime,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
