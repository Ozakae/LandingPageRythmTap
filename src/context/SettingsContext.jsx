import { createContext, useContext, useState } from 'react'

// ─────────────────────────────────────────────────────────────
// DATA: Daftar semua pilihan preset tombol yang tersedia
// Setiap preset berisi:
//   label   → teks tampilan di UI
//   keys    → tombol keyboard yang dideteksi (huruf kecil)
//   display → karakter yang muncul di layar game
// ─────────────────────────────────────────────────────────────
const KEY_PRESETS = {
  DFJK: {
    label:   'D F J K',
    keys:    ['d', 'f', 'j', 'k'],
    display: ['D', 'F', 'J', 'K'],
  },
  ASDF: {
    label:   'A S D F',
    keys:    ['a', 's', 'd', 'f'],
    display: ['A', 'S', 'D', 'F'],
  },
  ARROWS: {
    label:   '← ↓ ↑ →',
    keys:    ['arrowleft', 'arrowdown', 'arrowup', 'arrowright'],
    display: ['←', '↓', '↑', '→'],
  },
}

// Preset yang dipakai kalau belum ada pengaturan tersimpan
const DEFAULT_PRESET = 'DFJK'

// ─────────────────────────────────────────────────────────────
// LOCALSTORAGE: Baca & simpan pengaturan di browser
// localStorage = "memori" browser yang bertahan meski di-refresh
// try/catch = jaga-jaga kalau localStorage tidak tersedia
// ─────────────────────────────────────────────────────────────
function loadSettings() {
  try {
    const saved = localStorage.getItem('rhythmtap_settings')
    if (saved) return JSON.parse(saved) // teks → object JavaScript
  } catch {
    // Diam-diam gagal, lanjut pakai default
  }
  return { presetKey: DEFAULT_PRESET }
}

function saveSettings(settings) {
  try {
    // JSON.stringify = object JavaScript → teks (agar bisa disimpan)
    localStorage.setItem('rhythmtap_settings', JSON.stringify(settings))
  } catch {
    // Diam-diam gagal, pengaturan tidak tersimpan
  }
}

// ─────────────────────────────────────────────────────────────
// CONTEXT: "Papan pengumuman" yang bisa dibaca semua komponen
// Diisi null dulu, akan diisi oleh SettingsProvider di bawah
// ─────────────────────────────────────────────────────────────
const SettingsContext = createContext(null)

// ─────────────────────────────────────────────────────────────
// PROVIDER: Komponen pembungkus yang menyediakan data settings
// Cara pakai: bungkus komponen lain dengan <SettingsProvider>
//   → semua komponen di dalamnya bisa baca settings
// ─────────────────────────────────────────────────────────────
export function SettingsProvider({ children }) {
  // Ambil preset tersimpan sebagai nilai awal state
  const [presetKey, setPresetKey] = useState(() => loadSettings().presetKey)

  // Ganti preset aktif + langsung simpan ke localStorage
  function changePreset(key) {
    setPresetKey(key)
    saveSettings({ presetKey: key })
  }

  // Ambil data preset aktif
  // ?? = "kalau presetKey tidak ada di KEY_PRESETS, pakai DEFAULT_PRESET"
  const preset = KEY_PRESETS[presetKey] ?? KEY_PRESETS[DEFAULT_PRESET]

  // Isi "papan pengumuman" dengan data yang bisa diakses komponen lain
  return (
    <SettingsContext.Provider
      value={{
        presetKey,              // nama preset aktif,    contoh: 'DFJK'
        preset,                 // data preset aktif,    contoh: { label, keys, display }
        presets: KEY_PRESETS,   // semua preset tersedia (untuk ditampilkan di Settings)
        changePreset,           // fungsi untuk ganti preset
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────
// HOOK: Shortcut untuk membaca Context dari komponen manapun
// Cara pakai di komponen lain:
//   const { preset, changePreset } = useSettings()
// ─────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  return useContext(SettingsContext)
}