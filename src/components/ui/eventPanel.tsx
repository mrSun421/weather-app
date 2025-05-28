import { useEffect, useState } from "react"
import { Separator } from "./separator"
import { WeatherPanel } from "./weatherPanel"
import { addDays, nextMonday, nextSunday, nextWednesday, nextFriday, nextTuesday, nextThursday, nextSaturday, getUnixTime, isBefore } from 'date-fns';
import { DatePickerWithRange } from "./datePickerWithRange";
import { type DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { LocationEditor } from "./locationEditor";
import { TimePickerWithRange } from "./timePicker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import createClient from 'openapi-fetch';
import type { paths } from '@/lib/visual-crossing-schema';

const Weekdays = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
} as const;

type Weekday = keyof typeof Weekdays;
type WeekdayValue = typeof Weekdays[Weekday];

const client = createClient<paths>({
  baseUrl: "https://weather.visualcrossing.com/"
});

function calculateArrayOfDates(dateRange: DateRange, weekday: Weekday) {
  const startDate: Date = calculateStartingDate(dateRange, weekday);
  let dates: Array<Date> = [startDate];

  if (dateRange.to) {
    let currentDate: Date = addDays(startDate, 7);
    while (isBefore(currentDate, dateRange.to)) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 7);
    }
  }

  return dates;
}

function getNextWeekdayFunction(weekday: Weekday) {
  switch (weekday) {
    case "Sunday":
      return nextSunday;
    case "Monday":
      return nextMonday;
    case "Tuesday":
      return nextTuesday;
    case "Wednesday":
      return nextWednesday;
    case "Thursday":
      return nextThursday;
    case "Friday":
      return nextFriday;
    case "Saturday":
      return nextSaturday;
  }
}
function calculateStartingDate(dateRange: DateRange, weekday: Weekday) {
  let nextFunc = getNextWeekdayFunction(weekday) ?? (date => date);
  return nextFunc(dateRange.from);
}
export function EventPanel() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  function handleUpdatingDateRange(range) {
    if (range) {
      setDateRange(range);
    } else {
      const newDateRange = {
        from: new Date(),
        to: addDays(new Date(), 7),
      }
      setDateRange(newDateRange);
    }
  }


  const [timeRange, setTimeRange] = useState({
    preset: "custom",
    from: 0,
    to: 24,
  });

  function handlePresetUpdate(value: string) {
    let newTimeRange: { preset: string, from: number, to: number } = {
      preset: value,
      from: 0,
      to: 24,
    };
    switch (value) {
      case "day":
        newTimeRange.from = 0;
        newTimeRange.to = 24;
        break;
      case "morning":
        newTimeRange.from = 8;
        newTimeRange.to = 12;
        break;
      case "afternoon":
        newTimeRange.from = 12;
        newTimeRange.to = 17;
        break;
      case "evening":
        newTimeRange.from = 17;
        newTimeRange.to = 21;
        break;
      default:
        newTimeRange.preset = "custom";
        newTimeRange.from = timeRange.from;
        newTimeRange.to = timeRange.to;
    }
    setTimeRange(newTimeRange);
  }

  const [weekday, setWeekday] = useState<Weekday>("Sunday");
  const [location, setLocation] = useState(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  let [weatherData, setWeatherData] = useState({ days: [] });
  let [weatherDataError, setWeatherDataError] = useState(null);
  let arrayOfDates = calculateArrayOfDates(dateRange, weekday);

  useEffect(() => {
    if (location && dateRange) {
      client.GET("/VisualCrossingWebServices/rest/services/timeline/{location}/{startdate}/{enddate}",
        {
          params: {
            query: {
              key: import.meta.env.VITE_WEATHER_API_KEY,
              contentType: "json",
              include: "hours,days,fcst,statsfcst",
            },
            path: {
              location: location,
              startdate: String(getUnixTime(arrayOfDates[0])),
              enddate: String(getUnixTime(arrayOfDates[arrayOfDates.length - 1])),
            }
          }
        }).then(({ data, error, response }) => {
          if (error) {
            setWeatherData({ days: [] });
            setWeatherDataError(error);
          } else {
            setWeatherDataError(null);
            setWeatherData(data);
          }
        });

    }

  }, [location, dateRange]);


  return (
    <div>
      <div className="grid gap-4 flex-nowrap auto-rows-auto justify-evenly grid-flow-row-dense">
        <div className="flex flex-wrap gap-2">
          <LocationEditor location={location} setLocation={setLocation} isEditingLocation={isEditingLocation} setIsEditingLocation={setIsEditingLocation} />
          <DatePickerWithRange dateRange={dateRange} setDateRange={handleUpdatingDateRange} className="" />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={weekday} onValueChange={setWeekday} >
            <SelectTrigger className="w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" /></svg>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Which Day of the Week?</SelectLabel>
                <SelectItem value="Sunday">Every Sunday</SelectItem>
                <SelectItem value="Monday">Every Monday</SelectItem>
                <SelectItem value="Tuesday">Every Tuesday</SelectItem>
                <SelectItem value="Wednesday">Every Wednesday</SelectItem>
                <SelectItem value="Thursday">Every Thursday</SelectItem>
                <SelectItem value="Friday">Every Friday</SelectItem>
                <SelectItem value="Saturday">Every Saturday</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={timeRange.preset} onValueChange={handlePresetUpdate} >
            <SelectTrigger className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Preset Times</SelectLabel>
                <SelectItem value="day">Whole Day</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <TimePickerWithRange timeRange={timeRange} setTimeRange={setTimeRange} className="" />
        </div>
      </div>

      <Separator className="m-4" />

      <div className="grid justify-center">
        <Carousel className="w-xl h-fill">
          <CarouselContent >
            {
              weatherDataError ? (
                <p> Something went wrong: {weatherDataError}</p>
              ) :
                weatherData["days"].map((dayData, i) => {
                  return ((i % 7 === 0) ?
                    (<CarouselItem key={i} className="basis-1/2">
                      <WeatherPanel key={i} dayData={dayData} timeRange={timeRange} className="" />
                    </CarouselItem>) : (<></>)
                  )
                })
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}


