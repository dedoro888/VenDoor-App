import { useState } from "react";
import { X, Minus, Plus, Sparkles, Calendar, Star, Bike, Tag, ChevronRight, MapPin, Clock, Navigation } from "lucide-react";
import { FoodItem, shops } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

const PROMO_CODES: Record<string, number> = {
  "VENDOOR10": 10,
  "SAVE20": 20,
  "FIRST50": 50,
};

interface FoodItemModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

const FoodItemModal = ({ food, onClose }: FoodItemModalProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");
  const [note, setNote] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState("");
  const [promoError, setPromoError] = useState("");

  const { addToCart } = useCart();
  const { isFoodFav, toggleFoodFav } = useFavourites();

  if (!food) return null;

  const shop = shops.find((s) => s.id === food.shopId);
  const isFav = isFoodFav(food.id);
  const basePrice = food.price * quantity;
  const discountAmount = promoDiscount ? Math.round(basePrice * (promoDiscount / 100)) : 0;
  const totalPrice = basePrice - discountAmount;

  const applyPromo = () => {
    const discount = PROMO_CODES[promoInput.toUpperCase()];
    if (discount) {
      setPromoDiscount(discount);
      setPromoApplied(promoInput.toUpperCase());
      setPromoError("");
      toast({ title: `Promo applied! ${discount}% off` });
    } else {
      setPromoError("Invalid promo code");
      setPromoDiscount(0);
      setPromoApplied("");
    }
  };

  const handleAddToOrders = () => {
    const scheduledFor = scheduleDate && scheduleTime ? `${scheduleDate}T${scheduleTime}` : undefined;
    addToCart(food, quantity, deliveryType, note || undefined, scheduledFor, promoApplied || undefined, promoDiscount || undefined);
    toast({ title: "Added to Orders!", description: `${quantity}x ${food.name}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl max-h-[88vh] flex flex-col animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-44 flex-shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 left-3 p-2 rounded-full bg-card/80 backdrop-blur-md">
            <X className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => toggleFoodFav(food.id)}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md ${isFav ? "bg-vendoor-red/20 text-vendoor-red" : "bg-card/80 text-foreground"}`}
          >
            <FourPointStar filled={isFav} className="w-5 h-5" />
          </button>
          {!food.isOpen && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground bg-destructive px-3 py-1.5 rounded-full">Currently Closed</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Title + price */}
          <div>
            <h2 className="text-xl font-bold text-foreground">{food.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold text-primary">₦{food.price.toLocaleString()}</p>
              {promoDiscount > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-vendoor-green/15 text-vendoor-green">
                  -{promoDiscount}%
                </span>
              )}
            </div>
            {/* Delivery fee, distance & time — right below price */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bike className="w-3.5 h-3.5 text-primary" />
                <span>₦{shop?.deliveryFee?.toLocaleString() ?? "—"} delivery</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span>1.2 km away</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{shop?.deliveryTime ?? "—"}</span>
              </div>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${food.isOpen ? "bg-vendoor-green/15 text-vendoor-green" : "bg-destructive/15 text-destructive"}`}>
                {food.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{food.shopName}</span>
          </div>

          {/* Vendor mini card — right after location */}
          {shop && (
            <button
              onClick={() => { onClose(); navigate(`/vendor/${shop.id}`); }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-secondary active:scale-[0.98] transition-transform"
            >
              <img src={shop.image} alt={shop.name} className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{shop.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-vendoor-amber text-vendoor-amber" />
                  <span className="font-medium text-foreground">{shop.rating}</span>
                  <span>•</span>
                  <span>{shop.reviews} orders</span>
                  <span>•</span>
                  <Bike className="w-3 h-3 text-primary" />
                  <span>₦{shop.deliveryFee}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          {/* Pickup / Delivery */}
          <div className="flex gap-2">
            {(["delivery", "pickup"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDeliveryType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  deliveryType === type ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}
              >
                {type === "delivery" ? (
                  <>
                    <Bike className="w-4 h-4" /> Delivery
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                    Pickup
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Schedule */}
          <button
            onClick={() => setScheduling(!scheduling)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              scheduling ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            {scheduling ? "Cancel Schedule" : "Schedule Order"}
          </button>

          {scheduling && (
            <div className="flex gap-2">
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-none outline-none"
                min={new Date().toISOString().split("T")[0]}
              />
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-foreground text-sm border-none outline-none"
              />
            </div>
          )}

          {scheduleDate && scheduleTime && (
            <div className="px-3 py-2 rounded-xl bg-vendoor-amber/10 text-xs text-vendoor-amber font-medium">
              📅 Scheduled for {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
            </div>
          )}

          {/* Promo code */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                placeholder="Promo code (e.g. VENDOOR10)"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <button
              onClick={applyPromo}
              className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-xs text-destructive -mt-1">{promoError}</p>}
          {promoApplied && <p className="text-xs text-vendoor-green -mt-1">✓ {promoApplied} applied — {promoDiscount}% off</p>}

          {/* Note */}
          <textarea
            placeholder="Special instructions (e.g., less pepper, no onions)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground resize-none h-14 border-none outline-none"
          />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold text-foreground w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Add to Orders button */}
        <div className="p-4 pt-0 flex-shrink-0">
          {promoDiscount > 0 && (
            <div className="flex items-center justify-between text-xs mb-2 px-1">
              <span className="text-muted-foreground">Original: ₦{basePrice.toLocaleString()}</span>
              <span className="text-vendoor-green font-medium">Saving ₦{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={handleAddToOrders}
            disabled={!food.isOpen}
            className="w-full py-4 rounded-2xl text-base font-bold relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 50%, hsl(var(--primary)) 100%)",
              backgroundSize: "200% 200%",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 8px 32px hsl(var(--primary) / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.3), inset 0 -1px 0 hsl(0 0% 0% / 0.1)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Add to Orders • ₦{totalPrice.toLocaleString()}
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-2xl pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
