import { EventPanel } from "./components/ui/eventPanel.tsx";

function App() {
  // const [weatherData, setWeatherData] = useState({});

  // useEffect(() => {
  //    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Atlanta?key=${import.meta.env.VITE_WEATHER_API_KEY}&unitGroup=us&contentType=json`)
  //      .then((res) => res.json())
  //      .then((data) => setWeatherData(data))
  //      .catch((err) => console.error(err));
  // });

  return (
    <div className="m-8">
      <EventPanel />
    </div>
  );
}

export default App
