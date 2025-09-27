import { useRef } from "react";

type Options = {
  onBotChunk?: (chunk: string, done?: boolean, sessionId?: string) => void;
  Err?: (error?: any) => void; // add this
};

export function useWS(options: Options) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = (sessionId: string) => {
    const base = import.meta.env.VITE_WS_URL as string;
    const url = base;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // init with sessionId
      ws.send(JSON.stringify({ type: "init", sessionId }));
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "bot_chunk") {
          options.onBotChunk?.(data.chunk, data.done, data.sessionId);
        } else if (data.type === "bot_message") {
          options.onBotChunk?.(data.text, true, data.sessionId);
        } else if (data.type === "Error") {
          options.Err?.(data.error); // call error callback
        }
      } catch (e) {
        console.error("WS parse error", e);
        options.Err?.(e);
      }
    };

    ws.onclose = () => {
      // simple reconnect after delay
      setTimeout(() => connect(sessionId), 1000);
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
      options.Err?.(err);
    };
  };

  const sendUserMessage = (sessionId: string, text: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "user_message", sessionId, text }));
  };

  const getState = () => {
    if (!wsRef.current) return "CLOSED";
    switch (wsRef.current.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      default:
        return "CLOSED";
    }
  };

  return {
    connect,
    sendUserMessage,
    connectionState: getState(),
  };
}
