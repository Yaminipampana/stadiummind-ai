import React, { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiCpu,
  FiUser,
  FiMic,
  FiPlus,
  FiMessageSquare,
  FiTrash2,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { chatService } from "../services/chatService";
import { useLanguage } from "../store/LanguageContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export const Chat: React.FC = () => {
  const { t, isRtl } = useLanguage();
  
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session_1",
      title: "Gate 4 Wait & Density",
      messages: [],
    },
    {
      id: "session_2",
      title: "Elevator Status Sector 2",
      messages: [],
    },
    {
      id: "session_3",
      title: "Recycling Station Map",
      messages: [],
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>("session_1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get active session messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const activeMessagesCount = messages.length;

  // Initialize with greeting if empty
  useEffect(() => {
    if (activeMessagesCount === 0) {
      const greeting: ChatMessage = {
        role: "assistant",
        content: t("welcome_msg"),
        timestamp: new Date(),
      };
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [greeting] } : s))
      );
    }
  }, [activeSessionId, activeMessagesCount, t]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: new Date() };
    const botPlaceholderMsg: ChatMessage = { role: "assistant", content: "", timestamp: new Date() };
    
    // Add user message and assistant placeholder to active session
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.title === "Elevator Status Sector 2" || s.title === "Recycling Station Map" || s.messages.length <= 1 ? text.substring(0, 24) : s.title,
              messages: [...s.messages, userMsg, botPlaceholderMsg],
            }
          : s
      )
    );

    if (!textToSend) setInput("");
    setLoading(true);

    let hasReceivedChunk = false;

    // Trigger streaming connection
    await chatService.sendMessageStream(
      {
        message: userMsg.content,
        session_id: activeSessionId,
      },
      // onChunk callback
      (chunk) => {
        hasReceivedChunk = true;
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              const msgs = [...s.messages];
              const lastMsg = { ...msgs[msgs.length - 1] };
              lastMsg.content += chunk;
              msgs[msgs.length - 1] = lastMsg;
              return { ...s, messages: msgs };
            }
            return s;
          })
        );
      },
      // onDone callback
      (fullReply, finalSessionId) => {
        setLoading(false);
      },
      // onError callback (fallback to standard POST if no chunks received)
      async (err) => {
        if (!hasReceivedChunk) {
          try {
            const res = await chatService.sendMessage({
              message: userMsg.content,
              session_id: activeSessionId,
            });
            
            if (res.data) {
              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id === activeSessionId) {
                    const msgs = [...s.messages];
                    msgs[msgs.length - 1] = {
                      role: "assistant",
                      content: res.data!.reply,
                      timestamp: new Date(res.data!.timestamp),
                    };
                    return { ...s, messages: msgs };
                  }
                  return s;
                })
              );
            } else {
              throw new Error(res.error || "Failed payload");
            }
          } catch {
            setSessions((prev) =>
              prev.map((s) => {
                if (s.id === activeSessionId) {
                  const msgs = [...s.messages];
                  msgs[msgs.length - 1] = {
                    role: "assistant",
                    content: "### Connection Error\nSorry, I am having trouble connecting to my central stadium brain.\n\n- Check your internet connectivity\n- Try again in a few moments\n\n*Or ask a nearby volunteer in a green vest for live directions.*",
                    timestamp: new Date(),
                  };
                  return { ...s, messages: msgs };
                }
                return s;
              })
            );
          } finally {
            setLoading(false);
          }
        } else {
          // Streaming broke midway
          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === activeSessionId) {
                const msgs = [...s.messages];
                const lastMsg = { ...msgs[msgs.length - 1] };
                lastMsg.content += "\n\n*(Session response stream interrupted)*";
                msgs[msgs.length - 1] = lastMsg;
                return { ...s, messages: msgs };
              }
              return s;
            })
          );
          setLoading(false);
        }
      }
    );
  };

  const createNewSession = () => {
    const newId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New AI Session",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const fallbackId = `session_${Date.now()}`;
      setSessions([
        {
          id: fallbackId,
          title: "New AI Session",
          messages: [],
        },
      ]);
      setActiveSessionId(fallbackId);
    } else {
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  const triggerVoiceSimulator = () => {
    setListening(true);
    setTimeout(() => {
      setInput("Are elevators working near Gate 2?");
      setListening(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Are elevators operational near Gate 2?",
    "What is the average queue wait time?",
    "Where is the nearest sensory room?",
  ];

  // Regex markdown rendering parser
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let content = line;

      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="font-extrabold text-sm uppercase tracking-wide text-fifa-blue dark:text-fifa-sky mt-3 mb-1">
            {line.slice(4)}
          </h4>
        );
      }
      
      // List element
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="list-disc list-inside text-xs text-light-muted dark:text-dark-muted ml-2">
            {line.slice(2)}
          </li>
        );
      }

      // Bold formatter
      const parts = content.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        return (
          <p key={i} className="text-xs leading-relaxed mb-1">
            {parts.map((part, idx) =>
              idx % 2 === 1 ? (
                <strong key={idx} className="font-bold text-light-text dark:text-dark-text">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      return (
        <p key={i} className="text-xs leading-relaxed mb-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="container mx-auto px-6 py-6 text-light-text dark:text-dark-text transition-colors duration-200" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <FiCpu className="text-fifa-blue dark:text-fifa-sky animate-pulse" /> {t("chat_title")}
          </h1>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            {t("chat_desc")}
          </p>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-fifa-navy border border-light-border dark:border-fifa-border"
          aria-label="Toggle Sessions Menu"
        >
          {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[650px] relative">
        
        {/* LEFT SIDEBAR: Session History */}
        <div
          className={`${
            sidebarOpen ? "flex absolute inset-0 z-30 bg-light-bg dark:bg-fifa-darkNavy" : "hidden"
          } md:flex md:relative md:col-span-3 flex-col h-full border border-light-border dark:border-fifa-border rounded-2xl bg-slate-50 dark:bg-fifa-navy/20 overflow-hidden`}
        >
          <div className="p-4 border-b border-light-border dark:border-fifa-border flex justify-between items-center">
            <span className="text-xs font-black uppercase text-light-muted dark:text-dark-muted">
              {t("nav_chat")} History
            </span>
            <Button variant="pitch" size="sm" className="p-2 gap-1 rounded-xl" onClick={createNewSession}>
              <FiPlus size={14} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs font-bold transition-all border ${
                  session.id === activeSessionId
                    ? "bg-fifa-blue/10 border-fifa-blue/30 text-fifa-blue dark:text-fifa-sky dark:border-fifa-sky/30"
                    : "border-transparent hover:bg-slate-100 dark:hover:bg-fifa-darkNavy/50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FiMessageSquare className="flex-shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="text-light-muted hover:text-red-500 transition-colors p-1"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN: Chat Feed & Action Input */}
        <div className="md:col-span-9 flex flex-col h-full border border-light-border dark:border-fifa-border rounded-2xl bg-white dark:bg-fifa-navy/10 overflow-hidden">
          
          {/* Chat Window Header */}
          <div className="px-6 py-4 border-b border-light-border dark:border-fifa-border flex justify-between items-center bg-slate-50/50 dark:bg-fifa-navy/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-fifa-pitch animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">{activeSession.title}</span>
            </div>
            <Badge variant="blue" size="sm">
              Model: Gemini-1.5
            </Badge>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="p-2.5 rounded-xl bg-fifa-blue/15 text-fifa-blue dark:text-fifa-sky flex-shrink-0">
                    <FiCpu size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3.5 shadow-sm border ${
                    msg.role === "user"
                      ? "bg-fifa-blue-gradient text-white border-fifa-blue rounded-tr-none"
                      : "bg-slate-50 border-light-border dark:bg-fifa-navy dark:border-fifa-border rounded-tl-none"
                  }`}
                >
                  <div className="space-y-1">{parseMarkdown(msg.content)}</div>
                  <span
                    className={`block text-[9px] mt-2 text-right ${
                      msg.role === "user" ? "text-white/70" : "text-light-muted dark:text-dark-muted"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {msg.role === "user" && (
                  <div className="p-2.5 rounded-xl bg-fifa-pitch/15 text-fifa-pitch flex-shrink-0">
                    <FiUser size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Bouncing Dots Loader */}
            {loading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="p-2.5 rounded-xl bg-fifa-blue/15 text-fifa-blue flex-shrink-0 animate-pulse">
                  <FiCpu size={16} />
                </div>
                <div className="max-w-[70px] rounded-2xl px-4 py-3.5 bg-slate-50 dark:bg-fifa-navy border border-light-border dark:border-fifa-border rounded-tl-none flex items-center justify-between gap-1">
                  <span className="w-1.5 h-1.5 bg-fifa-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-fifa-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-fifa-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Grid */}
          {messages.length <= 1 && (
            <div className="px-6 py-3 border-t border-light-border dark:border-fifa-border/60 bg-slate-50/20 dark:bg-fifa-navy/10">
              <span className="text-[10px] uppercase font-black tracking-wider text-light-muted dark:text-dark-muted block mb-2">
                {t("chat_suggested_queries")}
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-xs font-bold border border-light-border dark:border-fifa-border bg-white dark:bg-fifa-navy px-3 py-1.5 rounded-xl hover:border-fifa-blue dark:hover:border-fifa-sky hover:text-fifa-blue dark:hover:text-fifa-sky transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Chat Inputs bar */}
          <div className="p-4 border-t border-light-border dark:border-fifa-border bg-slate-50/40 dark:bg-fifa-navy/20 flex gap-2">
            <button
              onClick={triggerVoiceSimulator}
              className={`p-3 rounded-xl border transition-all ${
                listening
                  ? "bg-red-500 border-red-500 text-white animate-pulse"
                  : "bg-white border-light-border dark:bg-fifa-navy dark:border-fifa-border hover:border-fifa-blue dark:hover:border-fifa-sky text-light-text dark:text-dark-text"
              }`}
              title="Voice Input (Simulator)"
            >
              <FiMic size={16} />
            </button>

            <input
              type="text"
              className="flex-1 rounded-xl px-4 py-3 bg-white border border-light-border text-xs text-light-text focus:outline-none focus:ring-2 focus:ring-fifa-blue/25 focus:border-fifa-blue dark:bg-fifa-navy dark:text-dark-text dark:border-fifa-border"
              placeholder={listening ? t("chat_listening") : t("chat_placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />

            <Button
              variant="primary"
              className="h-full px-5 rounded-xl flex items-center justify-center gap-1.5 shadow-fifa-glow"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
            >
              <span className="hidden sm:inline">{t("chat_send")}</span>
              <FiSend size={14} />
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Chat;
