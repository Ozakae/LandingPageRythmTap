// ============================================================
//  Home.jsx
//  Halaman menu utama (path: "/home")
//  Muncul setelah user klik "Play Now" dari LandingPage.
//
//  Fungsi halaman ini:
//  - Menampilkan daftar lagu yang bisa dipilih
//  - Menampilkan tombol untuk membuka Settings
//  - Menampilkan tombol PLAY untuk mulai game
//  - Menampilkan hint tombol keyboard aktif di bagian bawah
//
//  Struktur tampilan (dari atas ke bawah):
//  1. Tombol Back       — kembali ke LandingPage
//  2. Tombol Settings   — buka popup pengaturan tombol
//  3. Ikon bunga        — dekorasi mengambang
//  4. Judul             — "RHYTHM TAP"
//  5. Song List         — daftar lagu + placeholder
//  6. Tombol PLAY       — mulai game dengan lagu dipilih
//  7. Key Hint          — tampilan tombol aktif saat ini
// ============================================================

import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { useSettings }   from '../context/SettingsContext'
import SettingsModal     from './SettingsModal'
import './Home.css'


// ─────────────────────────────────────────────────────────────
// DATA STATIS
// Daftar lagu yang tersedia di game.
// Kalau mau tambah lagu baru, cukup tambah objek baru di sini.
//
// Setiap lagu punya:
//   id       → identitas unik (dipakai sebagai React key & perbandingan)
//   title    → judul lagu
//   artist   → nama artis
//   genre    → genre musik
//   bpm      → tempo lagu (beats per minute)
//   duration → durasi lagu
// ─────────────────────────────────────────────────────────────
const SONGS = [
  {
    id: 1,
    title:    'Bubble Pop Electric',
    artist:   'Gwen Stefani',
    genre:    'Pop',
    bpm:      128,
    duration: '3:43',
  },
]


