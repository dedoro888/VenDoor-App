import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, Navigation, Search, Loader2, MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";

/* ── custom pin icon ── */
const pinIcon = new L.DivIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)">
    <div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:hsl(24 95% 58%);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3)">
      <div style="width:14px;height:14px;border-radius:50%;background:white;transform:rotate(45deg)"></div>
    </div>
    <div style="width:6px;height:6px;border-radius:50%;background:hsl(24 95% 58%/.4);margin-top:4px"></div>
  </div>`,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
});

/* ── reverse geocode helper ── */
const reverseGeocode = async (lat: number, lng: number): Promise<{ display: string; sub: string }> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    );
    const data = await res.json();
    const a = data.address;
    const display =
      a?.road || a?.suburb || a?.city_district || a?.neighbourhood || a?.city || a?.town || "Selected Location";
    const sub = [a?.city || a?.town, a?.state].filter(Boolean).join(", ") || data.display_name?.slice(0, 60) || "";
    return { display, sub };
  } catch {
    return { display: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, sub: "" };
  }
};

/* ── forward search helper ── */
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const searchPlaces = async (q: string): Promise<SearchResult[]> => {
  if (q.length < 3) return [];
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`
  );
  return res.json();
};

/* ── Main component ── */
interface LocationMapProps {
  onClose: () => void;
  onConfirm: (address: string, coords: { lat: number; lng: number }) => void;
}

const LocationMap = ({ onClose, onConfirm }: LocationMapProps) => {
  const { coordinates } = useLocation();
  const defaultCenter: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : [9.0579, 7.4951];

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [address, setAddress] = useState({ display: "Move map to select", sub: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: defaultCenter[0], lng: defaultCenter[1] });
  const [detectingGPS, setDetectingGPS] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* Initialize map */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const marker = L.marker(defaultCenter, { icon: pinIcon }).addTo(map);
    markerRef.current = marker;
    mapRef.current = map;

    map.on("moveend", () => {
      const c = map.getCenter();
      marker.setLatLng(c);
      setCurrentCoords({ lat: c.lat, lng: c.lng });
      setLoading(true);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const result = await reverseGeocode(c.lat, c.lng);
        setAddress(result);
        setLoading(false);
      }, 400);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  /* search input */
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    if (val.length < 3) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const r = await searchPlaces(val);
      setResults(r);
      setSearching(false);
    }, 300);
  }, []);

  const selectResult = (r: SearchResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    mapRef.current?.flyTo([lat, lng], 16, { duration: 1 });
    setSearch("");
    setResults([]);
  };

  /* GPS detect */
  const handleGPS = async () => {
    if (!navigator.geolocation) return;
    setDetectingGPS(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { duration: 1 });
    } catch {
      // silently fail
    } finally {
      setDetectingGPS(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-3 pb-2 bg-background">
        <button onClick={onClose} className="p-2 rounded-full bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-bold text-foreground">Select Delivery Location</h2>
      </div>

      {/* Search bar */}
      <div className="relative z-10 px-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-muted">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for your location"
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
          {searching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>

        {results.length > 0 && (
          <div className="absolute left-4 right-4 mt-1 bg-card rounded-xl shadow-lg border border-border overflow-hidden max-h-52 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.place_id}
                onClick={() => selectResult(r)}
                className="w-full flex items-start gap-2 px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-foreground line-clamp-2">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* GPS button */}
        <button
          onClick={handleGPS}
          disabled={detectingGPS}
          className="absolute bottom-28 right-4 z-10 p-3 rounded-full bg-card shadow-lg border border-border active:scale-95 transition-transform"
        >
          {detectingGPS ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <Navigation className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      {/* Bottom address card + confirm */}
      <div className="bg-card border-t border-border px-5 pt-4 pb-6 rounded-t-3xl -mt-4 relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/10 mt-0.5">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Finding address...</span>
              </div>
            ) : (
              <>
                <p className="font-semibold text-foreground truncate">{address.display}</p>
                {address.sub && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{address.sub}</p>
                )}
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => onConfirm(address.display, currentCoords)}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default LocationMap;
