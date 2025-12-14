export async function sendChatNotification(email, subject, content) {
  if (!email || !subject || !content) return;

  try {
    const res = await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: email,
        subject,
        content,
      }),
    });

    const data = await res.json();

    if (data.status !== "success") {
      console.error("Notifikasi gagal:", data.message);
    }
  } catch (err) {
    console.error("Gagal konek ke Email API:", err);
  }
}
