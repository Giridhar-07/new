import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCube({ position, size, color }) {
  const mesh = useRef();
  
  useFrame((state) => {
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    mesh.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <mesh ref={mesh} position={position}>
        <boxGeometry args={size} />
        <meshPhongMaterial
          color={color}
          shininess={100}
          specular={new THREE.Color("#ffffff")}
        />
      </mesh>
    </Float>
  );
}

function FloatingSpheres() {
  const spheres = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      ],
      size: Math.random() * 0.5 + 0.1
    }));
  }, []);

  return spheres.map((sphere, i) => (
    <Float
      key={i}
      speed={1}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <mesh position={sphere.position}>
        <sphereGeometry args={[sphere.size, 32, 32]} />
        <meshPhongMaterial
          color={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)}
          shininess={100}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  ));
}

function HeroScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{
          background: 'transparent',
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000']} />
        <fog attach="fog" args={['#000', 10, 20]} />
        
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
        />
        <pointLight position={[-10, -10, -10]} />

        <FloatingCube
          position={[0, 0, 0]}
          size={[2, 2, 2]}
          color="#3b82f6"
        />
        
        <FloatingSpheres />

        <Center position={[0, 2, 0]}>
          <Text
            fontSize={0.5}
            color="#60a5fa"
            anchorX="center"
            anchorY="middle"
            material={
              new THREE.MeshPhongMaterial({
                color: "#60a5fa",
                emissive: "#1d4ed8",
                emissiveIntensity: 0.4,
                shininess: 100,
              })
            }
          >
            Luxury Hotel
          </Text>
        </Center>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}

export default HeroScene;
