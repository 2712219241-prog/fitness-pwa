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
