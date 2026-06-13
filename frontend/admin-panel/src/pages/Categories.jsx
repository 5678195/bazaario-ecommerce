import { useEffect, useState } from 'react';
import { productsApi } from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = () => {
    productsApi.get('/categories')
      .then(res => setCategories(res.data.categories))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setLoading(true);
    try {
      await productsApi.post('/categories', { name });
      setName('');
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await productsApi.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#F7F5F0]">
        <h1 className="text-2xl font-bold text-[#1B1F3B] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Categories
        </h1>

        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 max-w-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1B1F3B] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#2a2f55] transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between px-6 py-3">
              <span className="text-[#1B1F3B] font-medium">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="px-6 py-4 text-gray-500 text-sm">No categories yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}