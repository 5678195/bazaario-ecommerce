import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-square bg-[#F7F5F0] flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-300 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <span className="text-xs uppercase tracking-wide text-[#FF8C42] font-semibold">
            {product.category_name}
          </span>
        )}
        <h3 className="font-semibold text-[#1B1F3B] mt-1 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-lg text-[#1B1F3B]">{formattedPrice}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
          className={`mt-3 w-full py-2 rounded-md font-semibold text-sm transition-colors ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-[#1B1F3B] text-white hover:bg-[#2a2f55]'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? 'Added ✓' : product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}