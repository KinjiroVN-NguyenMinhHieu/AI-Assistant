# AI-Assistant

A small, self-hosted, multilingual HR chat interface powered by Gemini and Groq, with optional web search and a database-ready RAG adapter. It runs on Node.js 18+ with no npm dependencies.

## Start

1. Create a new Gemini API key in Google AI Studio if the key previously pasted into a chat or shared workspace is still active. Revoke that exposed key first.
2. Put the key in a local `.env` file in the project root as `GEMINI_API_KEY=your_key`. The server loads `.env` automatically. Never put a real key in `.env.example`, `index.html`, source control, or a browser request.

   Alternatively, set `GEMINI_API_KEY` as an environment variable before starting the server; process environment variables take precedence over `.env`. PowerShell (current terminal only):

   ```powershell
   $env:GEMINI_API_KEY = "YOUR_NEW_KEY"
   npm start
   ```

   Or set it in your deployment environment, then run `npm start`.
3. Open <http://localhost:3000>.

Optional provider configuration (all keys stay server-side in `.env`):

```env
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-3.8-flash
AI_PROVIDER=gemini
AI_FALLBACK_PROVIDER=groq
GROQ_API_KEY=your_groq_key
GROQ_MODEL=openai/gpt-oss-120b
TAVILY_API_KEY=your_tavily_key
PORT=3000
```

Gemini is the primary provider and Groq is the fallback. The server retries transient provider/network failures once, then fails over to Groq for transient errors such as 429, 500, 502, 503, or 504. Authentication and invalid model errors do not trigger failover. To use only Groq, set `AI_PROVIDER=groq` and clear `AI_FALLBACK_PROVIDER`. The default Groq model ID is `openai/gpt-oss-120b`; see [Groq's current supported models](https://console.groq.com/docs/models). Google currently recommends Gemini 3.8 Flash for new projects; model availability can depend on the API project. The server listens on `127.0.0.1`; put an authenticated reverse proxy in front of it for remote/team access.

### Optional web search

Set `TAVILY_API_KEY` to enable Groq function calling for public web search. Groq can call the backend `search_web` tool, which queries Tavily, returns a small set of sourced snippets, then lets Groq compose the answer. Without a Tavily key, the tool is not registered and chat continues normally. Tavily search is only available when the request is handled by Groq.

### Database / RAG integration point

The RAG adapter is [knowledge.mjs](./knowledge.mjs). Replace `getRelevantContext(query)` with your database/vector search. It should return `[{ source: 'policy-name', text: 'relevant excerpt' }]`; return `[]` when there are no matches. Update `isKnowledgeBaseConnected()` after the connection is ready so the UI warning clears. Retrieval errors are caught and logged by the server, and chat continues without internal context. Add access checks and filter each query to the current user's permitted records before returning excerpts.

The app currently has no HR database connection. The setup banner warns about that and about missing web search configuration. Search results and any future database excerpts are context for the AI, not proof of a live Kinjiro record.

## Scope

The app sends chat messages to the Gemini API through the local server. It does not connect to Kinjiro or any HR database. Its instructions prevent it from presenting made-up records as verified system results. Users can paste authorized, minimized attendance data for analysis, subject to their organization's data handling policy. A real system integration requires approved Kinjiro API credentials, access controls, and an appropriate backend connection.


