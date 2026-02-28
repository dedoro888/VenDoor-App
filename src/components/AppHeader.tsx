import { Bell, SlidersHorizontal } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";

interface AppHeaderProps {
  onFilterTap?: () => void;
  hasActiveFilters?: boolean;
}

const AppHeader = ({ onFilterTap, hasActiveFilters }: AppHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <LocationSelector />
      <div className="flex items-center gap-2">
        {onFilterTap && (
          <button
            onClick={onFilterTap}
            className={`relative p-2 rounded-full transition-colors ${
              hasActiveFilters ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-foreground border border-primary" />
            )}
          </button>
        )}
        <button className="relative p-2 rounded-full bg-secondary">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
