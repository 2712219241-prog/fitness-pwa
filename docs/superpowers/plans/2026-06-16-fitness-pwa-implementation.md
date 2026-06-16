# Fitness PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first public, mobile-first personal fitness PWA described in `docs/superpowers/specs/2026-06-16-fitness-pwa-design.md`.

**Architecture:** Use a client-only React app with small domain modules for records, statistics, exports, and local persistence. Keep persistent data in IndexedDB through a repository boundary so UI components do not know storage details. The UI opens directly to the record screen with bottom navigation for Record, Stats, and Export.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Dexie, Recharts, lucide-react, vite-plugin-pwa, plain CSS.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite entry HTML.
- `vite.config.ts`: Vite, React, Vitest, and PWA setup.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript configuration.
- `src/main.tsx`: React root.
- `src/App.tsx`: App shell, bottom navigation, selected page state.
- `src/styles.css`: Global mobile-first visual system.
- `src/lib/types.ts`: Shared domain types.
- `src/lib/defaultExercises.ts`: Preset body parts and starter exercises.
- `src/lib/date.ts`: Date formatting and range helpers.
- `src/lib/stats.ts`: Body and strength trend calculations.
- `src/lib/export.ts`: CSV and JSON backup generation plus import validation.
- `src/lib/db.ts`: Dexie schema and repository functions.
- `src/hooks/useFitnessData.ts`: React hook for loading and mutating app data.
- `src/components/BottomNav.tsx`: Record / Stats / Export navigation.
- `src/components/IconTile.tsx`: Reusable illustrated tile/card.
- `src/pages/RecordPage.tsx`: Today/backfill record UI.
- `src/pages/StatsPage.tsx`: Date range and trend charts.
- `src/pages/ExportPage.tsx`: CSV, JSON export, JSON import.
- `src/components/*.test.tsx`, `src/lib/*.test.ts`: Focused unit and UI tests.
- `src/test/setup.ts`: Testing Library setup.
- `public/manifest.webmanifest`: PWA manifest.
- `public/icon.svg`: Simple orange app icon.

## Task 1: Scaffold React PWA Tooling

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/test/setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `public/manifest.webmanifest`
- Create: `public/icon.svg`

- [ ] **Step 1: Install project dependencies**

Run:

```powershell
npm init -y
npm install @vitejs/plugin-react vite typescript react react-dom dexie recharts lucide-react vite-plugin-pwa
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event fake-indexeddb
```

Expected: `package.json`, `package-lock.json`, and `node_modules` are created.

- [ ] **Step 2: Replace `package.json` scripts**

Edit `package.json` so it includes:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Keep the dependencies npm installed.

- [ ] **Step 3: Add Vite and TypeScript config**

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '个人健身记录',
        short_name: '健身记录',
        description: '个人力量、爬坡和身体数据记录工具',
        theme_color: '#f47416',
        background_color: '#f8f7f3',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true
  }
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Add smoke test setup and minimal app**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f47416" />
    <title>个人健身记录</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <h1>个人健身记录</h1>
      <p>记录 / 统计 / 导出</p>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #15120f;
  background: #f3f3ef;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #f3f3ef;
}

button,
input,
textarea,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  background: #f8f7f3;
  padding: 24px;
}
```

Create `public/manifest.webmanifest`:

```json
{
  "name": "个人健身记录",
  "short_name": "健身记录",
  "description": "个人力量、爬坡和身体数据记录工具",
  "theme_color": "#f47416",
  "background_color": "#f8f7f3",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

Create `public/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#f47416"/>
  <circle cx="256" cy="160" r="58" fill="#fff"/>
  <path d="M152 330c40-76 73-114 104-114s64 38 104 114" fill="none" stroke="#fff" stroke-width="42" stroke-linecap="round"/>
  <path d="M176 364h160" stroke="#fff" stroke-width="42" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Verify scaffold**

Run:

```powershell
npm run build
```

Expected: exit code `0`, with Vite producing `dist`.

- [ ] **Step 6: Commit scaffold**

```powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src public
git commit -m "feat: scaffold fitness PWA"
```

## Task 2: Domain Types, Default Exercises, And Date Helpers

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/defaultExercises.ts`
- Create: `src/lib/date.ts`
- Test: `src/lib/date.test.ts`
- Test: `src/lib/defaultExercises.test.ts`

- [ ] **Step 1: Write failing date helper tests**

Create `src/lib/date.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatChineseDate, getTodayKey, isWithinDateRange } from './date';

describe('date helpers', () => {
  it('formats an ISO date key for Chinese display', () => {
    expect(formatChineseDate('2026-06-16')).toBe('6月16日');
  });

  it('compares date keys inclusively', () => {
    expect(isWithinDateRange('2026-06-16', '2026-06-01', '2026-06-16')).toBe(true);
    expect(isWithinDateRange('2026-05-31', '2026-06-01', '2026-06-16')).toBe(false);
  });

  it('creates today key from a fixed date', () => {
    expect(getTodayKey(new Date('2026-06-16T12:00:00'))).toBe('2026-06-16');
  });
});
```

- [ ] **Step 2: Run date tests to verify failure**

Run:

```powershell
npm test -- src/lib/date.test.ts
```

Expected: FAIL because `src/lib/date.ts` does not exist.

- [ ] **Step 3: Implement date helpers**

Create `src/lib/date.ts`:

```ts
export function getTodayKey(now = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatChineseDate(dateKey: string): string {
  const [, month, day] = dateKey.split('-');
  return `${Number(month)}月${Number(day)}日`;
}

export function isWithinDateRange(dateKey: string, startDate: string, endDate: string): boolean {
  return dateKey >= startDate && dateKey <= endDate;
}
```

- [ ] **Step 4: Verify date tests pass**

Run:

```powershell
npm test -- src/lib/date.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write failing default exercise tests**

Create `src/lib/defaultExercises.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { BODY_PARTS, DEFAULT_EXERCISES } from './defaultExercises';

describe('default exercises', () => {
  it('contains the five requested body parts', () => {
    expect(BODY_PARTS.map((part) => part.id)).toEqual(['chest', 'shoulders', 'back', 'arms', 'abs']);
  });

  it('ships at least one preset exercise for every body part', () => {
    for (const part of BODY_PARTS) {
      expect(DEFAULT_EXERCISES.some((exercise) => exercise.bodyPart === part.id)).toBe(true);
    }
  });
});
```

- [ ] **Step 6: Run default exercise tests to verify failure**

Run:

```powershell
npm test -- src/lib/defaultExercises.test.ts
```

Expected: FAIL because `src/lib/defaultExercises.ts` does not exist.

- [ ] **Step 7: Implement types and default exercises**

Create `src/lib/types.ts`:

```ts
export type BodyPart = 'chest' | 'shoulders' | 'back' | 'arms' | 'abs';
export type PageId = 'record' | 'stats' | 'export';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  illustrationKey: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StrengthSet {
  id: string;
  exerciseId: string;
  bodyPart: BodyPart;
  weight: number;
  reps: number;
  timestamp: string;
}

export interface ClimbEntry {
  id: string;
  durationMinutes: number;
  notes: string;
  timestamp: string;
}

export interface BodyMeasurement {
  date: string;
  weightKg: number | null;
  armCm: number | null;
  waistCm: number | null;
  updatedAt: string;
}

export interface DailyRecord {
  date: string;
  strengthSets: StrengthSet[];
  climbEntries: ClimbEntry[];
  bodyMeasurement: BodyMeasurement | null;
  updatedAt: string;
}

export interface AppBackup {
  version: 1;
  exportedAt: string;
  exercises: Exercise[];
  dailyRecords: DailyRecord[];
}
```

Create `src/lib/defaultExercises.ts`:

```ts
import type { BodyPart, Exercise } from './types';

export const BODY_PARTS: Array<{ id: BodyPart; label: string; shortLabel: string }> = [
  { id: 'chest', label: '胸部', shortLabel: '胸' },
  { id: 'shoulders', label: '肩部', shortLabel: '肩' },
  { id: 'back', label: '背部', shortLabel: '背' },
  { id: 'arms', label: '手臂', shortLabel: '臂' },
  { id: 'abs', label: '腹部', shortLabel: '腹' }
];

const createdAt = '2026-06-16T00:00:00.000Z';

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'ex-dumbbell-bench-press', name: '哑铃卧推', bodyPart: 'chest', illustrationKey: 'press', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-cable-fly', name: '绳索夹胸', bodyPart: 'chest', illustrationKey: 'fly', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-shoulder-press', name: '肩推', bodyPart: 'shoulders', illustrationKey: 'shoulder-press', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-lateral-raise', name: '侧平举', bodyPart: 'shoulders', illustrationKey: 'raise', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-lat-pulldown', name: '高位下拉', bodyPart: 'back', illustrationKey: 'pulldown', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-row', name: '坐姿划船', bodyPart: 'back', illustrationKey: 'row', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-curl', name: '弯举', bodyPart: 'arms', illustrationKey: 'curl', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-triceps-pushdown', name: '绳索下压', bodyPart: 'arms', illustrationKey: 'pushdown', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-crunch', name: '卷腹', bodyPart: 'abs', illustrationKey: 'crunch', createdAt, updatedAt: createdAt, deletedAt: null },
  { id: 'ex-plank', name: '平板支撑', bodyPart: 'abs', illustrationKey: 'plank', createdAt, updatedAt: createdAt, deletedAt: null }
];
```

- [ ] **Step 8: Verify domain tests pass**

Run:

```powershell
npm test -- src/lib/date.test.ts src/lib/defaultExercises.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit domain foundation**

