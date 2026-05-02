import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import beatmapData from '../data/beatmap.json'
import { useAudio } from '../hooks/useAudio'
import { useSettings } from '../context/SettingsContext'
// import { generateBeatmap } from '../utils/generateBeatmap'

const REFF_SPOTS = [
  { start: 49000,  end: 69000,  video: '/videos/bubble-pop-reff.mp4'  },
  { start: 99000,  end: 118000, video: '/videos/bubble-pop-reff2.mp4' },
  { start: 168000, end: 188000, video: '/videos/bubble-pop-reff2.mp4' },
]

const NOTE_SPEED = 300
const PERFECT_WIN = 120
const GOOD_WIN = 200
const MISS_THRESHOLD = 80
const LANE_COUNT = 4
const LANE_HEIGHT = 420
const TARGET_Y = LANE_HEIGHT - 30

// const GENERATED_NOTES = generateBeatmap(
//   beatmapData.bpm,
//   beatmapData.duration,
//   1200
// )

// ── Yor Forger color palette ──────────────────────────────
const C = {
  bg: '#080008',
  bgPanel: 'rgba(20,0,8,0.95)',
  bgLane: 'rgba(60,0,15,0.2)',
  bgLaneActive: 'rgba(100,0,25,0.3)',
  border: 'rgba(180,0,40,0.25)',
  borderActive: 'rgba(220,0,60,0.7)',
  primary: '#f5d5d8',
  accent: '#cc0035',
  accentGlow: 'rgba(200,0,40,0.5)',
  note: '#cc0035',
  noteTop: '#ff4060',
  noteShadow: 'rgba(200,0,40,0.6)',
  perfect: '#c8aaff',
  good: '#88ddaa',
  miss: '#ff4060',
  penalty: '#ff8040',
  muted: 'rgba(220,170,170,0.5)',
  mutedDark: 'rgba(180,120,120,0.35)',
}

