import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

const Orb = ({ position, color, speed = 1, scale = 1 }: {
  position: [number, number, number];
  color: string;
  speed?: number;
  scale?: number;
}) => {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.x = position[0] + Math.sin(t * 0.4) * 0.6;
    ref.current.position.y = position[1] + Math.cos(t * 0.3) * 0.5;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          distort={0.45}
          speed={1.5}
          roughness={0.15}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 6, 14]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color="#f59e0b" />
        <pointLight position={[4, 3, -2]} intensity={0.8} color="#34d399" />

        <Suspense fallback={null}>
          <Orb position={[-3.2, 1.2, -1]} color="#f59e0b" speed={0.8} scale={1.1} />
          <Orb position={[3.4, -1.3, -2]} color="#34d399" speed={1.1} scale={0.9} />
          <Orb position={[0.5, 2.3, -3]} color="#60a5fa" speed={0.6} scale={0.7} />
          <Orb position={[-1.5, -2.2, -1.5]} color="#f472b6" speed={1.3} scale={0.6} />
          <Sparkles count={80} scale={[14, 8, 6]} size={2.2} speed={0.4} color="#ffffff" opacity={0.6} />
        </Suspense>
      </Canvas>
      {/* vignette + fade so hero content stays legible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_78%)]" />
    </div>
  );
};
