import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import HomePage from '@/pages/HomePage'

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
