import { useState } from "react";
import { ArrowLeft, Star, Wallet, ClipboardList, MapPin, Moon, Sun, LogOut, Trash2, ChevronRight, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { foodItems, shops } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";

const FourPointStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { orders } = useCart();
  const { favouriteFoods, favouriteShops } = useFavourites();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("VenDoor User");
  const [nickname, setNickname] = useState("foodie");
  const [location, setLocation] = useState("Nasarawa");

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const favFoodItems = foodItems.filter((f) => favouriteFoods.includes(f.id));
  const favShopItems = shops.filter((s) => favouriteShops.includes(s.id));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <button onClick={() => navigate("/")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-primary">
          {name.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-foreground mt-3">{name}</h1>
        <p className="text-sm text-muted-foreground">@{nickname}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 px-5 mb-6">
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1.5 w-24 py-3 rounded-2xl bg-secondary">
          <FourPointStar className="w-6 h-6 text-vendoor-red" />
          <span className="text-xs font-medium text-foreground">Favourites</span>
        </button>
        <div className="relative flex flex-col items-center gap-1.5 w-24 py-3 rounded-2xl bg-secondary opacity-50">
          <Wallet className="w-6 h-6 text-vendoor-green" />
          <span className="text-xs font-medium text-foreground">Wallet</span>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground rotate-[-15deg]">Coming Soon</span>
        </div>
        <button onClick={() => navigate("/orders")} className="flex flex-col items-center gap-1.5 w-24 py-3 rounded-2xl bg-secondary">
          <ClipboardList className="w-6 h-6 text-foreground" />
          <span className="text-xs font-medium text-foreground">Orders</span>
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl bg-secondary p-4">
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-lg font-bold text-foreground">{orders.length}</p>
          </div>
          <div className="flex-1 rounded-2xl bg-secondary p-4">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold text-primary">₦{totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Favourite Dishes */}
      {favFoodItems.length > 0 && (
        <div className="px-5 mb-4">
          <h3 className="text-base font-bold text-foreground mb-2">Favourite Dishes</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {favFoodItems.map((f) => (
              <div key={f.id} className="flex-shrink-0 w-28 rounded-xl bg-secondary overflow-hidden">
                <img src={f.image} alt={f.name} className="w-full h-20 object-cover" />
                <p className="text-xs font-medium text-foreground p-2 truncate">{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favourite Vendors */}
      {favShopItems.length > 0 && (
        <div className="px-5 mb-4">
          <h3 className="text-base font-bold text-foreground mb-2">Favourite Vendors</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {favShopItems.map((s) => (
              <div key={s.id} className="flex-shrink-0 w-28 rounded-xl bg-secondary overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-20 object-cover" />
                <p className="text-xs font-medium text-foreground p-2 truncate">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-5 mb-4">
        <h3 className="text-base font-bold text-foreground mb-2">Settings</h3>
        <div className="rounded-2xl bg-secondary divide-y divide-border overflow-hidden">
          <button onClick={() => setShowEdit(true)} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Edit Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              {isDark ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm font-medium text-foreground">{isDark ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Saved Places</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="px-5 mb-32">
        <div className="rounded-2xl bg-secondary divide-y divide-border overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 text-left">
            <LogOut className="w-4 h-4 text-vendoor-orange" />
            <span className="text-sm font-medium text-vendoor-orange">Log Out</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 text-left">
            <Trash2 className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Delete Account</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Sheet */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowEdit(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="relative w-full max-w-md bg-card rounded-t-3xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-4">Edit Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Nickname</label>
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground outline-none" />
              </div>
            </div>
            <button onClick={() => setShowEdit(false)} className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
              Save Changes
            </button>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </div>
  );
};

export default ProfilePage;
