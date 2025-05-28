import createClient from 'openapi-fetch';
import type { paths } from '@/lib/visual-crossing-schema';

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
}

export const weatherClient = createClient<paths>({
  baseUrl: "https://weather.visualcrossing.com/"
}); 