import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ordersApi } from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const newOrder = location.state?.newOrder;

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);

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

  useEffect(() => {
    ordersApi.get('/orders/my-orders')
      .then(res => setOrders(res.data.orders))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#1B1F3B] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        My Orders
      </h1>

      {newOrder && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6">
          🎉 Order #{newOrder.id} placed successfully!
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <Link
            to="/products"
            className="bg-[#1B1F3B] text-white px-6 py-2.5 rounded-md font-semibold hover:bg-[#2a2f55] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-PK', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product_name} x {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-sm text-gray-500">Shipping to: {order.shipping_address}</span>
                <span className="font-bold text-[#1B1F3B]">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
