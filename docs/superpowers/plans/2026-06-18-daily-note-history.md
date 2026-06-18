# Daily Note And History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add daily text notes, a stats-page daily record viewer, and prevent selecting future dates.

**Architecture:** Extend `DailyRecord` with an optional `dailyNote` string and persist it in the existing IndexedDB record object. Add a record-page memo card and a stats-page date viewer that reads from the same `records` array. Use native date input `max` attributes so mobile pickers gray out future dates.

**Tech Stack:** React, TypeScript, Dexie, Vitest, React Testing Library, GitHub Pages deployment.

---

### Task 1: Daily Note Persistence

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/db.ts`
- Modify: `src/hooks/useFitnessData.ts`
- Test: `src/lib/db.test.ts`

- [ ] Add `dailyNote: string` to `DailyRecord`.
- [ ] Ensure newly created records default to an empty note.
- [ ] Add repository and hook action `saveDailyNote(date, note)`.
- [ ] Add a failing database test that saves and reloads a note.
- [ ] Implement until the database test passes.

### Task 2: Record Page Memo And Future-Date Limit

**Files:**
- Modify: `src/pages/RecordPage.tsx`
- Test: `src/pages/RecordPage.test.tsx`
- Modify: `src/App.tsx`

- [ ] Add failing tests for the daily note textarea/save button.
- [ ] Add a failing test that the backfill date input has `max` set to today.
- [ ] Add the memo card UI and wire `onSaveDailyNote`.
- [ ] Pass `maxDate` and note action from `App`.

### Task 3: Stats Page Daily Record Viewer

**Files:**
- Modify: `src/pages/StatsPage.tsx`
- Test: `src/pages/StatsPage.test.tsx`

- [ ] Add failing tests for selecting one day and viewing strength, climb, body data, and note.
- [ ] Add a failing test that stats date inputs cannot select future dates.
- [ ] Implement the daily record viewer using existing record data.

### Task 4: Export And Deployment

**Files:**
- Modify: `src/lib/export.ts`
- Test: `src/lib/export.test.ts`

- [ ] Add daily note to CSV export.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run build` with `VITE_BASE_PATH=/fitness-pwa/`.
- [ ] Commit, push to GitHub, and verify GitHub Pages deployment.
