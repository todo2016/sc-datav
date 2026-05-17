import { useLayoutEffect, useMemo, useRef } from "react";
import { Center, useTexture } from "@react-three/drei";
import {
  Box2,
  DoubleSide,
  LineSegments,
  Mesh,
  ShaderMaterial,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  type Group,
} from "three";
import { geoMercator } from "d3-geo";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import ShiftMaterial from "./shaderMaterial";
import ShapeBox from "./shape";
import GeoTrail from "./geoTrail";
import Cones from "./cone";
import FlyLine from "./flyLine";
import Boundary from "./boundary";
import Label from "./label";
import { useConfigStore } from "../stores";
import type { CityGeoJSON } from "@/types/map";

import scNormalMap from "@/assets/sc_normal_map1.png";

export interface BaseProps {
  depth?: number;
  data: CityGeoJSON;
  outlineData?: CityGeoJSON;
}

export default function Base(props: BaseProps) {
  const { depth = 1, data: mapData, outlineData } = props;
  const groupRef = useRef<Group>(null!);
  const camera = useThree((state) => state.camera);
  const level = useConfigStore((s) => s.level);

  const projection = useMemo(() => {
    const firstFeature = mapData.features[0];
    const center = firstFeature?.properties?.centroid ?? [105, 36];
    const isChina = mapData.features.length > 30;
    return geoMercator()
      .center(center as [number, number])
      .scale(isChina ? 600 : 3000)
      .translate([0, 0]);
  }, [mapData]);

  const { regions, bbox, boundary } = useMemo(() => {
    const regions: {
      name: string;
      adcode: number;
      center: Vector3;
      points: Vector2[][];
    }[] = [];
    const bbox = new Box2();

    const toV2 = (coord: number[]): Vector2 | null => {
      const projected = projection(coord as [number, number]);
      if (!projected) return null;
      const [x, y] = projected;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      const v2 = new Vector2(x, -y);
      bbox.expandByPoint(v2);
      return v2;
    };

    mapData.features.forEach((feature) => {
      if (!feature.properties.name) return;

      const centerProj = projection(
        feature.properties.centroid ?? feature.properties.center
      );
      if (!centerProj) return;
      const [cx, cy] = centerProj;
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;

      const points = feature.geometry.coordinates.reduce<Vector2[][]>(
        (pre, cur) => {
          const rings = cur.map<Vector2[]>((coordinates) =>
            coordinates.map(toV2).filter((v): v is Vector2 => v !== null)
          );
          const validRings = rings.filter((r) => r.length >= 3);
          return [...pre, ...validRings];
        },
        []
      );

      if (points.length === 0) return;

      regions.push({
        name: feature.properties.name,
        adcode: feature.properties.adcode,
        center: new Vector3(cx, -cy),
        points,
      });
    });

    let boundary: Shape[] = [];

    outlineData?.features.forEach((feature) => {
      const shapes = feature.geometry.coordinates
        .map((cur) => {
          const pts = cur.reduce<Vector2[]>(
            (pre, coordinates) => {
              const mapped = coordinates.map(toV2).filter((v): v is Vector2 => v !== null);
              return [...pre, ...mapped];
            },
            []
          );
          if (pts.length < 3) return null;
          if (pts.some((v) => !Number.isFinite(v.x) || !Number.isFinite(v.y))) return null;
          return new Shape(pts);
        })
        .filter((s): s is Shape => s !== null);

      boundary = boundary.concat(shapes);
    });

    return {
      regions,
      bbox,
      boundary,
    };
  }, [projection]);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const tl = gsap.timeline();

    tl.to(camera.position, {
      x: 0,
      y: 20,
      z: 10,
      duration: 2.5,
      ease: "circ.out",
      onComplete: () => {
        useConfigStore.setState({ mapPlayComplete: true });
      },
    });
    tl.to(groupRef.current.position, { x: 0, y: 0, z: 0, duration: 1 }, 0);
    tl.to(
      groupRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 1, ease: "circ.out" },
      0
    );
    groupRef.current.traverse((obj) => {
      if (obj instanceof Mesh || obj instanceof LineSegments) {
        if (obj.material) {
          tl.to(obj.material, { opacity: 1, duration: 1, ease: "circ.out" }, 0);
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, [camera, level]);

  return (
    <Center top>
      <group
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0.2, 0]}>
        <group ref={groupRef} scale={[1, 1, 0]} position={[0, 0, -0.01]}>
          {regions.map((region, idx) => (
            <RegionBlock
              key={region.adcode + idx}
              depth={depth}
              bbox={bbox}
              data={region}
            />
          ))}
          {outlineData && (
            <GeoTrail
              projection={projection}
              feature={outlineData.features[0]}
            />
          )}
          <Cones data={regions} />
          <FlyLine data={regions} />
          <Boundary data={boundary} />
        </group>
      </group>
    </Center>
  );
}

function RegionBlock(props: {
  depth: number;
  bbox: Box2;
  data: {
    name: string;
    adcode: number;
    center: Vector3;
    points: Vector2[][];
  };
}) {
  const { depth, bbox, data } = props;
  const materialRef = useRef<ShaderMaterial>(null!);
  const groupRef = useRef<Group>(null!);
  const vector3 = useRef(new Vector3(1, 1, 1));

  const drillDown = useConfigStore((s) => s.drillDown);
  const level = useConfigStore((s) => s.level);

  const texture = useTexture(scNormalMap);

  const [shapes, shapeGeometry] = useMemo(() => {
    const validRings = data.points.filter(
      (ring) =>
        ring.length >= 3 &&
        ring.every(
          (v) => Number.isFinite(v.x) && Number.isFinite(v.y)
        )
    );
    if (validRings.length === 0) return [null, null] as const;

    const shapes = validRings.map((e) => new Shape(e));
    const shapeGeometry = new ShapeGeometry(shapes);
    return [shapes, shapeGeometry] as const;
  }, [data.points]);

  if (!shapes || !shapeGeometry) return null;

  useFrame((_, delta) => {
    groupRef.current.scale.lerp(vector3.current, 0.1);
    materialRef.current.uniforms.time.value += delta / 3;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        vector3.current.setZ(1.5);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        vector3.current.setZ(1);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (level === "china") {
          drillDown(String(data.adcode), data.name);
        }
      }}>
      <ShapeBox bbox={bbox} args={[shapes, { depth, bevelEnabled: false }]}>
        <meshStandardMaterial
          transparent
          attach="material-0"
          color="#293b41"
          normalMap={texture}
          metalness={0.5}
          roughness={0.7}
          side={DoubleSide}
          opacity={0}
        />
        <ShiftMaterial
          transparent
          attach="material-1"
          ref={materialRef}
          opacity={0}
          depth={depth}
        />
      </ShapeBox>
      <lineSegments position={[0, 0, depth + 0.05]} raycast={() => null}>
        <edgesGeometry args={[shapeGeometry]} />
        <lineBasicMaterial transparent color="#ffffff" opacity={0} />
      </lineSegments>
      <Label
        center
        position={[data.center.x, data.center.y, depth + 0.2]}
        distanceFactor={10}
        zIndexRange={[100, 1000]}>
        {data.name}
      </Label>
    </group>
  );
}