```powershell
git add src/lib
git commit -m "feat: add fitness domain foundation"
```

## Task 3: Stats And Export Logic

**Files:**
- Create: `src/lib/stats.ts`
- Create: `src/lib/export.ts`
- Test: `src/lib/stats.test.ts`
- Test: `src/lib/export.test.ts`

- [ ] **Step 1: Write failing stats tests**

Create `src/lib/stats.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { DailyRecord } from './types';
import { buildBodyTrend, buildStrengthTrend } from './stats';

const records: DailyRecord[] = [
  {
    date: '2026-06-01',
    strengthSets: [
      { id: 's1', exerciseId: 'bench', bodyPart: 'chest', weight: 20, reps: 10, timestamp: '2026-06-01T10:00:00.000Z' },
      { id: 's2', exerciseId: 'bench', bodyPart: 'chest', weight: 25, reps: 8, timestamp: '2026-06-01T10:05:00.000Z' }
    ],
    climbEntries: [],
    bodyMeasurement: { date: '2026-06-01', weightKg: 80, armCm: 34, waistCm: 88, updatedAt: '2026-06-01T10:00:00.000Z' },
    updatedAt: '2026-06-01T10:05:00.000Z'
  },
  {
    date: '2026-06-16',
    strengthSets: [
      { id: 's3', exerciseId: 'bench', bodyPart: 'chest', weight: 30, reps: 6, timestamp: '2026-06-16T10:00:00.000Z' },
      { id: 's4', exerciseId: 'curl', bodyPart: 'arms', weight: 12, reps: 12, timestamp: '2026-06-16T10:10:00.000Z' }
    ],
    climbEntries: [],
    bodyMeasurement: { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86, updatedAt: '2026-06-16T10:00:00.000Z' },
    updatedAt: '2026-06-16T10:10:00.000Z'
  }
];

describe('stats', () => {
  it('builds body trend rows within a date range', () => {
    expect(buildBodyTrend(records, '2026-06-01', '2026-06-16')).toEqual([
      { date: '2026-06-01', weightKg: 80, armCm: 34, waistCm: 88 },
      { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86 }
    ]);
  });

  it('builds strength trend rows for one exercise', () => {
    expect(buildStrengthTrend(records, 'bench', '2026-06-01', '2026-06-16')).toEqual([
      { date: '2026-06-01', maxWeight: 25, totalReps: 18, totalVolume: 400 },
      { date: '2026-06-16', maxWeight: 30, totalReps: 6, totalVolume: 180 }
    ]);
  });
});
```

- [ ] **Step 2: Run stats tests to verify failure**

Run:

```powershell
npm test -- src/lib/stats.test.ts
```

Expected: FAIL because `src/lib/stats.ts` does not exist.

- [ ] **Step 3: Implement stats helpers**

Create `src/lib/stats.ts`:

```ts
import { isWithinDateRange } from './date';
import type { DailyRecord } from './types';

export interface BodyTrendRow {
  date: string;
  weightKg: number | null;
  armCm: number | null;
  waistCm: number | null;
}

export interface StrengthTrendRow {
  date: string;
  maxWeight: number;
  totalReps: number;
  totalVolume: number;
}

export function buildBodyTrend(records: DailyRecord[], startDate: string, endDate: string): BodyTrendRow[] {
  return records
    .filter((record) => record.bodyMeasurement && isWithinDateRange(record.date, startDate, endDate))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((record) => ({
      date: record.date,
      weightKg: record.bodyMeasurement?.weightKg ?? null,
      armCm: record.bodyMeasurement?.armCm ?? null,
      waistCm: record.bodyMeasurement?.waistCm ?? null
    }));
}

export function buildStrengthTrend(
  records: DailyRecord[],
  exerciseId: string,
  startDate: string,
  endDate: string
): StrengthTrendRow[] {
  return records
    .filter((record) => isWithinDateRange(record.date, startDate, endDate))
    .map((record) => {
      const sets = record.strengthSets.filter((set) => set.exerciseId === exerciseId);
      if (sets.length === 0) return null;
      return {
        date: record.date,
        maxWeight: Math.max(...sets.map((set) => set.weight)),
        totalReps: sets.reduce((sum, set) => sum + set.reps, 0),
        totalVolume: sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
      };
    })
    .filter((row): row is StrengthTrendRow => row !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
}
```

