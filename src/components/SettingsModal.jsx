import { useSettings } from '../context/SettingsContext'

export default function SettingsModal({ onClose }) {
  const { presetKey, presets, changePreset } = useSettings()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(4,0,4,0.88)',
      backdropFilter: 'blur(6px)',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

        @keyframes modal-rise {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .preset-card {
          padding: 1rem 1.25rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .preset-card:hover {
          background: rgba(100,0,25,0.25) !important;
          border-color: rgba(200,0,40,0.5) !important;
        }
        .preset-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, transparent, #cc0035, transparent);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }
        .preset-card:hover::before { transform: translateX(0); }

        .close-btn {
          background: transparent;
          border: 0.5px solid rgba(180,0,40,0.3);
          border-radius: 2px;
          color: rgba(220,170,170,0.6);
          font-family: 'Cinzel Decorative', serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          padding: 10px 32px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .close-btn:hover {
          border-color: rgba(200,0,40,0.6);
          color: #f5d5d8;
          background: rgba(80,0,20,0.2);
        }
      `}</style>

      {/* ── Modal box ── */}
      <div style={{
        width: 'min(480px, 92vw)',
        background: '#0e000e',
        border: '0.5px solid rgba(180,0,40,0.35)',
        borderRadius: 3,
        overflow: 'hidden',
        animation: 'modal-rise 0.35s cubic-bezier(0.175,0.885,0.32,1.1) both',
      }}>

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '0.5px solid rgba(180,0,40,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(40,0,10,0.5)',
        }}>
          <div>
            <p style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 9, color: '#cc0035',
              letterSpacing: '0.3em', marginBottom: 5,
            }}>RHYTHM TAP</p>
            <h2 style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 18, color: '#f5d5d8',
              fontWeight: 700, letterSpacing: '0.08em',
            }}>Settings</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(180,100,100,0.4)', fontSize: 22,
              cursor: 'pointer', lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#f5d5d8'}
            onMouseLeave={e => e.target.style.color = 'rgba(180,100,100,0.4)'}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem' }}>

          {/* Section: Key Mapping */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(180,0,40,0.15)' }} />
              <p style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: 9, color: '#cc0035', letterSpacing: '0.25em',
                whiteSpace: 'nowrap',
              }}>KEY MAPPING</p>
              <div style={{ flex: 1, height: 1, background: 'rgba(180,0,40,0.15)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(presets).map(([key, preset]) => {
                const isActive = presetKey === key
                return (
                  <div
                    key={key}
                    className="preset-card"
                    onClick={() => changePreset(key)}
                    style={{
                      border: `0.5px solid ${isActive ? 'rgba(200,0,40,0.55)' : 'rgba(180,0,40,0.2)'}`,
                      background: isActive ? 'rgba(100,0,25,0.2)' : 'rgba(40,0,10,0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                      {/* Key badges */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {preset.display.map((k, i) => (
                          <div key={i} style={{
                            width: 38, height: 38,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isActive ? 'rgba(140,0,35,0.35)' : 'rgba(60,0,15,0.3)',
                            border: `1px solid ${isActive ? 'rgba(200,0,40,0.5)' : 'rgba(180,0,40,0.2)'}`,
                            borderRadius: 4,
                            fontFamily: 'Courier New, monospace',
                            fontSize: k.length > 1 ? 14 : 16,
                            fontWeight: 700,
                            color: isActive ? '#ff8098' : 'rgba(180,80,100,0.5)',
                            boxShadow: isActive ? '0 0 10px rgba(200,0,40,0.2)' : 'none',
                            transition: 'all 0.2s',
                          }}>{k}</div>
                        ))}
                      </div>

                      {/* Active indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <p style={{
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: 13, fontStyle: 'italic',
                          color: isActive ? 'rgba(220,170,170,0.7)' : 'rgba(180,100,100,0.3)',
                          transition: 'color 0.2s',
                        }}>{preset.label}</p>
                        {isActive && (
                          <div style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: '#cc0035',
                            boxShadow: '0 0 8px rgba(200,0,40,0.8)',
                          }} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 12, fontStyle: 'italic',
              color: 'rgba(180,100,100,0.35)',
              marginTop: '1rem', textAlign: 'center',
            }}>
              Klik preset untuk mengubah key mapping · Tersimpan otomatis
            </p>
          </div>

          {/* Close button */}
          <div style={{ textAlign: 'center' }}>
            <button className="close-btn" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
        }} />
      </div>
    </div>
  )
}