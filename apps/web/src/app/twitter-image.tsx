import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sathus Technology — Enterprise AI, Data & Cloud Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#070810',
          padding: '72px',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          backgroundImage:
            'radial-gradient(900px 500px at 80% -10%, rgba(148,0,58,0.45), transparent), radial-gradient(700px 500px at 0% 110%, rgba(231,182,49,0.25), transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #94003A, #E7B631)',
              display: 'flex',
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Sathus Technology
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 700, maxWidth: 960, color: '#ffffff' }}>
            Enterprise AI, Data Engineering &amp; Cloud Modernization
          </div>
          <div style={{ fontSize: 24, color: '#D6D6D6', marginTop: 24, maxWidth: 880, lineHeight: 1.4 }}>
            Production-grade agentic swarms, governed lakehouses, and cloud-native applications for regulated industries.
          </div>
        </div>

        <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24 }}>
          <span style={{ fontSize: 20, color: '#E7B631', fontWeight: 600 }}>https://www.sathus.in</span>
          <div style={{ display: 'flex', gap: 20, fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
            <span>AI Swarms</span>
            <span>•</span>
            <span>Apache Iceberg</span>
            <span>•</span>
            <span>FastAPI MLOps</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
