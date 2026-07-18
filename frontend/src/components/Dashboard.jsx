import { stats } from '../mockData'
import StatTile from './StatTile'
import RevenueChart from './RevenueChart'
import TopProducts from './TopProducts'
import OrdersTable from './OrdersTable'
import './Dashboard.css'

function Dashboard({ user }) {
  return (
    <main className="dashboard">
      <div className="dashboard-intro">
        <h1>Overview</h1>
        <p className="card-subtitle">
          {user ? `Welcome back, ${user.name || user.email}.` : 'Store performance at a glance.'}
        </p>
      </div>

      <div className="dashboard-grid">
        {stats.map((s) => (
          <div className="grid-span-3" key={s.label}>
            <StatTile {...s} />
          </div>
        ))}

        <RevenueChart />
        <div className="grid-span-4">
          <TopProducts />
        </div>

        <div className="grid-span-12">
          <OrdersTable />
        </div>
      </div>
    </main>
  )
}

export default Dashboard
