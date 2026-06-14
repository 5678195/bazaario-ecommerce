import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#1B1F3B] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-6">Looks like you have not added anything yet.</p>
        <Link
          to="/products"
          className="bg-[#1B1F3B] text-white px-6 py-2.5 rounded-md font-semibold hover:bg-[#2a2f55] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#1B1F3B] mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Your Cart
      </h1>

      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white border border-gray-200 rounded-lg p-4">
            <div className="w-20 h-20 bg-[#F7F5F0] rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-300 text-xs">No image</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {item.product_name}
              </h3>
              <p className="text-sm text-gray-500">{formatPrice(item.product_price)} each</p>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>

            <div className="w-full sm:w-24 text-left sm:text-right font-semibold text-[#1B1F3B]">
              {formatPrice(item.product_price * item.quantity)}
            </div>

            <button
              onClick={() => removeFromCart(item.product_id)}
              className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <button
          onClick={clearCart}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear cart
        </button>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {formatPrice(cart.total)}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        disabled={loading}
        className="mt-6 w-full bg-[#FF8C42] text-[#1B1F3B] py-3 rounded-md font-semibold hover:bg-orange-400 transition-colors disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
