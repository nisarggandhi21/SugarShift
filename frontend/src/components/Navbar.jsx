import AccountMenu from './AccountMenu'
import './Navbar.css'

const TABS = ['Overview', 'Orders', 'Products', 'Customers']

function Navbar({ user, onAuthSuccess, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-word">SugarShift</span>
      </div>

      <nav className="navbar-tabs">
        {TABS.map((tab, i) => (
          <button key={tab} type="button" className={i === 0 ? 'is-active' : ''}>
            {tab}
          </button>
        ))}
      </nav>

      <div className="navbar-actions">
        <AccountMenu user={user} onAuthSuccess={onAuthSuccess} onLogout={onLogout} />
      </div>
    </header>
  )
}

export default Navbar
