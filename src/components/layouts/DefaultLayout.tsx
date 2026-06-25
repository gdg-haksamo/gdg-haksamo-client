import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

const TAB_PATHS = ['/', '/search', '/review', '/my']

export default function DefaultLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  const showBack = !TAB_PATHS.includes(pathname)

  return (
    <div className="min-h-dvh bg-white md:bg-[#eceef3]">
      <div className="mx-auto flex h-dvh w-full max-w-[600px] flex-col overflow-hidden bg-white md:shadow-[0_0_20px_rgba(29,32,56,0.14)]">
        <Header showBack={showBack} />
        <main ref={mainRef} className="flex flex-1 flex-col overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
