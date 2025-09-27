import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import "../styles/chat.scss";

export default function ChatInput({ onSend }: { onSend: (text: string) => void; }) {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResize = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; // cap ~8 lines
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (text.trim()) {
                onSend(text);
                setText("");
                requestAnimationFrame(() => {
                    textareaRef.current?.focus();
                    autoResize();
                });
            }
        }
    };

    useEffect(() => {
        autoResize();
    }, [text]);

    return (
        <div className="chat-input">
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
            />
            <button className="send-btn" aria-label="Send" onClick={() => { if (text.trim()) { onSend(text); setText(""); requestAnimationFrame(() => { textareaRef.current?.focus(); autoResize(); }); } }}>
                <ArrowUp size={18} />
            </button>
        </div>
    );
}