- [ ] **Step 4: Verify stats tests pass**

Run:

```powershell
npm test -- src/lib/stats.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write failing export tests**

Create `src/lib/export.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { AppBackup, DailyRecord, Exercise } from './types';
import { buildCsv, buildJsonBackup, parseJsonBackup } from './export';

const exercises: Exercise[] = [
  { id: 'bench', name: '哑铃卧推', bodyPart: 'chest', illustrationKey: 'press', createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z', deletedAt: null }
];

const records: DailyRecord[] = [
  {
    date: '2026-06-16',
    strengthSets: [{ id: 's1', exerciseId: 'bench', bodyPart: 'chest', weight: 30, reps: 8, timestamp: '2026-06-16T10:00:00.000Z' }],
    climbEntries: [{ id: 'c1', durationMinutes: 35, notes: '坡度 12', timestamp: '2026-06-16T11:00:00.000Z' }],
    bodyMeasurement: { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86, updatedAt: '2026-06-16T09:00:00.000Z' },
    updatedAt: '2026-06-16T11:00:00.000Z'
  }
];

describe('export helpers', () => {
  it('builds a csv with strength, climb, and body rows', () => {
    const csv = buildCsv(records, exercises, '2026-06-01', '2026-06-30');
    expect(csv).toContain('日期,记录类型,部位,动作名称,第几组,重量,次数,组记录时间,爬坡时长,爬坡备注,体重,手臂围,腰围');
    expect(csv).toContain('2026-06-16,力量,胸部,哑铃卧推,1,30,8,2026-06-16T10:00:00.000Z,,,,,');
    expect(csv).toContain('2026-06-16,爬坡,,,,,,,35,坡度 12,,,');
    expect(csv).toContain('2026-06-16,身体数据,,,,,,,,,78.5,35,86');
  });

  it('round trips a json backup', () => {
    const backup = buildJsonBackup(records, exercises, '2026-06-16T12:00:00.000Z');
    expect(parseJsonBackup(JSON.stringify(backup))).toEqual<AppBackup>(backup);
  });

  it('rejects invalid json backup shape', () => {
    expect(() => parseJsonBackup('{"version":2}')).toThrow('备份文件格式不正确');
  });
});
```

- [ ] **Step 6: Run export tests to verify failure**

Run:

```powershell
npm test -- src/lib/export.test.ts
```

Expected: FAIL because `src/lib/export.ts` does not exist.

- [ ] **Step 7: Implement export helpers**

Create `src/lib/export.ts`:

```ts
import { BODY_PARTS } from './defaultExercises';
import { isWithinDateRange } from './date';
import type { AppBackup, DailyRecord, Exercise } from './types';

const CSV_HEADER = [
  '日期',
  '记录类型',
  '部位',
  '动作名称',
  '第几组',
  '重量',
  '次数',
  '组记录时间',
  '爬坡时长',
  '爬坡备注',
  '体重',
  '手臂围',
  '腰围'
];

function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function bodyPartLabel(id: string): string {
  return BODY_PARTS.find((part) => part.id === id)?.label ?? id;
}

export function buildCsv(records: DailyRecord[], exercises: Exercise[], startDate: string, endDate: string): string {
  const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const rows: Array<Array<string | number | null | undefined>> = [CSV_HEADER];

  for (const record of records.filter((item) => isWithinDateRange(item.date, startDate, endDate)).sort((a, b) => a.date.localeCompare(b.date))) {
    record.strengthSets.forEach((set, index) => {
      const exercise = exerciseById.get(set.exerciseId);
      rows.push([
        record.date,
        '力量',
        bodyPartLabel(set.bodyPart),
        exercise?.name ?? set.exerciseId,
        index + 1,
        set.weight,
        set.reps,
        set.timestamp,
        '',
        '',
        '',
        '',
        ''
      ]);
    });

    for (const climb of record.climbEntries) {
      rows.push([record.date, '爬坡', '', '', '', '', '', '', climb.durationMinutes, climb.notes, '', '', '']);
    }

    if (record.bodyMeasurement) {
      rows.push([
        record.date,
        '身体数据',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        record.bodyMeasurement.weightKg,
        record.bodyMeasurement.armCm,
        record.bodyMeasurement.waistCm
      ]);
    }
  }

  return rows.map((row) => row.map(csvCell).join(',')).join('\n');
}

export function buildJsonBackup(records: DailyRecord[], exercises: Exercise[], exportedAt = new Date().toISOString()): AppBackup {
  return {
    version: 1,
    exportedAt,
    exercises,
    dailyRecords: records
  };
}

export function parseJsonBackup(text: string): AppBackup {
  const data = JSON.parse(text) as Partial<AppBackup>;
  if (data.version !== 1 || !Array.isArray(data.exercises) || !Array.isArray(data.dailyRecords) || typeof data.exportedAt !== 'string') {
    throw new Error('备份文件格式不正确');
  }
  return data as AppBackup;
}
```

- [ ] **Step 8: Verify stats and export tests pass**

Run:

```powershell
npm test -- src/lib/stats.test.ts src/lib/export.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit stats and export logic**

```powershell
git add src/lib/stats.ts src/lib/stats.test.ts src/lib/export.ts src/lib/export.test.ts
git commit -m "feat: add fitness stats and exports"
```

## Task 4: IndexedDB Repository And Data Hook

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/hooks/useFitnessData.ts`
- Test: `src/lib/db.test.ts`

- [ ] **Step 1: Write failing repository tests**

Create `src/lib/db.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { createFitnessRepository } from './db';

describe('fitness repository', () => {
  beforeEach(async () => {
    await indexedDB.deleteDatabase('fitness-test');
  });

  it('seeds default exercises on first load', async () => {
    const repo = createFitnessRepository('fitness-test');
    const exercises = await repo.listExercises();
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.some((exercise) => exercise.name === '哑铃卧推')).toBe(true);
    repo.close();
  });

  it('saves a strength set under the selected date', async () => {
    const repo = createFitnessRepository('fitness-test');
    const exercises = await repo.listExercises();
    await repo.addStrengthSet('2026-06-16', {
      exerciseId: exercises[0].id,
      bodyPart: exercises[0].bodyPart,
      weight: 30,
      reps: 8,
      timestamp: '2026-06-16T10:00:00.000Z'
    });
    const records = await repo.listDailyRecords();
    expect(records[0].date).toBe('2026-06-16');
    expect(records[0].strengthSets[0].weight).toBe(30);
    repo.close();
  });
});
```

- [ ] **Step 2: Run repository tests to verify failure**

Run:

```powershell
npm test -- src/lib/db.test.ts
```

Expected: FAIL because `src/lib/db.ts` does not exist.

- [ ] **Step 3: Implement repository**

Create `src/lib/db.ts`:

```ts
import Dexie, { type Table } from 'dexie';
import { DEFAULT_EXERCISES } from './defaultExercises';
import type { BodyMeasurement, ClimbEntry, DailyRecord, Exercise, StrengthSet } from './types';

