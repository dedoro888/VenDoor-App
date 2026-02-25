import { useState } from "react";
import { MapPin, Clock, Percent, DollarSign, Star, X, SlidersHorizontal } from "lucide-react";

export interface Filters {
  openNow: boolean;
  minDiscount: number;
  priceRange: [number, number];
  minRating: number;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const chips = [
    { id: "open", label: "Open Now", icon: Clock, active: filters.openNow },
    { id: "discount", label: filters.minDiscount > 0 ? `${filters.minDiscount}%+ Off` : "Discount", icon: Percent, active: filters.minDiscount > 0 },
    { id: "price", label: filters.priceRange[1] < 10000 ? `Under ₦${(filters.priceRange[1] / 1000).toFixed(0)}k` : "Price", icon: DollarSign, active: filters.priceRange[1] < 10000 },
    { id: "rating", label: filters.minRating > 0 ? `${filters.minRating}★+` : "Rating", icon: Star, active: filters.minRating > 0 },
  ];

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  return (
    <div className="px-5 mb-3">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        <button
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-secondary text-xs font-medium text-foreground"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => {
                if (chip.id === "open") {
                  onChange({ ...filters, openNow: !filters.openNow });
                } else {
                  toggle(chip.id);
                }
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                chip.active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Expanded filter panels */}
      {expanded === "discount" && (
        <div className="mt-2 p-3 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Min Discount</span>
            <button onClick={() => { onChange({ ...filters, minDiscount: 0 }); setExpanded(null); }} className="text-xs text-muted-foreground">Reset</button>
          </div>
          <input
            type="range" min={0} max={50} step={5}
            value={filters.minDiscount}
            onChange={(e) => onChange({ ...filters, minDiscount: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <span className="text-xs text-muted-foreground">{filters.minDiscount}% off</span>
        </div>
      )}

      {expanded === "price" && (
        <div className="mt-2 p-3 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Max Price</span>
            <button onClick={() => { onChange({ ...filters, priceRange: [0, 10000] }); setExpanded(null); }} className="text-xs text-muted-foreground">Reset</button>
          </div>
          <input
            type="range" min={1000} max={10000} step={500}
            value={filters.priceRange[1]}
            onChange={(e) => onChange({ ...filters, priceRange: [0, Number(e.target.value)] })}
            className="w-full accent-primary"
          />
          <span className="text-xs text-muted-foreground">Up to ₦{filters.priceRange[1].toLocaleString()}</span>
        </div>
      )}

      {expanded === "rating" && (
        <div className="mt-2 p-3 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Min Rating</span>
            <button onClick={() => { onChange({ ...filters, minRating: 0 }); setExpanded(null); }} className="text-xs text-muted-foreground">Reset</button>
          </div>
          <div className="flex gap-2">
            {[3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => { onChange({ ...filters, minRating: r }); setExpanded(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  filters.minRating === r ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                {r}★+
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
