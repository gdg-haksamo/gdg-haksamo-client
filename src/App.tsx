import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import HomePage from '@/pages/HomePage'
import InfoPage from '@/pages/InfoPage'
import ReviewPage from '@/pages/ReviewPage'
import MyPage from '@/pages/MyPage'
import NoticePage from '@/pages/NoticePage'

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/notice" element={<NoticePage />} />
      </Route>
    </Routes>
  )
}

export default App
