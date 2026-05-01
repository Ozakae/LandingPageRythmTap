import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(el => {
          if (el.isIntersecting) el.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{
      background: '#080008',
      color: '#f0e6e6',
      fontFamily: "'Georgia', serif",
      overflowX: 'hidden',
      minHeight: '100vh',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.25s; }
        .reveal-delay-3 { transition-delay: 0.4s; }
        .reveal-delay-4 { transition-delay: 0.55s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(180,0,40,0.4), 0 0 60px rgba(180,0,40,0.2); }
          50% { box-shadow: 0 0 40px rgba(220,0,60,0.7), 0 0 100px rgba(220,0,60,0.35); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.7; }
          98% { opacity: 0.9; }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(60px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes thorns-drift {
          0% { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(-50%) rotate(2deg); }
        }

        .cta-btn {
          display: inline-block;
          padding: 18px 56px;
          background: linear-gradient(135deg, #8b0020, #cc0035);
          color: #fff0f0;
          font-family: 'Cinzel Decorative', serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.2em;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: pulse-glow 2.5s ease-in-out infinite;
          transition: transform 0.2s;
          text-transform: uppercase;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }
        .cta-btn:hover::before { left: 100%; }
        .cta-btn:hover { transform: scale(1.04); }
        .cta-btn:active { transform: scale(0.98); }

        .feature-card {
          background: rgba(80,0,20,0.15);
          border: 0.5px solid rgba(180,0,40,0.3);
          border-radius: 4px;
          padding: 2rem 1.75rem;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          background: rgba(120,0,30,0.25);
          border-color: rgba(220,0,60,0.6);
          transform: translateY(-4px);
        }

        .key-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px; height: 52px;
          background: rgba(80,0,20,0.4);
          border: 1.5px solid rgba(200,0,50,0.5);
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: 700;
          color: #ff8098;
          box-shadow: 0 0 12px rgba(200,0,50,0.2);
          transition: all 0.2s;
        }
        .key-badge:hover {
          border-color: #cc0035;
          box-shadow: 0 0 20px rgba(200,0,50,0.5);
          color: #ffaabb;
        }

        .song-card {
          background: rgba(60,0,15,0.3);
          border: 0.5px solid rgba(180,0,40,0.25);
          border-radius: 4px;
          padding: 1.5rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .song-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #cc0035, transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        .song-card:hover::before { transform: translateX(0); }
        .song-card:hover {
          background: rgba(100,0,25,0.35);
          border-color: rgba(220,0,60,0.5);
          transform: translateY(-3px);
        }

        .nav-link {
          color: rgba(240,200,200,0.6);
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
        }
        .nav-link:hover { color: #ff8098; }

        .divider {
          width: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, #cc0035, transparent);
          margin: 1.25rem auto;
        }

        .section-label {
          font-family: 'Cinzel Decorative', serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          color: #cc0035;
          text-transform: uppercase;
        }

        .section-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(24px, 4vw, 38px);
          font-weight: 700;
          color: #f5d5d8;
          line-height: 1.25;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080008; }
        ::-webkit-scrollbar-thumb { background: #8b0020; border-radius: 2px; }
      `}</style>

      {/* ── Noise texture overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }} />

      {/* ── Decorative BG circles ── */}
      <div style={{
        position: 'fixed', top: '20%', right: '-120px',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(140,0,30,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', left: '-80px',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,0,20,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 3rem',
        background: 'rgba(8,0,8,0.85)',
        borderBottom: '0.5px solid rgba(180,0,40,0.2)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 16, fontWeight: 900, color: '#f5d5d8',
          letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(200,0,40,0.5)',
          animation: 'flicker 8s infinite',
        }}>
          RHYTHM TAP
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Fitur</button>
          <button className="nav-link" onClick={() => document.getElementById('howtoplay')?.scrollIntoView({ behavior: 'smooth' })}>Cara Main</button>
          <button className="nav-link" onClick={() => document.getElementById('songs')?.scrollIntoView({ behavior: 'smooth' })}>Lagu</button>
          <button
            className="cta-btn"
            style={{ padding: '10px 24px', fontSize: 11, animation: 'none' }}
            onClick={() => navigate('/home')}
          >
            Play Now
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        position: 'relative', zIndex: 1, textAlign: 'center',
      }}>
        {/* Rose decoration */}
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: 80, height: 80,
            objectFit: 'contain',
            marginBottom: '1.5rem',
            animation: 'float 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(200,0,40,0.6))',
          }}
        />

        <p className="section-label" style={{ marginBottom: '1rem', animation: 'rise 1s ease both 0.2s' }}>
          — Web Rhythm Game —
        </p>

        <h1 style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 'clamp(40px, 8vw, 88px)',
          fontWeight: 900, lineHeight: 1.1,
          color: '#f5d5d8',
          textShadow: '0 0 40px rgba(200,0,40,0.5), 0 0 80px rgba(200,0,40,0.2)',
          marginBottom: '1.5rem',
          animation: 'rise 1s ease both 0.4s',
        }}>
          RHYTHM<br />
          <span style={{ color: '#cc0035', textShadow: '0 0 40px rgba(220,0,50,0.8)' }}>TAP</span>
        </h1>

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(16px, 2.5vw, 24px)',
          fontStyle: 'italic',
          color: 'rgba(240,200,200,0.75)',
          maxWidth: 520, lineHeight: 1.7,
          marginBottom: '0.75rem',
          animation: 'rise 1s ease both 0.6s',
        }}>
          "Don't just tap the rhythm — survive it."
        </p>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 14,
          color: 'rgb(251, 189, 189)',
          marginBottom: '3rem',
          letterSpacing: '0.08em',
          animation: 'rise 1s ease both 0.7s',
        }}>
          Setiap miss adalah langkah menuju kekalahan
        </p>

        <button
          className="cta-btn"
          onClick={() => navigate('/home')}
          style={{ animation: 'rise 1s ease both 0.85s, pulse-glow 2.5s ease-in-out infinite 0.85s' }}
        >
          ⚔ MAIN SEKARANG
        </button>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 40,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'rgb(206, 190, 190)', fontSize: 11,
          letterSpacing: '0.15em', fontFamily: 'Cinzel Decorative, serif',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <span>scroll</span>
          <span style={{ fontSize: 18 }}>↓</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Yang Membuat Kami Beda</p>
            <div className="divider" />
            <h2 className="section-title">Fitur Utama</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                icon: '💀',
                title: 'Survival Mechanics',
                desc: 'Mulai dengan 100 poin. Setiap miss atau tekan sembarangan: -10. Skor menyentuh 0? Game Over seketika. Bukan soal nilai — ini soal bertahan hidup.',
                delay: 'reveal-delay-1',
              },
              {
                icon: '🎵',
                title: 'Musik Pilihan',
                desc: 'Saat ini hadir dengan Bubble Pop Electric dari Gwen Stefani. Beatmap dikurasi khusus mengikuti struktur lagu — intro, verse, chorus, bridge, sampai outro.',
                delay: 'reveal-delay-2',
              },
              {
                icon: '🌐',
                title: 'Langsung di Browser',
                desc: 'Tidak perlu install apapun. Buka link, langsung main. Berjalan di Chrome, Firefox, Edge — di laptop atau PC manapun.',
                delay: 'reveal-delay-3',
              },
              {
                icon: '⚙',
                title: 'Kustomisasi Input',
                desc: 'Tidak nyaman dengan D/F/J/K? Ganti ke A/W/S/D atau arrow keys. Sesuaikan kontrol dengan gaya mainmu sendiri di menu Settings.',
                delay: 'reveal-delay-4',
              },
            ].map((f, i) => (
              <div key={i} className={`feature-card reveal ${f.delay}`}>
                <div style={{ fontSize: 36, marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 14, fontWeight: 700,
                  color: '#f5d5d8', letterSpacing: '0.08em',
                  marginBottom: '0.75rem',
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 15, lineHeight: 1.75,
                  color: 'rgba(220,180,180,0.7)',
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW TO PLAY
      ══════════════════════════════════════ */}
      <section id="howtoplay" style={{
        padding: '6rem 2rem',
        background: 'rgba(40,0,10,0.4)',
        borderTop: '0.5px solid rgba(180,0,40,0.15)',
        borderBottom: '0.5px solid rgba(180,0,40,0.15)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Panduan Pemain</p>
            <div className="divider" />
            <h2 className="section-title">Cara Bermain</h2>
          </div>

          {/* Key mapping */}
          <div className="reveal reveal-delay-1" style={{
            background: 'rgba(60,0,15,0.3)',
            border: '0.5px solid rgba(180,0,40,0.25)',
            borderRadius: 4, padding: '2rem',
            marginBottom: '2rem',
          }}>
            <p style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 12, color: '#cc0035',
              letterSpacing: '0.2em', marginBottom: '1.5rem',
              textAlign: 'center',
            }}>DEFAULT KEY MAPPING</p>
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap',
            }}>
              {['D', 'F', 'J', 'K'].map(k => (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div className="key-badge">{k}</div>
                  <div style={{ fontSize: 10, color: 'rgba(200,140,140,0.5)', marginTop: 6, letterSpacing: '0.1em' }}>
                    Lane {['D','F','J','K'].indexOf(k) + 1}
                  </div>
                </div>
              ))}
            </div>
            <p style={{
              textAlign: 'center', fontFamily: 'Cormorant Garamond, serif',
              fontSize: 13, color: 'rgb(255, 230, 230)', fontStyle: 'italic',
            }}>
              Dapat diubah ke A/W/S/D atau Arrow Keys melalui Settings
            </p>
          </div>

          {/* Timing */}
          <div className="reveal reveal-delay-2" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginBottom: '2rem',
          }}>
            {[
              { label: 'PERFECT', color: '#aaaaff', pts: '+100', desc: 'Tepat di target zone' },
              { label: 'GOOD', color: '#88ddaa', pts: '+50', desc: 'Sedikit meleset' },
              { label: 'MISS', color: '#ee6666', pts: '-10', desc: 'Terlewat / salah tekan' },
            ].map(t => (
              <div key={t.label} style={{
                background: 'rgba(60,0,15,0.3)',
                border: `0.5px solid ${t.color}33`,
                borderRadius: 4, padding: '1.25rem',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 13, color: t.color,
                  letterSpacing: '0.15em', marginBottom: '0.5rem',
                }}>{t.label}</p>
                <p style={{
                  fontSize: 28, fontWeight: 700, color: t.color,
                  fontFamily: 'Cormorant Garamond, serif',
                  marginBottom: '0.5rem',
                }}>{t.pts}</p>
                <p style={{
                  fontSize: 13, color: 'rgba(200,160,160,0.6)',
                  fontFamily: 'Cormorant Garamond, serif',
                }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Win condition */}
          <div className="reveal reveal-delay-3" style={{
            background: 'rgba(80,0,20,0.2)',
            border: '0.5px solid rgba(200,0,40,0.3)',
            borderRadius: 4, padding: '1.5rem 2rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 18, fontStyle: 'italic',
              color: 'rgba(240,200,200,0.8)', lineHeight: 1.7,
            }}>
              Bertahanlah sampai lagu berakhir tanpa membiarkan<br />
              <span style={{ color: '#ff6680', fontWeight: 600 }}>skor menyentuh angka 0.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SONGS
      ══════════════════════════════════════ */}
      <section id="songs" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Daftar Lagu</p>
            <div className="divider" />
            <h2 className="section-title">Song Preview</h2>
          </div>

          <div className="reveal reveal-delay-1">
            <div className="song-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 4, flexShrink: 0,
                background: 'linear-gradient(135deg, #4a0015, #8b0030)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 0 20px rgba(140,0,40,0.4)',
              }}>🎤</div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 14, color: '#f5d5d8',
                  letterSpacing: '0.08em', marginBottom: 6,
                }}>Bubble Pop Electric</p>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 14, color: 'rgb(200, 140, 140)',
                  marginBottom: 10,
                }}>Gwen Stefani · Pop · 128 BPM</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, padding: '3px 10px', borderRadius: 2,
                    background: 'rgba(80,200,100,0.15)',
                    border: '0.5px solid rgba(80,200,100,0.3)',
                    color: '#88ddaa', letterSpacing: '0.1em',
                    fontFamily: 'Cinzel Decorative, serif',
                  }}>AVAILABLE</span>
                  <span style={{
                    fontSize: 10, padding: '3px 10px', borderRadius: 2,
                    background: 'rgba(180,0,40,0.15)',
                    border: '0.5px solid rgba(180,0,40,0.3)',
                    color: '#ff8098', letterSpacing: '0.1em',
                    fontFamily: 'Cinzel Decorative, serif',
                  }}>3:43</span>
                </div>
              </div>
              <button
                className="cta-btn"
                style={{ padding: '10px 24px', fontSize: 11, animation: 'none', flexShrink: 0 }}
                onClick={() => navigate('/home')}
              >▶ Play</button>
            </div>
          </div>

          <div className="reveal reveal-delay-2" style={{
            marginTop: '1rem',
            background: 'rgba(30,0,8,0.4)',
            border: '0.5px dashed rgba(180,0,40,0.2)',
            borderRadius: 4, padding: '1.25rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 14, fontStyle: 'italic',
              color: 'rgb(255, 216, 216)',
            }}>Lagu lainnya akan segera hadir...</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════ */}
      <section style={{
        padding: '6rem 2rem', textAlign: 'center',
        background: 'rgba(40,0,10,0.5)',
        borderTop: '0.5px solid rgba(180,0,40,0.15)',
        position: 'relative', zIndex: 1,
      }}>
        <div className="reveal">
          <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>⚔</div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Siap Menghadapi Tantangan?
          </h2>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 16, fontStyle: 'italic',
            color: 'rgb(220, 170, 170)',
            marginBottom: '2.5rem',
          }}>
            Buktikan kamu bisa bertahan sampai akhir lagu.
          </p>
          <button className="cta-btn" onClick={() => navigate('/home')}>
            ⚔ MULAI SEKARANG
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '0.5px solid rgba(180,0,40,0.15)',
        position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 18, color: '#f5d5d8',
            letterSpacing: '0.1em', marginBottom: '0.5rem',
            textShadow: '0 0 20px rgba(200,0,40,0.4)',
          }}>RHYTHM TAP</p>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 14, color: 'rgb(201, 150, 150)',
            marginBottom: '1.5rem',
          }}>
            Dibuat oleh <span style={{ color: '#ff8098' }}>Ozakae Corael</span>
          </p>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 13, fontStyle: 'italic',
            color: 'rgb(240, 184, 184)',
            marginBottom: '1.5rem', lineHeight: 1.7,
          }}>
            Proyek ini merupakan bagian dari tugas PKL / proyek RPL.<br />
            Jika menemukan bug, mohon dimaklumi — ini masih dalam tahap pengembangan aktif.
          </p>

          {/* Tech stack */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['React', 'Vite', 'Howler.js', 'React Router'].map(tech => (
              <span key={tech} style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 2,
                background: 'rgba(80,0,20,0.2)',
                border: '0.5px solid rgba(180,0,40,0.2)',
                color: 'rgba(200,140,140,0.5)',
                fontFamily: 'Courier New, monospace',
                letterSpacing: '0.08em',
              }}>{tech}</span>
            ))}
          </div>

          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(180,0,40,0.2), transparent)', marginBottom: '1.5rem' }} />

          <p style={{
            fontSize: 11, color: 'rgb(239, 216, 216)',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '0.08em',
          }}>
            © 2025 Ozakae Corael · Inspired by Yor Forger · Spy × Family
          </p>
        </div>
      </footer>
    </div>
  )
}