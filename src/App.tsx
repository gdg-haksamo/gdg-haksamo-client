import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import HomePage from '@/pages/HomePage'
import InfoPage from '@/pages/InfoPage'
import ReviewPage from '@/pages/ReviewPage'
import MyPage from '@/pages/MyPage'
import NoticePage from '@/pages/NoticePage'
import SearchPage from '@/pages/SearchPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import AdminPage from '@/pages/admin/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/info/:menuId" element={<InfoPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/notice" element={<NoticePage />} />
      </Route>
    </Routes>
  )
}

export default App
