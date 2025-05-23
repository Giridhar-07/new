import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function HotelModel() {
  const gltf = useLoader(GLTFLoader, '/models/hotel.glb');
  const modelRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    modelRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={[0, -1, 0]}
      scale={[0.5, 0.5, 0.5]}
    />
  );
}

function FloatingParticles({ count = 100 }) {
  const particles = useRef();
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#ffffff',
    transparent: true,
    opacity: 0.6,
  });

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;     // x
      positions[i + 1] = Math.random() * 10 - 2;     // y
      positions[i + 2] = (Math.random() - 0.5) * 10; // z
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.current.rotation.y = time * 0.05;
    particles.current.position.y = Math.sin(time * 0.5) * 0.2;
  });

  return (
    <points ref={particles} geometry={particlesGeometry} material={particlesMaterial} />
  );
}

function Ground() {
  const texture = useLoader(TextureLoader, '/textures/marble.jpg');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.2}
        roughness={0.8}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-10, 10, -5]}
        intensity={0.8}
        angle={0.5}
        penumbra={1}
        castShadow
      />
    </>
  );
}

export default function ThreeJSScene() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={Math.PI / 4}
        />
        <fog attach="fog" args={['#202020', 5, 20]} />
        <Environment preset="sunset" />
        <Lights />
        <React.Suspense fallback={null}>
          <HotelModel />
          <Ground />
        </React.Suspense>
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
