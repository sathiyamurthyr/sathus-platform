const endpoints = [
  ['Daily Patients', '/api/admin/analytics/daily-patients?from=2026-01-01&to=2026-01-31'],
  ['Revenue', '/api/admin/analytics/revenue?from=2026-01-01&to=2026-01-31'],
  ['Doctor Performance', '/api/admin/analytics/doctor-performance?from=2026-01-01&to=2026-01-31'],
  ['Queue Statistics', '/api/admin/analytics/queue-statistics?from=2026-01-01&to=2026-01-31'],
  ['Bed Occupancy', '/api/admin/analytics/bed-occupancy'],
  ['Overview', '/api/admin/analytics/overview?from=2026-01-01&to=2026-01-31'],
];

export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Hospital Admin Dashboard</h1>
      <p>Analytics API endpoints:</p>
      <ul>
        {endpoints.map(([name, href]) => (
          <li key={href}>
            <strong>{name}</strong>: <code>{href}</code>
          </li>
        ))}
      </ul>
    </main>
  );
}
