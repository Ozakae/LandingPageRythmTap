// ============================================================
//  useAudio.js
//  Custom Hook untuk mengontrol audio menggunakan Howler.js
//
//  Cara pakai di komponen lain:
//    const { play, pause, stop, seek, getCurrentMs } = useAudio('/songs/lagu.mp3')
//
//  Fungsi yang tersedia:
//    load(onReady)  → reset audio ke posisi awal, lalu jalankan callback
//    play()         → mulai/lanjutkan pemutaran
//    pause()        → jeda pemutaran (posisi tersimpan)
//    stop()         → hentikan + kembali ke awal
//    seek(sec)      → lompat ke detik tertentu
//    getCurrentMs() → ambil posisi saat ini dalam milidetik
//    setVolume(vol) → atur volume (0.0 = bisu, 1.0 = penuh)
//    unload()       → bebaskan memori audio sepenuhnya
// ============================================================

import { useRef, useCallback, useEffect } from 'react'
import { Howl } from 'howler'


// ─────────────────────────────────────────────────────────────
// PARAMETER:
//   src → path ke file audio, contoh: '/songs/bubble-pop.mp3'
//         dikirim dari GameEngine.jsx saat hook ini dipakai
// ─────────────────────────────────────────────────────────────
export function useAudio(src) {

  // useRef menyimpan instance Howl (objek audio aktif).
  // Kenapa useRef, bukan useState?
  //   → Karena kita tidak ingin komponen re-render
  //     setiap kali nilai howlRef berubah.
  //   → useRef = "kotak penyimpanan" yang nilainya bisa
  //     diubah tanpa memicu render ulang.
  const howlRef = useRef(null)


  // ── Inisialisasi Howl ──────────────────────────────────────
  // useEffect dengan [src] = jalankan ulang kalau src berubah.
  // Membuat instance Howl baru setiap kali lagu berganti.
  useEffect(() => {
    howlRef.current = new Howl({
      src:    [src],                          // path file audio
      format: ['mp3', 'mp4', 'ogg', 'webm'], // format yang dicoba secara berurutan
      html5:  true,                           // pakai HTML5 Audio (lebih stabil di browser)

      // Callback kalau file gagal di-load (misal: file tidak ada)
      onloaderror: (id, err) => console.error('❌ load error:', id, err),

      // Callback kalau audio gagal diputar (misal: browser blokir autoplay)
      onplayerror: (id, err) => console.error('❌ play error:', id, err),
    })

    // Cleanup function — dipanggil saat:
    //   1. Komponen yang pakai hook ini di-unmount (pindah halaman)
    //   2. src berubah (sebelum Howl baru dibuat)
    // Tujuan: bebaskan memori & hentikan audio yang sedang berjalan
    return () => {
      howlRef.current?.unload() // ?.  = hanya jalankan kalau howlRef.current tidak null
      howlRef.current = null
    }
  }, [src]) // [src] = dependency array — re-run kalau src berubah


  // ── Fungsi-fungsi Kontrol Audio ────────────────────────────
  // Semua dibungkus useCallback agar fungsi ini tidak dibuat ulang
  // setiap kali komponen re-render (optimasi performa).
  // [] = dependency kosong = fungsi ini tidak pernah berubah.

  // Mulai/lanjutkan pemutaran audio
  const play = useCallback(
    () => howlRef.current?.play(),
  [])

  // Jeda pemutaran (posisi audio tersimpan, bisa dilanjutkan)
  const pause = useCallback(
    () => howlRef.current?.pause(),
  [])

  // Hentikan pemutaran + kembalikan posisi ke awal (detik 0)
  const stop = useCallback(
    () => howlRef.current?.stop(),
  [])

  // Lompat ke posisi tertentu
  // Parameter: sec = posisi dalam DETIK, contoh: seek(30) = lompat ke detik ke-30
  const seek = useCallback(
    (sec) => howlRef.current?.seek(sec),
  [])

  // Ambil posisi audio saat ini dalam MILIDETIK
  // Kenapa milidetik? Karena beatmap butuh presisi tinggi (misal: 1523ms)
  // .seek() tanpa argumen = GETTER (baca posisi sekarang dalam detik)
  // .seek() dengan argumen = SETTER (pindah ke posisi tertentu)
  // Lalu dikali 1000 untuk konversi detik → milidetik
  const getCurrentMs = useCallback(() => {
    if (!howlRef.current) return 0
    return howlRef.current.seek() * 1000
  }, [])

  // Atur volume audio
  // Parameter: vol = angka 0.0 sampai 1.0
  //   0.0 = bisu total
  //   0.5 = setengah volume
  //   1.0 = volume penuh
  const setVolume = useCallback(
    (vol) => howlRef.current?.volume(vol),
  [])

  // Bebaskan memori audio sepenuhnya
  // Berbeda dengan stop() — unload() menghapus data audio dari RAM
  const unload = useCallback(() => {
    howlRef.current?.unload()
    howlRef.current = null
  }, [])

  // Reset audio ke posisi awal + jalankan callback opsional
  // Parameter: onReady = fungsi yang dijalankan setelah reset selesai
  // Contoh pakai: load(() => console.log('siap main!'))
  const load = useCallback((onReady) => {
    howlRef.current?.stop()   // hentikan kalau sedang jalan
    howlRef.current?.seek(0)  // kembalikan ke detik 0
    if (onReady) onReady()    // jalankan callback kalau ada
  }, [])


  // ── Return ─────────────────────────────────────────────────
  // Semua fungsi dikembalikan sebagai object.
  // Komponen yang pakai hook ini bisa destructure sesuai kebutuhan:
  //   const { play, pause, getCurrentMs } = useAudio(src)
  return { load, play, pause, stop, seek, getCurrentMs, setVolume, unload }
}