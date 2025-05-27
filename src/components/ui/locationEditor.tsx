import { Input } from "./input"
import { Button } from "./button"

export function LocationEditor({ location, setLocation, isEditingLocation, setIsEditingLocation }) {

  function handleEnter(e) {
    if (e.keyCode === 13) {
      console.log(e);
      setIsEditingLocation(false);
    }
  }

  function handleChange(e) {
    setLocation(e.target.value);
  }

  if (isEditingLocation) {
    return (
      <div onKeyDown={handleEnter}>
        <Input placeholder="Location" value={location ?? ''} onChange={handleChange} className="" />
        <Button type="button" onClick={() => setIsEditingLocation(false)}>Set Location</Button>
      </div>
    )
  } else {
    return (
      <p onClick={() => setIsEditingLocation(true)}>{location ? location : "Add a location for your event!"}</p>
    )

  }


}