type NewStrengthSet = Omit<StrengthSet, 'id'>;
type NewClimbEntry = Omit<ClimbEntry, 'id'>;

class FitnessDatabase extends Dexie {
  exercises!: Table<Exercise, string>;
  dailyRecords!: Table<DailyRecord, string>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      exercises: 'id, bodyPart, deletedAt',
      dailyRecords: 'date, updatedAt'
    });
  }
}

function id(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function emptyRecord(date: string, now: string): DailyRecord {
  return {
    date,
    strengthSets: [],
    climbEntries: [],
    bodyMeasurement: null,
    updatedAt: now
  };
}

export function createFitnessRepository(dbName = 'fitness-pwa') {
  const db = new FitnessDatabase(dbName);

  async function ensureSeeded() {
    if ((await db.exercises.count()) === 0) {
      await db.exercises.bulkPut(DEFAULT_EXERCISES);
    }
  }

  async function getOrCreateRecord(date: string, now = new Date().toISOString()) {
    const existing = await db.dailyRecords.get(date);
    if (existing) return existing;
    const created = emptyRecord(date, now);
    await db.dailyRecords.put(created);
    return created;
  }

  return {
    close() {
      db.close();
    },
    async listExercises() {
      await ensureSeeded();
      return db.exercises.where('deletedAt').equals(null).toArray();
    },
    async saveExercise(exercise: Exercise) {
      await db.exercises.put(exercise);
    },
    async listDailyRecords() {
      return db.dailyRecords.orderBy('date').toArray();
    },
    async addStrengthSet(date: string, set: NewStrengthSet) {
      const now = new Date().toISOString();
      const record = await getOrCreateRecord(date, now);
      const next: DailyRecord = {
        ...record,
        strengthSets: [...record.strengthSets, { ...set, id: id('set') }],
        updatedAt: now
      };
      await db.dailyRecords.put(next);
      return next;
    },
    async deleteStrengthSet(date: string, setId: string) {
      const record = await getOrCreateRecord(date);
      const next = { ...record, strengthSets: record.strengthSets.filter((set) => set.id !== setId), updatedAt: new Date().toISOString() };
      await db.dailyRecords.put(next);
      return next;
    },
    async addClimbEntry(date: string, entry: NewClimbEntry) {
      const now = new Date().toISOString();
      const record = await getOrCreateRecord(date, now);
      const next = { ...record, climbEntries: [...record.climbEntries, { ...entry, id: id('climb') }], updatedAt: now };
      await db.dailyRecords.put(next);
      return next;
    },
    async saveBodyMeasurement(measurement: BodyMeasurement) {
      const record = await getOrCreateRecord(measurement.date, measurement.updatedAt);
      const next = { ...record, bodyMeasurement: measurement, updatedAt: measurement.updatedAt };
      await db.dailyRecords.put(next);
      return next;
    },
    async replaceAll(exercises: Exercise[], dailyRecords: DailyRecord[]) {
      await db.transaction('rw', db.exercises, db.dailyRecords, async () => {
        await db.exercises.clear();
        await db.dailyRecords.clear();
        await db.exercises.bulkPut(exercises);
        await db.dailyRecords.bulkPut(dailyRecords);
      });
    }
  };
}

export type FitnessRepository = ReturnType<typeof createFitnessRepository>;
```

- [ ] **Step 4: Verify repository tests pass**

Run:

```powershell
npm test -- src/lib/db.test.ts
```

Expected: PASS.

- [ ] **Step 5: Add React data hook**

Create `src/hooks/useFitnessData.ts`:

```ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createFitnessRepository } from '../lib/db';
import type { BodyMeasurement, ClimbEntry, DailyRecord, Exercise, StrengthSet } from '../lib/types';

const repository = createFitnessRepository();

export function useFitnessData() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [nextExercises, nextRecords] = await Promise.all([repository.listExercises(), repository.listDailyRecords()]);
    setExercises(nextExercises);
    setRecords(nextRecords);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const actions = useMemo(
    () => ({
      async addStrengthSet(date: string, set: Omit<StrengthSet, 'id'>) {
        await repository.addStrengthSet(date, set);
        await refresh();
      },
      async deleteStrengthSet(date: string, setId: string) {
        await repository.deleteStrengthSet(date, setId);
        await refresh();
      },
      async addClimbEntry(date: string, entry: Omit<ClimbEntry, 'id'>) {
        await repository.addClimbEntry(date, entry);
        await refresh();
      },
      async saveBodyMeasurement(measurement: BodyMeasurement) {
        await repository.saveBodyMeasurement(measurement);
        await refresh();
      },
      async replaceAll(nextExercises: Exercise[], nextRecords: DailyRecord[]) {
        await repository.replaceAll(nextExercises, nextRecords);
        await refresh();
      }
    }),
    [refresh]
  );

  return { exercises, records, loading, actions };
}
```

- [ ] **Step 6: Run all library tests**

Run:

```powershell
npm test -- src/lib
```

Expected: PASS.

- [ ] **Step 7: Commit repository**

```powershell
git add src/lib/db.ts src/lib/db.test.ts src/hooks/useFitnessData.ts
git commit -m "feat: persist fitness data locally"
```

## Task 5: App Shell, Navigation, And Record Page

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/IconTile.tsx`
- Create: `src/pages/RecordPage.tsx`
- Test: `src/App.test.tsx`
- Test: `src/pages/RecordPage.test.tsx`

