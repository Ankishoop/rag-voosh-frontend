import { useState, useRef, useEffect } from "react";
import MessageBubble from "./message";
import InputBox from "./input-box";

type Msg = { role: "user" | "bot"; content: string; ts?: string };

export default function ChatWindow({ messages, onSend, loading }: { messages: Msg[]; onSend: (t: string) => void; loading?: boolean }) {
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const submit = async () => {
        if (!input.trim()) return;
        onSend(input.trim());
        setInput("");
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} ts={m.ts} />)}
                <div ref={bottomRef} />
            </div>

            <InputBox value={input} onChange={setInput} onSend={submit} loading={loading} />
        </div>
    );
}
