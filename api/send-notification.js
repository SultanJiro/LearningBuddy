import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_REPORT = process.env.EMAIL_REPORT || "admin@example.com";

// ⚠️ NOTE:
// Memory Set di Vercel TIDAK permanen
// Bisa reset kapan aja
const emailedUsers = new Set();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userEmail, subject, content } = req.body;

  if (!userEmail || !subject || !content) {
    return res.status(400).json({
      status: "error",
      message: "Data kurang lengkap.",
    });
  }

  // 🚫 Anti-spam sederhana (BEST EFFORT)
  if (emailedUsers.has(userEmail)) {
    return res.json({
      status: "skipped",
      message: "User ini sudah mendapatkan notifikasi sebelumnya.",
    });
  }

  try {
    await transporter.sendMail({
      from: `"Learning Buddy Notif" <${EMAIL_USER}>`,
      to: userEmail,
      cc: EMAIL_REPORT,
      subject: `[Chatbot Notifikasi] ${subject}`,
      html: `
        <p>Halo ${userEmail},</p>
        <p>Berikut notifikasi sesi chat kamu:</p>
        <div style="padding:15px;border:1px solid #ccc">
          ${content}
        </div>
      `,
    });

    emailedUsers.add(userEmail);

    return res.json({
      status: "success",
      message: "Notification email sent.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Gagal kirim email.",
    });
  }
}
