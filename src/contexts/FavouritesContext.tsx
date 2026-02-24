import { createContext, useContext, useState, ReactNode } from "react";

interface FavouritesContextType {
  favouriteFoods: string[];
  favouriteShops: string[];
  toggleFoodFav: (id: string) => void;
  toggleShopFav: (id: string) => void;
  isFoodFav: (id: string) => boolean;
  isShopFav: (id: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favouriteFoods, setFavFoods] = useState<string[]>([]);
  const [favouriteShops, setFavShops] = useState<string[]>([]);

  const toggleFoodFav = (id: string) => {
    setFavFoods((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const toggleShopFav = (id: string) => {
    setFavShops((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const isFoodFav = (id: string) => favouriteFoods.includes(id);
  const isShopFav = (id: string) => favouriteShops.includes(id);

  return (
    <FavouritesContext.Provider value={{ favouriteFoods, favouriteShops, toggleFoodFav, toggleShopFav, isFoodFav, isShopFav }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
};
