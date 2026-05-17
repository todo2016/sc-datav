import { useEffect } from "react";
import styled from "styled-components";
import useMoveTo from "@/hooks/useMoveTo";
import AutoFit from "@/components/autoFit";
import { useChinaMapStore } from "../stores";
import Header from "./header";
import Chart1 from "./chart1";
import Chart2 from "./chart2";
import Chart3 from "./chart3";
import Chart4 from "./chart4";
import Chart5 from "./chart5";
import Chart6 from "./chart6";

const GridWrapper = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(6, minmax(0, 1fr));
  gap: 20px;
  padding: 20px;
`;

const CardWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
`;

const CardTitle = styled.div`
  position: relative;
  font-size: 16px;
  color: #e8efff;
  border-bottom: 1px solid rgba(186, 206, 255, 0.33);
  line-height: 50px;
  margin-inline: 20px;
  &::before { content: ""; position: absolute; left: 0; bottom: 0; width: 50px; height: 4px; background-color: #bdcfff; }
  &::after { content: ""; position: absolute; right: 0; bottom: 0; width: 4px; height: 4px; border-radius: 2px; background-color: #bdcfff; }
`;

const CardContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const Card = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { title: string }) => (
  <div ref={props.ref as React.RefObject<HTMLDivElement>} {...props}>
    <svg width="100%" height="100%" fill="none" viewBox="0 0 260 180" preserveAspectRatio="none">
      <path fill="#3061DB" fillRule="evenodd" d="M206 10 190 0H9L0 9v171h45l4.5-4h161l4.5 4h45V10h-54Zm53 1h-53.287l-16-10H9.414L1 9.414V179h43.62l4.5-4h161.76l4.5 4H259V11Z" />
      <path fill="#789eff" d="m51 178-2 2h162l-2-2H51ZM0 0v7l7-7H0Z" />
      <path stroke="#789eff" strokeWidth={2} d="M1 169v10h10M259 21V11h-10" />
    </svg>
    <CardWrapper>
      <CardTitle>{props.title}</CardTitle>
      <CardContent>{props.children}</CardContent>
    </CardWrapper>
  </div>
);

export default function Panel() {
  const topBox = useMoveTo("toBottom", 0.6);
  const leftBox = useMoveTo("toRight", 0.8, 0.5);
  const leftBox1 = useMoveTo("toRight", 0.8, 0.6);
  const leftBox2 = useMoveTo("toRight", 0.8, 0.7);
  const rightBox = useMoveTo("toLeft", 0.8, 0.5);
  const rightBox1 = useMoveTo("toLeft", 0.8, 0.6);
  const rightBox2 = useMoveTo("toLeft", 0.8, 0.7);
  const mapPlayComplete = useChinaMapStore((s) => s.mapPlayComplete);
  const filteredCustomers = useChinaMapStore((s) => s.filteredCustomers);

  useEffect(() => {
    if (mapPlayComplete) {
      topBox.restart();
      leftBox.restart();
      leftBox1.restart();
      leftBox2.restart();
      rightBox.restart();
      rightBox1.restart();
      rightBox2.restart();
    }
  }, [mapPlayComplete]);

  return (
    <AutoFit>
      <Header ref={topBox.ref as any} />
      <GridWrapper>
        <div></div>
        <Card ref={leftBox.ref} style={{ gridArea: "1 / 1 / 3 / 2" }} title="客户总数">
          <Chart1 customers={filteredCustomers} />
        </Card>
        <Card ref={leftBox1.ref} style={{ gridArea: "3 / 1 / 5 / 2" }} title="客户分布">
          <Chart2 customers={filteredCustomers} />
        </Card>
        <Card ref={leftBox2.ref} style={{ gridArea: "5 / 1 / 7 / 2" }} title="客户类型">
          <Chart3 customers={filteredCustomers} />
        </Card>
        <Card ref={rightBox.ref} style={{ gridArea: "1 / 4 / 3 / 5" }} title="区域排行">
          <Chart4 customers={filteredCustomers} />
        </Card>
        <Card ref={rightBox1.ref} style={{ gridArea: "3 / 4 / 5 / 5" }} title="增长趋势">
          <Chart5 customers={filteredCustomers} />
        </Card>
        <Card ref={rightBox2.ref} style={{ gridArea: "5 / 4 / 7 / 5" }} title="客户等级">
          <Chart6 customers={filteredCustomers} />
        </Card>
      </GridWrapper>
    </AutoFit>
  );
}