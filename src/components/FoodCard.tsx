import { FoodItem } from "@/data/mockData";

interface FoodCardProps {
  food: FoodItem;
  onTap: (food: FoodItem) => void;
}

const FoodCard = ({ food, onTap }: FoodCardProps) => {
  return (
    <button onClick={() => onTap(food)} className="flex-shrink-0 w-44 text-left">
      <div className="relative rounded-xl overflow-hidden h-32 bg-secondary">
        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        {!food.isOpen && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground bg-destructive px-2 py-0.5 rounded-full">Closed</span>
          </div>
        )}
        {/* Price badge */}
        <span className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm text-xs font-bold text-primary px-2 py-0.5 rounded-full">
          ₦{food.price.toLocaleString()}
        </span>
      </div>
      <div className="mt-1.5">
        <h3 className="text-sm font-semibold text-foreground truncate">{food.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{food.shopName}</p>
      </div>
    </button>
  );
};

export default FoodCard;
