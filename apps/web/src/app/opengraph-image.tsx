import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sathus Technology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: '72px',
          color: '#292329',
          fontFamily: 'Georgia, serif',
          backgroundImage:
            'radial-gradient(900px 500px at 80% -10%, rgba(162,10,58,0.06), transparent), radial-gradient(700px 500px at 0% 110%, rgba(255,153,51,0.06), transparent)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #A20A3A, #FF9933)',
              display: 'flex',
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5, color: '#292329' }}>
            Sathus Technology
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 400, maxWidth: 980, color: '#292329' }}>
            Engineering the Future of AI, Data &amp; Enterprise Software
          </div>
          <div style={{ fontSize: 26, color: '#635861', marginTop: 24, maxWidth: 900 }}>
            Enterprise AI, data platforms, and cloud-native software for regulated industries.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 22, color: '#635861' }}>
          <span>Azure</span>
          <span>Databricks</span>
          <span>Snowflake</span>
          <span>OpenAI</span>
          <span>Kubernetes</span>
        </div>
      </div>
    ),
    size
  );
}
