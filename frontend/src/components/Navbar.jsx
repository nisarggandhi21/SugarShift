import AccountMenu from './AccountMenu'
import ThemeToggle from './ThemeToggle'

const TABS = [
  { key: 'shop', label: 'Shop' },
  { key: 'redeem', label: 'Redeem' },
  { key: 'orders', label: 'My orders' },
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
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-8 border-b-2 border-line bg-surface px-8 py-4">
      <div className="flex items-center gap-2.5">
        <span className="h-[22px] w-[22px] flex-shrink-0 rounded-full border-2 border-line bg-accent" />
        <span className="font-display text-2xl uppercase tracking-wide">SugarShift</span>
      </div>

      <nav className="flex flex-1 gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onNavigate(tab.key)}
            className={
              view === tab.key
                ? 'rounded-md border-2 border-line bg-yellow px-3 py-1.5 text-sm font-bold text-ink'
                : 'rounded-md px-3.5 py-2 text-sm font-bold text-ink-muted transition hover:bg-cream hover:text-ink'
            }
          >
            {tab.label}
          </button>
        ))}
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
