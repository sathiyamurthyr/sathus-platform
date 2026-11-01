'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface WorldItem {
  id: string;
  category: string;
  prefix: string;
  suffix: string;
  description: string;
  href: string;
  visualType: 'brain' | 'datacanyon' | 'cloudhub' | 'campus';
  stat: string;
  statLabel: string;
  align: 'left' | 'right';
}

const WORLDS: WorldItem[] = [
  {
    id: 'ai-engineering',
    category: 'AI',
    prefix: 'AI',
    suffix: 'Engineering',
    description:
      'Build intelligent, domain-ready AI solutions with enterprise-grade governance and trust.',
    href: '/solutions/ai-engineering',
    visualType: 'brain',
    stat: '<42ms',
    statLabel: 'Deterministic Model Latency',
    align: 'left',
  },
  {
    id: 'data-engineering',
    category: 'Data',
    prefix: 'Data',
    suffix: 'Engineering',
    description:
      'Ingest, process, govern and unlock the value of data at scale.',
    href: '/solutions/data-engineering',
    visualType: 'datacanyon',
    stat: '1.4M msg/s',
    statLabel: 'Apache Iceberg Pipeline Throughput',
    align: 'right',
  },
  {
    id: 'cloud-modernization',
    category: 'Cloud',
    prefix: 'Cloud',
    suffix: 'Modernization',
    description:
      'Modern, secure and scalable cloud platforms for high-performance enterprise workloads.',
    href: '/solutions/cloud-modernization',
    visualType: 'cloudhub',
    stat: '99.95%',
    statLabel: 'Multi-Region SLA Uptime',
    align: 'left',
  },
  {
    id: 'enterprise-applications',
    category: 'Enterprise',
    prefix: 'Enterprise',
    suffix: 'Applications',
    description:
      'Design, build and modernize mission-critical enterprise systems that scale with your business.',
    href: '/solutions/enterprise-applications',
    visualType: 'campus',
    stat: 'Zero',
    statLabel: 'Cutover Downtime Target',
    align: 'right',
  },
];

