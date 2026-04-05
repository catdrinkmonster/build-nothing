import { describe, expect, it } from "vitest";

import { BENCHMARK_CHART_ROWS } from "./benchmark-chart";

describe("BENCHMARK_CHART_ROWS", () => {
  it("keeps the benchmark absurdly skewed in favor of your app", () => {
    expect(BENCHMARK_CHART_ROWS[0]).toMatchObject({
      label: "your app",
      value: 97,
    });
    expect(BENCHMARK_CHART_ROWS[1]?.label).toBe("openclaw fork #7,284,119");
    expect(BENCHMARK_CHART_ROWS[2]?.label).toBe("travel route optimizer");
    expect(BENCHMARK_CHART_ROWS[3]?.label).toBe("thing that exists but for xyz");
  });
});
