import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LazyWeatherPanel } from "./lazyWeatherPanel";
import { Button } from "./button";
import { type UnitGroup } from '@/lib/visual-crossing-client';

interface WeatherCarouselProps {
  dates: Date[];
  location: string;
  timeRange: {
    from: number;
    to: number;
  };
  onExtend: () => void;
  unitGroup?: UnitGroup;
}

export function WeatherCarousel({ dates, location, timeRange, onExtend, unitGroup = 'us' }: WeatherCarouselProps) {
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
              unitGroup={unitGroup}
            />
          </CarouselItem>
        ))}
        <CarouselItem className="sm:basis-1/2">
          <div className="flex items-center justify-center h-full min-h-[300px] rounded-xl border border-dashed transition-colors hover:border-primary dark:hover:border-primary">
            <Button 
              variant="ghost" 
              onClick={onExtend}
              className="flex flex-col items-center gap-4 p-8 hover:bg-transparent active:scale-95 transition-transform active:bg-accent dark:active:bg-secondary rounded-lg w-full h-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform active:scale-90">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add Next Week's Weather</span>
            </Button>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}