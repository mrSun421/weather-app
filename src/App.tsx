import { useEffect, useState } from "react";
import { WeatherPanel } from '@/components/ui/weatherPanel.tsx';
import { DatePickerWithRange } from "./components/ui/datePickerWithRange.tsx";

function App() {
  // const [weatherData, setWeatherData] = useState({});

  // useEffect(() => {
  //    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Atlanta?key=${import.meta.env.VITE_WEATHER_API_KEY}&unitGroup=us&contentType=json`)
  //      .then((res) => res.json())
  //      .then((data) => setWeatherData(data))
  //      .catch((err) => console.error(err));
  // });

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

  const daysData: Array<JSON> = weatherData["days"];

  return (
    <div>
      <DatePickerWithRange />
      {
        daysData.map((dayData, i) => {
          return (
            <WeatherPanel key={i} dayData={dayData} />
          )
        })
      }
    </div>
  );
}

export default App
