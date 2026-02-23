import { MapPin, Bell, ChevronDown } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Nasarawa</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>
      <button className="relative p-2 rounded-full bg-secondary">
        <Bell className="w-5 h-5 text-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
      </button>
    </header>
  );
};

export default AppHeader;
