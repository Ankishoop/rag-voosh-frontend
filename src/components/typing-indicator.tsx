import "../styles/chat.scss";

export default function TypingIndicator({ text }: { text?: string }) {
    return (
        <div className="typing-indicator">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <span>{text || "Thinking..."}</span>
        </div>
    );
}
