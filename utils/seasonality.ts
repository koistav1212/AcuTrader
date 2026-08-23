export interface HistoricalDataPoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface SeasonalityMetrics {
  averageReturn: number;
  medianReturn: number;
  positiveFrequency: number;
  sampleSize: number;
}

export interface MonthlySeasonality extends SeasonalityMetrics {
  month: string;
}

export interface WeeklySeasonality extends SeasonalityMetrics {
  day: string;
}

export interface YearlySeasonality {
  year: number;
  return: number;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMetrics(returns: number[]): SeasonalityMetrics {
  const sampleSize = returns.length;
  if (sampleSize === 0) {
    return { averageReturn: 0, medianReturn: 0, positiveFrequency: 0, sampleSize: 0 };
  }

  const sum = returns.reduce((a, b) => a + b, 0);
  const averageReturn = sum / sampleSize;

  const sorted = [...returns].sort((a, b) => a - b);
  const medianReturn = sampleSize % 2 === 0
    ? (sorted[sampleSize / 2 - 1] + sorted[sampleSize / 2]) / 2
    : sorted[Math.floor(sampleSize / 2)];

  const wins = returns.filter(r => r > 0).length;
  const positiveFrequency = (wins / sampleSize) * 100;

  return { averageReturn, medianReturn, positiveFrequency, sampleSize };
}

export function calculateMonthlySeasonality(data: HistoricalDataPoint[]): MonthlySeasonality[] {
  if (!data || data.length === 0) return [];

  // Group by year-month
  const monthlyData: Record<string, { start: number; end: number }> = {};

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const date = new Date(point.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = { start: point.close, end: point.close };
    }
    // Update the end price to the latest seen in this month
    monthlyData[yearMonth].end = point.close;
  }

  // Aggregate by month (0-11)
  const monthAgg: Record<number, number[]> = {};
  for (let i = 0; i < 12; i++) monthAgg[i] = [];

  Object.entries(monthlyData).forEach(([key, val]) => {
    const month = parseInt(key.split("-")[1], 10);
    const ret = ((val.end - val.start) / val.start) * 100;
    monthAgg[month].push(ret);
  });

  return Array.from({ length: 12 }).map((_, i) => {
    const returns = monthAgg[i];
    const metrics = getMetrics(returns);
    return {
      month: MONTH_NAMES[i],
      ...metrics,
    };
  });
}

export function calculateWeeklySeasonality(data: HistoricalDataPoint[]): WeeklySeasonality[] {
  if (!data || data.length < 2) return [];

  // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
  const dayAgg: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const date = new Date(curr.date);
    const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    if (day >= 1 && day <= 5) {
      if (prev.close) {
        const ret = ((curr.close - prev.close) / prev.close) * 100;
        dayAgg[day].push(ret);
      }
    }
  }

  return [1, 2, 3, 4, 5].map(day => {
    const returns = dayAgg[day];
    const metrics = getMetrics(returns);
    return {
      day: DAY_NAMES[day],
      ...metrics,
    };
  });
}

export function calculateYearlySeasonality(data: HistoricalDataPoint[]): YearlySeasonality[] {
  if (!data || data.length === 0) return [];

  const yearlyData: Record<number, { start: number; end: number }> = {};

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const date = new Date(point.date);
    const year = date.getFullYear();

    if (!yearlyData[year]) {
      yearlyData[year] = { start: point.close, end: point.close };
    }
    yearlyData[year].end = point.close;
  }

  return Object.keys(yearlyData).map(y => {
    const year = parseInt(y, 10);
    const val = yearlyData[year];
    const ret = ((val.end - val.start) / val.start) * 100;
    return {
      year,
      return: ret,
    };
  }).sort((a, b) => a.year - b.year);
}
