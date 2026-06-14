import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsApi.get('/products?limit=4')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B1F3B] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-start">
          <span className="text-[#FF8C42] font-semibold uppercase tracking-widest text-sm mb-3">
            New season, new tech
          </span>
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything you need, <span className="text-[#FF8C42]">delivered</span> to your door.
          </h1>
          <p className="text-gray-300 mt-4 max-w-lg">
            Browse the latest electronics, gadgets, and everyday essentials — all in one place.
          </p>
          <Link
            to="/products"
            className="mt-8 bg-[#FF8C42] text-[#1B1F3B] px-6 py-3 rounded-md font-semibold hover:bg-orange-400 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Featured Products
          </h2>
          <Link to="/products" className="text-[#FF8C42] font-medium hover:underline">
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}