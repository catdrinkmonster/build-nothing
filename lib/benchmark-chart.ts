export type BenchmarkRow = {
  label: string;
  value: number;
  tone: string;
};

export const BENCHMARK_CHART_ROWS: BenchmarkRow[] = [
  { label: "your app", value: 97, tone: "bg-[var(--accent)]" },
  { label: "openclaw fork #7,284,119", value: 18, tone: "bg-white/46" },
  { label: "travel route optimizer", value: 11, tone: "bg-white/32" },
  { label: "thing that exists but for xyz", value: 6, tone: "bg-white/24" },
];

export const BENCHMARK_ROW_FILL_DURATION_S = 1.12;
export const BENCHMARK_ROW_STAGGER_S = 1.12;

export function getBenchmarkRowDelay(index: number, rowCount: number) {
  return Math.max(rowCount - index - 1, 0) * BENCHMARK_ROW_STAGGER_S;
}
