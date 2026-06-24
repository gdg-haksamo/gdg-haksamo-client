export type CafeteriaMenu = {
  menuId: number
  name: string
  price: number
  rating?: number
  isPopular?: boolean
}

export type CafeteriaInfo = {
  id: string
  name: string
  building: string
  position: { x: number; y: number }
  menus: CafeteriaMenu[]
}
