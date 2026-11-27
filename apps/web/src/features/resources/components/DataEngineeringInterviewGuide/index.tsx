'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  StickyNote,
  MessageSquare,
  BookmarkCheck,
} from 'lucide-react';
import {
  fetchNotes,
  saveNote,
  fetchComments,
  submitComment,
  getOrCreateUserId,
  NoteItem,
  CommentItem,
} from '../../lib/notesAndCommentsClient';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  Terminal,
  Server,
  Workflow,
  Brain,
  Compass,
  Users,
  Lightbulb,
  Menu,
} from 'lucide-react';
import { SECTIONS_DATA, SectionData, QuestionItem } from './questionsData';
import { PdfDownloadButton } from '@/components/common/pdf-download-button';
import {
  SparkArchitectureDiagram,
  MedallionLakehouseDiagram,
  StreamingCdcDiagram,
  SqlWindowFunctionDiagram,
  AiFeatureStoreDiagram,
} from './ArchitectureDiagrams';

export function DataEngineeringInterviewGuide() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  // PostgreSQL Notes & Comments state
  const [userId, setUserId] = useState<string>('');
  const [userNotes, setUserNotes] = useState<Record<string, NoteItem>>({});
  const [openNotesForQ, setOpenNotesForQ] = useState<Record<number, boolean>>({});
  const [editingNoteText, setEditingNoteText] = useState<Record<number, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<number | null>(null);

  // Question comments state
  const [openCommentsForQ, setOpenCommentsForQ] = useState<Record<number, boolean>>({});
  const [questionComments, setQuestionComments] = useState<Record<number, CommentItem[]>>({});
  const [loadingCommentsForQ, setLoadingCommentsForQ] = useState<Record<number, boolean>>({});
  const [newCommentName, setNewCommentName] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>({});
  const [submittingCommentForQ, setSubmittingCommentForQ] = useState<number | null>(null);
  const [filterOnlyNotes, setFilterOnlyNotes] = useState<boolean>(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState<boolean>(false);

  useEffect(() => {
    const uid = getOrCreateUserId();
    setUserId(uid);
    fetchNotes('500-data-engineering-interview-questions-answers-2026', uid).then((notes) => {
      setUserNotes(notes);
    });
  }, []);

  const handleSaveQuestionNote = async (qNumber: number) => {
    const qKey = `q${qNumber}`;
    const text = editingNoteText[qNumber] ?? userNotes[qKey]?.note_text ?? '';
    setSavingNoteId(qNumber);
    const res = await saveNote({
      articleSlug: '500-data-engineering-interview-questions-answers-2026',
      questionId: qKey,
      userId,
      noteText: text,
      colorTag: 'yellow',
    });
    setSavingNoteId(null);
    if (res) {
      setUserNotes((prev) => ({ ...prev, [qKey]: res }));
    } else if (!text.trim()) {
      setUserNotes((prev) => {
        const next = { ...prev };
        delete next[qKey];
        return next;
      });
    }
  };

  const handleToggleComments = async (qNumber: number) => {
    const willOpen = !openCommentsForQ[qNumber];
    setOpenCommentsForQ((prev) => ({ ...prev, [qNumber]: willOpen }));
    if (willOpen && !questionComments[qNumber]) {
      setLoadingCommentsForQ((prev) => ({ ...prev, [qNumber]: true }));
      const comments = await fetchComments(
        '500-data-engineering-interview-questions-answers-2026',
        `q${qNumber}`
      );
      setQuestionComments((prev) => ({ ...prev, [qNumber]: comments }));
      setLoadingCommentsForQ((prev) => ({ ...prev, [qNumber]: false }));
    }
  };

  const handlePostQuestionComment = async (qNumber: number) => {
    const text = newCommentText[qNumber]?.trim();
    const author = newCommentName.trim() || 'Data Engineer';
    if (!text) return;

    setSubmittingCommentForQ(qNumber);
    const comment = await submitComment({
      articleSlug: '500-data-engineering-interview-questions-answers-2026',
      questionId: `q${qNumber}`,
      authorName: author,
      content: text,
    });
    setSubmittingCommentForQ(null);
    if (comment) {
      setQuestionComments((prev) => ({
        ...prev,
        [qNumber]: [comment, ...(prev[qNumber] || [])],
      }));
      setNewCommentText((prev) => ({ ...prev, [qNumber]: '' }));
    }
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({
    1: true,
    8: true,
    86: true,
    161: true,
  });
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filter & Comprehensive Search Engine
  const filteredSections = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    const isQNum = /^q[\s-]?(\d+)$/i.exec(rawQuery);
    const targetQNum = isQNum ? parseInt(isQNum[1], 10) : (/^\d+$/.test(rawQuery) ? parseInt(rawQuery, 10) : null);
    const tokens = rawQuery.split(/[\s,+/]+/).filter(Boolean);

    return SECTIONS_DATA.map((section) => {
      // When a search query is entered, search across all sections globally.
      // If no search query, honor the selected section tab.
      const isSectionMatch = rawQuery ? true : (selectedSectionId === 'all' || section.id === selectedSectionId);
      if (!isSectionMatch) {
        return { ...section, questions: [] };
      }

      const matchingQuestions = section.questions.filter((q) => {
        const matchesDifficulty =
          selectedDifficulty === 'all' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        const matchesNotes = !filterOnlyNotes || Boolean(userNotes[`q${q.id}`]);

        if (!matchesDifficulty || !matchesNotes) return false;
        if (!rawQuery) return true;

        // 1. Direct Question ID match: "88", "q88", "Q-88", "q 88"
        if (targetQNum !== null && q.id === targetQNum) {
          return true;
        }

        if (`q${q.id}` === rawQuery || `q ${q.id}` === rawQuery) {
          return true;
        }

        // 2. Full searchable corpus across all fields
        const corpus = [
          `q${q.id}`,
          `question ${q.id}`,
          q.question,
          q.category,
          q.shortAnswer,
          q.detailedAnswer,
          q.interviewerTip || '',
          q.codeSnippet || '',
          q.codeLanguage || '',
          q.relatedTags.join(' '),
          q.difficulty,
          section.title,
        ].join(' ').toLowerCase();

        // 3. Exact query in corpus
        if (corpus.includes(rawQuery)) {
          return true;
        }

        // 4. Tokenized match: every word in search query must exist in corpus
        return tokens.length > 0 && tokens.every((token) => corpus.includes(token));
      });

      return {
        ...section,
        questions: matchingQuestions,
      };
    }).filter((section) => {
      // Hide sections with 0 matching questions when a filter or search is active
      if (rawQuery || selectedDifficulty !== 'all' || filterOnlyNotes) {
        return section.questions.length > 0;
      }
      return selectedSectionId === 'all' || section.id === selectedSectionId;
    });
  }, [selectedSectionId, searchQuery, selectedDifficulty, filterOnlyNotes, userNotes]);

  // Auto-expand top matching questions when searching so answers are immediately visible
  useEffect(() => {
    if (searchQuery.trim()) {
      const autoExpanded: Record<number, boolean> = {};
      let count = 0;
      for (const sec of filteredSections) {
        for (const q of sec.questions) {
          autoExpanded[q.id] = true;
          count++;
          if (count >= 12) break;
        }
        if (count >= 12) break;
      }
      setExpandedQuestions((prev) => ({ ...prev, ...autoExpanded }));
    }
  }, [searchQuery, filteredSections]);

  const totalFilteredCount = filteredSections.reduce((acc, sec) => acc + sec.questions.length, 0);

  // Flattened list of all matching questions for instant search results view
  const allMatchingQuestions = useMemo(() => {
    const list: Array<{ question: QuestionItem; sectionTitle: string; sectionRange: string; sectionId: string }> = [];
    filteredSections.forEach((sec) => {
      sec.questions.forEach((q) => {
        list.push({
          question: q,
          sectionTitle: sec.title,
          sectionRange: sec.range,
          sectionId: sec.id,
        });
      });
    });
    return list;
  }, [filteredSections]);

  return (
    <div className="w-full space-y-10 text-foreground selection:bg-primary/20">
      {/* GUIDE HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-card via-card/95 to-background p-6 sm:p-10 shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Comprehensive 2026 Masterclass
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-mono">
              500+ Curated Questions & Answers
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              5 Architecture Blueprints
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            The Complete Data Engineering & Architecture Interview Handbook (2026 Edition)
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From distributed Spark Catalyst mechanics and Databricks Liquid Clustering to log-based CDC streaming,
            dimensional star modeling, and enterprise AI feature pipelines. Includes high-resolution architectural
            diagrams, production code patterns, and interviewer expectations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <PdfDownloadButton
              title="500+ Data Engineering Interview Questions and Answers (2026 Edition)"
              slug="500-data-engineering-interview-questions-answers-2026"
              downloadUrl="/downloads/500-data-engineering-interview-guide-2026.md"
              variant="default"
              buttonText="Download Full Handbook (PDF & Offline)"
              className="bg-[#A20A3A] hover:bg-[#85082e] text-white shadow-md font-bold px-4 py-2.5 rounded-xl"
            />
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <span>🔒 Free instant access</span>
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Coverage</span>
              <p className="text-base font-bold text-foreground">8 Core Domains</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Questions</span>
              <p className="text-base font-bold text-primary font-mono">Q1 to Q500</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Visuals</span>
              <p className="text-base font-bold text-foreground">5 High-Res Diagrams</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Level</span>
              <p className="text-base font-bold text-emerald-600">Junior to Staff Architect</p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS (SEARCH & SECTION PILLS) */}
      <div className="sticky top-16 z-20 rounded-2xl border border-border bg-card/95 p-3 sm:p-4 shadow-lg backdrop-blur-md space-y-3">
        {/* MOBILE VIEW (< md): Hide bulky search & pills, show sleek MENU STYLE section selector */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#A20A3A]/10 text-[#A20A3A] shrink-0">
              <Menu className="h-4 w-4" />
            </div>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-bold text-slate-950 outline-none focus:border-[#A20A3A] shadow-xs truncate"
              aria-label="Select section menu"
            >
              <option value="all">📚 Menu: All Sections (500 Qs)</option>
              {SECTIONS_DATA.map((sec, idx) => (
                <option key={sec.id} value={sec.id}>
                  Sec {idx + 1} ({sec.range}): {sec.title.split('&')[0].trim()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            className={`flex items-center justify-center h-9 w-9 rounded-xl border transition-all shrink-0 ${
              mobileSearchVisible || searchQuery || filterOnlyNotes || selectedDifficulty !== 'all'
                ? 'border-[#A20A3A] bg-[#A20A3A] text-white shadow-xs'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle search options"
            title="Search & Filters"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Search/Filter options: hidden by default, visible only when user taps search toggle or active search */}
        {mobileSearchVisible && (
          <div className="md:hidden space-y-2 pt-2 border-t border-slate-200">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 500+ questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-7 text-xs text-foreground outline-none focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[10px] text-muted-foreground hover:text-foreground font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOnlyNotes(!filterOnlyNotes)}
                className={`flex-1 flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[11px] font-bold ${
                  filterOnlyNotes
                    ? 'border-amber-500 bg-amber-50 text-amber-950'
                    : 'border-border bg-background text-slate-950'
                }`}
              >
                <StickyNote className="h-3 w-3 text-amber-600" />
                <span>Notes ({Object.keys(userNotes).filter((k) => k !== 'article').length})</span>
              </button>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex-1 rounded-lg border border-border bg-background py-1.5 px-2 text-[11px] font-semibold text-foreground outline-none"
              >
                <option value="all">All Levels</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="staff/principal">Staff</option>
              </select>
            </div>
          </div>
        )}

        {/* DESKTOP / WEB VIEW (md+): Show as usual! */}
        <div className="hidden md:flex flex-col gap-3">
          {/* Search input + Difficulty filter */}
          <div className="flex flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 500+ questions (e.g. 'Liquid Clustering', 'AQE', 'Broadcast Join', 'Watermark', 'SCD Type 2', 'Q88')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-xs sm:text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <button
                onClick={() => setFilterOnlyNotes(!filterOnlyNotes)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                  filterOnlyNotes
                    ? 'border-amber-500 bg-amber-50 text-amber-950   shadow-sm'
                    : 'border-border bg-background text-slate-950 hover:bg-muted'
                }`}
                title="Filter to view only questions with personal notes"
              >
                <StickyNote className="h-3.5 w-3.5 text-amber-600 " />
                <span>My Notes ({Object.keys(userNotes).filter((k) => k !== 'article').length})</span>
              </button>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior Engineer</option>
                <option value="staff/principal">Staff / Principal Architect</option>
              </select>
            </div>
          </div>

          {/* Section Pill Selectors - Clean wrap without horizontal clipping */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <button
              onClick={() => setSelectedSectionId('all')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition-all ${
                selectedSectionId === 'all'
                  ? 'bg-[#A20A3A] text-white shadow-md border-2 border-[#A20A3A]'
                  : 'border-2 border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:border-slate-400 shadow-xs'
              }`}
            >
              All Sections (500 Qs)
            </button>
            {SECTIONS_DATA.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                  selectedSectionId === sec.id
                    ? 'bg-[#A20A3A] text-white shadow-md border-2 border-[#A20A3A]'
                    : 'border-2 border-slate-300 bg-white text-slate-950 hover:bg-slate-100 hover:border-slate-400 shadow-xs'
                }`}
              >
                Sec {idx + 1}: {sec.range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER STATUS */}
      {(searchQuery || selectedDifficulty !== 'all' || selectedSectionId !== 'all') && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-foreground">{totalFilteredCount}</strong> matching questions
            {searchQuery && <> for &ldquo;<span className="text-primary">{searchQuery}</span>&rdquo;</>}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
              setSelectedSectionId('all');
            }}
            className="text-primary font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* NO RESULTS EMPTY STATE */}
      {totalFilteredCount === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-900 border border-rose-200">
            <Search className="h-6 w-6 text-[#A20A3A]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-xl font-black text-slate-950">
              No interview questions found matching &ldquo;{searchQuery}&rdquo;
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto font-medium">
              Try searching with popular keywords like{' '}
              <button onClick={() => setSearchQuery('Spark')} className="font-bold text-[#A20A3A] underline">Spark</button>,{' '}
              <button onClick={() => setSearchQuery('Delta Lake')} className="font-bold text-[#A20A3A] underline">Delta Lake</button>,{' '}
              <button onClick={() => setSearchQuery('Kafka')} className="font-bold text-[#A20A3A] underline">Kafka</button>,{' '}
              <button onClick={() => setSearchQuery('SQL')} className="font-bold text-[#A20A3A] underline">SQL</button>,{' '}
              <button onClick={() => setSearchQuery('Liquid Clustering')} className="font-bold text-[#A20A3A] underline">Liquid Clustering</button>, or{' '}
              <button onClick={() => setSearchQuery('Q1')} className="font-bold text-[#A20A3A] underline">Q1</button>.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
                setSelectedSectionId('all');
                setFilterOnlyNotes(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#A20A3A] hover:bg-[#85082e] px-5 py-2.5 text-xs font-black text-white transition-colors shadow-md"
            >
              Clear All Filters & Reset (Show 500 Questions)
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED INSTANT SEARCH RESULTS VIEW WHEN SEARCHING */}
      {searchQuery.trim() && totalFilteredCount > 0 ? (
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-slate-300 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#A20A3A]" />
                Found {totalFilteredCount} matching question{totalFilteredCount > 1 ? 's' : ''} for &ldquo;<span className="text-[#A20A3A]">{searchQuery}</span>&rdquo;
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Questions are auto-expanded with full answers, deep mechanics, and interview tips.
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 px-3.5 py-1.5 text-xs font-bold transition-colors"
            >
              Clear Search & Show Full Guide
            </button>
          </div>

          <div className="space-y-4">
            {allMatchingQuestions.map(({ question: q, sectionTitle }) => {
              const isExpanded = expandedQuestions[q.id] !== false; // Default expanded in search

              return (
                <div
                  key={q.id}
                  className="overflow-hidden rounded-2xl border-2 border-slate-300 bg-white transition-all shadow-sm hover:border-[#A20A3A]/60"
                >
                  {/* Search Card Header */}
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-[#A20A3A]/10 border border-[#A20A3A]/30 px-2 py-0.5 font-mono text-xs font-black text-[#A20A3A]">
                          Q{q.id}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            q.difficulty === 'Junior'
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                              : q.difficulty === 'Mid'
                              ? 'bg-blue-100 text-blue-950 border border-blue-300'
                              : q.difficulty === 'Senior'
                              ? 'bg-purple-100 text-purple-950 border border-purple-300'
                              : 'bg-rose-100 text-rose-950 border border-rose-300'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-slate-800 font-bold">• {sectionTitle.split(':')[0]} • {q.category}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                        {q.question}
                      </h4>

                      {!isExpanded && (
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 line-clamp-1">
                          {q.shortAnswer}
                        </p>
                      )}
                    </div>

                    <div className="p-1 rounded-md text-slate-700 hover:text-slate-950 shrink-0 mt-0.5">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {/* Search Card Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t-2 border-slate-200 space-y-5 bg-white text-xs sm:text-sm">
                      {/* Short Executive Summary */}
                      <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-4 sm:p-5 space-y-1.5 shadow-xs">
                        <span className="text-xs font-black uppercase tracking-wider text-rose-950 block">
                          Direct Executive Summary
                        </span>
                        <p className="text-sm sm:text-base font-black text-slate-950 leading-relaxed">
                          {q.shortAnswer}
                        </p>
                      </div>

                      {/* Detailed In-Depth Breakdown */}
                      <div className="space-y-3 pt-1">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 border-b-2 border-slate-200 pb-1.5">
                          Under the Hood / Deep Mechanics
                        </span>
                        <div className="whitespace-pre-line text-slate-950 font-medium text-sm sm:text-base leading-relaxed space-y-3">
                          {q.detailedAnswer}
                        </div>
                      </div>

                      {/* Optional Code Snippet */}
                      {q.codeSnippet && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-950">
                            <span className="uppercase tracking-wider font-bold text-primary">{q.codeLanguage || 'Code Example'}</span>
                            <button
                              onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline px-2.5 py-1 rounded bg-muted/60"
                            >
                              {copiedCodeId === q.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copy Snippet
                                </>
                              )}
                            </button>
                          </div>
                          <div className="overflow-x-auto rounded-xl bg-zinc-950 p-4 sm:p-5 font-mono text-xs sm:text-sm text-zinc-100 border border-zinc-800 shadow-md">
                            <pre>{q.codeSnippet}</pre>
                          </div>
                        </div>
                      )}

                      {/* Interviewer Tip Box */}
                      {q.interviewerTip && (
                        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 sm:p-5 space-y-2 shadow-sm">
                          <strong className="block font-black flex items-center gap-1.5 text-amber-950 text-xs sm:text-sm">
                            <Sparkles className="h-4 w-4 text-amber-700" />
                            Staff Engineer Interviewer Tip & Trap Alert
                          </strong>
                          <p className="text-xs sm:text-sm font-bold text-slate-950 leading-relaxed">
                            {q.interviewerTip}
                          </p>
                        </div>
                      )}

                      {/* Notes & Comments Actions Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const isOpen = !openNotesForQ[q.id];
                              setOpenNotesForQ((prev) => ({ ...prev, [q.id]: isOpen }));
                              if (isOpen && editingNoteText[q.id] === undefined) {
                                setEditingNoteText((prev) => ({
                                  ...prev,
                                  [q.id]: userNotes[`q${q.id}`]?.note_text || '',
                                }));
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                              userNotes[`q${q.id}`]
                                ? 'bg-amber-100 text-amber-900 border border-amber-400'
                                : 'bg-muted/70 text-slate-950 hover:bg-muted'
                            }`}
                          >
                            <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                            <span>{userNotes[`q${q.id}`] ? 'Note Saved' : 'Add Note'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleComments(q.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-muted/70 text-slate-950 hover:bg-muted transition-all"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-primary" />
                            <span>Discussion {questionComments[q.id]?.length ? `(${questionComments[q.id].length})` : ''}</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {q.relatedTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inline Note Editor */}
                      {openNotesForQ[q.id] && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3.5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                            <span className="flex items-center gap-1.5">
                              <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                              My Private Study Note for Q{q.id} (Stored in PostgreSQL)
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            placeholder={`Write your study notes for Q${q.id}...`}
                            value={editingNoteText[q.id] ?? userNotes[`q${q.id}`]?.note_text ?? ''}
                            onChange={(e) => setEditingNoteText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            className="w-full rounded-lg border border-amber-300 bg-background p-2.5 text-xs text-foreground font-medium"
                          />
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">Saved to PostgreSQL</span>
                            <button
                              onClick={() => handleSaveQuestionNote(q.id)}
                              disabled={savingNoteId === q.id}
                              className="inline-flex items-center gap-1 rounded-md bg-amber-600 hover:bg-amber-700 px-3 py-1 text-xs font-bold text-white shadow-xs"
                            >
                              <BookmarkCheck className="h-3.5 w-3.5" />
                              {savingNoteId === q.id ? 'Saving...' : 'Save Note'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* NORMAL SECTION-BY-SECTION VIEW WITH ARCHITECTURE DIAGRAMS & CHEAT SHEETS */
        <div className="space-y-14">
          {filteredSections.map((sec, secIndex) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-36 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm"
          >
            {/* SECTION HEADER */}
            <div className="border-b border-border/60 pb-5 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-mono font-bold text-primary">
                  {sec.range}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Part {secIndex + 1} of 8
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {sec.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-semibold">
                {sec.summary}
              </p>

              {/* Topics tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {sec.keyTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md border-2 border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-950"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* HIGH-YIELD CHEAT SHEET SUMMARY */}
            <div className="rounded-2xl border-2 border-slate-300 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-[#A20A3A] uppercase tracking-wider">
                <Lightbulb className="h-4 w-4 text-[#A20A3A]" />
                <span>Executive Cheat Sheet & Critical Interview Rules</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {sec.cheatSheet.map((item, idx) => (
                  <div key={idx} className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 shadow-xs">
                    <strong className="text-slate-950 block font-black text-xs sm:text-sm mb-1">{item.label}</strong>
                    <span className="text-slate-900 font-semibold text-xs sm:text-sm leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ARCHITECTURE DIAGRAM INJECTION */}
            {sec.diagramType === 'spark' && <SparkArchitectureDiagram />}
            {sec.diagramType === 'lakehouse' && <MedallionLakehouseDiagram />}
            {sec.diagramType === 'streaming' && <StreamingCdcDiagram />}
            {sec.diagramType === 'sql' && <SqlWindowFunctionDiagram />}
            {sec.diagramType === 'aifeatures' && <AiFeatureStoreDiagram />}

            {/* DETAILED QUESTION ACCORDIONS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Key Interview Questions & Deep Technical Explanations ({sec.questions.length})
                </h4>
              </div>

              {sec.questions.map((q) => {
                const isExpanded = !!expandedQuestions[q.id];

                return (
                  <div
                    key={q.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 shadow-xs"
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                            Q{q.id}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              q.difficulty === 'Junior'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                : q.difficulty === 'Mid'
                                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                                : q.difficulty === 'Senior'
                                ? 'bg-amber-500/15 text-amber-800 '
                                : 'bg-rose-500/15 text-rose-800 dark:text-rose-300'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[11px] text-slate-700  font-semibold">• {q.category}</span>
                        </div>

                        <h5 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                          {q.question}
                        </h5>

                        {!isExpanded && (
                          <p className="text-xs sm:text-sm font-medium text-slate-600  line-clamp-1">
                            {q.shortAnswer}
                          </p>
                        )}
                      </div>

                      <div className="p-1 rounded-md text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-border/60 space-y-5 bg-background text-xs sm:text-sm">
                        {/* Short TL;DR Answer */}
                        <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-4 space-y-1.5 shadow-xs">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-[#A20A3A] dark:text-rose-400">Direct Executive Summary</span>
                          <p className="text-sm sm:text-base font-bold text-slate-950 leading-relaxed">
                            {q.shortAnswer}
                          </p>
                        </div>

                        {/* Detailed In-Depth Breakdown */}
                        <div className="space-y-3 pt-1">
                          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 border-b-2 border-slate-200 pb-1.5">
                            Under the Hood / Deep Mechanics
                          </span>
                          <div className="whitespace-pre-line text-slate-950 font-medium text-sm sm:text-base leading-relaxed space-y-3">
                            {q.detailedAnswer}
                          </div>
                        </div>

                        {/* Optional Code Snippet */}
                        {q.codeSnippet && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-950">
                              <span className="uppercase tracking-wider font-bold text-primary">{q.codeLanguage || 'Code Example'}</span>
                              <button
                                onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline px-2.5 py-1 rounded bg-muted/60"
                              >
                                {copiedCodeId === q.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" /> Copy Snippet
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl bg-zinc-950 p-4 sm:p-5 font-mono text-xs sm:text-sm text-zinc-100 border border-zinc-800 shadow-md">
                              <pre>{q.codeSnippet}</pre>
                            </div>
                          </div>
                        )}

                        {/* Interviewer Tip Box */}
                        {q.interviewerTip && (
                          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 sm:p-5 space-y-2 shadow-sm">
                            <strong className="block font-black flex items-center gap-1.5 text-amber-950 text-xs sm:text-sm">
                              <Sparkles className="h-4 w-4 text-amber-700" />
                              Staff Engineer Interviewer Tip & Trap Alert
                            </strong>
                            <p className="text-xs sm:text-sm font-bold text-slate-950 leading-relaxed">
                              {q.interviewerTip}
                            </p>
                          </div>
                        )}

                        {/* Notes & Comments Actions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60">
                          <div className="flex items-center gap-2">
                            {/* Personal Note Button */}
                            <button
                              onClick={() => {
                                const isOpen = !openNotesForQ[q.id];
                                setOpenNotesForQ((prev) => ({ ...prev, [q.id]: isOpen }));
                                if (isOpen && editingNoteText[q.id] === undefined) {
                                  setEditingNoteText((prev) => ({
                                    ...prev,
                                    [q.id]: userNotes[`q${q.id}`]?.note_text || '',
                                  }));
                                }
                              }}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                                userNotes[`q${q.id}`]
                                  ? 'bg-amber-100 text-amber-900 border border-amber-400   '
                                  : 'bg-muted/70 text-slate-950 hover:bg-muted'
                              }`}
                            >
                              <StickyNote className="h-3.5 w-3.5 text-amber-600 " />
                              <span>{userNotes[`q${q.id}`] ? 'Note Saved' : 'Add Note'}</span>
                            </button>

                            {/* Discussion Button */}
                            <button
                              onClick={() => handleToggleComments(q.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-muted/70 text-slate-950 hover:bg-muted transition-all"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-primary" />
                              <span>Discussion {questionComments[q.id]?.length ? `(${questionComments[q.id].length})` : ''}</span>
                            </button>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {q.relatedTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Inline Note Editor */}
                        {openNotesForQ[q.id] && (
                          <div className="rounded-xl border border-amber-300  bg-amber-50/90  p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-amber-950 ">
                              <span className="flex items-center gap-1.5">
                                <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                                My Private Study Note for Q{q.id} (Stored in PostgreSQL)
                              </span>
                              {userNotes[`q${q.id}`] && (
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  Updated {new Date(userNotes[`q${q.id}`].updated_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <textarea
                              rows={2}
                              placeholder={`Write your study notes, key formulas, or interview reminder for Q${q.id}...`}
                              value={editingNoteText[q.id] ?? userNotes[`q${q.id}`]?.note_text ?? ''}
                              onChange={(e) => setEditingNoteText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                              className="w-full rounded-lg border border-amber-300  bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                            />
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground">
                                Saved to PostgreSQL via persistent profile
                              </span>
                              <button
                                onClick={() => handleSaveQuestionNote(q.id)}
                                disabled={savingNoteId === q.id}
                                className="inline-flex items-center gap-1 rounded-md bg-amber-600 hover:bg-amber-700 px-3 py-1 text-xs font-bold text-white transition-colors disabled:opacity-50 shadow-xs"
                              >
                                <BookmarkCheck className="h-3.5 w-3.5" />
                                {savingNoteId === q.id ? 'Saving...' : 'Save Note'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Inline Question Discussion */}
                        {openCommentsForQ[q.id] && (
                          <div className="rounded-xl border border-border/80 bg-slate-50/90 dark:bg-slate-900/50 p-4 space-y-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <MessageSquare className="h-3.5 w-3.5 text-primary" />
                              <span>Discussion & Community Answers for Q{q.id}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="Your name (e.g. Senior DE)"
                                value={newCommentName}
                                onChange={(e) => setNewCommentName(e.target.value)}
                                className="sm:w-1/3 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              />
                              <input
                                type="text"
                                placeholder={`Add an insight or your interview experience for Q${q.id}...`}
                                value={newCommentText[q.id] || ''}
                                onChange={(e) => setNewCommentText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handlePostQuestionComment(q.id);
                                }}
                                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                              />
                              <button
                                onClick={() => handlePostQuestionComment(q.id)}
                                disabled={submittingCommentForQ === q.id || !newCommentText[q.id]?.trim()}
                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                {submittingCommentForQ === q.id ? 'Saving...' : 'Post'}
                              </button>
                            </div>

                            <div className="space-y-2 pt-1">
                              {loadingCommentsForQ[q.id] ? (
                                <div className="text-xs text-muted-foreground animate-pulse py-1">
                                  Loading discussion from PostgreSQL...
                                </div>
                              ) : !questionComments[q.id] || questionComments[q.id].length === 0 ? (
                                <div className="text-[11px] text-muted-foreground py-1">
                                  No comments yet on Q{q.id}. Be the first to share an insight!
                                </div>
                              ) : (
                                questionComments[q.id].map((cm) => (
                                  <div
                                    key={cm.id}
                                    className="rounded-lg border border-border/70 bg-card p-2.5 text-xs space-y-1"
                                  >
                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                      <span className="font-bold text-foreground">{cm.author_name}</span>
                                      <span>{new Date(cm.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-950 text-xs font-normal leading-relaxed">
                                      {cm.content}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        </div>
      )}

      {/* FULL 500 QUESTIONS DIRECTORY LIST (COLLAPSIBLE MASTER INDEX) */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 space-y-6 shadow-md">
        <div className="space-y-2 border-b border-border pb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Complete 500 Questions Master Catalog</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Complete 500 Interview Questions Reference Index
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every candidate should be prepared to discuss these 500 questions across Spark internals, Delta Lake ACID
            protocols, SQL window frames, cloud storage encodings, stream watermarks, and system design trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              1. Apache Spark & PySpark (Q1–Q85)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q1–Q15: Spark vs MapReduce, Driver/Executors, DAG Scheduler, Catalyst Phases</li>
              <li>Q16–Q30: Tungsten Engine, Whole-Stage CodeGen, AQE Runtime Optimizations, Caching Storage Levels</li>
              <li>Q31–Q50: Narrow vs Wide Transformations, Coalesce vs Repartition, Broadcast Hash Joins</li>
              <li>Q51–Q70: Sort-Merge Join Mechanics, Data Skew Detection, Key Salting, Driver vs Executor OOM</li>
              <li>Q71–Q85: Window Functions, Islands-and-Gaps, Predicate Pushdown, Schema Evolution</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              2. Databricks & Delta Lake (Q86–Q160)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q86–Q105: Medallion Architecture, _delta_log JSON Commits, Optimistic Concurrency (OCC)</li>
              <li>Q106–Q125: Liquid Clustering vs Z-Order, Deletion Vectors, VACUUM Retention Safety</li>
              <li>Q126–Q145: Auto Loader cloudFiles, DLT Expectations, Unity Catalog 3-Level Namespace</li>
              <li>Q146–Q160: SCD Type 2 Merge, Structured Streaming Checkpoints, Watermarks, Schema Evolution</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              3. SQL & Data Modeling (Q161–Q245)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q161–Q180: Logical Order of Execution, ROW_NUMBER vs RANK vs DENSE_RANK, Top N per Group</li>
              <li>Q181–Q205: SARGable Predicates, Index Seeks vs Scans, Kimball Grain Declaration</li>
              <li>Q206–Q225: Star vs Snowflake vs OBT, Conformed Dimensions, Factless Facts, Junk Dimensions</li>
              <li>Q226–Q245: SCD Types 0-3, Surrogate Keys, Islands and Gaps, User Cohort Retention Analysis</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              4. Warehousing & Storage (Q246–Q310)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q246–Q265: Snowflake Micro-partitioning, BigQuery Dremel, Redshift Distribution Styles</li>
              <li>Q266–Q285: Parquet Row Groups & Page Encoding (RLE/Dictionary), Object Storage Consistency</li>
              <li>Q286–Q310: FinOps Cost Observability, 5 Pillars of Data Observability, Data Mesh Principles</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Workflow className="h-4 w-4 text-primary" />
              5. Ingestion, CDC & Streaming (Q311–Q380)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q311–Q330: Log-Based CDC (Debezium) vs Query CDC, Kafka Partitions & FIFO Ordering</li>
              <li>Q331–Q355: Exactly-Once Semantics, Event Time vs Processing Time, Watermark State Eviction</li>
              <li>Q356–Q380: Apache Airflow DAG Best Practices, Backfills, Dead-Letter Queues, dbt Models</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              6. AI & Modern Pipelines (Q381–Q425)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q381–Q400: Offline vs Online Feature Stores, Training-Serving Skew Prevention</li>
              <li>Q401–Q425: Point-in-Time Correct (AS-OF) Joins, RAG Document Chunking & Vector Sync, Data Contracts</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              7. System Design Scenarios (Q426–Q465)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q426–Q445: Near-Real-Time Clickstream, Financial Ledger Reconciliation, 5TB Daily Batch ETL SLAs</li>
              <li>Q446–Q465: Zero-Downtime DWH Migrations, Multi-Tenant Data Lakehouses, Disaster Recovery (RPO/RTO)</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              8. Behavioral & Leadership (Q466–Q500)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q466–Q480: STAR Method for Production Outages, Blameless Post-Mortems, Tech Debt vs Feature Velocity</li>
              <li>Q481–Q500: Cross-Team Data Contract Negotiation, Mentoring Engineers, Production Readiness Checklists</li>
            </ul>
          </div>
        </div>
      </div>

      {/* STRATEGY SESSION FOOTER */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card/90 to-primary/5 p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Accelerate Your Enterprise Data Platform Architecture
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Sathus Technology helps global enterprises modernize legacy data warehouses into high-throughput,
          cost-efficient Delta Lakehouses, real-time Kafka streaming architectures, and enterprise AI feature stores.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
          >
            Schedule Architecture Evaluation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/resources/blog"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            Explore More Whitepapers
          </Link>
        </div>
      </div>
    </div>
  );
}
