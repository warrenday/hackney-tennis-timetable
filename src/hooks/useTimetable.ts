import { useEffect, useState } from "react";

export interface IVenueTimetable {
  id: string;
  name: string;
  color: string;
  timetable: string[];
}

const isLocal = process.env.REACT_APP_ENV === "LOCAL";

export const useVenueTimetables = (): IVenueTimetable[] => {
  const [timetable, setTimetable] = useState<IVenueTimetable[]>([]);

  useEffect(() => {
    if (isLocal) {
      import("../data.timetable.json").then((res) => {
        setTimetable(res.default as any);
      });
    } else {
      fetch("/.netlify/functions/timetable")
        .then((res) => res.json())
        .then((data) => {
          setTimetable(data);
        });
    }
  }, [setTimetable]);

  return timetable;
};
