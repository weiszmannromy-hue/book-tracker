/** עזרי תאריכים - הכל בזמן מקומי (לא UTC), כדי שיתאים ל"היום" של המשתמש. */

export function todayStr(d: Date = new Date()): string {
  return toDateStr(d);
}

export function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  return toDateStr(date);
}

export function startOfWeek(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return addDays(dateStr, -date.getDay());
}

export const WEEKDAY_LABELS = ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת'];
export const WEEKDAY_LABELS_SHORT = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

export const MONTH_LABELS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

/** רשימת תאי לוח שנה עבור חודש נתון, כולל ריפוד לפני/אחרי כדי להתחיל בשבת/יום א׳. */
export function calendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  return cells;
}
