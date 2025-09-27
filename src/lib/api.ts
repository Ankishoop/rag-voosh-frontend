import axios from "axios";

export async function createSession(backendUrl: string) {
    const res = await axios.post(`${backendUrl}/session`);
    return res.data as { sessionId: string };
}

export async function fetchHistory(sessionId: string, backendUrl: string) {
    const res = await axios.get(`${backendUrl}/session/${sessionId}/history`);
    return res.data as { messages: Array<{ role: string; content: string; ts?: string }> };
}

export async function postMessageREST(sessionId: string, text: string, backendUrl: string) {
    const res = await axios.post(`${backendUrl}/message`, { sessionId, text });
    return res.data as { answer?: string; passages?: any[] };
}

export async function resetSession(sessionId: string, backendUrl: string) {
    const res = await axios.post(`${backendUrl}/session/${sessionId}/reset`);
    return res.data;
}
