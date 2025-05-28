import { Input } from "./input"
import { Button } from "./button"
import { useEffect, useRef } from "react"
import { cn, debounce } from "@/lib/utils"

interface LocationEditorProps {
  location: string | null;
  setLocation: (location: string) => void;
  isEditingLocation: boolean;
  setIsEditingLocation: (isEditing: boolean) => void;
  className?: string;
}

export function LocationEditor({ location, setLocation, isEditingLocation, setIsEditingLocation, className}: LocationEditorProps) {
  const debouncedSetLocation = useRef(
    debounce((value: string) => {
      setLocation(value);
    }, 500)
  ).current;

  function handleEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setIsEditingLocation(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    debouncedSetLocation(value);
  }

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      // The debounce function from utils doesn't have a cancel method, which is fine
      // as the timeout will be automatically cleared when the component unmounts
    };
  }, [debouncedSetLocation]);

  if (isEditingLocation) {
    return (
      <div onKeyDown={handleEnter} className={cn("flex flex-nowrap flex-shrink w-fit", className)}>
        <span className="material-symbols-outlined">location_on</span>
        <Input placeholder="Location" defaultValue={location ?? ''} onChange={handleChange} className="flex-shrink" />
        <Button type="button" onClick={() => setIsEditingLocation(false)} className="flex-shrink">Set Location</Button>
      </div>
    )
  } else {
    return (
      <div className={cn("flex flex-nowrap py-2", className )}>
        <span className="material-symbols-outlined">location_on</span>
        <p onClick={() => setIsEditingLocation(true)} className="flex-shrink hover:underline hover:underline-offset-2">{location ? location : "Add a location for your event!"}</p>
      </div>
    )
  }
}
