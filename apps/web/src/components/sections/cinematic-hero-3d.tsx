'use client';

import * as React from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import {
  Rotate3d,
  RefreshCw,
  Cpu,
  Database,
  Cloud,
  LayoutGrid,
} from 'lucide-react';

interface PlatformMeta {
  id: string;
  name: string;
  category: string;
  iconType: 'ai' | 'data' | 'cloud' | 'apps';
  pos: [number, number, number];
  rotY: number;
}

const PLATFORMS: PlatformMeta[] = [
  { id: 'ai', name: 'AI Engineering', category: 'Autonomous Agents & Swarms', iconType: 'ai', pos: [-1.2, 2.35, 0.7], rotY: 0.32 },
  { id: 'data', name: 'Data Engineering', category: 'Apache Iceberg Lakehouse', iconType: 'data', pos: [-2.0, 1.15, 0.5], rotY: 0.38 },
  { id: 'cloud', name: 'Cloud Modernization', category: 'Multi-Cloud Mesh Architecture', iconType: 'cloud', pos: [2.8, 2.15, -0.3], rotY: -0.38 },
  { id: 'apps', name: 'Enterprise Applications', category: 'Composable Mission-Critical Systems', iconType: 'apps', pos: [3.3, 1.05, -0.1], rotY: -0.42 },
];

interface SatelliteHub {
  id: string;
  name: string;
  iconType: 'hospital' | 'bank' | 'retail';
  pos: [number, number, number];
  hubRadius: number;
}

const SATELLITE_HUBS: SatelliteHub[] = [
  { id: 'healthcare', name: 'Healthcare Ecosystem', iconType: 'hospital', pos: [-2.9, -0.65, 1.5], hubRadius: 0.85 },
  { id: 'banking', name: 'Financial Services Hub', iconType: 'bank', pos: [2.7, -0.8, 1.4], hubRadius: 0.9 },
  { id: 'retail', name: 'Enterprise Retail Hub', iconType: 'retail', pos: [4.6, -0.7, 0.3], hubRadius: 0.8 },
];

// Helper: Procedural Dawn Sky Dome Texture (Rich Sunrise Rose, Peach & Burgundy Horizon)
function createDawnSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vertical sky gradient from zenith rose-burgundy down to golden dawn horizon
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0.0, '#2D0A1B'); // Zenith deep burgundy
  grad.addColorStop(0.25, '#4E142B'); // Mid sky velvet rose
  grad.addColorStop(0.48, '#852A4A'); // Atmospheric mauve rose
  grad.addColorStop(0.65, '#C75D72'); // Warm dawn glow
  grad.addColorStop(0.78, '#FFAE5C'); // Brilliant golden apricot
  grad.addColorStop(0.88, '#FF9933'); // Molten dawn orange
  grad.addColorStop(1.0, '#3A0D1D'); // Cloud shadow floor

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Brilliant Sunrise Sunburst Glow at horizon
  const sunX = 720;
  const sunY = 740;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 320);
  sunGrad.addColorStop(0.0, 'rgba(255, 255, 240, 1.0)');
  sunGrad.addColorStop(0.2, 'rgba(255, 220, 150, 0.85)');
  sunGrad.addColorStop(0.5, 'rgba(255, 153, 51, 0.45)');
  sunGrad.addColorStop(0.8, 'rgba(222, 100, 25, 0.15)');
  sunGrad.addColorStop(1.0, 'rgba(133, 11, 48, 0.0)');

  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Helper: Soft Volumetric Cloud Puff Alpha Texture
function createCloudPuffTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 256);
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  grad.addColorStop(0.0, 'rgba(255, 250, 248, 0.95)');
  grad.addColorStop(0.45, 'rgba(255, 235, 230, 0.75)');
  grad.addColorStop(0.75, 'rgba(255, 210, 200, 0.35)');
  grad.addColorStop(1.0, 'rgba(255, 190, 190, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Helper: Curved Holographic Glass HUD Tablet Textures
function createHolographicHUDTexture(iconType: 'ai' | 'data' | 'cloud' | 'apps', title: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 1024, 420);

  // Curved Glass Container with illuminated border
  ctx.save();
  ctx.beginPath();
  const px = 20, py = 20, pw = 984, ph = 380, pr = 44;
  ctx.roundRect(px, py, pw, ph, pr);
  
  // Translucent glass fill with subtle gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 420);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.30)');
  grad.addColorStop(0.5, 'rgba(255, 245, 238, 0.16)');
  grad.addColorStop(1, 'rgba(255, 153, 51, 0.22)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Glowing orange outer rim
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(255, 153, 51, 0.9)';
  ctx.shadowColor = 'rgba(255, 153, 51, 0.95)';
  ctx.shadowBlur = 32;
  ctx.stroke();

  // Inner highlight border
  ctx.beginPath();
  ctx.roundRect(px + 8, py + 8, pw - 16, ph - 16, pr - 8);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.stroke();
  ctx.restore();

  // Draw Glowing Vector Icon
  ctx.save();
  ctx.translate(160, 210);
  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(255, 153, 51, 1)';
  ctx.shadowBlur = 36;

  if (iconType === 'ai') {
    // Stylized Neural Brain Icon
    ctx.beginPath();
    ctx.arc(-28, -32, 42, Math.PI * 0.8, Math.PI * 1.9);
    ctx.arc(-20, 24, 38, Math.PI * 1.2, Math.PI * 2.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(28, -32, 42, Math.PI * 1.1, Math.PI * 0.2, true);
    ctx.arc(20, 24, 38, Math.PI * 1.8, Math.PI * 0.7, true);
    ctx.stroke();
    // Inner neural synapses
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-12, -45); ctx.lineTo(-12, 35);
    ctx.moveTo(12, -45); ctx.lineTo(12, 35);
    ctx.stroke();
  } else if (iconType === 'data') {
    // 3D Stacked Database Cylinders
    [-42, 0, 42].forEach((dy) => {
      ctx.beginPath();
      ctx.ellipse(0, dy, 52, 20, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
  } else if (iconType === 'cloud') {
    // Modern Cloud Outline
    ctx.beginPath();
    ctx.arc(-24, 10, 32, Math.PI * 0.7, Math.PI * 1.8);
    ctx.arc(12, -20, 42, Math.PI * 1.1, Math.PI * 2.0);
    ctx.arc(48, 14, 28, Math.PI * 1.6, Math.PI * 2.5);
    ctx.lineTo(-44, 42);
    ctx.closePath();
    ctx.stroke();
  } else if (iconType === 'apps') {
    // Stacked Enterprise Architectural Cards
    [-24, 0, 24].forEach((dy, idx) => {
      ctx.beginPath();
      ctx.roundRect(-54 + idx * 4, dy - 18, 108, 36, 8);
      ctx.stroke();
    });
  }
  ctx.restore();

  // Typography
  ctx.save();
  ctx.font = 'bold 64px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 18;
  ctx.fillText(title, 270, 210);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Helper: Sathus Official "S" Emblem Canvas Texture
function createSathusEmblemTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 1024, 1024);

  // Intense Radial Sunburst Flare Behind "S"
  const radial = ctx.createRadialGradient(512, 512, 30, 512, 512, 500);
  radial.addColorStop(0, 'rgba(255, 235, 190, 0.95)');
  radial.addColorStop(0.3, 'rgba(255, 153, 51, 0.75)');
  radial.addColorStop(0.7, 'rgba(222, 100, 25, 0.35)');
  radial.addColorStop(1, 'rgba(162, 10, 58, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw Official Sathus Geometric "S" Mark
  ctx.save();
  ctx.translate(512, 512);

  // Dual-tone molten copper & white illuminated "S"
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(255, 153, 51, 1)';
  ctx.shadowBlur = 48;

  ctx.beginPath();
  ctx.moveTo(120, -220);
  ctx.lineTo(-90, -220);
  ctx.bezierCurveTo(-190, -220, -210, -120, -210, -40);
  ctx.bezierCurveTo(-210, 40, -110, 70, -20, 100);
  ctx.lineTo(80, 130);
  ctx.bezierCurveTo(150, 150, 190, 180, 190, 230);
  ctx.bezierCurveTo(190, 310, 120, 350, -30, 350);
  ctx.lineTo(-140, 350);
  ctx.lineTo(-140, 250);
  ctx.lineTo(-20, 250);
  ctx.bezierCurveTo(50, 250, 90, 230, 90, 190);
  ctx.bezierCurveTo(90, 140, 0, 110, -80, 80);
  ctx.lineTo(-130, 60);
  ctx.bezierCurveTo(-210, 30, -260, -20, -260, -90);
  ctx.bezierCurveTo(-260, -200, -170, -310, -20, -310);
  ctx.lineTo(120, -310);
  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 14;
  ctx.strokeStyle = '#FF9933';
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Helper: Satellite Island Beacon Plaque Texture
function createIslandBeaconTexture(iconType: 'hospital' | 'bank' | 'retail'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 512);

  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 256, 220, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.shadowColor = 'rgba(255, 153, 51, 0.85)';
  ctx.shadowBlur = 32;
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#FF9933';
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(256, 256);
  ctx.strokeStyle = '#850B30';
  ctx.fillStyle = '#850B30';
  ctx.lineWidth = 22;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (iconType === 'hospital') {
    // Red Cross
    ctx.fillRect(-24, -110, 48, 220);
    ctx.fillRect(-110, -24, 220, 48);
  } else if (iconType === 'bank') {
    // Classical Pillars & Pediment
    ctx.beginPath();
    ctx.moveTo(0, -110); ctx.lineTo(-120, -45); ctx.lineTo(120, -45); ctx.closePath();
    ctx.stroke();
    [-65, 0, 65].forEach((x) => {
      ctx.fillRect(x - 12, -30, 24, 100);
    });
    ctx.fillRect(-130, 75, 260, 26);
  } else if (iconType === 'retail') {
    // Shopping Cart
    ctx.beginPath();
    ctx.moveTo(-95, -75); ctx.lineTo(-70, -75); ctx.lineTo(-30, 35); ctx.lineTo(75, 35); ctx.lineTo(100, -50); ctx.lineTo(-45, -50);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(-20, 80, 20, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(60, 80, 20, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function CinematicHero3D() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [activePlatformId, setActivePlatformId] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const resetCameraRef = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // -------------------------------------------------------------
    // 1. Scene, Atmospheric Fog & Camera
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x5a182b, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Initial camera position (flying through cloud layer towards citadel)
    camera.position.set(0.6, 3.6, 9.6);
    camera.lookAt(0.9, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // 2. Cinematic Dawn Studio Lighting
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.4);
    scene.add(ambientLight);

    // Key Sunrise Directional Sunlight
    const sunLight = new THREE.DirectionalLight(0xffb366, 3.4);
    sunLight.position.set(14, 8, -8);
    scene.add(sunLight);

    // Soft Rose Fill Light
    const fillLight = new THREE.DirectionalLight(0xfcebf1, 1.2);
    fillLight.position.set(-8, 6, 4);
    scene.add(fillLight);

    // Sathus Core Amber Light (Inside central hypercube)
    const coreLight = new THREE.PointLight(0xff9933, 24, 14);
    coreLight.position.set(1.5, 1.65, -0.4);
    scene.add(coreLight);

    // Master World Group
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const texturesToDispose: THREE.Texture[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    // -------------------------------------------------------------
    // 3. Sky Dome with Sunrise Dawn Gradient
    // -------------------------------------------------------------
    const skyTex = createDawnSkyTexture();
    texturesToDispose.push(skyTex);

    const skyGeo = new THREE.SphereGeometry(60, 32, 24);
    geometriesToDispose.push(skyGeo);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
    });
    materialsToDispose.push(skyMat);
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    worldGroup.add(skyMesh);

    // -------------------------------------------------------------
    // 4. Distant Low-Poly Mountain Ridges Piercing Cloud Sea
    // -------------------------------------------------------------
    const mountainGroup = new THREE.Group();
    worldGroup.add(mountainGroup);

    const mountainGeo = new THREE.ConeGeometry(4.5, 6.5, 6);
    geometriesToDispose.push(mountainGeo);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x3d1424,
      roughness: 0.9,
      metalness: 0.1,
    });
    materialsToDispose.push(mountainMat);

    const mountainCoords: [number, number, number, number][] = [
      [-16, -0.5, -20, 2.4],
      [-10, 0.4, -18, 1.8],
      [12, -0.2, -18, 2.0],
      [18, 0.8, -22, 2.6],
    ];

    mountainCoords.forEach(([mx, my, mz, ms]) => {
      const m = new THREE.Mesh(mountainGeo, mountainMat);
      m.position.set(mx, my, mz);
      m.scale.set(ms, ms, ms);
      mountainGroup.add(m);
    });

    // -------------------------------------------------------------
    // 5. Volumetric Rolling Cloud Sea
    // -------------------------------------------------------------
    const cloudGroup = new THREE.Group();
    worldGroup.add(cloudGroup);

    const cloudPuffTex = createCloudPuffTexture();
    texturesToDispose.push(cloudPuffTex);

    const cloudGeo = new THREE.PlaneGeometry(3.6, 2.2);
    geometriesToDispose.push(cloudGeo);

    const cloudMat = new THREE.MeshBasicMaterial({
      map: cloudPuffTex,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });
    materialsToDispose.push(cloudMat);

    const cloudPositions: [number, number, number, number][] = [
      [-7.5, -1.8, -5.0, 2.4],
      [-4.5, -1.9, -3.2, 2.0],
      [-1.5, -2.1, -2.4, 1.8],
      [1.5, -2.0, -2.8, 2.2],
      [4.8, -1.8, -4.2, 2.6],
      [8.0, -1.9, -6.0, 3.0],
      [-5.5, -1.6, 0.2, 1.6],
      [-2.6, -1.7, 1.8, 1.4],
      [0.6, -1.8, 1.6, 1.5],
      [3.6, -1.7, 1.2, 1.7],
      [6.2, -1.6, -0.8, 1.9],
      [-9.0, -1.5, -1.5, 2.8],
      [9.5, -1.6, -2.5, 2.9],
    ];

    const cloudBillboards: THREE.Mesh[] = [];
    cloudPositions.forEach(([cx, cy, cz, cs]) => {
      const c = new THREE.Mesh(cloudGeo, cloudMat);
      c.position.set(cx, cy, cz);
      c.scale.set(cs, cs, cs);
      c.rotation.x = -Math.PI / 4;
      cloudGroup.add(c);
      cloudBillboards.push(c);
    });

    // -------------------------------------------------------------
    // 6. Executive Observation Deck (Foreground Sky Terrace)
    // -------------------------------------------------------------
    const terraceGroup = new THREE.Group();
    worldGroup.add(terraceGroup);

    // Reflective Copper/Burgundy Terrace Floor
    const deckGeo = new THREE.CylinderGeometry(5.4, 5.6, 0.35, 48, 1, false, Math.PI * 0.9, Math.PI * 0.95);
    geometriesToDispose.push(deckGeo);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x2e0818,
      emissive: 0x5a0b22,
      emissiveIntensity: 0.3,
      roughness: 0.18,
      metalness: 0.85,
    });
    materialsToDispose.push(deckMat);
    const deckFloor = new THREE.Mesh(deckGeo, deckMat);
    deckFloor.position.set(-1.2, -1.5, 4.4);
    terraceGroup.add(deckFloor);

    // Glowing Neon Amber Deck Edge Light Strip
    const deckCurvePoints: THREE.Vector3[] = [];
    for (let a = Math.PI * 0.9; a <= Math.PI * 1.85; a += 0.08) {
      deckCurvePoints.push(new THREE.Vector3(-1.2 + Math.cos(a) * 5.42, -1.32, 4.4 + Math.sin(a) * 5.42));
    }
    const deckCurve = new THREE.CatmullRomCurve3(deckCurvePoints);
    const deckTrimGeo = new THREE.TubeGeometry(deckCurve, 32, 0.035, 8, false);
    geometriesToDispose.push(deckTrimGeo);
    const deckTrimMat = new THREE.MeshBasicMaterial({ color: 0xff9933 });
    materialsToDispose.push(deckTrimMat);
    const deckTrim = new THREE.Mesh(deckTrimGeo, deckTrimMat);
    terraceGroup.add(deckTrim);

    // Curved Transparent Glass Railing
    const glassRailingGeo = new THREE.CylinderGeometry(5.42, 5.42, 0.75, 48, 1, true, Math.PI * 0.9, Math.PI * 0.95);
    geometriesToDispose.push(glassRailingGeo);
    const glassRailingMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      roughness: 0.08,
      ior: 1.48,
      transparent: true,
      opacity: 0.65,
    });
    materialsToDispose.push(glassRailingMat);
    const glassRailing = new THREE.Mesh(glassRailingGeo, glassRailingMat);
    glassRailing.position.set(-1.2, -0.92, 4.4);
    terraceGroup.add(glassRailing);

    // Visionary Executive Silhouette Standing on the Terrace
    const figureGroup = new THREE.Group();
    figureGroup.position.set(-1.6, -1.32, 3.2);
    terraceGroup.add(figureGroup);

    const figureBodyGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.85, 12);
    geometriesToDispose.push(figureBodyGeo);
    const figureHeadGeo = new THREE.SphereGeometry(0.09, 12, 12);
    geometriesToDispose.push(figureHeadGeo);
    const figureMat = new THREE.MeshStandardMaterial({
      color: 0x14060d,
      roughness: 0.6,
      metalness: 0.3,
    });
    materialsToDispose.push(figureMat);

    const fBody = new THREE.Mesh(figureBodyGeo, figureMat);
    fBody.position.y = 0.42;
    figureGroup.add(fBody);
    const fHead = new THREE.Mesh(figureHeadGeo, figureMat);
    fHead.position.y = 0.92;
    figureGroup.add(fHead);

    // -------------------------------------------------------------
    // 7. Central Floating Sathus Technology Citadel
    // -------------------------------------------------------------
    const citadelGroup = new THREE.Group();
    citadelGroup.position.set(1.5, 0.25, -0.4);
    worldGroup.add(citadelGroup);

    // Main Floating Superstructure Disc (Burgundy Metallic)
    const mainHullGeo = new THREE.CylinderGeometry(3.2, 2.8, 0.4, 64);
    geometriesToDispose.push(mainHullGeo);
    const mainHullMat = new THREE.MeshStandardMaterial({
      color: 0x850b30,
      emissive: 0x5a0520,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.22,
    });
    materialsToDispose.push(mainHullMat);
    const mainHull = new THREE.Mesh(mainHullGeo, mainHullMat);
    citadelGroup.add(mainHull);

    // Glowing Molten Copper Perimeter Ring
    const hullRimGeo = new THREE.TorusGeometry(3.22, 0.06, 16, 64);
    geometriesToDispose.push(hullRimGeo);
    const hullRimMat = new THREE.MeshStandardMaterial({
      color: 0xff9933,
      emissive: 0xffae5c,
      emissiveIntensity: 0.95,
      metalness: 0.95,
      roughness: 0.12,
    });
    materialsToDispose.push(hullRimMat);
    const hullRim = new THREE.Mesh(hullRimGeo, hullRimMat);
    hullRim.rotation.x = Math.PI / 2;
    hullRim.position.y = 0.16;
    citadelGroup.add(hullRim);

    // Panoramic Illuminated Laboratory Level (Warm interior windows)
    const windowRingGeo = new THREE.CylinderGeometry(2.7, 2.7, 0.45, 48);
    geometriesToDispose.push(windowRingGeo);
    const windowRingMat = new THREE.MeshStandardMaterial({
      color: 0xffae5c,
      emissive: 0xff8811,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
    });
    materialsToDispose.push(windowRingMat);
    const windowRing = new THREE.Mesh(windowRingGeo, windowRingMat);
    windowRing.position.y = 0.42;
    citadelGroup.add(windowRing);

    // Upper Terrace Deck
    const upperDeckGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.2, 48);
    geometriesToDispose.push(upperDeckGeo);
    const upperDeck = new THREE.Mesh(upperDeckGeo, mainHullMat);
    upperDeck.position.y = 0.7;
    citadelGroup.add(upperDeck);

    // Undercarriage Aerodynamic Keel
    const keelGeo = new THREE.ConeGeometry(2.5, 1.9, 32);
    geometriesToDispose.push(keelGeo);
    const keel = new THREE.Mesh(keelGeo, mainHullMat);
    keel.rotation.x = Math.PI;
    keel.position.y = -1.05;
    citadelGroup.add(keel);

    // Downward Vertical Light Pillar
    const beamGeo = new THREE.CylinderGeometry(0.2, 0.5, 4.5, 24);
    geometriesToDispose.push(beamGeo);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xff9933,
      transparent: true,
      opacity: 0.75,
    });
    materialsToDispose.push(beamMat);
    const downBeam = new THREE.Mesh(beamGeo, beamMat);
    downBeam.position.y = -3.0;
    citadelGroup.add(downBeam);

    // -------------------------------------------------------------
    // 8. Central 3D Sathus Emblem Hypercube (The Crown)
    // -------------------------------------------------------------
    const hypercubeGroup = new THREE.Group();
    hypercubeGroup.position.set(0, 1.55, 0);
    citadelGroup.add(hypercubeGroup);

    // Beveled Transparent Crystal Glass Cube
    const cubeGeo = new THREE.BoxGeometry(1.3, 1.3, 1.3);
    geometriesToDispose.push(cubeGeo);
    const cubeGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.04,
      transmission: 0.95,
      ior: 1.55,
      thickness: 1.4,
      transparent: true,
      opacity: 0.94,
      clearcoat: 1.0,
    });
    materialsToDispose.push(cubeGlassMat);
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeGlassMat);
    hypercubeGroup.add(cubeMesh);

    // Glowing Wireframe Edges
    const cubeEdgesGeo = new THREE.EdgesGeometry(cubeGeo);
    geometriesToDispose.push(cubeEdgesGeo);
    const cubeEdgesMat = new THREE.LineBasicMaterial({
      color: 0xff9933,
      transparent: true,
      opacity: 0.95,
    });
    materialsToDispose.push(cubeEdgesMat);
    const cubeEdges = new THREE.LineSegments(cubeEdgesGeo, cubeEdgesMat);
    hypercubeGroup.add(cubeEdges);

    // Official Sathus "S" Emblem Internal Decal
    const sathusTex = createSathusEmblemTexture();
    texturesToDispose.push(sathusTex);
    const emblemGeo = new THREE.PlaneGeometry(1.2, 1.2);
    geometriesToDispose.push(emblemGeo);
    const emblemMat = new THREE.MeshBasicMaterial({
      map: sathusTex,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    });
    materialsToDispose.push(emblemMat);

    const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
    emblemMesh.position.z = 0.01;
    hypercubeGroup.add(emblemMesh);

    // Upward Vertical Light Pillar
    const upBeamGeo = new THREE.CylinderGeometry(0.28, 0.14, 6.5, 24);
    geometriesToDispose.push(upBeamGeo);
    const upBeam = new THREE.Mesh(upBeamGeo, beamMat);
    upBeam.position.y = 3.8;
    hypercubeGroup.add(upBeam);

    // -------------------------------------------------------------
    // 9. Four Floating Holographic Engineering Platforms
    // -------------------------------------------------------------
    interface PlatformNode {
      id: string;
      group: THREE.Group;
      basePos: THREE.Vector3;
    }

    const platformNodes: PlatformNode[] = [];

    PLATFORMS.forEach((meta) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(...meta.pos);
      pGroup.rotation.y = meta.rotY;
      worldGroup.add(pGroup);

      // Curved Glass Tablet Geometry
      const tabletGeo = new THREE.BoxGeometry(1.75, 0.76, 0.05);
      geometriesToDispose.push(tabletGeo);
      const tabletGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.08,
        roughness: 0.06,
        transmission: 0.92,
        ior: 1.48,
        transparent: true,
        opacity: 0.88,
      });
      materialsToDispose.push(tabletGlassMat);
      const tabletMesh = new THREE.Mesh(tabletGeo, tabletGlassMat);
      pGroup.add(tabletMesh);

      // Front Vector Decal
      const hudTex = createHolographicHUDTexture(meta.iconType, meta.name);
      texturesToDispose.push(hudTex);
      const hudGeo = new THREE.PlaneGeometry(1.72, 0.74);
      geometriesToDispose.push(hudGeo);
      const hudMat = new THREE.MeshBasicMaterial({
        map: hudTex,
        transparent: true,
        opacity: 0.96,
      });
      materialsToDispose.push(hudMat);
      const hudMesh = new THREE.Mesh(hudGeo, hudMat);
      hudMesh.position.z = 0.035;
      pGroup.add(hudMesh);

      platformNodes.push({
        id: meta.id,
        group: pGroup,
        basePos: new THREE.Vector3(...meta.pos),
      });
    });

    // -------------------------------------------------------------
    // 10. Satellite Island Hubs & Sweeping Molten Energy Trails
    // -------------------------------------------------------------
    const energyTrails: {
      curve: THREE.CatmullRomCurve3;
      pulseMesh: THREE.Mesh;
      speed: number;
      offset: number;
    }[] = [];

    const pulseGeo = new THREE.SphereGeometry(0.07, 8, 8);
    geometriesToDispose.push(pulseGeo);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffae5c });
    materialsToDispose.push(pulseMat);

    SATELLITE_HUBS.forEach((hub, idx) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(...hub.pos);
      worldGroup.add(hGroup);

      // Floating Island Base
      const islandGeo = new THREE.CylinderGeometry(hub.hubRadius, hub.hubRadius * 0.85, 0.24, 32);
      geometriesToDispose.push(islandGeo);
      const island = new THREE.Mesh(islandGeo, mainHullMat);
      hGroup.add(island);

      // Perimeter Glowing Bronze Ring
      const islandRimGeo = new THREE.TorusGeometry(hub.hubRadius + 0.02, 0.035, 12, 32);
      geometriesToDispose.push(islandRimGeo);
      const islandRim = new THREE.Mesh(islandRimGeo, hullRimMat);
      islandRim.rotation.x = Math.PI / 2;
      islandRim.position.y = 0.08;
      hGroup.add(islandRim);

      // Architectural Structures on Island
      if (hub.iconType === 'hospital') {
        const bldgGeo = new THREE.BoxGeometry(0.48, 0.58, 0.48);
        geometriesToDispose.push(bldgGeo);
        const bldgMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        materialsToDispose.push(bldgMat);
        const bldg = new THREE.Mesh(bldgGeo, bldgMat);
        bldg.position.y = 0.4;
        hGroup.add(bldg);
      } else if (hub.iconType === 'bank') {
        const bankPillarGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.48, 8);
        geometriesToDispose.push(bankPillarGeo);
        const bankMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        materialsToDispose.push(bankMat);
        [-0.2, 0, 0.2].forEach((bx) => {
          const bp = new THREE.Mesh(bankPillarGeo, bankMat);
          bp.position.set(bx, 0.35, 0);
          hGroup.add(bp);
        });
        const pedimentGeo = new THREE.ConeGeometry(0.38, 0.24, 4);
        geometriesToDispose.push(pedimentGeo);
        const pediment = new THREE.Mesh(pedimentGeo, bankMat);
        pediment.position.set(0, 0.68, 0);
        pediment.rotation.y = Math.PI / 4;
        hGroup.add(pediment);
      } else if (hub.iconType === 'retail') {
        const domeGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        geometriesToDispose.push(domeGeo);
        const domeMat = new THREE.MeshPhysicalMaterial({ color: 0xff9933, transmission: 0.8, roughness: 0.1 });
        materialsToDispose.push(domeMat);
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.y = 0.12;
        hGroup.add(dome);
      }

      // Floating Plaque
      const bTex = createIslandBeaconTexture(hub.iconType);
      texturesToDispose.push(bTex);
      const bGeo = new THREE.PlaneGeometry(0.55, 0.55);
      geometriesToDispose.push(bGeo);
      const bMat = new THREE.MeshBasicMaterial({ map: bTex, transparent: true, opacity: 0.95 });
      materialsToDispose.push(bMat);
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(0, 0.92, 0);
      hGroup.add(bMesh);

      // Sweeping Molten Energy Trails (Connecting Citadel -> Island)
      const startPos = new THREE.Vector3(citadelGroup.position.x, 0, citadelGroup.position.z);
      const midPos = new THREE.Vector3(
        (citadelGroup.position.x + hub.pos[0]) / 2,
        (citadelGroup.position.y + hub.pos[1]) / 2 + 0.38,
        (citadelGroup.position.z + hub.pos[2]) / 2
      );
      const endPos = new THREE.Vector3(...hub.pos);

      const trailCurve = new THREE.CatmullRomCurve3([startPos, midPos, endPos]);
      const trailGeo = new THREE.TubeGeometry(trailCurve, 32, 0.038, 8, false);
      geometriesToDispose.push(trailGeo);
      const trailMat = new THREE.MeshBasicMaterial({
        color: 0xff9933,
        transparent: true,
        opacity: 0.88,
      });
      materialsToDispose.push(trailMat);
      const trailMesh = new THREE.Mesh(trailGeo, trailMat);
      worldGroup.add(trailMesh);

      // Streaming Light Pulse Mesh
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      worldGroup.add(pulseMesh);

      energyTrails.push({
        curve: trailCurve,
        pulseMesh,
        speed: 0.85 + idx * 0.25,
        offset: idx * 0.33,
      });
    });

    // -------------------------------------------------------------
    // 11. GSAP Cinematic Flight Timeline (Steps 1 to 4)
    // -------------------------------------------------------------
    if (!reduce) {
      // Step 1: Camera glides through cloud mist towards city
      gsap.fromTo(
        camera.position,
        { x: 0.4, y: 5.0, z: 12.5 },
        { x: 0.6, y: 3.6, z: 9.6, duration: 2.8, ease: 'power2.out' }
      );

      // Step 2: Central Sathus emblem hypercube emerges with light ignition
      gsap.fromTo(
        hypercubeGroup.scale,
        { x: 0.01, y: 0.01, z: 0.01 },
        { x: 1.0, y: 1.0, z: 1.0, duration: 2.2, delay: 0.8, ease: 'back.out(1.6)' }
      );

      // Step 3: Platforms rise independently with staggered timings
      platformNodes.forEach((node, i) => {
        gsap.fromTo(
          node.group.position,
          { y: node.basePos.y - 1.4 },
          { y: node.basePos.y, duration: 1.8, delay: 1.2 + i * 0.25, ease: 'power3.out' }
        );
      });
    }

    // Scroll-driven camera trajectory (Step 5 & 6)
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / (maxScroll || 1), 1);

      const targetCamX = 0.6 - progress * 1.8;
      const targetCamY = 3.6 - progress * 1.2;
      const targetCamZ = 9.6 - progress * 3.6;

      gsap.to(camera.position, {
        x: targetCamX,
        y: targetCamY,
        z: targetCamZ,
        duration: 0.8,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------
    // 12. Interactive Pointer Parallax & Drag to Rotate
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let velX = 0;
    let velY = 0;
    let prevX = 0;
    let prevY = 0;
    let dragging = false;

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      setIsDragging(true);
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      dragging = false;
      setIsDragging(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX = (e.clientX - cx) / (window.innerWidth / 2);
      mouseY = (e.clientY - cy) / (window.innerHeight / 2);

      if (dragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        velY = dx * 0.004;
        velX = dy * 0.004;
        targetRotY += velY;
        targetRotX += velX;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        dragging = true;
        setIsDragging(true);
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      targetRotY += dx * 0.005;
      targetRotX += dy * 0.005;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      dragging = false;
      setIsDragging(false);
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    resetCameraRef.current = () => {
      targetRotX = 0;
      targetRotY = 0;
      worldGroup.rotation.set(0, 0, 0);
      setActivePlatformId(null);
      gsap.to(camera.position, { x: 0.6, y: 3.6, z: 9.6, duration: 1.2, ease: 'power2.inOut' });
    };

    // -------------------------------------------------------------
    // 13. 60 FPS Render Loop
    // -------------------------------------------------------------
    let animId: number;
    const clock = new THREE.Clock();
    const tempV = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertial damping
      if (!dragging) {
        velX *= 0.94;
        velY *= 0.94;
        targetRotX += velX;
        targetRotY += velY;
      }

      // Smooth pointer parallax + user drag
      worldGroup.rotation.x = THREE.MathUtils.lerp(
        worldGroup.rotation.x,
        targetRotX + mouseY * -0.08,
        0.06
      );
      worldGroup.rotation.y = THREE.MathUtils.lerp(
        worldGroup.rotation.y,
        targetRotY + mouseX * 0.14,
        0.06
      );

      if (!reduce) {
        // Slow rotation of central citadel & Sathus hypercube
        citadelGroup.rotation.y = elapsed * 0.025;
        hypercubeGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
        hypercubeGroup.position.y = 1.55 + Math.sin(elapsed * 1.5) * 0.06;

        // Phased independent breathing of floating platforms
        platformNodes.forEach((node, i) => {
          const delta = Math.sin(elapsed * 1.6 + i * 0.8) * 0.04;
          node.group.position.y = node.basePos.y + delta;
        });

        // Drifting clouds across the sea of mist
        cloudBillboards.forEach((c, idx) => {
          c.position.x += Math.sin(elapsed * 0.3 + idx) * 0.0015;
        });

        // Streaming Molten Energy Pulses to Satellite Hubs
        energyTrails.forEach((trail) => {
          const t = (elapsed * trail.speed + trail.offset) % 1;
          trail.curve.getPointAt(t, tempV);
          trail.pulseMesh.position.copy(tempV);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // 14. Resize & Clean Resource Disposal
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      texturesToDispose.forEach((t) => t.dispose());
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [reduce]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className={`relative h-full w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        role="region"
        aria-label="Pure WebGL Futuristic Enterprise Technology Universe Above the Clouds"
      />

      {/* Floating 3D Control Pill (Reset Perspective) */}
      <div className="pointer-events-auto absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={() => resetCameraRef.current()}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/80 px-3.5 py-1.5 font-mono text-xs font-semibold text-[#850B30] shadow-md backdrop-blur-md transition-all hover:bg-white hover:border-[#FF9933] hover:text-[#FF9933] cursor-pointer"
          title="Reset 3D Perspective"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#FF9933]" />
          <span>Reset View</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/80 px-3.5 py-1.5 font-mono text-xs font-medium text-[#635861] shadow-md backdrop-blur-md">
          <Rotate3d className="h-3.5 w-3.5 text-[#850B30]" />
          <span>Drag to Orbit Universe</span>
        </span>
      </div>
    </div>
  );
}
