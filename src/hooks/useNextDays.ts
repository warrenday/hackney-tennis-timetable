import { addDays, startOfToday } from "date-fns";

export const useNextDays = (days: number) => {
  const today = startOfToday();
  const dates = Array.from(Array(days).keys()).map((i) => {
    return addDays(today, i);
  });

  return dates;
};
