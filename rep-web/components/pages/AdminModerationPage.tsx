'use client';

/**
 * AdminModerationPage
 *
 * Simple story moderation queue. Requires MODERATION_SECRET set in env.
 * Access via REPWireframe page key 'admin-moderation'.
 * Not linked from public navigation.
 */

import React, { useState, useEffect, useCallback } from 'react';

interface Story {
  id: string;
  zip_code: string;
  role: string;
  condition: string | null;
  story_text: string;
  status: string;
  moderation_note: string | null;
  created_at: string;
  preview: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  flagged: '#dc2626',
  approved: '#16a34a',
  rejected: '#6b7280',
};

export const AdminModerationPage: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'flagged' | 'approved' | 'rejected'>('pending');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stories/moderate?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) { setAuthed(false); setError('Invalid secret.'); return; }
      const data = await res.json();
      if (data.success) {
        setStories(data.stories);
        setTotal(data.total);
      }
    } catch {
      setError('Failed to load queue.');
    } finally {
      setLoading(false);
    }
  }, [authed, secret, statusFilter]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const act = async (story_id: string, action: 'approve' | 'reject' | 'flag') => {
    setActing(story_id);
    try {
      const res = await fetch('/api/stories/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ story_id, action, note: note || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setStories(prev => prev.filter(s => s.id !== story_id));
        setTotal(prev => prev - 1);
        setNote('');
        setExpanded(null);
      }
    } catch {
      setError('Action failed.');
    } finally {
      setActing(null);
    }
  };

  const s: React.CSSProperties = { fontFamily: 'system-ui, sans-serif' };

  if (!authed) {
    return (
      <div style={{ ...s, paddingTop: 80, minHeight: '100vh', background: '#faf7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', border: '1px solid #e8e4df', borderRadius: 8, padding: 40, maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 8 }}>
            Admin Access
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 300, color: '#1a1a1a', marginBottom: 24 }}>
            Story Moderation
          </h2>
          <input
            type="password"
            placeholder="Moderation secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setAuthed(true)}
            style={{
              width: '100%', padding: '10px 12px', border: '1px solid #e8e4df',
              borderRadius: 4, fontSize: 14, marginBottom: 12, boxSizing: 'border-box',
            }}
          />
          <button
            onClick={() => setAuthed(true)}
            style={{
              width: '100%', padding: '10px 0', background: '#c45a3b', color: '#fff',
              border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600,
              letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Enter
          </button>
          {error && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s, paddingTop: 80, minHeight: '100vh', background: '#faf7f3' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c45a3b', marginBottom: 8 }}>
            Admin
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 300, color: '#1a1a1a', marginBottom: 4 }}>
            Story Moderation Queue
          </h1>
          <p style={{ fontSize: 13, color: '#888' }}>
            {total} {statusFilter} {total === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['pending', 'flagged', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 16px', borderRadius: 4, border: 'none', cursor: 'pointer',
                fontFamily: 'system-ui', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.5px', textTransform: 'uppercase',
                background: statusFilter === s ? STATUS_COLORS[s] : '#e8e4df',
                color: statusFilter === s ? '#fff' : '#666',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {loading && <p style={{ color: '#888', fontSize: 14 }}>Loading…</p>}

        {!loading && stories.length === 0 && (
          <div style={{ padding: '48px 32px', textAlign: 'center', background: '#fff', borderRadius: 8, border: '1px dashed #d0c8c0' }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#888' }}>
              No {statusFilter} stories.
            </p>
          </div>
        )}

        {/* Story cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stories.map(story => (
            <div key={story.id} style={{
              background: '#fff', border: '1px solid #e8e4df',
              borderLeft: `4px solid ${STATUS_COLORS[story.status] ?? '#888'}`,
              borderRadius: '0 8px 8px 0', padding: '20px 24px',
            }}>
              {/* Meta row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ padding: '2px 8px', background: '#f0f0f0', borderRadius: 3, fontSize: 11, fontWeight: 600, color: '#444' }}>
                    ZIP {story.zip_code}
                  </span>
                  <span style={{ padding: '2px 8px', background: '#f0f0f0', borderRadius: 3, fontSize: 11, color: '#666', textTransform: 'capitalize' }}>
                    {story.role}
                  </span>
                  {story.condition && (
                    <span style={{ padding: '2px 8px', background: '#c45a3b', borderRadius: 3, fontSize: 11, color: '#fff' }}>
                      {story.condition}
                    </span>
                  )}
                  <span style={{ padding: '2px 8px', background: STATUS_COLORS[story.status], borderRadius: 3, fontSize: 11, color: '#fff', fontWeight: 600 }}>
                    {story.status}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#aaa' }}>
                  {new Date(story.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Preview / full text */}
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#444', lineHeight: 1.7, margin: '0 0 12px' }}>
                {expanded === story.id ? story.story_text : story.preview + (story.story_text.length > 200 ? '…' : '')}
              </p>
              <button
                onClick={() => setExpanded(expanded === story.id ? null : story.id)}
                style={{ background: 'none', border: 'none', color: '#c45a3b', fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: 16 }}
              >
                {expanded === story.id ? '▲ Collapse' : '▼ Read full story'}
              </button>

              {/* Actions */}
              {statusFilter !== 'approved' && statusFilter !== 'rejected' && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => act(story.id, 'approve')}
                    disabled={acting === story.id}
                    style={{
                      padding: '6px 16px', background: '#16a34a', color: '#fff',
                      border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', opacity: acting === story.id ? 0.6 : 1,
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => act(story.id, 'reject')}
                    disabled={acting === story.id}
                    style={{
                      padding: '6px 16px', background: '#6b7280', color: '#fff',
                      border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', opacity: acting === story.id ? 0.6 : 1,
                    }}
                  >
                    ✕ Reject
                  </button>
                  <button
                    onClick={() => act(story.id, 'flag')}
                    disabled={acting === story.id}
                    style={{
                      padding: '6px 16px', background: '#dc2626', color: '#fff',
                      border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', opacity: acting === story.id ? 0.6 : 1,
                    }}
                  >
                    ⚑ Flag
                  </button>
                  <input
                    type="text"
                    placeholder="Optional note…"
                    value={expanded === story.id ? note : ''}
                    onChange={e => setNote(e.target.value)}
                    onFocus={() => setExpanded(story.id)}
                    style={{
                      padding: '6px 10px', border: '1px solid #e8e4df', borderRadius: 4,
                      fontSize: 12, flex: 1, minWidth: 120,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
