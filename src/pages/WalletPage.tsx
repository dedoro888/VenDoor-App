import { useState } from "react";
import { ArrowLeft, Copy, CreditCard, Plus, Check, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

// Mock Paystack virtual account data
const MOCK_ACCOUNT = {
  accountNumber: "0123456789",
  accountName: "VenDoor / John Doe",
  bankName: "Wema Bank",
  balance: 15500,
};

const mockTransactions = [
  { id: "t1", type: "credit", amount: 10000, description: "Wallet Top-up", date: "2026-02-28", status: "success" },
  { id: "t2", type: "debit", amount: 3500, description: "Jollof Rice & Chicken", date: "2026-02-27", status: "success" },
  { id: "t3", type: "credit", amount: 5000, description: "Wallet Top-up", date: "2026-02-25", status: "success" },
  { id: "t4", type: "debit", amount: 2800, description: "Pepper Soup", date: "2026-02-24", status: "success" },
  { id: "t5", type: "debit", amount: 4200, description: "Grilled Fish & Rice", date: "2026-02-20", status: "success" },
];

const mockCards = [
  { id: "c1", last4: "4242", brand: "Visa", expiry: "12/28" },
  { id: "c2", last4: "1234", brand: "Mastercard", expiry: "09/27" },
];

const WalletPage = () => {
  const navigate = useNavigate();
  const { orders } = useCart();
  const [copied, setCopied] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [tab, setTab] = useState<"transactions" | "cards">("transactions");

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total, 0);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(MOCK_ACCOUNT.accountNumber);
    setCopied(true);
    toast({ title: "Account number copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto overscroll-contain pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate("/profile")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="mx-5 mb-5 rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 100%)",
          boxShadow: "0 8px 32px hsl(var(--primary) / 0.35)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-3xl" />
        <p className="text-sm text-primary-foreground/80 font-medium mb-1">Available Balance</p>
        <p className="text-4xl font-bold text-primary-foreground">₦{MOCK_ACCOUNT.balance.toLocaleString()}</p>
        <p className="text-xs text-primary-foreground/70 mt-2">Total Spent: ₦{totalSpent.toLocaleString()}</p>

        <button
          onClick={() => setShowAddMoney(true)}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-primary-foreground text-sm font-semibold backdrop-blur-sm border border-white/30"
        >
          <Plus className="w-4 h-4" /> Add Money
        </button>
      </div>

      {/* Virtual Account */}
      <div className="mx-5 mb-5 p-4 rounded-2xl bg-secondary">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-primary" />
          <p className="text-sm font-bold text-foreground">Your VenDoor Account</p>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-vendoor-green/15 text-vendoor-green font-bold ml-auto">Powered by Paystack</span>
        </div>
        <p className="text-xs text-muted-foreground mb-0.5">Bank: <span className="text-foreground font-medium">{MOCK_ACCOUNT.bankName}</span></p>
        <p className="text-xs text-muted-foreground mb-0.5">Account Name: <span className="text-foreground font-medium">{MOCK_ACCOUNT.accountName}</span></p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xs text-muted-foreground">Account Number</p>
            <p className="text-xl font-bold text-foreground tracking-widest">{MOCK_ACCOUNT.accountNumber}</p>
          </div>
          <button
            onClick={copyAccountNumber}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 text-primary text-xs font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          💡 Fund your wallet by transferring to this account. Money reflects instantly.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {(["transactions", "cards"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              tab === t ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            {t === "transactions" ? "Transactions" : "Manage Cards"}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-3">
        {tab === "transactions" && mockTransactions.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "credit" ? "bg-vendoor-green/15" : "bg-destructive/10"}`}>
              {tx.type === "credit"
                ? <ArrowDownLeft className="w-4 h-4 text-vendoor-green" />
                : <ArrowUpRight className="w-4 h-4 text-destructive" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
            <span className={`text-sm font-bold ${tx.type === "credit" ? "text-vendoor-green" : "text-foreground"}`}>
              {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
            </span>
          </div>
        ))}

        {tab === "cards" && (
          <>
            {mockCards.map((card) => (
              <div key={card.id} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{card.brand} •••• {card.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                </div>
                <span className="text-xs text-vendoor-green font-medium">Active</span>
              </div>
            ))}
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground"
            >
              <Plus className="w-4 h-4" /> Add Debit Card
            </button>
          </>
        )}
      </div>

      {/* Add Money Sheet */}
      {showAddMoney && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowAddMoney(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="relative w-full max-w-md bg-card rounded-t-3xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-1">Add Money</h3>
            <p className="text-xs text-muted-foreground mb-4">Transfer to your VenDoor account or enter amount to pay via card.</p>
            <label className="text-xs text-muted-foreground">Amount (₦)</label>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-secondary text-lg font-bold text-foreground outline-none mb-4"
            />
            <div className="flex gap-2 mb-4">
              {["1000", "2000", "5000", "10000"].map((amt) => (
                <button key={amt} onClick={() => setAddAmount(amt)} className="flex-1 py-2 rounded-xl bg-secondary text-xs font-bold text-foreground">
                  ₦{Number(amt).toLocaleString()}
                </button>
              ))}
            </div>
            <button
              onClick={() => { toast({ title: "Redirecting to Paystack..." }); setShowAddMoney(false); }}
              className="w-full py-3 rounded-xl text-sm font-bold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
            >
              Pay ₦{addAmount ? Number(addAmount).toLocaleString() : "0"} via Paystack
            </button>
          </div>
        </div>
      )}

      {/* Add Card Sheet */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowAddCard(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <div className="relative w-full max-w-md bg-card rounded-t-3xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-4">Add Debit Card</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Card Number</label>
                <input placeholder="0000 0000 0000 0000" className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground outline-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Expiry</label>
                  <input placeholder="MM/YY" className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground outline-none" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">CVV</label>
                  <input placeholder="000" className="w-full mt-1 px-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground outline-none" />
                </div>
              </div>
            </div>
            <button
              onClick={() => { toast({ title: "Card added!" }); setShowAddCard(false); }}
              className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            >
              Add Card
            </button>
          </div>
        </div>
      )}
      </div>{/* end scrollable */}

      <BottomNav active="profile" />
    </div>
  );
};

export default WalletPage;
