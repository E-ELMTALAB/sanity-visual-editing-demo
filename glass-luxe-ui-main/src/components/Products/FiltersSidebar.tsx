import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, X } from "lucide-react";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

interface FilterState {
  categories: string[];
  priceRange: string;
  ratingMin: number;
}

interface FiltersSidebarProps {
  onChange: (filters: FilterState) => void;
  className?: string;
}

interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

interface PriceRangeOption {
  id: string;
  label: string;
  value: string;
}

interface RatingOption {
  value: number;
  label: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "همه محصولات", count: 12 },
  { id: "ai", label: "هوش مصنوعی", count: 5 },
  { id: "social", label: "سوشیال مدیا", count: 3 },
  { id: "music", label: "موسیقی", count: 2 },
  { id: "education", label: "آموزشی", count: 8 },
  { id: "simcard", label: "سیمکارت", count: 1 },
];

const DEFAULT_PRICE_RANGES: PriceRangeOption[] = [
  { id: "low", label: "زیر 200,000 تومان", value: "0-200000" },
  { id: "mid", label: "200,000 - 300,000 تومان", value: "200000-300000" },
  { id: "high", label: "بالای 300,000 تومان", value: "300000+" },
];

const DEFAULT_RATING_OPTIONS: RatingOption[] = [
  { value: 5, label: "5 ستاره و بالاتر" },
  { value: 4, label: "4 ستاره و بالاتر" },
  { value: 3, label: "3 ستاره و بالاتر" },
];

interface FiltersSidebarProps {
  onChange: (filters: FilterState) => void;
  className?: string;
  categories?: CategoryOption[];
  priceRanges?: PriceRangeOption[];
  ratingOptions?: RatingOption[];
}

export function FiltersSidebar({
  onChange,
  className,
  categories = DEFAULT_CATEGORIES,
  priceRanges = DEFAULT_PRICE_RANGES,
  ratingOptions = DEFAULT_RATING_OPTIONS,
}: FiltersSidebarProps) {
  const { isRTL } = useDirection();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    
    setSelectedCategories(newCategories);
    onChange({
      categories: newCategories,
      priceRange: selectedPriceRange,
      ratingMin: selectedRating,
    });
  };

  const handlePriceChange = (value: string) => {
    setSelectedPriceRange(value);
    onChange({
      categories: selectedCategories,
      priceRange: value,
      ratingMin: selectedRating,
    });
  };

  const handleRatingChange = (value: string) => {
    const rating = parseInt(value);
    setSelectedRating(rating);
    onChange({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      ratingMin: rating,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange("");
    setSelectedRating(0);
    onChange({
      categories: [],
      priceRange: "",
      ratingMin: 0,
    });
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedPriceRange || selectedRating > 0;

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
        {Array.from({ length: 5 - count }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-3.5 w-3.5 text-muted-foreground/30" />
        ))}
      </div>
    );
  };

  const CollapsibleSection = ({
    title,
    isOpen,
    onToggle,
    children,
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <SurfaceGlass variant="default" className="overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          "w-full px-4 py-3 flex items-center justify-between",
          "text-sm font-semibold text-foreground",
          "hover:bg-surface-glass/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        )}
        aria-expanded={isOpen}
        aria-controls={`filter-section-${title}`}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`filter-section-${title}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springTransition}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </SurfaceGlass>
  );

  return (
    <aside
      className={cn(
        "w-full space-y-4 sticky top-[calc(84px+16px)]",
        className
      )}
      aria-label="Product filters"
    >
      {/* Clear Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="w-full justify-center gap-2"
          >
            <X className="h-3.5 w-3.5" />
            <span>پاک کردن فیلترها</span>
          </Button>
        </motion.div>
      )}

      {/* Categories */}
      <CollapsibleSection
        title="دسته‌بندی‌ها"
        isOpen={categoriesOpen}
        onToggle={() => setCategoriesOpen(!categoriesOpen)}
      >
        <fieldset className="space-y-3">
          <legend className="sr-only">دسته‌بندی محصولات</legend>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex-1 flex items-center justify-between text-sm cursor-pointer"
              >
                <span className="text-foreground">{category.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count ?? 0}
                </Badge>
              </Label>
            </div>
          ))}
        </fieldset>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection
        title="بازه قیمت"
        isOpen={priceOpen}
        onToggle={() => setPriceOpen(!priceOpen)}
      >
        <fieldset>
          <legend className="sr-only">بازه قیمت محصولات</legend>
          <RadioGroup
            value={selectedPriceRange}
            onValueChange={handlePriceChange}
            className="space-y-3"
          >
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center gap-3">
                <RadioGroupItem
                  value={range.value}
                  id={`price-${range.id}`}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Label
                  htmlFor={`price-${range.id}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
      </CollapsibleSection>

      {/* Rating */}
      <CollapsibleSection
        title="امتیاز"
        isOpen={ratingOpen}
        onToggle={() => setRatingOpen(!ratingOpen)}
      >
        <fieldset>
          <legend className="sr-only">حداقل امتیاز محصولات</legend>
          <RadioGroup
            value={selectedRating.toString()}
            onValueChange={handleRatingChange}
            className="space-y-3"
          >
            {ratingOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`rating-${option.value}`}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Label
                  htmlFor={`rating-${option.value}`}
                  className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                >
                  {renderStars(option.value)}
                  <span className="text-muted-foreground">و بالاتر</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
      </CollapsibleSection>
    </aside>
  );
}
