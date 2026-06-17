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
        <button type="button" onClick={exportCsv}>
          导出 CSV
        </button>
      </section>

      <section className="export-card">
        <div className="export-icon backup">备</div>
        <div>
          <h2>JSON 备份</h2>
          <p>保留完整结构，后续可以导回网站，用来换手机或恢复数据。</p>
        </div>
        <button type="button" onClick={exportJson}>
          导出备份文件
        </button>
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
