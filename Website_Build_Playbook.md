# Small-Business Website Build Playbook

A repeatable, step-by-step process for designing and shipping a high-end, animated
single-page marketing website for a local service business — distilled from the
Red Truck Roofing build. Follow the phases in order. The **Pitfalls** section at the
end is the most valuable part; read it before you start.

---

## What this playbook produces

A polished, conversion-focused one-page site with:

- A cinematic hero, animated section reveals, and tasteful motion throughout
- Clear service explanations, social proof (reviews), and strong calls-to-action
- Interactive extras: service deep-dive modals, a category photo gallery, an AI chatbot, and a working lead form
- A clean deploy pipeline (GitHub → Netlify) with serverless functions and financing/CTA integrations

**Stack (two proven options):**
1. **React + Framer Motion** in a single `index.html` (loaded from a CDN via an import
   map), styled with inline styles + a small CSS block. No build tooling required to run it;
   optional precompile step for reliability (see Phase 5). Best when the build leans on
   complex component state or Framer's physics-based motion.
2. **Dependency-free vanilla** — one `index.html` with a `<style>` block and a single
   plain `<script>` (no React, no CDN libraries beyond Google Fonts). Animations via CSS +
   `IntersectionObserver`. This is the most reliable option and the recommended default when
   the deliverable is **opened locally** (double-click, emailed, handed off) rather than
   deployed, because there's no CDN that can hang or go stale. We shipped the Headlines
   barbershop site this way (see Phase 5). Best when the site is content + motion + a few
   interactions (filters, accordions, a chatbot) rather than heavy app state.

---

## Phase 1 — Discovery & brand intake

Before any design, collect a brand brief. Reuse this fill-in-the-blanks template:

- **Business name & tagline:**
- **What they do (services), in order of priority:**
- **Service area / location:**
- **Real contact details:** phone, email, physical address, hours
- **Audience / customer personas:**
- **Brand personality & voice:** (e.g., family-owned, trustworthy, no hard-sell)
- **What they are NOT:** (tone to avoid — e.g., "not a corporate franchise")
- **Primary color + secondary colors (hex):**
- **Fonts:** headings + body
- **Differentiators / why choose them:**
- **Things they do NOT offer:** (so you don't advertise services they can't deliver)
- **Existing assets:** logo, photos, brand book, current website URL, social links
- **Integrations needed:** financing link, booking, CRM, chatbot, etc.

> Tip: if the client has a brand book, mine it first. If they later send a more
> detailed ("comprehensive") brand book, re-read it — it often adds services,
> personas, and a recommended page structure.

---

## Phase 2 — Clarifying questions (ask BEFORE building)

Decisions that change the whole build. Confirm these up front:

1. **Scope:** full one-page site vs. hero + a few sections vs. multi-section showcase.
2. **Animation flavor:** cinematic & premium / bold & dynamic / subtle & refined.
3. **Theme:** dark, light, or dark-hero + light-body (a great premium default).
4. **Accent style:** bold brand color vs. softer/warm-neutral palette.
5. **Deliverable:** single self-contained HTML file vs. a multi-file project.
6. **Photo strategy:** client-provided (best), their website, or licensed — never random web scrapes (see Pitfalls).

---

## Phase 3 — Gather real content & assets

Substance first, mechanics second. Pull genuine material:

- **Reviews:** search the business on Google/Yelp/BBB/HomeAdvisor/Angi. Use *real*
  review excerpts and attribute them by platform (e.g., "Verified review · Google").
  Do **not** invent reviewer names. Include the real aggregate rating if available.
- **Photos:** the client's own website and their Google/Instagram are the best sources
  for correct, on-brand images. **Have the client supply the photos they want** —
  it's the only fully reliable path (see Pitfalls on saving images correctly).
