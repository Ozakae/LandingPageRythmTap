// ============================================================
//  LandingPage.jsx
//  Halaman pertama yang muncul saat aplikasi dibuka (path: "/")
//
//  Struktur halaman (dari atas ke bawah):
//  1. Navbar        — navigasi tetap di atas layar
//  2. Hero          — tampilan utama dengan judul besar
//  3. Features      — 4 kartu fitur unggulan
//  4. How To Play   — panduan cara bermain
//  5. Songs         — daftar lagu tersedia
//  6. CTA           — ajakan bermain terakhir
//  7. Footer        — info pembuat & tech stack
// ============================================================

import { useNavigate } from 'react-router-dom'  // untuk pindah halaman
import { useEffect, useRef } from 'react'        // hooks React
import './LandingPage.css'                        // semua styling ada di sini

// ─────────────────────────────────────────────────────────────
// DATA STATIS
// Dikeluarkan dari dalam JSX agar komponen lebih bersih.
// Kalau mau tambah fitur atau lagu baru, cukup edit di sini.
// ─────────────────────────────────────────────────────────────

// Data 4 kartu fitur (section "Fitur Utama")
const FEATURES = [
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
    desc: 'Tidak nyaman dengan D/F/J/K? Ganti ke A/S/D/F atau arrow keys. Sesuaikan kontrol dengan gaya mainmu sendiri di menu Settings.',
    delay: 'reveal-delay-4',
  },
]

// Data timing/penilaian (section "Cara Bermain")
const TIMING_RATINGS = [
  { label: 'PERFECT', color: '#aaaaff', pts: '+100', desc: 'Tepat di target zone' },
  { label: 'GOOD',    color: '#88ddaa', pts: '+50',  desc: 'Sedikit meleset' },
  { label: 'MISS',    color: '#ee6666', pts: '-10',  desc: 'Terlewat / salah tekan' },
]

// Default keys yang ditampilkan di section "Cara Bermain"
const DEFAULT_KEYS = ['D', 'F', 'J', 'K']

// Tech stack di footer
const TECH_STACK = ['React', 'Vite', 'Howler.js', 'React Router']


