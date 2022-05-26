import { Handler } from "@netlify/functions";
import { addDays, setHours, startOfToday } from "date-fns";
import { getTimetable } from "../helpers/getTimetable";
import { config } from "../config";

const fetchWeeklyTimetableForVenue = async (
  venueId: string
): Promise<Date[]> => {
  const today = startOfToday();
  const dates = Array.from(Array(7).keys()).map((i) => {
    return addDays(today, i);
  });

  const times = await Promise.all(
    dates.map(async (date) => {
      const timetable = await getTimetable(venueId, new Date(date));
      return timetable.map((time) => {
        return setHours(date, time);
      });
    })
  );

  return times.flat();
};

export const handler: Handler = async (event, context) => {
  const venueId = event.queryStringParameters?.venueId;

  if (venueId) {
    const timetable = await fetchWeeklyTimetableForVenue(venueId);

    return {
      statusCode: 200,
      body: JSON.stringify(timetable),
    };
  } else {
    const timetables = await Promise.all(
      config.places.map(async (place) => {
        const timetableForVenue = await fetchWeeklyTimetableForVenue(place.id);
        return {
          id: place.id,
          name: place.name,
          timetable: timetableForVenue,
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(timetables),
    };
  }
};
