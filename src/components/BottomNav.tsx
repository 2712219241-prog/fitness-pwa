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
