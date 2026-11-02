# APARAJIT Update Summary: Diary Calendar, Academic Promotion, Diary Coffee Pages, Messaging and Career Fixes

Date: 2026-10-22
Scope: Daily Diary past-entry calendar, coffee page colour, recording/ambience loop fix, Admin academic promotion, Career Quiz Computer Science option, Olympiad and Entrance Exam approximate months, Student Console search cleanup, counsellor-to-student messaging fix. No other module was redesigned, removed or recoloured.

## 1. Daily Diary: past-entry calendar and date-based retrieval

- The existing calendar button in the diary header now opens a fully working calendar (month and year dropdowns, navigation back 10 years). Days after today are disabled so entries cannot be future-dated.
- Dates with saved entries show a mood-coloured dot fed by real server data (`GET /api/diary?dates=1`), never generated or hard-coded indicators. A legend and an "N entries written" counter sit under the grid.
- Selecting any past date loads that exact day's saved entry (text, mood, reflections, photos, voice note and now tags) into the existing notebook interface, with the page-turn animation preserved. Nothing is duplicated and no other date is overwritten.
- When a past date is open, a "Viewing a past entry" hint with a "Return to Today" button appears under the date; the calendar popover keeps its "Jump to Today" shortcut.
- Dates with no saved entry show a gentle note: "No diary entry found for this date. Whatever you write will start a fresh page."
- Tags are now persisted in the database (new `tags` column on `DiaryEntry`), so they survive refresh, logout and re-login like all other entry content.
- Fixed a pre-existing stacking bug: the calendar popover was rendered into a body-level portal with z-index 50 and could never appear above the full-screen diary overlay (z-index 80). The diary calendar now renders inline (`portal={false}`), verified visible and clickable in the browser.

## 2. Daily Diary: coffee writing pages

- The notebook's inner pages now use a warm coffee / light mocha paper (`#f3e3cd` light mode, `#ecd9ba` dark mode) with matching ruled lines (`#d9bf9c` / `#cfb188`) and a deep coffee-brown ink (`#3a2a18` / `#332412`) for strong contrast.
- Only the diary page tokens changed. The forest background, butterfly, page-turn animation, glass header controls, ambience audio and typography are untouched, and the change is scoped to the diary CSS variables so no other page is affected.

## 3. Permanent fix: "Maximum update depth exceeded" (slider, recording, ambience)

Root causes fixed at the source:

- `VoiceRecorder` auto-save effect (new root-cause fix): the effect built a fresh recording object on every run and pushed it to the parent, which handed it back as the `existing` prop, re-triggering the effect forever. It now compares the recording with the saved one and only propagates real changes (new recording or deletion), so loading an entry with a voice note settles after one round-trip.
- Verified existing guards still hold: stable slider value reference in `slider.tsx`, memoised `sliderValue` in `AmbiencePlayer`, cached engine status in `ambience.ts` with `useSyncExternalStore` in `use-ambience`.
- Browser stress test: 21 pointer moves across the volume slider plus 4 mute/unmute cycles while audio played. No "Maximum update depth exceeded", no console errors, slider value settled correctly, mute and unmute instant.
- Recording: permission denial and missing-microphone cases show clear, honest error messages; streams and audio contexts are cleaned up on stop and unmount (verified in code and in the headless browser where the microphone is denied by default).

## 4. Admin academic promotion (User Management)

New "Promote Students" action next to "Add User", opening a three-step wizard:

1. Setup: choose the current academic session and the next academic session; edit the promotion mapping per class (each class defaults to the next level; the highest class defaults to "Completed Schooling / Alumni"; mappings are configurable examples, not fixed rules); select students individually, by section or by entire class.
2. Review: table of every selected student with current class/section and proposed destination, followed by an explicit confirmation dialog.
3. Result: summary of promoted, skipped and failed students with reasons; a consolidated audit entry records the administrator, both sessions, every affected student and the timestamp (`ACADEMIC_PROMOTION` in the audit log).

Data integrity guarantees (server-enforced, API route `/api/admin/promotion`, ADMIN role only):

- Class, section and academic session update together per student inside a transaction.
- The transaction re-checks each student's current class before updating, so submitting the same request twice cannot promote anyone twice; such students are reported as skipped.
- Class XII completion sets `graduatedAt` without deleting or disabling anything; the account, role, parent links and all historical records remain, and graduated students are excluded from future promotion runs.
- No student accounts are duplicated or deleted; reports, diary, library and wellbeing records are keyed by user and untouched.
- Also fixed while in this area: the admin enrolment endpoint now accepts both "Class 9, A" and "Class 9 - A" class labels, and returns the updated class and section.

## 5. Career Assessment Quiz: Computer Science option

