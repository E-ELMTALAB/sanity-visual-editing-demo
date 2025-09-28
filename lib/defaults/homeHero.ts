import type { HomePagePayload } from 'types'

export const defaultHeroSlides: NonNullable<HomePagePayload['heroSlides']> = [
  {
    title: 'کالکشن جدید پاییزه',
    subtitle: 'تا ۳۰٪ تخفیف ویژه',
    buttonText: 'خرید الان',
    image: undefined,
  },
  {
    title: 'لوازم الکترونیکی',
    subtitle: 'جدیدترین گجت‌های روز دنیا',
    buttonText: 'بیشتر ببین',
    image: undefined,
  },
]

export const defaultPromoCards: NonNullable<HomePagePayload['promoCards']> = [
  {
    title: 'بازی‌های جدید',
    subtitle: 'اکانت قانونی بازی‌ها',
    image: undefined,
  },
  {
    title: 'مد و پوشاک',
    subtitle: 'استایل خودتو بساز',
    image: undefined,
  },
]