- **Real contact info & licensing:** pull the actual phone, email, address, license #.
- **Integrations:** get the real financing link (e.g., Hearth), booking URL, etc.
- **Mine the client's existing live site first — it's a goldmine of real data.** Fetch their
  current pages early and harvest: the **real booking URL(s)**, including **per-item deep links**
  (e.g., each barber/staff member often has their own scheduling link on a different provider —
  Acuity, Squarespace Scheduling, a personal site). Also grab exact NAP, payment methods,
  hours, the **full list of sister locations**, and correct spellings. On the Headlines build,
  fetching the live page turned every "Book" button from a placeholder into the barber's real
  calendar link, confirmed cash/credit payment, surfaced all 7 locations, and corrected a
  mis-rendered name ("A" → "Abe"). Do this before you write placeholder copy.
- **Verify the company identity** on every asset. Confirm the truck/logo/name matches —
  it's easy to grab a similarly named but different company by mistake.

---

## Phase 4 — Page structure (section blueprint)

A proven order for a service business. Each section has one job:

1. **Sticky nav** — logo + 3–4 links + a primary CTA button ("Free Inspection").
   Nav is transparent over the hero, then turns solid (and flips text color) on scroll.
2. **Hero** — big headline (staggered word reveal), one-line value prop, two CTAs,
   a trust ribbon (Licensed & Insured · Free Inspections · Financing), and a motion motif.
