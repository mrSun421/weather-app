import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LazyWeatherPanel } from "./lazyWeatherPanel";

interface WeatherCarouselProps {
  dates: Date[];
  location: string;
  timeRange: {
    from: number;
    to: number;
  };
}

export function WeatherCarousel({ dates, location, timeRange }: WeatherCarouselProps) {
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
      <CarouselContent>
        {dates.map((date) => (
          <CarouselItem key={date.getTime()} className="sm:basis-1/2">
            <LazyWeatherPanel
              date={date}
              location={location}
              timeRange={timeRange}
              className="h-full"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
} 