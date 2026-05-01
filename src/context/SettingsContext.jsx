import { createContext, useContext, useState } from 'react'

const KEY_PRESETS = {
  DFJK:   { label: 'D F J K', keys: ['d', 'f', 'j', 'k'], display: ['D', 'F', 'J', 'K'] },
  ASDF:   { label: 'A S D F', keys: ['a', 's', 'd', 'f'], display: ['A', 'S', 'D', 'F'] },
  ARROWS: { label: '← ↓ ↑ →', keys: ['arrowleft', 'arrowdown', 'arrowup', 'arrowright'], display: ['←', '↓', '↑', '→'] },
}

const DEFAULT_PRESET = 'DFJK'

function loadSettings() {
  try {
    const saved = localStorage.getItem('rhythmtap_settings')
    if (saved) return JSON.parse(saved)
  } catch {// intentionally empty
}
  return { presetKey: DEFAULT_PRESET }
}

function saveSettings(settings) {
  try {
    localStorage.setItem('rhythmtap_settings', JSON.stringify(settings))
  } catch {// intentionally empty
    }
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [presetKey, setPresetKey] = useState(() => loadSettings().presetKey)

  function changePreset(key) {
    setPresetKey(key)
    saveSettings({ presetKey: key })
  }

  const preset = KEY_PRESETS[presetKey] ?? KEY_PRESETS[DEFAULT_PRESET]

  return (
    <SettingsContext.Provider value={{ presetKey, preset, presets: KEY_PRESETS, changePreset }}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  return useContext(SettingsContext)
}