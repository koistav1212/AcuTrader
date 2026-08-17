export interface HistoricalDataPoint {
  date: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface MonthlySeasonality {
  month: number;
  monthName: string;
  avgReturn: number;
  medianReturn: number;
  winRate: number;
}

export interface WeeklySeasonality {
  week: number;
  avgReturn: number;
}

export interface YearlySeasonality {
  year: number;
  data: { date: string; cumulativeReturn: number }[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function calculateMonthlySeasonality(data: HistoricalDataPoint[]): MonthlySeasonality[] {
  if (!data || data.length === 0) return [];

  // Group by year-month
  const monthlyData: Record<string, { start: number; end: number; returns: number }> = {};

  let currentMonthKey = "";
  let monthStartPrice = 0;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const date = new Date(point.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth()}`;

    if (yearMonth !== currentMonthKey) {
      if (currentMonthKey !== "" && i > 0) {
        monthlyData[currentMonthKey].end = data[i - 1].close;
        monthlyData[currentMonthKey].returns = (monthlyData[currentMonthKey].end / monthlyData[currentMonthKey].start) - 1;
      }
      currentMonthKey = yearMonth;
      monthStartPrice = point.open || point.close; // Approximate if open missing
      monthlyData[yearMonth] = { start: monthStartPrice, end: point.close, returns: 0 };
    }
  }
  
  if (currentMonthKey !== "") {
    monthlyData[currentMonthKey].end = data[data.length - 1].close;
    monthlyData[currentMonthKey].returns = (monthlyData[currentMonthKey].end / monthlyData[currentMonthKey].start) - 1;
  }

  // Aggregate by month
  const monthAgg: Record<number, number[]> = {};
  for (let i = 0; i < 12; i++) monthAgg[i] = [];

  Object.entries(monthlyData).forEach(([key, val]) => {
    const month = parseInt(key.split("-")[1], 10);
    monthAgg[month].push(val.returns * 100);
  });

  return Array.from({ length: 12 }).map((_, i) => {
    const returns = monthAgg[i].sort((a, b) => a - b);
    const count = returns.length;
    const wins = returns.filter(r => r > 0).length;
    const sum = returns.reduce((a, b) => a + b, 0);

    const avgReturn = count > 0 ? sum / count : 0;
    const medianReturn = count > 0 ? (count % 2 === 0 ? (returns[count / 2 - 1] + returns[count / 2]) / 2 : returns[Math.floor(count / 2)]) : 0;
    const winRate = count > 0 ? (wins / count) * 100 : 0;

    return {
      month: i,
      monthName: MONTH_NAMES[i],
      avgReturn,
      medianReturn,
      winRate
    };
  });
}

// Simple ISO week number calculator
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}

export function calculateWeeklySeasonality(data: HistoricalDataPoint[]): WeeklySeasonality[] {
  if (!data || data.length === 0) return [];

  // Group by year-week
  const weeklyData: Record<string, { start: number; end: number; returns: number }> = {};

  let currentWeekKey = "";

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const date = new Date(point.date);
    const week = getWeekNumber(date);
    const yearWeek = `${date.getFullYear()}-${week}`;

    if (yearWeek !== currentWeekKey) {
      if (currentWeekKey !== "" && i > 0) {
        weeklyData[currentWeekKey].end = data[i - 1].close;
        weeklyData[currentWeekKey].returns = (weeklyData[currentWeekKey].end / weeklyData[currentWeekKey].start) - 1;
      }
      currentWeekKey = yearWeek;
      weeklyData[yearWeek] = { start: point.open || point.close, end: point.close, returns: 0 };
    }
  }

  if (currentWeekKey !== "") {
    weeklyData[currentWeekKey].end = data[data.length - 1].close;
    weeklyData[currentWeekKey].returns = (weeklyData[currentWeekKey].end / weeklyData[currentWeekKey].start) - 1;
  }

  const weekAgg: Record<number, number[]> = {};
  for (let i = 1; i <= 52; i++) weekAgg[i] = [];

  Object.entries(weeklyData).forEach(([key, val]) => {
    const week = parseInt(key.split("-")[1], 10);
    if (week >= 1 && week <= 52) {
      weekAgg[week].push(val.returns * 100);
    }
  });

  return Array.from({ length: 52 }).map((_, i) => {
    const returns = weekAgg[i + 1];
    const sum = returns.reduce((a, b) => a + b, 0);
    const count = returns.length;
    return {
      week: i + 1,
      avgReturn: count > 0 ? sum / count : 0
    };
  });
}

export function calculateYearlySeasonality(data: HistoricalDataPoint[], yearsToInclude?: number[]): YearlySeasonality[] {
  if (!data || data.length === 0) return [];

  const yearlySeries: Record<number, { date: string; cumulativeReturn: number }[]> = {};
  let currentYear = -1;
  let yearStartPrice = 0;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const date = new Date(point.date);
    const year = date.getFullYear();

    if (yearsToInclude && yearsToInclude.length > 0 && !yearsToInclude.includes(year)) {
      continue;
    }

    if (year !== currentYear) {
      currentYear = year;
      yearStartPrice = point.open || point.close;
      if (!yearlySeries[year]) yearlySeries[year] = [];
    }

    const cumulativeReturn = ((point.close / yearStartPrice) - 1) * 100;
    
    // Normalize date to current year for overlapping chart, e.g. "01-15"
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    yearlySeries[year].push({
      date: `${month}-${day}`, // We chart by MM-DD
      cumulativeReturn
    });
  }

  return Object.keys(yearlySeries).map(y => ({
    year: parseInt(y, 10),
    data: yearlySeries[parseInt(y, 10)]
  }));
}
