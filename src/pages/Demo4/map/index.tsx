import { Suspense, useMemo } from "react";
import styled from "styled-components";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Lights from "./lights";
import Base from "./base";
import Bottom from "./bottom";
import Mirror from "./mirror";
import BeamLight from "./beamLight";
import { useChinaMapStore } from "../stores";
import CustomerMarkers from "./customerMarkers";
import type { CityGeoJSON } from "@/types/map";

import chinaMapData from "@/assets/china.json";
import chinaOutlineData from "@/assets/china_outline.json";

import city510000 from "@/assets/city_510000.json";
import city440000 from "@/assets/city_440000.json";
import city110000 from "@/assets/city_110000.json";
import city310000 from "@/assets/city_310000.json";
import city320000 from "@/assets/city_320000.json";
import city330000 from "@/assets/city_330000.json";

const chinaData = chinaMapData as unknown as CityGeoJSON;
const chinaOutline = chinaOutlineData as unknown as CityGeoJSON;

const CITY_DATA: Record<string, CityGeoJSON> = {
  "510000": city510000 as unknown as CityGeoJSON,
  "440000": city440000 as unknown as CityGeoJSON,
  "110000": city110000 as unknown as CityGeoJSON,
  "310000": city310000 as unknown as CityGeoJSON,
  "320000": city320000 as unknown as CityGeoJSON,
  "330000": city330000 as unknown as CityGeoJSON,
};

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export default function Map() {
  const filteredCustomers = useChinaMapStore((s) => s.filteredCustomers);
  const level = useChinaMapStore((s) => s.level);
  const selectedProvince = useChinaMapStore((s) => s.selectedProvince);

  const { mapData, outlineData } = useMemo(() => {
    if (level === "china") {
      return { mapData: chinaData, outlineData: chinaOutline };
    }
    if (level === "province" && selectedProvince) {
      const cityData = CITY_DATA[selectedProvince];
      if (cityData) {
        return { mapData: cityData, outlineData: undefined };
      }
    }
    return { mapData: chinaData, outlineData: chinaOutline };
  }, [level, selectedProvince]);

  const baseKey = `${level}-${selectedProvince ?? "china"}`;

  const controlsConfig = useMemo(() => {
    if (level === "china") return { minDistance: 8, maxDistance: 30 };
    if (level === "province") return { minDistance: 3, maxDistance: 12 };
    return { minDistance: 2, maxDistance: 8 };
  }, [level]);

  return (
    <CanvasWrapper>
      <Canvas camera={{ fov: 70, position: [0, 0, 15] }} dpr={[1, 2]}>
        <fog attach="fog" args={["#000000", 10, 50]} />
        <color attach="background" args={["#000000"]} />
        <Lights />
        <Suspense fallback={null}>
          <Base key={baseKey} depth={0.5} data={mapData} outlineData={outlineData} />
          <CustomerMarkers customers={filteredCustomers} />
        </Suspense>
        <Bottom />
        <Mirror />
        <BeamLight />
        <OrbitControls
          enableDamping
          zoomSpeed={0.3}
          minDistance={controlsConfig.minDistance}
          maxDistance={controlsConfig.maxDistance}
          maxPolarAngle={1.5}
        />
      </Canvas>
    </CanvasWrapper>
  );
}