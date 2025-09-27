## Voosh — RAG Chat (Frontend)

### Overview
This is a Vite + React (TypeScript) single‑page app that connects to the backend over REST and WebSocket to power a news‑focused RAG chat. It provides:
- Chat UI with optimistic user messages
- Streaming responses via WebSocket (fallback to REST)
- Session management with history fetched from the backend

### Tech Stack
- React 19 + TypeScript
- Vite 7
- SCSS modules for styling
- Axios for REST calls, native WebSocket for streaming

### Prerequisites
- Node.js 20+
- Backend running locally (default `http://localhost:3000`)

### Environment
Create a `.env` (or `.env.local`) at the project root (same folder as `package.json`). At minimum set:

```
VITE_BACKEND_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

Notes:
- `VITE_BACKEND_URL` is used by `src/lib/api.ts` for REST endpoints.
- `VITE_WS_URL` is used by `src/lib/ws-client.ts` for the WebSocket base URL.

### Install
```
pnpm install
```

### Development
```
pnpm dev
```
This starts Vite dev server (default `http://localhost:5173`). The backend should be running at `VITE_BACKEND_URL`.

### Build
```
pnpm build
```
Emits a production build to `dist/`.

### Preview (serve built assets)
```
pnpm preview
```

### Lint
```
pnpm lint
```

### Project Structure
```
src/
  components/          # UI components (header, input, messages)
  lib/                 # API + WS client helpers
  styles/              # SCSS styles and variables
  App.tsx              # App shell and chat controller logic
  main.tsx             # React bootstrap
```

Key files:
- `src/App.tsx`: Manages session lifecycle, history bootstrap, send flow, and UI state.
- `src/lib/api.ts`: REST calls to the backend: create session, history, message, reset.
- `src/lib/ws-client.ts`: WebSocket connect/reconnect and message protocol.
- `src/styles/chat.scss`: Main chat layout and theming.

### How the App Talks to the Backend
- On first load, the app creates a session via `POST /session` and saves its ID in `localStorage`.
- History is fetched from `GET /session/:id/history`.
- On send:
  - If WS is open: send `{ type: "user_message", sessionId, text }` and stream bot chunks.
  - If WS is closed: fallback to `POST /message` and render the final answer.
- You can reset or create a new session from the header controls.

### Configuration Tips
- When reverse‑proxying, ensure WebSocket upgrade headers are passed through.
- If you deploy frontend and backend under different origins, set `FRONTEND_URL` in backend and configure CORS appropriately.


