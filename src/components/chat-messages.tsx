import { useEffect, useRef } from "react";
import "../styles/chat.scss";

export default function ChatMessages({
  messages,
}: {
  messages: { role: string; content: string }[];
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Helper to format message with bullet points
  const formatMessage = (content: string) => {
    // Split by lines starting with '*'
    const lines = content.split("\n").map((line) => line.trim());
    return (
      <ul>
        {lines.map((line, i) => {
          if (line.startsWith("*")) {
            return <li key={i}>{line.slice(1).trim()}</li>; // Remove the '*' and trim
          } else {
            return <div key={i}>{line}</div>;
          }
        })}
      </ul>
    );
  };

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.role}`}>
          <div className="message-content">{formatMessage(msg.content)}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
