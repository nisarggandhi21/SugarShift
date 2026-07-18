import { useEffect, useState } from 'react'
import { getCommunityCategories, getCommunityPosts, createCommunityPost } from '../api'
import CommunityPostCard from './CommunityPostCard'

function Community({ user, onRequireAuth, onNotify }) {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ category: '', title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getCommunityCategories().then((cats) => {
      setCategories(cats)
      setForm((f) => ({ ...f, category: cats[0] }))
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    getCommunityPosts(activeCategory === 'All' ? undefined : activeCategory)
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [activeCategory])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      onRequireAuth()
      return
    }

    setSubmitting(true)
    try {
      const post = await createCommunityPost(form)
      if (activeCategory === 'All' || activeCategory === post.category) {
        setPosts((p) => [post, ...p])
      }
      setForm((f) => ({ ...f, title: '', body: '' }))
      onNotify('Post shared with the community', 'success')
    } catch (err) {
      onNotify(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Community</h1>
        <p className="card-subtitle">Share feedback, ask questions, and see what other SUGAR fans think.</p>
      </div>

      <div className="card mb-7">
        <span className="mb-3 block text-[11px] font-extrabold tracking-wide text-ink-muted uppercase">
          Share your feedback
        </span>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rounded-lg border-2 border-line bg-cream px-3 py-2.5 text-[13.5px] font-bold text-ink focus:border-accent focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your post a title"
              required
              className="rounded-lg border-2 border-line bg-cream px-3 py-2.5 text-[13.5px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
          </div>
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder={user ? "What's on your mind?" : 'Sign in to post'}
            required
            rows={3}
            disabled={!user}
            className="resize-none rounded-lg border-2 border-line bg-cream px-3 py-2.5 text-[13.5px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-accent self-start disabled:cursor-default disabled:opacity-60"
          >
            {submitting ? 'Posting…' : user ? 'Post to community' : 'Sign in to post'}
          </button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCategory(c)}
            className={`rounded-full border-2 border-line px-4 py-2 text-[13px] font-bold transition hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-sm ${
              c === activeCategory ? 'bg-accent text-accent-ink' : 'bg-surface text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center font-semibold text-ink-muted">Loading posts…</p>
      ) : posts.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">
          <p>No posts yet in this category — be the first to share.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} user={user} onRequireAuth={onRequireAuth} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Community