const GAME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  @keyframes floatup {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-56px) scale(1.1); }
  }
  @keyframes screenshake {
    0%   { transform: translate(0, 0); }
    25%  { transform: translate(-3px, 1px); }
    50%  { transform: translate(3px, -1px); }
    75%  { transform: translate(-2px, 0); }
    100% { transform: translate(0, 0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(180,0,40,0.4), 0 0 60px rgba(180,0,40,0.15); }
    50%       { box-shadow: 0 0 40px rgba(220,0,60,0.7), 0 0 100px rgba(220,0,60,0.3); }
  }
  @keyframes note-enter {
    from { opacity: 0; transform: scaleY(0.4); }
    to   { opacity: 1; transform: scaleY(1); }
  }
  @keyframes flicker {
    0%, 95%, 100% { opacity: 1; }
    96%            { opacity: 0.6; }
    98%            { opacity: 0.85; }
  }
  @keyframes rank-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes reff-fadein {
    from { opacity: 0; transform: scale(1.05); }
    to   { opacity: 1; transform: scale(1); }
  }

  @keyframes reff-fadeout {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(0.97); }
  }

  .game-cta-btn {
    padding: 12px 36px;
    background: linear-gradient(135deg, #8b0020, #cc0035);
    color: #fff0f0;
    font-family: 'Cinzel Decorative', serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2em;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    animation: pulse-glow 2.5s ease-in-out infinite;
    transition: transform 0.15s;
    text-transform: uppercase;
  }
  .game-cta-btn:hover { transform: scale(1.04); }
  .game-cta-btn:active { transform: scale(0.97); }

  .ghost-btn {
    padding: 12px 36px;
    background: transparent;
    color: ${C.muted};
    font-family: 'Cinzel Decorative', serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    border: 0.5px solid rgba(180,0,40,0.35);
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
  }
  .ghost-btn:hover {
    border-color: rgba(220,0,60,0.6);
    color: ${C.primary};
    background: rgba(80,0,20,0.2);
  }

  .text-btn {
    background: transparent;
    border: none;
    color: rgb(255, 141, 160);
    font-family: 'Cormorant  Garamond', serif;
    font-size: 13px;
    font-style: italic;
    cursor: pointer;
    transition: color 0.2s;
    letter-spacing: 0.05em;
  }
  .text-btn:hover { color: #f5d5d8; }
`

export default function GameEngine() {
  const navigate = useNavigate()
  const { preset } = useSettings()
  const KEYS = preset.keys
  const LABELS = preset.display
  const audio = useAudio('/songs/bubble-pop-electric.mp3')
  const [phase, setPhase] = useState('idle')
  const [score, setScore] = useState(100)
  const [combo, setCombo] = useState(0)
  const [notes, setNotes] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [activeKeys, setActiveKeys] = useState(new Set())
  const [isShaking, setIsShaking] = useState(false)
  const [endStats, setEndStats] = useState(null)
  const [reffPhase, setReffPhase] = useState('hidden')
  const reffPhaseRef = useRef('hidden')
  const [activeVideo, setActiveVideo] = useState('/videos/bubble-pop-reff.mp4')


  const g = useRef({
    running: false,
    score: 100, combo: 0, maxCombo: 0,
    notes: [], spawnIdx: 0,
    startTime: 0, lastFrame: 0,
    stats: { perfect: 0, good: 0, miss: 0 },
    heldKeys: new Set(), nid: 0, raf: null,
  })

  const loopFn = useRef(null)

  useEffect(() => {
    loopFn.current = (now) => {
      const gs = g.current
      if (!gs.running) return

      const elapsed = now - gs.startTime
      const dt = (now - gs.lastFrame) / 1000
      gs.lastFrame = now
      const travelSec = LANE_HEIGHT / NOTE_SPEED

      while (gs.spawnIdx < beatmapData.notes.length) {
  const n = beatmapData.notes[gs.spawnIdx]
        if (elapsed >= n.time - travelSec * 1000) {
          gs.notes.push({ id: gs.nid++, lane: n.lane, y: 0, hit: false })
          gs.spawnIdx++
        } else break
      }

      gs.notes.forEach(n => { n.y += NOTE_SPEED * dt })

      gs.notes.forEach(n => {
        if (!n.hit && n.y > TARGET_Y + MISS_THRESHOLD) {
          n.hit = true
          gs.score = Math.max(0, gs.score - 10)
          gs.combo = 0
          gs.stats.miss++
          setScore(gs.score)
          setCombo(0)
          spawnFeedback(n.lane, 'MISS', C.miss)
          triggerShake()
          if (gs.score <= 0) { endGame(false); return }
        }
      })

      gs.notes = gs.notes.filter(n => n.y < LANE_HEIGHT + 60)
      setNotes([...gs.notes])
      const currentSpot = REFF_SPOTS.find(s => elapsed >= s.start && elapsed <= s.end)
      const inReff = !!currentSpot
      const nearEnd = currentSpot ? elapsed >= currentSpot.end - 1500 : false

      if (inReff && !nearEnd && reffPhaseRef.current === 'hidden') {
        reffPhaseRef.current = 'entering'
        setActiveVideo(currentSpot.video)
        setReffPhase('entering')
        setTimeout(() => {
          reffPhaseRef.current = 'visible'
          setReffPhase('visible')
        }, 800)
      }

      if (nearEnd && reffPhaseRef.current === 'visible') {
        reffPhaseRef.current = 'leaving'
        setReffPhase('leaving')
        setTimeout(() => {
          reffPhaseRef.current = 'hidden'
          setReffPhase('hidden')
        }, 1500)
      }

      const done = gs.spawnIdx >= beatmapData.notes.length
        && gs.notes.length === 0 && elapsed > 1000
      if (done) { endGame(true); return }

      gs.raf = requestAnimationFrame(loopFn.current)
    }
  }, [])

  function spawnFeedback(lane, text, color) {
    const id = Date.now() + Math.random()
    setFeedbacks(prev => [...prev, { id, lane, text, color }])
    setTimeout(() => setFeedbacks(prev => prev.filter(f => f.id !== id)), 750)
  }

  function triggerShake() {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 280)
  }

  function endGame(victory) {
    const gs = g.current
    gs.running = false
    cancelAnimationFrame(gs.raf)
    audio.stop()
    const total = gs.stats.perfect + gs.stats.good + gs.stats.miss
    const acc = total > 0
      ? Math.round((gs.stats.perfect + gs.stats.good * 0.5) / total * 100) : 0
    const rank = acc >= 95 ? 'S' : acc >= 82 ? 'A' : acc >= 65 ? 'B' : 'C'
    setEndStats({ victory, score: gs.score, maxCombo: gs.maxCombo, stats: { ...gs.stats }, acc, rank })
    setPhase(victory ? 'victory' : 'gameover')
  }

  function pressLane(li) {
    const gs = g.current
    if (!gs.running || gs.heldKeys.has(li)) return
    gs.heldKeys.add(li)
    setActiveKeys(new Set(gs.heldKeys))

    const avail = gs.notes.filter(n => n.lane === li && !n.hit)
    if (!avail.length) {
      gs.score = Math.max(0, gs.score - 10)
      gs.combo = 0
      setScore(gs.score); setCombo(0)
      spawnFeedback(li, '-10', C.penalty)
      triggerShake()
      if (gs.score <= 0) endGame(false)
      return
    }

    let best = null, bestD = Infinity
    avail.forEach(n => {
      const d = Math.abs(n.y - TARGET_Y)
      if (d < bestD) { bestD = d; best = n }
    })

    const msOff = (bestD / NOTE_SPEED) * 1000
    if (msOff <= PERFECT_WIN) {
      best.hit = true
      gs.score += 100; gs.combo++
      if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo
      gs.stats.perfect++
      setScore(gs.score); setCombo(gs.combo)
      spawnFeedback(li, 'PERFECT', C.perfect)
    } else if (msOff <= GOOD_WIN) {
      best.hit = true
      gs.score += 50; gs.combo++
      if (gs.combo > gs.maxCombo) gs.maxCombo = gs.combo
      gs.stats.good++
      setScore(gs.score); setCombo(gs.combo)
      spawnFeedback(li, 'GOOD', C.good)
    } else {
      gs.score = Math.max(0, gs.score - 10)
      gs.combo = 0; gs.stats.miss++
      setScore(gs.score); setCombo(0)
      spawnFeedback(li, 'MISS', C.miss)
      triggerShake()
      if (gs.score <= 0) endGame(false)
    }
  }

  function releaseLane(li) {
    g.current.heldKeys.delete(li)
    setActiveKeys(new Set(g.current.heldKeys))
  }

  function startGame() {
    const gs = g.current
    cancelAnimationFrame(gs.raf)
    gs.running = true; gs.score = 100; gs.combo = 0; gs.maxCombo = 0
    gs.notes = []; gs.spawnIdx = 0
    gs.startTime = performance.now(); gs.lastFrame = performance.now()
    gs.stats = { perfect: 0, good: 0, miss: 0 }
    gs.heldKeys = new Set(); gs.nid = 0
    setScore(100); setCombo(0); setNotes([])
    setFeedbacks([]); setEndStats(null); setActiveKeys(new Set())
    reffPhaseRef.current = 'hidden'
    setReffPhase('hidden')
    setPhase('playing')
    audio.play()
    gs.raf = requestAnimationFrame(loopFn.current)
  }

  function pauseGame() {
    g.current.running = false
    cancelAnimationFrame(g.current.raf)
    audio.pause()
    setPhase('paused')
  }

  function resumeGame() {
    const gs = g.current
    gs.running = true
    gs.startTime = performance.now() - (gs.lastFrame - gs.startTime)
    gs.lastFrame = performance.now()
    audio.play()
    setPhase('playing')
    gs.raf = requestAnimationFrame(loopFn.current)
  }

  function restartGame() {
    audio.stop()
    startGame()
  }

  useEffect(() => {
    const onDown = (e) => {
      if (e.key === 'Escape') {
        setPhase(prev => {
          if (prev === 'playing') { pauseGame(); return 'paused' }
          if (prev === 'paused') { resumeGame(); return 'playing' }
          return prev
        })
        return
      }
      if (e.repeat) return
      const i = KEYS.indexOf(e.key.toLowerCase())
      if (i !== -1) { e.preventDefault(); pressLane(i) }
    }
    const onUp = (e) => {
      const i = KEYS.indexOf(e.key.toLowerCase())
      if (i !== -1) releaseLane(i)
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  useEffect(() => {
    return () => { cancelAnimationFrame(g.current.raf); audio.unload() }
  }, [])

  const energyPct = Math.max(0, Math.min(100, score))
  const barColor = energyPct > 60 ? C.accent : energyPct > 30 ? '#dd7700' : '#ff2020'

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: C.bg, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      animation: isShaking ? 'screenshake 0.28s ease-out' : 'none',
    }}>
      <style>{GAME_STYLES}</style>

      {/* ── Reff Video Background ── */}
      {reffPhase !== 'hidden' && (
        <div style={{
          position: 'absolute', inset: 0,
          zIndex: 0, overflow: 'hidden',
          pointerEvents: 'none',
          animation: reffPhase === 'entering' || reffPhase === 'visible'
            ? 'reff-fadein 0.8s ease forwards'
            : 'reff-fadeout 1.5s ease forwards',
        }}>
          {/* Vignette overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: `
              radial-gradient(ellipse at center,
                rgba(8,0,8,0.3) 0%,
                rgba(8,0,8,0.6) 60%,
                rgba(8,0,8,0.85) 100%
              )
            `,
          }} />

          {/* Warna overlay merah Yor */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'rgba(80,0,20,0.25)',
            mixBlendMode: 'multiply',
          }} />

          <video
            key={activeVideo}
            src={activeVideo}
            autoPlay
            muted
            loop
            playsInline
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

      {/* ── BG decoration ── */}
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

      {/* ── Pause button ── */}
      {phase === 'playing' && (
        <button onClick={pauseGame} title="Pause (ESC)" style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(20,0,8,0.8)',
          border: `0.5px solid ${C.border}`,
          borderRadius: 3, padding: '8px 12px',
          cursor: 'pointer', color: 'rgba(240,220,220,0.8)',
          fontSize: 16, lineHeight: 1,
          transition: 'all 0.2s',
        }}>⚙</button>
      )}

      {/* ── Song title ── */}
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

      {/* ── HUD ── */}
      {phase === 'playing' && (
        <div style={{
          width: 360, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14, padding: '10px 20px',
          background: C.bgPanel,
          borderRadius: 2,
          border: `0.5px solid ${C.border}`,
        }}>
          <div>
            <div style={{
              fontSize: 9, color: C.accent,
              letterSpacing: '0.25em', fontFamily: 'Cinzel Decorative, serif',
              marginBottom: 4,
            }}>SCORE</div>
            <div style={{
              fontSize: 24, color: C.primary,
              fontFamily: 'Cinzel Decorative, serif',
              textShadow: `0 0 20px ${C.accentGlow}`,
              animation: 'flicker 10s infinite',
            }}>{score}</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 9, color: C.accent,
              letterSpacing: '0.25em', fontFamily: 'Cinzel Decorative, serif',
              marginBottom: 6,
            }}>ENERGY</div>
            <div style={{
              width: 110, height: 4,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                width: `${energyPct}%`, height: '100%',
                background: barColor, borderRadius: 2,
                transition: 'width 0.2s, background 0.4s',
                boxShadow: `0 0 8px ${barColor}`,
              }} />
            </div>
            <div style={{
              fontSize: 10, color: C.mutedDark,
              fontFamily: 'Cormorant Garamond, serif',
              marginTop: 4,
            }}>{score} / 100</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 9, color: C.accent,
              letterSpacing: '0.25em', fontFamily: 'Cinzel Decorative, serif',
              marginBottom: 4,
            }}>COMBO</div>
            <div style={{
              fontSize: 24, color: combo > 10 ? C.perfect : C.primary,
              fontFamily: 'Cinzel Decorative, serif',
              textShadow: combo > 10 ? '0 0 20px rgba(180,150,255,0.6)' : 'none',
              transition: 'color 0.3s',
            }}>{combo}x</div>
          </div>
        </div>
      )}

      {/* ── Lane area ── */}
      <div style={{ position: 'relative', width: 360 }}>

        {/* Lane container */}
        <div style={{
          display: 'flex', gap: 4, height: LANE_HEIGHT,
          position: 'relative',
          border: `0.5px solid ${C.border}`,
          borderBottom: 'none',
          borderRadius: '2px 2px 0 0',
          overflow: 'hidden',
        }}>
          {/* Lane glow top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            zIndex: 2,
          }} />

          {Array.from({ length: LANE_COUNT }).map((_, li) => (
            <div key={li} style={{
              flex: 1, position: 'relative',
              background: activeKeys.has(li) ? C.bgLaneActive : C.bgLane,
              borderRight: li < 3 ? `0.5px solid ${C.border}` : 'none',
              transition: 'background 0.07s',
            }}>
              {/* Lane center line */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: '50%', width: 1,
                background: 'rgba(180,0,40,0.06)',
                transform: 'translateX(-50%)',
              }} />

              {/* Notes */}
              {notes.filter(n => n.lane === li && !n.hit).map(n => (
                <div key={n.id} style={{
                  position: 'absolute',
                  left: 4, right: 4, height: 20,
                  top: Math.round(n.y),
                  background: `linear-gradient(180deg, ${C.noteTop}, ${C.note})`,
                  borderRadius: 2,
                  boxShadow: `0 0 12px ${C.noteShadow}, 0 0 4px ${C.noteShadow}`,
                  borderTop: `1.5px solid rgba(255,100,120,0.8)`,
                  animation: 'note-enter 0.06s ease-out',
                }} />
              ))}
            </div>
          ))}

          {/* Feedback floating text */}
          {feedbacks.map(fb => (
            <div key={fb.id} style={{
              position: 'absolute',
              left: `${fb.lane * 25 + 3}%`,
              bottom: 80, zIndex: 20,
              pointerEvents: 'none',
              animation: 'floatup 0.75s ease-out forwards',
            }}>
              <span style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: fb.text === 'PERFECT' ? 13 : 12,
                fontWeight: 700,
                color: fb.color,
                letterSpacing: '0.1em',
                textShadow: `0 0 12px ${fb.color}`,
              }}>{fb.text}</span>
            </div>
          ))}
        </div>

        {/* Target zone / key buttons */}
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
              background: activeKeys.has(li)
                ? 'rgba(180,0,40,0.3)'
                : 'rgba(40,0,10,0.6)',
              borderRight: li < 3 ? `0.5px solid ${C.border}` : 'none',
              transition: 'background 0.07s',
              boxShadow: activeKeys.has(li)
                ? `inset 0 0 20px rgba(200,0,40,0.3)`
                : 'none',
            }}>
              <span style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: 16, fontWeight: 700,
                color: activeKeys.has(li) ? C.primary : 'rgba(180,0,40,0.4)',
                textShadow: activeKeys.has(li) ? `0 0 12px ${C.accentGlow}` : 'none',
                transition: 'all 0.07s',
              }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          OVERLAYS
      ══════════════════════════════════════ */}

      {/* ── Idle ── */}
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
          }}>Ready?</h2>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 14,
            fontStyle: 'italic',
            color: 'rgba(240,220,220,0.9)',
            textAlign: 'center',
            lineHeight: 1.9,
          }}>
            Tekan <span style={{ color: C.primary, fontStyle: 'normal', fontWeight: 600 }}>D F J K</span> saat note menyentuh target<br />
            Miss / asal tekan = <span style={{ color: C.miss }}>−10</span> &nbsp;·&nbsp;
            Perfect = <span style={{ color: C.perfect }}>+100</span> &nbsp;·&nbsp;
            Good = <span style={{ color: C.good }}>+50</span><br />
            <span style={{ fontSize: 12, color: 'rgba(240,220,220,0.9)' }}>ESC atau ⚙ untuk pause</span>
          </div>
          <button className="game-cta-btn" onClick={startGame}>▶ MULAI</button>
        </YorOverlay>
      )}

      {/* ── Paused ── */}
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

      {/* ── Game Over ── */}
      {phase === 'gameover' && endStats && (
        <YorOverlay>
          <div style={{ fontSize: 36 }}>💀</div>
          <p style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 9, color: '#aa2020', letterSpacing: '0.3em' }}>GAME OVER</p>
          <h2 style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 26, color: '#ff4060',
            textShadow: '0 0 30px rgba(255,40,60,0.6)',
          }}>Score Habis</h2>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 14, color: 'rgba(240,220,220,0.9)',
            textAlign: 'center', lineHeight: 2,
          }}>
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

      {/* ── Victory ── */}
      {phase === 'victory' && endStats && (
        <YorOverlay>
          <div style={{ fontSize: 36 }}>🌹</div>
          <p style={{ fontFamily: 'Cinzel Decorative, serif', fontSize: 9, color: '#44aa66', letterSpacing: '0.3em' }}>STAGE CLEAR</p>
          <div style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 72, color: C.primary,
            textShadow: `0 0 40px ${C.accentGlow}, 0 0 80px ${C.accentGlow}`,
            lineHeight: 1,
            animation: 'rank-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
          }}>{endStats.rank}</div>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 14, color: 'rgba(240,220,220,0.9)',
            textAlign: 'center', lineHeight: 2,
          }}>
            Score: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.score}</span> &nbsp;·&nbsp;
            Max Combo: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.maxCombo}x</span><br />
            Perfect: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.perfect}</span> &nbsp;·&nbsp;
            Good: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.good}</span> &nbsp;·&nbsp;
            Miss: <span style={{ color: 'rgba(240,220,220,0.95)' }}>{endStats.stats.miss}</span><br />
            <span style={{ fontSize: 16, color: 'rgba(240,220,220,0.95)' }}>Accuracy: {endStats.acc}%</span>
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
      {/* Top & bottom decorative lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
      }} />
      {children}
    </div>
  )
}