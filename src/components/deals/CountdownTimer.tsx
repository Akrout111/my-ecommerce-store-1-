"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useLanguage } from "@/components/ecommerce/language-provider";
import { COLORS } from "@/lib/constants";

interface CountdownTimerProps {
  endDate: string;
}

function calculateTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const { t } = useLanguage();

  const getSnapshot = useCallback(() => calculateTimeLeft(endDate), [endDate]);
  const getServerSnapshot = useCallback(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }), []);

  const timeLeft = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totalHoursLeft = timeLeft.days * 24 + timeLeft.hours;
  // Color: green → yellow → red as deadline approaches
  const getColor = () => {
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
              className="flex items-center justify-center w-12 h-12 rounded-lg text-lg font-bold"
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
