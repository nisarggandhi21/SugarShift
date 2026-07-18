import { recentOrders } from '../mockData'

const STATUS_STYLE = {
  Delivered: 'good',
  Processing: 'warning',
  Refunded: 'serious',
  Cancelled: 'critical',
}

const money = (n) => `$${n.toFixed(2)}`

function OrdersTable() {
  return (
    <div className="card orders-card">
      <div className="card-header-row">
        <div>
          <h3>Recent orders</h3>
          <p className="card-subtitle">Latest checkouts across all channels</p>
        </div>
      </div>

      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th className="num">Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.id}</td>
                <td>{o.customer}</td>
                <td className="muted">{o.product}</td>
                <td>
                  <span className={`status-pill status-${STATUS_STYLE[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="num mono">{money(o.amount)}</td>
                <td className="muted mono">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTable
