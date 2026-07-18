import AccountMenu from './AccountMenu'
import ThemeToggle from './ThemeToggle'
import NavDropdown from './NavDropdown'

const LOYALTY_ITEMS = [
  { key: 'redeem', label: 'Redeem points' },
  { key: 'invoice-claim', label: 'Claim from invoice' },
  { key: 'referrals', label: 'Refer & earn' },
  { key: 'masterclass', label: 'Masterclass' },
  { key: 'tier-benefits', label: 'Tier benefits' },
]

const TIER_CHIP_CLASSES = {
  bronze: 'bg-tier-bronze/20',
  silver: 'bg-tier-silver/20',
  gold: 'bg-tier-gold/25',
  diamond: 'bg-tier-diamond/20',
}

function Navbar({
  user,
  view,
  onNavigate,
  onAuthSuccess,
  onLogout,
  menuOpen,
  onMenuOpenChange,
  theme,
  onThemeToggle,
  cartCount,
  onCartOpen,
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-8 border-b-2 border-line bg-surface px-8 py-4">
      <div className="flex items-center gap-2.5">
        <span className="h-[22px] w-[22px] flex-shrink-0 rounded-full border-2 border-line bg-accent" />
        <span className="font-display text-2xl uppercase tracking-wide">SugarShift</span>
      </div>

      <nav className="flex flex-1 items-center gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className={
            view === 'shop'
              ? 'shrink-0 rounded-md border-2 border-line bg-yellow px-3 py-1.5 text-sm font-bold text-ink'
              : 'shrink-0 rounded-md px-3.5 py-2 text-sm font-bold text-ink-muted transition hover:bg-cream hover:text-ink'
          }
        >
          Shop
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community')}
          className={
            view === 'community'
              ? 'shrink-0 rounded-md border-2 border-line bg-yellow px-3 py-1.5 text-sm font-bold text-ink'
              : 'shrink-0 rounded-md px-3.5 py-2 text-sm font-bold text-ink-muted transition hover:bg-cream hover:text-ink'
          }
        >
          Community
        </button>

        <NavDropdown label="Loyalty" items={LOYALTY_ITEMS} activeKey={view} onSelect={onNavigate} />

        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className={
            view === 'orders'
              ? 'shrink-0 rounded-md border-2 border-line bg-yellow px-3 py-1.5 text-sm font-bold text-ink'
              : 'shrink-0 rounded-md px-3.5 py-2 text-sm font-bold text-ink-muted transition hover:bg-cream hover:text-ink'
          }
        >
          My orders
        </button>
      </nav>

      <div className="flex items-center gap-3.5">
        {user && (
          <button
            type="button"
            onClick={() => onNavigate('redeem')}
            className={`hidden rounded-full border-2 border-line px-2.5 py-1 text-[11.5px] font-extrabold tracking-wide whitespace-nowrap transition hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-sm sm:inline ${
              TIER_CHIP_CLASSES[user.loyalty.tier.toLowerCase()]
            }`}
          >
            {user.loyalty.tier} · {user.loyalty.points.toLocaleString('en-IN')} pts
          </button>
        )}
        <button
          type="button"
          onClick={onCartOpen}
          aria-label="Open cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-surface text-ink transition hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M3 4h2l1.6 10.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L20.5 7H6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.5" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17.5" cy="20" r="1.4" fill="currentColor" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-line bg-accent px-1 text-[10px] font-extrabold text-accent-ink">
              {cartCount}
            </span>
          )}
        </button>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <AccountMenu
          user={user}
          onAuthSuccess={onAuthSuccess}
          onLogout={onLogout}
          open={menuOpen}
          onOpenChange={onMenuOpenChange}
        />
      </div>
    </header>
  )
}

export default Navbar
