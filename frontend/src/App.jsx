import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Shop from './components/Shop'
import Redeem from './components/Redeem'
import InvoiceClaim from './components/InvoiceClaim'
import Referrals from './components/Referrals'
import Masterclass from './components/Masterclass'
import OrdersHistory from './components/OrdersHistory'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import { getMe, checkoutCart } from './api'
import { getInitialTheme, applyTheme } from './theme'
import { getInitialCart, saveCart } from './cart'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('shop')
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useState(getInitialTheme)
  const [cart, setCart] = useState(getInitialCart)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    getMe()
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  const notify = (message, tone = 'default') => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

  const handleLoyaltyUpdate = (loyalty) => {
    setUser((u) => (u ? { ...u, loyalty } : u))
  }

  const handleAddToCart = (product) => {
    setCart((c) => {
      const existing = c.find((i) => i.productId === product.id)
      if (existing) {
        return c.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...c,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image_url,
          quantity: 1,
        },
      ]
    })
    notify(`Added to cart: ${product.name}`, 'success')
  }

  const handleUpdateQty = (productId, quantity) => {
    setCart((c) =>
      quantity <= 0
        ? c.filter((i) => i.productId !== productId)
        : c.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }

  const handleRemove = (productId) => {
    setCart((c) => c.filter((i) => i.productId !== productId))
  }

  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false)
      setMenuOpen(true)
      notify('Sign in to check out')
      return
    }

    setCheckingOut(true)
    try {
      const { orders, loyalty } = await checkoutCart(
        cart.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      )
      handleLoyaltyUpdate(loyalty)
      const totalPoints = orders.reduce((sum, o) => sum + o.pointsEarned, 0)
      setCart([])
      setCartOpen(false)
      notify(`Order placed — +${totalPoints} pts earned`, 'success')
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) return null

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      <Navbar
        user={user}
        view={view}
        onNavigate={setView}
        onAuthSuccess={setUser}
        onLogout={() => setUser(null)}
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
      />

      {view === 'shop' && <Shop user={user} onAddToCart={handleAddToCart} />}
      {view === 'redeem' && (
        <Redeem user={user} onLoyaltyUpdate={handleLoyaltyUpdate} onNotify={notify} />
      )}
      {view === 'invoice-claim' && (
        <InvoiceClaim user={user} onLoyaltyUpdate={handleLoyaltyUpdate} onNotify={notify} />
      )}
      {view === 'referrals' && <Referrals user={user} onNotify={notify} />}
      {view === 'masterclass' && <Masterclass user={user} onNotify={notify} />}
      {view === 'orders' && <OrdersHistory user={user} />}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
        checkingOut={checkingOut}
        user={user}
      />

      <Toast message={toast?.message} tone={toast?.tone} />
    </>
  )
}

export default App
