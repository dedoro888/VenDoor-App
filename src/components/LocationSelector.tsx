import { useState, useCallback } from "react";
import { MapPin, X, Check, Navigation, Search, Loader2 } from "lucide-react";
import { locations } from "@/data/mockData";
import { useLocation } from "@/contexts/LocationContext";

const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const { location, setLocation, detectLocation, detecting } = useLocation();
  const [search, setSearch] = useState("");

  const filtered = search
    ? locations.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()))
    : locations;

  const handleDetect = async () => {
    await detectLocation();
    setOpen(false);
  };

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
            className="relative w-full max-w-md bg-card rounded-t-3xl p-5 pb-8 slide-up-from-nav"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Select Delivery Location</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full bg-muted">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl mb-3" style={{ background: "hsl(var(--muted))" }}>
              <Search className="w-4 h-4" style={{ color: "hsl(var(--muted-foreground))" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for your location"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "hsl(var(--foreground))" }}
              />
            </div>

            {/* Use Current Location */}
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-3 transition-colors active:scale-[0.98]"
              style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}
            >
              {detecting ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--primary))" }} />
              ) : (
                <Navigation className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
              )}
              <span className="text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>
                {detecting ? "Detecting..." : "Use Current Location"}
              </span>
            </button>

            {/* Location list */}
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {filtered.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { setLocation(loc); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location === loc ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {loc}
                  </span>
                  {location === loc && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center py-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  No locations found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationSelector;
