import { cn } from '@/lib/utils';
import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js/auto';
import { isAfter, isBefore } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns'

const WeatherIcons = {
  "snow": "weather_snowy",
  "rain": "rainy",
  "fog": "foggy",
  "wind	": "air",
  "cloudy": "cloud",
  "partly-cloudy-day": "partly_cloudy_day",
  "partly-cloudy-night": "partly_cloudy_night",
  "clear-day": "clear_day",
  "clear-night": "clear_night",
}

type WeatherIcon = keyof typeof WeatherIcons;
type WeatherIconValue = typeof WeatherIcons[WeatherIcon];

export function WeatherPanel({ dayData, timeRange, className }) {
  const hoursData = dayData["hours"] ?? [];

  const dayStart = new Date(dayData["datetimeEpoch"] * 1000);
  const startRange = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate(), timeRange.from - 1);
  const endRange = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate(), timeRange.to);

  const hourBasedData = hoursData.filter((hourData) => {
    const thisDate = new Date(hourData["datetimeEpoch"] * 1000);
    return (isBefore(startRange, thisDate) && isAfter(endRange, thisDate))
  });

  const times: Array<Date> = hourBasedData.map((hourData) => new Date(hourData["datetimeEpoch"] * 1000));
  const temps: Array<number> = hourBasedData.map((hourData) => hourData["temp"]);
  const feelsLikes = hourBasedData.map((hoursData) => hoursData["feelslike"]);

  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
  Chart.defaults.font.family = "Shantell Sans";
  const chartData = {
    labels: times.map((date) => format(date, "p")),
    datasets: [
      {
        label: 'temperature',
        data: temps,
      },
      {
        label: '"feels like" temperature',
        data: feelsLikes,
      }

    ]
  }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  let weatherComment = "";
  let shouldCancel = false;
  const temp = dayData["temp"];
  if (temp < 32.0) {
    weatherComment += "Below freezing!\n";
    shouldCancel = true;
  } else if (temp >= 32.0 && temp < 65.0) {
    weatherComment += "A bit chilly! I recommend a jacket.\n";
  } else if (temp >= 65.0 && temp < 80.0) {
    weatherComment += "Perfect temperature!\n";
  } else if (temp >= 80.0 && temp < 93.0) {
    weatherComment += "A Bit hot! I recommend shorts.\n";
  } else if (temp >= 93.0) {
    weatherComment += "Too hot!\n";
  }
  const precipprob = dayData["precipprob"];
  if (precipprob < 30) {
    weatherComment += "Low chance of rain.\n";
  } else if (precipprob >= 30 && precipprob < 70) {
    weatherComment += "Medium chance of rain. Bring an umbrella just in case.\n";
  } else if (precipprob >= 70) {
    weatherComment += "High chance of rain.\n";
    shouldCancel = true;
  }
  const risk = dayData["severerisk"];
  if (risk >= 70) {
    shouldCancel = true;
  }

  if (shouldCancel) {
    weatherComment += "I recommend you cancel.\n";
  }

  return (
    <div className={cn("m-4", className)}>
      <div className='grid justify-center' >
        <p className='text-2xl py-2'>{format(dayStart, "EEEE PPP")} </p>
      </div>
      <div className='grid justify-between gap-2 grid-cols-2'>
        <div className='row-span-3 grid justify-end'>
          <div className='flex gap-2 items-center'>
            <span className='material-symbols-outlined'>{WeatherIcons[dayData["icon"]]}</span>
            <p className={`text-lg ${shouldCancel ? 'destructive-500' : ''}`}>{weatherComment}</p>

          </div>
        </div>
        <div className='flex'>
          <span className="material-symbols-outlined">Thermostat</span>
          <p className='text-lg'>{dayData["temp"]} F&#176;</p>
        </div>
        <div className='flex'>
          <span className="material-symbols-outlined"> air </span>
          <p className='text-lg'>{dayData["windspeed"]} mph </p>
        </div>
        <div className='flex'>
          <span className="material-symbols-outlined">water_drop</span>
          <p className='text-lg'>{dayData["precipprob"]}&#37;</p>
        </div>
      </div>
      {
        hoursData.length !== 0 ? <Line
          options={chartOptions}
          data={chartData}
        /> : (
          <p>No Data Available.</p>
        )
      }

    </div>
  )
}


