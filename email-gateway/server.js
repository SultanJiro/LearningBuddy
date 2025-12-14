require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_REPORT = process.env.EMAIL_REPORT || "admin@example.com";

// 🔥 1. MEMORY SEMENTARA (List email yg udah dapet notif)
const emailedUsers = new Set();

// --- Middleware ---
app.use(
  cors({
    origin: ["http://localhost:3000", "https://dicoding.com"], // Sesuaikan sama FE lu
    methods: ["POST"],
  })
);
app.use(express.json());

// --- Konfigurasi Nodemailer ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Email Notification Gateway is running! 🔥");
});

// --- Endpoint Reset (Optional: Kalo mau clear memory tanpa restart server) ---
app.get("/api/reset-memory", (req, res) => {
  emailedUsers.clear();
  res.send("Memory notifikasi berhasil di-reset! User lama bakal dapet notif lagi.");
});

// API Endpoint untuk Kirim Email Notifikasi
app.post("/api/send-notification", async (req, res) => {
  const { userEmail, subject, content } = req.body;

  if (!userEmail || !subject || !content) {
    return res.status(400).json({ status: "error", message: "Data kurang lengkap." });
  }

  // 🔥 2. CEK MEMORY: Email ini udah pernah dikirim belum?
  if (emailedUsers.has(userEmail)) {
    console.log(`🚫 SPAM FILTER: Email ke ${userEmail} di-skip karena sudah pernah dikirim.`);
    return res.json({
      status: "skipped",
      message: "User ini sudah mendapatkan notifikasi sebelumnya.",
    });
  }

  try {
    const mailOptions = {
      from: `"Learning Buddy Notif" <${EMAIL_USER}>`,
      to: userEmail,
      cc: EMAIL_REPORT,
      subject: `[Chatbot Notifikasi] ${subject}`,
      html: `
                <p>Halo ${userEmail},</p>
                <p>Berikut adalah notifikasi terkait sesi chat kamu:</p>
                <div style="padding: 15px; border: 1px solid #ccc;">
                    ${content}
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    // 🔥 3. SIMPAN KE MEMORY: Tandain email ini udah dikirim
    emailedUsers.add(userEmail);

    console.log(`✅ Email sent to ${userEmail}`);
    return res.json({ status: "success", message: "Notification email sent." });
  } catch (error) {
    console.error("❌ Error saat mengirim email:", error);
    return res.status(500).json({ status: "error", message: "Gagal kirim email di server.", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Email Gateway berjalan di http://localhost:${PORT}`);
});
