import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import type { Customer } from "../stores";
import Chart from "@/components/chart";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

export default function Chart5(_props: { customers: Customer[] }) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 50, right: 20, top: 10, bottom: 30 },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"], axisLabel: { color: "#e8efff" } },
    yAxis: { type: "value", axisLabel: { color: "#e8efff" } },
    series: [
      {
        type: "line",
        smooth: true,
        data: [65, 78, 90, 85, 92, 98],
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#3061DB" }, { offset: 1, color: "transparent" }] } },
        lineStyle: { color: "#3061DB" },
        itemStyle: { color: "#3061DB" },
      },
    ],
  };
  return <Chart option={option} use={[]} style={{ width: "100%", height: "100%" }} />;
}