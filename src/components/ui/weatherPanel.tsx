import { cn } from '@/lib/utils';
import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js/auto';
import { isAfter, isBefore, format, getUnixTime } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { weatherClient, type WeatherDayData, type WeatherResponse } from '@/lib/visual-crossing-client.ts';

interface WeatherStatProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
}

function WeatherStat({ icon, label, value, unit = '' }: WeatherStatProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-mindaro/50 p-3 dark:bg-ultra_violet-300/50">
      <span className="material-symbols-outlined text-steel_blue dark:text-mindaro">
        {icon}
      </span>
      <div>
        <p className="text-sm text-ash_gray dark:text-mindaro/70">{label}</p>
        <p className="font-medium text-ultra_violet dark:text-cream">{value}{unit}</p>
      </div>
    </div>
  );
}

const WeatherIcons = {
  "snow": "weather_snowy",
  "rain": "rainy",
  "fog": "foggy",
  "wind": "air",
  "cloudy": "cloud",
  "partly-cloudy-day": "partly_cloudy_day",
  "partly-cloudy-night": "partly_cloudy_night",
  "clear-day": "clear_day",
  "clear-night": "clear_night",
} as const;


interface WeatherPanelProps {
  date: Date;
  location: string;
  timeRange: {
    from: number;
    to: number;
  };
  className?: string;
}

function getWeatherComment(temp: number, precipprob: number, risk: number) {
  const comments = [];
  let shouldCancel = false;

  // Temperature assessment
  if (temp < 32.0) {
    comments.push("Below freezing!");
    shouldCancel = true;
  } else if (temp < 65.0) {
    comments.push("A bit chilly! I recommend a jacket.");
  } else if (temp < 80.0) {
    comments.push("Perfect temperature!");
  } else if (temp < 93.0) {
    comments.push("A bit hot! I recommend shorts.");
  } else {
    comments.push("Too hot!");
    shouldCancel = true;
  }

  // Precipitation assessment
  if (precipprob >= 70) {
    comments.push("High chance of rain.");
    shouldCancel = true;
  } else if (precipprob >= 30) {
    comments.push("Medium chance of rain. Bring an umbrella just in case.");
  } else {
    comments.push("Low chance of rain.");
  }

  // Severe risk assessment
  if (risk >= 70) {
    shouldCancel = true;
  }

  if (shouldCancel) {
    comments.push("I recommend you cancel.");
  }

  return { comment: comments.join(" "), shouldCancel };
}

export function WeatherPanel({ date, location, timeRange, className }: WeatherPanelProps) {
  const [dayData, setDayData] = useState<WeatherDayData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const {data, error, response}= await weatherClient.GET("/VisualCrossingWebServices/rest/services/timeline/{location}/{startdate}", {
        params: {
          query: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            contentType: "json",
            include: "hours,days,fcst,statsfcst",
            iconSet: "icons1",
          },
          path: {
            location: location,
            startdate: String(getUnixTime(date)),
          }
        }
      });

      if (!data) {
        setError("No response from weather service");
        setDayData(null);
        return;
      }

      const weatherData = data as unknown as WeatherResponse;

      if (error) {
        setError(error);
        setDayData(null);
      } else if (weatherData.days?.[0]) {
        setDayData(weatherData.days[0]);
        setError(null);
      } else {
        setError("No weather data available");
        setDayData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      setDayData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchData();
    }
  }, [date, location]);

  if (error) {
    return (
      <div className={cn("p-6 transition-all duration-200", className)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ultra_violet dark:text-cream">
              {format(date, "EEEE, MMMM d")}
            </h2>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dayData) {
    return (
      <div className={cn("p-6 transition-all duration-200", className)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ultra_violet dark:text-cream">
              {format(date, "EEEE, MMMM d")}
            </h2>
            <div className="flex items-center gap-2 text-steel_blue dark:text-mindaro">
              <span className="material-symbols-outlined text-3xl animate-pulse">
                cloud
              </span>
              <span className="text-2xl font-medium">Loading...</span>
            </div>
          </div>
          <div className="h-[200px] flex items-center justify-center">
            <div className="text-ash_gray dark:text-mindaro/70">
              <p>Loading weather data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hoursData = dayData.hours ?? [];
  const dayStart = new Date(dayData.datetimeEpoch * 1000);
  const startRange = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate(), timeRange.from - 1);
  const endRange = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate(), timeRange.to);

  const hourBasedData = hoursData.filter((hourData) => {
    const thisDate = new Date(hourData.datetimeEpoch * 1000);
    return (isBefore(startRange, thisDate) && isAfter(endRange, thisDate));
  });

  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  Chart.defaults.font.family = "Shantell Sans";

  const chartData = {
    labels: hourBasedData.map((hour) => format(new Date(hour.datetimeEpoch * 1000), "p")),
    datasets: [
      {
        label: 'Temperature',
        data: hourBasedData.map(hour => hour.temp),
        borderColor: '#4a7b9d',
        backgroundColor: 'rgba(74, 123, 157, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Feels Like',
        data: hourBasedData.map(hour => hour.feelslike),
        borderColor: '#e63946',
        backgroundColor: 'rgba(230, 57, 70, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: "Shantell Sans", size: 12 },
          color: '#54577c'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(154, 168, 153, 0.1)' },
        ticks: {
          font: { family: "Shantell Sans", size: 12 },
          color: '#54577c'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "Shantell Sans", size: 12 },
          color: '#54577c'
        }
      },
    },
  };

  const { comment, shouldCancel } = getWeatherComment(dayData.temp, dayData.precipprob, dayData.severerisk);

  return (
    <div className={cn("p-6 transition-all duration-200", className)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ultra_violet dark:text-cream">
            {format(date, "EEEE, MMMM d")}
          </h2>
          <div className="flex items-center gap-2 text-steel_blue dark:text-mindaro">
            <span className="material-symbols-outlined text-3xl">
              {WeatherIcons[dayData.icon]}
            </span>
            <span className="text-2xl font-medium">{dayData.temp}°F</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <WeatherStat 
            icon="thermostat"
            label="Feels Like"
            value={hourBasedData[0]?.feelslike ?? dayData.temp}
            unit="°F"
          />
          <WeatherStat 
            icon="air"
            label="Wind"
            value={dayData.windspeed}
            unit=" mph"
          />
          <WeatherStat 
            icon="water_drop"
            label="Rain Chance"
            value={dayData.precipprob}
            unit="%"
          />
        </div>

        <div className={cn(
          "rounded-lg border p-4",
          shouldCancel 
            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200" 
            : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-200"
        )}>
          <p className="text-sm">{comment}</p>
        </div>

        <div className="h-[200px]">
          {hoursData.length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <div className="flex h-full items-center justify-center text-ash_gray dark:text-mindaro/70">
              <p>No hourly data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


