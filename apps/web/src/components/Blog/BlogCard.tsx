import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  image?: {
    asset: {
      url: string;
    };
  };
  excerpt?: string;
  category?: string;
  readTime?: number;
  publishedAt: string;
}

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

const categoryLabels: Record<string, { fa: string; en: string }> = {
  "spotify": { fa: "اسپاتیفای", en: "Spotify" },
  "youtube": { fa: "یوتیوب", en: "YouTube" },
  "cards": { fa: "کارت‌ها", en: "Cards" },
  "ai-tools": { fa: "ابزارهای هوش مصنوعی", en: "AI Tools" },
  "tutorials": { fa: "آموزش", en: "Tutorials" },
  "news": { fa: "اخبار", en: "News" },
};

export function BlogCard({ post, className }: BlogCardProps) {
  const { isRTL } = useDirection();
  
  const categoryLabel = post.category 
    ? categoryLabels[post.category]?.[isRTL ? "fa" : "en"] || post.category
    : null;

  const formattedDate = isRTL
    ? dayjs(post.publishedAt).calendar("jalali").locale("fa").format("YYYY/MM/DD")
    : dayjs(post.publishedAt).format("MMM DD, YYYY");

  const imageUrl = post.image?.asset?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ y: -1, scale: 0.995 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "product-poster-compact group relative rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10",
        className
      )}
    >
      <a
        href={`/blog/${post.slug}`}
        className={cn(
          "block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-3xl",
          "after:absolute after:inset-0 after:z-10"
        )}
        aria-label={post.title}
      >
        {/* Image wrapper */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover ring-1 ring-white/12 shadow-none transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
          
          {/* Fade gradient layer */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black/18" />

          {/* Category & Date Badge */}
          {categoryLabel && (
            <div className="absolute ltr:left-3 rtl:right-3 top-3 px-2.5 py-1 rounded-full text-[12px] leading-5 backdrop-blur-[18px] bg-white/12 border border-white/35">
              <span className="text-white/95 font-medium">{categoryLabel}</span>
            </div>
          )}
        </div>

        {/* Info box (overlapping) */}
        <div className="absolute left-3 right-3 bottom-3 glass rounded-3xl px-4 py-4 md:px-5 md:py-4 border border-white/35">
          <div className={cn(
            "flex items-center gap-2 text-[12px] text-white/60 mb-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <span>{formattedDate}</span>
            {post.readTime && (
              <>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{post.readTime} دقیقه</span>
              </>
            )}
          </div>

          <h3 className="text-[16px] md:text-[17px] font-semibold text-white/95 line-clamp-2 leading-snug mb-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-[13px] text-white/70 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className={cn(
            "mt-3 text-[13px] font-medium text-white/90 group-hover:text-white transition-colors",
            isRTL ? "text-right" : "text-left"
          )}>
            {isRTL ? "ادامه مطلب ←" : "Read more →"}
          </div>
        </div>

        {/* Focus ring */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-offset-0 ring-white/40 focus-within:ring-2" />
      </a>
    </motion.article>
  );
}
