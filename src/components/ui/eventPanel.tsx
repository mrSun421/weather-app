import { useState } from "react"
import { Separator } from "./separator"
import { WeatherPanel } from "./weatherPanel"
import { addDays, nextMonday, nextSunday, nextWednesday, nextFriday, nextTuesday, nextThursday, nextSaturday, getDate } from 'date-fns';
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


export function EventPanel() {
  let weatherData = {
    "queryCost": 1,
    "latitude": 33.7483,
    "longitude": -84.3911,
    "resolvedAddress": "Atlanta, GA, United States",
    "address": "Atlanta",
    "timezone": "America/New_York",
    "tzoffset": -4,
    "description": "Similar temperatures continuing with a chance of rain multiple days.",
    "days": [
      {
        "datetime": "2025-05-26",
        "datetimeEpoch": 1748232000,
        "tempmax": 81.7,
        "tempmin": 67.3,
        "temp": 73.3,
        "feelslikemax": 83.9,
        "feelslikemin": 67.3,
        "feelslike": 73.6,
        "dew": 67,
        "humidity": 81.6,
        "precip": 0.736,
        "precipprob": 100,
        "precipcover": 41.67,
        "preciptype": [
          "rain"
        ],
        "snow": 0,
        "snowdepth": 0,
        "windgust": 13.9,
        "windspeed": 8.1,
        "winddir": 101.9,
        "pressure": 1017.3,
        "cloudcover": 88.8,
        "visibility": 7.9,
        "solarradiation": 411.6,
        "solarenergy": 35.5,
        "uvindex": 5,
        "severerisk": 30,
        "sunrise": "06:30:10",
        "sunriseEpoch": 1748255410,
        "sunset": "20:39:38",
        "sunsetEpoch": 1748306378,
        "moonphase": 0,
        "conditions": "Rain, Partially cloudy",
        "description": "Partly cloudy throughout the day with storms possible.",
        "icon": "rain",
        "stations": [
          "1066W",
          "KFTY",
          "0349W",
          "KATL",
          "KPDK"
        ],
        "source": "comb",
        "hours": [
          {
            "datetime": "04:00:00",
            "datetimeEpoch": 1748246400,
            "temp": 68.1,
            "feelslike": 68.1,
            "humidity": 92.86,
            "dew": 65.9,
            "precip": 0.066,
            "precipprob": 100,
            "snow": 0,
            "snowdepth": 0,
            "preciptype": [
              "rain"
            ],
            "windgust": 8.1,
            "windspeed": 2.7,
            "winddir": 338,
            "pressure": 1017.5,
            "visibility": 6,
            "cloudcover": 93.3,
            "solarradiation": 526,
            "solarenergy": 1.9,
            "uvindex": 0,
            "severerisk": 10,
            "conditions": "Rain, Overcast",
            "icon": "rain",
            "stations": [
              "1066W",
              "KFTY",
              "KATL",
              "KPDK"
            ],
            "source": "obs"
          },
          {
            "datetime": "05:00:00",
            "datetimeEpoch": 1748250000,
            "temp": 67.5,
            "feelslike": 67.5,
            "humidity": 95.24,
            "dew": 66.1,
            "precip": 0.097,
            "precipprob": 100,
            "snow": 0,
            "snowdepth": 0,
            "preciptype": [
              "rain"
            ],
            "windgust": 8.1,
            "windspeed": 2.6,
            "winddir": 329,
            "pressure": 1017.7,
            "visibility": 3.5,
            "cloudcover": 100,
            "solarradiation": 532,
            "solarenergy": 1.9,
            "uvindex": 0,
            "severerisk": 10,
            "conditions": "Rain, Overcast",
            "icon": "rain",
            "stations": [
              "1066W",
              "KFTY",
              "KATL",
              "KPDK"
            ],
            "source": "obs"
          }
        ]
      }
    ],
    "alerts": [],
    "stations": {
      "1066W": {
        "distance": 1443,
        "latitude": 33.735,
        "longitude": -84.39,
        "useCount": 0,
        "id": "1066W",
        "name": "Georgia State University GA US WEATHERSTEM",
        "quality": 0,
        "contribution": 0
      },
      "KFTY": {
        "distance": 12440,
        "latitude": 33.78,
        "longitude": -84.52,
        "useCount": 0,
        "id": "KFTY",
        "name": "KFTY",
        "quality": 100,
        "contribution": 0
      },
      "0349W": {
        "distance": 2676,
        "latitude": 33.772,
        "longitude": -84.393,
        "useCount": 0,
        "id": "0349W",
        "name": "Georgia Tech Bobby Dodd Stadium GA US WEATHERSTEM",
        "quality": 0,
        "contribution": 0
      },
      "GA307": {
        "distance": 3596,
        "latitude": 33.781,
        "longitude": -84.391,
        "useCount": 0,
        "id": "GA307",
        "name": "I75 @ 10th St, GA",
        "quality": 0,
        "contribution": 0
      },
      "0353W": {
        "distance": 3182,
        "latitude": 33.775,
        "longitude": -84.404,
        "useCount": 0,
        "id": "0353W",
        "name": "Georgia Tech Campus Recreation C GA US WEATHERSTEM",
        "quality": 0,
        "contribution": 0
      },
      "KATL": {
        "distance": 11265,
        "latitude": 33.65,
        "longitude": -84.42,
        "useCount": 0,
        "id": "KATL",
        "name": "KATL",
        "quality": 100,
        "contribution": 0
      },
      "KPDK": {
        "distance": 16910,
        "latitude": 33.88,
        "longitude": -84.3,
        "useCount": 0,
        "id": "KPDK",
        "name": "KPDK",
        "quality": 100,
        "contribution": 0
      }
    },
    "currentConditions": {
      "datetime": "18:40:00",
      "datetimeEpoch": 1748299200,
      "temp": 79.1,
      "feelslike": 79.1,
      "humidity": 63.2,
      "dew": 65.5,
      "precip": null,
      "precipprob": 0,
      "snow": 0,
      "snowdepth": 0,
      "preciptype": null,
      "windgust": 11.1,
      "windspeed": 6.7,
      "winddir": 156,
      "pressure": 984,
      "visibility": 1.2,
      "cloudcover": 70,
      "solarradiation": 224,
      "solarenergy": 0.8,
      "uvindex": 2,
      "conditions": "Partially cloudy",
      "icon": "partly-cloudy-day",
      "stations": [
        "1066W",
        "0349W",
        "GA307",
        "0353W"
      ],
      "source": "obs",
      "sunrise": "06:30:10",
      "sunriseEpoch": 1748255410,
      "sunset": "20:39:38",
      "sunsetEpoch": 1748306378,
      "moonphase": 0
    }
  }
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });


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

  console.log(typeof nextThursday)
  const [weekday, setWeekday] = useState<Weekday>("Sunday");
  const [location, setLocation] = useState(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
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
  function calculateStartingDate() {
    let nextFunc = getNextWeekdayFunction(weekday) ?? (date => date);

    return nextFunc(dateRange.from ?? new Date());
  }

  return (
    <div>
      <div className="grid gap-4 flex-nowrap auto-rows-auto justify-evenly grid-flow-row-dense">
        <div className="flex flex-wrap gap-2">
          <LocationEditor location={location} setLocation={setLocation} isEditingLocation={isEditingLocation} setIsEditingLocation={setIsEditingLocation} />
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} className="" />
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
        <Carousel className="w-full">
          <CarouselContent>
            {
              weatherData["days"].map((dayData, i) => {
                return (
                  <CarouselItem key={i}>
                    <WeatherPanel key={i} dayData={dayData} className="" />
                  </CarouselItem>
                )
              })
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div >
  )
}


