import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import SettingsModal from './SettingsModal'

const SONGS = [
  {
    id: 1,
    title: 'Bubble Pop Electric',
    artist: 'Gwen Stefani',
    genre: 'Pop',
    bpm: 128,
    duration: '3:43',
  },
]

const HOME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(180,0,40,0.4), 0 0 60px rgba(180,0,40,0.15); }
    50%       { box-shadow: 0 0 40px rgba(220,0,60,0.7), 0 0 100px rgba(220,0,60,0.3); }
  }
  @keyframes flicker {
    0%, 95%, 100% { opacity: 1; }
    96%            { opacity: 0.6; }
    98%            { opacity: 0.85; }
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .song-card {
    padding: 1.25rem 1.5rem;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .song-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, #cc0035, transparent);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }
  .song-card:hover::before { transform: translateX(0); }

  .cta-btn {
    padding: 14px 52px;
    background: linear-gradient(135deg, #8b0020, #cc0035);
    color: #fff0f0;
    font-family: 'Cinzel Decorative', serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2em;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    animation: pulse-glow 2.5s ease-in-out infinite;
    transition: transform 0.15s;
    text-transform: uppercase;
  }
  .cta-btn:hover { transform: scale(1.04); }
  .cta-btn:active { transform: scale(0.97); }

  .back-btn {
    background: transparent;
    border: none;
    color: rgb(253, 230, 230);
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    font-style: italic;
    cursor: pointer;
    letter-spacing: 0.08em;
    transition: color 0.2s;
  }
  .back-btn:hover { color: rgba(220,170,170,0.7); }
`

export default function Home() {
  const navigate = useNavigate()
  const { preset } = useSettings()
  const [showSettings, setShowSettings] = useState(false)
  const [selected, setSelected] = useState(SONGS[0])

  return (
    <>
    <div style={{
      width: '100vw', height: '100vh',
      background: '#080008',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{HOME_STYLES}</style>

      {/* ── BG decoration ── */}
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

      {/* ── Back button ── */}
      <button
        className="back-btn"
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: 24, left: 28 }}
      >
        ← Kembali
      </button>

      {/* ── Settings button ── */}   {/* ← tambahkan ini */}
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: 'absolute', top: 24, right: 28,
          background: 'rgba(20,0,8,0.8)',
          border: '0.5px solid rgba(180,0,40,0.25)',
          borderRadius: 3, padding: '8px 14px',
          cursor: 'pointer', color: 'rgba(180,80,100,0.5)',
          fontSize: 16, lineHeight: 1,
          transition: 'all 0.2s',
          fontFamily: 'Cinzel Decorative, serif',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f5d5d8'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,80,100,0.5)'}
      >⚙</button>

      {/* ── Rose ── */}
      <div style={{
        fontSize: 44, marginBottom: '1.25rem',
        animation: 'float 4s ease-in-out infinite',
        filter: 'drop-shadow(0 0 16px rgba(200,0,40,0.6))',
        animationFillMode: 'both',
      }}>🌹</div>

      {/* ── Title ── */}
      <div style={{
        textAlign: 'center', marginBottom: '2.5rem',
        animation: 'rise 0.8s ease both 0.1s',
      }}>
        <p style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 9, color: '#cc0035',
          letterSpacing: '0.35em', marginBottom: 10,
          textTransform: 'uppercase',
        }}>Pilih Lagu</p>
        <h1 style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 900, color: '#f5d5d8',
          textShadow: '0 0 30px rgba(200,0,40,0.4)',
          margin: 0, lineHeight: 1.2,
          animation: 'flicker 10s infinite',
        }}>RHYTHM TAP</h1>
        <div style={{
          width: 60, height: 1, margin: '12px auto 0',
          background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
        }} />
      </div>

      {/* ── Song list ── */}
      <div style={{
        width: 'min(440px, 90vw)',
        display: 'flex', flexDirection: 'column', gap: 8,
        marginBottom: '2rem',
        animation: 'rise 0.8s ease both 0.25s',
      }}>
        {SONGS.map(song => (
          <div
            key={song.id}
            className="song-card"
            onClick={() => setSelected(song)}
            style={{
              border: `0.5px solid ${selected.id === song.id
                ? 'rgba(200,0,40,0.55)'
                : 'rgba(180,0,40,0.2)'}`,
              background: selected.id === song.id
                ? 'rgba(100,0,25,0.2)'
                : 'rgba(40,0,10,0.3)',
            }}
          >
            {/* Left — song info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 2, flexShrink: 0,
                background: 'linear-gradient(135deg, #4a0015, #8b0030)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: selected.id === song.id
                  ? '0 0 16px rgba(180,0,40,0.5)' : 'none',
                transition: 'box-shadow 0.3s',
              }}>🎵</div>
              <div>
                <p style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 13, color: '#f5d5d8',
                  letterSpacing: '0.06em', marginBottom: 5,
                }}>{song.title}</p>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 13, fontStyle: 'italic',
                  color: 'rgb(235, 177, 177)',
                }}>{song.artist}</p>
              </div>
            </div>

            {/* Right — meta */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{
                display: 'block',
                fontSize: 9, padding: '3px 10px',
                borderRadius: 2, marginBottom: 6,
                background: 'rgba(180,0,40,0.15)',
                border: '0.5px solid rgba(180,0,40,0.3)',
                color: 'rgba(220,120,140,0.8)',
                letterSpacing: '0.1em',
                fontFamily: 'Cinzel Decorative, serif',
              }}>{song.genre}</span>
              <p style={{
                fontSize: 11, color: 'rgb(255, 213, 213)',
                fontFamily: 'Cormorant Garamond, serif',
              }}>{song.bpm} BPM · {song.duration}</p>
            </div>
          </div>
        ))}

        {/* Coming soon placeholder */}
        <div style={{
          padding: '1rem 1.5rem',
          border: '0.5px dashed rgba(180,0,40,0.15)',
          borderRadius: 2,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 13, fontStyle: 'italic',
            color: 'rgb(255, 222, 222)',
          }}>Lagu lainnya segera hadir...</p>
        </div>
      </div>

      {/* ── Play button ── */}
      <div style={{ animation: 'rise 0.8s ease both 0.4s' }}>
        <button className="cta-btn" onClick={() => navigate('/play')}>
          ▶ PLAY
        </button>
      </div>

      {/* ── Key hint ── */}
      <p style={{
        position: 'absolute', bottom: 24,
        fontFamily: 'Cinzel Decorative, serif',
        fontSize: 10, color: 'rgba(180,0,40,0.2)',
        letterSpacing: '0.3em',
        animation: 'rise 0.8s ease both 0.6s',
      }}>{preset.display.join(' \u00a0\u00a0 ')}</p>
    </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </>
  )
}