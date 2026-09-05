import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Interview from './pages/Interview.jsx'
import FinanceDashboard from './pages/FinanceDashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/finance" element={<FinanceDashboard />} />
    </Routes>
  )
}

export default App
