import { CategoryScale, Chart, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export function WeatherPanel({ dayData }: { dayData: JSON }) {
  const hoursData = dayData["hours"];
  const times: Array<Date> = hoursData.map((hourData) => new Date(hourData["datetimeEpoch"] * 1000));
  const temps: Array<number> = hoursData.map((hourData) => hourData["temp"]);
  const feelsLikes = hoursData.map((hoursData) => hoursData["feelslike"]);

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
    labels: times.map((date) => date.toLocaleTimeString()),
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
    <div>
      <Line
        options={chartOptions}
        data={chartData}
      />
    </div>
  )
}


