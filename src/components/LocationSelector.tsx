import { useState } from "react";
import { MapPin, X, Check } from "lucide-react";
import { locations } from "@/data/mockData";
import { useLocation } from "@/contexts/LocationContext";

const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const { location, setLocation } = useLocation();

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-base font-bold text-foreground">{location}</span>
        <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-card rounded-t-3xl p-5 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Select Location</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full bg-secondary">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { setLocation(loc); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location === loc ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {loc}
                  </span>
                  {location === loc && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationSelector;
