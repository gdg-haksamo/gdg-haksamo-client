export type CafeteriaMenu = {
  name: string
  price: number
  rating: number
  isPopular?: boolean
}

export type CafeteriaInfo = {
  id: string
  name: string
  building: string
  position: { x: number; y: number }
  menus: CafeteriaMenu[]
}

export const CAFETERIAS: CafeteriaInfo[] = [
  {
    id: 'gong',
    name: '공식당',
    building: '공대1호관 1층',
    position: { x: 45.6, y: 62.1 },
    menus: [
      { name: '쟁반수육', price: 8000, rating: 4.2, isPopular: true },
      { name: '제육볶음', price: 7000, rating: 3.9 },
      { name: '돈가스', price: 8000, rating: 4.8 },
    ],
  },
  {
    id: 'bokji',
    name: '복지관',
    building: '학생복지관 1층',
    position: { x: 74.0, y: 53.0 },
    menus: [
      { name: '된장찌개', price: 6000, rating: 4.5 },
      { name: '김치볶음밥', price: 7000, rating: 4.3 },
      { name: '순두부찌개', price: 6000, rating: 4.6 },
    ],
  },
  {
    id: 'info',
    name: '정보센터',
    building: '종합정보센터 1층',
    position: { x: 70.1, y: 30.6 },
    menus: [
      { name: '돈가스정식', price: 7000, rating: 4.4 },
      { name: '제육볶음', price: 7000, rating: 4.1 },
    ],
  },
  {
    id: 'cafe',
    name: '카페테리아 첨성',
    building: '첨성관 1층',
    position: { x: 76.9, y: 53.5 },
    menus: [
      { name: '치킨난반', price: 8000, rating: 5.0, isPopular: true },
      { name: '파스타', price: 8000, rating: 4.7 },
      { name: '샌드위치', price: 5000, rating: 4.3 },
    ],
  },
]
