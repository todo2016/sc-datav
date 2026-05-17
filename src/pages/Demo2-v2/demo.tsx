import { useEffect } from "react";
import styled from "styled-components";
import { useConfigStore } from "./stores";
import Map from "./map";
import Panel from "./panel";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export default function Index() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const { level, drillUp } = useConfigStore.getState();
        if (level !== "china") {
          drillUp();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      useConfigStore.getState().reset();
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
