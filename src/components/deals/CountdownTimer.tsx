"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  const update = useCallback(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [update]);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <span className="text-sm font-bold tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-1 text-[10px] font-medium text-muted-foreground">
              {unit.label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="text-lg font-bold text-muted-foreground -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
