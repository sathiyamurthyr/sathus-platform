import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface NoteRow {
  id: string;
  article_slug: string;
  question_id: string;
  user_id: string;
  note_text: string;
  is_pinned: boolean;
  color_tag: string;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const userId = searchParams.get('userId');

    if (!slug || !userId) {
      return NextResponse.json(
        { error: 'slug and userId parameters are required' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT * FROM article_notes
      WHERE article_slug = $1 AND user_id = $2
      ORDER BY is_pinned DESC, updated_at DESC;
    `;

    const notes = await query<NoteRow>(sql, [slug, userId]);
    return NextResponse.json({ success: true, notes });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Error fetching notes from PostgreSQL:', message);
    return NextResponse.json({ success: false, error: message, notes: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleSlug, questionId, userId, noteText, colorTag, isPinned } = body;

    if (!articleSlug || !questionId || !userId || noteText === undefined) {
      return NextResponse.json(
        { error: 'articleSlug, questionId, userId, and noteText are required' },
        { status: 400 }
      );
    }

    const trimmedText = String(noteText).trim();
    const color = colorTag || 'yellow';
    const pinned = Boolean(isPinned);

    // If text is empty, delete note
    if (!trimmedText) {
      await query(
        'DELETE FROM article_notes WHERE article_slug = $1 AND question_id = $2 AND user_id = $3',
        [articleSlug, questionId, userId]
      );
      return NextResponse.json({ success: true, deleted: true, questionId });
    }

    const sql = `
      INSERT INTO article_notes (
        article_slug,
        question_id,
        user_id,
        note_text,
        color_tag,
        is_pinned,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (article_slug, question_id, user_id)
      DO UPDATE SET
        note_text = EXCLUDED.note_text,
        color_tag = EXCLUDED.color_tag,
        is_pinned = EXCLUDED.is_pinned,
        updated_at = NOW()
      RETURNING *;
    `;

    const rows = await query<NoteRow>(sql, [
      articleSlug,
      questionId,
      userId,
      trimmedText,
      color,
      pinned,
    ]);

    return NextResponse.json({ success: true, note: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Error saving note to PostgreSQL:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const questionId = searchParams.get('questionId');
    const userId = searchParams.get('userId');

    if (!slug || !questionId || !userId) {
      return NextResponse.json(
        { error: 'slug, questionId, and userId are required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM article_notes WHERE article_slug = $1 AND question_id = $2 AND user_id = $3',
      [slug, questionId, userId]
    );

    return NextResponse.json({ success: true, deleted: true, questionId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Error deleting note from PostgreSQL:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
