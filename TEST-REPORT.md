# APARAJIT Test Report: 2026-10-22 Update

Environment: Next.js 16 dev server (port 3000), SQLite via Prisma, fictional demo accounts only. Every check below was actually executed; nothing is marked passed without a verified run.

## A. Automated workflow tests (`scripts/test-update-workflows.mjs`): 54/54 passed

| # | Workflow | Result |
|---|----------|--------|
| 1 | Student, second student, counsellor, admin logins | PASS (4 checks) |
| 2 | Diary: save entries on three separate dates (past, previous month, today) | PASS |
| 3 | Calendar index (`?dates=1`) marks exactly those dates | PASS |
| 4 | Past entry loads with saved text, mood and persisted tags | PASS |
| 5 | Privacy: another student sees no entry and no index marker for those dates | PASS |
| 6 | Saving date B does not overwrite date A | PASS |
| 7 | Promotion preview loads classes, students, sessions, editable proposal | PASS |
| 8 | Promotion API blocked for non-admin (server-side RBAC) | PASS |
| 9 | Promotion applies: Class 8-B to Class 9-A, academicSession updated to 2026-27 | PASS |
| 10 | Double submission skipped (student not promoted twice) | PASS |
| 11 | Class XII completion: graduated flag set, account kept active, records intact | PASS |
| 12 | Graduated student excluded from future promotion runs | PASS |
| 13 | Audit entry recorded with actor, sessions, counts and per-student results | PASS |
| 14 | Student report created; visible to counsellor with hasReporter flag | PASS |
| 15 | Counsellor message saved; appears in student thread list with unread count | PASS |
| 16 | Student reads message (sender shown), replies; counsellor sees reply as anonymous reporter | PASS |
| 17 | Thread and read receipts persist across refresh; unread clears after reading | PASS |
| 18 | Messaging on an anonymous report rejected server-side (400) | PASS |
| 19 | Another student receives 403 when opening someone else's thread | PASS |
| 20 | Student Console search no longer indexes cyber content (source-level check) | PASS |

Fixture cleanup after the run: test diary entries, temp students and test reports removed; demo state pristine.

## B. Regression suites (all executed after the changes)

- `scripts/test-login.mjs`: 6/6 roles logged in and returned correct sessions (Student, Parent, Counsellor, Council Leader, School Admin, Librarian).
- `scripts/test-merge.mjs`: 34/34 passed (emotion gate, parent journey, canteen-removal guards).
- `scripts/test-library.mjs`: 74/74 passed (Smart Library circulation, reviews, ROTM, parent scope).
- TypeScript: 0 errors in `src/`.
- ESLint: all files touched by this update lint clean; the only remaining findings are the 4 pre-existing career-corner baseline errors documented before this update.
- Dev server log (`dev.log`): no runtime errors and no "Maximum update depth exceeded" entries after all QA below.

## C. Browser QA (agent-browser, real rendered application)

Daily Diary
- Coffee/mocha pages render in light and dark mode; computed page colour verified (`rgb(243, 227, 205)` = `#f3e3cd`).
- Empty state note appears on dates without entries and disappears once typing starts.
- Calendar popover opens inside the diary overlay (z-index fix verified), shows the month/year dropdowns, "Jump to Today", the mood legend and a real entry dot on October 19.
- Selecting October 19 opens that saved entry: correct text, mood highlighted, header switches to "Monday, October 19, 2026" with a "Viewing a past entry" hint and "Return to Today" button that returns to today.
- Future dates are disabled in the calendar.
- Slider stress test: 21 pointer moves + 4 mute/unmute cycles, no console errors, no update-depth error, value settles correctly.
- Recording with denied microphone shows the honest error message; start/stop controls remain functional.
- Theme toggle works inside the diary; no layout breakage.

Career Corner
- Question 1 shows five options including "Computer Science & Coding"; selecting it produces a report where Engineering & Technology ranks first (3/5) and the new technology area participates in scoring; report saved and restorable.
- Olympiads tab: disclaimer text, "Usually conducted in:" labels, stage notes and "Official organiser website" links all render (verified for NSO, IOQM/RMO/INMO stages and others).
- Explorer tab: "Approximate month:" appears on all 11 exams with the entrance-exam disclaimer and official website links.

Search
- "cyber", "Cyber", "NCO", "phishing" return no results; "JEE", "science", "olympiad" still return normal results.

Admin promotion wizard
- Opens from User Management; sessions default correctly (2025-26 to 2026-27, "Next year" helper); editable mapping shows Class 8 to Class 9 and section choices; class and section bulk selection work (2 students selected); review table shows current versus proposed; confirmation dialog present. The wizard was cancelled before applying in the browser (real application was covered by the API tests with cleanup), so demo class assignments were not altered.

Counsellor messaging
- Message dialog on an anonymous report shows the honest warning and a disabled Send button; the same dialog on a reporter-linked report composes and sends normally.
- Counsellor message sent from Pending Reports appeared in the student's Messages page (desktop and 390px mobile), with the "1 unread" badge and the Messages sidebar badge.
- Student reply sent from mobile; counsellor's thread shows both messages with the reply attributed to "Reporter for APR-2026-DM11KL".
- QA messages were deleted afterwards so the demo thread state is clean.

## D. Not verified in this environment (honest disclosure)

- Physical microphone recording (record, save, replay with real audio) could not be exercised in the headless browser; the permission-denied path was verified and the persistence path is regression-covered, but a real-device check is recommended.
- WhatsApp/SMS notification channels remain intentionally non-functional until a provider is configured (pre-existing, unchanged).
- Approximate exam/olympiad months were verified against organisers' usual schedules but are estimates by design; the UI labels them accordingly.

## E. Data and safety checks

- All test fixtures used fictional demo accounts; cleanup removed them afterwards.
- Diary privacy verified: entries are scoped to the authenticated student server-side; no other role's API reads the diary table.
- Promotion operations are ADMIN-only on the server and audit-logged with full per-student results.
- Database backup before schema change: `db/backups/custom-pre-promotion-20261022-093506.db`.
