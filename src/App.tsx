import { useEffect, useRef, useState } from "react";
import {
  createSession,
  fetchHistory,
  postMessageREST,
  resetSession,
} from "./lib/api";
import { useWS } from "./lib/ws-client";
import ChatHeader from "./components/chat-header";
import ChatMessages from "./components/chat-messages";
import ChatInput from "./components/chat-input";
import TypingIndicator from "./components/typing-indicator";
import { ToastContainer, toast } from "react-toastify";

import "./styles/chat.scss";

type Message = { role: "user" | "bot"; content: string; ts?: string };

const SESSION_KEY = "voosh_session_id";

export default function App() {
  const backend = import.meta.env.VITE_BACKEND_URL as string;
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const pendingUserMessageRef = useRef<string | null>(null);

  // WS hooks: handle incoming chunks & final result
  const { connect, sendUserMessage, connectionState } = useWS({
    onBotChunk: (chunk, done, _sid) => {
      setIsTyping(true);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === "bot") {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + chunk,
          };
          return updated;
        }
        return [...prev, { role: "bot", content: chunk }];
      });
      if (done) {
        setIsTyping(false);
        pendingUserMessageRef.current = null;
      }
    },
    Err: (error) => {
      console.error("WebSocket error:", error);
      toast("Gemini Model Services Down  !");
      setIsTyping(false);
    },
  });

  // bootstrap session
  useEffect(() => {
    (async () => {
      if (!sessionId) {
        const { sessionId: sid } = await createSession(backend);
        localStorage.setItem(SESSION_KEY, sid);
        setSessionId(sid);
      } else {
        // fetch history
        setLoading(true);
        const { messages: hist } = await fetchHistory(sessionId, backend);
        setMessages(
          (hist ?? []).map((m) => ({
            role: m.role === "user" ? "user" : "bot",
            content: m.content ?? "",
            ts: m.ts,
          }))
        );
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // connect WS when we have a session
  useEffect(() => {
    if (sessionId) connect(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleSend = async (text: string) => {
    if (!sessionId) return;
    // Optimistic UI - push user message
    setMessages((m) => [
      ...m,
      { role: "user", content: text, ts: new Date().toISOString() },
    ]);
    setIsTyping(true);
    pendingUserMessageRef.current = text;
    // choose between REST or WS: prefer WS streaming if connected
    if (connectionState === "OPEN") {
      sendUserMessage(sessionId, text);
    } else {
      // fallback: REST call gets full answer
      const res = await postMessageREST(sessionId, text, backend);
      if (res?.answer) {
        setMessages((m) => [
          ...m,
          { role: "bot", content: res.answer!, ts: new Date().toISOString() },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            content: "Sorry, no answer.",
            ts: new Date().toISOString(),
          },
        ]);
      }
      setIsTyping(false);
      pendingUserMessageRef.current = null;
    }
  };

  const handleReset = async () => {
    if (!sessionId) return;
    await resetSession(sessionId, backend);
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setMessages([]);
    // create new session
    const { sessionId: sid } = await createSession(backend);
    localStorage.setItem(SESSION_KEY, sid);
    setSessionId(sid);
  };

  const handleNewSession = async () => {
    // Do not reset server history of previous session; just start a new one
    setMessages([]);
    const { sessionId: sid } = await createSession(backend);
    localStorage.setItem(SESSION_KEY, sid);
    setSessionId(sid);
  };

  return (
    <div className="chat-page">
      <ToastContainer />
      <ChatHeader onReset={handleReset} onNewSession={handleNewSession} />
      <div className="chat-body">
        <div className="chat-messages-container">
          {messages.length === 0 && !loading ? (
            <div className="empty-state">
              What's making headlines today? Ask me anything.
            </div>
          ) : (
            <>
              <ChatMessages messages={messages} />
              {isTyping && (
                <TypingIndicator
                  text={loading ? "Fetching news..." : "Thinking..."}
                />
              )}
            </>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