// ─────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  // useNavigate: fungsi untuk pindah ke halaman lain
  // contoh: navigate('/home') → pindah ke halaman Home
  const navigate  = useNavigate()

  // useRef: referensi ke elemen DOM (section hero)
  // dipakai jika nanti perlu akses langsung ke elemen tersebut
  const heroRef = useRef(null)

  // ── Scroll Reveal Effect ──────────────────────────────────
  // useEffect berjalan setelah komponen pertama kali muncul di layar.
  // IntersectionObserver = API browser untuk "mengintip" apakah
  // suatu elemen sudah masuk ke area tampilan layar atau belum.
  //
  // Cara kerjanya:
  //   1. Cari semua elemen dengan class "reveal"
  //   2. Pasang pengamat (observer) di tiap elemen
  //   3. Kalau elemen masuk layar (isIntersecting), tambahkan class "visible"
  //   4. Class "visible" di CSS akan memunculkan animasi fade-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(el => {
          // isIntersecting = true berarti elemen sudah terlihat di layar
          if (el.isIntersecting) el.target.classList.add('visible')
        })
      },
      { threshold: 0.15 } // elemen dianggap "masuk" kalau sudah 15% terlihat
    )

    // Pasang observer ke semua elemen .reveal
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // Cleanup: lepas observer saat komponen di-unmount (pindah halaman)
    // Mencegah memory leak
    return () => observer.disconnect()
  }, []) // [] = hanya jalan sekali saat komponen pertama kali muncul


  // ─────────────────────────────────────────────────────────
  // RENDER — Struktur HTML/JSX halaman
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{
      background: '#080008',
      color: '#f0e6e6',
      fontFamily: "'Georgia', serif",
      overflowX: 'hidden',
      minHeight: '100vh',
    }}>

      {/* ── Noise texture overlay ─────────────────────────
          Layer transparan di atas semua konten.
          Memberikan efek "grain/noise" seperti film lama.
          pointerEvents: none = tidak menghalangi klik user  */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }} />

      {/* ── Lingkaran cahaya dekoratif (background) ───────
          Dua bulatan blur merah di pojok layar sebagai hiasan.
          position: fixed = selalu ikut layar saat scroll        */}
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


      {/* ══════════════════════════════════════════════════
          1. NAVBAR
          Navigasi yang "nempel" di atas layar (position: fixed).
          backdropFilter: blur = efek kaca buram di belakang navbar.
          Tombol scroll menggunakan scrollIntoView() untuk
          lompat ke section tertentu tanpa reload halaman.
      ══════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 3rem',
        background: 'rgba(8,0,8,0.85)',
        borderBottom: '0.5px solid rgba(180,0,40,0.2)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo teks dengan efek kedip */}
        <div style={{
          fontFamily: 'Cinzel Decorative, serif',
          fontSize: 16, fontWeight: 900, color: '#f5d5d8',
          letterSpacing: '0.1em',
          textShadow: '0 0 20px rgba(200,0,40,0.5)',
          animation: 'flicker 8s infinite',
        }}>
          RHYTHM TAP
        </div>

        {/* Tombol navigasi — scroll ke section yang dituju */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Fitur
          </button>
          <button className="nav-link" onClick={() => document.getElementById('howtoplay')?.scrollIntoView({ behavior: 'smooth' })}>
            Cara Main
          </button>
          <button className="nav-link" onClick={() => document.getElementById('songs')?.scrollIntoView({ behavior: 'smooth' })}>
            Lagu
          </button>
          {/* Tombol CTA kecil di navbar */}
          <button
            className="cta-btn"
            style={{ padding: '10px 24px', fontSize: 11, animation: 'none' }}
            onClick={() => navigate('/home')}
          >
            Play Now
          </button>
        </div>
      </nav>


      {/* ══════════════════════════════════════════════════
          2. HERO SECTION
          Bagian pertama yang dilihat user. Berisi logo,
          judul besar, tagline, dan tombol utama.
          Semua elemen pakai animasi "rise" (muncul dari bawah)
          dengan delay berbeda supaya terasa berurutan.
      ══════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        {/* Logo mengambang */}
        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: 80, height: 80, objectFit: 'contain',
            marginBottom: '1.5rem',
            animation: 'float 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(200,0,40,0.6))',
          }}
        />

        {/* Label kecil */}
        <p className="section-label" style={{ marginBottom: '1rem', animation: 'rise 1s ease both 0.2s' }}>
          — Web Rhythm Game —
        </p>

        {/* Judul utama */}
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

        {/* Tagline */}
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
          fontSize: 14, color: 'rgb(251, 189, 189)',
          marginBottom: '3rem', letterSpacing: '0.08em',
          animation: 'rise 1s ease both 0.7s',
        }}>
          Setiap miss adalah langkah menuju kekalahan
        </p>

        {/* Tombol CTA utama */}
        <button
          className="cta-btn"
          onClick={() => navigate('/home')}
          style={{ animation: 'rise 1s ease both 0.85s, pulse-glow 2.5s ease-in-out infinite 0.85s' }}
        >
          ⚔ MAIN SEKARANG
        </button>

        {/* Petunjuk scroll ke bawah */}
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


      {/* ══════════════════════════════════════════════════
          3. FEATURES SECTION
          4 kartu fitur. Data diambil dari array FEATURES
          di atas menggunakan .map() agar tidak repetitif.
          id="features" dipakai oleh tombol navbar untuk scroll.
      ══════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          {/* Header section */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Yang Membuat Kami Beda</p>
            <div className="divider" />
            <h2 className="section-title">Fitur Utama</h2>
          </div>

          {/* Grid 4 kartu — otomatis wrap kalau layar sempit */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* .map() = ulang untuk setiap item di array FEATURES */}
            {FEATURES.map((feature, index) => (
              <div key={index} className={`feature-card reveal ${feature.delay}`}>
                <div style={{ fontSize: 36, marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 14, fontWeight: 700,
                  color: '#f5d5d8', letterSpacing: '0.08em',
                  marginBottom: '0.75rem',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 15, lineHeight: 1.75,
                  color: 'rgba(220,180,180,0.7)',
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          4. HOW TO PLAY SECTION
          Berisi: mapping tombol default, sistem penilaian,
          dan kondisi menang/kalah.
      ══════════════════════════════════════════════════ */}
      <section id="howtoplay" style={{
        padding: '6rem 2rem',
        background: 'rgba(40,0,10,0.4)',
        borderTop: '0.5px solid rgba(180,0,40,0.15)',
        borderBottom: '0.5px solid rgba(180,0,40,0.15)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Header section */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Panduan Pemain</p>
            <div className="divider" />
            <h2 className="section-title">Cara Bermain</h2>
          </div>

          {/* Key mapping — tampilkan tombol D, F, J, K */}
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
            }}>
              DEFAULT KEY MAPPING
            </p>

            {/* Tampilkan badge tiap tombol dari array DEFAULT_KEYS */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap',
            }}>
              {DEFAULT_KEYS.map((key, index) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div className="key-badge">{key}</div>
                  <div style={{ fontSize: 10, color: 'rgba(200,140,140,0.5)', marginTop: 6, letterSpacing: '0.1em' }}>
                    Lane {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              textAlign: 'center', fontFamily: 'Cormorant Garamond, serif',
              fontSize: 13, color: 'rgb(255, 230, 230)', fontStyle: 'italic',
            }}>
              Dapat diubah ke A/S/D/F atau Arrow Keys melalui Settings
            </p>
          </div>

          {/* Sistem penilaian — PERFECT / GOOD / MISS */}
          <div className="reveal reveal-delay-2" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginBottom: '2rem',
          }}>
            {TIMING_RATINGS.map(rating => (
              <div key={rating.label} style={{
                background: 'rgba(60,0,15,0.3)',
                border: `0.5px solid ${rating.color}33`, /* 33 = 20% opacity dalam hex */
                borderRadius: 4, padding: '1.25rem',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 13, color: rating.color,
                  letterSpacing: '0.15em', marginBottom: '0.5rem',
                }}>
                  {rating.label}
                </p>
                <p style={{
                  fontSize: 28, fontWeight: 700, color: rating.color,
                  fontFamily: 'Cormorant Garamond, serif',
                  marginBottom: '0.5rem',
                }}>
                  {rating.pts}
                </p>
                <p style={{ fontSize: 13, color: 'rgba(200,160,160,0.6)', fontFamily: 'Cormorant Garamond, serif' }}>
                  {rating.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Kondisi menang */}
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


      {/* ══════════════════════════════════════════════════
          5. SONGS SECTION
          Preview lagu yang tersedia. Saat ini baru 1 lagu.
      ══════════════════════════════════════════════════ */}
      <section id="songs" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Header section */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p className="section-label">Daftar Lagu</p>
            <div className="divider" />
            <h2 className="section-title">Song Preview</h2>
          </div>

          {/* Kartu lagu tersedia */}
          <div className="reveal reveal-delay-1">
            <div className="song-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Thumbnail lagu */}
              <div style={{
                width: 72, height: 72, borderRadius: 4, flexShrink: 0,
                background: 'linear-gradient(135deg, #4a0015, #8b0030)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, boxShadow: '0 0 20px rgba(140,0,40,0.4)',
              }}>
                🎤
              </div>

              {/* Info lagu */}
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: 'Cinzel Decorative, serif',
                  fontSize: 14, color: '#f5d5d8',
                  letterSpacing: '0.08em', marginBottom: 6,
                }}>
                  Bubble Pop Electric
                </p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'rgb(200, 140, 140)', marginBottom: 10 }}>
                  Gwen Stefani · Pop · 128 BPM
                </p>
                {/* Badge status & durasi */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, padding: '3px 10px', borderRadius: 2,
                    background: 'rgba(80,200,100,0.15)', border: '0.5px solid rgba(80,200,100,0.3)',
                    color: '#88ddaa', letterSpacing: '0.1em', fontFamily: 'Cinzel Decorative, serif',
                  }}>AVAILABLE</span>
                  <span style={{
                    fontSize: 10, padding: '3px 10px', borderRadius: 2,
                    background: 'rgba(180,0,40,0.15)', border: '0.5px solid rgba(180,0,40,0.3)',
                    color: '#ff8098', letterSpacing: '0.1em', fontFamily: 'Cinzel Decorative, serif',
                  }}>3:43</span>
                </div>
              </div>

              {/* Tombol play */}
              <button
                className="cta-btn"
                style={{ padding: '10px 24px', fontSize: 11, animation: 'none', flexShrink: 0 }}
                onClick={() => navigate('/home')}
              >
                ▶ Play
              </button>
            </div>
          </div>

          {/* Placeholder lagu berikutnya */}
          <div className="reveal reveal-delay-2" style={{
            marginTop: '1rem',
            background: 'rgba(30,0,8,0.4)',
            border: '0.5px dashed rgba(180,0,40,0.2)',
            borderRadius: 4, padding: '1.25rem',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontStyle: 'italic', color: 'rgb(255, 216, 216)' }}>
              Lagu lainnya akan segera hadir...
            </p>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          6. CTA SECTION
          Ajakan bermain terakhir sebelum footer.
      ══════════════════════════════════════════════════ */}
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


      {/* ══════════════════════════════════════════════════
          7. FOOTER
          Info pembuat dan tech stack yang digunakan.
      ══════════════════════════════════════════════════ */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '0.5px solid rgba(180,0,40,0.15)',
        position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Nama game */}
          <p style={{
            fontFamily: 'Cinzel Decorative, serif',
            fontSize: 18, color: '#f5d5d8',
            letterSpacing: '0.1em', marginBottom: '0.5rem',
            textShadow: '0 0 20px rgba(200,0,40,0.4)',
          }}>
            RHYTHM TAP
          </p>

          {/* Nama pembuat */}
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'rgb(201, 150, 150)', marginBottom: '1.5rem' }}>
            Dibuat oleh <span style={{ color: '#ff8098' }}>Ozakae Corael</span>
          </p>

          {/* Keterangan proyek */}
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 13, fontStyle: 'italic',
            color: 'rgb(240, 184, 184)',
            marginBottom: '1.5rem', lineHeight: 1.7,
          }}>
            Proyek ini merupakan bagian dari tugas PKL / proyek RPL.<br />
            Jika menemukan bug, mohon dimaklumi — ini masih dalam tahap pengembangan aktif.
          </p>

          {/* Badge tech stack — diambil dari array TECH_STACK */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {TECH_STACK.map(tech => (
              <span key={tech} style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 2,
                background: 'rgba(80,0,20,0.2)',
                border: '0.5px solid rgba(180,0,40,0.2)',
                color: 'rgba(200,140,140,0.5)',
                fontFamily: 'Courier New, monospace',
                letterSpacing: '0.08em',
              }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Garis pemisah */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(180,0,40,0.2), transparent)', marginBottom: '1.5rem' }} />

          {/* Copyright */}
          <p style={{ fontSize: 11, color: 'rgb(239, 216, 216)', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.08em' }}>
            © 2025 Ozakae Corael · Inspired by Yor Forger · Spy × Family
          </p>
        </div>
      </footer>

    </div>
  )
}