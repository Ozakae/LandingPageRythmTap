**Dokumentasi pembuatan Rythm Tap Game sederhana dengan menggunakan Claude.AI**

First prompt : "Hi, bantu aku bikin game bisa? Kamu sekarang adalah seorang senior game developer yang bisa bikin aplikasi game atau website dengan hasil yang memukau, aku ingin kamu membantu aku mengembangkan ide dan konsep game yang aku punya, kamu bisa bantu aku mengembangkannya? Gamenya bakal bikin yang simple aja dulu kok. Aku sudah punya konsepnya seperti ini :
PROYEK: RHYTHM TAP GAME (WEB-BASED MINI APP)
1. TECH STACK & ENVIRONMENT
Tolong bantu saya membangun pondasi proyek Game Ritme Musik berbasis Web dengan spesifikasi berikut:

* Backend: Laravel 12 (PHP 8.3) sebagai API Service.
* Database: MySQL (via Laragon).
* Frontend: React.js dengan Vite (Integrated in Laravel).
* UI Library: Chakra UI (untuk komponen menu, modal, dan layout).
* Audio Library: Howler.js (untuk audio latency rendah).
* Animation: CSS Transitions / Framer Motion.
2. KONSEP GAMEPLAY & MEKANIK UTAMA

* Input System: Game menggunakan 4 jalur (Lanes) dengan mapping tombol keyboard: `D`, `F`, `J`, `K`.
* Note Movement: Balok musik (Notes) jatuh dari atas ke bawah menuju "Target Zone".
* Sistem Survival Score (CORE LOGIC):
   * Pemain mulai dengan 100 Poin Gratis di awal lagu.
   * Hukuman: Jika pemain Miss (note terlewat) atau Menekan Tombol Sembarangan (saat tidak ada note), skor berkurang 10 Poin.
   * Game Over: Jika skor menyentuh angka 0, game langsung berhenti otomatis.
   * Scoring: Jika berhasil hit, skor bertambah (Perfect: +100, Good: +50).
* Difficulty: Tersedia 3 tingkat kesulitan (Easy, Normal, Hard) yang mempengaruhi jumlah note dan kecepatan jatuh.
3. STRUKTUR HALAMAN & UI/UX

* Halaman Home:
   * Judul game dengan gaya Neon/Cyberpunk.
   * Carousel/List pemilihan lagu (Genre: Phonk, Vocaloid, Vietnam/Low Cortisol, Anime, Klasik).
   * Pilihan Difficulty selector.
   * Tombol Settings (Modal) untuk: Master Volume, Note Speed, dan Key Mapping.
   * Tombol Play untuk memulai game.
* Halaman Gameplay:
   * 4 Lanes visual, Target Zone di bawah, dan indikator skor/energy (100) di atas.
   * Feedback visual (Floating text) saat Hit (Perfect/Good/Miss).
   * Efek layar bergetar merah saat skor berkurang.
* Overlay (Modal) Victory & Game Over:
   * Game Over: Muncul saat skor 0. Tombol: Home, Restart, Ganti Difficulty.
   * Victory: Muncul saat lagu selesai & skor > 0. Menampilkan Rank (S/A/B/C), Total Score, Max Combo, dan statistik akurasi.
4. STRUKTUR DATA (JSON MAPPING)
Game harus bisa membaca file JSON untuk menentukan kapan note muncul. Contoh format:
JSON

```
{
  "song_title": "Example",
  "bpm": 120,
  "notes": [
    { "time": 1000, "lane": 0 },
    { "time": 1500, "lane": 2 }
  ]
}

```

5. TUGAS PERTAMAMU

1. Bantu saya inisialisasi struktur folder di Laravel 12 yang sudah terintegrasi dengan Vite, React, dan Chakra UI.
2. Buatlah Game Engine sederhana di React yang mencakup: `RequestAnimationFrame` untuk pergerakan notes, logika deteksi input keyboard (D,F,J,K), dan sistem pengurangan skor -10 jika asal tekan.
3. Implementasikan Howler.js untuk memutar satu lagu testing.
Menurutmu bagaimana? Bisa? Ayo kita diskusikan dulu gimana enaknya sebelum mulai ngoding dan mengembangkan gamenya!"

3 hal yang aku modifikasi/tambahkan dari game Rythm Tap Game yang sudah dibuatkan Claude.AI : 
- UI (Yor Style).
- Penambahan Fitur Settings.
- Reff Video Background.