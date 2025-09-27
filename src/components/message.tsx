export default function MessageBubble({ role, content, ts }: { role: "user" | "bot"; content: string; ts?: string }) {
    return (
        <div className={`msg ${role}`}>
            <div className="bubble">
                <div className="content">{content}</div>
                {ts && <div className="ts">{new Date(ts).toLocaleTimeString()}</div>}
            </div>
        </div>
    );
}
