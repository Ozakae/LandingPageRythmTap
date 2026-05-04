// ============================================================
//  GameEngine.jsx
//  Komponen inti game rhythm tap (path: "/play")
//
//  Tanggung jawab file ini:
//  - Menjalankan game loop (requestAnimationFrame)
//  - Spawning & pergerakan note dari atas ke bawah
//  - Deteksi input keyboard & penilaian ketepatan
//  - Sistem skor & combo
//  - Video background saat bagian reff lagu
//  - Manajemen fase game: idle → playing → paused → victory/gameover
//
//  Alur data:
//    beatmap.json  → kapan & di lane mana note muncul
//    useAudio      → kontrol audio lagu
//    useSettings   → tombol keyboard yang aktif
//    requestAnimationFrame → game loop ~60fps
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { useNavigate }                  from 'react-router-dom'
import beatmapData                      from '../data/beatmap.json'
import { useAudio }                     from '../hooks/useAudio'
import { useSettings }                  from '../context/SettingsContext'
import './GameEngine.css'
// import { generateBeatmap } from '../utils/generateBeatmap'  ← tidak dipakai


// ─────────────────────────────────────────────────────────────
// KONSTANTA GAME
// Diletakkan di luar komponen agar tidak dibuat ulang tiap render.
// ─────────────────────────────────────────────────────────────

// Bagian-bagian lagu yang memutar video background (reff/chorus)
// start & end dalam milidetik sesuai beatmap.json
const REFF_SPOTS = [
  { start: 49000,  end: 69000,  video: '/videos/bubble-pop-reff.mp4'  },
  { start: 99000,  end: 118000, video: '/videos/bubble-pop-reff2.mp4' },
  { start: 168000, end: 188000, video: '/videos/bubble-pop-reff2.mp4' },
]

// Kecepatan note bergerak ke bawah (pixel per detik)
const NOTE_SPEED = 300

// Toleransi timing untuk penilaian (dalam milidetik):
//   msOff ≤ PERFECT_WIN → PERFECT (+100)
//   msOff ≤ GOOD_WIN    → GOOD    (+50)
//   msOff > GOOD_WIN    → MISS    (-10)
const PERFECT_WIN     = 120
const GOOD_WIN        = 200

// Note dianggap "terlewat" kalau sudah melewati target sejauh ini (pixel)
const MISS_THRESHOLD  = 80

// Jumlah lane/kolom yang ada di game
const LANE_COUNT  = 4

// Tinggi area lane dalam pixel
const LANE_HEIGHT = 420

// Posisi Y target zone (garis tempat note harus ditekan)
// Dihitung dari atas: LANE_HEIGHT - 30 = 390px dari atas
const TARGET_Y = LANE_HEIGHT - 30

// Catatan: ada kode berikut yang sudah tidak dipakai (diganti beatmap.json manual):
// const GENERATED_NOTES = generateBeatmap(beatmapData.bpm, beatmapData.duration, 1200)


// ─────────────────────────────────────────────────────────────
// PALET WARNA
// Semua warna disimpan di satu objek `C` agar konsisten dan
// mudah diubah — cukup ganti di sini, berlaku ke seluruh file.
// ─────────────────────────────────────────────────────────────
const C = {
  bg:           '#080008',                   // background utama
  bgPanel:      'rgba(20,0,8,0.95)',         // background HUD
  bgLane:       'rgba(60,0,15,0.2)',         // background lane normal
  bgLaneActive: 'rgba(100,0,25,0.3)',        // background lane saat tombol ditekan
  border:       'rgba(180,0,40,0.25)',       // border default
  borderActive: 'rgba(220,0,60,0.7)',        // border saat aktif
  primary:      '#f5d5d8',                   // teks utama
  accent:       '#cc0035',                   // merah aksen
  accentGlow:   'rgba(200,0,40,0.5)',        // cahaya merah
  note:         '#cc0035',                   // warna note (bawah)
  noteTop:      '#ff4060',                   // warna note (atas, gradient)
  noteShadow:   'rgba(200,0,40,0.6)',        // shadow note
  perfect:      '#c8aaff',                   // warna teks PERFECT (ungu)
  good:         '#88ddaa',                   // warna teks GOOD (hijau)
  miss:         '#ff4060',                   // warna teks MISS (merah)
  penalty:      '#ff8040',                   // warna teks -10 (oranye)
  muted:        'rgba(220,170,170,0.5)',     // teks redup
  mutedDark:    'rgba(180,120,120,0.35)',    // teks sangat redup
}


