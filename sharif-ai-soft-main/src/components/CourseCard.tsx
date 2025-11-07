import { Link } from "react-router-dom";
import { Clock, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CourseCardProps {
  slug: string;
  title: string;
  image?: string;
  tags?: string[];
  durationHours: number;
  level: "مبتدی" | "متوسط" | "پیشرفته";
  price: number;
  installments?: boolean;
}

export function CourseCard({
  slug,
  title,
  image,
  tags = [],
  durationHours,
  level,
  price,
  installments,
}: CourseCardProps) {
  const levelColors = {
    "مبتدی": "bg-success/10 text-success border-success/20",
    "متوسط": "bg-warning/10 text-warning border-warning/20",
    "پیشرفته": "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <div className="group relative bg-surface rounded-lg shadow-neu-out hover:shadow-neu-hover transition-all duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-40 md:h-48 bg-gradient-to-br from-primary-lighter to-accent overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap className="w-16 h-16 text-primary opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 space-y-3 md:space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-text-strong line-clamp-2 mb-2">
            {title}
          </h3>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-4 h-4" />
              <span>{durationHours} ساعت</span>
            </div>
            
            <Badge className={levelColors[level]} variant="outline">
              {level}
            </Badge>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
          <div className="flex flex-col items-start">
            <span className="text-lg md:text-2xl font-semibold text-primary">
              {price.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-text-muted">تومان</span>
            {installments && (
              <span className="text-xs text-success mt-1">قابل اقساط</span>
            )}
          </div>
          
          <Link to={`/courses/${slug}`}>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              مشاهده دوره
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