- [ ] **Step 1: Write failing app shell test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('uses bottom navigation without duplicate top tabs', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '记录' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: '统计' })).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: '统计' }));
    expect(screen.getByRole('heading', { name: '统计' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run app shell test to verify failure**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: FAIL because the current app does not have navigation.

- [ ] **Step 3: Implement navigation and placeholder pages**

Create `src/components/BottomNav.tsx`:

```tsx
import { BarChart3, Download, Dumbbell } from 'lucide-react';
import type { PageId } from '../lib/types';

const items: Array<{ id: PageId; label: string; Icon: typeof Dumbbell }> = [
  { id: 'record', label: '记录', Icon: Dumbbell },
  { id: 'stats', label: '统计', Icon: BarChart3 },
  { id: 'export', label: '导出', Icon: Download }
];

interface BottomNavProps {
  activePage: PageId;
  onChange: (page: PageId) => void;
}

export function BottomNav({ activePage, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map(({ id, label, Icon }) => (
        <button key={id} className={activePage === id ? 'active' : ''} type="button" onClick={() => onChange(id)}>
          <Icon aria-hidden="true" size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
```

Modify `src/App.tsx`:

```tsx
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import type { PageId } from './lib/types';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('record');
  const title = activePage === 'record' ? '记录' : activePage === 'stats' ? '统计' : '导出';

  return (
    <main className="app-shell">
      <PlaceholderPage title={title} />
      <BottomNav activePage={activePage} onChange={setActivePage} />
    </main>
  );
}
```

Replace `src/styles.css` with the visual foundation from Task 1 plus:

```css
.app-shell {
  position: relative;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  background: #f8f7f3;
  box-shadow: 0 0 40px rgba(21, 18, 15, 0.08);
}

.page {
  min-height: 100vh;
  padding: 20px 18px 104px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.page-header h1 {
  margin: 0;
  color: #101010;
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0;
  border-bottom: 4px solid #f47416;
  padding-bottom: 8px;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: min(480px, 100%);
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #ece9e2;
  padding: 8px max(12px, env(safe-area-inset-left)) max(8px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-right));
}

.bottom-nav button {
  display: grid;
  justify-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: #96918a;
  font-size: 13px;
  font-weight: 800;
  padding: 8px 0;
}

.bottom-nav button.active {
  color: #f47416;
}
```

- [ ] **Step 4: Verify app shell test passes**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Write failing record page test**

Create `src/pages/RecordPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_EXERCISES } from '../lib/defaultExercises';
import type { DailyRecord } from '../lib/types';
import { RecordPage } from './RecordPage';

describe('RecordPage', () => {
  it('shows strength parts, climb, body data, and backfill', () => {
    const records: DailyRecord[] = [];
    render(
      <RecordPage
        date="2026-06-16"
        exercises={DEFAULT_EXERCISES}
        records={records}
        onDateChange={vi.fn()}
        onAddStrengthSet={vi.fn()}
        onDeleteStrengthSet={vi.fn()}
        onAddClimbEntry={vi.fn()}
        onSaveBodyMeasurement={vi.fn()}
      />
    );
    expect(screen.getByText('今天还没记录')).toBeInTheDocument();
    expect(screen.getByLabelText('补录日期')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '胸部' })).toBeInTheDocument();
    expect(screen.getByText('爬坡')).toBeInTheDocument();
    expect(screen.getByText('身体数据')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run record page test to verify failure**

Run:

```powershell
npm test -- src/pages/RecordPage.test.tsx
```

Expected: FAIL because `RecordPage` does not exist.

- [ ] **Step 7: Implement record page and tile**

Create `src/components/IconTile.tsx`:

```tsx
interface IconTileProps {
  label: string;
  shortLabel: string;
  onClick?: () => void;
}

export function IconTile({ label, shortLabel, onClick }: IconTileProps) {
  return (
    <button className="icon-tile" type="button" onClick={onClick} aria-label={label}>
      <span className="tile-illustration">{shortLabel}</span>
      <strong>{label}</strong>
    </button>
  );
}
```

Create `src/pages/RecordPage.tsx`:

```tsx
import { CalendarDays, ChevronRight, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BODY_PARTS } from '../lib/defaultExercises';
import { formatChineseDate } from '../lib/date';
import type { BodyMeasurement, BodyPart, ClimbEntry, DailyRecord, Exercise, StrengthSet } from '../lib/types';
import { IconTile } from '../components/IconTile';

interface RecordPageProps {
  date: string;
  exercises: Exercise[];
  records: DailyRecord[];
  onDateChange: (date: string) => void;
  onAddStrengthSet: (date: string, set: Omit<StrengthSet, 'id'>) => Promise<void> | void;
  onDeleteStrengthSet: (date: string, setId: string) => Promise<void> | void;
  onAddClimbEntry: (date: string, entry: Omit<ClimbEntry, 'id'>) => Promise<void> | void;
  onSaveBodyMeasurement: (measurement: BodyMeasurement) => Promise<void> | void;
}

export function RecordPage({
  date,
  exercises,
  records,
  onDateChange,
  onAddStrengthSet,
  onDeleteStrengthSet,
  onAddClimbEntry,
  onSaveBodyMeasurement
}: RecordPageProps) {
  const [selectedPart, setSelectedPart] = useState<BodyPart>('chest');
  const record = records.find((item) => item.date === date);
  const strengthCount = record?.strengthSets.length ?? 0;
  const climbMinutes = record?.climbEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0) ?? 0;
  const selectedExercises = useMemo(() => exercises.filter((exercise) => exercise.bodyPart === selectedPart), [exercises, selectedPart]);

  async function quickAddSet(exercise: Exercise) {
    await onAddStrengthSet(date, {
      exerciseId: exercise.id,
      bodyPart: exercise.bodyPart,
      weight: 0,
      reps: 0,
      timestamp: new Date().toISOString()
    });
  }

  return (
    <section className="page record-page">
      <header className="page-header">
        <h1>记录</h1>
      </header>

      <section className="summary-card">
        <div className="summary-title">
          <span className="status-dot" />
          <strong>{strengthCount === 0 && climbMinutes === 0 ? '今天还没记录' : '今日已记录'}</strong>
          <span>{formatChineseDate(date)}</span>
        </div>
        <div className="summary-grid">
          <div><b>{strengthCount}</b><span>项</span><small>力量记录</small></div>
          <div><b>{climbMinutes}</b><span>分</span><small>爬坡时长</small></div>
          <div><button type="button">去填写</button><small>身体数据</small></div>
        </div>
      </section>

      <div className="record-toolbar">
        <label>
          <CalendarDays size={18} aria-hidden="true" />
          <span>补录</span>
          <input aria-label="补录日期" type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
        </label>
      </div>

      <section className="feature-card outlined">
        <div className="feature-icon">力</div>
        <div>
          <h2>力量训练</h2>
          <p>胸 / 肩 / 背 / 手臂 / 腹部</p>
        </div>
        <ChevronRight aria-hidden="true" />
      </section>

      <div className="tile-grid">
        {BODY_PARTS.map((part) => (
          <IconTile key={part.id} label={part.label} shortLabel={part.shortLabel} onClick={() => setSelectedPart(part.id)} />
        ))}
      </div>

      <section className="card-list">
        {selectedExercises.map((exercise) => (
          <article className="exercise-card" key={exercise.id}>
            <div className="exercise-art">{exercise.name.slice(0, 1)}</div>
            <div>
              <h3>{exercise.name}</h3>
              <p>{BODY_PARTS.find((part) => part.id === exercise.bodyPart)?.label}</p>
            </div>
            <button type="button" aria-label={`添加${exercise.name}一组`} onClick={() => void quickAddSet(exercise)}>
              <Plus aria-hidden="true" />
            </button>
          </article>
        ))}
      </section>

      <section className="plain-card">
        <h2>爬坡</h2>
        <p>记录时长和备注。</p>
      </section>

      <section className="plain-card">
        <h2>身体数据</h2>
        <div className="metric-grid">
          <span>体重 kg</span>
          <span>手臂 cm</span>
          <span>腰围 cm</span>
        </div>
      </section>
    </section>
  );
}
```

Append to `src/styles.css`:

```css
.summary-card,
.plain-card,
.feature-card,
.exercise-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(48, 43, 35, 0.08);
}

.summary-card {
  padding: 18px;
}

.summary-title,
.feature-card,
.exercise-card,
.record-toolbar,
.record-toolbar label {
  display: flex;
  align-items: center;
}

.summary-title {
  justify-content: space-between;
  gap: 10px;
  color: #777;
  font-size: 20px;
  font-weight: 800;
}

.summary-title strong {
  flex: 1;
  color: #15120f;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #eceae5;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0ece4;
  text-align: center;
}

.summary-grid > div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.summary-grid > div + div {
  border-left: 1px solid #eee9df;
}

.summary-grid b {
  font-size: 36px;
  line-height: 1;
}

.summary-grid span,
.summary-grid small {
  color: #8f887e;
}

.summary-grid button {
  border: 0;
  background: transparent;
  color: #f47416;
  font-weight: 900;
}

.record-toolbar {
  justify-content: flex-end;
  margin: 18px 0 12px;
}

.record-toolbar label {
  gap: 8px;
  color: #f47416;
  font-weight: 900;
}

.record-toolbar input {
  max-width: 136px;
  border: 1px solid #f2a15a;
  border-radius: 12px;
  padding: 8px;
  color: #15120f;
  background: #fff;
}

.feature-card {
  gap: 14px;
  padding: 16px;
  border: 1.5px solid #f2a15a;
  color: #15120f;
}

.feature-card h2,
.plain-card h2,
.exercise-card h3 {
  margin: 0;
}

.feature-card p,
.plain-card p,
.exercise-card p {
  margin: 4px 0 0;
  color: #8f887e;
}

.feature-card svg:last-child {
  margin-left: auto;
  color: #f47416;
}

.feature-icon,
.tile-illustration,
.exercise-art {
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: #fff2e8;
  color: #f47416;
  font-weight: 900;
}

.feature-icon {
  width: 64px;
  height: 64px;
  font-size: 28px;
}

.tile-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.icon-tile {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-height: 116px;
  border: 0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(48, 43, 35, 0.08);
  font-weight: 900;
}

.tile-illustration {
  width: 54px;
  height: 54px;
  font-size: 24px;
}

.card-list {
  display: grid;
  gap: 10px;
}

.exercise-card {
  gap: 12px;
  padding: 12px;
}

.exercise-card > div:nth-child(2) {
  flex: 1;
}

.exercise-card button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid #f2a15a;
  border-radius: 50%;
  color: #f47416;
  background: #fff;
}

