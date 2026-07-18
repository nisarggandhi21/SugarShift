import { useEffect, useState } from 'react'
import { submitInvoiceClaim, getMyInvoiceClaims } from '../api'

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const dateLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_CLASSES = {
  approved: 'bg-status-good/15 text-status-good',
  pending: 'bg-yellow/40 text-ink',
  rejected: 'bg-status-critical/15 text-status-critical',
}

const RETAILERS = ['Amazon', 'Flipkart', 'DMart', 'SUGAR Shop', 'Other']

function InvoiceClaim({ user, onLoyaltyUpdate, onNotify }) {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ retailer: 'Amazon', invoiceNumber: '', amount: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getMyInvoiceClaims()
      .then(setClaims)
      .finally(() => setLoading(false))
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      onNotify('Sign in to claim points from an invoice')
      return
    }
    if (!file) {
      onNotify('Attach your invoice image or PDF', 'error')
      return
    }

    const body = new FormData()
    body.append('retailer', form.retailer)
    body.append('invoiceNumber', form.invoiceNumber)
    body.append('amount', form.amount)
    body.append('invoice', file)

    setSubmitting(true)
    try {
      const { claim, loyalty } = await submitInvoiceClaim(body)
      onLoyaltyUpdate(loyalty)
      setClaims((c) => [claim, ...c])
      onNotify(`Claim approved — +${claim.pointsClaimed} pts`, 'success')
      setForm({ retailer: 'Amazon', invoiceNumber: '', amount: '' })
      setFile(null)
      e.target.reset()
    } catch (err) {
      onNotify(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 p-8">
      <div className="mb-6 text-left">
        <h1 className="text-[44px] leading-none">Claim points from an invoice</h1>
        <p className="card-subtitle">
          Bought SUGAR on Amazon, Flipkart, DMart, or anywhere else? Upload your invoice to claim
          points at the same rate as a direct purchase.
        </p>
      </div>

      <div className="card mb-7">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
            Retailer
            <select
              name="retailer"
              value={form.retailer}
              onChange={handleChange}
              className="rounded-lg border-2 border-line bg-cream px-3 py-2.5 text-[13.5px] font-normal text-ink focus:border-accent focus:outline-none"
            >
              {RETAILERS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
            Invoice number (optional)
            <input
              name="invoiceNumber"
              value={form.invoiceNumber}
              onChange={handleChange}
              placeholder="e.g. AMZ-123456"
              className="rounded-lg border-2 border-line bg-cream px-3 py-2.5 text-[13.5px] font-normal text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
            Invoice amount (₹)
            <input
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              value={form.amount}
              onChange={handleChange}
              placeholder="1499"
              className="rounded-lg border-2 border-line bg-cream px-3 py-2.5 text-[13.5px] font-normal text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
            Invoice file (JPG, PNG, WEBP, or PDF)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-lg border-2 border-line bg-cream px-3 py-2 text-[13px] font-normal text-ink file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-accent-ink"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-accent sm:col-span-2 disabled:cursor-default disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit claim'}
          </button>
        </form>
      </div>

      {user && (
        <>
          <h2 className="mb-3 text-2xl">Your claims</h2>
          {loading ? (
            <p className="py-6 text-center font-semibold text-ink-muted">Loading…</p>
          ) : claims.length === 0 ? (
            <div className="card p-8 text-center text-ink-muted">
              <p>No claims yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {claims.map((c) => (
                <div className="card flex flex-wrap items-center justify-between gap-3 p-3.5 px-[18px]" key={c.id}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold">
                      {c.retailer}
                      {c.invoiceNumber ? ` · ${c.invoiceNumber}` : ''}
                    </span>
                    <span className="card-subtitle">
                      {money(c.amount)} · {dateLabel(c.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase ${STATUS_CLASSES[c.status]}`}
                    >
                      {c.status}
                    </span>
                    <span className="text-xs font-bold text-accent-deep">+{c.pointsClaimed} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default InvoiceClaim
