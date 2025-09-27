import { Plus, RotateCcw } from "lucide-react";
import "../styles/chat.scss";

export default function ChatHeader({ onReset, onNewSession }: { onReset: () => void; onNewSession: () => void; }) {
    return (
        <div className="chat-header">
            <h1>Voosh RAG Chat</h1>
            <div className="session-controls">
                <button className="icon-btn" aria-label="New Session" onClick={onNewSession} title="New Session"><Plus size={18} /></button>
                <button className="icon-btn" aria-label="Reset Session" onClick={onReset} title="Reset Session"><RotateCcw size={18} /></button>
            </div>
        </div>
    );
}
