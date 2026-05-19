# Merchant Fleet Hub

Multi-project commerce platform with login system. Next.js 16 (App Router) + TypeScript + Firebase + Supabase + Tailwind CSS 4.

## Stack
- **Frontend**: React 19, Next.js 16, Tailwind CSS 4, Lucide icons, Framer Motion
- **Auth/DB**: Firebase (Auth + Firestore) — primary. Supabase for SSR sessions.
- **Styling**: Tailwind CSS 4 with custom CSS variables for neon theme
- **Lang**: TypeScript 5

## Commands
```bash
npm run dev          # dev server → localhost:3000
npm run build        # production build
npm start            # start production server
npm run lint         # ESLint
```

## Project Structure
```
app/                    # Next.js App Router pages + API routes
  layout.tsx           # Root layout
  page.tsx             # Dashboard/home page
  login/               # Login page & authentication
    page.tsx           # Login component (client-side)
    actions.ts         # Server actions (session creation/removal)
  auth/
    callback/route.ts  # Auth callback endpoint
components/            # UI components
lib/
  firebase/            # Firebase client + admin SDK
  supabase/            # Supabase client (SSR)
middleware.ts          # Auth middleware (session checking)
```

## Key Patterns
- **Auth**: Firebase session cookies; signInWithEmailAndPassword client-side; server-side verify in middleware
- **Session**: 5-day expiry, httpOnly, secure (production only), sameSite=lax
- **Middleware**: Checks session cookie; redirects to /login if missing; redirects to / if on login with active session
- **UI theme**: Dark mode default (`bg-[#0a0a0f]`), cyan/purple neon accents, glass-morphism effects
- **Responsive**: Mobile-first with Tailwind, Framer Motion for animations

## Auth Flow
1. User enters email/password on `/login` page
2. Client-side Firebase auth: `signInWithEmailAndPassword(auth, email, password)`
3. Get ID token: `userCredential.user.getIdToken()`
4. Call server action `createSession(idToken)` with the token
5. Server creates session cookie via Firebase Admin SDK: `adminAuth.createSessionCookie(idToken, { expiresIn })`
6. Cookie stored with 5-day max age
7. Middleware checks cookie on all routes; redirects to `/login` if missing
8. On successful login, redirect to `/` (home/dashboard)

## Hard Rules (Never Break)

1. **Session cookie format** — Must use Firebase Admin SDK `createSessionCookie()`, never custom JWT
2. **No console.log in production** — Use proper logging infrastructure
3. **No hardcoded credentials** — All secrets in environment variables only
4. **Always use middleware** — Auth checks happen in middleware, not component-level guards
5. **Secure cookie attributes** — httpOnly=true, secure=true (prod), sameSite=lax
6. **Never expose ID tokens** — Keep tokens server-side only, use cookies for transport
7. **TypeScript strict mode** — No `any` types without explicit justification

## Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_SDK_KEY=  # Server-side only (service account JSON)
FIREBASE_ADMIN_PROJECT_ID=
SUPABASE_URL=
SUPABASE_ANON_KEY=
NODE_ENV=development|production
```

## Quick Reference

**Login**: Firebase client auth → ID token → Server action `createSession()` → Session cookie → Middleware redirect to home

**Session**: Stored in httpOnly cookie, 5-day expiry, verified in middleware.ts

**Routes**: `/login` (public), `/auth/callback` (callback), `/` (dashboard, protected)

**Auth Middleware**: Checks session cookie; redirects unauthenticated users to `/login`; redirects logged-in users away from auth pages to `/`

## When You Need More

- Firebase console → Check authentication & Firestore configuration
- Deployment process → Uses Vercel or Docker (see Dockerfile)
- Styling details → Check `app/globals.css` for CSS variables and custom classes
- Project navigation → Not yet implemented (log-pose project integration pending)
