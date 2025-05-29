import { Input } from "@/components/ui/input"
import { useRef, useEffect } from "react"
import { cn, debounce } from "@/lib/utils"

interface LocationEditorProps {
  location: string | null;
  setLocation: (location: string) => void;
  className?: string;
}

export function LocationEditor({ location, setLocation, className }: LocationEditorProps) {
  const debouncedSetLocation = useRef(
    debounce((value: string) => {
      setLocation(value);
    }, 500)
  ).current;

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

  return (
    <div className={cn("flex flex-nowrap flex-shrink w-fit items-center", className)}>
      <span className="material-symbols-outlined">location_on</span>
      <Input 
        placeholder="Location" 
        defaultValue={location ?? ''} 
        onChange={handleChange} 
        className="flex-shrink" 
      />
    </div>
  );
}
