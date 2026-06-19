import { lazy, Suspense, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { useFitnessData } from './hooks/useFitnessData';
import { getTodayKey } from './lib/date';
import type { PageId } from './lib/types';
import { RecordPage } from './pages/RecordPage';

const StatsPage = lazy(() => import('./pages/StatsPage').then((module) => ({ default: module.StatsPage })));
const ExportPage = lazy(() => import('./pages/ExportPage').then((module) => ({ default: module.ExportPage })));

function LoadingPage({ title }: { title: string }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
      </header>
      <div className="plain-card">正在加载...</div>
    </section>
  );
}

export default function App() {
  const today = getTodayKey();
  const [activePage, setActivePage] = useState<PageId>('record');
  const [selectedDate, setSelectedDate] = useState(today);
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
          onSaveDailyNote={actions.saveDailyNote}
          onAddExercise={actions.addExercise}
          onDeleteExercise={actions.deleteExercise}
          maxDate={today}
        />
      )}
      {activePage === 'stats' && (
        <Suspense fallback={<LoadingPage title="统计" />}>
          <StatsPage records={records} exercises={exercises} />
        </Suspense>
      )}
      {activePage === 'export' && (
        <Suspense fallback={<LoadingPage title="导出" />}>
          <ExportPage records={records} exercises={exercises} onImportBackup={actions.replaceAll} />
        </Suspense>
      )}
      <BottomNav activePage={activePage} onChange={setActivePage} />
    </main>
  );
}
