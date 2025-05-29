import createClient from 'openapi-fetch';
import type { paths } from '@/lib/visual-crossing-schema';
import { startOfDay, addDays, getUnixTime,  isBefore } from 'date-fns';

export type UnitGroup = 'us' | 'uk' | 'metric' | 'base';

interface HistoricalWeatherValue {
  datetime: string;
  temp: number;
  feelslike?: number;
  wspd?: number;
  wgust?: number;
  precip?: number;
}

interface HistoricalWeatherLocation {
  values: HistoricalWeatherValue[];
}

interface HistoricalWeatherResponse {
  locations: {
    [location: string]: HistoricalWeatherLocation;
  };
}

export interface WeatherDayData {
  datetimeEpoch: number;
  hours?: Array<{
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
    windspeed: number;
    windgust: number;
    precipprob: number;
  }>;
  temp: number;
  precipprob: number;
  severerisk: number;
  icon: "snow" | "rain" | "fog" | "wind" | "cloudy" | "partly-cloudy-day" | "partly-cloudy-night" | "clear-day" | "clear-night";
  windspeed: number;
}

export interface WeatherResponse {
  days: WeatherDayData[];
  error?: string;
  unitGroup?: UnitGroup;
}

export interface WeatherFetchOptions {
  location: string;
  date: Date;
  unitGroup?: UnitGroup;
  include?: string[];
  iconSet?: string;
}

export async function fetchWeatherData({ location, date, unitGroup = 'us', include = ['hours', 'days', 'fcst', 'statsfcst'], iconSet = 'icons1' }: WeatherFetchOptions): Promise<WeatherResponse> {
  const client = createClient<paths>({
    baseUrl: "https://weather.visualcrossing.com/"
  });

  const today = startOfDay(new Date());
  const isHistoricalData = isBefore(date, today);


  if (isHistoricalData) {
    const { data, error } = await client.GET("/VisualCrossingWebServices/rest/services/weatherdata/history", {
      params: {
        query: {
          key: import.meta.env.VITE_WEATHER_API_KEY,
          contentType: "json",
          unitGroup,
          locations: location,
          startDateTime: String(getUnixTime(date)),
          endDateTime: String(getUnixTime(addDays(date, 1))),
          aggregateHours: "1", // Get hourly data
          includeNormals: false,
        }
      }
    });

    if (error) {
      throw new Error(error);
    }

    // Transform historical data to match our WeatherResponse format
    const historicalData = data as unknown as HistoricalWeatherResponse;
    const weatherData: WeatherResponse = {
      days: [{
        datetimeEpoch: getUnixTime(date),
        temp: historicalData.locations[location]?.values[0]?.temp ?? 0,
        precipprob: historicalData.locations[location]?.values[0]?.precip ?? 0,
        severerisk: 0, // Historical data doesn't include severe risk
        icon: "clear-day", // Default icon as historical data doesn't include icons
        windspeed: historicalData.locations[location]?.values[0]?.wspd ?? 0,
        hours: historicalData.locations[location]?.values.map((hour: HistoricalWeatherValue) => ({
          datetimeEpoch: getUnixTime(new Date(hour.datetime)),
          temp: hour.temp,
          feelslike: hour.feelslike ?? hour.temp,
          windspeed: hour.wspd ?? 0,
          windgust: hour.wgust ?? 0,
          precipprob: hour.precip ?? 0,
        }))
      }],
      unitGroup
    };

    return weatherData;
  }

  // For forecast data, use the timeline endpoint as before
  const { data, error } = await client.GET("/VisualCrossingWebServices/rest/services/timeline/{location}/{startdate}", {
    params: {
      query: {
        key: import.meta.env.VITE_WEATHER_API_KEY,
        contentType: "json",
        include: include.join(','),
        iconSet,
        unitGroup,
      },
      path: {
        location,
        startdate: String(getUnixTime(date)),
      }
    }
  });

  if (error) {
    throw new Error(error);
  }

  const weatherData = data as unknown as WeatherResponse;
  weatherData.unitGroup = unitGroup;

  if (!weatherData.days?.[0]) {
    throw new Error("No weather data available");
  }

  return weatherData;
} 