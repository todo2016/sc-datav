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

export default function Chart2(props: { customers: Customer[] }) {
  const provinceData: Record<string, number> = {};
  props.customers.forEach((c) => { provinceData[c.location.provinceName] = (provinceData[c.location.provinceName] || 0) + 1; });
  const sorted = Object.entries(provinceData).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: 50, right: 30, top: 20, bottom: 30 },
    xAxis: { type: "value" },
    yAxis: { type: "category", data: sorted.map(([name]) => name), axisLabel: { color: "#e8efff", fontSize: 10 } },
    series: [{ type: "bar", data: sorted.map(([, value]) => value), itemStyle: { color: "#3061DB" }, label: { show: true, position: "right", color: "#e8efff", fontSize: 10 } }],
  };
  return <Chart option={option} use={[]} style={{ width: "100%", height: "100%" }} />;
}