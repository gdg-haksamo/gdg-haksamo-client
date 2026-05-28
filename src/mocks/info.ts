export type MealInfoData = {
  image?: string
  name: string
  price: number
  rating: number
  reviewCount: number
  aiDescription: string
}

export type RestaurantInfoData = {
  location: string
  time: string
}

export type NutritionInfoData = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type ReviewItem = {
  id: string
  authorName: string
  date: string
  rating: number
  content: string
}

export const MOCK_MEAL_INFO: MealInfoData = {
  image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=400&fit=crop',
  name: '쟁반수육',
  price: 8000,
  rating: 5.0,
  reviewCount: 54,
  aiDescription: '부드럽게 삶은 돼지고기를 얇게 썰어 신선한 채소와 함께 즐기는 풍성한 한상',
}

export const MOCK_RESTAURANT_INFO: RestaurantInfoData = {
  location: '공식당',
  time: '점심 11:30 ~ 13:30',
}

export const MOCK_NUTRITION_INFO: NutritionInfoData = {
  calories: 680,
  protein: 42,
  carbs: 35,
  fat: 28,
}

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    authorName: '김민준',
    date: '2026년 5월 15일',
    rating: 5,
    content: '고기가 정말 부드럽고 맛있었어요! 양도 많고 가성비 최고입니다.',
  },
  {
    id: '2',
    authorName: '김민준',
    date: '2026년 5월 15일',
    rating: 5,
    content: '고기가 정말 부드럽고 맛있었어요! 양도 많고 가성비 최고입니다.',
  },
  {
    id: '3',
    authorName: '김민준',
    date: '2026년 5월 15일',
    rating: 5,
    content: '고기가 정말 부드럽고 맛있었어요! 양도 많고 가성비 최고입니다.',
  },
]
