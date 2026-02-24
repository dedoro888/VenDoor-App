import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Receipt, Download, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, Order } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, cartTotal, placeOrder } = useCart();
  const [receipt, setReceipt] = useState<Order | null>(null);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const order = placeOrder();
    setReceipt(order);
  };

  if (receipt) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-card rounded-3xl border border-border p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-vendoor-green/15 flex items-center justify-center">
            <Receipt className="w-8 h-8 text-vendoor-green" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Order Placed!</h2>
          <p className="text-sm text-muted-foreground">Order ID: {receipt.id}</p>

          <div className="text-left space-y-2 bg-secondary rounded-xl p-4">
            {receipt.items.map((item) => (
              <div key={item.food.id} className="flex justify-between text-sm">
                <span className="text-foreground">{item.quantity}x {item.food.name}</span>
                <span className="font-medium text-foreground">₦{(item.food.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">₦{receipt.total.toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary text-sm font-medium text-foreground">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>

          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="flex-1 py-3 rounded-xl bg-secondary text-sm font-medium text-foreground">
              Home
            </button>
            <button onClick={() => { setReceipt(null); navigate("/orders"); }} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <button onClick={() => navigate("/")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">My Cart</h1>
      </div>

      <div className="px-5 space-y-3 pb-44">
        {items.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
          </div>
        )}

        {items.map((item) => (
          <div key={item.food.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <img src={item.food.image} alt={item.food.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground truncate">{item.food.name}</h4>
              <p className="text-xs text-muted-foreground">{item.food.shopName} • {item.deliveryType}</p>
              <p className="text-sm font-bold text-primary">₦{(item.food.price * item.quantity).toLocaleString()}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button onClick={() => updateQuantity(item.food.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <Plus className="w-3 h-3 text-foreground" />
              </button>
              <span className="text-sm font-bold text-foreground">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.food.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <Minus className="w-3 h-3 text-foreground" />
              </button>
            </div>
            <button onClick={() => removeFromCart(item.food.id)} className="p-1.5">
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40">
          <div className="max-w-md mx-auto px-5 pb-4">
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 rounded-2xl text-base font-bold relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 50%, hsl(var(--primary)) 100%)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 8px 32px hsl(var(--primary) / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.3)",
              }}
            >
              <span className="relative z-10">Place Order • ₦{cartTotal.toLocaleString()}</span>
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            </button>
          </div>
        </div>
      )}

      <BottomNav active="cart" />
    </div>
  );
};

export default CartPage;
