import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

interface Message {
  id: string;
  text: string;
  from: "bot" | "user";
  time: Date;
}

const BOT_RESPONSES: Record<string, string> = {
  default: "Thanks for reaching out! A support agent will be with you shortly. In the meantime, feel free to browse our FAQ or describe your issue in detail.",
  order: "For order issues, please provide your Order ID and we'll look into it right away. You can find your Order ID on the Orders page.",
  payment: "Payment issues are our top priority. Please describe the problem and share your Order ID so we can investigate immediately.",
  delivery: "For delivery concerns, we'll contact the rider and get back to you within 5 minutes.",
  refund: "Refunds are processed within 3–5 business days. Please share your Order ID to initiate a refund.",
  cancel: "You can cancel an order within 5 minutes of placing it directly from the Orders page. For late cancellations, contact us here.",
};

const getAutoReply = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes("order")) return BOT_RESPONSES.order;
  if (lower.includes("pay") || lower.includes("card") || lower.includes("wallet")) return BOT_RESPONSES.payment;
  if (lower.includes("deliver") || lower.includes("rider")) return BOT_RESPONSES.delivery;
  if (lower.includes("refund") || lower.includes("money back")) return BOT_RESPONSES.refund;
  if (lower.includes("cancel")) return BOT_RESPONSES.cancel;
  return BOT_RESPONSES.default;
};

const SupportPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      text: "👋 Hi there! Welcome to VenDoor Support. How can we help you today?\n\nYou can ask about:\n• Orders & Tracking\n• Payments & Refunds\n• Delivery Issues\n• Cancellations",
      from: "bot",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), text, from: "user", time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200));
    setTyping(false);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: getAutoReply(text),
      from: "bot",
      time: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = ["Track my order", "Payment issue", "Request refund", "Cancel order"];

  return (
    <div className="max-w-md mx-auto h-screen bg-background flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-4 pb-4 border-b border-border flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--vendoor-amber)) 100%)",
        }}
      >
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/20 backdrop-blur-md">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">VenDoor Support</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-vendoor-green animate-pulse" />
              <p className="text-[11px] text-white/80">Online · Typically replies instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {msg.from === "bot" && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-auto"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}>
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            {msg.from === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-auto">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
            <div className={`max-w-[78%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.from === "user"
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm bg-card border border-border text-foreground"
                }`}
                style={msg.from === "user" ? { background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" } : {}}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar flex-shrink-0">
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full border border-primary/30 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors btn-press"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-28 pt-2 flex-shrink-0">
        <div className="flex items-end gap-2 p-2 rounded-2xl bg-card border border-border shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none px-2 py-1.5 max-h-24"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all btn-press disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--vendoor-amber)))" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
};

export default SupportPage;
