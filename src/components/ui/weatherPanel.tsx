import { cn } from '@/lib/utils';
import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js/auto';
import { isAfter, isBefore, format, getUnixTime } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { type WeatherDayData, type WeatherResponse, type UnitGroup, fetchWeatherData } from '@/lib/visual-crossing-client';
import { useFont } from "@/lib/fontContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WeatherStatProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  onClick?: () => void;
}

function WeatherStat({ icon, label, value, unit = '', onClick }: WeatherStatProps) {
  const Wrapper = onClick ? 'button' : 'div';
  const wrapperClassName = cn(
    "flex items-center gap-2 rounded-lg bg-mindaro/50 p-3 dark:bg-ultra_violet-300/50 w-full text-left",
    onClick && "hover:opacity-80 transition-opacity cursor-pointer"
  );

  return (
    <Wrapper onClick={onClick} className={wrapperClassName}>
      <span className="material-symbols-outlined text-steel_blue dark:text-mindaro">
        {icon}
      </span>
      <div>
        <p className="text-sm text-ash_gray dark:text-mindaro/70">{label}</p>
        <p className="font-medium text-ultra_violet dark:text-cream">
          {value}{unit}
        </p>
      </div>
    </Wrapper>
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
  unitGroup?: UnitGroup;
}

function getWeatherComment(temp: number, precipprob: number, risk: number, unitGroup: UnitGroup) {
  const comments = [];
  let shouldCancel = false;

  // Temperature assessment - convert thresholds based on unit group
  const tempThresholds = {
    us: { freezing: 32, chilly: 65, perfect: 80, hot: 93 },
    uk: { freezing: 0, chilly: 18, perfect: 27, hot: 34 },
    metric: { freezing: 0, chilly: 18, perfect: 27, hot: 34 },
    base: { freezing: 273.15, chilly: 291.15, perfect: 300.15, hot: 307.15 }
  };

  const thresholds = tempThresholds[unitGroup];

  if (temp < thresholds.freezing) {
    comments.push("Below freezing!");
    shouldCancel = true;
  } else if (temp < thresholds.chilly) {
    comments.push("A bit chilly! I recommend a jacket.");
  } else if (temp < thresholds.perfect) {
    comments.push("Perfect temperature!");
  } else if (temp < thresholds.hot) {
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

export function WeatherPanel({ date, location, timeRange, className, unitGroup = 'us' }: WeatherPanelProps) {
  const [dayData, setDayData] = useState<WeatherDayData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTempDialog, setShowTempDialog] = useState(false);
  const [showFeelsLikeDialog, setShowFeelsLikeDialog] = useState(false);
  const [showWindDialog, setShowWindDialog] = useState(false);
  const [showRainDialog, setShowRainDialog] = useState(false);
  const { useShantellSans } = useFont();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const weatherData = await fetchWeatherData({
        location,
        date,
        unitGroup,
      });

      setDayData(weatherData.days[0]);
      setError(null);
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
  }, [date, location, unitGroup]);

  const getUnitSymbol = (type: 'temp' | 'wind' | 'distance' | 'precip') => {
    switch (type) {
      case 'temp':
        return unitGroup === 'us' ? '°F' : unitGroup === 'base' ? 'K' : '°C';
      case 'wind':
        return unitGroup === 'base' ? ' m/s' : unitGroup === 'metric' ? ' kmph' : ' mph';
      case 'distance':
        return unitGroup === 'us' || unitGroup === 'uk' ? ' mi' : ' km';
      case 'precip':
        return unitGroup === 'us' ? ' in' : ' mm';
      default:
        return '';
    }
  };

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
  Chart.defaults.font.family = useShantellSans ? "Shantell Sans" : "Arial";

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
          font: { 
            family: useShantellSans ? "Shantell Sans" : "Arial", 
            size: 12 
          },
          color: '#54577c'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(154, 168, 153, 0.1)' },
        ticks: {
          font: { 
            family: useShantellSans ? "Shantell Sans" : "Arial", 
            size: 12 
          },
          color: '#54577c'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { 
            family: useShantellSans ? "Shantell Sans" : "Arial", 
            size: 12 
          },
          color: '#54577c'
        }
      },
    },
  };

  const { comment, shouldCancel } = getWeatherComment(dayData.temp, dayData.precipprob, dayData.severerisk, unitGroup);

  const temperatureChartData = {
    labels: hourBasedData.map((hour) => format(new Date(hour.datetimeEpoch * 1000), "p")),
    datasets: [
      {
        label: 'Temperature',
        data: hourBasedData.map(hour => hour.temp),
        borderColor: '#4a7b9d',
        backgroundColor: 'rgba(74, 123, 157, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const temperatureChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Temperature Over Time',
        font: {
          size: 16,
          family: useShantellSans ? "Shantell Sans" : "Arial"
        },
        color: '#54577c'
      }
    }
  };

  const feelsLikeChartData = {
    labels: hourBasedData.map((hour) => format(new Date(hour.datetimeEpoch * 1000), "p")),
    datasets: [
      {
        label: 'Feels Like',
        data: hourBasedData.map(hour => hour.feelslike),
        borderColor: '#e63946',
        backgroundColor: 'rgba(230, 57, 70, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const feelsLikeChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Feels Like Temperature Over Time',
        font: {
          size: 16,
          family: useShantellSans ? "Shantell Sans" : "Arial"
        },
        color: '#54577c'
      }
    }
  };

  const windChartData = {
    labels: hourBasedData.map((hour) => format(new Date(hour.datetimeEpoch * 1000), "p")),
    datasets: [
      {
        label: 'Wind Speed',
        data: hourBasedData.map(hour => hour.windspeed),
        borderColor: '#54577c',
        backgroundColor: 'rgba(84, 87, 124, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Wind Gust',
        data: hourBasedData.map(hour => hour.windgust),
        borderColor: '#9aa899',
        backgroundColor: 'rgba(154, 168, 153, 0.5)',
        tension: 0.4,
        borderDash: [5, 5],
      }
    ]
  };

  const windChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Wind Speed Over Time',
        font: {
          size: 16,
          family: useShantellSans ? "Shantell Sans" : "Arial"
        },
        color: '#54577c'
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}${getUnitSymbol('wind')}`;
          }
        }
      }
    }
  };

  const rainChartData = {
    labels: hourBasedData.map((hour) => format(new Date(hour.datetimeEpoch * 1000), "p")),
    datasets: [
      {
        label: 'Precipitation Chance',
        data: hourBasedData.map(hour => hour.precipprob),
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.5)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const rainChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Precipitation Probability Over Time',
        font: {
          size: 16,
          family: useShantellSans ? "Shantell Sans" : "Arial"
        },
        color: '#54577c'
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        min: 0,
        max: 100,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(this: any, value: number | string) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className={cn("p-6 transition-all duration-200", className)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ultra_violet dark:text-cream">
            {format(date, "EEEE, MMMM d")}
          </h2>
          <button
            onClick={() => setShowTempDialog(true)}
            className="flex items-center gap-2 text-steel_blue dark:text-mindaro hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-3xl">
              {WeatherIcons[dayData.icon]}
            </span>
            <span className="text-2xl font-medium">
              {dayData.temp}{getUnitSymbol('temp')}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <WeatherStat 
            icon="thermostat"
            label="Feels Like"
            value={hourBasedData[0]?.feelslike ?? dayData.temp}
            unit={getUnitSymbol('temp')}
            onClick={() => setShowFeelsLikeDialog(true)}
          />
          <WeatherStat 
            icon="air"
            label="Wind"
            value={dayData.windspeed}
            unit={getUnitSymbol('wind')}
            onClick={() => setShowWindDialog(true)}
          />
          <WeatherStat 
            icon="water_drop"
            label="Rain Chance"
            value={dayData.precipprob}
            unit="%"
            onClick={() => setShowRainDialog(true)}
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

        <Dialog open={showFeelsLikeDialog} onOpenChange={setShowFeelsLikeDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Feels Like Temperature Details</DialogTitle>
            </DialogHeader>
            <div className="h-[400px] pt-4">
              {hoursData.length > 0 ? (
                <Line options={feelsLikeChartOptions} data={feelsLikeChartData} />
              ) : (
                <div className="flex h-full items-center justify-center text-ash_gray dark:text-mindaro/70">
                  <p>No hourly data available</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showTempDialog} onOpenChange={setShowTempDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Temperature Details</DialogTitle>
            </DialogHeader>
            <div className="h-[400px] pt-4">
              {hoursData.length > 0 ? (
                <Line options={temperatureChartOptions} data={temperatureChartData} />
              ) : (
                <div className="flex h-full items-center justify-center text-ash_gray dark:text-mindaro/70">
                  <p>No hourly data available</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showWindDialog} onOpenChange={setShowWindDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Wind Speed Details</DialogTitle>
            </DialogHeader>
            <div className="h-[400px] pt-4">
              {hoursData.length > 0 ? (
                <Line options={windChartOptions} data={windChartData} />
              ) : (
                <div className="flex h-full items-center justify-center text-ash_gray dark:text-mindaro/70">
                  <p>No hourly data available</p>
                </div>
              )}
            </div>
            <div className="text-sm text-ash_gray dark:text-mindaro/70 pt-2">
              <p>Dashed line indicates wind gust speed</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRainDialog} onOpenChange={setShowRainDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Precipitation Probability Details</DialogTitle>
            </DialogHeader>
            <div className="h-[400px] pt-4">
              {hoursData.length > 0 ? (
                <Line options={rainChartOptions} data={rainChartData} />
              ) : (
                <div className="flex h-full items-center justify-center text-ash_gray dark:text-mindaro/70">
                  <p>No hourly data available</p>
                </div>
              )}
            </div>
            <div className="text-sm text-ash_gray dark:text-mindaro/70 pt-2">
              <p>Values show the probability of precipitation during each hour</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


