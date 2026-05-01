import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Home from './components/Home'
import GameEngine from './components/GameEngine'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/play" element={<GameEngine />} />
    </Routes>
  )
}

export default App