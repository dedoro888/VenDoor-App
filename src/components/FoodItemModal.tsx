import { useState } from "react";
import { X, MapPin, Minus, Plus, Clock, Sparkles } from "lucide-react";
import { FoodItem } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { toast } from "@/hooks/use-toast";

interface FoodItemModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

const FourPointStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
  </svg>
);

const FoodItemModal = ({ food, onClose }: FoodItemModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");
  const { addToCart } = useCart();
  const { isFoodFav, toggleFoodFav } = useFavourites();

  if (!food) return null;

  const isFav = isFoodFav(food.id);
  const totalPrice = food.price * quantity;

  const handleAddToCart = () => {
    addToCart(food, quantity, deliveryType);
    toast({ title: "Added to cart!", description: `${quantity}x ${food.name}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-48 flex-shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{food.name}</h2>
            <p className="text-2xl font-bold text-primary mt-1">₦{food.price.toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{food.shopName}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${food.isOpen ? "bg-vendoor-green/15 text-vendoor-green" : "bg-destructive/15 text-destructive"}`}>
              {food.isOpen ? "Open" : "Closed"}
            </span>
          </div>

          {/* Pickup / Delivery Toggle */}
          <div className="flex gap-2">
            {(["pickup", "delivery"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDeliveryType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                  deliveryType === type ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Schedule / Pre-order */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-sm font-medium text-foreground">
            <Clock className="w-4 h-4" />
            Schedule Order
          </button>

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

        {/* Add to Cart - Liquid Glass Button */}
        <div className="p-5 pt-0 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={!food.isOpen}
            className="w-full py-4 rounded-2xl text-base font-bold relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 50%, hsl(var(--primary)) 100%)",
              backgroundSize: "200% 200%",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 8px 32px hsl(var(--primary) / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.3), inset 0 -1px 0 hsl(0 0% 0% / 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Add to Cart • ₦{totalPrice.toLocaleString()}
            </span>
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-2xl pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