3. **Trust bar / stats** — animated count-up numbers (years, in-house crews, etc.).
4. **Problems we solve** — speak to the customer's pain (leaks, aging roof, storm damage).
5. **Story / "about" feature** — photo + family/credibility narrative + a "40+ yrs" badge.
6. **Services** — grid of cards; each opens an in-depth modal (overview + what's included + CTA).
7. **Why choose us** — differentiator pillars (cards with hover/tilt).
8. **Recent work** — clickable category tiles (e.g., Shingle/Tile/Metal/Commercial),
   each opening a lightbox gallery of real project photos.
9. **Reviews** — real quotes, star ratings, platform attribution.
10. **Financing band** — accent-colored CTA strip linking to the financing partner.
11. **Process / "our promise"** — numbered steps with animated underlines.
12. **Contact** — lead form + real phone/email/address; success state after submit.
13. **Footer** — logo, copyright, links.
14. **Floating chatbot** — always-available helper (see Phase 6).

### Make the primary conversion impossible to miss

Adapt the blueprint to the business's real conversion. A roofer's is a **lead form**; a
barbershop, salon, or clinic's is a **direct booking link**. When booking is the goal:

- **Put a "Book" CTA in every persistent surface:** sticky nav, hero, the dedicated section,
  the final CTA band — and a **persistent mobile bottom bar** (Call · Directions · Book) that
  stays on screen as the user scrolls. This bar alone meaningfully lifts mobile conversions.
- **Wire CTAs to real destinations, per item.** If each staff member has their own booking
  calendar, link their card straight to it (open in a new tab). Make the **whole card a link**,
  not just a small button, and add a "Book Now" hover overlay so the entire tile is tappable —
  this mirrors how clients actually think ("I want *that* barber").
- **Always offer a "no preference / first available" option** so undecided visitors don't bounce.
- **Keep a tap-to-call fallback** (`tel:` link) everywhere the Book button appears, for people
  who'd rather talk.
- **Let visitors self-filter to the right person.** A specialty filter (fades, beard, kids,
  etc.) over the staff grid shortens the path from landing to the correct booking link.

---

## Phase 5 — Architecture & build approach

- **Single file:** everything in `index.html` — styles in one `<style>`, app in one script.
- **Libraries via import map** (no bundler):
  ```html
  <script type="importmap">{ "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "framer-motion": "https://esm.sh/framer-motion@11.3.19?external=react,react-dom&bundle"
  }}</script>
  ```
  **Always include `react/jsx-runtime`** in the map — Framer Motion imports it, and a
  missing mapping is a silent failure.
- **Precompile the JSX (recommended).** Running Babel in the browser adds a fragile CDN
  dependency that can silently hang. Instead, compile JSX → plain `React.createElement`
  JS ahead of time (e.g., with `tsc --jsx react`) and ship a plain `<script type="module">`.
  This is what finally made the site load reliably.
- **Add a loading + error overlay.** Show a spinner, and on any resource/script error or a
  ~15s timeout, replace it with a readable message naming what failed. Never let it hang silently.
- **Mobile-first responsiveness** via `clamp()` font sizes, `auto-fit` grids, and a few media queries.

### Phase 5b — The dependency-free vanilla path (recommended for local handoff)

When the deliverable is a single file the client will open by double-clicking (not a Netlify
deploy), drop React/Framer/Babel entirely and build with the platform:

- **One file, three blocks:** `<style>` for everything, semantic HTML, one IIFE `<script>`
  at the end. No import map, no bundler, no CDN libraries except Google Fonts. Nothing can
  hang on a blocked CDN.
- **Data-drive the repetitive sections.** Keep arrays at the top of the script (barbers,
  services, gallery categories, locations, FAQ) and render cards with `createElement` /
  `innerHTML`. Editing content later means editing one array, not hand-tweaking markup.
- **Animations without a library:** `IntersectionObserver` for scroll-reveal and count-up
  triggers; CSS `@keyframes` + `transition` for everything else (word-stagger headline,
  hover lifts, sheen, pulsing chat bubble). A few lines of JS add scrollspy, a scroll-progress
  bar, and magnetic buttons.
- **Always honor `prefers-reduced-motion`** — one media query that disables transforms/animations.
- **Validate before handoff:** extract the script and run `node --check`, and sanity-check
  HTML tag balance (`<div>`/`</div>`, `<section>`, etc.). A single-file build has no compiler
  to catch a stray bracket, so this is your safety net (see Phase 10).

---

## Phase 6 — Interactive features

- **Service modals:** clicking a service card opens an animated modal (AnimatePresence) with
  a full overview, a "What's included" checklist, and a CTA. Close on X, backdrop, or Escape.
- **Category gallery lightbox:** "Recent Work" is clickable tiles per roof type; each opens a
  grid of that category's real photos, each with an error-fallback tile.
- **AI Chatbot:** a floating bubble + slide-up panel, always available site-wide. It POSTs the
  conversation to a serverless function (`/.netlify/functions/chat`) that calls an LLM with a
  business-context system prompt (services, hours, service area, contact info, what NOT to offer).
  **Always include a client-side fallback** keyword responder so the bot still answers the core
  questions (services, hours, financing, contact, "talk to a human") if the backend is unreachable
  or the API key isn't set. The chatbot is a required feature, not an optional extra — see the
  dedicated **"AI Chatbot (deep dive)"** section below for the full architecture, system prompt
  template, fallback logic, UI/UX, safety rules, and test plan.
- **Lead form:** for quick testing, relay submissions through a no-signup service
  (e.g., FormSubmit) to an email; for production, switch to the client's own backend /
  Netlify Forms. Keep the nice "Thanks" success animation either way.
- **Financing CTA:** link the button straight to the financing partner URL (open in new tab).

---

## Phase 6.5 — AI Chatbot (deep dive)

The AI chatbot is a **required** feature on every build. It answers buyer questions instantly,
captures leads after hours, and reinforces the brand voice. Done well it deflects easy questions
and routes serious ones to a phone call. Done badly it hallucinates services, quotes fake prices,
or hangs forever. This section is the recipe that avoids those failures.

### 6.5.1 Goals & guardrails

The bot exists to do four things, in priority order:

1. **Answer the top 5–10 questions** (services, hours, service area, "do you do X?", how to book).
2. **Push to action** — every answer ends by nudging a call or the request form.
3. **Capture a lead** when the visitor is ready (name + phone + problem), then hand off.
4. **Know its limits** — never quote firm prices, warranties, licensing, or availability that
   aren't verified; never promise an arrival time; offer a human/phone handoff for anything real.

Hard guardrails (enforced in the system prompt **and** the fallback): only discuss services the
business actually offers, never invent facts, stay in the brand voice, and keep answers short
(2–4 sentences) with a clear next step.

### 6.5.2 Architecture (two layers, always)

```
[ Floating bubble + chat panel (client) ]
            │  POST { messages: [...] }
            ▼
[ /.netlify/functions/chat  (serverless) ]
            │  calls LLM API with system prompt + history
            ▼
[ LLM provider (OpenAI/Anthropic/etc.) ]

If the function errors, times out, or no API key is set:
[ Client-side keyword fallback responder ]  ← always present
```

**Layer 1 — serverless function** keeps the API key off the client (never ship a key in
front-end code). It injects the business-context system prompt, forwards the trimmed message
history, sets a timeout, and returns clean JSON.

**Layer 2 — client fallback** is a small keyword matcher that runs whenever Layer 1 fails. The
bot must *never* show a dead error bubble — a degraded keyword answer is always better than
silence. Wire the fallback first so the bot is useful even before the backend exists.

### 6.5.3 System prompt template (fill the brackets per client)

```text
You are the friendly virtual assistant for [BUSINESS DISPLAY NAME], a [CITY] [INDUSTRY] company.
Formal business name: [FORMAL NAME]. Phone: [PHONE]. Service area: [AREAS]. Hours: [HOURS].

You help website visitors by answering questions clearly and guiding them to call or request service.

SERVICES YOU MAY DISCUSS (only these):
- [service 1], [service 2], [service 3], ...

YOU DO NOT OFFER (never claim or imply these):
- [excluded service 1], [excluded service 2] ...

RULES:
- Keep replies short: 2–4 sentences, plain language, in a [BRAND VOICE: e.g. calm, local, reassuring] tone.
- Always end with a clear next step (call [PHONE] or use the Request Service form).
- NEVER invent prices, warranties, license numbers, guarantees, or specific arrival times.
- If asked something you can't verify, say you're not certain and offer a call with the team.
- For emergencies (active leak/overflow/backup/no power, etc.), tell them to call [PHONE] now.
- If the visitor wants to book, collect name + phone + a short description, then tell them the team will follow up.
- Never discuss competitors, politics, or anything off-topic; steer back to how you can help.
```

> Keep this prompt in sync with the site. When you remove a service from the page (Phase 8),
> remove it from the chatbot prompt **and** the fallback in the same commit, or the bot will keep
> advertising it.

### 6.5.4 Serverless function (sketch)

```js
// netlify/functions/chat.js
export async function handler(event) {
  try {
    const { messages = [] } = JSON.parse(event.body || "{}");
    const key = process.env.OPENAI_API_KEY;            // set in Netlify env vars, never in code
    if (!key) return json(200, { reply: null, fallback: true }); // tell client to use fallback

    const trimmed = messages.slice(-10);               // cap history to control tokens
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 220,
        temperature: 0.4,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
      }),
    });
    if (!res.ok) return json(200, { reply: null, fallback: true });
    const data = await res.json();
    return json(200, { reply: data.choices?.[0]?.message?.content?.trim() || null,
                       fallback: !data.choices?.length });
  } catch (e) {
    return json(200, { reply: null, fallback: true });  // fail soft → client fallback
  }
}
const json = (s, b) => ({ statusCode: s, headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
```

Note the pattern: **never return a 500 to the client.** Always return `200` with
`fallback: true` so the UI degrades gracefully to the keyword responder instead of showing an error.

### 6.5.5 Client-side fallback responder

A tiny keyword map that covers the essentials. It runs when the function returns `fallback: true`,
when the request times out (~8s), or before any backend exists.

```js
function fallbackReply(text) {
  const t = text.toLowerCase();
  if (/(price|cost|quote|how much)/.test(t))
    return "Pricing depends on the job. The fastest way to get an accurate answer is to call [PHONE] or send a request and we'll follow up.";
  if (/(hour|open|24|emergency|night|weekend)/.test(t))
    return "We offer responsive service including urgent issues. For an active emergency, call [PHONE] now.";
  if (/(area|where|service area|location|near)/.test(t))
    return "We serve [CITY] and nearby areas. Tell me your neighborhood and I'll point you to the right next step.";
  if (/(book|schedule|appointment|request|service)/.test(t))
    return "Happy to help. Share your name, phone, and what's going on, or call [PHONE] and we'll get you scheduled.";
  if (/(human|person|agent|talk|call)/.test(t))
    return "You can reach the team directly at [PHONE]. Want me to note down your details first?";
  return "I can help with services, hours, service area, and booking. What are you running into? For urgent issues, call [PHONE].";
}
```

### 6.5.6 UI / UX

- **Bubble:** fixed bottom-right, brand-colored, with an unobtrusive open/close toggle. On mobile,
  keep it clear of the sticky bottom call/request bar (raise it or hide one when the other is open).
- **Panel:** header with business name + "typically replies instantly" (only if true, else omit),
  a scrollable message list, a text input, and a send button. Animate open/close (AnimatePresence).
- **Seed message:** open with a friendly greeting and 2–3 tappable suggested questions
  ("Do you handle emergencies?", "What areas do you serve?", "Request a callback").
- **States:** show a typing indicator while awaiting the function; auto-scroll to newest;
  disable send while in flight; handle Enter-to-send and Escape-to-close.
- **Accessibility:** focus trap when open, `aria-live` on the message list, labelled input,
  visible focus rings, and a real close button (not just the backdrop).

### 6.5.7 Lead capture handoff

When the visitor signals intent ("book", "schedule", shares a phone number), the bot collects
name + phone + short problem description, then confirms a handoff. Route that capture the same way
as the main lead form (Phase 6 — FormSubmit/Netlify Forms/CRM) so chatbot leads land in the same
inbox. Always show the "for emergencies, call now" line so urgent visitors don't wait on a form.

### 6.5.8 Safety & integrity (ties to Phase 8)

- The bot inherits **all** content-integrity rules: real facts only, no invented prices/warranties/
  licensing, and **no services the business doesn't offer** — scrub excluded services from the
  system prompt and the fallback together.
- Strip/escape user input shown back in the UI (avoid HTML injection).
- Cap history length and `max_tokens` to control cost and latency.
- Don't log personal info needlessly; if you store transcripts, say so in the privacy policy.

### 6.5.9 Chatbot test plan

- [ ] Bubble opens/closes; seed greeting + suggested questions render
- [ ] AI path works when the API key is set (ask a services question, get an on-brand answer)
- [ ] Fallback path works with the key removed (function returns `fallback: true`)
- [ ] Timeout path works (simulate a slow/blocked function → fallback fires within ~8s)
- [ ] Bot refuses to quote prices/warranties/licensing and offers a call instead
- [ ] Bot never mentions an excluded service (try asking for one directly)
- [ ] Emergency phrasing returns the "call now" response with the real phone number
- [ ] Lead capture collects name + phone and routes to the correct inbox
- [ ] Works on mobile without colliding with the sticky bottom bar
- [ ] Keyboard + screen-reader usable (focus, Enter, Escape, aria-live)

---

## Phase 7 — Design system

Define tokens once, reuse everywhere:

- **Colors:** primary (brand) + 1–2 accents (e.g., a success green for financing),
  ink/charcoal text, warm-neutral or white backgrounds, a subtle border color, card color.
- **Typography:** a strong display font for headings (e.g., Montserrat) + a clean body font
  (e.g., Inter), loaded from Google Fonts.
- **Theme:** dark-hero + light warm-neutral body reads premium and bright. Keep good contrast.
- **Motion vocabulary** (the reusable patterns):
  - Scroll-reveal on enter (`useInView` + fade/slide up)
  - Parallax on background layers (`useScroll` + `useTransform`)
  - Staggered headline word reveals (split the headline into per-word `<span>`s with stepped
    `animation-delay` — easy in vanilla, no library needed)
  - Magnetic buttons (translate toward cursor; gate behind `(hover:hover)` so it's desktop-only)
  - Count-up numbers, 3D tilt cards, an infinite marquee, a scroll progress bar
  - **Scrollspy** — highlight the current section in the nav via an `IntersectionObserver`
    with an asymmetric `rootMargin` (e.g. `-45% 0px -50% 0px`)
  - **Content filtering** — chip buttons that show/hide grid items by category (used for the
    barber specialty filter); pairs well with a CSS opacity/`display` transition
  - **Hover affordances** — animated underlines on nav links, a top accent bar that scales in
    on cards, image/tile overlays that fade in a "Book Now" prompt
  - **Always pair motion with a `prefers-reduced-motion` reset** so the whole system degrades
    to static for users who ask for it
- **Form controls:** style the `<select>` options explicitly (`option { color:#…; background:#… }`)
  so the native dropdown isn't unreadable.

---

## Phase 8 — Content & integrity rules

- Use **real** facts, reviews, and photos. Attribute reviews to platforms; never fabricate names.
- **Avoid stock photos and cartoons** if the brand book says so — real project photos win.
- **Remove services the business doesn't offer** (we removed "insurance claims" everywhere,
  including the chatbot's answers and backend prompt). Don't advertise what they can't do.
- Keep copy in the brand voice; don't invent prices, warranties, or licensing terms.
- Put the **real** phone, email, and address in the contact section, chatbot, and footer.
- **Distinguish verified facts from placeholders — visibly.** When some data is confirmed
  (booking links, NAP, payment) and some isn't yet (photos, exact hours, per-service pricing,
  individual reviews), don't blur the line. Use honest placeholder copy ("Pricing confirmed at
  booking," "Photo coming soon"), and add a short note (e.g., in the footer) listing what's
  real vs. what to confirm before launch. It keeps the client from publishing unverified claims
  and makes the hand-off checklist obvious. Better an intentional, styled placeholder
  (initials/silhouette avatar, category icon tile) than a fabricated fact or a broken image.

---

## Phase 9 — Deployment (GitHub → Netlify)

- `netlify.toml`: `publish = "."`, `functions = "netlify/functions"`, esbuild bundler.
- **The deployed site comes from the GitHub repo, not your local folder.** Every change —
  `index.html`, **all images**, the `netlify/` functions, `netlify.toml` — must be committed
  and pushed. Local previews can look right while the live site is missing files.
- Set serverless secrets (e.g., `OPENAI_API_KEY`) in **Netlify → Site configuration →
  Environment variables**, not in code. The chatbot's serverless function reads this key; with
  no key set, the function returns `fallback: true` and the client keyword responder takes over —
  so the bot still works on a fresh deploy, just without the AI layer until the key is added.
- After pushing, Netlify auto-rebuilds.

---

## Phase 10 — QA & launch checklist

- [ ] All images load on the **live** site (not just locally)
- [ ] No filenames with spaces/parentheses (rename to clean, lowercase, hyphenated)
- [ ] Logo, hero photo, gallery photos all present and correct company
- [ ] Nav links scroll to the right sections; CTA buttons work
- [ ] Service modals + gallery lightbox open/close (X, backdrop, Escape)
- [ ] Dropdown options are readable
- [ ] Chatbot answers (AI when configured, fallback otherwise) — run the full Phase 6.5.9 test plan
- [ ] Chatbot never offers excluded services, never quotes prices/warranties/licensing, routes urgent visitors to call
- [ ] Lead form submits and routes to the right inbox; success state shows
- [ ] Financing/CTA links go to the correct URLs (new tab)
- [ ] Real contact info everywhere (section, chatbot, footer)
- [ ] Mobile layout checked (hero, grids, nav collapse, modals)
- [ ] No references to services the business doesn't offer
- [ ] Every "Book" CTA goes to the correct (per-item) booking link; mobile bottom bar present and working
- [ ] Persistent CTAs verified: sticky nav, hero, section, final band, mobile bar
- [ ] Specialty/category filters show/hide the right items; "first available" option present
- [ ] Verified-vs-placeholder note present; no fabricated prices/hours/reviews; no broken images
- [ ] (Vanilla single-file) `node --check` on the script passes; HTML tags balanced
- [ ] `prefers-reduced-motion` disables animations; keyboard + focus states work

---

## Pitfalls & lessons learned (read this!)

- **Filenames with spaces/parentheses break on Netlify.** `images (1).jpg` → broken image
  on the live site even though it works locally. Use clean names like `logo.jpg`.
- **Don't hot-link random web images.** They can be the *wrong company*, get blocked, or
  disappear — and broken external images look terrible. Prefer client-provided **local** files.
- **In-browser Babel is fragile.** A bad/blocked Babel CDN can make the page hang on the
  loader with no error. Precompile the JSX and add an error/timeout overlay.
- **Map `react/jsx-runtime`** in the import map or Framer Motion fails silently.
- **Centered headings:** a flex column with `align-items: flex-end` pushes content to the
  right — use `align-items: center` for true centering.
- **Native `<select>`** renders white-on-white options unless you style `option` explicitly.
- **Cloud-synced folders (OneDrive/Dropbox/iCloud) can serve stale or truncated reads to
  command-line tooling.** On the Headlines build, after writing the full ~1,050-line file, the
  shell mount kept reporting only 682 lines (a half-synced copy) — `node --check`/`grep` ran
  against the truncated version and "failed" even though the saved file was perfect. **The
  editor's own write/read is the source of truth, not the synced shell mount.** If a shell
  check disagrees with what you just wrote: re-read through the editor to confirm, give sync a
  few seconds, and don't "fix" a phantom problem. Prefer writing one fresh complete file over
  many in-place edits of a large file.
- **Client-hosted CDN images may be blocked from your tooling.** The barbers' real photos lived
  on a marketing CDN (leadconnectorhq) that the sandbox couldn't fetch. Don't hot-link them
  (they can move/break) and don't burn time fighting the block — ship intentional styled
  placeholders (initial/silhouette avatars, category-icon tiles) and have the client drop the
  real local files in later. Wire the markup so swapping in a photo is a one-line change.
- **Fixed item counts + `auto-fit` grids create orphans.** An `auto-fit minmax()` grid left a
  lone 6th gallery tile stranded on its own row at certain widths. When you know the count, use
  an explicit column count (`repeat(3,1fr)`) so rows stay balanced, and set responsive
  breakpoints (3 → 2 → 1).
- **A single-file vanilla build has no compiler.** Before handoff, extract the `<script>` and
  run `node --check`, and verify HTML tag balance. It's the only thing standing between you and
  a stray bracket that silently breaks the page.
- **Saving images from Google Maps:** "Save *page* as" produces unusable `.htm` files.
  The client must **right-click the photo → "Save image as…" → `.jpg`** (or screenshot it).
- **Verify identity on every asset** — a similarly named but different company is an easy mistake.
- **The repo is the source of truth.** If it's not committed and pushed, it's not live.

---

## Quick reuse order

1. Fill the **brand brief** (Phase 1).
2. Confirm the **6 clarifying questions** (Phase 2).
3. Gather **real reviews, photos, contact info, integration links** (Phase 3).
4. Build the **section blueprint** (Phase 4) with the **design tokens** (Phase 7).
5. Wire **modals, gallery, form, financing** (Phase 6) and the **AI chatbot** (Phase 6.5 — build the fallback first, then the serverless AI layer).
6. Apply the **content integrity rules** (Phase 8).
7. **Deploy** and run the **launch checklist** (Phases 9–10).
8. Re-read **Pitfalls** before go-live.
