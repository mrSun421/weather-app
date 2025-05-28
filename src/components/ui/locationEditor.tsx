import { Input } from "./input"
import { Button } from "./button"


export function LocationEditor({ location, setLocation, isEditingLocation, setIsEditingLocation }) {

  function handleEnter(e) {
    if (e.keyCode === 13) {
      setIsEditingLocation(false);
    }
  }

  function handleChange(e) {
    setLocation(e.target.value);
  }

  if (isEditingLocation) {
    return (
      <div onKeyDown={handleEnter} className="flex flex-nowrap flex-shrink w-fit">
        <span className="material-symbols-outlined">location_on</span>
        <Input placeholder="Location" value={location ?? ''} onChange={handleChange} className="flex-shrink" />
        <Button type="button" onClick={() => setIsEditingLocation(false)} className="flex-shrink">Set Location</Button>
      </div>
    )
  } else {
    return (
      <div className="flex flex-nowrap py-2">
        <span className="material-symbols-outlined">location_on</span>

        <p onClick={() => setIsEditingLocation(true)} className="flex-shrink hover:underline hover:underline-offset-2">{location ? location : "Add a location for your event!"}</p>
      </div>
    )

  }


}
