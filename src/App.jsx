import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Interview from './pages/Interview.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/interview" element={<Interview />} />
    </Routes>
  )
}

export default App
