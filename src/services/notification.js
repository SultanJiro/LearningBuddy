const NOTIF_BE_URL = "http://localhost:3001"; // <--- SESUAIKAN DENGAN PORT SERVER BE LU

export async function sendChatNotification(email, subject, content) {
  if (!email || !subject || !content) {
    console.error("Gagal kirim notif: Data kurang lengkap.");
    return;
  }

  try {
    const res = await fetch(`${NOTIF_BE_URL}/api/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: email, subject, content }),
    });

    const data = await res.json();

    if (data.status === "error") {
      console.error("Notifikasi gagal:", data.message);
    }
  } catch (error) {
    console.error("Koneksi ke BE Notifikasi Gagal:", error);
  }
}
