"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  dateRange: DateRange | undefined
  setDateRange: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  dateRange,
  setDateRange
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="dateRange"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  <span className="hidden sm:inline">
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </span>
                  <span className="sm:hidden">
                    {format(dateRange.from, "MM/dd")} -{" "}
                    {format(dateRange.to, "MM/dd")}
                  </span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {format(dateRange.from, "LLL dd, y")}
                  </span>
                  <span className="sm:hidden">
                    {format(dateRange.from, "MM/dd")}
                  </span>
                </>
              )
            ) : (
              <span className="text-sm">Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={window?.innerWidth >= 640 ? 2 : 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
