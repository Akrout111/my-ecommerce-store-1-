"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function AnimatedTorus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004;
      ref.current.rotation.x += 0.002;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.2, 0.35, 32, 64]} />
      <meshStandardMaterial
        color="#C9A96E"
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function FloatingIcosahedron() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color="#E8A0BF"
          wireframe={false}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function AnimatedBox() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.008;
      ref.current.rotation.z += 0.005;
    }
  });
  return (
    <mesh ref={ref} position={[2.5, -1.5, -2]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial
        color="#FAF8F5"
        opacity={0.4}
        transparent
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <AnimatedTorus />
      <FloatingIcosahedron />
      <AnimatedBox />
      <Stars
        count={800}
        radius={80}
        depth={50}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <pointLight position={[3, 3, 3]} intensity={2} color="#C9A96E" />
      <pointLight position={[-3, -2, 2]} intensity={1.5} color="#E8A0BF" />
      <ambientLight intensity={0.3} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export function HeroCanvas() {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-[#C9A96E]/10 to-transparent" />
        }
      >
        <Canvas
          className="absolute inset-0 w-full h-full"
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
