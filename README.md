# 🤖 Learning Buddy Chatbot

Learning Buddy adalah chatbot edukasi berbasis Retrieval-Augmented Generation (RAG) yang dirancang sebagai teman belajar interaktif.

Proyek ini menggabungkan kecerdasan Generative AI (via Groq) dengan akurasi data lokal menggunakan Semantic Search (FAISS), sehingga jawaban yang diberikan tidak hanya luwes (seperti manusia), tetapi juga faktual sesuai materi pembelajaran.

Dikembangkan sebagai bagian dari Capstone Project.

## 🎯 Tujuan Proyek

- Menyediakan virtual learning companion yang responsif dan cerdas.
- Mengimplementasikan arsitektur RAG untuk meminimalisir halusinasi AI.
- Memberikan jawaban yang natural menggunakan Large Language Model (LLM).
- Menyediakan akses publik ke development local menggunakan Ngrok Tunneling.

## 🧠 Teknologi yang Digunakan

### AI & Machine Learning Core

- Groq API (Inference Engine untuk LLM Llama 3 / Mixtral) - Generator Jawaban
- Sentence Transformers (Semantic Embedding) - Pemahaman Konteks
- FAISS (Vector Database) - Pencarian Cepat
- Pandas & NumPy (Data Processing)

### Backend & Infrastructure

- Python 3 (FastAPI)
- Ngrok (Secure Tunneling untuk akses publik)
- Git & GitHub
- Node.js

### Frontend

- HTML, CSS, JavaScript (React)

## ⚙ Alur Kerja Model (RAG Architecture)

Sistem tidak sekadar mencocokkan kata kunci, tetapi memahami makna dan menyusun kalimat baru.

1.  Input: User mengirim pertanyaan.
2.  Retrieval: Sistem mengubah pertanyaan jadi vektor, lalu mencari potongan materi paling relevan di FAISS.
3.  Augmentation: Pertanyaan User + Materi Relevan digabung menjadi satu Prompt.
4.  Generation: Prompt dikirim ke Groq API.
5.  Response: Groq menjawab pertanyaan user berdasarkan materi yang ditemukan.

## 🧩 Arsitektur Sistem

Menggunakan arsitektur Client–Server dengan Ngrok sebagai jembatan akses.

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

Buat file .env dan masukkan API Key Groq dan Token Ngrok:
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
NGROK_AUTH_TOKEN=xxxxxxxx_xxxxxxxxxxxxxxxx

Jalankan server:

python app.py

Backend berjalan di http://localhost:8000

### 2️⃣ Aktifkan Ngrok (Wajib)

Buka terminal baru, jalankan Ngrok sesuai port backend:

ngrok http 8000

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

## Gdrive model ML

https://drive.google.com/drive/folders/17H4xpizwjghD4T_FoyeUz_f37rUIAs4w?usp=sharing

👨‍🎓 Author
Team Capstone Learning Buddy (A25-CS185)

📄 Lisensi
Project ini dibuat untuk keperluan akademik dan pembelajaran.
