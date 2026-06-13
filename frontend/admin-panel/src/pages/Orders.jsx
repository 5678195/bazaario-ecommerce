import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const ORDERS_API = 'http://localhost:4004/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminAccessToken');

  const loadOrders = () => {
    fetch(`${ORDERS_API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    await fetch(`${ORDERS_API}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    loadOrders();
  };

  const statusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#F7F5F0]">
        <h1 className="text-2xl font-bold text-[#1B1F3B] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Orders
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      User ID: {order.user_id} — {new Date(order.created_at).toLocaleDateString('en-PK', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product_name} x {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between text-sm">
                  <span className="text-gray-500">Shipping to: {order.shipping_address}</span>
                  <span className="font-bold text-[#1B1F3B]">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
