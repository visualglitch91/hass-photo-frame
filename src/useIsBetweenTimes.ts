import { useEffect, useState } from "preact/hooks";

export default function useIsBetweenTimes(startTime: string, endTime: string) {
  const [isBetween, setIsBetween] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date();
      const end = new Date();

      const [startHour, startMinute] = startTime.split(":").map(Number);
      start.setHours(startHour, startMinute, 0, 0);

      const [endHour, endMinute] = endTime.split(":").map(Number);
      end.setHours(endHour, endMinute, 0, 0);

      if (
        endHour < startHour ||
        (endHour === startHour && endMinute < startMinute)
      ) {
        // If end time is earlier than start time, it's on the next day
        end.setDate(end.getDate() + 1);
      }

      if (now >= start && now <= end) {
        setIsBetween(true);
      } else {
        setIsBetween(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return isBetween;
}
