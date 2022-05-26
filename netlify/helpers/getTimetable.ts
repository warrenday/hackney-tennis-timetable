import axios from "axios";
import { parse } from "node-html-parser";
import * as dateFns from "date-fns";

export const getTimetable = async (placeId: string, date: Date) => {
  const dateString = dateFns.format(date, "YYYY-MM-DD");
  const res = await axios.get(
    `https://www.openplay.co.uk/booking/place/${placeId}?date=${dateString}`
  );

  const root = parse(res.data);
  const rootTable = root.querySelector(".timetable .table-times");

  const hours = rootTable
    ?.querySelectorAll("tr")
    .map((row) => {
      return row.querySelector("a")?.textContent;
    })
    .filter((time): time is string => {
      return time !== undefined;
    })
    .map((time) => {
      const hour = time.split(":")[0];
      return parseInt(hour);
    });

  return hours;
};
