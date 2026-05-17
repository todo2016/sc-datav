import { useEffect } from "react";
import styled from "styled-components";
import { useChinaMapStore } from "./stores";
import Map from "./map";
import Panel from "./panel";
import { MOCK_CUSTOMERS } from "./data/mockCustomers";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export default function Demo() {
  useEffect(() => {
    const { customers, setCustomers, reset } = useChinaMapStore.getState();
    if (customers.length === 0) {
      setCustomers(MOCK_CUSTOMERS);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const { level, drillUp } = useChinaMapStore.getState();
        if (level !== "china") {
          drillUp();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      reset();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Wrapper>
      <Map />
      <Panel />
    </Wrapper>
  );
}