import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { useFitnessData } from './hooks/useFitnessData';
import { getTodayKey } from './lib/date';
import type { PageId } from './lib/types';
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
