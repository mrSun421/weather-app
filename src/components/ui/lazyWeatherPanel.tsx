import { useEffect, useRef, useState } from 'react';
import { WeatherPanel } from './weatherPanel';

interface LazyWeatherPanelProps {
  date: Date;
  location: string;
  timeRange: {
    from: number;
    to: number;
  };
  className?: string;
}

export function LazyWeatherPanel(props: LazyWeatherPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={props.className}>
      {isVisible ? (
        <WeatherPanel {...props} />
      ) : (
        <div className="p-6 transition-all duration-200">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-ash_gray/20 animate-pulse rounded" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-ash_gray/20 animate-pulse rounded" />
                <div className="h-8 w-16 bg-ash_gray/20 animate-pulse rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-ash_gray/20 animate-pulse rounded" />
              ))}
            </div>
            <div className="h-32 bg-ash_gray/20 animate-pulse rounded" />
            <div className="h-[200px] bg-ash_gray/20 animate-pulse rounded" />
          </div>
        </div>
      )}
    </div>
  );
} 