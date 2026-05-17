import styled from "styled-components";
import { useChinaMapStore } from "../stores";
import { PROVINCES } from "../data/provinces";

const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`;

const BreadcrumbItem = styled.span<{ $active?: boolean }>`
  cursor: pointer;
  color: ${(p) => (p.$active ? "#e8efff" : "#789eff")};
  font-weight: ${(p) => (p.$active ? "bold" : "normal")};
  font-size: ${(p) => (p.$active ? "18px" : "14px")};
  transition: color 0.2s;
  &:hover { color: #e8efff; }
`;

const Separator = styled.span`
  color: rgba(186, 206, 255, 0.33);
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid #3061DB;
  color: #e8efff;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  &:hover { background: rgba(48, 97, 219, 0.3); }
`;

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid rgba(186, 206, 255, 0.33);
  color: #789eff;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 8px;
  &:hover { background: rgba(186, 206, 255, 0.1); }
`;

interface HeaderProps {
  ref?: React.RefObject<HTMLDivElement | null>;
}

export default function Header(props: HeaderProps) {
  const level = useChinaMapStore((s) => s.level);
  const breadcrumb = useChinaMapStore((s) => s.breadcrumb);
  const drillUp = useChinaMapStore((s) => s.drillUp);
  const drillToBreadcrumb = useChinaMapStore((s) => s.drillToBreadcrumb);

  return (
    <HeaderWrapper ref={props.ref}>
      {level !== "china" && (
        <BackButton onClick={drillUp}>← 返回</BackButton>
      )}
      <Breadcrumb>
        {breadcrumb.length === 0 && (
          <BreadcrumbItem $active>中国 · 全国客户数据可视化</BreadcrumbItem>
        )}
        {breadcrumb.map((item, idx) => (
          <span key={item.adcode} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {idx > 0 && <Separator>›</Separator>}
            <BreadcrumbItem
              $active={idx === breadcrumb.length - 1}
              onClick={() => drillToBreadcrumb(idx)}>
              {item.name}
            </BreadcrumbItem>
          </span>
        ))}
      </Breadcrumb>
      {breadcrumb.length > 0 && (
        <ResetButton onClick={() => { drillUp(); drillUp(); }}>全国</ResetButton>
      )}
    </HeaderWrapper>
  );
}