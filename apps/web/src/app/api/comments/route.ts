import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface CommentRow {
  id: string;
  article_slug: string;
  question_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  parent_id: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const questionId = searchParams.get('questionId');

    if (!slug) {
      return NextResponse.json({ error: 'Missing article slug parameter' }, { status: 400 });
    }

    let sql = 'SELECT * FROM article_comments WHERE article_slug = $1 AND is_approved = true';
    const params: unknown[] = [slug];

    if (questionId === 'article') {
      sql += ' AND (question_id IS NULL OR question_id = \'article\')';
    } else if (questionId && questionId !== 'all') {
      params.push(questionId);
      sql += ` AND question_id = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC LIMIT 200';

    const comments = await query<CommentRow>(sql, params);
    return NextResponse.json({ success: true, comments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Error fetching comments from PostgreSQL:', message);
    return NextResponse.json({ success: false, error: message, comments: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleSlug, questionId, authorName, authorEmail, content, parentId } = body;

    if (!articleSlug || !authorName?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'articleSlug, authorName, and content are required' },
        { status: 400 }
      );
    }

    const trimmedName = String(authorName).trim().slice(0, 100);
    const trimmedEmail = authorEmail ? String(authorEmail).trim().slice(0, 200) : null;
    const trimmedContent = String(content).trim().slice(0, 3000);
    const qId = questionId && questionId !== 'all' ? String(questionId).trim() : null;
    const pId = parentId ? String(parentId).trim() : null;

    const sql = `
      INSERT INTO article_comments (
        article_slug,
        question_id,
        author_name,
        author_email,
        content,
        parent_id,
        upvotes,
        is_approved
      ) VALUES ($1, $2, $3, $4, $5, $6, 0, true)
      RETURNING *;
    `;

    const rows = await query<CommentRow>(sql, [
      articleSlug,
      qId,
      trimmedName,
      trimmedEmail,
      trimmedContent,
      pId,
    ]);

    return NextResponse.json({ success: true, comment: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Error inserting comment into PostgreSQL:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== 'upvote') {
      return NextResponse.json({ error: 'id and action="upvote" required' }, { status: 400 });
    }

    const sql = `
      UPDATE article_comments
      SET upvotes = upvotes + 1, updated_at = NOW()
      WHERE id = $1
      RETURNING id, upvotes;
    `;

    const rows = await query<{ id: string; upvotes: number }>(sql, [id]);

    if (!rows.length) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment: rows[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database error';
    console.error('Error upvoting comment in PostgreSQL:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
