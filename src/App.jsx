// ─── Navigasi ──────────────────────────────────────────────
// Routes  : wadah semua rute, hanya satu yang aktif sekaligus
// Route   : satu pasangan "URL → Komponen"
import { Routes, Route } from 'react-router-dom'

// ─── Halaman-halaman aplikasi ──────────────────────────────
import LandingPage from './components/LandingPage' // Halaman pembuka
import Home        from './components/Home'        // Menu utama
import GameEngine  from './components/GameEngine'  // Layar permainan

// ─── Komponen Utama ────────────────────────────────────────
function App() {
  return (
    <Routes>
      {/* Halaman pertama yang muncul saat buka aplikasi */}
      <Route path="/"     element={<LandingPage />} />

      {/* Halaman menu setelah masuk */}
      <Route path="/home" element={<Home />} />

      {/* Halaman saat game dimulai */}
      <Route path="/play" element={<GameEngine />} />
    </Routes>
  )
}

// Ekspor supaya bisa dipakai oleh main.jsx
export default App