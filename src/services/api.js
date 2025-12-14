// ⚠️ URL API DARI ML
const BASE_URL = process.env.REACT_APP_API_URL;

// Fungsi buat Chat ke Bot
export async function sendMessageToBot(userMessage, userEmail) {
  const url = `${BASE_URL}/api/chat`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        user_input: userMessage,
        user_email: userEmail, // ✅ KIRIM EMAIL DI SINI
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    console.log("BALASAN BOT:", data);
    return data;
  } catch (error) {
    console.error("Connection Error:", error);
    throw error;
  }
}
