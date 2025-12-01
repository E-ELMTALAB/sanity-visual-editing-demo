import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="text-center max-w-md px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-800 mb-4">۴۰۴</h1>
          <div className="h-1 w-24 bg-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">صفحه مورد نظر یافت نشد</h2>
          <p className="text-gray-600 mb-8">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/products" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              مشاهده محصولات
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
