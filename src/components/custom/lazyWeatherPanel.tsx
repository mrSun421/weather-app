import { useEffect, useRef, useState } from 'react';
import { WeatherPanel } from '@/components/custom/weatherPanel';
import { type UnitGroup } from '@/lib/visual-crossing-client';

interface LazyWeatherPanelProps {
  date: Date;
  location: string;
  timeRange: {
    from: number;
    to: number;
  };
  className?: string;
  unitGroup?: UnitGroup;
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
        <div className="p-6 space-y-4 transition-all duration-200">
          <div className="h-8 w-48 bg-ash_gray/20 animate-pulse rounded" />
          <div className="h-40 bg-ash_gray/20 animate-pulse rounded" />
          <div className="h-[200px] bg-ash_gray/20 animate-pulse rounded" />
        </div>
      )}
    </div>
  );
} 