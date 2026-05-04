// ============================================================
//  SettingsModal.jsx
//  Popup pengaturan key mapping (path: tampil di atas Home)
//
//  Komponen ini menerima PROPS dari Home.jsx:
//    onClose → fungsi yang dipanggil untuk menutup modal
//
//  Komponen ini membaca & mengubah CONTEXT dari SettingsContext:
//    presetKey    → nama preset yang sedang aktif (contoh: 'DFJK')
//    presets      → semua preset yang tersedia
//    changePreset → fungsi untuk ganti preset
//
//  Struktur tampilan :
//  1. Overlay       — latar gelap di belakang modal (klik = tutup)
//  2. Modal Box     — kotak popup putih
//     2a. Header    — judul + tombol X
//     2b. Body      — daftar preset kartu + tombol Tutup
//     2c. Accent    — garis merah dekoratif di bawah
// ============================================================

import { useSettings } from '../context/SettingsContext'
import './SettingsModal.css'


export default function SettingsModal({ onClose }) {
  // Ambil data dari SettingsContext:
  //   presetKey    → preset yang aktif sekarang, contoh: 'DFJK'
  //   presets      → semua preset: { DFJK: {...}, ASDF: {...}, ARROWS: {...} }
  //   changePreset → fungsi untuk ganti preset + simpan ke localStorage
  const { presetKey, presets, changePreset } = useSettings()


  return (
    // ══════════════════════════════════════════════════
    // 1. OVERLAY (Latar Gelap)
    // Menutupi seluruh layar di belakang modal.
    //   position: fixed = selalu di atas semua konten
    //   inset: 0        = mengisi penuh (top/right/bottom/left = 0)
    //   zIndex: 200     = lebih tinggi dari navbar (z:100) agar di atas
    //   backdropFilter  = efek blur di belakang overlay
    //
    // Klik overlay (bukan modal) → tutup modal:
    //   e.target         = elemen yang diklik
    //   e.currentTarget  = elemen yang punya event listener ini (overlay)
    //   kalau keduanya sama = user klik di luar modal → onClose()
    // ══════════════════════════════════════════════════
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(4,0,4,0.88)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >

      {/* ══════════════════════════════════════════════════
          2. MODAL BOX
          Kotak putih di tengah layar.
          min(480px, 92vw) = max lebar 480px, di HP max 92% layar.
          Animasi modal-rise = muncul dengan efek spring dari bawah.
          overflow: hidden = sudut melengkung tidak terpotong isi
      ══════════════════════════════════════════════════ */}
      <div style={{
        width: 'min(480px, 92vw)',
        background: '#0e000e',
        border: '0.5px solid rgba(180,0,40,0.35)',
        borderRadius: 3,
        overflow: 'hidden',
        animation: 'modal-rise 0.35s cubic-bezier(0.175,0.885,0.32,1.1) both',
      }}>

        {/* ── 2a. HEADER ──────────────────────────────────
            Berisi label kecil, judul "Settings", dan tombol X.
            justifyContent: space-between = label di kiri, X di kanan */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '0.5px solid rgba(180,0,40,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(40,0,10,0.5)',
        }}>
          {/* Kiri: label + judul */}
          <div>
            <p style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 9, color: '#cc0035',
              letterSpacing: '0.3em', marginBottom: 5,
            }}>
              RHYTHM TAP
            </p>
            <h2 style={{
              fontFamily: 'Cinzel Decorative, serif',
              fontSize: 18, color: '#f5d5d8',
              fontWeight: 700, letterSpacing: '0.08em',
            }}>
              Settings
            </h2>
          </div>

          {/* Kanan: tombol X untuk tutup modal */}
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
          >
            ✕
          </button>
        </div>


        {/* ── 2b. BODY ────────────────────────────────────
            Isi utama modal: daftar preset + tombol Tutup */}
        <div style={{ padding: '1.75rem' }}>

          {/* Section: Key Mapping */}
          <div style={{ marginBottom: '2rem' }}>

            {/* Judul section dengan garis di kiri & kanan */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(180,0,40,0.15)' }} />
              <p style={{
                fontFamily: 'Cinzel Decorative, serif',
                fontSize: 9, color: '#cc0035',
                letterSpacing: '0.25em', whiteSpace: 'nowrap',
              }}>
                KEY MAPPING
              </p>
              <div style={{ flex: 1, height: 1, background: 'rgba(180,0,40,0.15)' }} />
            </div>

            {/* ── Daftar Preset ──────────────────────────
                Object.entries(presets) mengubah object menjadi array:
                { DFJK: {...}, ASDF: {...} }
                  → [['DFJK', {...}], ['ASDF', {...}], ...]

                Lalu di-map menjadi kartu pilihan.
                isActive = true kalau preset ini yang sedang dipilih.

                Setiap kartu:
                - Kiri  : badge tiap tombol keyboard
                - Kanan : label preset + titik merah (kalau aktif)
            ─────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(presets).map(([key, preset]) => {
                // isActive: true kalau preset ini = preset yang sedang aktif
                const isActive = presetKey === key

                return (
                  <div
                    key={key}
                    className="preset-card"
                    onClick={() => changePreset(key)} /* klik = ganti preset */
                    style={{
                      border: `0.5px solid ${isActive ? 'rgba(200,0,40,0.55)' : 'rgba(180,0,40,0.2)'}`,
                      background: isActive ? 'rgba(100,0,25,0.2)' : 'rgba(40,0,10,0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                      {/* Kiri: badge tiap tombol di preset ini */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {preset.display.map((k, i) => (
                          <div key={i} style={{
                            width: 38, height: 38,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isActive ? 'rgba(140,0,35,0.35)' : 'rgba(60,0,15,0.3)',
                            border: `1px solid ${isActive ? 'rgba(200,0,40,0.5)' : 'rgba(180,0,40,0.2)'}`,
                            borderRadius: 4,
                            fontFamily: 'Courier New, monospace',
                            /* Kalau teks > 1 karakter (misal: '←'), kecilkan font */
                            fontSize: k.length > 1 ? 14 : 16,
                            fontWeight: 700,
                            color: isActive ? '#ff8098' : 'rgba(180,80,100,0.5)',
                            boxShadow: isActive ? '0 0 10px rgba(200,0,40,0.2)' : 'none',
                            transition: 'all 0.2s',
                          }}>
                            {k}
                          </div>
                        ))}
                      </div>

                      {/* Kanan: label preset + indikator aktif */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Label teks preset, contoh: "D F J K" */}
                        <p style={{
                          fontFamily: 'Cormorant Garamond, serif',
                          fontSize: 13, fontStyle: 'italic',
                          color: isActive ? 'rgba(220,170,170,0.7)' : 'rgba(180,100,100,0.3)',
                          transition: 'color 0.2s',
                        }}>
                          {preset.label}
                        </p>

                        {/* Titik merah — hanya muncul kalau preset ini aktif
                            isActive && <...> = render hanya kalau isActive true */}
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

            {/* Teks keterangan di bawah daftar preset */}
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 12, fontStyle: 'italic',
              color: 'rgb(255, 212, 212)',
              marginTop: '1rem', textAlign: 'center',
            }}>
              Klik preset untuk mengubah key mapping · Tersimpan otomatis
            </p>
          </div>

          {/* Tombol Tutup di tengah bawah */}
          <div style={{ textAlign: 'center' }}>
            <button className="close-btn" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>


        {/* ── 2c. ACCENT LINE ─────────────────────────────
            Garis merah tipis dekoratif di paling bawah modal.
            Murni visual, tidak ada fungsi interaktif. */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent, #cc0035, transparent)',
        }} />

      </div>
    </div>
  )
}