"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) {
      setDateRange(undefined)
      return
    }
    setDateRange({
      from: date,
      to: dateRange?.to
    })
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) {
      setDateRange(undefined)
      return
    }
    // If no start date is selected, or if end date is before start date,
    // set the end date as undefined
    if (!dateRange?.from || date < dateRange.from) {
      setDateRange({
        from: dateRange?.from,
        to: undefined
      })
      return
    }
    setDateRange({
      from: dateRange.from,
      to: date
    })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Drawer>
        <DrawerTrigger asChild>
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
        </DrawerTrigger>
        <DrawerContent className="sm:mx-auto sm:max-w-[800px]">
          <DrawerHeader className="flex h-[60px] items-center border-b sm:text-xl">
            <DrawerTitle>Select Date Range</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="h-[calc(80vh-60px)] sm:h-[600px] pt-2 sm:pt-6">
            <div className="flex min-h-full items-center justify-center p-4 pb-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-16">
                <div className="sm:scale-125 sm:origin-top p-4 sm:p-8">
                  <div className="text-center mb-2 font-medium">Start Date</div>
                  <Calendar
                    initialFocus
                    mode="single"
                    selected={dateRange?.from}
                    onSelect={handleStartDateSelect}
                    numberOfMonths={1}
                    defaultMonth={dateRange?.from}
                    toDate={dateRange?.to}
                  />
                </div>
                <div className="sm:scale-125 sm:origin-top p-4 sm:p-8">
                  <div className="text-center mb-2 font-medium">End Date</div>
                  <Calendar
                    initialFocus
                    mode="single"
                    selected={dateRange?.to}
                    onSelect={handleEndDateSelect}
                    numberOfMonths={1}
                    defaultMonth={dateRange?.to ?? dateRange?.from}
                    fromDate={dateRange?.from}
                    disabled={!dateRange?.from}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
