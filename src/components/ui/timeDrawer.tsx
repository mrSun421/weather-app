"use client"

import { Button } from "@/components/ui/button"
import { TimePickerWithRange } from "@/components/ui/timePicker"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { type TimeRange } from "@/types/time"

interface TimeDrawerProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export function TimeDrawer({
  timeRange,
  setTimeRange,
}: TimeDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto justify-start text-left font-normal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" className="mr-2 text-steel_blue dark:text-mindaro">
            <path fill="currentColor" d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
          </svg>
          {format(new Date().setHours(timeRange.from, 0), 'p')} - {format(new Date().setHours(timeRange.to, 0), 'p')}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:mx-auto sm:max-w-[425px]">
        <DrawerHeader className="flex h-[40px] items-center border-b sm:text-xl pb-2">
          <DrawerTitle>Select Time Range</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[calc(35vh-40px)] sm:h-[220px] pt-2">
          <div className="flex min-h-full items-center justify-center p-2 pb-4">
            <div className="sm:origin-top p-2 sm:p-4">
              <TimePickerWithRange 
                timeRange={timeRange} 
                setTimeRange={setTimeRange}
              />
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
} 