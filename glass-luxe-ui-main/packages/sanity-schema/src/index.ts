// Documents
import collection from './schemas/documents/collection'
import course from './schemas/documents/course'
import instructor from './schemas/documents/instructor'
import page from './schemas/documents/page'
import post from './schemas/documents/post'
import product from './schemas/documents/product'
import project from './schemas/documents/project'
import promoBanner from './schemas/documents/promoBanner'
import testimonial from './schemas/documents/testimonial'

// Objects
import duration from './schemas/objects/duration'
import productOption from './schemas/objects/productOption'
import milestone from './schemas/objects/milestone'
import timeline from './schemas/objects/timeline'
import youtube from './schemas/objects/youtube'
import syllabusModule from './schemas/objects/syllabusModule'
import lesson from './schemas/objects/lesson'
import discountedProduct from './schemas/objects/discountedProduct'
import socialMediaProduct from './schemas/objects/socialMediaProduct'
import educationalProduct from './schemas/objects/educationalProduct'
import bestsellingCourse from './schemas/objects/bestsellingCourse'
import topBannerSlide from './schemas/objects/topBannerSlide'

// Singletons
import home from './schemas/singletons/home'
import settings from './schemas/singletons/settings'

export const schemaTypes = [
  // Singletons
  home,
  settings,
  // Documents
  duration,
  page,
  project,
  post,
  product,
  course,
  instructor,
  collection,
  promoBanner,
  testimonial,
  // Objects
  productOption,
  milestone,
  timeline,
  youtube,
  discountedProduct,
  socialMediaProduct,
  educationalProduct,
  bestsellingCourse,
  topBannerSlide,
  syllabusModule,
  lesson,
]
