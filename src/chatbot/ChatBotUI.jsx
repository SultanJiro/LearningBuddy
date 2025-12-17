import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendMessageToBot } from "../services/api";
import { sendChatNotification } from "../services/notification";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../index.css";

const INITIAL_MESSAGE = {
  id: "greeting",
  sender: "bot",
  text: "Hello! Ada yang perlu aku bantu? Tanya aja soal course, progress, atau mau Quiz! Masukin email kamu dulu ya diatas!",
  isQuiz: false,
};

function parseQuizMessage(text) {
  // Check format quiz (Biar fleksibel, kita biarin teks aslinya aja buat di-render Markdown nanti)
  const isQuiz = text.includes("📝 **Soal") && text.includes("A.");
  if (!isQuiz) return { isQuiz: false, text: text, options: [] };

  const splitIndex = text.indexOf("A.");
  if (splitIndex === -1) return { isQuiz: false, text: text, options: [] };

  const questionPart = text.substring(0, splitIndex);
  const optionsPart = text.substring(splitIndex);

  const options = [];
  const lines = optionsPart.split("\n");

  lines.forEach((line) => {
    const trimmed = line.trim();
    const match = trimmed.match(/^([A-D])\.\s+(.*)/);
    if (match) {
      options.push({ label: match[1], text: match[2] });
    }
  });

  const cleanQuestion = questionPart.replace(/\*\(Jawab dengan ketik.*?\)\*/s, "");
  return { isQuiz: true, text: cleanQuestion, options };
}

// FUNGSI formatMarkdown LAMA DIHAPUS karena diganti react-markdown

export default function ChatBotUI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [userEmail, setUserEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const messagesEndRef = useRef(null);
  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

  async function askAPI(userMessage) {
    try {
      const result = await sendMessageToBot(userMessage, userEmail);
      const botText = result?.data?.response?.response;
      return botText || "Server mengirim format aneh 😅";
    } catch (err) {
      return "Gagal connect ke server 😢 Pastikan Python + Ngrok nyala!";
    }
  }

  const handleQuizOptionClick = (optionLabel) => {
    sendMessage(optionLabel);
  };

  useEffect(() => {
    const saved = localStorage.getItem("chat_sessions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
        setMessages(parsed[0].messages);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: "Percakapan Baru",
      messages: [INITIAL_MESSAGE],
      timestamp: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([INITIAL_MESSAGE]);
    setIsSidebarOpen(false);
    setUserEmail("");
  };

  const switchSession = (id) => {
    const found = sessions.find((s) => s.id === id);
    if (!found) return;
    setCurrentSessionId(id);
    setMessages(found.messages);
    setIsSidebarOpen(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (id === currentSessionId) {
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
        setMessages(remaining[0].messages);
      } else {
        createNewSession();
      }
    }
  };

  const updateCurrentSessionData = (newMessages) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: newMessages,
              title: s.messages.length === 1 ? newMessages.find((m) => m.sender === "user")?.text.slice(0, 20) + "..." : s.title,
            }
          : s
      )
    );
  };

  const sendMessage = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;
    if (!isEmail(userEmail)) {
      alert("Masukkan email dulu ya 📧");
      return;
    }

    const userMsg = { id: Date.now() + "_user", sender: "user", text: textToSend, isQuiz: false };
    const userUpdated = [...messages, userMsg];
    setMessages(userUpdated);
    updateCurrentSessionData(userUpdated);
    if (!overrideText) setInput("");

    setMessages((prev) => [...prev, { id: "typing", sender: "bot", isTyping: true }]);

    const botAnswer = await askAPI(textToSend);
    const parsed = parseQuizMessage(botAnswer);

    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== "typing");
      const botMsg = {
        id: Date.now() + "_bot",
        sender: "bot",
        text: parsed.text,
        isQuiz: parsed.isQuiz,
        options: parsed.options,
      };
      const final = [...filtered, botMsg];
      updateCurrentSessionData(final);
      sendChatNotification(userEmail, "Chat Interaction", `User: ${textToSend}<br>Bot: ${botAnswer.slice(0, 50)}...`);
      return final;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {open && (
          <motion.div className={`chatbot-widget ${isMaximized ? "maximized" : ""}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            {/* --- HEADER --- */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  ☰
                </button>
                <div className="chatbot-avatar">🤖</div>
                <span className="chatbot-title">Learning Buddy</span>
              </div>
              <div className="chatbot-header-right">
                <AnimatePresence>
                  {showEmailInput && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 160, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      type="email"
                      placeholder="Email kamu..."
                      className="email-input-field"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  )}
                </AnimatePresence>
                <button className={`email-toggle-btn ${userEmail ? "has-email" : ""}`} onClick={() => setShowEmailInput(!showEmailInput)}>
                  @
                </button>
                <button className="expand-btn" onClick={() => setIsMaximized(!isMaximized)}>
                  {isMaximized ? "↙" : "↗"}
                </button>
                <button className="header-close-btn" onClick={() => setOpen(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="chatbot-body-container">
              {/* SIDEBAR */}
              <div className={`chatbot-sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="new-chat-btn" onClick={createNewSession}>
                  + New Chat
                </button>
                <div className="history-list">
                  {sessions.map((s) => (
                    <div key={s.id} className={`history-item ${currentSessionId === s.id ? "active" : ""}`} onClick={() => switchSession(s.id)}>
                      <span className="history-title">{s.title}</span>
                      <span className="delete-icon" onClick={(e) => deleteSession(e, s.id)}>
                        🗑️
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MESSAGES */}
              <div className="chatbot-messages">
                {messages.map((msg) => (
                  <motion.div key={msg.id} className={`chatbot-message-row ${msg.sender}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {msg.sender === "bot" && <div className="bot-icon-small">🤖</div>}
                    {msg.isTyping ? (
                      <div className="chatbot-bubble bot typing-bubble">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    ) : (
                      <div className={`chatbot-bubble ${msg.sender}`}>
                        {/* --- PERUBAHAN DISINI: GANTI dangerouslySetInnerHTML --- */}
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>

                        {msg.isQuiz && msg.options && msg.options.length > 0 && (
                          <div className="quiz-options-container">
                            {msg.options.map((opt) => (
                              <button key={opt.label} className="quiz-option-btn" onClick={() => handleQuizOptionClick(opt.label)}>
                                <span className="option-label">{opt.label}</span>
                                <span className="option-text">{opt.text}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
            </div>

            <div className="chatbot-input">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ketik pesan..." />
              <button onClick={() => sendMessage()}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}
