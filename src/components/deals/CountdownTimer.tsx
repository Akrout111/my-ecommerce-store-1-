"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/ecommerce/language-provider";

interface CountdownTimerProps {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endDate));

  useEffect(() => {
    // If countdown is already over, no need to set interval
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      return;
    }

    const id = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      // Stop the interval when countdown reaches zero
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [endDate, timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  const totalHoursLeft = timeLeft.days * 24 + timeLeft.hours;

  // Color: green → yellow → red as deadline approaches
  const getColor = (): string => {
    if (timeLeft.days > 2) return "#22C55E";
    if (timeLeft.days > 1) return "#EAB308";
    if (totalHoursLeft > 12) return "#F97316";
    return "#EF4444";
  };

  const color = getColor();

  const units = [
    { value: timeLeft.days, label: t("deals.days") },
    { value: timeLeft.hours, label: t("deals.hours") },
    { value: timeLeft.minutes, label: t("deals.minutes") },
    { value: timeLeft.seconds, label: t("deals.seconds") },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg text-lg font-bold transition-colors duration-500"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {String(unit.value).padStart(2, "0")}
            </div>
            <span className="text-[10px] text-gray-500 mt-1">{unit.label}</span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-lg font-bold" style={{ color }}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
