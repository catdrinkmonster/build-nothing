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
