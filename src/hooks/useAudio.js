import { useRef, useCallback, useEffect } from 'react'
import { Howl } from 'howler'

export function useAudio(src) {
  const howlRef = useRef(null)

  // Inisialisasi Howl langsung saat hook pertama kali dibuat
  useEffect(() => {
    howlRef.current = new Howl({
      src: [src],
      format: ['mp3', 'mp4', 'ogg', 'webm'],
      html5: true,
      onloaderror: (id, err) => console.error('❌ load error:', id, err),
      onplayerror: (id, err) => console.error('❌ play error:', id, err),
    })

    return () => {
      howlRef.current?.unload()
      howlRef.current = null
    }
  }, [src])

  const play = useCallback(() => howlRef.current?.play(), [])
  const pause = useCallback(() => howlRef.current?.pause(), [])
  const stop = useCallback(() => { howlRef.current?.stop() }, [])
  const seek = useCallback((sec) => howlRef.current?.seek(sec), [])
  const getCurrentMs = useCallback(() => {
    if (!howlRef.current) return 0
    return howlRef.current.seek() * 1000
  }, [])
  const setVolume = useCallback((vol) => howlRef.current?.volume(vol), [])
  const unload = useCallback(() => {
    howlRef.current?.unload()
    howlRef.current = null
  }, [])

  // load() sekarang tidak perlu buat Howl baru, cukup reset posisi
  const load = useCallback((onReady) => {
    howlRef.current?.stop()
    howlRef.current?.seek(0)
    if (onReady) onReady()
  }, [])

  return { load, play, pause, stop, seek, getCurrentMs, setVolume, unload }
}