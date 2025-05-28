import { cn } from '@/lib/utils';
import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js/auto';
import { isAfter, isBefore } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns'

export function WeatherPanel({ dayData, timeRange, className }) {
  console.log(dayData);
  const hoursData = dayData["hours"];

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
  )
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
  }

  return (
    <div className={cn("m-4", className)}>
      <Line
        options={chartOptions}
        data={chartData}
      />
    </div>
  )
}