// Interactive Procedural 3D Canvas Visual for each Engineering World
function WorldCanvas({ type }: { type: 'brain' | 'datacanyon' | 'cloudhub' | 'campus' }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Warm Sunset Interior Ambient Background
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#260815');
      bg.addColorStop(0.45, '#441224');
      bg.addColorStop(0.85, '#200511');
      bg.addColorStop(1, '#12030A');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Sunrise Atmospheric Radial Glow
      const sunGrad = ctx.createRadialGradient(w * 0.75, h * 0.35, 10, w * 0.75, h * 0.35, w * 0.7);
      sunGrad.addColorStop(0, 'rgba(255, 174, 92, 0.45)');
      sunGrad.addColorStop(0.4, 'rgba(255, 153, 51, 0.2)');
      sunGrad.addColorStop(0.8, 'rgba(162, 10, 58, 0.08)');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h);

      // Perspective Floor Grid Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.15)';
      ctx.lineWidth = 1;
      const horizonY = h * 0.65;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.5 + i * 20, horizonY);
        ctx.lineTo(w * 0.5 + i * 110, h);
        ctx.stroke();
      }
      for (let y = horizonY + 15; y < h; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      if (type === 'brain') {
        // ==========================================
        // 01: HOLOGRAPHIC NEURAL BRAIN SCULPTURE
        // ==========================================
        ctx.save();
        ctx.translate(w * 0.5, h * 0.48);

        // Circular Glowing Pedestal Base with Reflections
        [-20, 0, 20].forEach((dy, idx) => {
          ctx.beginPath();
          ctx.ellipse(0, 110 + dy, 180 - idx * 25, 32 - idx * 4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = idx === 1 ? '#FF9933' : '#DE6419';
          ctx.lineWidth = idx === 1 ? 3.5 : 1.5;
          ctx.shadowColor = 'rgba(255, 153, 51, 0.9)';
          ctx.shadowBlur = 24;
          ctx.stroke();
        });

        // Vertical Glass Cylinder Pillar
        const gradPillar = ctx.createLinearGradient(-50, 40, 50, 110);
        gradPillar.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradPillar.addColorStop(0.5, 'rgba(255, 153, 51, 0.15)');
        gradPillar.addColorStop(1, 'rgba(162, 10, 58, 0.25)');
        ctx.fillStyle = gradPillar;
        ctx.beginPath();
        ctx.roundRect(-45, 40, 90, 70, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulsing Neural Core Flare
        const coreGrad = ctx.createRadialGradient(0, -20, 5, 0, -20, 110);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        coreGrad.addColorStop(0.3, 'rgba(255, 180, 80, 0.8)');
        coreGrad.addColorStop(0.65, 'rgba(255, 153, 51, 0.35)');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, -20, 110, 0, Math.PI * 2);
        ctx.fill();

        // Neural Brain Left Lobe
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = 'rgba(255, 153, 51, 1)';
        ctx.shadowBlur = 28;
        ctx.beginPath();
        ctx.arc(-52 + Math.sin(t) * 4, -48, 65, Math.PI * 0.8, Math.PI * 1.95);
        ctx.arc(-34 + Math.sin(t) * 4, 18, 54, Math.PI * 1.25, Math.PI * 2.3);
        ctx.stroke();

        // Neural Brain Right Lobe
        ctx.beginPath();
        ctx.arc(52 - Math.sin(t) * 4, -48, 65, Math.PI * 1.05, Math.PI * 0.2, true);
        ctx.arc(34 - Math.sin(t) * 4, 18, 54, Math.PI * 1.75, Math.PI * 0.7, true);
        ctx.stroke();

        // Internal Synaptic Arcs
        for (let i = 0; i < 14; i++) {
          const angle = (i / 14) * Math.PI * 2 + t * 0.6;
          const r = 58 + Math.sin(t * 2.5 + i) * 16;
          const nx = Math.cos(angle) * r;
          const ny = Math.sin(angle) * r - 20;

          ctx.beginPath();
          ctx.arc(nx, ny, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = 'rgba(255, 174, 92, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Orbiting Electron Ring
        ctx.save();
        ctx.rotate(t * 0.5);
        ctx.beginPath();
        ctx.ellipse(0, -20, 130, 48, Math.PI * 0.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 153, 51, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      } else if (type === 'datacanyon') {
        // ==========================================
        // 02: GLOWING DATA CANYON & SPEED RIVERS
        // ==========================================
        ctx.save();

        // Server Monolith Towers on Left and Right
        const towers = [
          { x: w * 0.08, w: 55, h: h * 0.6 },
          { x: w * 0.18, w: 45, h: h * 0.45 },
          { x: w * 0.78, w: 45, h: h * 0.48 },
          { x: w * 0.88, w: 58, h: h * 0.62 },
        ];

        towers.forEach((tw) => {
          ctx.beginPath();
          ctx.roundRect(tw.x, h * 0.65 - tw.h, tw.w, tw.h, 6);
          ctx.fillStyle = 'rgba(30, 8, 18, 0.85)';
          ctx.fill();
          ctx.strokeStyle = '#DE6419';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Server rack status LED dots
          for (let row = 0; row < 10; row++) {
            ctx.fillStyle = (row + Math.floor(t * 4)) % 3 === 0 ? '#FF9933' : '#850B30';
            ctx.fillRect(tw.x + 10, h * 0.65 - tw.h + 14 + row * 16, tw.w - 20, 3);
          }
        });

        // Flowing Molten High-Speed Data Streams
        for (let lane = 0; lane < 9; lane++) {
          ctx.beginPath();
          const startX = w * 0.24 + lane * (w * 0.065);
          ctx.moveTo(startX, 0);

          const cp1x = startX + Math.sin(t + lane) * 50;
          const cp1y = h * 0.4;
          const cp2x = w * 0.5 + (lane - 4) * 35;
          const cp2y = h * 0.7;
          const endX = w * 0.5 + (lane - 4) * 75;
          const endY = h;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.strokeStyle = lane % 2 === 0 ? '#FF9933' : '#FFAE5C';
          ctx.lineWidth = 3 + Math.sin(t * 3 + lane) * 2;
          ctx.shadowColor = 'rgba(255, 153, 51, 0.9)';
          ctx.shadowBlur = 18;
          ctx.stroke();

          // Fast Data Pulses Traveling along curves
          const pulseT = ((t * 0.9 + lane * 0.15) % 1);
          const px = (1 - pulseT) * startX + pulseT * endX + Math.sin(pulseT * Math.PI) * 35;
          const py = pulseT * h;

          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 20;
          ctx.fill();
        }
        ctx.restore();
      } else if (type === 'cloudhub') {
        // ==========================================
        // 03: FLOATING CLOUD HUB & ORBITAL RINGS
        // ==========================================
        ctx.save();
        ctx.translate(w * 0.5, h * 0.5);

        // Cumulus Cloud Puffs below the platform
        for (let c = -3; c <= 3; c++) {
          ctx.beginPath();
          const cx = c * 70 + Math.sin(t + c) * 15;
          const cy = 100 + Math.cos(t * 0.8 + c) * 10;
          ctx.arc(cx, cy, 65, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 230, 215, 0.22)';
          ctx.fill();
        }

        // Multi-level glowing floating orbital rings
        [-45, 0, 45].forEach((dy, idx) => {
          ctx.beginPath();
          ctx.ellipse(0, dy + Math.sin(t + idx) * 8, 170 - idx * 22, 34, 0, 0, Math.PI * 2);
          ctx.strokeStyle = idx === 1 ? '#FF9933' : '#DE6419';
          ctx.lineWidth = idx === 1 ? 4 : 2;
          ctx.shadowColor = 'rgba(255, 153, 51, 0.9)';
          ctx.shadowBlur = 22;
          ctx.stroke();
        });

        // Floating Cloud Hologram in center
        ctx.save();
        ctx.translate(0, -65 + Math.sin(t * 1.6) * 10);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 7;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowBlur = 28;
        ctx.beginPath();
        ctx.arc(-26, 8, 28, Math.PI * 0.7, Math.PI * 1.8);
        ctx.arc(10, -20, 38, Math.PI * 1.1, Math.PI * 2.0);
        ctx.arc(45, 10, 24, Math.PI * 1.6, Math.PI * 2.5);
        ctx.lineTo(-42, 32);
        ctx.closePath();
        ctx.stroke();

        // Inner Cloud Shimmer
        ctx.fillStyle = 'rgba(255, 174, 92, 0.35)';
        ctx.fill();
        ctx.restore();

        ctx.restore();
      } else if (type === 'campus') {
        // ==========================================
        // 04: PANORAMIC CURVED GLASS ENTERPRISE CAMPUS
        // ==========================================
        ctx.save();
        ctx.translate(w * 0.5, h * 0.52);

        // Tiered Glass Campus Wings
        [-110, 0, 110].forEach((bx, idx) => {
          const bh = 130 + (idx === 1 ? 55 : 0);
          ctx.beginPath();
          ctx.roundRect(bx - 42, 80 - bh, 84, bh, [20, 20, 0, 0]);
          ctx.fillStyle = 'rgba(255, 174, 92, 0.22)';
          ctx.fill();
          ctx.strokeStyle = '#FF9933';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(255, 153, 51, 0.7)';
          ctx.shadowBlur = 18;
          ctx.stroke();

          // Office floor windows
          for (let row = 1; row <= 6; row++) {
            ctx.fillStyle = (row + idx) % 2 === 0 ? 'rgba(255, 235, 190, 0.85)' : 'rgba(255, 153, 51, 0.6)';
            ctx.fillRect(bx - 32, 80 - bh + row * 18, 64, 7);
          }
        });

        // Curved Floating Transit Skybridge with traveling beacons
        ctx.beginPath();
        ctx.ellipse(0, 85, 200, 30, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#DE6419';
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(222, 100, 25, 0.95)';
        ctx.shadowBlur = 24;
        ctx.stroke();

        // Transit Light Pod
        const podAngle = t * 1.2;
        const podX = Math.cos(podAngle) * 200;
        const podY = 85 + Math.sin(podAngle) * 30;
        ctx.beginPath();
        ctx.arc(podX, podY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [type]);

  return (
    <div className="relative aspect-[16/10] w-full max-w-[580px] overflow-hidden rounded-3xl border border-[#FFD9B3]/50 shadow-[0_12px_48px_rgba(162,10,58,0.15)] backdrop-blur-md">
      <canvas
        ref={canvasRef}
        width={720}
        height={450}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

// Flowing Organic Wave Ribbon Divider Component matching reference image
function WaveRibbonDivider({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden leading-none z-10 -my-1 pointer-events-none select-none">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-12 sm:h-20 text-[#FAF8F9] ${inverted ? 'rotate-180' : ''}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0,32 C360,110 720,-20 1080,60 C1260,100 1380,50 1440,32 L1440,120 L0,120 Z"
          fill="currentColor"
        />
        <path
          d="M0,45 C320,118 760,0 1120,72 C1280,104 1390,62 1440,48"
          stroke="rgba(255, 153, 51, 0.35)"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function CinematicUniverse() {
  const reduce = useReducedMotion();

  return (
    <section id="engineering-worlds" className="relative w-full bg-[#FAF8F9] py-12 sm:py-16">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20 sm:space-y-28">
          {WORLDS.map((world, idx) => {
            const isLeft = world.align === 'left';

            return (
              <React.Fragment key={world.id}>
                {idx > 0 && <WaveRibbonDivider inverted={idx % 2 === 1} />}

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`flex flex-col items-center gap-10 lg:gap-16 py-6 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Procedural 3D Visual Viewport */}
                  <div className="w-full flex-1 flex justify-center">
                    <WorldCanvas type={world.visualType} />
                  </div>

                  {/* Editorial Typography */}
                  <div className="w-full flex-1 max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE1E6] bg-white px-3.5 py-1 text-xs font-semibold text-[#850B30] shadow-xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#FF9933]" />
                      <span>ENGINEERING PILLAR 0{idx + 1}</span>
                    </div>

                    <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[#292329]">
                      <span className="text-[#850B30]">{world.prefix}</span>{' '}
                      <span>{world.suffix}</span>
                    </h2>

                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#635861]">
                      {world.description}
                    </p>

                    {/* Benchmark Metric Pill */}
                    <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[#EDE1E6] bg-white px-5 py-3 shadow-xs">
                      <span className="text-xl sm:text-2xl font-bold font-display text-[#FF9933]">
                        {world.stat}
                      </span>
                      <span className="text-xs text-[#635861] font-medium leading-tight max-w-[140px]">
                        {world.statLabel}
                      </span>
                    </div>

                    <div className="mt-8">
                      <Link
                        href={world.href}
                        className="group inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#850B30] hover:text-[#FF9933] transition-colors"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
