# 📖 Panduan Pengoperasian & Deployment VPS (aaPanel) - Cliperan Studio

Selamat! Aplikasi **Cliperan Studio** (Full-Stack Video Auto-Cutter & Publisher AI) Anda telah siap digunakan untuk skala produksi. Dokumentasi ini disusun untuk memandu Anda dalam menggunakan seluruh fitur cerdas secara maksimal dan memigrasikannya ke VPS (Virtual Private Server) mandiri Anda dengan kontrol panel **aaPanel**.

---

## 🎨 Bagian 1: Panduan Pengoperasian Aplikasi (Siap Pakai)

Aplikasi ini dirancang dengan arsitektur **full-stack (React SPA + Express Node.js)** yang mandiri. Berikut adalah alur kerja operasional lengkap untuk mengolah video mentah hingga menjadi konten viral siap posting:

### 1. Metode Impor Video (Upload Lokal & Tautan Link)
* **Impor Berkas Lokal:** Seret dan lepas (drag-and-drop) file video berformat `.mp4` atau `.webm` Anda ke area unggah sebelah kiri, atau klik untuk memilih file dari galeri perangkat Anda.
* **Tempel Tautan Berbagi (YouTube Link):** Anda dapat memasukkan URL video YouTube secara langsung pada input pencarian tautan, lalu klik **"Konek"** untuk memuat video secara instan.
* **Template Preset Uji Cepat:** Untuk pengujian cepat alur kerja tanpa perlu mengunggah file besar, gunakan salah satu dari 4 template video bawaan (Surfing, Memasak, Drone Hutan, Typing Code) yang beresolusi tinggi di beranda.

### 2. Deteksi Momen & Pemotongan Otomatis AI (Gemini 3.5 Flash)
* Navigasikan ke tab **"AI Highlights"** di panel kanan.
* Pilih Kategori Pemotongan (seperti *Adegan Lucu*, *Adegan Aksi/Keren*, *Adegan Baper*, dll.) atau buat kategori kustom baru dengan tombol **"+ Tambah Baru"**.
* Klik tombol **"Mulai Analisis AI"**.
* **Alur Kerja AI:** Asisten AI akan menangkap frame kunci dari video Anda, menganalisis intensitas aksi, emosi wajah, dan transisi dramatis menggunakan Gemini AI, lalu mengembalikan:
  1. **Sorotan Utama:** Rekomendasi potongan teratas dengan judul adegan, durasi, dan penjelasan alasan visual yang cerdas.
  2. **Daftar Pilihan Adegan Terbaik Lainnya:** Daftar adegan tambahan yang terdeteksi lengkap dengan rentang waktu detiknya dan skor viralitasnya.
  3. **Takarir (Caption) & Hashtag Sosial:** Rekomendasi takarir cerdas yang dirancang khusus untuk memicu algoritma fyp di media sosial.

### 3. Mengaplikasikan Hasil Potongan ke Timeline Editor
* Untuk setiap adegan yang direkomendasikan AI, Anda dapat mengeklik:
  * **"Terapkan & Putar"**: Maka timeline pemangkas (trim slider) akan otomatis terpasang pada durasi adegan tersebut, subtitle karaoke akan otomatis disinkronkan, pemutar video akan langsung berpindah ke detik awal, dan video mulai dimainkan.
  * **"Salin Caption"**: Menyalin caption viral buatan AI untuk langsung ditempel di postingan Anda.

### 4. Merancang Sampul (Thumbnail Creator)
* Pada adegan pilihan Anda, klik tombol **"Buat Thumbnail"**.
* Aplikasi akan mengarahkan Anda secara otomatis ke tab **"Thumbnail"** dan melompat ke detik pembuka adegan tersebut.
* Anda dapat menangkap frame video secara real-time, memasukkan teks kustom (mengatur ukuran, warna, letak teks), menambahkan efek filter, lalu mengunduh sampul thumbnail berkualitas tinggi tersebut sebagai file `.png`.

### 5. Pengeditan Subtitle Karaoke Dinamis & Ekspor
* Anda dapat mengubah, menambah, atau merevisi kata-kata subtitle secara manual pada panel editor teks agar sinkron dengan suara.
* Klik tab **"Ekspor"** untuk mengunduh hasil potongan video, atau simpan ke galeri lokal. Anda juga dapat mensimulasikan direct upload ke TikTok, Instagram Reels, dan YouTube Shorts atau mengantrekan jadwal publikasinya di Kalender Konten.

---

## 🖥️ Bagian 2: Panduan Deployment ke VPS Sendiri menggunakan aaPanel

Aplikasi Cliperan Studio menggunakan server Node.js tangguh yang siap dipasang pada VPS (seperti DigitalOcean, Contabo, AWS, atau Google Cloud) menggunakan kontrol panel **aaPanel**.

### 📋 Prasyarat di VPS Anda:
1. Sistem Operasi **Ubuntu 20.04 LTS** atau **Debian 11** (Sangat disarankan).
2. **aaPanel** sudah terinstal dan berjalan.
3. Melalui menu **aaPanel App Store**, instal dependensi berikut:
   * **Nginx** (Versi 1.20 ke atas)
   * **PM2 Manager** (Aplikasi Node.js process manager bawaan aaPanel)

