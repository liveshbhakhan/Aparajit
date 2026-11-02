
---
Task ID: restore-from-20261020-backup
Agent: main (Super Z)
Task: Make a copy of the website from user-uploaded backup aparajit-backup-20261020-165805.zip (484 files, latest APARAJIT snapshot).

Work Log:
- Extracted /home/z/my-project/upload/aparajit-backup-20261020-165805.zip (first extraction was truncated by SIGPIPE from head pipe — re-extracted fully).
- Backup contents: full src/ (app, components, hooks, lib, middleware.ts), prisma/schema.prisma, public/ (logo, financial images, diary forest bg + ambience audio), package.json, bun.lock, next.config.ts, tailwind.config.ts, tsconfig, Caddyfile, .env.example, scripts/, .zscripts/, worklog.md. NOT included: .env and db/custom.db (excluded from backup by design).
- Initialized fullstack-dev environment (init script kept existing dir; boilerplate dev server auto-started).
- rsync'd backup into project root: src/, prisma/, public/, scripts/ (replaced); copied package.json, bun.lock, next.config.ts, tailwind.config.ts, tsconfig.json, components.json, postcss.config.mjs, eslint.config.mjs, Caddyfile, .env.example, .gitignore. Kept system-managed .zscripts. Removed redundant website-extracted/ + tool-results/.
- bun install → 30 packages installed (incl. @next-auth/prisma-adapter, bcryptjs, next-auth, next-intl).
- prisma generate (v6.19.2) + prisma db push → created fresh db/custom.db (864 KB schema).
- Ran scripts/auto-recovery.js → .env restored (DATABASE_URL=file:/home/z/my-project/db/custom.db, stable NEXTAUTH_SECRET 27037f1f…, NEXTAUTH_URL=http://localhost:3000); seeded demo users (seed-demo.mjs + seed-parent-demo.mjs + seed-demo-reports.mjs) + counsellor profile (Dr. Meera Iyer, PUBLISHED). DB now has 6 users (Aarav, Ananya, Sunita, Dr. Meera Iyer, Rohan Verma, Priya Nair).
- Restarted dev server via scripts/restart-dev.sh → 200 in ~4s.
- Fixed 1 pre-existing TS error: src/middleware.ts middleware(req: NextResponse) → middleware(req: NextRequest) (nextUrl property access). tsc --noEmit now clean (0 errors in src tree).
- ESLint: 52 pre-existing style problems (42 errors from newer react-hooks rules e.g. refs-during-render in use-ambience.ts) — non-blocking, code ran identically in the previous sandbox; left untouched per "preserve existing code" copy semantics.
- Verification (agent-browser): splash → landing renders (hero, Modules/Impact nav, Sign Up / Get Started, theme toggle); Get Started → role auth screen; student demo Use → Sign In → full student dashboard (Welcome back Aarav hero, 14-day streak/428 XP, L5 achievements, mood check-in Excited, Quick Actions, sidebar Smart Reporting/Emotion Care/Mission Control/Career Corner/Counselling/Overview/Messages/Search); parent demo → parent console (Sunita Sharma, viewing switcher Aarav Class 11 A + Ananya Class 8 B, SOS Emergency Alerts all-clear, Well-being/Counsellor Profile/Calendar/Competitions nav); admin demo → admin console (Audit Logs, School Analytics, Privacy Guard card).
- scripts/test-login.mjs: 5/5 logins succeeded (Student, Parent, Counsellor, Council, Admin).
- API checks in authenticated browser session: /api/dashboard/student 200 with live data (missions, streak, savings, cyberProgress, cyberScore); /api/notifications 200; /api/parent/overview → children:2; /api/dashboard/admin → 403 for parent session (RBAC enforced); /api/admin/health + /api/admin/reports-analytics 200 with live Prisma queries.
- Security: GET /db/custom.db → 404 (middleware path blocking works).
- dev.log: no runtime errors; landing 200.
- Screenshots saved to /home/z/my-project/download/: aparajit-restored-landing2.png, aparajit-student-top.png, aparajit-parent-dash2.png, aparajit-admin-dash.png.

Stage Summary:
- APARAJIT website fully copied/restored from the 2026-10-20 16:58 backup and running on the sandbox dev server (port 3000, Next.js 16.1.3 Turbopack).
- Fresh SQLite DB built from schema + demo-seeded (6 users, all demo logins work: Student@123 / Parent@123 / Counsellor@123 / Council@123 / Admin@123 on the demo.*@aparajit.edu.in accounts).
- Note: real user data from the previous sandbox was NOT in the backup zip (db file excluded) — only demo accounts are re-seeded. Schema is identical.
- 1 intentional code fix: middleware.ts NextRequest type (TS error only, no behavior change).

---
Task ID: livesh-merge
Agent: main (Super Z)
Task: Merge Livesh's APARAJIT (workspace-833adb3b tar, cashless canteen ecosystem) into my APARAJIT (base, design reference), preserve my UI, add Emotion Care 2-day inactivity enforcement, cinematic intro, dark-mode default, full QA + ZIP.

Work Log:
- Extracted Livesh's tar to /home/z/my-project/livesh-ref (excluded from tsconfig later). His stack: Next.js 16, 5 roles (student/parent/counsellor/admin/shop_vendor), route-based pages, 50 Prisma models, cashless canteen (wallet/POS/menu/invoices/dues/settlements), CinematicIntro component, dark default.
- Ran 2 Explore agents -> complete feature inventories of both codebases (saved in conversation).

FEATURE COMPARISON CHECKLIST (mine vs Livesh's):
ALREADY IN MINE (keep mine): 4 roles + Council Leader; Smart Reporting w/ SOS + anonymous threads + track-by-code; Emotion Care (mood checkin w/ stress+gratitude, breathing 3 patterns + audio cues, meditation, ambience, Daily Diary 2-page book w/ photos/voice/tags, weekly insights, tips); Mission Control (missions/habits/pomodoro/daily-gk); Career Corner (bigger than his); Counselling requests+appointments+chat model; parent wellbeing charts/calendar/competitions/announcements/counsellor profile; counsellor dashboards w/ SOS ack + report workflow + analytics + profile; admin users/classes/announcements/audit/analytics; notifications; XP/streak/badges; i18n infra; theme toggle.
MISSING IN MINE (to integrate from Livesh's):
1. Cashless Canteen ecosystem (models: Canteen, MenuCategory, MenuItem, StudentCard, StudentWallet, WalletLedger, DailySpendingLimit, CanteenTransaction(+Item), Refund, VendorInvoice(+Item), VendorSettlement, ParentInvoice)
2. VENDOR role: dashboard, POS (RFID/QR/manual resolve -> cart -> idempotent checkout -> confetti), Menu manager, Transactions+refunds, Invoices+settlement evidence, Dues management (verify parent invoices)
3. Student canteen page (card, stats, transactions, ledger - read-only)
4. Parent canteen controls (daily cap 0-5000, block/unblock card, history+ledger, demo banner)
5. Admin canteen (stats, settlement verify/reject queue, recent tx, cards)
6. Emotion Care extras: intensity slider UI, tag chips, MoodGarden, 28-day mood calendar, entry delete, Daily Chaos scenarios, Day Story wizard, Wellbeing Resources library
7. Parent "My Emotional Journey" report (live-computed, PDF export, conversation prompt favourites -> ParentPrompt model)
8. Cinematic intro (his exists; adapt to MY purple logo + user's exact timing spec)
9. Dark-mode default
DIFFERENT/KEEP MINE: report statuses (mine richer), anonymous-only reporting (mine by design - his identified mode skipped), ERC template system (his has NO authoring UI/student flow -> documented as not safely integrable; live parent journey report integrated instead), governance page (mine has audit+settings; overlaps), events registration (model-only in his, no UI -> skip), canteen school scoping (his School model; mine single-school -> direct relations).
NEW BUILD (in neither codebase): Emotion Care 2-day inactivity enforcement (backend+UI gate+recovery check-in, Asia/Kolkata day math, admin toggle via system-settings, never blocks SOS/counselling/reporting, recovery = quick check-in through the gate).

NEXT: schema -> auth/vendor -> canteen libs+APIs -> UI -> enforcement -> emotion care merge -> intro/dark -> seed -> QA -> ZIP.

---
Task ID: livesh-merge-implementation
Agent: main (Super Z)
Work Log (implementation):
- SCHEMA: added EmotionEntry.tags, fixed @@index([mood]) display artifact (was valid all along — terminal eats [m as ANSI), added User relations + models: DayStory, DailyChaosResponse, WellbeingResource, ParentPrompt, Canteen, MenuCategory, MenuItem, StudentCard, StudentWallet, WalletLedger, DailySpendingLimit, CanteenTransaction(+Item), Refund, VendorInvoice(+Item), VendorSettlement, ParentInvoice. db push OK (additive, no data loss).
- AUTH: Role union + VENDOR; store.ts AppRoute (+canteen/parent-canteen/parent-journey/admin-canteen/vendor-* routes, fixed missing life-skills/messages in hash allow-list); auth-screen VENDOR role card + demo account (demo.vendor@aparajit.edu.in / Vendor@123); dashboard-shell VENDOR_CONSOLE nav + role labels; page.tsx routes all new dashboards.
- LIB: src/lib/canteen.ts (IST day math, maskStudentId STU-xxxx, walletSnapshot, ledger writer, invoice numbering); src/lib/emotion-gate.ts (2-day rule engine: activity = EmotionEntry/WellnessSession(BREATHING|MEDITATION)/DiaryEntry/DayStory/DailyChaosResponse, grace for never-used accounts, admin toggle via sys-setting emotionCareEnforcementEnabled, fail-open on errors).
- APIS (14 new): canteen/menu, canteen/resolve-card (masked ids, 404 generic, 409 cardBlocked), canteen/checkout (idempotencyKey unique, $transaction, cap+balance enforced -> failed tx persisted w/o deduction, parent notification), canteen/refund, canteen/transactions, vendor/menu (POST/PATCH toggle|update), vendor/invoices (GET/POST settlement evidence -> notifies admins), vendor/settlements (PATCH admin verify|reject -> invoice paid/partially_paid), vendor/dues (GET stats + POST verify&mark-paid -> audit + parent notification), parent/spending-limit, parent/card-status, parent/canteen, student/canteen, admin/canteen, emotions/status (gate), emotions/entry DELETE, student/chaos POST+GET, student/day-story CRUD, wellbeing/resources, parent/prompts, parent/journey (live-computed ERC-style report, privacy: mood vocab only).
- GATE ENFORCEMENT: wellness/sessions POST returns 423 EMOTION_CARE_LOCKED for BREATHING/MEDITATION when locked (POMODORO exempt — Mission Control); emotions/checkin always allowed (it IS the recovery path); response includes gate status.
- UI (my design system): vendor-overview, vendor-pos (RFID keyboard-wedge listener, 3-step, confetti-free receipt dialog w/ failed state), vendor-menu (toggle/edit/add), vendor-transactions (+refund), vendor-invoices (+settlement dialog), vendor-dues (verify+mark paid), student-canteen (card visual/stats/ledger), parent-canteen (cap editor/card block/history/ledger/demo banner), parent-journey (period selector, 28d mood calendar, comparison, skills, wins, prompts copy+save, PDF print), admin-canteen (stats/settlement queue/cards), emotion-care-gate (calm 2-day gate w/ recovery check-in), mood-garden (animated garden + 28d grid + entry delete), daily-chaos (4 scenarios), day-story-experience (moments->feelings->style wizard + library), wellbeing-resources.
- EMOTION CARE MERGE: 8 moods, intensity 1-5 slider (was hardcoded 3), 8 tag chips, MoodGarden, 28-day calendar, entry delete, Daily Chaos, Day Story, Resources — all wired to /api/emotions/checkin (tags+intensity) etc. Original stress slider/gratitude/breathing/meditation/ambience/diary/insights/tips preserved.
- STUDENT DASHBOARD: mood strip + status fetch -> gentle locked card linking to gate when locked.
- CINEMATIC INTRO: src/components/landing/cinematic-intro.tsx (my purple logo aparajit-logo-official.png, spec timing 0-0.6 glow+particles, 0.6-1.8 logo, 1.8-2.6 trail, 2.6-3.5 aura, 3.5-4.5 fade to landing; Skip Intro button top-right keyboard-accessible, Escape skips, sessionStorage aparajit-intro-played, reduced-motion skip, timers/listeners cleaned). CSS appended to globals.css (intro-* prefix). Integrated in landing-page.tsx.
- DARK DEFAULT: providers.tsx defaultTheme="dark" (stored pref wins).
- SEED: scripts/demo/seed-canteen.mjs (additive+idempotent: vendor, canteen, 5 categories/16 items, cards+wallets+caps for Aarav+Ananya, 6 success + 1 failed tx, vendor invoice w/ submitted settlement, 4 parent invoices, 5 wellbeing resources). auto-recovery.js now seeds it too.
- Fixed auditLog signature (object) in 4 canteen routes; fixed ParentStudent.isActive (field doesn't exist in my schema — link re-verify by existence); tsc 0 errors.

---
Task ID: livesh-merge-qa-final
Agent: main (Super Z)
Work Log (QA + fixes):
- scripts/test-merge.mjs: comprehensive E2E suite — 41/41 PASS covering: vendor login/resolve (masked STU•xxxx, generic 404 unknown card, 403 for non-vendors), checkout (atomic, idempotent replay, daily-cap enforced w/ persisted failed tx), parent controls (cap 0-5000, card block -> 409 at POS, unblock), refund (ledger + wallet), settlement submit -> admin verify -> invoice paid, dues mark-paid + parent notification, emotion gate (grace for never-used, LOCKED at exactly 2/4 days inactive, open at 1 day, 423 on BREATHING/MEDITATION while locked, POMODORO exempt, SOS + reports NOT blocked, recovery check-in unlocks + no fabricated records), chaos/day-story/resources persistence, parent journey computation, prompt dedupe.
- Fixes found during QA: reports/create now returns 415 for non-multipart bodies (was 500 crash); dashboard-shell theme toggle got aria-label; test-script bugs fixed (session.user.role shape, SOS "text" field, FormData for SOS/report, RFID card 0002 = demo.student, cap pre-raise for day-fresh runs).
- Browser QA (agent-browser, dark + light, desktop + 390px mobile): cinematic intro (glow/particles -> logo scale -> light trail -> aura -> fade to ORIGINAL landing; Skip Intro works; sessionStorage replays correctly), dark-by-default ("dark" class on fresh session), vendor console (overview stats/top items, POS full flow: RFID resolve -> cart -> charge -> receipt w/ items + new balance), student canteen (cap progress, purchases w/ failure reasons, ledger), parent canteen (cap editor, card block buttons, history), parent journey (30-day mood calendar, feelings chips, skills, wins, counselling status), admin canteen (stats, settlement queue -> Verify dialog -> pending:0), emotion care (8 moods, intensity, tags, mood garden, 28-day grid, entry delete, chaos, day story, resources; original breathing/meditation/diary/insights intact), gate E2E in browser (gate.demo test account: locked -> calm gate -> one-tap recovery -> +5 XP -> unlocked), theme toggle both modes, mobile layout.
- next/image warning fixed in intro (width/height auto).

---
Task ID: livesh-merge-delivery
Agent: main (Super Z)
Stage Summary:
- MERGE COMPLETE. Livesh's features fully integrated into my APARAJIT with original design preserved; 41/41 E2E API tests pass; 6/6 role logins; browser QA passed on all new surfaces in dark + light + mobile.
- Deliverable: download/aparajit-merged-final-20261020.zip (20.3 MB, 492 files, integrity-verified; excludes node_modules/.next/dev.log/.env/db/livesh-ref; includes .env.example).
- Non-integrated reference features (documented): ERC template authoring (reference has NO student-facing UI or admin editor — only a read-only viewer + seeded data), EventRegistration UI (model-only in reference), identified-mode anonymous reporting (my project is anonymous-by-design), governance page (covered by existing Admin Audit + Settings), top-up/payment gateway (reference is demo-credit only; my demo banner states this explicitly).
- Dev server restart verified (200 + 6/6 logins) after a silent process death post-QA.

---
Task ID: intro-theme-login-fix
Agent: main (Super Z)
Task: Fix (1) invalid-credentials problem, (2) intro purple theme → match emerald web theme, (3) duplicate overlapping "APARAJIT" texts in intro.

Work Log:
- Root cause of 401 "invalid credentials": db/custom.db had 0 users (DB wiped; schema intact, 71 tables). .env had lost NEXTAUTH_SECRET/NEXTAUTH_URL (only DATABASE_URL remained).
- Ran scripts/auto-recovery.js → .env restored (stable secret) + all seeds re-run (demo, parent, reports, canteen, counsellor profile). Verified scripts/check-db.mjs (new helper) → users present.
- scripts/test-login.mjs → 6/6 role logins succeed (Student/Parent/Counsellor/Council/Admin/Vendor). Wrong password correctly returns 401 (no crash).
- Browser UI E2E: landing → Student Login → demo.student@aparajit.edu.in/Student@123 → dashboard "Welcome back, Aarav" with live data (14-day streak, 428 XP, mood Excited, My Canteen nav).
- Intro theme fix: web theme is deep emerald (oklch 0.52 0.14 165 ≈ #047857; dark accent ≈ #34d399) but intro used purple #7200FF/#B56CFF. Recolored ALL intro elements to emerald: glow radial-gradients, logo drop-shadow + keyframes, aura, particles (#34D399 + emerald shadow), trail SVG gradient (#047857→#34D399→#047857), skip-button hover/focus. Files: src/components/landing/cinematic-intro.tsx, src/app/globals.css (intro-* block). grep confirms zero purple refs remain. Official purple logo asset untouched (brand asset, never redrawn).
- Duplicate text fix: logo PNG already contains "APARAJIT" + official tagline; the separate animated wordmark overlay ("APARAJIT / Fearless Minds · Safer Schools" at bottom:19%) overlapped it → removed entirely. Logo size bumped 230→340 so its built-in wordmark reads better. Alt text now carries the tagline.
- Verified in browser (1440×900): intro glow emerald; logo shows single APARAJIT; auto-finish → original landing (dark default, emerald); Skip Intro button click removes stage + sets sessionStorage flag (replay guarded); intro never plays over dashboard.
- tsc --noEmit: 0 errors in src tree (remaining hits are system examples/ + skills/ folders only). dev.log: no runtime errors.

Stage Summary:
- All three user-reported issues fixed and verified end-to-end (API + browser UI, fresh session + skip path).
- Demo credentials working again: 6/6 roles. Database re-seeded (additive, idempotent seeds; no data tampering).

---
Task ID: homepage-merge-zip
Agent: main (Super Z)
Task: Merge Livesh's home-page sections into MY landing page (my emerald theme, my design language), then deliver updated ZIP.

Work Log:
- Compared Livesh's src/app/page.tsx (418 lines) with my landing-page.tsx: his extras = sticky nav + mobile hamburger, hero quick-demo login card, animated stats strip, 8 feature cards (mine had 4), About section with 3 stat cards, 3-column footer with privacy boundaries + demo list + disclaimer.
- NEW: src/components/landing/animated-counter.tsx (ease-out counter, en-IN grouping).
- landing-page.tsx (all in my emerald design system):
  * Sticky header (bg-background/80 backdrop-blur, border-b) + mobile hamburger panel (links + Sign Up/Get Started); removed root overflow-x-hidden (broke position:sticky), hero section keeps its own overflow-hidden.
  * Nav links now Modules/Demo/For Whom/About (anchors with scroll-mt-24).
  * Stats strip after hero cards: 6 role dashboards, 5 demo accounts, 16 canteen items, 8 wellbeing tools (honest counts, AnimatedCounter).
  * Modules 4→8: added Parent Connect, Wellbeing Report, Cashless Canteen, Vendor Console.
  * NEW #demo section: 5 role cards (mirrors login-screen demo panel) + "Use demo" → sessionStorage aparajit-demo-prefill → navigate(login).
  * NEW #about section: "Built for the wellbeing of every student." + 3 stat cards (6/100%/0) + Explore-the-demo CTA.
  * Footer upgraded to 3 cols: brand blurb / demo accounts list / privacy boundaries (lucide icons) + disclaimer bar.
- auth-screen.tsx: consumes aparajit-demo-prefill on mount (once, self-cleaning) → selectRole + prefill email/password. Landing one-click demo = prefilled sign-in, user still presses Sign In.
- Mobile 390px: found + fixed horizontal scroll (nav action buttons overflowed; Sign Up/Get Started now hidden below sm — they live in the hamburger panel). Verified NO-HSCROLL 390=390 + hamburger panel works.
- QA: tsc 0 errors in src; browser walkthrough (dark, desktop+mobile): hero, stats, 8 modules, demo cards → one-click demo → prefilled login → Student dashboard OK; About + footer render; no console errors; 46/46 test-merge.mjs PASS; 6/6 logins; dev.log clean.
- Test-suite hardening: test-merge.mjs now self-heals menu availability (a stale "Samosa (2 pc) unavailable" toggle from an old QA session had broken checkout; restored in DB + self-heal PATCH added → deterministic runs).
- Restored missing .env.example on disk (template only) and added it to ZIP; updated scripts/generate-backup-zip.sh (excludes livesh-ref/ + tool-results/, output prefix aparajit-homepage-updated-*).

Stage Summary:
- Livesh home-page features merged into my landing page with the emerald theme preserved; all original hero/branding untouched.
- Deliverable: download/aparajit-homepage-updated-20261021-040014.zip (20 MB, 509 files, integrity verified; excludes node_modules/.next/.env/db/livesh-ref/skills/examples/upload/logs; includes .env.example). Old zips removed.

---
Task ID: national-tech-docs
Agent: main (Super Z)
Task: Create complete national-level technical documentation for APARAJIT (AWES Innovation Hack Fest 2026-27): text version + editable DOCX, evidence-based, 25 chapters + appendices.

Work Log:
- Inspected project read-only: package.json (Next 16.1.1/React 19/Prisma 6.11/next-auth 4.24/Tailwind 4/zod 4/zustand 5...), prisma/schema.prisma (71 models, 1399 lines), 111 API route handlers in 34 groups (method-level inventory), 259 TS/TSX files / 56,159 LOC / 37 feature components, middleware (CSP headers, blocked paths, cross-origin denial), auth.ts (bcrypt, JWT live re-sync, production secret guard), canteen.ts/emotion-gate.ts/xp.ts/rate-limit.ts, i18n (12 langs), vendor POS keyboard-wedge listener (vendor-pos.tsx L102-125), seeds (RFID-APS-0001/0002, QR-APS-0001/0002).
- Verified NO AI/LLM integration exists (code comments confirm assistant + AI report analysis REMOVED per spec) -> Ch12 documents honest no-AI status + planned companion policy; fig61 corrected to remove AI layer.
- Fresh evidence: ran scripts/test-login.mjs (6/6 roles) + scripts/test-merge.mjs (42 passed, 0 failed) on 21 Oct 2026; results quoted in Ch18.
- Captured 11 fresh 1440x900 screenshots via agent-browser (landing, auth, 5 dashboards, emotion care, student canteen, parent canteen, vendor POS+overview) + reused 390px mobile capture.
- Rendered 11 Mermaid diagrams (emerald theme, 30px font, mmdc 12) -> docs/aparajit-doc/diagrams/*.png (fixed reserved-word CLASS bug, rebalanced aspect ratios 0.2-1.18, fixed wallet field types balance/totalAmount Float).
- Wrote text version: docs/aparajit-doc/APARAJIT_Technical_Documentation.md (~23,100 words, 25 chapters, 40+ tables, 23 figures, 40 viva Q&A in Appendix L). Honesty rules enforced: statuses labelled, placeholders 【...】 for team/reader model, no secrets, no fabricated stats.
- Built DOCX pipeline scripts/docgen/{lib,generate,postprocess,fix-toc-dup}: R1 cover (light bg + official logo unmodified, calcTitleLayout/calcCoverSpacing), 3 sections (cover margin-0 / front matter Roman / body Arabic start=1), real Heading styles (175 headings), tables (percentage widths, tableHeader+cantSplit+margins, emerald header fill), figures (aspect-preserved, max 575px), code blocks (shaded+accent), headers (small logo + title) and footers (PAGE fields), TOC field + refresh hint; postprocess patches footer instrText ROMAN/arabic + strips empty pgNumType; fix-toc-dup removes duplicate first TOC entry left by placeholder script.
- QA: postcheck.py 8/9 pass 0 errors (1 benign warning: mixed line spacing from table cells vs body - intentional); LibreOffice PDF render = 101 pages; visually inspected 12 pages incl. cover, doc control, TOC, figures, tables, code, checklist, final page - no overflow/clipping/blank pages.
- Delivered: download/APARAJIT_National_Level_Technical_Documentation_2026-27.docx (6.9 MB, editable) + same-named .pdf (4.4 MB verification render) + text .md in docs/aparajit-doc/.

Stage Summary:
- Complete evidence-based technical documentation delivered in both requested formats, same substantive content, emerald branding + official logo preserved, 101-page print-ready result.
- Open items flagged inside doc (team inputs): team member names/classes, RFID reader model/procurement status, council-leader transition note.

---
Task ID: smart-library-redesign
Agent: main (Super Z)
Task: APARAJIT 2.0 master upgrade — completely remove the Cashless Canteen, build the APARAJIT Smart Library Management System (RFID circulation + Career Corner integration), redesign the landing page, animated logo, design system, seeds, tests and full QA.

Work Log:
- AUDIT: mapped every canteen touchpoint (14 schema models + User relations L103-115, canteen.ts lib, 13 API routes, 9 UI components, store/page/shell/auth wiring, landing sections, seed-canteen, test-merge). Found shared dependency: istDayKey/istDayStart used by emotion-gate + parent/journey → extracted to NEW src/lib/day.ts (+ istMonthKey) and repointed imports; canteen.ts deleted.
- DB SAFETY: backed up db/custom.db → db/backups/custom-pre-library-20261021-130656.db before db push. Discovered the sandbox DB had ALREADY lost all demo users pre-session (backup had 0 users) — recovered via auto-recovery.js + seeds; also found secondary demo students (tvisha/kavya/vivaan/harisha) missing → seed-library.mjs now ENSURES them (self-contained, per-entity idempotent, RESET=1 env flag for pristine re-seeds).
- SCHEMA: dropped all 14 canteen models; added User.admissionNo + 12 library models (CareerTag, Book, BookCopy, LibraryCard, Loan, Reservation, ExtensionRequest, BookReview, ReadingMilestone @@unique([studentId,type]), ReaderOfMonth @@unique([month]), LibraryNotification, LibraryProfile). db push OK.
- ROLES: VENDOR → LIBRARIAN across auth.ts Role union, store.ts (SessionUser + AppRoute routes library/parent-library/librarian-*), dashboard-shell (LIBRARIAN_CONSOLE nav, role labels/badges), auth-screen (role card + demo account demo.librarian@aparajit.edu.in/Librarian@123), page.tsx routing. XP registry += LIBRARY_REVIEW (10, cap 2/day) + LIBRARY_MILESTONE (20, one-time).
- BACKEND (17 routes): student — library/overview, catalogue (search/filter/tag/availability/sort/pagination + copy counts + ratings), books/[id] (copies/reviews/related), reservations (READY-hold or WAITING queue, cancel releases copy), extend (transparent rules: +5d, 1/loan, no-overdue, reservation-conflict→librarian review, cap/overdue→409, auto-approve→due updated in tx), reviews (borrow-eligibility enforced, one/book, edit/delete, XP), interests (validated career slugs), recommendations (rule-based + reasons; interests/quiz-tags/borrow-categories; excludes read books). librarian — desk/resolve (keyboard-wedge RFID→profile+eligibility), desk/issue (card/copy/limit/overdue/duplicate-title guards, $transaction, audit), desk/return (closes loan, reservation→READY+notify, condition updates, milestones), requests (queue + approve/reject/fulfil/cancel + notifications + audit), inventory/books (stats+catalogue+create+update), inventory/copies (add; condition/status guards), career-tags (7 pathways, assign), reader-of-month (transparent scoring from real circulation, publish-once), notifications (2-day due reminders; IN_APP = real delivery; WHATSAPP/SMS recorded FAILED with honest reason, never "delivered"), reviews (moderation). parent — parent/library (children via ParentStudent, loans/due/overdue/reservations/ROTM only).
- UI: book-cover.tsx (generated covers + StarRating + DueChip); student-library.tsx (Overview/Catalogue/For You tabs, stat cards, extension dialog, review dialog, ROTM spotlight, reservation queue, milestones); student-catalogue.tsx (working search/filters/pagination/detail dialog w/ classmate reviews); student-foryou.tsx (interest picker + explained recommendations + Career-quiz localStorage→tag mapping); librarian-desk.tsx (Overview + RFID desk w/ labelled TEST MODE, resolve→profile, issue/return + inline feedback); librarian-operations.tsx (requests queue + notification centre); librarian-inventory.tsx (inventory analytics, add title/copies, condition mgmt, career tagging, ROTM ranking+publish); parent-library.tsx (privacy-first child view); career-reading-lists.tsx → NEW "Reading Lists" tab in Career Corner (7 pathways, tagged books, deep-links into library).
- LANDING REDESIGN: full rewrite of landing-page.tsx — premium nav (Modules/Our Impact/Smart Library + Sign In/Get Started), two-column hero (eyebrow "FEARLESS MINDS. SAFER SCHOOLS.", H1 "Every Student Deserves a Safer, Brighter Future." with emerald+gold gradient, CTAs Explore APARAJIT / Discover Smart Library, crafted live ecosystem preview built from real module surfaces), 6-module showcase with flagship Smart Library card (gradient border), Smart Library spotlight section (#smart-library; 3 benefits + RFID desk preview + demo CTAs), Impact & Trust (qualitative + verifiable structural counters only — NO invented usage stats), demo strip (5 roles incl. Librarian), final CTA ("Build a School Experience Where Every Student Can Thrive."), 4-column footer w/ privacy boundaries. Cinematic intro preserved.
- ANIMATED LOGO: animated-logo.tsx — one-time-per-session reveal (emerald glow bloom → scale/rotate reveal of the REAL logo asset → single emerald→gold light sweep → motionless settled state), subtle hover glow, prefers-reduced-motion honoured, rAF-deferred state (no hydration mismatch, no layout shift). CSS design system added to globals.css (al-* tokens: gold text/ring, ecosystem panel, glass chips, shelf cards, scanline, flagship border, nav shadow, styled scrollbars).
- SEEDS: seed-canteen.mjs deleted; seed-library.mjs created (librarian, 7 pathways, 20 titles/42 copies incl. 1 WORN + 1 LOST, RFID cards RFID-APS-0001..0004, realistic circulation incl. due-in-2-days + overdue + on-time/late returns, WAITING reservation, PENDING extension, 2 reviews, starter milestone, wellbeing resources relocated from canteen seed); auto-recovery.js now calls it. IST-midnight due dates match lib/library.ts convention.
- TESTS: test-login.mjs 6/6 roles (librarian replaces vendor). test-merge.mjs rewritten → canteen-removal suite (APIs 404, tables dropped, vendor retired, librarian RBAC, RFID resolve, parent scope) + emotion gate + parent journey = 34/34 PASS. NEW test-library.mjs = 71/71 PASS (overview, catalogue, reservations, extension rules, reviews, recommendations, desk issue/return + guards, queue decisions, ROTM publish-once, honest notification delivery, career tags, inventory, parent scope). QA artifacts (test book, test reminders) removed; demo data RESET to pristine.
- LINT/TSC: tsc 0 errors in src. Fixed React-Compiler set-state-in-effect in animated-logo + landing + career-reading-lists (rAF/deferred + useCallback patterns); remaining lint errors are pre-existing baseline (career-corner memoization, diary refs, rules-of-hooks naming in auth-screen L518, etc.).
- BROWSER QA (agent-browser): intro → landing hero/spotlight/impact/footer (dark + light), student demo→dashboard→Smart Library (overview live data, extension auto-approve toast + due-date update, catalogue, For You w/ reasons), librarian demo→RFID desk (test-mode banner, resolve Aarav w/ admission no, issue LIB-0041→3/4 loans, return→2/4), Career Corner Reading Lists, parent library (overdue banner), mobile 390px (no h-scroll, hamburger menu works). 6/6 logins final. dev.log clean (no runtime errors; only mid-edit hot-reload noise). Final grep: zero functional canteen references in src (2 "discontinued" comments only).

Stage Summary:
- Cashless Canteen is FULLY removed (schema, APIs, UI, nav, seeds, tests, roles). Vendor role replaced by LIBRARIAN.
- APARAJIT Smart Library is fully implemented and demo-ready: RFID desk (keyboard-wedge + labelled test mode), title/copy inventory, reservations with queues, fair +5-day extensions (auto-approve vs librarian review), borrow-gated reviews, transparent recommendations linked to 7 career pathways, Career Corner "Reading Lists" tab, Reader-of-the-Month engine, honest notification centre, parent due-date view, RBAC + audit logging server-side.
- Landing page completely redesigned (premium emerald/navy/ivory/gold system, animated logo, real-product visuals, no fake metrics). All other modules preserved.
- Verification: 34/34 regression + 71/71 library E2E + 6/6 logins + tsc clean + browser QA on desktop/mobile/dark/light. DB backed up at db/backups/custom-pre-library-20261021-130656.db.
- Honest limits: WhatsApp/SMS channels intentionally report FAILED until a provider is configured; RFID works via keyboard-wedge readers (test mode clearly labelled when no hardware); recommendations are rule-based (no AI claim).

---
Task ID: smart-library-2-ultimate
Agent: main (Super Z)
Task: AWES National Hackfest 2026 "Ultimate" Smart Library build-out: real book covers, premium animations, in-loan Rate & Review with key takeaways, separate book-suggestion box (student + librarian queue), and the anti-cheat Reader of the Month system (Inspired Me voting, documented scoring formula, frozen shortlist, librarian Approve & Spotlight). Plus em dash removal from all user-facing copy.

Work Log:
- AUDIT: mapped existing Smart Library (17 routes, 9 components) against the new brief; identified gaps: no real covers, no takeaways/votes, ROTM was raw-circulation-based publish-#1, no suggestion system.
- SCHEMA (backup db/backups/custom-pre-takeaways-20261021-165117.db): +5 models (BookSuggestion, KeyTakeaway @@unique(bookId,studentId), TakeawayVote @@unique(takeawayId,voterId), RotmShortlist @@unique(month,version,rank), cover fields on Book: coverUrl/coverSource/coverCheckedAt), ReaderOfMonth extended (helpfulVotes, featuredBookId, featuredTakeawayText). prisma db push OK.
- REAL COVERS (src/lib/book-covers.ts): multi-provider resolver (Open Library ISBN covers -> OL title search -> Google Books), every candidate VERIFIED (200 + image/* + >1200 bytes; OL blank-pixel rejected). Cached on Book rows. Wired into: librarian add-title, new POST /api/librarian/inventory/covers backfill (batch 40, 400ms polite delay, honest per-title notes), seed. SANDBOX REALITY (tested): Open Library unreachable, Google Books 429 quota, Wikipedia unsuitable -> generated branded fallbacks remain; integration is real and reports honestly.
- ANTI-CHEAT ROTM: formula in src/lib/library.ts ROTM_RULES = (2 x valid unique votes, capped 20/takeaway) + (3 x eligible on-time returns) + (1 x eligible takeaways, max 10/student); takeaways must sit on COMPLETED loans; self votes/inactive voters/rejected takeaways never count; deterministic tie-break (distinct voters -> on-time -> takeaways -> name). Single-source ranking engine src/lib/rotm.ts (computeRotmRanking) feeds route + shortlist + frozen breakdowns. Route rewritten: GET (rules+ranking+shortlist+published), POST GENERATE_SHORTLIST (freezes top 3, version bumps on regenerate, closed after publish), APPROVE (one per month, records approver + audit + notifies), DECLINE.
- TAKEAWAYS + VOTING: POST/DELETE /api/library/takeaways (completed-loan eligibility enforced, min 15 chars, whitespace rejected, one per book via upsert-edit), GET feed (approved, excludes own), POST vote with session identity (self-vote 403, DB-unique, documented toggle-off policy, rate-limited 30/min).
- REVIEWS UPGRADED: /api/library/reviews POST/PATCH accept optional takeaway (+loanId); eligibility + duplicate guards kept; takeaway created transactionally only for RETURNED loans.
- SUGGESTIONS: student POST/GET /api/library/suggestions (10 categories, duplicate-open-title guard, 5/10min rate limit), librarian GET/PATCH /api/librarian/suggestions (status machine PENDING/UNDER_REVIEW/APPROVED/ORDERED/DECLINED + response, audit + in-app notify). Student sees status + response.
- UI STUDENT: book-cover.tsx renders verified real covers (lazy, object-cover, alt, onError -> branded fallback); StarRating upgraded (hover preview, radio group, star-pop). student-library.tsx rebuilt: Rate & Review on every borrowed + returned row, premium review modal (cover, stars, char counts, takeaway field locked until return, saved state), Takeaways feed with Inspired Me optimistic voting, Suggest a Book card (form + status chips + librarian response), ROTM hero card (featured book cover + winning takeaway + gold sheen + sparkles + score explainer, clean pre-approval state), AnimatedNumber stat cards, lib-enter tab transitions. Catalogue: card lift/cover-zoom hover, key-takeaways block in detail dialog.
- UI LIBRARIAN: new Suggestions page (nav + route librarian-suggestions) with status filter chips + review dialog; Reader of the Month page rebuilt (frozen shortlist vN with per-candidate breakdown + featured takeaway, Regenerate, Approve & Spotlight confirm, Decline, published hero, live reference ranking, formula card); Inventory "Fetch real covers" button with honest toasts.
- ANIMATIONS: globals.css +lib tokens (lib-card lift, lib-cover zoom, lib-enter, star-pop, lib-success pulse, rotm-celebrate sheen + rotm-sparkle, inspired-pop, suggestion-settle, lib-shimmer), ALL disabled under prefers-reduced-motion.
- EM DASHES: scripts/remove-em-dashes-src.py replaced U+2014/U+2013 across 53 src files -> 0 remaining (verified twice).
- SEEDS: seed-library.mjs extended (3 takeaways + 5 cross-student votes aligned with REAL returned loans, previous-month published award for history, 3 suggestions in PENDING/APPROVED/ORDERED with responses, honest cover-resolution attempt); RESET=1 clears all new tables; fixed integrity flaw (tvisha review/takeaway moved to a book she actually returned).
- TESTS: NEW scripts/test-library2.mjs = 51/51 PASS (takeaway eligibility/whitespace/non-borrowed 403, self-vote 403, toggle semantics, review create/edit/duplicate-409, suggestion full loop + RBAC + duplicate 409, ROTM formula-consistency + determinism + shortlist freeze/versioning + approve-once + unapproved-hidden, covers honesty). test-library.mjs updated to anti-cheat flow + book-detail takeaways = 74/74 PASS on pristine seed. test-merge 34/34, logins 6/6. tsc 0 errors, eslint 0 errors on all touched files, production build PASS.
- BROWSER QA (agent-browser): student: library overview, Inspired Me toggle round-trip, review dialog + submitted toast (+10 XP), suggestion box end-to-end, ROTM winner hero after librarian approval; librarian: suggestions queue (mark Ordered + response), ROTM generate -> v1 shortlist -> Approve & Spotlight -> published hero; mobile 390px clean (fixed SectionTitle hint clipping). Fixed shortlist candidate-name rendering (nested student). Screenshots in download/qa2-*.png.

Stage Summary:
- Smart Library is now the full AWES-spec product: verified-cover catalogue (honest fallback), borrow-gated reviews with key takeaways, peer voting with DB-level anti-cheat, auditable monthly recognition with librarian approval gate, and a complete suggestion pipeline.
- ROTM final formula: Monthly Quality Score = 2 x valid unique Inspired Me votes (cap 20/takeaway) + 3 x eligible on-time returns + 1 x eligible takeaways (cap 10); issuing/renewing alone earns nothing; deterministic tie-breaks; frozen versioned shortlists; one librarian approval per month, audit-logged.
- Honest limits: no verified covers retrievable from this sandbox (OL unreachable, GB 429); WhatsApp/SMS notifications still report FAILED until a provider is configured; RFID remains keyboard-wedge + labelled test mode.
- Demo state reseeded pristine: librarian can demo generate-shortlist -> approve live; previous-month award visible in history.

---
Task ID: diary-promotion-messaging-update
Agent: main (Super Z)
Task: APARAJIT update batch: (1) Daily Diary past-entry calendar + coffee pages, (2) admin academic promotion, (3) permanent slider/recording loop fix, (4) Computer Science quiz option, (5) Olympiad + entrance exam approximate months with source links, (6) remove cyber topics from Student Console search, (7) fix counsellor messages not reaching student messaging, (8) full audit + ZIP backup.

Work Log:
- RECOVERY: sandbox DB had been reset by today's env init (0 users) -> ran scripts/auto-recovery.js (demo users + reports + library + counsellor profile reseeded).
- SCHEMA (backup db/backups/custom-pre-promotion-20261022-093506.db): +DiaryEntry.tags (JSON), +User.academicSession, +User.graduatedAt. Additive db push, no data loss.
- DIARY LOOP ROOT CAUSE: VoiceRecorder auto-save effect rebuilt the recording object every run -> parent state update -> new `existing` identity -> effect re-fire = infinite "Maximum update depth exceeded". Fix: propagate only real changes (new recording / deletion). Verified with 21-move slider drag + mute/unmute x4 stress test: zero console errors.
- DIARY CALENDAR FIX: calendar popover was body-portal (z-50) under the diary overlay (z-[80]) -> invisible. Added `portal` prop to ui/popover.tsx (default true, backwards compatible) and rendered the diary calendar inline. Verified clickable in browser.
- DIARY CALENDAR UX: future dates disabled (disabled={{after: now}}), "Viewing a past entry" + "Return to Today" chip when not today, real-data empty-state note "No diary entry found for this date...", tags now persisted via API zod + adapter.
- COFFEE PAGES: --forest-paper #f3e3cd (dark #ecd9ba), lines #d9bf9c/#cfb188, ink #3a2a18/#332412. Diary-scoped tokens only.
- PROMOTION: new /api/admin/promotion (GET preview with classes/sessions/proposal, POST apply). Per-student tx re-validation (active STUDENT, class still matches source, not graduated) => double-submit SKIPS safely. XII -> GRADUATED sets graduatedAt, keeps account+records. Single ACADEMIC_PROMOTION audit entry with actor/sessions/results. New admin-promotion.tsx 3-step wizard (setup/review/confirm/summary) opened from a "Promote Students" button in User Management. Fixed PATCH /api/admin/users classLabel to accept "Class 9 - A" and return class+section.
- QUIZ: Q1 + "Computer Science & Coding" (appended, saved results stay valid) -> new CAREER_AREAS.technology + engineering mapping.
- EXAM MONTHS: data.ts interfaces + records: 8 olympiads + 11 exams with usualMonths + stageNote (researched: SOF sets Nov-Dec/Sep-Nov, IOQM Sep/RMO Nov/INMO Jan, JEE Jan+Apr, NEET May, CUET May-Jun, CLAT Dec, CAT Nov, NDA/CDS Apr+Sep, AFCAT Feb+Aug, NATA Apr-Jul, CA Foundation Jan/May-Jun/Sep). Exact required disclaimers rendered in Olympiads + Entrance Exams; official organiser links on every row; parent opportunities view shows months too.
- SEARCH: search.tsx drops CYBER_LESSONS + CYBER category (also filters NCO whose subject is cyber) -> "cyber"/"NCO"/"phishing" searches return empty; other categories unaffected; Cyber Shield module untouched.
- MESSAGING ROOT CAUSE: anonymous reports (reporterId null, incl. 10 of 19 seeded demo reports) swallowed counsellor messages silently. Fixes: /api/reports/list now returns hasReporter boolean; counsellor dialog warns + disables Send on anonymous reports; POST /api/reports/messages rejects anonymous sends server-side (400); seed-demo.mjs + live DB: 4 demo reports attached to demo student (2 stay anonymous); dashboard-shell adds live unread badge on student Messages nav (30s poll).
- TESTS: NEW scripts/test-update-workflows.mjs = 54/54 PASS (diary multi-date save/index/retrieval/tags/privacy/no-overwrite, promotion apply/skip/double-submit/graduate/audit/RBAC, messaging full loop incl. 403 cross-student + anonymous 400, search source checks; fixtures auto-cleaned). Regressions: test-login 6/6, test-merge 34/34, test-library 74/74. tsc 0 errors in src; eslint clean on all touched files (4 pre-existing career-corner baseline errors remain).
- BROWSER QA (agent-browser): coffee pages light+dark (computed #f3e3cd), calendar dot on Oct 19 -> past entry opens w/ Return to Today, empty-state note, future dates disabled, slider stress = no update-depth errors, mic-denied error honest, theme toggle; quiz CS option -> Engineering #1 (3/5); olympiad/explorer months + disclaimers + links; search cyber-empty; promotion wizard full walk-through (cancelled pre-apply, API tests covered apply); counsellor anonymous-warning + disabled send; message sent -> student inbox desktop+390px mobile w/ unread badges -> student mobile reply -> counsellor sees REPORTER reply. QA messages removed after.
- DELIVERABLES: download/aparajit-updated-20261022.zip (35 MB, integrity OK, excludes .env/db/secrets, includes RELEASE-NOTES.md + TEST-REPORT.md), download/APARAJIT-UPDATE-SUMMARY.md, download/APARAJIT-TEST-REPORT.md, QA screenshots download/qa-*.png.

Stage Summary:
- All 9 requested features implemented and verified end to end; honest limits disclosed (real-mic recording path untestable in headless sandbox, WhatsApp/SMS still FAILED until provider configured, exam months labelled approximate by design).
- Demo data state: 1 intentional past diary entry (2026-10-19) kept for calendar demo; QA messages removed; promo test fixtures deleted; demo reports 4 linked to demo student for messaging demo.

---
Task ID: permanent-credentials-fix
Agent: main (Super Z)
Task: Solve the recurring "invalid credentials" (401) problem permanently.

Work Log:
- ROOT CAUSE (confirmed live): the sandbox environment init (.zscripts/dev.sh) runs `bun install → bun run db:push → bun run dev` on every session boot; db/custom.db gets recreated EMPTY (0 users) and .env is stripped to DATABASE_URL only. All 6 demo logins then return 401. Recovery had been manual (auto-recovery.js) and was needed 4+ times (worklog: restore-from-backup, intro-theme-login-fix, smart-library-redesign, diary-promotion-messaging-update).
- Reproduced: server 200 but test-login.mjs 0/6 (DB 0 users, .env stripped).
- Previous partial protections found: start-server.js preflight + heartbeat-heal.js daemon (never invoked by the sandbox boot path), auth.ts stable dev secret fallback. The sandbox path (`bun run dev`) and bare `next dev` had NO protection.
- PERMANENT FIX — 4 new layers, every boot path covered (any one alone heals):
  1. src/instrumentation.ts (NEW): Next.js register() hook — runs once per server boot (dev + prod standalone) BEFORE the first request; guards NEXT_RUNTIME=nodejs; never throws.
  2. src/lib/boot-guard.ts (NEW): restores missing DATABASE_URL/NEXTAUTH_SECRET/NEXTAUTH_URL into .env AND process.env for the current boot (Next loads .env before instrumentation, so process.env injection is what saves the running boot); memoized on globalThis; delegates DB/seed recovery to auto-recovery.js (single recovery brain); node→bun exec fallback.
  3. package.json `dev` script: preflight `node scripts/auto-recovery.js || echo …;` before `next dev` — this is the exact command .zscripts/dev.sh runs (the critical gap now closed).
  4. scripts/restart-dev.sh: same preflight before starting next dev.
- scripts/auto-recovery.js HARDENED: (a) creates db/ if missing; (b) NEW: if DB unreachable/tables missing → `prisma db push` (recreates schema + client) then retries — previously it silently gave up in exactly the worst case; (c) checks per-DEMO-ACCOUNT presence (6 emails via new scripts/demo/check-demo-accounts.cjs) instead of `count===0`, so partial wipes and post-signup DBs still heal; (d) counsellor-profile inline blob extracted to scripts/demo/seed-counsellor-profile.cjs; (e) bun→node runner fallback; (f) always exits 0 (can never block a boot).
- .env.example written (was empty/wiped): documents the 3 required vars + auto-restore behavior.
- start-server.js + heartbeat-heal.js left as-is (pre-existing extra layer for the durable-launcher path).
- VERIFICATION (3 boot-path simulations, wipe = .env stripped + fresh 0-user DB):
  * Test A — bare `next dev` (ONLY instrumentation): boot-guard restored .env, seeded 6/6 accounts, verified 11 users BEFORE first request; test-login 6/6.
  * Test B — `bun run dev` (sandbox path: preflight + instrumentation): preflight healed, instrumentation verified; test-login 6/6.
  * Test C — healthy restart via restart-dev.sh: "all 6 demo accounts present", 11 users before AND after (no re-seed, no data touch); 6/6 logins.
- tsc --noEmit: no errors in the new files. Note: Next 16 logs a pre-existing "middleware → proxy" deprecation warning (not related to this change).
- Honest limit: if the platform's env-init replaces db/custom.db itself, user-created (non-demo) data in that file cannot be preserved by any in-app mechanism — this fix guarantees schema + demo logins always self-heal and never deletes/touches existing data.

Stage Summary:
- "Invalid credentials" is permanently fixed: every server boot path (sandbox bun run dev, bare next dev, restart-dev.sh, start-server.js, production start) now verifies .env + schema + all 6 demo accounts and self-heals BEFORE serving the first request. Wiped-state → 6/6 logins with zero manual steps, proven by 3 simulations; healthy restarts are no-ops (data preserved).
- Demo credentials (unchanged): demo.student/parent/counsellor/council/admin/librarian @aparajit.edu.in with Student@123 / Parent@123 / Counsellor@123 / Council@123 / Admin@123 / Librarian@123.
