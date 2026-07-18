import { useState } from 'react'
import { toggleCommunityLike, getCommunityComments, createCommunityComment } from '../api'

const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

function CommunityPostCard({ post, user, onRequireAuth }) {
  const [liked, setLiked] = useState(!!post.likedByViewer)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [commentCount, setCommentCount] = useState(post.commentCount)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(null)
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentDraft, setCommentDraft] = useState('')
  const [posting, setPosting] = useState(false)

  const handleLike = async () => {
    if (!user) {
      onRequireAuth()
      return
    }
    setLiked((l) => !l)
    setLikeCount((c) => (liked ? c - 1 : c + 1))
    try {
      const { liked: nowLiked, likeCount: serverCount } = await toggleCommunityLike(post.id)
      setLiked(nowLiked)
      setLikeCount(serverCount)
    } catch {
      setLiked((l) => !l)
      setLikeCount((c) => (liked ? c + 1 : c - 1))
    }
  }

  const handleToggleComments = async () => {
    setShowComments((s) => !s)
    if (!comments) {
      setLoadingComments(true)
      try {
        setComments(await getCommunityComments(post.id))
      } finally {
        setLoadingComments(false)
      }
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      onRequireAuth()
      return
    }
    if (!commentDraft.trim()) return

    setPosting(true)
    try {
      const comment = await createCommunityComment(post.id, commentDraft.trim())
      setComments((c) => [...(c || []), comment])
      setCommentCount((n) => n + 1)
      setCommentDraft('')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="card">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border-2 border-line bg-yellow px-2.5 py-0.5 text-[10.5px] font-extrabold tracking-wide uppercase">
          {post.category}
        </span>
        <span className="card-subtitle">
          {post.author} · {dateLabel(post.createdAt)}
        </span>
      </div>

      <h3 className="font-sans text-base font-bold normal-case">{post.title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{post.body}</p>

      <div className="mt-4 flex items-center gap-4 border-t-2 border-dashed border-line pt-3">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[13px] font-bold transition ${
            liked ? 'text-accent' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} className="h-4 w-4" aria-hidden="true">
            <path
              d="M12 21s-7.5-4.6-10-9.3C.6 8.7 2 5 5.6 5c2 0 3.4 1.1 4.4 2.4C11 6.1 12.4 5 14.4 5 18 5 19.4 8.7 22 11.7 19.5 16.4 12 21 12 21z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          {likeCount}
        </button>
        <button
          type="button"
          onClick={handleToggleComments}
          className="text-[13px] font-bold text-ink-muted transition hover:text-ink"
        >
          {commentCount} comment{commentCount === 1 ? '' : 's'}
        </button>
      </div>

      {showComments && (
        <div className="mt-3 flex flex-col gap-2.5 border-t-2 border-dashed border-line pt-3">
          {loadingComments ? (
            <p className="text-[12.5px] text-ink-muted">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-[12.5px] text-ink-muted">No comments yet — be the first to reply.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-lg bg-cream px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] font-bold">{c.author}</span>
                  <span className="card-subtitle">{dateLabel(c.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-ink-muted">{c.body}</p>
              </div>
            ))
          )}

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              placeholder={user ? 'Add a comment…' : 'Sign in to comment'}
              disabled={!user}
              className="flex-1 rounded-lg border-2 border-line bg-cream px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={posting || !user}
              className="btn btn-accent disabled:cursor-default disabled:opacity-60"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default CommunityPostCard