---

### Langkah Demi Langkah Instalasi:

### Langkah 1: Unggah Source Code ke VPS
1. Kompres seluruh folder proyek Cliperan ini menjadi file `.zip` (abaikan folder `node_modules` dan `dist` jika ada karena akan di-build ulang di VPS).
2. Di aaPanel, buka menu **Files** dan masuk ke direktori webroot Anda, misalnya `/www/wwwroot/`.
3. Buat folder baru bernama `cliperan` (`/www/wwwroot/cliperan`).
4. Unggah berkas `.zip` tadi ke dalam folder tersebut lalu ekstrak.

### Langkah 2: Konfigurasi File Lingkungan (`.env`)
1. Di dalam folder `/www/wwwroot/cliperan`, temukan atau buat file bernama `.env`.
2. Masukkan variabel lingkungan Anda di sini untuk mengaktifkan Gemini AI dan fitur produksi lainnya tanpa batasan simulasi:
   ```env
   # .env
   PORT=3000
   NODE_ENV=production
   GEMINI_API_KEY=AIzaSyYourRealGeminiAPIKeyHere
   ```
   *(Ganti `AIzaSyYourRealGeminiAPIKeyHere` dengan API Key Gemini asli yang diperoleh dari Google AI Studio).*

### Langkah 3: Menginstal Dependensi & Build Aplikasi
1. Buka fitur **Terminal** bawaan aaPanel (atau hubungkan ke VPS Anda menggunakan SSH client seperti PuTTY/Terminal macOS).
2. Masuk ke direktori proyek Anda:
   ```bash
   cd /www/wwwroot/cliperan
   ```
3. Pasang seluruh dependensi aplikasi:
   ```bash
   npm install
   ```
4. Jalankan kompilasi produksi (build script):
   ```bash
   npm run build
   ```
   *Script ini akan memicu Vite untuk mengompilasi frontend React ke folder `dist/` dan memicu esbuild untuk mengompilasi server backend TypeScript menjadi satu file mandiri yang super efisien bernama `dist/server.cjs`.*

### Langkah 4: Jalankan Aplikasi Menggunakan PM2 Manager aaPanel
aaPanel menyediakan manajer PM2 berbasis grafis yang sangat memudahkan pengelolaan aplikasi Node.js agar tetap berjalan 24 jam nonstop bahkan setelah VPS reboot.

1. Buka menu **App Store** di aaPanel lalu klik untuk membuka **PM2 Manager**.
2. Klik tab **Node Version** dan pastikan versi Node.js Anda berada di versi `>= 18.x` (jika belum, pilih versi yang sesuai dan instal melalui antarmuka tersebut).
3. Klik tab **Project list** lalu klik **Add Project**.
4. Isi formulir sebagai berikut:
   * **Startup file**: Arahkan ke file `/www/wwwroot/cliperan/dist/server.cjs`.
   * **Project Name**: `cliperan-studio`.
   * **Run Port**: `3000`.
   * **Environment variable**: Tambahkan `NODE_ENV=production` dan `GEMINI_API_KEY=KUNCI_API_ANDA`.
5. Klik **Submit**. Aplikasi Node Anda sekarang berjalan dengan aman di bawah pengawasan PM2!

---

### Langkah 5: Hubungkan Domain & Konfigurasi Nginx Proxy
Untuk mengakses aplikasi menggunakan nama domain Anda sendiri (misalnya `https://cliperan.namaanda.com`), Anda perlu membuat website di aaPanel dan menyetel Nginx Reverse Proxy.

1. Buka menu **Website** di panel kiri aaPanel, lalu klik **Add Site**.
2. Masukkan nama domain Anda (misal: `cliperan.namaanda.com`).
3. Pilih **Database**: *No Database* (Karena aplikasi ini menyimpan riwayat user secara lokal di browser dan menggunakan JSON server yang terintegrasi di port 3000).
4. Klik **Submit**.
5. Setelah website dibuat, klik pada nama domain tersebut di daftar situs untuk membuka menu pengaturannya.
6. Pilih tab **Reverse Proxy** di menu sebelah kiri, lalu klik **Add Reverse Proxy**:
   * **Proxy Name**: `cliperan_proxy`
   * **Target URL**: `http://127.0.0.1:3000`
   * **Sent Domain**: `$host`
7. Klik **Save**. Sekarang, semua lalu lintas yang menuju ke domain Anda akan diteruskan secara aman ke port `3000` aplikasi Node.js.

---

### Langkah 6: Pasang SSL HTTPS Gratis (Sangat Disarankan)
Aplikasi membutuhkan koneksi HTTPS aman agar seluruh fitur browser (seperti penangkapan frame video canvas dan izin API) dapat beroperasi sempurna.

1. Masih di menu pengaturan website Anda di aaPanel, buka tab **SSL**.
2. Pilih **Let's Encrypt**.
3. Centang domain Anda dan klik **Apply**.
4. Aktifkan sakelar **Force HTTPS** di pojok kanan atas untuk mengalihkan seluruh lalu lintas HTTP biasa menjadi HTTPS yang terenkripsi aman.

**Selamat!** Aplikasi Cliperan Studio Anda kini telah online secara penuh dan siap melayani pengguna di VPS pribadi Anda! 🎉
