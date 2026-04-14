import { createContext, useContext, useState, ReactNode } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationContextType {
  location: string;
  coordinates: Coordinates | null;
  setLocation: (loc: string) => void;
  setCoordinates: (coords: Coordinates | null) => void;
  setLocationWithCoords: (loc: string, coords: Coordinates) => void;
  detectLocation: () => Promise<void>;
  detecting: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocationState] = useState(() => localStorage.getItem("vendoor-location") || "Nasarawa");
  const [coordinates, setCoordinatesState] = useState<Coordinates | null>(null);
  const [detecting, setDetecting] = useState(false);

  const setLocation = (loc: string) => {
    setLocationState(loc);
    localStorage.setItem("vendoor-location", loc);
  };

  const setCoordinates = (coords: Coordinates | null) => {
    setCoordinatesState(coords);
  };

  const setLocationWithCoords = (loc: string, coords: Coordinates) => {
    setLocation(loc);
    setCoordinates(coords);
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = pos.coords;
      setCoordinates({ lat: latitude, lng: longitude });

      // Reverse geocode with Nominatim
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
        const data = await res.json();
        const addr = data.address;
        const name = addr?.suburb || addr?.city_district || addr?.city || addr?.town || addr?.state || "Your Location";
        setLocation(name);
      } catch {
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch {
      // Permission denied or error
    } finally {
      setDetecting(false);
    }
  };

  return (
    <LocationContext.Provider value={{ location, coordinates, setLocation, setCoordinates, setLocationWithCoords, detectLocation, detecting }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
};
