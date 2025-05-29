import { format } from "date-fns"
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"

type TimePreset = 'day' | 'morning' | 'afternoon' | 'evening' | 'custom';

interface TimeRange {
  preset: TimePreset;
  from: number;
  to: number;
}

interface TimePickerWithRangeProps {
  className?: string;
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}

export function TimePickerWithRange({ className, timeRange, setTimeRange }: TimePickerWithRangeProps) {

  function handleStartingTimeUpdate(value: string) {
    let newTimeRange: TimeRange = {
      preset: "custom",
      from: timeRange.from,
      to: timeRange.to,
    };
    const numVal = Number(value);
    newTimeRange.from = numVal;
    if (numVal >= timeRange.to) {
      newTimeRange.to = numVal + 1;
    }
    setTimeRange(newTimeRange);
  }
  function handleEndingTimeUpdate(value: string) {
    let newTimeRange: TimeRange = {
      preset: "custom",
      from: timeRange.from,
      to: timeRange.to,
    };
    const numVal = Number(value);
    newTimeRange.to = numVal;
    if (numVal <= timeRange.from) {
      newTimeRange.from = numVal - 1;
    }
    setTimeRange(newTimeRange);
  }

  return (<div className={cn("flex gap-2", className)}>
    <Select value={`${timeRange.from}`} onValueChange={handleStartingTimeUpdate}>
      <SelectTrigger className="w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Start Time</SelectLabel>
          {[...Array(24).keys()].map((i) => {
            return (<SelectItem key={i} value={`${i}`}>{format(new Date(1970, 0, 0, i), "p")}</SelectItem>)
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
    <p className="text-nowrap text-sm py-2"> to </p>
    <Select value={`${timeRange.to}`} onValueChange={handleEndingTimeUpdate}>
      <SelectTrigger className="w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>End Time</SelectLabel>
          {[...Array(24).keys()].map((i) => {
            return (<SelectItem key={i} value={`${i + 1}`}>{format(new Date(1970, 0, 0, i + 1), "p")}</SelectItem>)
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>)
}
