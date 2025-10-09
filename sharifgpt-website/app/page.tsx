"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import MobileMenu from "../components/mobile-menu"
import RobotAssistant from "../components/robot-assistant"
import ProductCard from "@/components/product-card"
import CartDropdown from "@/components/cart-dropdown" // Assuming CartDropdown omponent exists
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Footer from "@/components/footer"
import type { HeroSlide, PromoCard, DiscountedProduct, SocialMediaProduct, EducationalProduct, BestsellingCourse } from "../../types"

const IndependentSlider = ({ className, items = [], autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }, [currentIndex, items.length])

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === items.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }, [currentIndex, items.length])

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex)
  }

  // افکت برای اسلاید خودکار
  useEffect(() => {
    if (autoplayInterval) {
      const timer = setInterval(() => {
        goToNext()
      }, autoplayInterval)

      // پاک‌سازی تایمر هنگام unmount شدن کامپوننت
      return () => clearInterval(timer)
    }
  }, [goToNext, autoplayInterval])

  if (!items || items.length === 0) {
    return null // اگر آیتمی وجود نداشت، چیزی رندر نکن
  }

  const currentItem = items[currentIndex]

  return (
    <div
      className={`relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out w-full h-full cursor-pointer ${className}`}
    >
      {/* تصویر پس‌زمینه با انیمیشن */}
      <img
        src={currentItem.imageUrl || "/placeholder.svg"}
        loading="lazy"
        alt={currentItem.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* لایه گرادینت برای خوانایی متن */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

      {/* محتوای متنی */}
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <div>
          <h3 className={"text-xl md:text-2xl font-bold drop-shadow-lg"}>{currentItem.title}</h3>
          <p className={"text-sm md:text-base mt-1 opacity-90 drop-shadow-md"}>{currentItem.subtitle}</p>
          {currentItem.buttonText && (
            <button
              className={`
                    mt-3 text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600
                    transition-all duration-300 transform hover:scale-105 focus:outline-none
                `}
            >
              {currentItem.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* دکمه‌های ناوبری (فقط در هاور نمایش داده می‌شوند) */}
      <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors duration-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors duration-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* نقاط نشانگر اسلاید */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center space-x-2">
        {items.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={(e) => {
              e.stopPropagation() // جلوگیری از کلیک روی کارت اصلی
              goToSlide(slideIndex)
            }}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ${currentIndex === slideIndex ? "bg-white scale-125" : "bg-white/50"}`}
          ></div>
        ))}
      </div>
    </div>
  )
}

// کامپوننت کارت‌های تبلیغاتی ثابت در کنار اسلایدر
const PromoCard = ({ item }) => {
  if (!item) return null
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out w-full h-full cursor-pointer">
      <img
        src={item.imageUrl || "/placeholder.svg"}
        loading="lazy"
        alt={item.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
        <h3 className="text-lg md:text-xl font-bold drop-shadow-lg">{item.title}</h3>
        <p className="text-xs md:text-sm mt-1 opacity-90 drop-shadow-md">{item.subtitle}</p>
        <button
          className={`
                    mt-3 text-xs py-2 px-4 bg-sky-500 text-white font-bold rounded-full shadow-md hover:bg-sky-600
                    transition-all duration-300 transform hover:scale-105 focus:outline-none
                 `}
        >
          مشاهده
        </button>
      </div>
    </div>
  )
}

export default function HomePage({ heroData }: { heroData?: { topBannerSlides?: HeroSlide[]; heroSlides?: HeroSlide[]; promoCards?: PromoCard[]; discountedProducts?: DiscountedProduct[]; socialMediaProducts?: SocialMediaProduct[]; educationalProducts?: EducationalProduct[]; bestsellingCourses?: BestsellingCourse[]; magazinePosts?: any[]; featuredBlogs?: any[] } }) {
  const topBannerSlides = heroData?.topBannerSlides || []
  const heroSlides = heroData?.heroSlides || []
  const featuredBlogsFromSanity = heroData?.featuredBlogs || []
  const [products, setProducts] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  
  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const productsData = await response.json()
          setProducts(productsData)
        } else {
          // Fallback to sample products if no products in Sanity
          setProducts([
            { _id: '1', name: 'ChatGPT Plus', slug: { current: 'chatgpt-plus' }, category: 'ai' },
            { _id: '2', name: 'Claude Pro', slug: { current: 'claude-pro' }, category: 'ai' },
            { _id: '3', name: 'Spotify Premium', slug: { current: 'spotify-premium' }, category: 'music' },
            { _id: '4', name: 'Netflix Premium', slug: { current: 'netflix-premium' }, category: 'entertainment' },
            { _id: '5', name: 'YouTube Premium', slug: { current: 'youtube-premium' }, category: 'educational' },
            { _id: '6', name: 'Instagram Premium', slug: { current: 'instagram-premium' }, category: 'social-media' },
            { _id: '7', name: 'LinkedIn Premium', slug: { current: 'linkedin-premium' }, category: 'social-media' },
            { _id: '8', name: 'Coursera Plus', slug: { current: 'coursera-plus' }, category: 'educational' },
            { _id: '9', name: 'Udemy Business', slug: { current: 'udemy-business' }, category: 'educational' }
          ])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to sample products on error
        setProducts([
          { _id: '1', name: 'ChatGPT Plus', slug: { current: 'chatgpt-plus' }, category: 'ai' },
          { _id: '2', name: 'Claude Pro', slug: { current: 'claude-pro' }, category: 'ai' },
          { _id: '3', name: 'Spotify Premium', slug: { current: 'spotify-premium' }, category: 'music' },
          { _id: '4', name: 'Netflix Premium', slug: { current: 'netflix-premium' }, category: 'entertainment' },
          { _id: '5', name: 'YouTube Premium', slug: { current: 'youtube-premium' }, category: 'educational' },
          { _id: '6', name: 'Instagram Premium', slug: { current: 'instagram-premium' }, category: 'social-media' },
          { _id: '7', name: 'LinkedIn Premium', slug: { current: 'linkedin-premium' }, category: 'social-media' },
          { _id: '8', name: 'Coursera Plus', slug: { current: 'coursera-plus' }, category: 'educational' },
          { _id: '9', name: 'Udemy Business', slug: { current: 'udemy-business' }, category: 'educational' }
        ])
      }
    }
    
    fetchProducts()
  }, [])

  // Fetch courses from Sanity
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses')
        if (response.ok) {
          const coursesData = await response.json()
          setCourses(coursesData)
        } else {
          // Fallback to sample courses if no courses in Sanity
          setCourses([
            { _id: '1', title: 'آشنایی با ChatGPT', slug: { current: 'chatgpt-intro' }, category: 'ai' },
            { _id: '2', title: 'تکنیک‌های پرامپت نویسی', slug: { current: 'prompt-techniques' }, category: 'ai' },
            { _id: '3', title: 'هوش مصنوعی برای مبتدیان', slug: { current: 'ai-beginners' }, category: 'ai' },
            { _id: '4', title: 'هوش مصنوعی در بازاریابی', slug: { current: 'ai-marketing' }, category: 'business' },
            { _id: '5', title: 'مدیریت پروژه با AI', slug: { current: 'ai-project-management' }, category: 'business' },
            { _id: '6', title: 'تولید محتوا با AI', slug: { current: 'ai-content-creation' }, category: 'design' },
            { _id: '7', title: 'ساخت ویدیو با هوش مصنوعی', slug: { current: 'ai-video-creation' }, category: 'design' },
            { _id: '8', title: 'طراحی گرافیک با AI', slug: { current: 'ai-graphic-design' }, category: 'design' },
            { _id: '9', title: 'برنامه‌نویسی با کمک AI', slug: { current: 'ai-programming' }, category: 'programming' }
          ])
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        // Fallback to sample courses on error
        setCourses([
          { _id: '1', title: 'آشنایی با ChatGPT', slug: { current: 'chatgpt-intro' }, category: 'ai' },
          { _id: '2', title: 'تکنیک‌های پرامپت نویسی', slug: { current: 'prompt-techniques' }, category: 'ai' },
          { _id: '3', title: 'هوش مصنوعی برای مبتدیان', slug: { current: 'ai-beginners' }, category: 'ai' },
          { _id: '4', title: 'هوش مصنوعی در بازاریابی', slug: { current: 'ai-marketing' }, category: 'business' },
          { _id: '5', title: 'مدیریت پروژه با AI', slug: { current: 'ai-project-management' }, category: 'business' },
          { _id: '6', title: 'تولید محتوا با AI', slug: { current: 'ai-content-creation' }, category: 'design' },
          { _id: '7', title: 'ساخت ویدیو با هوش مصنوعی', slug: { current: 'ai-video-creation' }, category: 'design' },
          { _id: '8', title: 'طراحی گرافیک با AI', slug: { current: 'ai-graphic-design' }, category: 'design' },
          { _id: '9', title: 'برنامه‌نویسی با کمک AI', slug: { current: 'ai-programming' }, category: 'programming' }
        ])
      }
    }
    
    fetchCourses()
  }, [])
  
  const promoCards = heroData?.promoCards || []
  const discountedProductsFromSanity = heroData?.discountedProducts || []
  const socialMediaProductsFromSanity = heroData?.socialMediaProducts || []
  const educationalProductsFromSanity = heroData?.educationalProducts || []
  const bestsellingCoursesFromSanity = heroData?.bestsellingCourses || []
  const magazinePostsFromSanity = heroData?.magazinePosts || []
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [user, setUser] = useState({ name: "مهدی", email: "mehdi@example.com" })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  // Cart state and handlers
  const [cartState, setCartState] = useState({ itemCount: 0 }) // Example cart state
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false)

  const handleCartClick = () => {
    setIsCartDropdownOpen(!isCartDropdownOpen)
  }

  const sliderData = {
    topBanner: topBannerSlides,
    mainSlider: heroSlides,
    sideBannerLeft: promoCards[0],
    sideBannerRight: promoCards[1],
  }

  const discountedProducts = discountedProductsFromSanity.map((dp, i) => ({
    id: i + 1,
    name: dp.name || '',
    category: dp.category || 'applied-ai',
    originalPrice: dp.originalPrice || 0,
    discountedPrice: dp.discountedPrice || 0,
    discountPercentage: dp.discountPercentage || 0,
    image: (dp as any)?.imageUrl || `https://placehold.co/400x300/10B981/FFFFFF?text=${encodeURIComponent(dp.name || 'Product')}`,
    description: dp.description || '',
    slug: dp.slug || '',
  }))

  const socialMediaProducts = socialMediaProductsFromSanity.map((smp, i) => ({
    id: i + 1,
    name: smp.name || '',
    category: smp.category || 'social-media',
    price: smp.price || 0,
    originalPrice: smp.originalPrice || 0,
    discountPercentage: smp.discountPercentage || 0,
    image: (smp as any)?.imageUrl || `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(smp.name || 'Product')}`,
    description: smp.description || '',
    slug: smp.slug || '',
  }))

  const educationalProducts = educationalProductsFromSanity.map((edp, i) => ({
    id: i + 1,
    name: edp.name || '',
    category: edp.category || 'education',
    price: edp.price || 0,
    originalPrice: edp.originalPrice || 0,
    discountPercentage: edp.discountPercentage || 0,
    image: (edp as any)?.imageUrl || `/placeholder.svg?height=120&width=120&text=${encodeURIComponent(edp.name || 'Product')}`,
    description: edp.description || '',
    slug: edp.slug || '',
  }))

  const bestsellingCourses = bestsellingCoursesFromSanity.map((course, i) => ({
    id: i + 1,
    title: course.title || '',
    description: course.description || '',
    price: course.price || 0,
    originalPrice: course.originalPrice || 0,
    image: (course as any)?.imageUrl || `https://placehold.co/600x400/E0F2FE/0891b2?text=${encodeURIComponent(course.title || 'Course')}`,
    instructor: course.instructor || '',
    duration: course.duration || '',
    students: course.students || 0,
    rating: course.rating || 0,
    category: course.category || 'programming',
    level: course.level || 'beginner',
    reviewCount: course.reviewCount || 0,
    slug: course.slug || '',
  }))


  const [storiesData, setStoriesData] = useState([
    {
      id: 1,
      user: "جدیدترین‌ها",
      img: "https://placehold.co/80x80/E0F2FE/0891b2?text=New",
      fullImg: "https://placehold.co/400x600/E0F2FE/0891b2?text=Latest+News+Story",
      seen: false,
      viewed: false, // Added viewed state to track clicked stories
    },
    {
      id: 2,
      user: "تخفیف برق‌آسا",
      img: "https://placehold.co/80x80/FEF3C7/F59E0B?text=Sale",
      fullImg: "https://placehold.co/400x600/FEF3C7/F59E0B?text=Lightning+Sale+Story",
      seen: false,
      viewed: false, // Added viewed state
    },
    {
      id: 3,
      user: "الکترونیک",
      img: "https://placehold.co/80x80/E0E7FF/4F46E5?text=Tech",
      fullImg: "https://placehold.co/400x600/E0E7FF/4F46E5?text=Electronics+Story",
      seen: true,
      viewed: false, // Added viewed state
    },
    {
      id: 4,
      user: "فشن",
      img: "https://placehold.co/80x80/FCE7F3/EC4899?text=Fashion",
      fullImg: "https://placehold.co/400x600/FCE7F3/EC4899?text=Fashion+Story",
      seen: false,
      viewed: false, // Added viewed state
    },
    {
      id: 5,
      user: "خانه و دکور",
      img: "https://placehold.co/80x80/D1FAE5/10B981?text=Home",
      fullImg: "https://placehold.co/400x600/D1FAE5/10B981?text=Home+Decor+Story",
      seen: true,
      viewed: false, // Added viewed state
    },
    {
      id: 6,
      user: "موبایل",
      img: "https://placehold.co/80x80/F3E8FF/8B5CF6?text=Mobile",
      fullImg: "https://placehold.co/400x600/F3E8FF/8B5CF6?text=Mobile+Story",
      seen: false,
      viewed: false, // Added viewed state
    },
    {
      id: 7,
      user: "ورزش",
      img: "https://placehold.co/80x80/DBEAFE/3B82F6?text=Sport",
      fullImg: "https://placehold.co/400x600/DBEAFE/3B82F6?text=Sports+Story",
      seen: true,
      viewed: false, // Added viewed state
    },
  ])

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen)
    } else {
      window.location.href = "/login"
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation - in real app, this would be API call
    if (loginForm.email && loginForm.password) {
      setIsAuthenticated(true)
      setIsLoginModalOpen(false)
      setLoginForm({ email: "", password: "" })
      // In real app, you'd get user data from API response
      setUser({ name: "مهدی", email: loginForm.email })
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation - in real app, this would be API call
    if (
      registerForm.name &&
      registerForm.email &&
      registerForm.password &&
      registerForm.password === registerForm.confirmPassword
    ) {
      setIsAuthenticated(true)
      setIsLoginModalOpen(false)
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" })
      setUser({ name: registerForm.name, email: registerForm.email })
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsProfileDropdownOpen(false)
    setUser({ name: "", email: "" })
  }

  const openStoryViewer = (index: number) => {
    setCurrentStoryIndex(index)
    setIsStoryViewerOpen(true)
    setStoriesData((prev) => prev.map((story, i) => (i === index ? { ...story, viewed: true } : story)))
  }

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false)
  }

  const nextStory = () => {
    const nextIndex = (currentStoryIndex + 1) % storiesData.length
    setCurrentStoryIndex(nextIndex)
    setStoriesData((prev) => prev.map((story, i) => (i === nextIndex ? { ...story, viewed: true } : story)))
  }

  const prevStory = () => {
    const prevIndex = currentStoryIndex === 0 ? storiesData.length - 1 : currentStoryIndex - 1
    setCurrentStoryIndex(prevIndex)
    setStoriesData((prev) => prev.map((story, i) => (i === prevIndex ? { ...story, viewed: true } : story)))
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR")
  }

  // Dummy bannerImages array to resolve the lint error
  const bannerImages = ["/banner1.jpg", "/banner2.jpg"]

  useEffect(() => {
    const storiesContainer = document.getElementById("storiesContainer")

    if (storiesContainer) {
      // Clear existing stories
      storiesContainer.innerHTML = ""

      storiesData.forEach((story, index) => {
        const storyElement = document.createElement("div")
        storyElement.className =
          "flex-shrink-0 flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer transition-transform duration-200 hover:scale-105"

        let borderClass = "story-unseen" // Default for unseen stories
        if (story.viewed) {
          borderClass = "story-viewed" // No border for viewed stories
        } else if (story.seen) {
          borderClass = "story-seen" // Gray border for seen but not viewed
        }

        storyElement.innerHTML = `
          <div class="p-1 rounded-full ${borderClass}">
            <img class="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" src="${story.img}" alt="${story.user}">
          </div>
          <p class="text-xs text-gray-600 text-center max-w-[70px] truncate">${story.user}</p>
        `

        storyElement.addEventListener("click", () => {
          openStoryViewer(index)
        })

        storiesContainer.appendChild(storyElement)
      })

      const leftArrow = document.getElementById("storiesLeftArrow")
      const rightArrow = document.getElementById("storiesRightArrow")

      const updateArrowVisibility = () => {
        if (leftArrow && rightArrow) {
          const { scrollLeft, scrollWidth, clientWidth } = storiesContainer

          // Show/hide left arrow
          if (scrollLeft > 0) {
            leftArrow.classList.remove("opacity-0", "pointer-events-none")
            leftArrow.classList.add("opacity-100", "pointer-events-auto")
          } else {
            leftArrow.classList.add("opacity-0", "pointer-events-none")
            leftArrow.classList.remove("opacity-100", "pointer-events-auto")
          }

          // Show/hide right arrow
          if (scrollLeft < scrollWidth - clientWidth - 10) {
            rightArrow.classList.remove("opacity-0", "pointer-events-none")
            rightArrow.classList.add("opacity-100", "pointer-events-auto")
          } else {
            rightArrow.classList.add("opacity-0", "pointer-events-none")
            rightArrow.classList.remove("opacity-100", "pointer-events-auto")
          }
        }
      }

      // Initial check
      updateArrowVisibility()

      // Add scroll listener
      storiesContainer.addEventListener("scroll", updateArrowVisibility)

      // Add resize listener to update arrows on window resize
      window.addEventListener("resize", updateArrowVisibility)

      // Cleanup function
      return () => {
        storiesContainer.removeEventListener("scroll", updateArrowVisibility)
        window.removeEventListener("resize", updateArrowVisibility)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const profileContainer = document.getElementById("profileContainer")
      if (profileContainer && !profileContainer.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
      // Close cart dropdown if clicking outside
      const cartContainer = document.getElementById("cartContainer") // Assuming cart has an ID
      if (cartContainer && !cartContainer.contains(event.target as Node)) {
        setIsCartDropdownOpen(false)
      }
    }

    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length)
    }, 4000) // Switch every 4 seconds

    // Stories navigation logic
    const storiesContainerElement = document.getElementById("storiesContainer")
    const storiesLeftArrow = document.getElementById("storiesLeftArrow")
    const storiesRightArrow = document.getElementById("storiesRightArrow")

    const updateArrowVisibility = () => {
      if (storiesContainerElement && storiesLeftArrow && storiesRightArrow) {
        storiesLeftArrow.style.opacity = storiesContainerElement.scrollLeft > 0 ? "1" : "0"
        storiesLeftArrow.style.pointerEvents = storiesContainerElement.scrollLeft > 0 ? "auto" : "none"
        storiesRightArrow.style.opacity =
          storiesContainerElement.scrollLeft <
          storiesContainerElement.scrollWidth - storiesContainerElement.clientWidth - 1
            ? "1"
            : "0"
        storiesRightArrow.style.pointerEvents =
          storiesContainerElement.scrollLeft <
          storiesContainerElement.scrollWidth - storiesContainerElement.clientWidth - 1
            ? "auto"
            : "none"
      }
    }

    if (storiesContainerElement) {
      storiesContainerElement.addEventListener("scroll", updateArrowVisibility)
    }

    // Initial check for arrow visibility
    updateArrowVisibility()

    const mobileMenuButton = document.getElementById("mobileMenuButton")
    const mobileMenu = document.getElementById("mobileMenu")
    const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop")

    const toggleMobileMenu = () => {
      if (mobileMenu && mobileMenuBackdrop) {
        const isOpen = mobileMenu.classList.contains("translate-x-0")
        if (isOpen) {
          // Close menu
          mobileMenu.classList.remove("translate-x-0")
          mobileMenu.classList.add("translate-x-full")
          mobileMenuBackdrop.classList.remove("opacity-100", "pointer-events-auto")
          mobileMenuBackdrop.classList.add("opacity-0", "pointer-events-none")
        } else {
          // Open menu
          mobileMenu.classList.remove("translate-x-full")
          mobileMenu.classList.add("translate-x-0")
          mobileMenuBackdrop.classList.remove("opacity-0", "pointer-events-none")
          mobileMenuBackdrop.classList.add("opacity-100", "pointer-events-auto")
        }
      }
    }

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", toggleMobileMenu)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      clearInterval(bannerInterval) // Clean up banner interval
      if (storiesContainerElement) {
        storiesContainerElement.removeEventListener("scroll", updateArrowVisibility)
      }
      if (mobileMenuButton) {
        mobileMenuButton.removeEventListener("click", toggleMobileMenu)
      }
    }
  }, [storiesData, bannerImages.length]) // Added bannerImages.length to dependencies

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  const handleStoriesScroll = (direction: "left" | "right") => {
    if (typeof window !== "undefined") {
      const container = document.getElementById("storiesContainer")
      if (container) {
        const scrollAmount = direction === "left" ? -200 : 200
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="hidden lg:block">
        <RobotAssistant />
      </div>

      {isStoryViewerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center"
          onClick={closeStoryViewer} // Added click to close on backdrop
        >
          <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation() // Prevent event bubbling
                closeStoryViewer()
              }}
              className="absolute top-4 right-4 z-[110] w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Story Progress Bars */}
            <div className="absolute top-4 left-4 right-16 z-[105] flex space-x-1 space-x-reverse">
              {storiesData.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      index < currentStoryIndex ? "w-full" : index === currentStoryIndex ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Story Content */}
            <div
              className="relative w-full h-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on story content
            >
              <img
                src={storiesData[currentStoryIndex].fullImg || "/placeholder.svg"}
                loading="lazy"
                alt={storiesData[currentStoryIndex].user}
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Story Info */}
              <div className="absolute top-16 left-4 right-4 z-[105]">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <img
                    src={storiesData[currentStoryIndex].img || "/placeholder.svg"}
                    loading="lazy"
                    alt={storiesData[currentStoryIndex].user}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="text-white font-semibold text-sm">{storiesData[currentStoryIndex].user}</span>
                </div>
              </div>

              {/* Navigation Areas */}
              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  prevStory()
                }}
                className="absolute left-0 top-0 w-1/3 h-full z-[105] flex items-center justify-start pl-4 text-white opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  nextStory()
                }}
                className="absolute right-0 top-0 w-1/3 h-full z-[105] flex items-center justify-end pr-4 text-white opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Tap Areas for Mobile */}
              <div
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  prevStory()
                }}
                className="absolute left-0 top-0 w-1/3 h-full z-[105] sm:hidden"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation() // Prevent event bubbling
                  nextStory()
                }}
                className="absolute right-0 top-0 w-1/3 h-full z-[105] sm:hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="sticky top-0 z-50 glassmorphism">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              id="mobileMenuButton"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              aria-label="باز کردن منو"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
                <div className="w-5 h-0.5 bg-gray-600 transition-colors hover:bg-blue-600"></div>
              </div>
            </button>

            {/* Logo and Name */}
            <div className="relative flex items-center space-x-2 sm:space-x-4 space-x-reverse cursor-pointer">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                <img
                  src="/images/design-mode/Group%201(1).png"
                  alt="SharifGPT Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">SharifGPT</h1>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
              <div className="h-8 border-l border-gray-300"></div>
              <div className="relative group">
                <Link
                  href="/products"
                  className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
                >
                  <span>محصولات</span>
                  <svg
                    className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* Products Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Products from Sanity */}
                      {products.length > 0 ? (
                        products.slice(0, 9).map((product, index) => (
                          <div key={product._id || index} className="col-span-1">
                            <Link
                              href={`/products/${product.slug?.current || product.slug || '#'}`}
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">
                                  {product.category === 'ai' ? '🤖' : 
                                   product.category === 'music' ? '🎵' : 
                                   product.category === 'social-media' ? '📱' : 
                                   product.category === 'educational' ? '📚' : 
                                   product.category === 'entertainment' ? '🎬' : '📦'}
                                </span>
                              </div>
                              <span>{product.name || 'محصول'}</span>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p className="text-gray-500">هیچ محصولی یافت نشد</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link
                  href="/courses"
                  className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
                >
                  <span>دوره‌ها</span>
                  <svg
                    className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* Courses Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Courses from Sanity */}
                      {courses.length > 0 ? (
                        courses.slice(0, 9).map((course, index) => (
                          <div key={course._id || index} className="col-span-1">
                            <Link
                              href={`/courses/${course.slug?.current || course.slug || '#'}`}
                              className="flex items-center text-gray-600 hover:text-[#3092BE] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center ml-3">
                                <span className="text-white text-xs font-bold">
                                  {course.category === 'ai' ? '🤖' : 
                                   course.category === 'business' ? '💼' : 
                                   course.category === 'design' ? '🎨' : 
                                   course.category === 'programming' ? '💻' : 
                                   course.category === 'marketing' ? '📊' : 
                                   course.category === 'web-development' ? '🌐' : 
                                   course.category === 'data-science' ? '📈' : '📚'}
                                </span>
                              </div>
                              <span>{course.title || course.name || 'دوره'}</span>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p className="text-gray-500">هیچ دوره‌ای یافت نشد</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/enterprise"
                className="flex items-center text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)] whitespace-nowrap"
              >
                <span>فروش سازمانی</span>
                <svg
                  className="w-4 h-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#3092BE] transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium transform hover:scale-105 hover:shadow-[0_0_15px_rgba(48,146,190,0.3)]"
              >
                مجله
              </Link>
            </nav>

            {/* Actions: Search, Contact, Cart, Profile */}
            <div className="flex items-center space-x-3 sm:space-x-5 space-x-reverse">
              {/* Search Box */}
              <div className="relative hidden xl:block">
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-40 xl:w-48 bg-gray-100 border border-[#3092BE] rounded-full py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3092BE] transition-all duration-300 ease-in-out hover:w-48 xl:hover:w-60 focus:w-48 xl:focus:w-60"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>

              {/* Contact */}
              <div className="hidden md:flex items-center space-x-2 space-x-reverse border-l border-gray-300 pl-3 sm:pl-5">
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <a
                      href="/contact"
                      className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#3092BE] transition-colors cursor-pointer"
                    >
                      تماس با ما
                    </a>
                    <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">وضعیت: آنلاین</p>
                </div>
              </div>

              <div className="relative" id="profileContainer">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* Cart Icon - Separate Circle */}
                  <div className="relative" id="cartContainer">
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#3092BE] flex items-center justify-center bg-white shadow-sm cursor-pointer transition-transform duration-300 transform hover:scale-110"
                      onClick={handleCartClick}
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-[#3092BE]"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      {/* Cart Badge */}
                      {cartState.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartState.itemCount}
                        </span>
                      )}
                    </div>
                    {/* Cart Dropdown */}
                    <CartDropdown isOpen={isCartDropdownOpen} onClose={() => setIsCartDropdownOpen(false)} />
                  </div>

                  {/* Profile Icon - Separate Circle */}
                  <div className="relative">
                    <div
                      className="cursor-pointer transition-transform duration-300 transform hover:scale-110"
                      onClick={handleProfileClick}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border-2 border-white">
                        {isAuthenticated ? (
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src="/images/design-mode/3Y1Z0Qj(2).png"
                            alt="آواتار کاربر"
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                          >
                            <path
                              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobileMenu"
          className={`fixed inset-y-0 right-0 z-[9999] w-80 backdrop-blur-xl bg-white/95 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white" />
                    <path
                      d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
                      fill="white"
                      opacity="0.8"
                    />
                    <path d="M5 6L5.5 8L7 8.5L5.5 9L5 11L4.5 9L3 8.5L4.5 8L5 6Z" fill="white" opacity="0.6" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800">منو</h2>
              </div>
              <button
                onClick={handleMobileMenuClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {/* Products */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <Link
                    href="/products"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <span className="font-medium">محصولات</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Courses */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <Link
                    href="/courses"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                        </svg>
                      </div>
                      <span className="font-medium">دوره‌ها</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Enterprise */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <Link
                    href="/enterprise"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                        </svg>
                      </div>
                      <span className="font-medium">فروش سازمانی</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Blog */}
                <div>
                  <Link
                    href="/blog"
                    className="flex items-center justify-between p-3 text-gray-700 hover:text-[#3092BE] hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    onClick={handleMobileMenuClose}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                      </div>
                      <span className="font-medium">بلاگ</span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#3092BE] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div
          id="mobileMenuBackdrop"
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] transition-all duration-300 lg:hidden ${
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={handleMobileMenuClose}
        ></div>
      </header>

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stories Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{"اتفاقات جدید امروز"}</h2>
          <div className="relative">
            {/* Left Arrow */}
            <button
              id="storiesLeftArrow"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 pointer-events-none"
              onClick={() => handleStoriesScroll("left")}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              id="storiesRightArrow"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 pointer-events-none"
              onClick={() => handleStoriesScroll("right")}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div
              id="storiesContainer"
              className="flex space-x-3 sm:space-x-4 space-x-reverse overflow-x-auto pb-4 scrollbar-hide"
            >
              {/* Stories will be injected by JS */}
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-20">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* اسلایدر بنر بالا */}
              <div className="w-full h-[200px] md:h-[250px] lg:h-[280px]">
                <IndependentSlider items={sliderData.topBanner} />
              </div>

              {/* بخش اصلی (اسلایدر وسط و بنرهای کناری) */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-6 h-auto lg:h-[450px]">
                {/* بنر سمت راست (در موبایل زیر اسلایدر) */}
                <div className="w-full lg:w-1/4 h-full hidden lg:block">
                  <PromoCard item={sliderData.sideBannerRight} />
                </div>

                {/* اسلایدر اصلی وسط */}
                <div className="w-full lg:w-1/2 h-full">
                  <IndependentSlider items={sliderData.mainSlider} />
                </div>

                {/* بنر سمت چپ (در موبایل زیر اسلایدر) */}
                <div className="w-full lg:w-1/4 h-full hidden lg:block">
                  <PromoCard item={sliderData.sideBannerLeft} />
                </div>

                {/* نمایش بنرها در موبایل */}
                <div className="w-full grid grid-cols-2 gap-4 lg:hidden mt-4">
                  <div className="h-[250px]">
                    <PromoCard item={sliderData.sideBannerRight} />
                  </div>
                  <div className="h-[250px]">
                    <PromoCard item={sliderData.sideBannerLeft} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 sm:mb-20">
          <div
            id="categoryContainer"
            className="flex items-center gap-3 p-4 overflow-x-auto scrollbar-hide max-w-6xl mx-auto sm:justify-center sm:gap-4 sm:flex-nowrap sm:overflow-x-visible"
          >
            {/* هوش مصنوعی */}
            <Link href="/products?category=ai">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 bg-blue-600 flex-shrink-0 sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(81,130,239,1)] sm:w-14 sm:h-14">
                  <img
                    src="/robot-ai-icon.png"
                    alt="آیکون هوش مصنوعی"
                    className="w-6 h-6 object-contain sm:w-9 sm:h-9"
                  />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">هوش مصنوعی</h3>
                  <p className="text-xs opacity-90 hidden sm:block">اکانت های هوش مصنوعی</p>
                </div>
              </div>
            </Link>

            {/* سوشیال مدیا */}
            <Link href="/products?category=social-media">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 flex-shrink-0 bg-[rgba(53,56,69,1)] sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(53,56,69,1)] sm:w-14 sm:h-14">
                  <img
                    src="/bird-social-icon.png"
                    alt="آیکون سوشیال مدیا"
                    className="w-6 h-6 object-contain sm:w-9 sm:h-9"
                  />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">سوشیال مدیا</h3>
                  <p className="text-xs opacity-90 hidden sm:block">اکانت های سوشیال مدیا</p>
                </div>
              </div>
            </Link>

            {/* موسیقی */}
            <Link href="/products?category=music">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 flex-shrink-0 bg-[rgba(5,150,105,1)] sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(55,171,135,1)] sm:w-14 sm:h-14">
                  <img src="/music-note-icon.png" alt="آیکون موسیقی" className="w-6 h-6 object-contain sm:w-9 sm:h-9" />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">موسیقی</h3>
                  <p className="text-xs opacity-90 hidden sm:block">استریم موسیقی</p>
                </div>
              </div>
            </Link>

            {/* آموزشی */}
            <Link href="/products?category=educational">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 bg-lime-600 flex-shrink-0 sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(132,181,61,1)] sm:w-14 sm:h-14">
                  <img
                    src="/owl-education-icon.png"
                    alt="آیکون آموزشی"
                    className="w-6 h-6 object-contain sm:w-9 sm:h-9"
                  />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">آموزشی</h3>
                  <p className="text-xs opacity-90 hidden sm:block">اکانت های آموزشی</p>
                </div>
              </div>
            </Link>

            {/* سیمکارت */}
            <Link href="/products?category=sim-card">
              <div className="flex items-center justify-start w-40 h-14 p-2 pl-3 rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 bg-pink-500 flex-shrink-0 sm:w-64 sm:h-20 sm:p-3 sm:pl-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 overflow-hidden bg-[rgba(255,173,219,1)] sm:w-14 sm:h-14">
                  <img src="/sim-card-icon.png" alt="آیکون سیمکارت" className="w-6 h-6 object-contain sm:w-9 sm:h-9" />
                </div>
                <div className="text-right text-white mr-2 sm:mr-3">
                  <h3 className="text-sm font-bold sm:text-lg">سیمکارت</h3>
                  <p className="text-xs opacity-90 hidden sm:block">خرید سیمکارت مجازی</p>
                </div>
              </div>
            </Link>
          </div>

          <div
            id="categoryScrollbar"
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-400 rounded-full opacity-0 transition-opacity duration-300"
            style={{ transform: "scaleX(0)", transformOrigin: "left" }}
          ></div>
        </section>

        {discountedProducts.length > 0 && (
        <section className="mb-16 sm:mb-20 relative">
          <div className="backdrop-blur-md bg-red-500/15 border border-red-300/30 rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-6 sm:mb-8">تخفیفات ویژه</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 px-2 py-4">
              {discountedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  description={product.description}
                  price={product.discountedPrice}
                  originalPrice={product.originalPrice}
                  discountPercentage={product.discountPercentage}
                  image={product.image}
                  category={product.category}
                  href={`/products/${product.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
        )}

        {socialMediaProducts.length > 0 && (
        <section className="mb-16 sm:mb-20 relative" id="social-media-products">
          <div className="backdrop-blur-md bg-[#b52492]/15 border rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl overflow-hidden border-[rgba(255,149,0,0.3)]">
            <h2 className="text-lg sm:text-xl font-bold text-pink-800 mb-6 sm:mb-8">پرفروش‌ترین محصولات سوشیال مدیا</h2>
            <div className="relative px-2 py-2">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={8}
                slidesPerView={1.1}
                navigation={{
                  nextEl: ".swiper-button-next-social",
                  prevEl: ".swiper-button-prev-social",
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-social",
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.8,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 3.2,
                    spaceBetween: 12,
                  },
                }}
                dir="rtl"
                className="!pb-12"
              >
                {socialMediaProducts.map((product) => (
                  <SwiperSlide key={product.id} className="!h-auto">
                    <ProductCard
                      id={product.id}
                      title={product.name}
                      description={product.description}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      discountPercentage={product.discountPercentage}
                      image={product.image}
                      category={product.category}
                      href={`/products/${product.slug}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-button-next-social absolute top-1/2 -right-2 transform -translate-y-1/2 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors z-10 text-sm">
                ←
              </div>
              <div className="swiper-button-prev-social absolute top-1/2 -left-2 transform -translate-y-1/2 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors z-10 text-sm">
                →
              </div>

              <div className="swiper-pagination-social !bottom-0 !relative mt-4 text-center"></div>
            </div>
          </div>
        </section>
        )}

        {educationalProducts.length > 0 && (
        <section className="mb-16 sm:mb-20 relative" id="educational-products">
          <div className="backdrop-blur-md bg-[#5ea500]/15 border border-green-400/30 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl overflow-hidden">
            <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-6 sm:mb-8">پرفروش‌ترین محصولات آموزشی</h2>
            <div className="relative px-4 py-2">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1.1}
                navigation={{
                  nextEl: ".swiper-button-next-edu",
                  prevEl: ".swiper-button-prev-edu",
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-edu",
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.8,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3.2,
                    spaceBetween: 24,
                  },
                }}
                dir="rtl"
                className="!pb-12"
              >
                {educationalProducts.map((product) => (
                  <SwiperSlide key={product.id} className="!h-auto">
                    <div className="p-2">
                      <ProductCard
                        id={product.id}
                        title={product.name}
                        description={product.description}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        discountPercentage={product.discountPercentage}
                        image={product.image}
                        category={product.category}
                        href={`/products/${product.slug}`}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-button-next-edu absolute top-1/2 -right-2 transform -translate-y-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors z-10 text-sm">
                ←
              </div>
              <div className="swiper-button-prev-edu absolute top-1/2 -left-2 transform -translate-y-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors z-10 text-sm">
                →
              </div>

              <div className="swiper-pagination-edu !bottom-0 !relative mt-4 text-center"></div>
            </div>
          </div>
        </section>
        )}

        {bestsellingCourses.length > 0 && (
        <section className="mb-16 sm:mb-20">
          <div className="backdrop-blur-md bg-blue-500/15 border border-blue-200/30 rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-6 sm:mb-8">پرفروش‌ترین دوره‌ها</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 py-4">
              {bestsellingCourses.map((course) => (
                <ProductCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  price={course.price}
                  originalPrice={course.originalPrice > course.price ? course.originalPrice : undefined}
                  discountPercentage={
                    course.originalPrice > course.price
                      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
                      : undefined
                  }
                  rating={course.rating}
                  reviewCount={course.reviewCount}
                  image={course.image}
                  category={course.category}
                  href={`/courses/${course.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* SharifGPT Magazine section with selected blog posts */}
        {magazinePostsFromSanity.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">مجله شریف جی پی تی</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                بهترین پرامپت ها و آموزش ها و اخبار جدید رو تو مجله شریف پیدا کن!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-right">
              {magazinePostsFromSanity.map((post, index) => {
                const colors = [
                  { bg: 'from-green-400 to-green-600', hover: 'text-green-600' },
                  { bg: 'from-cyan-400 to-blue-600', hover: 'text-blue-600' },
                  { bg: 'from-purple-500 to-purple-700', hover: 'text-purple-600' }
                ]
                const color = colors[index % colors.length]
                const position = index === 0 ? 'left-4' : index === 1 ? 'left-1/2 transform -translate-x-1/2' : 'right-4'
                
                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative">
                      <img
                        src={post.coverImageUrl || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-4 ${position}`}>
                        <div className={`bg-gradient-to-r ${color.bg} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}>
                          <span>#</span>
                          <span>{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className={`text-lg font-bold text-gray-800 mb-2 group-hover:${color.hover} transition-colors`}>
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{post.excerpt || 'مقاله جذاب و کاربردی'}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{post.rating || 4.5}</span>
                        </div>
                        <span className="text-gray-500">{post.reviewCount || 0} بازدید</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Featured Blogs Section */}
        {featuredBlogsFromSanity.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">مقالات ویژه</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                آخرین و بهترین مقالات برای شما انتخاب شده است
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
              {featuredBlogsFromSanity.map((blog, index) => {
                const categoryColors = {
                  ai: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
                  programming: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
                  tutorial: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
                  news: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
                  technology: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-500' },
                  products: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' },
                  guide: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-500' },
                  review: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-500' }
                }
                const categoryColor = categoryColors[blog.category as keyof typeof categoryColors] || categoryColors.ai
                
                return (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Blog Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.coverImageUrl || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      {/* Category Badge */}
                      {blog.category && (
                        <div className="absolute top-4 right-4">
                          <span className={`${categoryColor.bg} ${categoryColor.text} px-3 py-1 rounded-full text-xs font-bold`}>
                            {blog.category === 'ai' && 'هوش مصنوعی'}
                            {blog.category === 'programming' && 'برنامه‌نویسی'}
                            {blog.category === 'tutorial' && 'آموزش'}
                            {blog.category === 'news' && 'اخبار'}
                            {blog.category === 'technology' && 'تکنولوژی'}
                            {blog.category === 'products' && 'محصولات'}
                            {blog.category === 'guide' && 'راهنما'}
                            {blog.category === 'review' && 'نقد و بررسی'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.excerpt || 'مقاله جذاب و کاربردی'}
                      </p>

                      {/* Blog Meta */}
                      <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2">
                          {blog.author && (
                            <>
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600">{blog.author}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {blog.rating && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                              <span className="text-gray-700 font-medium">{blog.rating}</span>
                            </div>
                          )}
                          {blog.reviewCount && (
                            <span className="text-gray-500">{blog.reviewCount} بازدید</span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {blog.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section className="mb-16 sm:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">ما رو دنبال کنید</h2>
          <p className="text-gray-500 mt-2 mb-8 sm:mb-10 max-w-lg mx-auto text-sm sm:text-base">
            برای تخفیفات ویژه و آخرین اخبار شریف جی پی تی رو در سوشیال مدیا دنبال کنید
          </p>
          <div className="inline-block p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-100 via-white to-blue-100">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Instagram */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  {"SharifGPT Instagram"}
                </span>
              </a>
              {/* Twitter (X) */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-black"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-black group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  SharifGPT X
                </span>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-red-600"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  {"SharifGPT Youtube"}
                </span>
              </a>
              {/* Telegram */}
              <a
                href="#"
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-56 group hover:bg-blue-500"
              >
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.12-.05-.17-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24-.02.37z" />
                </svg>
                <span className="font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                  SharifGPT Telegram
                </span>
              </a>
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            {/* About Us Title */}
            <div className="text-right mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">درباره ما</h2>
            </div>

            {/* Feature Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {/* High Speed */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">سرعت بالا</h3>
                  <p className="text-sm text-gray-600">پردازش فوق‌العاده سریع</p>
                </div>
              </div>

              {/* High Security */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">امنیت بالا</h3>
                  <p className="text-sm text-gray-600">حفاظت کامل از داده‌ها</p>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">پشتیبانی ۲۴ ساعته</h3>
                  <p className="text-sm text-gray-600">همیشه در کنار شما</p>
                </div>
              </div>

              {/* Complete Security */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">امنیت کامل</h3>
                  <p className="text-sm text-gray-600">محافظت تمام‌جانبه</p>
                </div>
              </div>
            </div>

            {/* Description and Button */}
            <div className="text-center">
              <p className="text-gray-700 text-lg sm:text-xl mb-6 sm:mb-8">
                برای آشنایی بیشتر با شریف جی پی تی روی دکمه زیر بزنید
              </p>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-2xl sm:rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 group relative overflow-hidden text-base sm:text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  اطلاعات بیشتر
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content Sections - Bottom of Page */}
        <section className="mb-16 sm:mb-20">
          <div className="max-w-6xl mx-auto">
            {/* Main SEO Content Section */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 shadow-xl mb-8">
              <div className="prose prose-lg max-w-none text-right" dir="rtl">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  راهنمای جامع خرید اکانت پریمیوم و خدمات هوش مصنوعی
                </h2>
                
                <div className="text-gray-700 leading-relaxed space-y-6">
                  <p className="text-base sm:text-lg">
                    در دنیای امروز، دسترسی به ابزارهای پیشرفته هوش مصنوعی و پلتفرم‌های آموزشی دیجیتال به یک نیاز اساسی تبدیل شده است. 
                    سرویس ما با ارائه اکانت‌های پریمیوم معتبر و قابل اطمینان، این امکان را برای شما فراهم می‌کند تا بدون نگرانی از 
                    بهترین خدمات موجود در بازار بهره‌مند شوید. ما متخصص در فروش اکانت‌های اشتراکی پریمیوم برای انواع پلتفرم‌های محبوب 
                    از جمله ChatGPT Plus، Claude Pro، Midjourney و دهها سرویس دیگر هستیم.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    چرا خرید اکانت پریمیوم از ما؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    انتخاب یک فروشنده معتبر برای خرید اکانت‌های پریمیوم بسیار حائز اهمیت است. ما با سال‌ها تجربه در این حوزه، 
                    تضمین می‌کنیم که تمامی اکانت‌های ارائه شده توسط ما کاملاً اصل و با بالاترین کیفیت ممکن هستند. تیم پشتیبانی 
                    ما به صورت ۲۴ ساعته آماده پاسخگویی به سوالات شما بوده و در صورت بروز هر گونه مشکل، سریعاً اقدام به رفع آن 
                    خواهیم کرد. همچنین، تمامی اکانت‌ها با گارانتی تعویض ارائه می‌شوند و می‌توانید با خیال آسوده خرید خود را انجام دهید.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    انواع خدمات و محصولات ما
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    ما طیف گسترده‌ای از محصولات و خدمات دیجیتال را ارائه می‌دهیم. در بخش هوش مصنوعی، اکانت‌های پریمیوم 
                    ChatGPT Plus، Claude Pro، Gemini Advanced، Midjourney و سایر ابزارهای هوش مصنوعی پیشرفته را با قیمت‌های 
                    رقابتی و مناسب عرضه می‌کنیم. این اکانت‌ها به شما امکان دسترسی نامحدود به قدرتمندترین مدل‌های زبانی و 
                    ابزارهای تولید محتوا را می‌دهند. برای کسانی که به دنبال یادگیری و توسعه مهارت‌های خود هستند، اکانت‌های 
                    آموزشی پلتفرم‌هایی مانند Coursera Plus، Udemy Business، LinkedIn Learning و Skillshare را نیز ارائه می‌دهیم.
                  </p>

                  <div className="bg-blue-50 border-r-4 border-blue-500 p-6 my-6 rounded-lg">
                    <h4 className="text-lg font-bold text-blue-900 mb-3">نکته مهم:</h4>
                    <p className="text-blue-800">
                      تمامی اکانت‌های ارائه شده توسط ما قانونی و از طریق روش‌های معتبر تهیه شده‌اند. ما هیچ‌گونه اکانت 
                      هک شده یا غیرقانونی ارائه نمی‌دهیم و تضمین می‌کنیم که استفاده از اکانت‌های ما کاملاً ایمن است.
                    </p>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    خدمات هوش مصنوعی ما چه مزایایی دارند؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    استفاده از ابزارهای هوش مصنوعی می‌تواند بهره‌وری شما را به طرز چشمگیری افزایش دهد. با اکانت ChatGPT Plus، 
                    شما به آخرین نسخه GPT-4 دسترسی خواهید داشت که قادر است پاسخ‌های دقیق‌تر و جامع‌تری نسبت به نسخه رایگان 
                    ارائه دهد. Claude Pro نیز با توانایی پردازش متن‌های طولانی‌تر و درک بهتر زمینه، ابزاری عالی برای 
                    نویسندگان، محققان و برنامه‌نویسان است. Midjourney برای طراحان گرافیک و هنرمندان دیجیتال که به دنبال تولید 
                    تصاویر با کیفیت بالا از طریق هوش مصنوعی هستند، گزینه‌ای بی‌نظیر محسوب می‌شود.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    دوره‌های آموزشی تخصصی
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    علاوه بر فروش اکانت‌های پریمیوم، ما مجموعه‌ای جامع از دوره‌های آموزشی تخصصی در زمینه‌های مختلف را نیز 
                    ارائه می‌دهیم. دوره‌های آموزش هوش مصنوعی ما شما را با نحوه استفاده حرفه‌ای از ابزارهای AI آشنا می‌کنند. 
                    از آموزش پرامپت نویسی پیشرفته گرفته تا تکنیک‌های بهینه‌سازی استفاده از ChatGPT در کسب‌وکار، همه و همه در 
                    این دوره‌ها پوشش داده می‌شوند. دوره‌های ما توسط مدرسان با تجربه و متخصص در حوزه‌های مربوطه تهیه شده‌اند 
                    و با رویکردی کاملاً کاربردی، مهارت‌های عملی مورد نیاز بازار کار را به شما آموزش می‌دهند.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary SEO Content Section */}
            <div className="backdrop-blur-md bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 shadow-xl mb-8">
              <div className="prose prose-lg max-w-none text-right" dir="rtl">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  راهنمای خرید اکانت اشتراکی و نکات مهم
                </h2>
                
                <div className="text-gray-700 leading-relaxed space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    نحوه خرید و دریافت اکانت
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    فرآیند خرید از سایت ما بسیار ساده و سریع است. پس از انتخاب محصول یا خدمت مورد نظر خود، آن را به سبد 
                    خرید اضافه کرده و به صفحه پرداخت هدایت می‌شوید. ما از درگاه‌های پرداخت معتبر و امن استفاده می‌کنیم تا 
                    اطلاعات مالی شما کاملاً محافظت شود. بلافاصله پس از تکمیل پرداخت، اطلاعات اکانت خریداری شده از طریق ایمیل 
                    و پنل کاربری برای شما ارسال خواهد شد. در اکثر موارد، این فرآیند کمتر از ۱۵ دقیقه زمان می‌برد و می‌توانید 
                    فوراً شروع به استفاده از اکانت خود کنید.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    اکانت‌های سوشیال مدیا و سرویس‌های سرگرمی
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    در کنار خدمات هوش مصنوعی و آموزشی، ما همچنین اکانت‌های پریمیوم پلتفرم‌های محبوب سوشیال مدیا و سرویس‌های 
                    استریمینگ را نیز عرضه می‌کنیم. اگر به دنبال اکانت Spotify Premium برای دسترسی نامحدود به میلیون‌ها آهنگ 
                    بدون تبلیغ هستید، یا می‌خواهید از Netflix Premium برای تماشای محتوای با کیفیت ۴K استفاده کنید، ما بهترین 
                    قیمت‌ها را برای شما فراهم کرده‌ایم. YouTube Premium به شما امکان می‌دهد بدون وقفه تبلیغات، ویدیوها را 
                    تماشا کرده و حتی آنها را برای تماشای آفلاین دانلود کنید. برای کسانی که در حوزه حرفه‌ای فعالیت می‌کنند، 
                    LinkedIn Premium امکانات ویژه‌ای مانند InMail نامحدود و دسترسی به آمار پیشرفته را فراهم می‌کند.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    امنیت و حریم خصوصی
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    ما امنیت اطلاعات شما را بسیار جدی می‌گیریم. تمامی داده‌های شخصی و مالی با استفاده از جدیدترین 
                    پروتکل‌های امنیتی رمزنگاری می‌شوند. هیچ‌گاه اطلاعات شما را با اشخاص ثالث به اشتراک نمی‌گذاریم و 
                    سیاست‌های سخت‌گیرانه‌ای برای حفظ حریم خصوصی کاربران خود داریم. علاوه بر این، تمامی اکانت‌های ارائه شده 
                    از طریق روش‌های قانونی تهیه شده و هیچ ریسک امنیتی برای کاربران ندارند. در صورت بروز هر گونه مشکل امنیتی، 
                    که البته بسیار نادر است، تیم پشتیبانی ما فوراً با شما تماس گرفته و راهکار مناسب را ارائه خواهد داد.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center ml-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">گارانتی تعویض</h4>
                      </div>
                      <p className="text-gray-600">
                        اگر اکانت خریداری شده مشکلی داشته باشد، فوراً آن را تعویض می‌کنیم
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center ml-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">تحویل سریع</h4>
                      </div>
                      <p className="text-gray-600">
                        دریافت اکانت حداکثر ۱۵ دقیقه پس از پرداخت
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    مزایای استفاده از اکانت‌های اشتراکی
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    خرید اکانت اشتراکی نسبت به خرید مستقیم از وبسایت‌های اصلی مزایای متعددی دارد. اول از همه، شما صرفه‌جویی 
                    قابل توجهی در هزینه‌ها خواهید داشت. قیمت‌های ما به دلیل خرید عمده و استفاده از روش‌های بهینه، تا ۵۰ درصد 
                    ارزان‌تر از قیمت‌های رسمی هستند. ثانیاً، دیگر نیازی به نگرانی درباره تمدید اشتراک و پرداخت‌های دوره‌ای 
                    ندارید. ما خدمات تمدید خودکار را نیز ارائه می‌دهیم که می‌توانید از آن استفاده کنید. همچنین، برای کسانی 
                    که در ایران زندگی می‌کنند، مشکل پرداخت به سایت‌های خارجی که نیاز به کارت اعتباری بین‌المللی دارند، 
                    کاملاً حل می‌شود.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    پشتیبانی حرفه‌ای و تخصصی
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    یکی از مهم‌ترین ویژگی‌های ما، خدمات پشتیبانی قوی و کارآمد است. تیم پشتیبانی ما متشکل از افراد متخصص و 
                    با تجربه است که به صورت ۲۴ ساعته آماده کمک به شما هستند. شما می‌توانید از طریق تلگرام، واتساپ، ایمیل 
                    یا سیستم تیکت داخل سایت با ما در ارتباط باشید. زمان پاسخگویی ما معمولاً کمتر از یک ساعت است و در مواقع 
                    اضطراری، حتی سریع‌تر به درخواست‌های شما رسیدگی می‌کنیم. ما همچنین راهنماهای جامع و ویدیوهای آموزشی را 
                    برای استفاده بهینه از هر اکانتی که می‌فروشیم، در اختیار شما قرار می‌دهیم.
                  </p>
                </div>
              </div>
            </div>

            {/* Third SEO Content Section */}
            <div className="backdrop-blur-md bg-gradient-to-br from-green-50 to-blue-50 border border-green-200/50 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 shadow-xl">
              <div className="prose prose-lg max-w-none text-right" dir="rtl">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  سوالات متداول و نکات کاربردی
                </h2>
                
                <div className="text-gray-700 leading-relaxed space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    آیا استفاده از اکانت‌های اشتراکی قانونی است؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    بله، کاملاً قانونی است. تمامی اکانت‌هایی که ما ارائه می‌دهیم از طریق روش‌های مجاز و قانونی تهیه شده‌اند. 
                    ما اکانت‌های Family و Team این پلتفرم‌ها را خریداری کرده و آنها را به صورت اشتراکی در اختیار مشتریان 
                    قرار می‌دهیم که این کار کاملاً مطابق با قوانین و مقررات این سرویس‌ها است. هیچ اکانت هک شده یا سرقتی در 
                    بین محصولات ما وجود ندارد و می‌توانید با خیال راحت از آنها استفاده کنید.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    چگونه می‌توانم از کیفیت اکانت‌ها مطمئن شوم؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    ما برای اطمینان از کیفیت، تمامی اکانت‌ها را قبل از فروش به دقت تست می‌کنیم. علاوه بر این، گارانتی تعویض 
                    برای همه محصولات ما وجود دارد. اگر به هر دلیلی اکانت شما با مشکل مواجه شود، کافی است با پشتیبانی تماس 
                    بگیرید تا فوراً اکانت جایگزین برای شما ارسال شود. همچنین، نظرات و امتیازات کاربران قبلی را می‌توانید در 
                    صفحه هر محصول مشاهده کنید که نشان‌دهنده رضایت بالای مشتریان ما است. ما افتخار می‌کنیم که هزاران مشتری 
                    راضی داریم که بارها و بارها از ما خرید کرده‌اند.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    بهترین اکانت هوش مصنوعی برای چه کسانی مناسب است؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    اکانت‌های هوش مصنوعی برای طیف گسترده‌ای از کاربران مفید هستند. دانشجویان می‌توانند از ChatGPT Plus برای 
                    تحقیق، نوشتن مقالات و حل مسائل پیچیده استفاده کنند. برنامه‌نویسان با استفاده از Claude Pro می‌توانند کد 
                    بنویسند، باگ‌ها را شناسایی کنند و از هوش مصنوعی به عنوان یک دستیار برنامه‌نویسی قدرتمند بهره ببرند. 
                    نویسندگان و تولیدکنندگان محتوا می‌توانند ایده‌های خلاقانه بگیرند، متن‌های خود را ویرایش کنند و محتوای 
                    با کیفیت تولید کنند. بازاریابان دیجیتال می‌توانند از هوش مصنوعی برای تولید محتوای تبلیغاتی، تحلیل داده‌ها 
                    و بهینه‌سازی کمپین‌های خود استفاده کنند. طراحان گرافیک با Midjourney و DALL-E می‌توانند آثار هنری 
                    منحصر به فرد خلق کنند. به طور کلی، هر کسی که می‌خواهد بهره‌وری خود را افزایش دهد و از آخرین فناوری‌های 
                    هوش مصنوعی استفاده کند، می‌تواند از این اکانت‌ها بهره‌مند شود.
                  </p>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-r-4 border-purple-500 p-6 my-6 rounded-lg">
                    <h4 className="text-lg font-bold text-purple-900 mb-3">نکته ویژه برای مشتریان جدید:</h4>
                    <p className="text-purple-800">
                      برای اولین خرید خود می‌توانید از کد تخفیف ویژه استفاده کنید. کافی است در هنگام پرداخت، کد 
                      تخفیف را وارد کنید تا از تخفیف‌های ویژه بهره‌مند شوید. همچنین با عضویت در کانال تلگرام ما، از 
                      جدیدترین تخفیف‌ها و پیشنهادات ویژه باخبر خواهید شد.
                    </p>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    چه تفاوتی بین نسخه‌های مختلف اکانت‌ها وجود دارد؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    هر پلتفرم معمولاً چندین سطح اشتراک دارد. برای مثال، Netflix دارای پلن‌های Basic، Standard و Premium است 
                    که تفاوت اصلی آنها در کیفیت ویدیو (HD یا 4K) و تعداد دستگاه‌هایی است که همزمان می‌توانند استفاده کنند. 
                    در ChatGPT، نسخه Plus به شما دسترسی به مدل GPT-4، پاسخ‌های سریع‌تر و قابلیت‌های اضافی مانند پلاگین‌ها 
                    را می‌دهد. Spotify Premium امکان دانلود موزیک برای گوش دادن آفلاین و حذف تبلیغات را فراهم می‌کند. 
                    هنگام خرید، ما تمامی ویژگی‌های هر پلن را به وضوح برای شما توضیح می‌دهیم تا بتوانید بهترین انتخاب را 
                    متناسب با نیازهای خود داشته باشید. تیم پشتیبانی ما نیز آماده است تا در انتخاب مناسب‌ترین پلن به شما 
                    مشاوره دهد.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    آیا می‌توانم چندین اکانت مختلف را با هم خریداری کنم؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    بله، حتماً! بسیاری از مشتریان ما ترکیبی از خدمات مختلف را خریداری می‌کنند. مثلاً می‌توانید همزمان 
                    ChatGPT Plus برای کارهای هوش مصنوعی، Spotify Premium برای موزیک، و Coursera Plus برای آموزش داشته باشید. 
                    ما برای خریدهای متعدد، تخفیف‌های ویژه‌ای نیز در نظر می‌گیریم. همچنین امکان خرید پکیج‌های ترکیبی وجود 
                    دارد که در آنها چندین سرویس محبوب با قیمتی مناسب‌تر ارائه می‌شوند. برای اطلاع از پکیج‌های موجود، 
                    می‌توانید با تیم فروش ما تماس بگیرید.
                  </p>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    چگونه می‌توانم از دوره‌های آموزشی شما بهره‌مند شوم؟
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    دوره‌های آموزشی ما به صورت ویدیویی و با زیرنویس فارسی ارائه می‌شوند. پس از ثبت‌نام در هر دوره، به 
                    پنل آموزشی اختصاصی دسترسی پیدا می‌کنید که در آن تمامی ویدیوها، فایل‌های تمرینی، و منابع کمکی قرار دارند. 
                    شما می‌توانید در هر زمان و از هر دستگاهی به دوره‌ها دسترسی داشته باشید و بدون محدودیت زمانی آنها را 
                    مشاهده کنید. در پایان هر دوره، آزمونی برای سنجش یادگیری شما برگزار می‌شود و در صورت قبولی، گواهینامه 
                    معتبر دریافت خواهید کرد. همچنین، در تمام طول دوره، می‌توانید سوالات خود را در بخش کامنت‌ها مطرح کنید 
                    و مدرس یا سایر دانشجویان به شما پاسخ خواهند داد.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <div className="bg-white p-5 rounded-xl shadow-md text-center border-t-4 border-blue-500">
                      <div className="text-3xl font-bold text-blue-600 mb-2">+۱۰,۰۰۰</div>
                      <div className="text-gray-600">مشتری راضی</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-md text-center border-t-4 border-green-500">
                      <div className="text-3xl font-bold text-green-600 mb-2">+۵۰</div>
                      <div className="text-gray-600">سرویس مختلف</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-md text-center border-t-4 border-purple-500">
                      <div className="text-3xl font-bold text-purple-600 mb-2">۲۴/۷</div>
                      <div className="text-gray-600">پشتیبانی آنلاین</div>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4">
                    آینده هوش مصنوعی و اهمیت دسترسی به ابزارهای پیشرفته
                  </h3>
                  
                  <p className="text-base sm:text-lg">
                    ما در آستانه یک انقلاب تکنولوژیکی هستیم که هوش مصنوعی نقش کلیدی در آن ایفا می‌کند. در سال‌های آینده، 
                    تسلط بر ابزارهای هوش مصنوعی به یک مهارت ضروری برای بسیاری از مشاغل تبدیل خواهد شد. کسانی که همین الان 
                    شروع به یادگیری و کار با این ابزارها کنند، در آینده مزیت رقابتی قابل توجهی خواهند داشت. ما با ارائه 
                    دسترسی آسان و مقرون به صرفه به این ابزارها، می‌خواهیم به شما کمک کنیم تا در این تحول بزرگ عقب نمانید. 
                    چه دانشجو باشید، چه کارمند، چه کارآفرین یا فریلنسر، هوش مصنوعی می‌تواند کارهای شما را سریع‌تر، بهتر و 
                    کارآمدتر کند. سرمایه‌گذاری در یادگیری و استفاده از این فناوری‌ها، سرمایه‌گذاری در آینده شماست.
                  </p>

                  <p className="text-base sm:text-lg">
                    ما متعهد هستیم که همیشه بهترین قیمت‌ها، بهترین کیفیت و بهترین خدمات پشتیبانی را به شما ارائه دهیم. 
                    اعتماد شما سرمایه ماست و تلاش می‌کنیم با هر خریدی که انجام می‌دهید، این اعتماد را حفظ و تقویت کنیم. 
                    از اینکه ما را برای خرید اکانت‌های پریمیوم و دوره‌های آموزشی خود انتخاب کرده‌اید، صمیمانه سپاسگزاریم. 
                    امیدواریم بتوانیم در مسیر موفقیت و پیشرفت شما نقش مؤثری داشته باشیم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <Footer />

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </div>
  )
}
