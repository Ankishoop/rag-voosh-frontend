import React from "react";

export default function InputBox({ value, onChange, onSend, loading }: { value: string; onChange: (v: string) => void; onSend: () => void; loading?: boolean }) {
    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="input-box">
            <textarea value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKey} placeholder="Ask about the news..." />
            <button onClick={onSend} className="btn" disabled={loading || !value.trim()}>
                {loading ? "..." : "Send"}
            </button>
        </div>
    );
}
