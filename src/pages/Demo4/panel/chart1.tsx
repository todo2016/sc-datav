import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import type { Customer } from "../stores";
import Chart from "@/components/chart";

use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent]);

export default function Chart1(props: { customers: Customer[] }) {
  const total = props.customers.length;
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        radius: "90%",
        center: ["50%", "100%"],
        progress: { show: true, width: 18, itemStyle: { color: "#3061DB" } },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 18, color: [[1, "#293b41"]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: { valueAnimation: true, fontSize: 32, color: "#e8efff", offsetCenter: [0, -10], formatter: "{total}" },
        data: [{ value: total }],
      },
    ],
  };
  return <Chart option={option} use={[]} style={{ width: "100%", height: "100%" }} />;
}