"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickReplies = [
  "Find my size 📏",
  "Outfit ideas ✨",
  "Shipping info 🚚",
  "Current deals 🏷️",
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function StyleAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: "assistant",
      content:
        "Hi! I'm Persona AI ✨ Your personal style assistant. Ask me about sizes, outfit ideas, or anything fashion-related!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const lastMessages = [...messages.slice(-9), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/ai/style-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: lastMessages,
          currentPage: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      const data = await response.json();

      if (response.ok && data?.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please try again! 💫",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setHasBeenOpened(true);
  };

  const showQuickReplies = messages.length <= 2;

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A96E] to-[#B8944E] shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Style Assistant"
      >
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#C9A96E]/30 opacity-75 animate-ping" />
            {!hasBeenOpened && (
              <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8A0BF] text-[10px] font-bold text-white">
                1
              </span>
            )}
          </>
        )}
        <Sparkles className="h-6 w-6 text-[#0F0F0F]" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 end-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ height: 520 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#C9A96E] to-[#B8944E] p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#C9A96E] bg-green-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Persona AI</p>
                  <p className="text-xs text-white/70">Style Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white transition hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-background p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-[#C9A96E] text-[#0F0F0F]"
                        : "rounded-tl-sm border border-border bg-card"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 border-t border-border bg-card p-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 px-3 py-1.5 text-xs text-[#C9A96E] transition hover:bg-[#C9A96E]/20"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="flex items-end gap-2 border-t border-border bg-card p-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about fashion..."
                className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
                style={{ height: "auto" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E] text-[#0F0F0F] transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
