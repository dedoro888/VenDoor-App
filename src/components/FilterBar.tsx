import { useState } from "react";
import { Clock, Percent, DollarSign, Star, X, Bike, MapPin, Check } from "lucide-react";

export interface Filters {
  openNow: boolean;
  minDiscount: number;
  priceRange: [number, number];
  minRating: number;
  maxDistance: number;
  maxDeliveryTime: number;
  freeDelivery: boolean;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose: () => void;
  defaultFilters: Filters;
}

// NAV_HEIGHT: the bottom nav is approx 76px tall (pill + padding)
const NAV_HEIGHT = 76;

const FilterBar = ({ filters, onChange, onClose, defaultFilters }: FilterBarProps) => {
  const [draft, setDraft] = useState<Filters>({ ...filters });

  const handleApply = () => {
    onChange(draft);
    onClose();
  };

  const handleReset = () => {
    setDraft({ ...defaultFilters });
    onChange(defaultFilters);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md mx-auto bg-card rounded-t-3xl p-5 animate-slide-up shadow-2xl"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          paddingBottom: `calc(${NAV_HEIGHT}px + 1.25rem)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground">Filters</h3>
          <button onClick={onClose} className="p-1.5 rounded-full bg-muted">
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Toggles */}
          <div className="flex gap-3">
            <button
              onClick={() => setDraft({ ...draft, openNow: !draft.openNow })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                draft.openNow ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <Clock className="w-4 h-4" /> Open Now
            </button>
            <button
              onClick={() => setDraft({ ...draft, freeDelivery: !draft.freeDelivery })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                draft.freeDelivery ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <Bike className="w-4 h-4" /> Free Delivery
            </button>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Max Price</span>
              </div>
              <span className="text-sm font-bold text-primary">₦{draft.priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range" min={1000} max={10000} step={500}
              value={draft.priceRange[1]}
              onChange={(e) => setDraft({ ...draft, priceRange: [0, Number(e.target.value)] })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₦1,000</span><span>₦10,000</span>
            </div>
          </div>

          {/* Distance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Max Distance</span>
              </div>
              <span className="text-sm font-bold text-primary">{draft.maxDistance} km</span>
            </div>
            <input
              type="range" min={1} max={30} step={1}
              value={draft.maxDistance}
              onChange={(e) => setDraft({ ...draft, maxDistance: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 km</span><span>30 km</span>
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Max Delivery Time</span>
              </div>
              <span className="text-sm font-bold text-primary">{draft.maxDeliveryTime} min</span>
            </div>
            <input
              type="range" min={10} max={60} step={5}
              value={draft.maxDeliveryTime}
              onChange={(e) => setDraft({ ...draft, maxDeliveryTime: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10 min</span><span>60 min</span>
            </div>
          </div>

          {/* Discount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Min Discount</span>
              </div>
              <span className="text-sm font-bold text-primary">{draft.minDiscount}%</span>
            </div>
            <input
              type="range" min={0} max={50} step={5}
              value={draft.minDiscount}
              onChange={(e) => setDraft({ ...draft, minDiscount: Number(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span><span>50%</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Min Rating</span>
            </div>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setDraft({ ...draft, minRating: r })}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    draft.minRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 py-3 rounded-2xl bg-muted text-sm font-bold text-foreground"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-2 flex-grow py-3 px-6 rounded-2xl text-sm font-bold text-primary-foreground flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
          >
            <Check className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
