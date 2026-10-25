# EchoLeaf AI Assistant — Production Integration

## Overview
**EchoLeaf AI** is an inbuilt intelligent copilot for satellite radar (Sentinel-1 SAR) and optical (Sentinel-2) forest monitoring. It is rendered exclusively on the 2nd page (`/hero-38`) of the application with the React Bits `<BorderGlow />` component.

---

## Architecture & Security Model

```
Browser Client (/hero-38)
      │
      ▼ (JWT Bearer Token via supabase.auth.getSession())
Supabase Edge Function (`ai-assistant`)
      │  ├─ 1. Authenticates session with Supabase Auth
      │  ├─ 2. Enforces Rate Limiting (sliding window per-user)
      │  ├─ 3. Validates message schema & bounds history (10 turns, 4000 chars)
      │  └─ 4. Safely calls OpenAI API using server-side secret
      ▼
OpenAI Chat / Responses API (`gpt-4o-mini`)
```

- **Zero Client-Side Secret Leakage**: `OPENAI_API_KEY` is never exposed in the browser bundle or frontend environment variables.
- **Session Authentication**: Only authenticated Supabase users can invoke the assistant. Unauthenticated requests are halted with clear user guidance.
- **Abuse Protection**: Per-user sliding-window rate limiting prevents API exhaustion.

---

## Local Development & Testing

1. Start development server:
   ```powershell
   npm run dev
   ```
2. Build for production:
   ```powershell
   npm run build
   ```

---

## Deploying the Supabase Edge Function

To deploy the `ai-assistant` function to your Supabase project (`zxwkctqqacfjridprqva`):

### 1. Link Supabase Project
```powershell
npx supabase login
npx supabase link --project-ref zxwkctqqacfjridprqva
```

### 2. Set the OpenAI API Key Secret in Supabase
```powershell
npx supabase secrets set OPENAI_API_KEY="sk-..."
```

### 3. Deploy the Edge Function
```powershell
npx supabase functions deploy ai-assistant
```
