import createClient from 'openapi-fetch';
import type { paths } from '@/lib/visual-crossing-schema';

export type UnitGroup = 'us' | 'uk' | 'metric' | 'base';

export interface WeatherDayData {
  datetimeEpoch: number;
  hours?: Array<{
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
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

  const { data, error, response } = await client.GET("/VisualCrossingWebServices/rest/services/timeline/{location}/{startdate}", {
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
        startdate: String(Math.floor(date.getTime() / 1000)), // Convert to Unix timestamp
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