.exercise-art {
  width: 56px;
  height: 56px;
}

.plain-card {
  margin-top: 14px;
  padding: 16px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.metric-grid span {
  border-radius: 14px;
  background: #f7f4ef;
  padding: 12px;
  text-align: center;
  font-weight: 850;
}
```

- [ ] **Step 8: Wire `RecordPage` into `App`**

Modify `src/App.tsx`:

```tsx
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { getTodayKey } from './lib/date';
import type { PageId } from './lib/types';
import { useFitnessData } from './hooks/useFitnessData';
import { RecordPage } from './pages/RecordPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('record');
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const { exercises, records, actions } = useFitnessData();

  return (
    <main className="app-shell">
      {activePage === 'record' ? (
        <RecordPage
          date={selectedDate}
          exercises={exercises}
          records={records}
          onDateChange={setSelectedDate}
          onAddStrengthSet={actions.addStrengthSet}
          onDeleteStrengthSet={actions.deleteStrengthSet}
          onAddClimbEntry={actions.addClimbEntry}
          onSaveBodyMeasurement={actions.saveBodyMeasurement}
        />
      ) : (
        <PlaceholderPage title={activePage === 'stats' ? '统计' : '导出'} />
      )}
      <BottomNav activePage={activePage} onChange={setActivePage} />
    </main>
  );
}
```

- [ ] **Step 9: Verify record UI tests pass**

Run:

```powershell
npm test -- src/App.test.tsx src/pages/RecordPage.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Commit record page**

```powershell
git add src/App.tsx src/styles.css src/components src/pages/RecordPage.tsx src/pages/RecordPage.test.tsx src/App.test.tsx
git commit -m "feat: add record page UI"
```

## Task 6: Stats Page Charts

**Files:**
- Create: `src/pages/StatsPage.tsx`
- Test: `src/pages/StatsPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing stats page test**

Create `src/pages/StatsPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_EXERCISES } from '../lib/defaultExercises';
import type { DailyRecord } from '../lib/types';
import { StatsPage } from './StatsPage';

const records: DailyRecord[] = [
  {
    date: '2026-06-16',
    strengthSets: [{ id: 's1', exerciseId: DEFAULT_EXERCISES[0].id, bodyPart: 'chest', weight: 30, reps: 8, timestamp: '2026-06-16T10:00:00.000Z' }],
    climbEntries: [],
    bodyMeasurement: { date: '2026-06-16', weightKg: 78.5, armCm: 35, waistCm: 86, updatedAt: '2026-06-16T09:00:00.000Z' },
    updatedAt: '2026-06-16T10:00:00.000Z'
  }
];

