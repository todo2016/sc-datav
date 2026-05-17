import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, AdditiveBlending } from "three";
import { geoMercator } from "d3-geo";
import { useChinaMapStore, type Customer } from "../stores";
import { CUSTOMER_COLORS } from "../data/provinces";

const SIZE_BY_LEVEL = { A: 0.12, B: 0.09, C: 0.06 } as const;

export default function CustomerMarkers(props: { customers: Customer[] }) {
  const { customers } = props;

  const projection = useMemo(
    () => geoMercator().center([105, 36]).scale(600).translate([0, 0]),
    []
  );

  return (
    <group>
      {customers.slice(0, 200).map((customer) => {
        const [lng, lat] = customer.location.coordinates;
        const [x, y] = projection([lng, lat])!;
        return (
          <CustomerPoint
            key={customer.id}
            customer={customer}
            position={new Vector3(x, -y, 0.5)}
          />
        );
      })}
    </group>
  );
}

function CustomerPoint(props: { customer: Customer; position: Vector3 }) {
  const { customer, position } = props;
  const meshRef = useRef<THREE.Mesh>(null!);
  const selectCustomer = useChinaMapStore((s) => s.selectCustomer);
  const selectedCustomer = useChinaMapStore((s) => s.selectedCustomer);
  const [hovered, setHovered] = useState(false);
  const color = CUSTOMER_COLORS[customer.type];
  const size = SIZE_BY_LEVEL[customer.level];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y =
      position.y + Math.sin(t * 2 + customer.id.charCodeAt(0)) * 0.03;
    meshRef.current.position.z = hovered ? position.z + 0.3 : position.z;
    const targetScale = hovered ? 1.8 : 1;
    meshRef.current.scale.lerp(
      new Vector3(targetScale, targetScale, targetScale),
      0.15
    );
  });

  const isSelected = selectedCustomer === customer.id;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectCustomer(isSelected ? null : customer.id);
        }}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered || isSelected ? 1 : 0.8}
          blending={AdditiveBlending}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html center distanceFactor={10} position={[0, size + 0.15, 0]}>
          <div
            style={{
              background: "rgba(0,0,0,0.85)",
              border: `1px solid ${color}`,
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#e8efff",
              fontSize: "12px",
              minWidth: "160px",
              fontFamily: "sans-serif",
              pointerEvents: "none",
            }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px", color }}>
              {customer.name}
            </div>
            <div style={{ opacity: 0.8 }}>
              类型:{" "}
              {customer.type === "key"
                ? "重点客户"
                : customer.type === "partner"
                  ? "合作伙伴"
                  : "潜在客户"}
            </div>
            <div style={{ opacity: 0.8 }}>等级: {customer.level}</div>
            <div style={{ opacity: 0.8 }}>
              地区: {customer.location.provinceName} {customer.location.cityName}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}