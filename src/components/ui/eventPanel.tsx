import { useEffect, useState } from "react"
import { WeatherCarousel } from "./weatherCarousel";
import { addDays, nextMonday, nextSunday, nextWednesday, nextFriday, nextTuesday, nextThursday, nextSaturday, getUnixTime, format } from 'date-fns';
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
import createClient from 'openapi-fetch';
import type { paths } from '@/lib/visual-crossing-schema';
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
type TimePreset = 'day' | 'morning' | 'afternoon' | 'evening' | 'custom';

interface TimeRange {
  preset: TimePreset;
  from: number;
  to: number;
}

const TIME_PRESETS: Record<TimePreset, { from: number; to: number }> = {
  day: { from: 0, to: 24 },
  morning: { from: 8, to: 12 },
  afternoon: { from: 12, to: 17 },
  evening: { from: 17, to: 21 },
  custom: { from: 0, to: 24 },
};

function useTimeRange(initialPreset: TimePreset = 'day') {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    preset: initialPreset,
    ...TIME_PRESETS[initialPreset]
  });

  const handlePresetUpdate = (preset: TimePreset) => {
    setTimeRange({
      preset,
      ...TIME_PRESETS[preset],
      ...(preset === 'custom' ? { from: timeRange.from, to: timeRange.to } : {})
    });
  };

  return { timeRange, setTimeRange, handlePresetUpdate };
}

const WEEKDAY_FUNCTIONS: Record<Weekday, (date: Date) => Date> = {
  Sunday: nextSunday,
  Monday: nextMonday,
  Tuesday: nextTuesday,
  Wednesday: nextWednesday,
  Thursday: nextThursday,
  Friday: nextFriday,
  Saturday: nextSaturday,
};

function calculateArrayOfDates(dateRange: DateRange, weekday: Weekday): Date[] {
  if (!dateRange.from) return [];
  
  const nextWeekdayFn = WEEKDAY_FUNCTIONS[weekday];
  const startDate = nextWeekdayFn(dateRange.from);
  const dates = [startDate];

  if (dateRange.to) {
    let currentDate = addDays(startDate, 7);
    while (currentDate <= dateRange.to) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 7);
    }
  }

  return dates;
}

const client = createClient<paths>({
  baseUrl: "https://weather.visualcrossing.com/"
});

export function EventPanel() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { timeRange, setTimeRange, handlePresetUpdate } = useTimeRange();
  const [weekday, setWeekday] = useState<Weekday>("Sunday");
  const [location, setLocation] = useState<string>("");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [weatherData, setWeatherData] = useState<{ days: any[] }>({ days: [] });
  const [weatherDataError, setWeatherDataError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateRangeUpdate = (range: DateRange | undefined) => {
    setDateRange(range ?? {
      from: new Date(),
      to: addDays(new Date(), 7),
    });
  };

  useEffect(() => {
    if (!location || !dateRange.from) return;

    const dates = calculateArrayOfDates(dateRange, weekday);
    if (dates.length === 0) return;

    setIsLoading(true);
    setWeatherDataError(null);

    client.GET("/VisualCrossingWebServices/rest/services/timeline/{location}/{startdate}/{enddate}", {
      params: {
        query: {
          key: import.meta.env.VITE_WEATHER_API_KEY,
          contentType: "json",
          include: "hours,days,fcst,statsfcst",
          iconSet: "icons1",
        },
        path: {
          location,
          startdate: String(getUnixTime(dates[0])),
          enddate: String(getUnixTime(dates[dates.length - 1])),
        }
      }
    })
    .then(({ data, error }) => {
      if (error) {
        setWeatherData({ days: [] });
        setWeatherDataError(error as string);
      } else if (data) {
        setWeatherData(data);
        setWeatherDataError(null);
      }
    })
    .catch(error => {
      setWeatherDataError(error.message);
      setWeatherData({ days: [] });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [location, dateRange, weekday]);

  return (
    <div className="animate-in container mx-auto max-w-4xl px-4">
      <div className="space-y-6">
        <div className="rounded-lg bg-white/50 p-6 shadow-sm backdrop-blur-sm dark:bg-slate-800/50">
          <div className="space-y-4">
            <div className="grid grid-wrap items-center justify-center gap-4 lg:grid-cols-2">
              <div className="w-[300px] flex-shrink-0 justify-self-end">
                <LocationEditor 
                  location={location} 
                  setLocation={setLocation} 
                  isEditingLocation={isEditingLocation} 
                  setIsEditingLocation={setIsEditingLocation} 
                />
              </div>
              <div className="flex-1 min-w-[300px]">
                <DatePickerWithRange 
                  dateRange={dateRange} 
                  setDateRange={handleDateRangeUpdate} 
                  className="w-full" 
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Select value={weekday} onValueChange={(value: Weekday) => setWeekday(value)}>
                <SelectTrigger className="min-w-[180px]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="mr-2 text-steel_blue dark:text-mindaro">
                    <path fill="currentColor" d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
                  </svg>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-medium">Which Day of the Week?</SelectLabel>
                    {Object.keys(WEEKDAY_FUNCTIONS).map(day => (
                      <SelectItem key={day} value={day}>Every {day}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={timeRange.preset} onValueChange={handlePresetUpdate}>
                <SelectTrigger className="min-w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-medium">Preset Times</SelectLabel>
                    {Object.keys(TIME_PRESETS).map(preset => (
                      <SelectItem key={preset} value={preset}>
                        {preset.charAt(0).toUpperCase() + preset.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 flex-initial"
                    disabled={timeRange.preset !== 'custom'}
                  >
                    {format(new Date().setHours(timeRange.from, 0), 'p')} - {format(new Date().setHours(timeRange.to, 0), 'p')}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="flex flex-col items-center justify-center min-h-[40vh] py-6 px-4">
                    <DrawerHeader className="text-center pb-2">
                      <DrawerTitle className="text-3xl font-bold mb-1">Select Time Range</DrawerTitle>
                      <DrawerDescription className="text-lg">
                        Choose your preferred time range for the event
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex items-center justify-center w-full">
                      <TimePickerWithRange 
                        timeRange={timeRange} 
                        setTimeRange={setTimeRange} 
                        className="scale-110" 
                      />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-center">
            {!location ? (
              <div className="flex items-center justify-center p-8 text-ash_gray dark:text-mindaro/70">
                <span className="text-lg font-medium">Add a location to view weather data</span>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center p-8 text-ash_gray dark:text-mindaro/70">
                <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-lg font-medium">Loading weather data...</span>
              </div>
            ) : weatherDataError ? (
              <div className="rounded-lg bg-red-50/50 p-6 text-red-700 dark:bg-red-900/20 dark:text-red-200">
                <p className="text-lg font-medium">Something went wrong:</p>
                <p className="mt-2">{weatherDataError}</p>
              </div>
            ) : (
              <WeatherCarousel weatherData={weatherData} timeRange={timeRange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


