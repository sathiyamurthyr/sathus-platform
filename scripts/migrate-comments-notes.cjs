const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:AivioSathus!321@db.arkoolfygfqawyvwnldv.supabase.co:5432/postgres',
  connectionTimeoutMillis: 10000
});

async function run() {
  console.log('Connecting to PostgreSQL database...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS article_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_slug VARCHAR(255) NOT NULL,
      question_id VARCHAR(100),
      author_name VARCHAR(150) NOT NULL,
      author_email VARCHAR(255),
      content TEXT NOT NULL,
      parent_id UUID REFERENCES article_comments(id) ON DELETE CASCADE,
      upvotes INT DEFAULT 0,
      is_approved BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_article_comments_slug ON article_comments(article_slug);
    CREATE INDEX IF NOT EXISTS idx_article_comments_qid ON article_comments(article_slug, question_id);
    CREATE INDEX IF NOT EXISTS idx_article_comments_created ON article_comments(created_at DESC);

    CREATE TABLE IF NOT EXISTS article_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      article_slug VARCHAR(255) NOT NULL,
      question_id VARCHAR(100) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      note_text TEXT NOT NULL,
      is_pinned BOOLEAN DEFAULT false,
      color_tag VARCHAR(50) DEFAULT 'yellow',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT uq_article_notes_user_q UNIQUE (article_slug, question_id, user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_article_notes_user ON article_notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_article_notes_lookup ON article_notes(article_slug, user_id);
  `);

  console.log('PostgreSQL migration completed!');
  const res = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_name IN ('article_comments', 'article_notes');"
  );
  console.log('Confirmed database tables:', res.rows.map(r => r.table_name));
  await pool.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
