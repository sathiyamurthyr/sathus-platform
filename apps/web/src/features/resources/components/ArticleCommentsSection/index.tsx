'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  StickyNote,
  Send,
  ThumbsUp,
  User,
  Clock,
  Sparkles,
  Database,
  Trash2,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchComments,
  submitComment,
  upvoteComment,
  fetchNotes,
  saveNote,
  deleteNote,
  getOrCreateUserId,
  CommentItem,
  NoteItem,
} from '../../lib/notesAndCommentsClient';

interface ArticleCommentsSectionProps {
  articleSlug: string;
  articleTitle: string;
}

export function ArticleCommentsSection({
  articleSlug,
  articleTitle,
}: ArticleCommentsSectionProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'notes'>('comments');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [notes, setNotes] = useState<Record<string, NoteItem>>({});
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [userId, setUserId] = useState<string>('');

  // Comment Form state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Article Note state
  const [articleNoteText, setArticleNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  useEffect(() => {
    const uid = getOrCreateUserId();
    setUserId(uid);

    // Load initial comments
    fetchComments(articleSlug, 'article')
      .then((data) => setComments(data))
      .finally(() => setLoadingComments(false));

    // Load user notes
    fetchNotes(articleSlug, uid)
      .then((data) => {
        setNotes(data);
        if (data['article']) {
          setArticleNoteText(data['article'].note_text);
        }
      })
      .finally(() => setLoadingNotes(false));
  }, [articleSlug]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    setCommentSuccess(false);

    const newComment = await submitComment({
      articleSlug,
      questionId: 'article',
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim() || undefined,
      content: commentText.trim(),
    });

    setSubmittingComment(false);
    if (newComment) {
      setComments([newComment, ...comments]);
      setCommentText('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    }
  };

  const handleUpvote = async (commentId: string) => {
    const updatedVotes = await upvoteComment(commentId);
    if (updatedVotes !== null) {
      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, upvotes: updatedVotes } : c))
      );
    }
  };

  const handleSaveArticleNote = async () => {
    if (!userId || savingNote) return;
    setSavingNote(true);
    setNoteSuccess(false);

    const res = await saveNote({
      articleSlug,
      questionId: 'article',
      userId,
      noteText: articleNoteText,
      colorTag: 'yellow',
    });

    setSavingNote(false);
    if (res) {
      setNotes((prev) => ({ ...prev, article: res }));
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
    }
  };

  const handleDeleteNote = async (questionId: string) => {
    const ok = await deleteNote(articleSlug, questionId, userId);
    if (ok) {
      setNotes((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      if (questionId === 'article') {
        setArticleNoteText('');
      }
    }
  };

  const notesList = Object.values(notes);

  return (
    <div className="rounded-2xl border-2 border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" />
            <span>PostgreSQL Persistence Layer</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Discussion & Personal Study Notes
          </h3>
          <p className="text-xs sm:text-sm text-slate-950">
            Share technical insights or save private notes stored in PostgreSQL.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'comments'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Discussion ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'notes'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" />
            My Notes ({notesList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: COMMENTS & DISCUSSION */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          {/* Post Comment Form */}
          <form
            onSubmit={handlePostComment}
            className="rounded-xl border border-border/80 bg-slate-50/80  p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-950">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Add to Community Discussion</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-950 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar, Data Architect"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-950 mb-1">
                  Email (Optional, not published)
                </label>
                <input
                  type="email"
                  placeholder="arun@example.com"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-950 mb-1">
                Your Technical Comment or Experience *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share your interview experience, alternative architecture solutions, or ask a question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
            </div>

            <div className="flex items-center justify-between">
              {commentSuccess ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Comment saved to PostgreSQL successfully!
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  Stored securely in PostgreSQL • Moderation active
                </span>
              )}
              <button
                type="submit"
                disabled={submittingComment || !authorName.trim() || !commentText.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                {submittingComment ? 'Saving to DB...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {loadingComments ? (
              <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                Loading discussion threads from PostgreSQL...
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
                No comments yet on this guide. Be the first to start the discussion!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5 transition-all hover:border-border"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-[11px]">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-950">
                          {comment.author_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-2">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpvote(comment.id)}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-slate-950 bg-muted/50 hover:bg-muted transition-colors"
                      title="Helpful technical insight"
                    >
                      <ThumbsUp className="h-3 w-3 text-primary" />
                      <span>{comment.upvotes || 0}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-950 font-normal leading-relaxed whitespace-pre-line pl-9">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY PERSONAL NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Article-Level Note Editor */}
          <div className="rounded-xl border border-amber-300 /60 bg-amber-50/70  p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 ">
                <StickyNote className="h-4 w-4 text-amber-700" />
                <span>Overall Study & Revision Notes (Private to You)</span>
              </div>
              {noteSuccess && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved to PostgreSQL!
                </span>
              )}
            </div>

            <textarea
              rows={3}
              placeholder="Jot down key takeaways, salary expectations, target companies (e.g. Netflix, Databricks, Uber), or interview dates..."
              value={articleNoteText}
              onChange={(e) => setArticleNoteText(e.target.value)}
              className="w-full rounded-lg border border-amber-300/80  bg-background/90 p-3 text-xs sm:text-sm text-slate-950  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Saved privately in PostgreSQL via your persistent device profile.
              </span>
              <button
                type="button"
                onClick={handleSaveArticleNote}
                disabled={savingNote}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-sm disabled:opacity-50"
              >
                <BookmarkCheck className="h-3.5 w-3.5" />
                {savingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>

          {/* All Saved Notes List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span>All Saved Notes For This Guide ({notesList.length})</span>
            </h4>

            {loadingNotes ? (
              <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
                Loading notes from PostgreSQL...
              </div>
            ) : notesList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
                No personal notes added yet. Click &quot;Add Note&quot; on any question or use the box above!
              </div>
            ) : (
              notesList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/80 bg-card p-4 space-y-2 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded px-2 py-0.5 font-bold uppercase text-[10px] bg-primary/10 text-primary">
                        {item.question_id === 'article'
                          ? 'General Article Note'
                          : `Question ${item.question_id.toUpperCase()}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-950 font-medium whitespace-pre-line">
                      {item.note_text}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteNote(item.question_id)}
                    className="text-muted-foreground hover:text-rose-600 transition-colors p-1"
                    title="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
