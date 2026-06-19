import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

const BG = "linear-gradient(145deg, #c8f5ea 0%, #dcd8f9 50%, #fde4d8 100%)";

type ActionButton = { label: string; href: string };

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
  actions?: ActionButton[];
};

const GREETING: Message = {
  id: 0,
  role: "ai",
  text: "Hi, I'm your Wellness Consultant 👋 I'm here to help you find the right support. What's on your mind today?",
};

function matchTriage(input: string): { text: string; actions: ActionButton[] } {
  const t = input.toLowerCase();

  const crisisWords = ["crisis", "suicidal", "suicide", "kill myself", "hurt myself", "self harm", "want to die", "end it", "can't go on"];
  const anxietyWords = ["anxious", "anxiety", "stress", "stressed", "panic", "panicking", "worried", "worry", "overwhelmed", "can't breathe", "racing"];
  const sadnessWords = ["sad", "depress", "depressed", "depression", "cry", "crying", "lonely", "alone", "hopeless", "numb", "empty", "worthless", "grief", "heartbreak"];

  if (crisisWords.some((w) => t.includes(w))) {
    return {
      text: "I'm really glad you told me that, and I want to make sure you get the right help right now. Please reach out to emergency support or a crisis line — you're not alone. 💜",
      actions: [
        { label: "Emergency Support →", href: "/emergency" },
        { label: "Crisis Hotline →", href: "/crisis" },
      ],
    };
  }

  if (anxietyWords.some((w) => t.includes(w))) {
    return {
      text: "It sounds like you're feeling stressed or anxious right now. Breathing exercises can really help calm your nervous system in just a few minutes. Want to give it a try? 🌿",
      actions: [{ label: "Try Breathing Exercise →", href: "/breathe" }],
    };
  }

  if (sadnessWords.some((w) => t.includes(w))) {
    return {
      text: "I hear you — those feelings are real and valid. Sometimes writing things out can help you process what's going on. You could also connect with others who understand in the community. 🌸",
      actions: [
        { label: "Open Journal →", href: "/journals/new" },
        { label: "Visit Community →", href: "/community" },
      ],
    };
  }

  return {
    text: "Thank you for sharing that with me. You're not alone — our community is full of people who understand. Checking in with your mood each day is also a great way to spot patterns. 🤍",
    actions: [
      { label: "Check-In Now →", href: "/checkin" },
      { label: "Visit Community →", href: "/community" },
    ],
  };
}

function AIAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #dcd8f9, #c8f5ea)" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" fill="#8b5cf6" opacity="0.7" />
        <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <circle cx="12" cy="12" r="2" fill="#8b5cf6" />
      </svg>
    </div>
  );
}

export default function AIChat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: nextId.current++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = matchTriage(text);
      const aiMsg: Message = {
        id: nextId.current++,
        role: "ai",
        text: response.text,
        actions: response.actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 400);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-[100dvh] overflow-hidden flex items-start justify-center bg-gray-100"
    >
      <div
        className="relative w-full max-w-[430px] h-[100dvh] flex flex-col overflow-hidden shadow-2xl"
        style={{ background: BG }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 pt-5 pb-4 flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <button
            data-testid="button-back"
            onClick={() => setLocation("/")}
            className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card flex-shrink-0 transition-all duration-200 active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5 flex-1">
            <AIAvatar />
            <div>
              <p className="text-[14px] font-bold text-gray-800 leading-tight">Wellness Consultant</p>
              <p className="text-[11px] text-emerald-600 font-medium">Online · Here for you</p>
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}>
              {msg.role === "ai" && <AIAvatar />}

              <div className={`flex flex-col gap-2 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className="rounded-2xl px-4 py-3 text-[13px] leading-relaxed"
                  style={
                    msg.role === "ai"
                      ? {
                          background: "rgba(255,255,255,0.75)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.8)",
                          color: "#374151",
                          borderBottomLeftRadius: 6,
                        }
                      : {
                          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                          color: "white",
                          borderBottomRightRadius: 6,
                        }
                  }
                >
                  {msg.text}
                </div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        data-testid={`action-${action.label.replace(/\s+/g, "-").toLowerCase()}`}
                        onClick={() => setLocation(action.href)}
                        className="text-left px-4 py-2.5 rounded-2xl text-[12px] font-semibold transition-all duration-200 active:scale-95"
                        style={{
                          background: "rgba(139,92,246,0.12)",
                          border: "1.5px solid rgba(139,92,246,0.3)",
                          color: "#7c3aed",
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-end">
              <AIAvatar />
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(12px)",
                  borderBottomLeftRadius: 6,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div
          className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.7)",
          }}
        >
          <input
            ref={inputRef}
            data-testid="input-message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Share what's on your mind…"
            className="flex-1 px-4 py-2.5 rounded-2xl text-sm text-gray-700 outline-none placeholder-gray-400 bg-white border border-slate-200"
          />
          <button
            data-testid="button-send"
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95 disabled:opacity-40"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                : "rgba(139,92,246,0.15)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
