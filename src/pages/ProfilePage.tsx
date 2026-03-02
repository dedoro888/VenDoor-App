import { useState, useRef } from "react";
import { Wallet, ClipboardList, Moon, Sun, LogOut, Trash2, ChevronRight, Edit3, History, Bookmark, Camera, MapPin, Shield, HelpCircle, FileText, Home } from "lucide-react";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [favTab, setFavTab] = useState<"foods" | "vendors">("foods");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const totalSpent = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const favFoodItems = foodItems.filter((f) => favouriteFoods.includes(f.id));
  const favShopItems = shops.filter((s) => favouriteShops.includes(s.id));
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const activeOrders = orders.filter((o) => o.paymentStatus === "paid" && !o.cancelled && o.stage < 3);

  const settingsRows = [
    { icon: isDark ? Sun : Moon, label: isDark ? "Light Mode" : "Dark Mode", onClick: toggleTheme },
    { icon: Bookmark, label: "Saved Items", onClick: () => {} },
    { icon: Home, label: "Address", onClick: () => {} },
    { icon: HelpCircle, label: "Support & Help", onClick: () => navigate("/support") },
    { icon: FileText, label: "Legal", onClick: () => {} },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background pb-32 page-enter">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center pt-10 pb-5 px-5 relative">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-lg overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <h1 className="text-xl font-bold text-foreground mt-3">{name}</h1>
        <p className="text-sm text-muted-foreground">@{nickname}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-muted text-xs font-medium text-foreground"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* Quick stats */}
      <div className="flex gap-3 px-5 mb-5">
        <div className="flex-1 rounded-2xl bg-muted p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{paidOrders.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Orders</p>
        </div>
        <div className="flex-1 rounded-2xl bg-muted p-4 text-center">
          <p className="text-xl font-bold text-primary">₦{totalSpent.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Spent</p>
        </div>
        <button
          onClick={() => navigate("/wallet")}
          className="relative flex-1 rounded-2xl bg-muted p-4 text-center overflow-hidden active:scale-[0.97] transition-transform"
        >
          <Wallet className="w-6 h-6 text-vendoor-green mx-auto" />
          <p className="text-xs text-muted-foreground mt-0.5">Wallet</p>
        </button>
      </div>

      {/* Quick links */}
      <div className="flex gap-3 px-5 mb-5">
        <button onClick={() => navigate("/orders")} className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-card border border-border relative">
          <ClipboardList className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">My Orders</span>
          {activeOrders.length > 0 && (
            <span className="ml-auto min-w-[20px] h-5 rounded-full bg-destructive text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {activeOrders.length}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={() => navigate("/orders?tab=past")} className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-card border border-border">
          <History className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">History</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
        </button>
      </div>

      {/* Favourites with tabs */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-foreground">Favourites</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setFavTab("foods")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${favTab === "foods" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            >
              Foods
            </button>
            <button
              onClick={() => setFavTab("vendors")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${favTab === "vendors" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
            >
              Vendors
            </button>
          </div>
        </div>

        {favTab === "foods" && (
          favFoodItems.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {favFoodItems.map((f) => (
                <div key={f.id} className="flex-shrink-0 w-28 rounded-xl bg-secondary overflow-hidden">
                  <img src={f.image} alt={f.name} className="w-full h-20 object-cover" />
                  <p className="text-xs font-medium text-foreground p-2 truncate">{f.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FourPointStar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No favourite foods yet</p>
            </div>
          )
        )}

        {favTab === "vendors" && (
          favShopItems.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {favShopItems.map((s) => (
                <div key={s.id} className="flex-shrink-0 w-28 rounded-xl bg-secondary overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-20 object-cover" />
                  <p className="text-xs font-medium text-foreground p-2 truncate">{s.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No favourite vendors yet</p>
            </div>
          )
        )}
      </div>

      {/* Recent Orders */}
      {paidOrders.length > 0 && (
        <div className="px-5 mb-5">
          <h3 className="text-base font-bold text-foreground mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {paidOrders.slice(0, 3).map((order) => (
              <button
                key={order.id}
                onClick={() => navigate("/orders")}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-card border border-border text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.vendorName} • {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-bold text-primary">₦{order.total.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-5 mb-4">
        <h3 className="text-base font-bold text-foreground mb-2">Settings</h3>
        <div className="rounded-2xl bg-muted divide-y divide-border overflow-hidden">
          {settingsRows.map(({ icon: Icon, label, onClick }) => (
            <button key={label} onClick={onClick} className="w-full flex items-center justify-between p-4 text-left">
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="px-5 mb-6">
        <div className="rounded-2xl bg-muted divide-y divide-border overflow-hidden">
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
        <div className="fixed inset-0 z-[70] flex items-end justify-center" onClick={() => setShowEdit(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="rounded-2xl bg-muted p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-4">Edit Profile</h3>
            <div className="space-y-3">
              {[
                { label: "Name", value: name, onChange: setName },
                { label: "Nickname", value: nickname, onChange: setNickname },
                { label: "Location", value: location, onChange: setLocation },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="text-xs text-muted-foreground">{label}</label>
                  <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-muted text-sm text-foreground outline-none"
                  />
                </div>
              ))}
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
