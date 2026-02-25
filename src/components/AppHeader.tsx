import { Bell } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <LocationSelector />
      <button className="relative p-2 rounded-full bg-secondary">
        <Bell className="w-5 h-5 text-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
      </button>
    </header>
  );
};

export default AppHeader;
