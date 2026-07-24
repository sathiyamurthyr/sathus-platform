'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';

interface AICore3DProps {
  className?: string;
}

export function AICore3D({ className }: AICore3DProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 160;
    const height = container.clientHeight || 160;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4f7cff, 3.5, 10);
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x37d5ff, 3, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xe7b631, 2.5, 10);
    pointLight3.position.set(0, 3, -1);
    scene.add(pointLight3);

    // 4. Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Glowing Sphere Core (Burgundy Center)
    const innerGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x94003a,
      emissive: 0xb5004a,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer Geodesic Wireframe Shell (AI Blue Outer Glow)
    const outerGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const outerWireMat = new THREE.MeshStandardMaterial({
      color: 0x4f7cff,
      emissive: 0x37d5ff,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const outerCore = new THREE.Mesh(outerGeo, outerWireMat);
    coreGroup.add(outerCore);

    // Orbital Ring 1 (AI Blue)
    const ring1Geo = new THREE.TorusGeometry(1.35, 0.015, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x4f7cff,
      emissive: 0x37d5ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    // Orbital Ring 2 (Gold + Burgundy Accent)
    const ring2Geo = new THREE.TorusGeometry(1.5, 0.012, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xe7b631,
      emissive: 0x94003a,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 5. Mouse Parallax & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX = (event.clientX - cx) / (window.innerWidth / 2);
      mouseY = (event.clientY - cy) / (window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!reduce) {
        // Continuous Rotation
        coreGroup.rotation.y = elapsedTime * 0.4;
        outerCore.rotation.x = elapsedTime * 0.2;
        outerCore.rotation.z = elapsedTime * 0.15;
        ring1.rotation.z = -elapsedTime * 0.3;
        ring2.rotation.z = elapsedTime * 0.25;

        // Floating Motion
        coreGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

        // Smooth Mouse Parallax Tilt
        targetRotationY += (mouseX * 0.4 - targetRotationY) * 0.05;
        targetRotationX += (-mouseY * 0.4 - targetRotationX) * 0.05;
        coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;
        coreGroup.rotation.z += (targetRotationY - coreGroup.rotation.z) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerWireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      renderer.dispose();
    };
  }, [reduce]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center ${className || 'h-28 w-28'}`}
    />
  );
}
