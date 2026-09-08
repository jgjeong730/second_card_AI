import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Interview from './pages/Interview.jsx'
import FinanceDashboard from './pages/FinanceDashboard.jsx'
import ResumeDraft from './pages/ResumeDraft.jsx'
import CardTagline from './pages/CardTagline.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/finance" element={<FinanceDashboard />} />
      <Route path="/resume" element={<ResumeDraft />} />
      <Route path="/card" element={<CardTagline />} />
    </Routes>
  )
}

export default App
