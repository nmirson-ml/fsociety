import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Home } from '@/pages/Home'
import { Curriculum } from '@/pages/Curriculum'
import { Lab } from '@/pages/Lab'
import { ModulePage } from '@/pages/ModulePage'
import { LessonPage } from '@/pages/LessonPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="lab" element={<Lab />} />
          <Route path="module/:moduleId" element={<ModulePage />} />
          <Route path="lesson/:slug" element={<LessonPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
