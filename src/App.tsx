import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import HomePage from '@/pages/HomePage'
import MyPage from '@/pages/MyPage'

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/my" element={<MyPage />} />
      </Route>
    </Routes>
  )
}

export default App
