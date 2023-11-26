import { useEffect, useRef, useState } from "react";
import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type Timer = {
  currentTime: number;
  endTime: number;
  restartTime: number;
  expiryTime: number;
};

type TimerConfig = {
  duration: number;
  ttl: number;
  expiry: number;
};

type TimerStore = {
  timer?: Timer;
  timerConfig?: TimerConfig;
  setConfig: (timerConfig: TimerConfig) => void;
  setTimer: (timerConfig: TimerConfig) => void;
  incrementTimer: () => void;
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      timer: undefined,
      timerConfig: undefined,
      setConfig: (timerConfig: TimerConfig) =>
        set({
          timerConfig: timerConfig,
          timer: {
            currentTime: Date.now(),
            endTime: Date.now() + timerConfig.duration,
            restartTime: Date.now() + timerConfig.duration + timerConfig.ttl,
            expiryTime: Date.now() + timerConfig.expiry,
          },
        }),
      setTimer: (timerConfig: TimerConfig) =>
        set({
          timerConfig: timerConfig,
          timer: {
            currentTime: Date.now(),
            endTime: Date.now() + timerConfig.duration,
            restartTime: Date.now() + timerConfig.duration + timerConfig.ttl,
            expiryTime: timerConfig.expiry,
          },
        }),
      incrementTimer: () => {
        let timer = get().timer;
        if (timer) {
          if (timer.currentTime >= timer.expiryTime) {
            return set({
              timer: undefined,
              timerConfig: undefined,
            });
          } else {
            return set({
              timer: {
                currentTime: timer.currentTime + 1000,
                endTime: timer.endTime,
                restartTime: timer.restartTime,
                expiryTime: timer.expiryTime,
              },
            });
          }
        }
      },
    }),
    { name: "timer-store" }
  )
);

export default function TimerComponent() {
  const timerRef = useRef(useTimerStore.getState().timer);
  const { timer, setTimer, incrementTimer, timerConfig, setConfig } = useStore(
    useTimerStore,
    (state) => state
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    async function fetchTimerConfig() {
      fetch("/api/timer")
        .then((res) => res.json())
        .then((data) => {
          setConfig(data as TimerConfig);
        });
    }
    if (!timerConfig) {
      fetchTimerConfig();
    }
  }, [setConfig, timerConfig]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (timerConfig && timer) {
      if (timer.currentTime >= timer.restartTime) {
        if (timerConfig) {
          setTimer(timerConfig);
        }
      } else {
        timeoutId = setTimeout(() => {
          incrementTimer();
        }, 1000);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [timer, setTimer, incrementTimer, timerConfig]);

  useEffect(() => {
    return useTimerStore.subscribe((state) => (timerRef.current = state.timer));
  }, []);

  if (isClient === false) return <span>00:00</span>;
  if (!timer) return <span>00:00</span>;

  let timerSeconds = Math.floor((timer.endTime - timer.currentTime) / 1000);
  let ttlSeconds = Math.floor(timer.restartTime - timer.currentTime) / 1000;
  const padTime = (time: number) => (time < 10 ? `0${time}` : time);

  return timer.endTime >= timer.currentTime ? (
    <span>
      {padTime(Math.floor(timerSeconds / 60))}
      {" : "}
      {padTime(timerSeconds % 60)}
    </span>
  ) : (
    <span>
      {padTime(Math.floor(ttlSeconds / 60))}
      {" : "}
      {padTime(ttlSeconds % 60)}
    </span>
  );
}