// ─────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────
export default function Home() {
  // navigate: fungsi untuk pindah halaman
  const navigate = useNavigate()

  // preset: berisi data tombol yang sedang aktif
  // Diambil dari SettingsContext (pengaturan global)
  // Contoh isi preset: { label: 'D F J K', keys: [...], display: ['D','F','J','K'] }
  const { preset } = useSettings()

  // showSettings: kontrol apakah popup Settings tampil atau tidak
  // false = tersembunyi, true = tampil
  const [showSettings, setShowSettings] = useState(false)

  // selected: lagu yang sedang dipilih user
  // Nilai awal: lagu pertama (SONGS[0]) agar langsung ada yang terpilih
  const [selected, setSelected] = useState(SONGS[0])


  return (
    <>
      {/* Pembungkus utama — layar penuh */}
      <div style={{
        width: '100vw', height: '100vh',
        background: '#080008',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* ── Dekorasi lingkaran cahaya di background ─────────
            Sama seperti LandingPage — efek atmosfer merah.
            position: absolute = mengikuti posisi parent (.div utama)
            pointerEvents: none = tidak bisa diklik, murni dekorasi */}
        <div style={{
          position: 'absolute', top: '20%', right: '-100px',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(140,0,30,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '-80px',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,0,20,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />


        {/* ══════════════════════════════════════════════════
            1. TOMBOL BACK
            Posisi pojok kiri atas (position: absolute).
            Klik → navigate('/') = kembali ke LandingPage.
        ══════════════════════════════════════════════════ */}
        <button
          className="back-btn"
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: 24, left: 28 }}
        >
          ← Kembali
        </button>


        {/* ══════════════════════════════════════════════════
            2. TOMBOL SETTINGS (⚙)
            Posisi pojok kanan atas (position: absolute).
            Klik → setShowSettings(true) = tampilkan popup.

            onMouseEnter/Leave: mengubah warna teks langsung
            via e.currentTarget.style karena ini efek hover
            yang butuh nilai dinamis (tidak bisa pakai CSS saja).
        ══════════════════════════════════════════════════ */}
        <button
          onClick={() => setShowSettings(true)}
          style={{
            position: 'absolute', top: 24, right: 28,
            background: 'rgba(20,0,8,0.8)',
            border: '0.5px solid rgba(180,0,40,0.25)',
            borderRadius: 3, padding: '8px 14px',
            cursor: 'pointer',
            color: 'rgba(180,80,100,0.5)', /* warna awal: redup */
            fontSize: 16, lineHeight: 1,
            transition: 'all 0.2s',
            fontFamily: 'Cinzel Decorative, serif',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f5d5d8'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,80,100,0.5)'}
        >
          ⚙
        </button>


        {/* ══════════════════════════════════════════════════
            3. IKON BUNGA
            Dekorasi animasi mengambang di tengah atas.
            animationFillMode: 'both' = animasi langsung
            dimulai dari state awal (tidak ada "jump" visual).
        ══════════════════════════════════════════════════ */}
        <div style={{
          fontSize: 44, marginBottom: '1.25rem',
          animation: 'float 4s ease-in-out infinite',
          filter: 'drop-shadow(0 0 16px rgba(200,0,40,0.6))',
          animationFillMode: 'both',
        }}>
          🌹
        </div>


        {/* ══════════════════════════════════════════════════
            4. JUDUL
            Label kecil + judul besar + garis dekoratif.
            Animasi 'rise' dengan delay 0.1s agar muncul
            setelah ikon bunga (efek berurutan).
        ══════════════════════════════════════════════════ */}
        <div style={{
          textAlign: 'center', marginBottom: '2.5rem',
          animation: 'rise 0.8s ease both 0.1s',
        }}>
          {/* Label kecil */}
          <p style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 9, color: '#cc0035',
            letterSpacing: '0.35em', marginBottom: 10,
            textTransform: 'uppercase',
          }}>
            Pilih Lagu
          </p>

          {/* Judul utama dengan efek kedip */}
          <h1 style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 900, color: '#f5d5d8',
            textShadow: '0 0 30px rgba(200,0,40,0.4)',
            margin: 0, lineHeight: 1.2,
            animation: 'flicker 10s infinite',
          }}>
            RHYTHM TAP
          </h1>

          {/* Garis dekoratif merah di bawah judul */}
          <div style={{
            width: 60, height: 1, margin: '12px auto 0',
            background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
          }} />
        </div>


        {/* ══════════════════════════════════════════════════
            5. SONG LIST
            Daftar lagu dari array SONGS di atas.
            Lagu yang dipilih (selected) mendapat tampilan
            border & background yang berbeda (highlighted).

            Logika seleksi:
              selected.id === song.id → lagu ini sedang dipilih
              → ubah warna border & background-nya
        ══════════════════════════════════════════════════ */}
        <div style={{
          width: 'min(440px, 90vw)', /* max 440px, tapi max 90% layar di HP */
          display: 'flex', flexDirection: 'column', gap: 8,
          marginBottom: '2rem',
          animation: 'rise 0.8s ease both 0.25s',
        }}>
          {/* Render tiap lagu dari array SONGS */}
          {SONGS.map(song => (
            <div
              key={song.id}                    /* key wajib ada saat pakai .map() */
              className="song-card"
              onClick={() => setSelected(song)} /* klik = set lagu ini sebagai dipilih */
              style={{
                /* Border lebih terang kalau lagu ini yang dipilih */
                border: `0.5px solid ${
                  selected.id === song.id
                    ? 'rgba(200,0,40,0.55)'
                    : 'rgba(180,0,40,0.2)'
                }`,
                /* Background lebih terang kalau lagu ini yang dipilih */
                background: selected.id === song.id
                  ? 'rgba(100,0,25,0.2)'
                  : 'rgba(40,0,10,0.3)',
              }}
            >
              {/* Sisi kiri: thumbnail + info lagu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Thumbnail lagu */}
                <div style={{
                  width: 48, height: 48, borderRadius: 2, flexShrink: 0,
                  background: 'linear-gradient(135deg, #4a0015, #8b0030)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                  /* Glow lebih kuat kalau lagu ini yang dipilih */
                  boxShadow: selected.id === song.id
                    ? '0 0 16px rgba(180,0,40,0.5)'
                    : 'none',
                  transition: 'box-shadow 0.3s',
                }}>
                  🎵
                </div>

                {/* Teks info lagu */}
                <div>
                  <p style={{
                    fontFamily: 'Cinzel Decorative, serif',
                    fontSize: 13, color: '#f5d5d8',
                    letterSpacing: '0.06em', marginBottom: 5,
                  }}>
                    {song.title}
                  </p>
                  <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 13, fontStyle: 'italic',
                    color: 'rgb(235, 177, 177)',
                  }}>
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* Sisi kanan: genre + BPM & durasi */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {/* Badge genre */}
                <span style={{
                  display: 'block',
                  fontSize: 9, padding: '3px 10px',
                  borderRadius: 2, marginBottom: 6,
                  background: 'rgba(180,0,40,0.15)',
                  border: '0.5px solid rgba(180,0,40,0.3)',
                  color: 'rgba(220,120,140,0.8)',
                  letterSpacing: '0.1em',
                  fontFamily: 'Cinzel Decorative, serif',
                }}>
                  {song.genre}
                </span>

                {/* BPM dan durasi */}
                <p style={{
                  fontSize: 11, color: 'rgb(255, 213, 213)',
                  fontFamily: 'Cormorant Garamond, serif',
                }}>
                  {song.bpm} BPM · {song.duration}
                </p>
              </div>
            </div>
          ))}

          {/* Placeholder lagu berikutnya */}
          <div style={{
            padding: '1rem 1.5rem',
            border: '0.5px dashed rgba(180,0,40,0.15)',
            borderRadius: 2, textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 13, fontStyle: 'italic',
              color: 'rgb(255, 222, 222)',
            }}>
              Lagu lainnya segera hadir...
            </p>
          </div>
        </div>


        {/* ══════════════════════════════════════════════════
            6. TOMBOL PLAY
            Klik → navigate('/play') = masuk ke GameEngine.
            Animasi rise dengan delay 0.4s (muncul terakhir).
        ══════════════════════════════════════════════════ */}
        <div style={{ animation: 'rise 0.8s ease both 0.4s' }}>
          <button className="cta-btn" onClick={() => navigate('/play')}>
            ▶ PLAY
          </button>
        </div>


        {/* ══════════════════════════════════════════════════
            7. KEY HINT
            Menampilkan tombol aktif saat ini di bagian bawah.
            Contoh: "D    F    J    K"

            preset.display = array karakter tombol aktif
            .join(' \u00a0\u00a0 ') = gabungkan dengan spasi + non-breaking space
            \u00a0 = karakter spasi yang tidak bisa dilipat browser
        ══════════════════════════════════════════════════ */}
        <p style={{
          position: 'absolute', bottom: 24,
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 10, color: 'rgba(180,0,40,0.2)',
          letterSpacing: '0.3em',
          animation: 'rise 0.8s ease both 0.6s',
        }}>
          {preset.display.join(' \u00a0\u00a0 ')}
        </p>

      </div>

      {/* ══════════════════════════════════════════════════
          SETTINGS MODAL (Popup)
          Dirender di luar div utama agar tidak terpotong
          oleh overflow: hidden milik parent.

          Kondisi: hanya tampil kalau showSettings = true
          &&  = "kalau kiri true, render kanan"
          onClose → setShowSettings(false) = tutup popup
      ══════════════════════════════════════════════════ */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}