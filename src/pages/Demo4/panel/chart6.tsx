import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import type { Customer } from "../stores";
import Chart from "@/components/chart";

use([CanvasRenderer, PieChart, LegendComponent, TooltipComponent]);

export default function Chart6(props: { customers: Customer[] }) {
  const levelData = { A: 0, B: 0, C: 0 };
  props.customers.forEach((c) => { levelData[c.level]++; });
  const option = {
    tooltip: { trigger: "item" },
    legend: { bottom: 10, textStyle: { color: "#e8efff" } },
    series: [
      {
        type: "pie",
        radius: "60%",
        center: ["50%", "50%"],
        data: [
          { value: levelData.A, name: "A级", itemStyle: { color: "#bdcfff" } },
          { value: levelData.B, name: "B级", itemStyle: { color: "#789eff" } },
          { value: levelData.C, name: "C级", itemStyle: { color: "#3061DB" } },
        ],
        label: { color: "#e8efff", fontSize: 10 },
      },
    ],
  };
  return <Chart option={option} use={[]} style={{ width: "100%", height: "100%" }} />;
}