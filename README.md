# 🤖 Learning Buddy Chatbot

_Learning Buddy_ adalah chatbot edukasi berbasis _Retrieval-Augmented Generation (RAG)_ yang dirancang sebagai teman belajar interaktif.

Proyek ini menggabungkan kecerdasan _Generative AI (via Groq)_ dengan akurasi data lokal menggunakan _Semantic Search (FAISS)_, sehingga jawaban yang diberikan tidak hanya luwes (seperti manusia), tetapi juga faktual sesuai materi pembelajaran.

Dikembangkan sebagai bagian dari _Capstone Project_.

## 🎯 Tujuan Proyek

- Menyediakan virtual learning companion yang responsif dan cerdas.
- Mengimplementasikan arsitektur _RAG_ untuk meminimalisir halusinasi AI.
- Memberikan jawaban yang natural menggunakan _Large Language Model (LLM)_.
- Menyediakan akses publik ke development local menggunakan _Ngrok Tunneling_.

## 🧠 Teknologi yang Digunakan

### AI & Machine Learning Core

- _Groq API_ (Inference Engine untuk LLM Llama 3 / Mixtral) - Generator Jawaban
- _Sentence Transformers_ (Semantic Embedding) - Pemahaman Konteks
- _FAISS_ (Vector Database) - Pencarian Cepat
- _Pandas & NumPy_ (Data Processing)

### Backend & Infrastructure

- _Python 3_ (FastAPI)
- _Ngrok_ (Secure Tunneling untuk akses publik)
- _Git & GitHub_

### Frontend

- HTML, CSS, JavaScript (React)

## ⚙ Alur Kerja Model (RAG Architecture)

Sistem tidak sekadar mencocokkan kata kunci, tetapi memahami makna dan menyusun kalimat baru.

1.  _Input:_ User mengirim pertanyaan.
2.  _Retrieval:_ Sistem mengubah pertanyaan jadi vektor, lalu mencari potongan materi paling relevan di _FAISS_.
3.  _Augmentation:_ Pertanyaan User + Materi Relevan digabung menjadi satu Prompt.
4.  _Generation:_ Prompt dikirim ke _Groq API_.
5.  _Response:_ Groq menjawab pertanyaan user berdasarkan materi yang ditemukan.

## 🧩 Arsitektur Sistem

Menggunakan arsitektur _Client–Server_ dengan _Ngrok_ sebagai jembatan akses.

User (Browser)
⬇
🌐 Internet
⬇
🚇 Ngrok Tunnel ([https://xxxx.ngrok-free.app](https://xxxx.ngrok-free.app))
⬇
💻 Backend Server (Localhost)
⬇ ➡ (Cari Data) ➡ 🗄 FAISS
⬇ ⬅ (Dapat Konteks) ⬅
🧠 Groq API (Cloud LLM)
⬇
💬 Jawaban Final ke User

🚀 Cara Menjalankan Aplikasi

### 1️⃣ Setup Backend

Masuk ke folder backend dan install dependencies:

cd backend
pip install -r requirements.txt

Buat file .env dan masukkan API Key Groq:
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx

Jalankan server:

python app.py

Backend berjalan di http://localhost:5000 (atau port 8000 jika FastAPI).

### 2️⃣ Aktifkan Ngrok (Wajib)

Buka terminal baru, jalankan Ngrok sesuai port backend:

ngrok http 5000

Copy URL yang muncul (contoh: https://abcd-123.ngrok-free.app).

### 3️⃣ Setup Frontend

1. buka folder project
2. buka terminal vscode
3. ketik npm install
4. lalu npm start

### 4️⃣ Mulai Chat

Buka file frontend/index.html di browser, dan Learning Buddy siap digunakan!

📌 Catatan Penting

1. Groq & Internet: Chatbot membutuhkan koneksi internet stabil untuk menghubungi API Groq.
2. Ngrok Session: URL Ngrok versi gratis akan berubah setiap kali dimatikan. Pastikan update URL di frontend setiap menjalankan ulang.
3. Batas Konteks: Jawaban AI dibatasi oleh informasi yang ada dalam dataset pembelajaran.

👨‍🎓 Author
Team Capstone Learning Buddy (A25-CS185)

📄 Lisensi
Project ini dibuat untuk keperluan akademik dan pembelajaran.
