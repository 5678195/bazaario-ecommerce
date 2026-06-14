import { useEffect, useState } from 'react';
import { productsApi, IMAGE_BASE_URL } from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = () => {
    productsApi.get('/products?limit=100')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
    productsApi.get('/categories')
      .then(res => setCategories(res.data.categories))
      .catch(err => console.error(err));
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setError('');
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
    });
    setImagePreview(product.image_url ? `${IMAGE_BASE_URL}${product.image_url}` : '');
    setImageFile(null);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let image_url = form.image_url;

      // Upload image first if a new file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await productsApi.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        image_url = uploadRes.data.url;
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        image_url,
      };

      if (editingId) {
        await productsApi.put(`/products/${editingId}`, payload);
      } else {
        await productsApi.post('/products', payload);
      }

      setShowForm(false);
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.map(e => e.message).join(', ') || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(`/products/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-[#F7F5F0]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1B1F3B]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Products
          </h1>
          <button
            onClick={openAddForm}
            className="bg-[#FF8C42] text-[#1B1F3B] px-5 py-2 rounded-md font-semibold hover:bg-orange-400 transition-colors"
          >
            + Add Product
          </button>
        </div>

        {/* Product list table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-[#F7F5F0] rounded-md overflow-hidden flex items-center justify-center">
                      {p.image_url ? (
                        <img src={`${IMAGE_BASE_URL}${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1B1F3B]">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category_name || '—'}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEditForm(p)} className="text-blue-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="px-6 py-4 text-gray-500 text-sm">No products yet.</p>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>

              {error && <p className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description} rows={3}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                    <input
                      type="number" required min="0" step="0.01" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number" min="0" value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                  >
                    <option value="">No category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md mb-2 border border-gray-200" />
                  )}
                  <input
                    type="file" accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={saving}
                    className="flex-1 bg-[#1B1F3B] text-white py-2.5 rounded-md font-semibold hover:bg-[#2a2f55] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
