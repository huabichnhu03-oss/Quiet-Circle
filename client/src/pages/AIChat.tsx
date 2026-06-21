import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Send } from "lucide-react";
import { IconBot } from "@/components/Icons";

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
  text: "Hi, I'm your Wellness Consultant. I'm here to help you find the right support. What's on your mind today?",
};

function matchTriage(input: string): { text: string; actions: ActionButton[] } {
  const t = input.toLowerCase();

  const crisisWords = ["crisis", "suicidal", "suicide", "kill myself", "hurt myself", "self harm", "want to die", "end it", "can't go on"];
  const anxietyWords = ["anxious", "anxiety", "stress", "stressed", "panic", "panicking", "worried", "worry", "overwhelmed", "can't breathe", "racing"];
  const sadnessWords = ["sad", "depress", "depressed", "depression", "cry", "crying", "lonely", "alone", "hopeless", "numb", "empty", "worthless", "grief", "heartbreak"];

  if (crisisWords.some((w) => t.includes(w))) {
    return {
      text: "I'm really glad you told me that, and I want to make sure you get the right help right now. Please reach out to emergency support or a crisis line — you're not alone.",
      actions: [
        { label: "Emergency Support →", href: "/emergency" },
        { label: "Crisis Hotline →", href: "/crisis" },
      ],
    };
  }

  if (anxietyWords.some((w) => t.includes(w))) {
    return {
      text: "It sounds like you're feeling stressed or anxious right now. Breathing exercises can really help calm your nervous system in just a few minutes. Want to give it a try?",
      actions: [{ label: "Try Breathing Exercise →", href: "/breathe" }],
    };
  }

  if (sadnessWords.some((w) => t.includes(w))) {
    return {
      text: "I hear you — those feelings are real and valid. Sometimes writing things out can help you process what's going on. You could also connect with others who understand in the community.",
      actions: [
        { label: "Open Journal →", href: "/journals/new" },
        { label: "Visit Community →", href: "/community" },
      ],
    };
  }

  return {
    text: "Thank you for sharing that with me. You're not alone — our community is full of people who understand. Checking in with your mood each day is also a great way to spot patterns.",
    actions: [
      { label: "Check-In Now →", href: "/checkin" },
      { label: "Visit Community →", href: "/community" },
    ],
  };
}

function AIAvatar() {
  return (
    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center app-card-muted">
      <IconBot size={18} color="var(--app-accent)" />
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
    <div className="flex min-h-full flex-col">
      <div className="flex flex-shrink-0 items-center gap-3 border-x-0 border-t-0 px-4 pb-4 pt-2 glass-card rounded-none">
        <button
          data-testid="button-back"
          onClick={() => setLocation("/")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl app-card flex-shrink-0 transition-all duration-200 active:scale-95 text-[var(--app-text)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <AIAvatar />
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[var(--app-text)] leading-tight truncate">
              Wellness Consultant
            </p>
            <p className="text-[11px] text-emerald-600 font-medium">Online · Here for you</p>
          </div>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}>
            {msg.role === "ai" && <AIAvatar />}

            <div className={`flex flex-col gap-2 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === "ai"
                    ? "glass-card text-[var(--app-text)] rounded-bl-md"
                    : "btn-gradient text-white rounded-br-md"
                }`}
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
                      className="text-left px-4 py-2.5 rounded-2xl text-[12px] font-semibold transition-all duration-200 active:scale-95 app-tag border border-[var(--app-border)]"
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
            <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5 glass-card rounded-bl-md">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--app-accent)] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-shrink-0 items-center gap-3 border-x-0 border-b-0 px-4 py-3 glass-card rounded-none">
        <input
          ref={inputRef}
          data-testid="input-message"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Share what's on your mind…"
          className="flex-1 px-4 py-2.5 rounded-2xl text-sm outline-none app-input min-w-0"
        />
        <button
          data-testid="button-send"
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95 disabled:opacity-40 ${
            input.trim() ? "btn-gradient" : "app-tag"
          }`}
        >
          <Send size={16} color="white" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
