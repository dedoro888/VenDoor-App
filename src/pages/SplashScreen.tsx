import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/", { replace: true }), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="max-w-md mx-auto h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, hsl(var(--primary)) 0%, hsl(24 100% 45%) 100%)" }}
    >
      {/* Decorative rings */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border-[48px] border-white/10 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full border-[32px] border-white/10" />

      {/* Logo */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
        style={{ background: "white", animation: "scale-in-nav 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <Flame className="w-12 h-12" style={{ color: "hsl(var(--primary))" }} />
      </div>

      <h1
        className="text-5xl font-black text-white tracking-tight mb-3"
        style={{ animation: "page-enter 0.5s 0.2s ease-out both" }}
      >
        VenDoor
      </h1>
      <p
        className="text-white/75 text-base font-medium text-center px-8"
        style={{ animation: "page-enter 0.5s 0.35s ease-out both" }}
      >
        A platform where vendors showcase their goods
      </p>

      {/* Loading dots */}
      <div className="flex gap-2 mt-10" style={{ animation: "page-enter 0.5s 0.5s ease-out both" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            style={{ animation: `shimmer 1.4s ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