- Question 1 now includes "Computer Science & Coding" alongside the four existing options (appended, so previously saved results stay valid).
- It maps into a new "Computer Science & Technology" area (subjects, skills and activities covering software development, data science, cybersecurity basics and AI projects) plus the existing engineering area, so it contributes to recommendations through the same transparent scoring engine.
- The report keeps its existing disclaimer: exploratory guidance, not a scientifically validated diagnosis.

## 6. Olympiads: approximate months and stage notes

- Every olympiad record now shows "Usually conducted in:" with an approximate schedule and a stage note distinguishing registration, examination and later rounds (for example NSO: November to December Level 1, February Level 2; INMO: September IOQM, November RMO, January INMO).
- Months were checked against the organisers' usual published schedules (SOF exam schedule, HBCSE olympiad pages, MTA/IOQM announcements). Where schedules vary by set date or round, the note says so.
- The section displays the required notice: "The months shown are approximate and based on usual schedules. Dates may change each year. Please check the official organiser's website for the confirmed schedule, registration deadlines, and exact examination dates."
- Each row links to the official organiser website. Estimates are never presented as confirmed dates.

## 7. Entrance Exams: approximate months and stage notes

- All 11 exams now carry "Approximate month:" plus a stage note separating application window, exam sessions and counselling (for example JEE Main: January Session 1, April Session 2, applications November to December and February to March; CLAT: December; NDA: April and September).
- The section displays the required notice: "The months shown are approximate and may change from year to year. Always check the official examination website for confirmed dates, registration deadlines, eligibility requirements, and the latest notifications."
- Every card links to the official examination website. The parent console opportunities view shows the same "Usually conducted in" line where the records appear.

## 8. Student Console search: cybersecurity topics removed

- Cyber Shield lessons and the "Cyber Topics" category are no longer part of the Student Console search index; searching "cyber", "NCO" or "phishing" returns no results while universities, exams, scholarships, olympiads and coaching still search normally.
- The National Cyber Olympiad entry was also excluded from this search surface because its subject is cyber-focused; it remains fully visible in the Career Corner Olympiads tab.
- Cyber Shield itself and all other dashboards are unchanged; nothing was deleted from the database.

## 9. Counsellor messages now reach the student Messaging page

Root cause: demo and legacy reports can be anonymous (no reporter account), and any message sent on such a report could never appear in any student's inbox, silently.

- The counsellor reports list now reports `hasReporter` (a boolean only, the student's identity is still never exposed).
- The counsellor message dialog warns clearly on anonymous reports and disables sending: "This report was filed anonymously, so there is no student account to deliver messages to." The API rejects such sends server-side (400) so the guard is not just hidden UI.
- Demo data fix: four fictional demo reports now belong to the demo student so the counsellor-to-student flow can be demonstrated end to end; two anonymous reports remain for realism.
- Verified end to end in the browser and via API tests: student submits a report, counsellor messages from Pending Reports, the message appears in the student's Messages page with an unread badge, the student replies, the counsellor sees the reply attributed to "Reporter for APR-XXXX", the thread survives refresh, unread counts clear after reading, and one student can never read another student's thread (403).
- New: the student sidebar "Messages" item shows a live unread badge (polled every 30 seconds), so new counsellor messages are visible without a manual refresh; the page itself already polled every 15 seconds.

## 10. Verification summary

- 54/54 new workflow tests passed (`scripts/test-update-workflows.mjs`), 34/34 regression, 74/74 library suite, 6/6 role logins.
- TypeScript: 0 errors in `src/`. ESLint: only the 4 pre-existing career-corner baseline findings remain; all files touched by this update lint clean.
- Browser QA on desktop and mobile (390px) in light and dark mode; dev server log shows no runtime errors and no update-depth messages.
- Database backups: `db/backups/custom-pre-promotion-20261022-093506.db` (taken before the additive schema change). The schema change adds three nullable/default columns only (`DiaryEntry.tags`, `User.academicSession`, `User.graduatedAt`); no existing data was reset or migrated destructively.

## 11. Remaining limitations (honest disclosure)

- Microphone recording could not be exercised with a real microphone in this sandbox (headless browser denies permission by default); the denial path was verified, the record-save-replay path is covered by the existing supported storage workflow and was regression-checked, but a physical microphone test on a real device is still worthwhile.
- The browser QA messages and the QA-created diary entry were removed from the demo data except one intentional past entry ("A quiet memory to revisit through the calendar.", 2026-10-19) left on the demo student account so the calendar dot and past-entry flow can be demonstrated immediately.
- Approximate months are based on organisers' usual schedules; they are deliberately labelled as estimates and are not a substitute for the official notifications.
- Four pre-existing ESLint findings in career-corner (memoisation and setState-in-effect patterns) are unchanged baseline issues that do not affect runtime behaviour.
