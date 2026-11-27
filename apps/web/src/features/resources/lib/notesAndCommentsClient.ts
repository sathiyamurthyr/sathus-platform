'use client';

export interface CommentItem {
  id: string;
  article_slug: string;
  question_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  parent_id: string | null;
  upvotes: number;
  created_at: string;
}

export interface NoteItem {
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

export function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'server_guest';
  try {
    let id = localStorage.getItem('sathus_user_id');
    if (!id) {
      id = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('sathus_user_id', id);
    }
    return id;
  } catch {
    return 'local_guest';
  }
}

export async function fetchComments(
  articleSlug: string,
  questionId?: string
): Promise<CommentItem[]> {
  try {
    const params = new URLSearchParams({ slug: articleSlug });
    if (questionId) params.append('questionId', questionId);
    const res = await fetch(`/api/comments?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.comments || [];
  } catch (err) {
    console.error('Failed to fetch comments:', err);
    return [];
  }
}

export async function submitComment(payload: {
  articleSlug: string;
  questionId?: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId?: string;
}): Promise<CommentItem | null> {
  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.comment || null;
  } catch (err) {
    console.error('Failed to submit comment:', err);
    return null;
  }
}

export async function upvoteComment(id: string): Promise<number | null> {
  try {
    const res = await fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'upvote' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.comment?.upvotes ?? null;
  } catch (err) {
    console.error('Failed to upvote comment:', err);
    return null;
  }
}

export async function fetchNotes(
  articleSlug: string,
  userId: string
): Promise<Record<string, NoteItem>> {
  try {
    const params = new URLSearchParams({ slug: articleSlug, userId });
    const res = await fetch(`/api/notes?${params.toString()}`);
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, NoteItem> = {};
    if (Array.isArray(data.notes)) {
      data.notes.forEach((n: NoteItem) => {
        map[n.question_id] = n;
      });
    }
    return map;
  } catch (err) {
    console.error('Failed to fetch notes:', err);
    return {};
  }
}

export async function saveNote(payload: {
  articleSlug: string;
  questionId: string;
  userId: string;
  noteText: string;
  colorTag?: string;
  isPinned?: boolean;
}): Promise<NoteItem | null> {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.note || null;
  } catch (err) {
    console.error('Failed to save note:', err);
    return null;
  }
}

export async function deleteNote(
  articleSlug: string,
  questionId: string,
  userId: string
): Promise<boolean> {
  try {
    const params = new URLSearchParams({ slug: articleSlug, questionId, userId });
    const res = await fetch(`/api/notes?${params.toString()}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete note:', err);
    return false;
  }
}
