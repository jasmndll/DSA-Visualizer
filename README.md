# DSA Visualizer

A retro, Windows-98-styled platform for learning data structures and algorithms — visualize how they work, write and run real code against them, and get help from a context-aware AI tutor.

**Live app:** https://dsa-visualizer7.netlify.app/

<img width="1919" height="1003" alt="image" src="https://github.com/user-attachments/assets/66bc3985-1a47-4332-91df-4c5cc528be93" />


> Note: the backend runs on a free-tier host that sleeps after 15 minutes of inactivity. The first request after a period of idle time may take 30-60 seconds to respond while it wakes up.

---

## Features

- **Interactive visualizers** for core data structures (Array, Stack, Queue, Deque, Linked List, Doubly Linked List, Tree, Red-Black Tree, Graph) and algorithms (Sorting, Array Algorithms, Backtracking, Dynamic Programming), with step-by-step playback, pseudocode highlighting, and a live trace log.
- **In-browser code editor** (Monaco) supporting JavaScript, Python, Java, and C++, executing real code against a live sandboxed runtime — not simulated output.
- **AI tutor chatbot**, context-aware of whichever module the student is currently viewing.
- **Progress tracking**, including a manual "mark complete" flow per module and a GitHub-style activity heatmap built from real code-execution history.
- **JWT-based authentication**, with protected and public endpoints split deliberately (browsing modules and asking the chatbot require no login; running code and saving progress do).

---

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion, Monaco Editor, Zustand, React Router, Axios

**Backend:** Java 21, Spring Boot 3 (Web, Security, Data JPA, Validation), PostgreSQL, JWT (jjwt), WebClient

**External services:**
- [Glot.io](https://glot.io) — real, sandboxed code execution
- [Groq](https://groq.com) — LLM-powered chatbot (Llama 3.3)

**Infrastructure:**
- [Netlify](https://netlify.com) — frontend hosting
- [Render](https://render.com) — backend hosting (Docker)
- [Neon](https://neon.tech) — serverless Postgres

---

## Architecture notes

A few deliberate decisions worth knowing about, if you're reading the code:

- **DTOs are separate from entities everywhere.** Controllers never accept or return JPA entities directly — every request/response has its own DTO. This keeps validation rules where they belong (on incoming data, not the database model) and makes it structurally impossible to accidentally leak something like a password hash in an API response.
- **Code execution went through two pivots.** Originally built against Judge0, then switched to Piston when Judge0's free tier required a paid API key. Piston's public API later restricted access too, so the final version uses Glot.io. Each swap only ever touched one service class (`CodeExecutionService`) — the controller, DTOs, and frontend never changed, since they only depend on a stable internal contract.
- **Stateless JWT auth**, with a filter (`JwtAuthFilter`) that runs once per request, verifies the token, and populates Spring Security's context — no server-side session storage at all.
- **Split endpoint visibility deliberately, not by default.** `/api/auth/**`, `/api/modules/**`, and `/api/chat/**` are public; everything else (code execution, progress) requires a valid token — a conscious tradeoff between lowering friction for a first-time visitor and gating the features that persist data.

---

## Project structure

```
.
├── frontend/          # React + Vite app
│   └── src/
│       ├── algorithms/    # Pure step-generator functions (no DOM/UI code)
│       ├── engine/        # Framework-agnostic playback engine (useStepEngine)
│       ├── components/    # UI components, incl. per-DS/algo visualizer modules
│       ├── pages/          # Full-page routes (editor, chat, account, progress)
│       ├── api/            # Axios client + endpoint wrappers
│       └── store/          # Zustand auth store
└── backend/           # Spring Boot app
    └── src/main/java/com/example/dsav/
        ├── entity/         # JPA entities
        ├── dto/             # Request/response DTOs
        ├── repository/      # Spring Data JPA repositories
        ├── security/        # JWT service, filter, Spring Security config
        ├── service/         # Business logic
        ├── controller/      # REST endpoints
        └── exception/       # Global exception handling
```

---

## Running locally

**Backend:**
1. Create a PostgreSQL database.
2. Copy `backend/src/main/resources/application.properties` and fill in your own database credentials.
3. Set these environment variables: `DB_PASSWORD`, `JWT_SECRET`, `GLOT_API_TOKEN`, `GROQ_API_KEY`.
4. `cd backend && mvn spring-boot:run`

**Frontend:**
1. `cd frontend && npm install`
2. Set `VITE_API_URL` in a `.env.local` file (defaults to `http://localhost:8080/api` if unset).
3. `npm run dev`

---

## Author

Built by Jasmine — [GitHub](https://github.com/jasmndll)
