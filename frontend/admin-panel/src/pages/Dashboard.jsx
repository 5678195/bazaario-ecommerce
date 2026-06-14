import { useEffect, useState } from 'react';
import { productsApi } from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    Promise.all([
      productsApi.get('/products?limit=1'),
      productsApi.get('/categories'),
    ]).then(([prodRes, catRes]) => {
      setStats({
        products: prodRes.data.pagination.total,
        categories: catRes.data.categories.length,
      });
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#F7F5F0]">
        <h1 className="text-2xl font-bold text-[#1B1F3B] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.products}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <p className="text-3xl font-bold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {stats.categories}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <p className="text-lg font-semibold text-green-600">? All systems operational</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#1B1F3B] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome to Bazaario Admin
          </h2>
          <p className="text-sm text-gray-500">
            Use the sidebar to manage products and categories. Products you add here will appear immediately on the storefront.
          </p>
        </div>
      </main>
    </div>
  );
}
