import { topProducts } from '../mockData'

function TopProducts() {
  return (
    <div className="card top-products-card">
      <h3>Top products</h3>
      <p className="card-subtitle">By revenue this period</p>

      <ul className="top-products-list">
        {topProducts.map((p) => (
          <li key={p.name}>
            <div className="top-product-row">
              <span className="top-product-name">{p.name}</span>
              <span className="top-product-units mono">{p.units} units</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${p.share * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopProducts
