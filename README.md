# ✨ Whispr - Anonymous Messages

**Whispr** adalah platform pesan anonim modern berbasis Web yang dirancang sebagai alternatif yang jauh lebih canggih, interaktif, dan premium dibandingkan aplikasi Q&A anonim tradisional. Dikembangkan oleh **SukaCoding**, aplikasi ini memanfaatkan antarmuka *3D Claymorphism* dipadukan dengan *Glassmorphism* untuk memberikan pengalaman pengguna tingkat tinggi.

Aplikasi ini sepenuhnya *serverless* di sisi backend, dibangun menggunakan Vanilla JavaScript (ES6+), HTML5, CSS3 murni, dan ditenagai oleh **Firebase Firestore Database** untuk komunikasi *real-time*.

## 🚀 Fitur Unggulan (Unique Selling Points)

Berbeda dengan aplikasi sejenis, Whispr menghadirkan berbagai fitur interaktif bergaya *gamifikasi*:

- 🎨 **Desain UI/UX Premium:** Animasi dinamis, palet warna *vibrant*, dan transisi yang sangat halus.
- 🎯 **Pemilihan Topik Diskusi:** Pembuat link dapat memilih topik (misal: "Roast Aku", "Kasih Feedback", dll). Mengganti topik akan otomatis mereset *Inbox* dan membuat link lama menjadi *invalid* (kadaluwarsa).
- 🎲 **Fitur "Bantu Aku Tanya" (Dice Roll):** Pengirim yang bingung mau menulis apa bisa memutar dadu secara acak untuk mendapatkan rekomendasi pertanyaan instan.
- 💖 **Mood / Vibe Check:** Pengirim dapat menyisipkan reaksi emosional (emoji) sebelum mengirim pesan, yang akan ditampilkan secara estetik di kotak masuk.
- 📸 **Native Share ke IG Story:** Pembuat link dapat langsung membagikan pesan yang diterima ke Instagram Story dengan latar belakang kustom (via API Web Share dan `html2canvas`).
- 🎵 **Tema Dinamis & Musik Latar:** Setiap topik yang dipilih akan merubah skema warna utama *(theme injection)* dan memutar instrumen musik yang sesuai *(royalty-free)*.
- 📱 **QR Code Otomatis:** Fitur langsung menghasilkan *barcode* untuk dibagikan secara fisik.

## 🛠️ Teknologi yang Digunakan
- **Frontend:** HTML5, Vanilla CSS3 (Custom Properties/Variabel), Vanilla JavaScript (Moduler).
- **Backend/Database:** Firebase Cloud Firestore (NoSQL).
- **Librari Tambahan:** 
  - `html2canvas` (Untuk rendering pesan ke IG Story Export)
  - API QR Code Generator

## ⚙️ Panduan Instalasi (Setup Guide)

Aplikasi ini sangat mudah dijalankan karena murni berada di sisi klien (*Client-side*).

1. **Clone/Download Repository ini.**
2. **Setup Firebase:**
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/).
   - Aktifkan **Firestore Database**.
   - Tambahkan aplikasi Web di pengaturan Firebase untuk mendapatkan `firebaseConfig`.
3. **Konfigurasi Database:**
   - Buka file `js/firebase-config.js`.
   - Ganti objek `firebaseConfig` dengan konfigurasi asli dari project Anda.
4. **Keamanan Database (PENTING!):**
   - Di Firebase Console, masuk ke tab **Rules** pada Firestore Database.
   - *Copy* dan terapkan *Security Rules* berikut untuk mengamankan data pengguna:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{username} {
      allow read: if true;
      allow write: if request.resource.data.activeTopic is string && request.resource.data.activeTopic.size() <= 50;
    }
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.resource.data.to is string && request.resource.data.text is string && request.resource.data.text.size() > 0 && request.resource.data.text.size() <= 1000;
      allow delete: if true; 
      allow update: if false; 
    }
  }
}
```

5. **Jalankan Aplikasi:**
   - Anda dapat menggunakan ekstensi VSCode seperti **Live Server** atau men-deploy-nya ke layanan hosting gratis seperti Vercel, Netlify, atau GitHub Pages.

## 📜 Hak Cipta & Lisensi
&copy; 2026 Whispr - All rights reserved. 
**Developed by [SukaCoding](https://sukacoding.com)**

Aplikasi ini merupakan produk *closed-source* (atau dapat disesuaikan bergantung pada model lisensi SukaCoding). Jangan menyalin atau mendistribusikan tanpa izin tertulis.
