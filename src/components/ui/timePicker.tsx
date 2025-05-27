import { format } from "date-fns"
import { Button } from "./button"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
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


export function TimePickerWithRange({ className, timeRange, setTimeRange }) {

  function handleStartingTimeUpdate(value) {
    let newTimeRange = {
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
  function handleEndingTimeUpdate(value) {
    let newTimeRange = {
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
    <Select value={`${timeRange.from}`} onValueChange={handleStartingTimeUpdate} disabled={timeRange.preset !== "custom"} >
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
      <p> to </p>
    </Select>
    <Select value={`${timeRange.to}`} onValueChange={handleEndingTimeUpdate} disabled={timeRange.preset !== "custom"} >
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
