import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { WeatherPanel } from "./weatherPanel";

type WeatherIcon = "snow" | "rain" | "fog" | "wind" | "cloudy" | "partly-cloudy-day" | "partly-cloudy-night" | "clear-day" | "clear-night";

interface WeatherDay {
  datetimeEpoch: number;
  hours?: Array<{
    datetimeEpoch: number;
    temp: number;
    feelslike: number;
  }>;
  temp: number;
  precipprob: number;
  severerisk: number;
  icon: WeatherIcon;
  windspeed: number;
}

interface WeatherCarouselProps {
  weatherData: {
    days: WeatherDay[];
  };
  timeRange: {
    preset: string;
    from: number;
    to: number;
  };
}

export function WeatherCarousel({ weatherData, timeRange }: WeatherCarouselProps) {
  const weeklyData = weatherData.days.filter((_, i) => i % 7 === 0);

  return (
    <Carousel 
      className="w-full max-w-4xl" 
      opts={{
        align: "center",
        slidesToScroll: 1,
        breakpoints: {
          '(min-width: 1024px)': { slidesToScroll: 2 }
        }
      }}
    >
      <CarouselContent className="-ml-4">
        {weeklyData.map((dayData, i) => (
          <CarouselItem key={dayData.datetimeEpoch} className="pl-4 basis-full lg:basis-1/2">
            <div className="animate-in" style={{ animationDelay: `${i * 100}ms` }}>
              <WeatherPanel
                dayData={dayData}
                timeRange={timeRange}
                className="hover-card rounded-xl bg-cream/70 backdrop-blur-sm dark:bg-ultra_violet-400/70"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-12" />
      <CarouselNext className="-right-12" />
    </Carousel>
  );
} 