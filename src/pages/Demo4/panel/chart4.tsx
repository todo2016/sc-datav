import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import type { Customer } from "../stores";
import Chart from "@/components/chart";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

export default function Chart4(props: { customers: Customer[] }) {
  const cityData: Record<string, number> = {};
  props.customers.forEach((c) => { cityData[c.location.cityName] = (cityData[c.location.cityName] || 0) + 1; });
  const sorted = Object.entries(cityData).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 50, right: 20, top: 10, bottom: 30 },
    xAxis: { type: "category", data: sorted.map(([name]) => name), axisLabel: { color: "#e8efff", fontSize: 9, rotate: 30 } },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: sorted.map(([, v]) => v), itemStyle: { color: "#789eff" } }],
  };
  return <Chart option={option} use={[]} style={{ width: "100%", height: "100%" }} />;
}