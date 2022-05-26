import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { format, setHours } from "date-fns";
import { useMemo } from "react";
import { useNextDays } from "../hooks/useNextDays";
import { IVenueTimetable, useVenueTimetables } from "../hooks/useTimetable";

const validHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const useFlatTimetable = (
  venues: IVenueTimetable[]
): Record<string, string[]> => {
  return useMemo(() => {
    const combinedTimes: Record<string, string[]> = {};

    for (let venue of venues) {
      for (let datetime of venue.timetable) {
        if (!combinedTimes[datetime]) {
          combinedTimes[datetime] = [];
        }
        combinedTimes[datetime].push(venue.id);
      }
    }

    return combinedTimes;
  }, [venues]);
};

const Venue = (props: {
  id: string;
  name: string;
  day: Date;
  colorScheme?: string;
}) => {
  const { id, name, day, colorScheme } = props;
  const date = format(day, "YYYY-MM-DD");
  const timetableUrl = `https://www.openplay.co.uk/booking/place/${id}?date=${date}&use_id=42`;

  return (
    <Tooltip label={name}>
      <Badge
        colorScheme={colorScheme}
        size="xs"
        as="a"
        href={timetableUrl}
        target="_blank"
      >
        {name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("")}
      </Badge>
    </Tooltip>
  );
};

const Venues = ({
  venues,
  date,
  hour,
}: {
  venues: IVenueTimetable[];
  date: Date;
  hour: number;
}) => {
  // When setting a datetime to find the correct venues the hours will
  // set a different time than the hour in the server response due to
  // local timezones.
  //
  // For example setting an hour of 21 may give
  // 2022-05-29T20:00:00.000Z
  // We offset this because we don't care about the timezone
  // we just want the exact hour as given.
  const timezoneOffsetHours = date.getTimezoneOffset() / 60;
  const trueHour = hour - timezoneOffsetHours;
  const datetime = setHours(date, trueHour).toISOString();

  const timetable = useFlatTimetable(venues);
  const venueIds: string[] = timetable[datetime] || [];

  return (
    <>
      {venueIds.map((venueId) => {
        const venue = venues.find((v) => v.id === venueId);
        return (
          <Venue
            key={venueId}
            id={venueId}
            name={venue?.name || ""}
            colorScheme={venue?.color}
            day={date}
          />
        );
      })}
    </>
  );
};

export const Timetable = () => {
  const venues = useVenueTimetables();
  const nextSevenDays = useNextDays(8);

  return (
    <TableContainer>
      <Table size="sm">
        <TableCaption>Hackney Tennis Full Timetable</TableCaption>
        <Thead>
          <Tr>
            <Th>Times</Th>
            {nextSevenDays.map((date) => {
              return <Th key={date.toString()}>{format(date, "ddd Do")}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {validHours.map((hour) => {
            return (
              <Tr
                key={hour}
                transition="0.1s"
                background={hour % 2 !== 0 ? "gray.100" : "white"}
                _hover={{ background: "blue.100 !important" }}
              >
                <Td>{hour}</Td>
                {nextSevenDays.map((date) => {
                  return (
                    <Td key={date.toISOString()} experimental_spaceX="1">
                      <Venues venues={venues} date={date} hour={hour} />
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
