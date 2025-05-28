import { useState, useEffect } from "react"
import { WeatherCarousel } from "@/components/ui/weatherCarousel";
import { addDays, nextMonday, nextSunday, nextWednesday, nextFriday, nextTuesday, nextThursday, nextSaturday } from 'date-fns';
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange";
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
import { LocationEditor } from "@/components/ui/locationEditor";
import { TimeDrawer } from "@/components/ui/timeDrawer";
import { type TimeRange, type TimePreset } from "@/types/time";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { parseJSONCookie, setJSONCookie } from "@/lib/cookies";
import { useUnit } from "@/lib/unitContext";

type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

const TIME_PRESETS: Record<TimePreset, { from: number; to: number }> = {
  day: { from: 0, to: 24 },
  morning: { from: 8, to: 12 },
  afternoon: { from: 12, to: 17 },
  evening: { from: 17, to: 21 },
  custom: { from: 0, to: 24 },
};

function useTimeRange(initialPreset: TimePreset = 'day') {
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    return parseJSONCookie<TimeRange>('timeRange', {
      preset: initialPreset,
      ...TIME_PRESETS[initialPreset]
    });
  });

  const handlePresetUpdate = (preset: TimePreset) => {
    const newTimeRange = {
      preset,
      ...TIME_PRESETS[preset],
      ...(preset === 'custom' ? { from: timeRange.from, to: timeRange.to } : {})
    };
    setTimeRange(newTimeRange);
    setJSONCookie('timeRange', newTimeRange);
  };

  useEffect(() => {
    setJSONCookie('timeRange', timeRange);
  }, [timeRange]);

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

function WeekdaySelector({ 
  weekday,
  setWeekday,
}: { 
  weekday: Weekday;
  setWeekday: (value: Weekday) => void;
}) {
  return (
      <Select value={weekday} onValueChange={(value: Weekday) => setWeekday(value)}>
        <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
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
  );
}



function PresetTimeSelector({
  timeRange,
  handlePresetUpdate,
}: {
  timeRange: TimeRange;
  handlePresetUpdate: (preset: TimePreset) => void;
}) {
  return (
    <div className="flex items-center gap-4">
            <Select value={timeRange.preset} onValueChange={handlePresetUpdate}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[150px]">
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

    </div>
  );
}

export function EventPanel() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return parseJSONCookie<DateRange | undefined>('dateRange', {
      from: new Date(),
      to: addDays(new Date(), 7),
    });
  });

  const { timeRange, setTimeRange, handlePresetUpdate } = useTimeRange();
  const [weekday, setWeekday] = useState<Weekday>(() => 
    parseJSONCookie<Weekday>('weekday', "Sunday")
  );
  const [location, setLocation] = useState<string>(() => 
    parseJSONCookie<string>('location', "")
  );
  const { unitGroup } = useUnit();

  // Save preferences to cookies when they change
  useEffect(() => {
    if (dateRange) {
      setJSONCookie('dateRange', dateRange);
    }
  }, [dateRange]);

  useEffect(() => {
    setJSONCookie('weekday', weekday);
  }, [weekday]);

  useEffect(() => {
    setJSONCookie('location', location);
  }, [location]);

  const dates = dateRange ? (dateRange.from ? calculateArrayOfDates(dateRange, weekday) : []) : [];

  return (
    <div className="animate-in container mx-auto max-w-4xl px-4">
      <div className="space-y-6">
        <div className="rounded-lg bg-white/50 p-4 sm:p-6 shadow-sm backdrop-blur-sm dark:bg-slate-800/50 w-full">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4">
              <div className="w-full max-w-[300px] justify-self-center lg:justify-self-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <LocationEditor 
                        location={location} 
                        setLocation={setLocation} 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter a city, address, or location to check the weather forecast</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-full max-w-[300px] justify-self-center lg:justify-self-start">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DatePickerWithRange 
                        dateRange={dateRange} 
                        setDateRange={setDateRange} 
                        className="w-full" 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select a date range to view weather forecasts</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <WeekdaySelector weekday={weekday} setWeekday={setWeekday} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose which day of the week to check weather for</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <PresetTimeSelector
                      timeRange={timeRange}
                      handlePresetUpdate={handlePresetUpdate}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select a time range preset or customize your own</p>
                </TooltipContent>
              </Tooltip>
              <TimeDrawer timeRange={timeRange} setTimeRange={setTimeRange} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-center">
            {!location ? (
              <div className="flex items-center justify-center p-8 text-ash_gray dark:text-mindaro/70">
                <span className="text-lg font-medium">Add a location to view weather data</span>
              </div>
            ) : dates.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-ash_gray dark:text-mindaro/70">
                <span className="text-lg font-medium">Select a date range to view weather data.</span>
              </div>
            ) : (
              <WeatherCarousel 
                dates={dates}
                location={location}
                timeRange={timeRange}
                unitGroup={unitGroup}
                onExtend={() => {
                  if (dateRange?.to) {
                    setDateRange({
                      from: dateRange.from,
                      to: addDays(dateRange.to, 7)
                    });
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


