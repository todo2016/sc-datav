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

export default function Chart3(props: { customers: Customer[] }) {
  const typeData = { potential: 0, partner: 0, key: 0 };
  props.customers.forEach((c) => { typeData[c.type]++; });
  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { bottom: 10, textStyle: { color: "#e8efff" } },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        label: { color: "#e8efff", fontSize: 10 },
        data: [
          { value: typeData.potential, name: "潜在客户", itemStyle: { color: "#789eff" } },
          { value: typeData.partner, name: "合作伙伴", itemStyle: { color: "#3061DB" } },
          { value: typeData.key, name: "重点客户", itemStyle: { color: "#bdcfff" } },
        ],
      },
    ],
  };
  return <Chart option={option} use={[]} style={{ width: "100%", height: "100%" }} />;
}