describe('StatsPage', () => {
  it('renders date range controls and chart sections', () => {
    render(<StatsPage records={records} exercises={DEFAULT_EXERCISES} />);
    expect(screen.getByRole('heading', { name: '统计' })).toBeInTheDocument();
    expect(screen.getByLabelText('开始日期')).toBeInTheDocument();
    expect(screen.getByLabelText('结束日期')).toBeInTheDocument();
    expect(screen.getByText('身体数据趋势')).toBeInTheDocument();
    expect(screen.getByText('力量训练趋势')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run stats page test to verify failure**

Run:

```powershell
npm test -- src/pages/StatsPage.test.tsx
```

Expected: FAIL because `StatsPage` does not exist.

- [ ] **Step 3: Implement stats page**

Create `src/pages/StatsPage.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getTodayKey } from '../lib/date';
import { buildBodyTrend, buildStrengthTrend } from '../lib/stats';
import type { DailyRecord, Exercise } from '../lib/types';

interface StatsPageProps {
  records: DailyRecord[];
  exercises: Exercise[];
}

export function StatsPage({ records, exercises }: StatsPageProps) {
  const today = getTodayKey();
  const [startDate, setStartDate] = useState(records[0]?.date ?? today);
  const [endDate, setEndDate] = useState(today);
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? '');

  const bodyTrend = useMemo(() => buildBodyTrend(records, startDate, endDate), [records, startDate, endDate]);
  const strengthTrend = useMemo(() => buildStrengthTrend(records, exerciseId, startDate, endDate), [records, exerciseId, startDate, endDate]);

  return (
    <section className="page stats-page">
      <header className="page-header">
        <h1>统计</h1>
      </header>

      <div className="range-grid">
        <label>
          <span>开始</span>
          <input aria-label="开始日期" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          <span>结束</span>
          <input aria-label="结束日期" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
      </div>

      <section className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>身体数据趋势</h2>
            <p>体重 / 手臂围 / 腰围</p>
          </div>
          <span>生成图</span>
        </div>
        <div className="chart-frame">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bodyTrend}>
              <CartesianGrid stroke="#eee6dc" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weightKg" name="体重" stroke="#f47416" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="armCm" name="手臂" stroke="#1f7567" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="waistCm" name="腰围" stroke="#394b7c" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-card">
        <div className="chart-heading">
          <div>
            <h2>力量训练趋势</h2>
            <p>按动作查看重量、次数、总训练量</p>
          </div>
        </div>
        <select aria-label="选择动作" value={exerciseId} onChange={(event) => setExerciseId(event.target.value)}>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
          ))}
        </select>
        <div className="chart-frame">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={strengthTrend}>
              <CartesianGrid stroke="#eee6dc" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="maxWeight" name="最大重量" stroke="#f47416" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="totalReps" name="总次数" stroke="#1f7567" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="totalVolume" name="总训练量" stroke="#394b7c" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </section>
  );
}
```

Append to `src/styles.css`:

```css
.range-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.range-grid label,
.chart-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 28px rgba(48, 43, 35, 0.08);
}

.range-grid label {
  display: grid;
  gap: 6px;
  padding: 12px;
}

.range-grid span {
  color: #928b82;
  font-size: 12px;
}

.range-grid input,
.chart-card select {
  width: 100%;
  border: 0;
  background: #f8f6f1;
  border-radius: 12px;
  padding: 10px;
  font-weight: 800;
  color: #15120f;
}

.chart-card {
  padding: 16px;
  margin-bottom: 14px;
}

.chart-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-heading h2 {
  margin: 0;
  font-size: 21px;
}

.chart-heading p {
  margin: 4px 0 0;
  color: #8f887e;
  font-size: 13px;
}

.chart-heading span {
  flex: 0 0 auto;
  background: #fff3e9;
  color: #f47416;
  border-radius: 12px;
  padding: 7px 9px;
  font-size: 12px;
  font-weight: 850;
}

.chart-frame {
  height: 240px;
  border: 1px solid #f1eadf;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffbf7, #f8f7f3);
  padding: 8px;
  margin-top: 12px;
}
```

- [ ] **Step 4: Wire stats page into app**

Modify `src/App.tsx` so the non-record pages render `StatsPage` and export placeholder:

```tsx
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { getTodayKey } from './lib/date';
import type { PageId } from './lib/types';
import { useFitnessData } from './hooks/useFitnessData';
import { RecordPage } from './pages/RecordPage';
import { StatsPage } from './pages/StatsPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('record');
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const { exercises, records, actions } = useFitnessData();

  return (
    <main className="app-shell">
      {activePage === 'record' && (
        <RecordPage
          date={selectedDate}
          exercises={exercises}
          records={records}
          onDateChange={setSelectedDate}
          onAddStrengthSet={actions.addStrengthSet}
          onDeleteStrengthSet={actions.deleteStrengthSet}
          onAddClimbEntry={actions.addClimbEntry}
          onSaveBodyMeasurement={actions.saveBodyMeasurement}
        />
      )}
      {activePage === 'stats' && <StatsPage records={records} exercises={exercises} />}
      {activePage === 'export' && <PlaceholderPage title="导出" />}
      <BottomNav activePage={activePage} onChange={setActivePage} />
    </main>
  );
}
```

- [ ] **Step 5: Verify stats page tests pass**

Run:

```powershell
npm test -- src/pages/StatsPage.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit stats page**

```powershell
git add src/App.tsx src/styles.css src/pages/StatsPage.tsx src/pages/StatsPage.test.tsx
git commit -m "feat: add stats page charts"
```

## Task 7: Export Page And Import Backup

**Files:**
- Create: `src/pages/ExportPage.tsx`
- Test: `src/pages/ExportPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing export page test**

Create `src/pages/ExportPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_EXERCISES } from '../lib/defaultExercises';
import { ExportPage } from './ExportPage';

describe('ExportPage', () => {
  it('shows csv, backup, and import actions', () => {
    render(<ExportPage records={[]} exercises={DEFAULT_EXERCISES} onImportBackup={vi.fn()} />);
    expect(screen.getByRole('heading', { name: '导出' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '导出 CSV' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '导出备份文件' })).toBeInTheDocument();
    expect(screen.getByLabelText('导入备份文件')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run export page test to verify failure**

Run:

```powershell
npm test -- src/pages/ExportPage.test.tsx
```

Expected: FAIL because `ExportPage` does not exist.

- [ ] **Step 3: Implement export page**

Create `src/pages/ExportPage.tsx`:

```tsx
import { useState } from 'react';
import { getTodayKey } from '../lib/date';
import { buildCsv, buildJsonBackup, parseJsonBackup } from '../lib/export';
import type { DailyRecord, Exercise } from '../lib/types';

interface ExportPageProps {
  records: DailyRecord[];
  exercises: Exercise[];
  onImportBackup: (exercises: Exercise[], records: DailyRecord[]) => Promise<void> | void;
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportPage({ records, exercises, onImportBackup }: ExportPageProps) {
  const today = getTodayKey();
  const [startDate, setStartDate] = useState(records[0]?.date ?? today);
  const [endDate, setEndDate] = useState(today);

  function exportCsv() {
    downloadText(`fitness-${startDate}-${endDate}.csv`, buildCsv(records, exercises, startDate, endDate), 'text/csv;charset=utf-8');
  }

  function exportJson() {
    downloadText(`fitness-backup-${today}.json`, JSON.stringify(buildJsonBackup(records, exercises), null, 2), 'application/json;charset=utf-8');
  }

  async function importJson(file: File | undefined) {
    if (!file) return;
    const backup = parseJsonBackup(await file.text());
    const ok = window.confirm('导入会替换本机现有数据，确定继续吗？');
    if (ok) {
      await onImportBackup(backup.exercises, backup.dailyRecords);
    }
  }

  return (
    <section className="page export-page">
      <header className="page-header">
        <h1>导出</h1>
      </header>

      <div className="range-grid">
        <label>
          <span>开始</span>
          <input aria-label="开始日期" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          <span>结束</span>
          <input aria-label="结束日期" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
      </div>

      <section className="export-card highlighted">
        <div className="export-icon">表</div>
        <div>
          <h2>CSV 表格</h2>
          <p>适合用 Excel、WPS、Numbers 打开，查看训练和身体数据明细。</p>
        </div>
        <button type="button" onClick={exportCsv}>导出 CSV</button>
      </section>

      <section className="export-card">
        <div className="export-icon backup">备</div>
        <div>
          <h2>JSON 备份</h2>
          <p>保留完整结构，后续可以导回网站，用来换手机或恢复数据。</p>
        </div>
        <button type="button" onClick={exportJson}>导出备份文件</button>
      </section>

      <section className="export-card">
        <div>
          <h2>导入备份</h2>
          <p>从之前导出的 JSON 文件恢复记录。</p>
        </div>
        <label className="file-button">
          选择备份文件
          <input aria-label="导入备份文件" type="file" accept="application/json" onChange={(event) => void importJson(event.target.files?.[0])} />
        </label>
      </section>
    </section>
  );
}
```

Append to `src/styles.css`:

```css
.export-card {
  display: grid;
  gap: 12px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(48, 43, 35, 0.08);
  padding: 16px;
  margin-bottom: 14px;
}

.export-card.highlighted {
  border: 1px solid #f4dac7;
}

.export-card h2 {
  margin: 0;
  font-size: 21px;
}

.export-card p {
  margin: 4px 0 0;
  color: #8f887e;
  line-height: 1.45;
}

.export-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: #fff2e8;
  color: #f47416;
  font-size: 25px;
  font-weight: 900;
}

.export-icon.backup {
  background: #eef6f4;
  color: #1f7567;
}

.export-card button,
.file-button {
  border: 0;
  border-radius: 15px;
  background: #f47416;
  color: #fff;
  padding: 12px;
  text-align: center;
  font-weight: 880;
}

.export-card:not(.highlighted) button,
.file-button {
  background: #f7f4ef;
  color: #4f4740;
}

.file-button input {
  display: none;
}
```

- [ ] **Step 4: Wire export page into app**

Modify `src/App.tsx` so export page replaces the placeholder:

```tsx
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { getTodayKey } from './lib/date';
import type { PageId } from './lib/types';
import { useFitnessData } from './hooks/useFitnessData';
import { RecordPage } from './pages/RecordPage';
import { StatsPage } from './pages/StatsPage';
import { ExportPage } from './pages/ExportPage';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('record');
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const { exercises, records, actions } = useFitnessData();

  return (
    <main className="app-shell">
      {activePage === 'record' && (
        <RecordPage
          date={selectedDate}
          exercises={exercises}
          records={records}
          onDateChange={setSelectedDate}
          onAddStrengthSet={actions.addStrengthSet}
          onDeleteStrengthSet={actions.deleteStrengthSet}
          onAddClimbEntry={actions.addClimbEntry}
          onSaveBodyMeasurement={actions.saveBodyMeasurement}
        />
      )}
      {activePage === 'stats' && <StatsPage records={records} exercises={exercises} />}
      {activePage === 'export' && <ExportPage records={records} exercises={exercises} onImportBackup={actions.replaceAll} />}
      <BottomNav activePage={activePage} onChange={setActivePage} />
    </main>
  );
}
```

- [ ] **Step 5: Verify export page tests pass**

Run:

```powershell
npm test -- src/pages/ExportPage.test.tsx src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit export page**

```powershell
git add src/App.tsx src/styles.css src/pages/ExportPage.tsx src/pages/ExportPage.test.tsx
git commit -m "feat: add export and backup page"
```

## Task 8: Final Mobile QA, Build, And Local Preview

**Files:**
- Modify only if verification reveals issues.

- [ ] **Step 1: Run full test suite**

Run:

```powershell
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite build exit with code `0`.

- [ ] **Step 3: Start local dev server**

Run:

```powershell
npm run dev
```

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 4: Browser mobile viewport verification**

Open the local URL in the in-app Browser at an iPhone-sized viewport.

Verify manually:

- Record page loads first.
- Bottom navigation shows exactly Record, Stats, Export.
- Header does not duplicate the same three navigation items.
- Backfill date input is visible.
- Strength body part tiles fit on mobile without text overflow.
- Stats page date range controls are usable.
- Body and strength charts render.
- Export page shows CSV, JSON backup, and JSON import.

- [ ] **Step 5: Commit final QA fixes**

If Step 4 required fixes, commit them:

```powershell
git add src
git commit -m "fix: polish mobile fitness PWA"
```

If no fixes were needed, do not create an empty commit.

## Self-Review

Spec coverage:

- Public PWA scaffold is covered by Task 1 and Task 8.
- Local phone storage through IndexedDB is covered by Task 4.
- Record page, backfill, strength groups, climb, and body data are covered by Task 5.
- Stats date range, body trend, and strength trend charts are covered by Task 3 and Task 6.
- CSV export, JSON backup, and JSON import are covered by Task 3 and Task 7.
- Mobile visual style and bottom navigation are covered by Task 5 through Task 8.

Placeholder scan:

- No placeholder markers or vague implementation steps are used.
- Each code-writing task includes concrete files and code blocks.

Type consistency:

- `Exercise`, `DailyRecord`, `StrengthSet`, `ClimbEntry`, and `BodyMeasurement` are defined in Task 2 and reused consistently.
- `buildBodyTrend`, `buildStrengthTrend`, `buildCsv`, `buildJsonBackup`, and `parseJsonBackup` are introduced before UI pages consume them.
- Repository action names in Task 4 match `App.tsx`, `RecordPage`, and `ExportPage` usage.
