import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/axios';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);

  const handleOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await ordersApi.post('/orders', {
        items: cart.items,
        total: cart.total,
        shipping_address: address,
      });
      await clearCart();
      navigate('/orders', { state: { newOrder: data.order } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#1B1F3B] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Checkout
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Order Summary
        </h2>
        <div className="space-y-3">
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.product_name} x {item.quantity}</span>
              <span className="font-medium">{formatPrice(item.product_price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold text-[#1B1F3B]">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleOrder} className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Shipping Address
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <textarea
          required
          rows={4}
          placeholder="Enter your full shipping address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF8C42] text-[#1B1F3B] py-3 rounded-md font-semibold hover:bg-orange-400 transition-colors disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