// ─────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────
export default function GameEngine() {
  const navigate = useNavigate()

  // Ambil preset tombol aktif dari SettingsContext
  // KEYS   = array key keyboard, contoh: ['d','f','j','k']
  // LABELS = array label tampilan, contoh: ['D','F','J','K']
  const { preset }  = useSettings()
  const KEYS        = preset.keys
  const LABELS      = preset.display

  // Hook audio — load lagu dari folder public
  const audio = useAudio('/songs/bubble-pop-electric.mp3')


  // ── State (nilai yang memicu re-render saat berubah) ────────
  const [phase,      setPhase]      = useState('idle')     // fase game saat ini
  const [score,      setScore]      = useState(100)        // skor untuk tampilan
  const [combo,      setCombo]      = useState(0)          // combo untuk tampilan
  const [notes,      setNotes]      = useState([])         // note aktif untuk render
  const [feedbacks,  setFeedbacks]  = useState([])         // teks PERFECT/GOOD/MISS melayang
  const [activeKeys, setActiveKeys] = useState(new Set())  // tombol yang sedang ditekan
  const [isShaking,  setIsShaking]  = useState(false)      // trigger animasi screenshake
  const [endStats,   setEndStats]   = useState(null)       // statistik akhir game
  const [reffPhase,  setReffPhase]  = useState('hidden')   // fase video reff
  const [activeVideo, setActiveVideo] = useState('/videos/bubble-pop-reff.mp4')

  // reffPhaseRef = "bayangan" reffPhase yang bisa dibaca di dalam game loop
  // Kenapa perlu ini? Karena di dalam requestAnimationFrame, state React
  // "membeku" pada nilai awal (closure problem). useRef tidak punya masalah ini.
  const reffPhaseRef = useRef('hidden')


  // ── Game State Ref ──────────────────────────────────────────
  // Semua data game yang berubah setiap frame disimpan di useRef,
  // BUKAN di useState. Alasannya:
  //   useState → setiap perubahan = re-render = lambat di 60fps
  //   useRef   → perubahan tidak memicu re-render = cepat
  //
  // Kita tetap pakai setState hanya untuk update tampilan (score, combo, notes)
  // tapi nilainya SELALU diambil dari g.current (bukan dari state).
  const g = useRef({
    running:   false,           // apakah game loop sedang jalan
    score:     100,             // skor aktual
    combo:     0,               // combo aktual
    maxCombo:  0,               // combo tertinggi yang pernah dicapai
    notes:     [],              // array note aktif: { id, lane, y, hit }
    spawnIdx:  0,               // indeks note berikutnya yang akan di-spawn dari beatmap
    startTime: 0,               // performance.now() saat game mulai
    lastFrame: 0,               // performance.now() pada frame terakhir
    stats:     { perfect: 0, good: 0, miss: 0 },  // akumulasi statistik
    heldKeys:  new Set(),       // tombol yang sedang ditahan (cegah input ganda)
    nid:       0,               // ID unik note berikutnya (auto increment)
    raf:       null,            // ID requestAnimationFrame aktif (untuk dibatalkan)
  })

  // loopFn disimpan di ref agar bisa dipanggil secara rekursif di dalam dirinya sendiri
  const loopFn = useRef(null)


  // ── Game Loop ───────────────────────────────────────────────
  // useEffect tanpa dependency ([]) = hanya dibuat sekali.
  // loopFn.current diperbarui tiap render tapi referensinya tetap sama.
  //
  // requestAnimationFrame (RAF) = cara browser memanggil fungsi ~60x per detik
  // Lebih efisien dari setInterval karena sinkron dengan refresh rate layar.
  useEffect(() => {
    loopFn.current = (now) => {
      const gs = g.current
      if (!gs.running) return

      // Waktu sejak game dimulai (dalam milidetik)
      const elapsed = now - gs.startTime

      // Delta time: selisih waktu antara frame ini dan frame sebelumnya (dalam detik)
      // Dipakai untuk pergerakan note yang konsisten di semua kecepatan komputer
      const dt = (now - gs.lastFrame) / 1000
      gs.lastFrame = now

      // Berapa detik note perlu untuk jatuh dari atas ke bawah lane
      // Dipakai untuk spawn note tepat waktu
      const travelSec = LANE_HEIGHT / NOTE_SPEED


      // ── Spawn Note ─────────────────────────────────────────
      // Cek apakah note berikutnya sudah waktunya muncul.
      // Note di-spawn LEBIH AWAL dari waktu tumbuknya, supaya punya
      // waktu untuk jatuh dari atas ke target zone.
      //
      // Logika: spawn saat elapsed >= note.time - (waktu jatuh dalam ms)
      while (gs.spawnIdx < beatmapData.notes.length) {
        const n = beatmapData.notes[gs.spawnIdx]
        if (elapsed >= n.time - travelSec * 1000) {
          // Tambahkan note baru ke array aktif
          gs.notes.push({ id: gs.nid++, lane: n.lane, y: 0, hit: false })
          gs.spawnIdx++
        } else break // beatmap sudah diurutkan by time, jadi bisa break kalau belum waktunya
      }


      // ── Gerakkan Note ──────────────────────────────────────
      // Setiap frame, geser posisi Y semua note ke bawah
      // y += kecepatan × delta_time
      // Ini disebut "frame-rate independent movement"
      gs.notes.forEach(n => { n.y += NOTE_SPEED * dt })


      // ── Deteksi Miss Otomatis ───────────────────────────────
      // Note yang melewati TARGET_Y + MISS_THRESHOLD tanpa ditekan = MISS
      gs.notes.forEach(n => {
        if (!n.hit && n.y > TARGET_Y + MISS_THRESHOLD) {
          n.hit = true
          gs.score = Math.max(0, gs.score - 10)  // max(0,...) agar tidak minus
          gs.combo = 0
          gs.stats.miss++
          setScore(gs.score)
          setCombo(0)
          spawnFeedback(n.lane, 'MISS', C.miss)
          triggerShake()
          if (gs.score <= 0) { endGame(false); return }  // game over!
        }
      })


      // ── Bersihkan Note yang Sudah Lewat ────────────────────
      // Hapus note yang sudah keluar dari layar (y > LANE_HEIGHT + 60)
      // agar tidak menumpuk di memori
      gs.notes = gs.notes.filter(n => n.y < LANE_HEIGHT + 60)
      setNotes([...gs.notes])  // update tampilan (spread untuk buat array baru)


      // ── Manajemen Video Reff ────────────────────────────────
      // Cek apakah saat ini sedang dalam area reff (chorus)
      const currentSpot = REFF_SPOTS.find(s => elapsed >= s.start && elapsed <= s.end)
      const inReff  = !!currentSpot  // !! = konversi ke boolean
      const nearEnd = currentSpot ? elapsed >= currentSpot.end - 1500 : false  // 1.5 detik sebelum selesai

      // Reff dimulai: tampilkan video
      if (inReff && !nearEnd && reffPhaseRef.current === 'hidden') {
        reffPhaseRef.current = 'entering'
        setActiveVideo(currentSpot.video)
        setReffPhase('entering')
        // Setelah 800ms animasi fade-in selesai, set ke 'visible'
        setTimeout(() => {
          reffPhaseRef.current = 'visible'
          setReffPhase('visible')
        }, 800)
      }

      // Reff hampir selesai: mulai animasi fade-out
      if (nearEnd && reffPhaseRef.current === 'visible') {
        reffPhaseRef.current = 'leaving'
        setReffPhase('leaving')
        // Setelah 1500ms animasi fade-out selesai, sembunyikan video
        setTimeout(() => {
          reffPhaseRef.current = 'hidden'
          setReffPhase('hidden')
        }, 1500)
      }


      // ── Cek Kondisi Selesai ─────────────────────────────────
      // Game selesai kalau: semua note sudah di-spawn, tidak ada note tersisa,
      // dan sudah berjalan > 1 detik (hindari false positive di awal)
      const done = gs.spawnIdx >= beatmapData.notes.length
        && gs.notes.length === 0 && elapsed > 1000
      if (done) { endGame(true); return }  // victory!

      // Lanjutkan loop di frame berikutnya
      gs.raf = requestAnimationFrame(loopFn.current)
    }
  }, [])


  // ── Fungsi Helper ───────────────────────────────────────────

  // Tampilkan teks feedback melayang (PERFECT/GOOD/MISS/-10) di atas lane
  // Teks otomatis hilang setelah 750ms
  function spawnFeedback(lane, text, color) {
    const id = Date.now() + Math.random()  // ID unik berdasarkan waktu
    setFeedbacks(prev => [...prev, { id, lane, text, color }])
    setTimeout(() => setFeedbacks(prev => prev.filter(f => f.id !== id)), 750)
  }

  // Aktifkan animasi screen shake selama 280ms
  function triggerShake() {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 280)
  }

  // Akhiri game — victory=true (selesai lagu) atau false (skor habis)
  function endGame(victory) {
    const gs = g.current
    gs.running = false
    cancelAnimationFrame(gs.raf)
    audio.stop()

    // Hitung akurasi: (perfect + good*0.5) / total * 100
    // good bernilai 0.5 karena less precise dari perfect
    const total = gs.stats.perfect + gs.stats.good + gs.stats.miss
    const acc = total > 0
      ? Math.round((gs.stats.perfect + gs.stats.good * 0.5) / total * 100)
      : 0

    // Tentukan rank berdasarkan akurasi
    const rank = acc >= 95 ? 'S'
               : acc >= 82 ? 'A'
               : acc >= 65 ? 'B'
               : 'C'

    setEndStats({ victory, score: gs.score, maxCombo: gs.maxCombo, stats: { ...gs.stats }, acc, rank })
    setPhase(victory ? 'victory' : 'gameover')
  }


  // ── Input Handling ──────────────────────────────────────────

  // Dipanggil saat tombol ditekan (dari event keyboard atau touch)
  function pressLane(li) {
    const gs = g.current
    if (!gs.running || gs.heldKeys.has(li)) return  // abaikan kalau game tidak jalan atau tombol sudah ditahan

    gs.heldKeys.add(li)
    setActiveKeys(new Set(gs.heldKeys))  // update visual (lane menyala)

    // Cari note yang belum ditekan di lane ini
    const avail = gs.notes.filter(n => n.lane === li && !n.hit)

    // Tidak ada note → tekan sembarangan → penalti -10
    if (!avail.length) {
      gs.score = Math.max(0, gs.score - 10)
      gs.combo = 0
      setScore(gs.score); setCombo(0)
      spawnFeedback(li, '-10', C.penalty)
      triggerShake()
      if (gs.score <= 0) endGame(false)
      return
    }

    // Cari note yang posisinya paling dekat dengan TARGET_Y
    let best = null, bestD = Infinity
    avail.forEach(n => {
      const d = Math.abs(n.y - TARGET_Y)
      if (d < bestD) { bestD = d; best = n }
    })

    // Konversi jarak pixel ke milidetik
    // pixel / (pixel/detik) × 1000 = milidetik
    const msOff = (bestD / NOTE_SPEED) * 1000

    if (msOff <= PERFECT_WIN) {
      // ── PERFECT ──
      best.hit = true
      gs.score += 100; gs.combo++
      if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo
      gs.stats.perfect++
      setScore(gs.score); setCombo(gs.combo)
      spawnFeedback(li, 'PERFECT', C.perfect)

    } else if (msOff <= GOOD_WIN) {
      // ── GOOD ──
      best.hit = true
      gs.score += 50; gs.combo++
      if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo
      gs.stats.good++
      setScore(gs.score); setCombo(gs.combo)
      spawnFeedback(li, 'GOOD', C.good)

    } else {
      // ── MISS (terlalu jauh dari target) ──
      gs.score = Math.max(0, gs.score - 10)
      gs.combo = 0; gs.stats.miss++
      setScore(gs.score); setCombo(0)
      spawnFeedback(li, 'MISS', C.miss)
      triggerShake()
      if (gs.score <= 0) endGame(false)
    }
  }

  // Dipanggil saat tombol dilepas — hapus dari set tombol aktif
  function releaseLane(li) {
    g.current.heldKeys.delete(li)
    setActiveKeys(new Set(g.current.heldKeys))
  }


  // ── Kontrol Fase Game ───────────────────────────────────────

  // Mulai game dari awal (atau restart)
  function startGame() {
    const gs = g.current
    cancelAnimationFrame(gs.raf)  // batalkan loop sebelumnya kalau ada

    // Reset semua nilai ke kondisi awal
    gs.running = true; gs.score = 100; gs.combo = 0; gs.maxCombo = 0
    gs.notes = []; gs.spawnIdx = 0
    gs.startTime = performance.now()
    gs.lastFrame = performance.now()
    gs.stats = { perfect: 0, good: 0, miss: 0 }
    gs.heldKeys = new Set(); gs.nid = 0

    // Reset semua state tampilan
    setScore(100); setCombo(0); setNotes([])
    setFeedbacks([]); setEndStats(null); setActiveKeys(new Set())
    reffPhaseRef.current = 'hidden'
    setReffPhase('hidden')
    setPhase('playing')

    audio.play()  // mulai putar lagu
    gs.raf = requestAnimationFrame(loopFn.current)  // mulai game loop
  }

  // Jeda game
  function pauseGame() {
    g.current.running = false
    cancelAnimationFrame(g.current.raf)
    audio.pause()
    setPhase('paused')
  }

  // Lanjutkan dari jeda
  function resumeGame() {
    const gs = g.current
    gs.running = true
    // Sesuaikan startTime agar elapsed tidak "melompat" setelah resume
    // Formula: startTime baru = sekarang - (berapa lama sudah berjalan sebelum pause)
    gs.startTime = performance.now() - (gs.lastFrame - gs.startTime)
    gs.lastFrame = performance.now()
    audio.play()
    setPhase('playing')
    gs.raf = requestAnimationFrame(loopFn.current)
  }

  // Restart dari awal
  function restartGame() {
    audio.stop()
    startGame()
  }


  // ── Keyboard Event Listener ─────────────────────────────────
  // Dipasang sekali saat komponen muncul, dilepas saat komponen hilang.
  useEffect(() => {
    const onDown = (e) => {
      // ESC = toggle pause/resume
      if (e.key === 'Escape') {
        setPhase(prev => {
          if (prev === 'playing') { pauseGame(); return 'paused' }
          if (prev === 'paused')  { resumeGame(); return 'playing' }
          return prev
        })
        return
      }
      if (e.repeat) return  // abaikan key repeat (tombol ditahan lama)

      const i = KEYS.indexOf(e.key.toLowerCase())
      if (i !== -1) {
        e.preventDefault()  // cegah browser melakukan aksi default (misal: scroll dengan panah)
        pressLane(i)
      }
    }

    const onUp = (e) => {
      const i = KEYS.indexOf(e.key.toLowerCase())
      if (i !== -1) releaseLane(i)
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)

    // Cleanup: lepas event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup',   onUp)
    }
  }, [])  // [] = pasang hanya sekali


  // ── Cleanup saat unmount ────────────────────────────────────
  // Batalkan game loop dan lepaskan audio saat pindah halaman
  useEffect(() => {
    return () => {
      cancelAnimationFrame(g.current.raf)
      audio.unload()
    }
  }, [])


  // ── Kalkulasi untuk tampilan energy bar ────────────────────
  // energyPct = persentase skor saat ini (0-100)
  const energyPct = Math.max(0, Math.min(100, score))

  // Warna bar berubah berdasarkan sisa energi:
  //   > 60% → merah normal
  //   > 30% → oranye (waspada)
  //   ≤ 30% → merah terang (bahaya)
  const barColor = energyPct > 60 ? C.accent
                 : energyPct > 30 ? '#dd7700'
                 : '#ff2020'


  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: C.bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      // screenshake: aktifkan animasi saat isShaking=true
      animation: isShaking ? 'screenshake 0.28s ease-out' : 'none',
    }}>

      {/* ══════════════════════════════════════════════════
          VIDEO BACKGROUND REFF
          Muncul saat elapsed masuk ke area REFF_SPOTS.
          Dirender bersusun:
            layer 0: <video> (paling bawah)
            layer 1: overlay merah (warna tema)
            layer 2: vignette (gelap di tepi)
      ══════════════════════════════════════════════════ */}
      {reffPhase !== 'hidden' && (
        <div style={{
          position: 'absolute', inset: 0,
          zIndex: 0, overflow: 'hidden', pointerEvents: 'none',
          // Animasi berbeda untuk masuk vs keluar
          animation: reffPhase === 'entering' || reffPhase === 'visible'
            ? 'reff-fadein 0.8s ease forwards'
            : 'reff-fadeout 1.5s ease forwards',
        }}>
          {/* Vignette: membuat tepi layar gelap agar konten game tetap terbaca */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: `radial-gradient(ellipse at center,
              rgba(8,0,8,0.3) 0%,
              rgba(8,0,8,0.6) 60%,
              rgba(8,0,8,0.85) 100%)`,
          }} />

          {/* Overlay merah — memberi warna tema Yor di atas video */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'rgba(80,0,20,0.25)',
            mixBlendMode: 'multiply',  // blend mode: warna overlay × warna video
          }} />

          {/* Video element
              key={activeVideo} = React akan re-mount video saat src berganti
              muted: wajib untuk autoplay di browser modern
              playsInline: penting untuk iOS  */}
          <video
            key={activeVideo}
            src={activeVideo}
            autoPlay muted loop playsInline
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '100%', minHeight: '100%',
              width: 'auto', height: 'auto',
              objectFit: 'cover',
              opacity: 0.6,
              filter: 'saturate(0.8) brightness(0.9)',
              zIndex: 0,
            }}
          />
        </div>
      )}

      {/* Dekorasi lingkaran cahaya di background */}
      <div style={{
        position: 'absolute', top: '15%', right: '-100px',
        width: 350, height: 350, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(140,0,30,0.08) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-80px',
        width: 280, height: 280, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(100,0,20,0.07) 0%, transparent 70%)',
      }} />


      {/* ══════════════════════════════════════════════════
          TOMBOL PAUSE & JUDUL LAGU
          Hanya muncul saat phase === 'playing'
      ══════════════════════════════════════════════════ */}
      {phase === 'playing' && (
        <button onClick={pauseGame} title="Pause (ESC)" style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(20,0,8,0.8)',
          border: `0.5px solid ${C.border}`,
          borderRadius: 3, padding: '8px 12px',
          cursor: 'pointer', color: 'rgba(240,220,220,0.8)',
          fontSize: 16, lineHeight: 1, transition: 'all 0.2s',
        }}>⚙</button>
      )}

      {phase === 'playing' && (
        <div style={{
          position: 'absolute', top: 20, left: 20,
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 12, fontStyle: 'italic',
          color: 'rgba(240,220,220,0.8)', letterSpacing: '0.08em',
        }}>
          ♪ {beatmapData.song_title}
        </div>
      )}


      {/* ══════════════════════════════════════════════════
          HUD (Heads-Up Display)
          Panel atas yang menampilkan Score, Energy bar, Combo.
          Hanya tampil saat game berjalan.
      ══════════════════════════════════════════════════ */}
      {phase === 'playing' && (
        <div style={{
          width: 360, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14, padding: '10px 20px',
          background: C.bgPanel, borderRadius: 2,
          border: `0.5px solid ${C.border}`,
        }}>
          {/* Score */}
          <div>
            <div style={{ fontSize: 9, color: C.accent, letterSpacing: '0.25em', fontFamily: 'Cinzel Decorative, serif', marginBottom: 4 }}>
              SCORE
            </div>
            <div style={{
              fontSize: 24, color: C.primary,
              fontFamily: 'Cinzel Decorative, serif',
              textShadow: `0 0 20px ${C.accentGlow}`,
              animation: 'flicker 10s infinite',
            }}>
              {score}
            </div>
          </div>

          {/* Energy bar */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: C.accent, letterSpacing: '0.25em', fontFamily: 'Cinzel Decorative, serif', marginBottom: 6 }}>
              ENERGY
            </div>
            {/* Track (background bar) */}
            <div style={{ width: 110, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
              {/* Fill — lebar berubah sesuai energyPct, warna sesuai barColor */}
              <div style={{
                width: `${energyPct}%`, height: '100%',
                background: barColor, borderRadius: 2,
                transition: 'width 0.2s, background 0.4s',
                boxShadow: `0 0 8px ${barColor}`,
              }} />
            </div>
            <div style={{ fontSize: 10, color: C.mutedDark, fontFamily: 'Cormorant Garamond, serif', marginTop: 4 }}>
              {score} / 100
            </div>
          </div>

          {/* Combo — berubah warna jadi ungu kalau > 10x */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: C.accent, letterSpacing: '0.25em', fontFamily: 'Cinzel Decorative, serif', marginBottom: 4 }}>
              COMBO
            </div>
            <div style={{
              fontSize: 24,
              color: combo > 10 ? C.perfect : C.primary,
              fontFamily: 'Cinzel Decorative, serif',
              textShadow: combo > 10 ? '0 0 20px rgba(180,150,255,0.6)' : 'none',
              transition: 'color 0.3s',
            }}>
              {combo}x
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════
          AREA LANE (Game Board)
          Terdiri dari dua bagian:
            1. Lane container (atas) → tempat note jatuh
            2. Target zone / key buttons (bawah) → tempat tekan
      ══════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', width: 360 }}>

        {/* ── Lane Container ─────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 4, height: LANE_HEIGHT,
          position: 'relative',
          border: `0.5px solid ${C.border}`,
          borderBottom: 'none',
          borderRadius: '2px 2px 0 0',
          overflow: 'hidden',
        }}>
          {/* Garis cahaya di bagian atas lane */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            zIndex: 2,
          }} />

          {/* Render 4 lane — Array.from({ length: 4 }) = buat array [_,_,_,_] */}
          {Array.from({ length: LANE_COUNT }).map((_, li) => (
            <div key={li} style={{
              flex: 1, position: 'relative',
              // Warna lane berubah saat tombol ditekan
              background: activeKeys.has(li) ? C.bgLaneActive : C.bgLane,
              borderRight: li < 3 ? `0.5px solid ${C.border}` : 'none',
              transition: 'background 0.07s',
            }}>
              {/* Garis tengah lane (vertikal, sangat tipis) */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: '50%', width: 1,
                background: 'rgba(180,0,40,0.06)',
                transform: 'translateX(-50%)',
              }} />

              {/* Render note yang ada di lane ini
                  filter: hanya note di lane ini yang belum ditekan
                  top: n.y = posisi vertikal note (berubah tiap frame) */}
              {notes.filter(n => n.lane === li && !n.hit).map(n => (
                <div key={n.id} style={{
                  position: 'absolute',
                  left: 4, right: 4, height: 20,
                  top: Math.round(n.y),  // Math.round → cegah pixel fuzzy (anti-aliasing)
                  background: `linear-gradient(180deg, ${C.noteTop}, ${C.note})`,
                  borderRadius: 2,
                  boxShadow: `0 0 12px ${C.noteShadow}, 0 0 4px ${C.noteShadow}`,
                  borderTop: `1.5px solid rgba(255,100,120,0.8)`,
                  animation: 'note-enter 0.06s ease-out',
                }} />
              ))}
            </div>
          ))}

          {/* Feedback teks melayang (PERFECT / GOOD / MISS / -10) */}
          {feedbacks.map(fb => (
            <div key={fb.id} style={{
              position: 'absolute',
              left: `${fb.lane * 25 + 3}%`,  // posisi horizontal sesuai lane (0-3 × 25%)
              bottom: 80, zIndex: 20,
              pointerEvents: 'none',
              animation: 'floatup 0.75s ease-out forwards',
            }}>
              <span style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: fb.text === 'PERFECT' ? 13 : 12,
                fontWeight: 700, color: fb.color,
                letterSpacing: '0.1em',
                textShadow: `0 0 12px ${fb.color}`,
              }}>
                {fb.text}
              </span>
            </div>
          ))}
        </div>

        {/* ── Target Zone / Key Buttons ──────────────────── */}
        <div style={{
          display: 'flex', gap: 4, height: 60,
          border: `0.5px solid ${C.border}`,
          borderTop: `1.5px solid rgba(200,0,40,0.4)`,
          borderRadius: '0 0 2px 2px',
          overflow: 'hidden',
        }}>
          {LABELS.map((label, li) => (
            <div key={li} style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 2,
              background: activeKeys.has(li) ? 'rgba(180,0,40,0.3)' : 'rgba(40,0,10,0.6)',
              borderRight: li < 3 ? `0.5px solid ${C.border}` : 'none',
              transition: 'background 0.07s',
              // Inner glow saat tombol ditekan
              boxShadow: activeKeys.has(li) ? `inset 0 0 20px rgba(200,0,40,0.3)` : 'none',
            }}>
              <span style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: 16, fontWeight: 700,
                color: activeKeys.has(li) ? C.primary : 'rgba(180,0,40,0.4)',
                textShadow: activeKeys.has(li) ? `0 0 12px ${C.accentGlow}` : 'none',
                transition: 'all 0.07s',
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
          OVERLAY SCREENS
          Ditampilkan di atas segalanya (zIndex: 30) sesuai fase.
          Menggunakan komponen <YorOverlay> sebagai pembungkus.
      ══════════════════════════════════════════════════ */}

      {/* ── IDLE: Layar sebelum game dimulai ─── */}
      {phase === 'idle' && (
        <YorOverlay>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌹</div>
          <p style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 9, color: C.accent, letterSpacing: '0.3em' }}>
            RHYTHM TAP
          </p>
          <h2 style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 28, color: C.primary,
            textShadow: `0 0 30px ${C.accentGlow}`,
            animation: 'flicker 8s infinite',
          }}>
            Ready?
          </h2>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontStyle: 'italic', color: 'rgba(240,220,220,0.9)', textAlign: 'center', lineHeight: 1.9 }}>
            Tekan <span style={{ color: C.primary, fontStyle: 'normal', fontWeight: 600 }}>D F J K</span> saat note menyentuh target<br />
            Miss / asal tekan = <span style={{ color: C.miss }}>−10</span> &nbsp;·&nbsp;
            Perfect = <span style={{ color: C.perfect }}>+100</span> &nbsp;·&nbsp;
            Good = <span style={{ color: C.good }}>+50</span><br />
            <span style={{ fontSize: 12 }}>ESC atau ⚙ untuk pause</span>
          </div>
          <button className="game-cta-btn" onClick={startGame}>▶ MULAI</button>
        </YorOverlay>
      )}

      {/* ── PAUSED: Layar jeda ─── */}
      {phase === 'paused' && (
        <YorOverlay>
          <p style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 9, color: C.accent, letterSpacing: '0.3em' }}>PAUSED</p>
          <h2 style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 26, color: C.primary }}>Game Dijeda</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="game-cta-btn" onClick={resumeGame}>▶ LANJUT</button>
            <button className="ghost-btn" onClick={restartGame}>↺ RESTART</button>
          </div>
          <button className="text-btn" onClick={() => {
            g.current.running = false
            cancelAnimationFrame(g.current.raf)
            audio.stop()
            navigate('/')
          }}>
            Kembali ke Menu
          </button>
        </YorOverlay>
      )}

      {/* ── GAME OVER: Skor habis ─── */}
      {phase === 'gameover' && endStats && (
        <YorOverlay>
          <div style={{ fontSize: 36 }}>💀</div>
          <p style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 9, color: '#aa2020', letterSpacing: '0.3em' }}>GAME OVER</p>
          <h2 style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 26, color: '#ff4060', textShadow: '0 0 30px rgba(255,40,60,0.6)' }}>
            Score Habis
          </h2>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'rgba(240,220,220,0.9)', textAlign: 'center', lineHeight: 2 }}>
            Max Combo: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.maxCombo}x</span><br />
            Perfect: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.perfect}</span> &nbsp;·&nbsp;
            Good: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.good}</span> &nbsp;·&nbsp;
            Miss: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.miss}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="game-cta-btn" onClick={restartGame}>↺ COBA LAGI</button>
            <button className="ghost-btn" onClick={() => navigate('/')}>⌂ MENU</button>
          </div>
        </YorOverlay>
      )}

      {/* ── VICTORY: Lagu selesai ─── */}
      {phase === 'victory' && endStats && (
        <YorOverlay>
          <div style={{ fontSize: 36 }}>🌹</div>
          <p style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 9, color: '#44aa66', letterSpacing: '0.3em' }}>STAGE CLEAR</p>
          {/* Rank dengan animasi pop */}
          <div style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 72, color: C.primary,
            textShadow: `0 0 40px ${C.accentGlow}, 0 0 80px ${C.accentGlow}`,
            lineHeight: 1,
            animation: 'rank-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
          }}>
            {endStats.rank}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'rgba(240,220,220,0.9)', textAlign: 'center', lineHeight: 2 }}>
            Score: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.score}</span> &nbsp;·&nbsp;
            Max Combo: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.maxCombo}x</span><br />
            Perfect: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.perfect}</span> &nbsp;·&nbsp;
            Good: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.good}</span> &nbsp;·&nbsp;
            Miss: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.miss}</span><br />
            <span style={{ fontSize: 16 }}>Accuracy: {endStats.acc}%</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="game-cta-btn" onClick={restartGame}>↺ MAIN LAGI</button>
            <button className="ghost-btn" onClick={() => navigate('/')}>⌂ MENU</button>
          </div>
        </YorOverlay>
      )}

    </div>
  )
}


// ─────────────────────────────────────────────────────────────
// KOMPONEN HELPER: YorOverlay
// Pembungkus untuk semua layar overlay (idle/paused/gameover/victory).
// Dipisah jadi komponen tersendiri agar kode lebih bersih dan
// tidak perlu mengulang style yang sama di tiap overlay.
//
// children = apapun yang diletakkan di antara <YorOverlay> dan </YorOverlay>
// ─────────────────────────────────────────────────────────────
function YorOverlay({ children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1rem',
      background: 'rgba(4,0,4,0.92)',
      backdropFilter: 'blur(4px)',
    }}>
      {/* Garis dekoratif merah di atas */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
      }} />
      {/* Garis dekoratif merah di bawah */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
      }} />
      {/* Isi overlay (tombol, teks, statistik, dll) */}
      {children}
    </div>
  )
}