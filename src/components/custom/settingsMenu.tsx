import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/lib/themeContext"
import { useUnit } from "@/lib/unitContext"
import { useFont } from "@/lib/fontContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const unitOptions = [
  { value: 'us', label: 'US (°F, mph, miles)', description: 'United States units' },
  { value: 'uk', label: 'UK (°C, mph, miles)', description: 'United Kingdom units' },
  { value: 'metric', label: 'Metric (°C, km/h, km)', description: 'Metric system units' },
  { value: 'base', label: 'Scientific (K, m/s, km)', description: 'Base scientific units' },
] as const;

export function SettingsMenu({ open, onOpenChange }: SettingsMenuProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { unitGroup, setUnitGroup } = useUnit()
  const { useShantellSans, toggleFont } = useFont()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-[90vw] max-w-[320px] sm:w-full mx-auto p-4 sm:p-6 ${useShantellSans ? 'font-["Shantell_Sans"]' : 'font-["Arial"]'}`}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Settings</DialogTitle>
          <DialogDescription className="text-sm">
            Customize your weather dashboard preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Dark Mode
            </label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="font-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Use Shantell Sans Font
            </label>
            <Switch
              id="font-toggle"
              checked={useShantellSans}
              onCheckedChange={toggleFont}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="unit-group" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Unit System
            </label>
            <Select value={unitGroup} onValueChange={(value) => setUnitGroup(value as typeof unitGroup)}>
              <SelectTrigger id="unit-group" className="w-full">
                <SelectValue placeholder="Select unit system" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 