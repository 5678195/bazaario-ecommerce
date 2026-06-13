import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#1B1F3B] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Bazaa<span className="text-[#FF8C42]">rio</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
          <Link to="/products" className="hover:text-[#FF8C42] transition-colors">Products</Link>

          {user && (
            <Link to="/cart" className="relative hover:text-[#FF8C42] transition-colors">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#FF8C42] text-[#1B1F3B] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <Link to="/orders" className="hover:text-[#FF8C42] transition-colors">My Orders</Link>
          )}

          {user ? (
            <>
              <span className="text-gray-300">Hi, {user.name.split(' ')[0]}</span>
              {user.role === 'admin' && (
                <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF8C42] transition-colors">Admin</a>
              )}
              <button
                onClick={handleLogout}
                className="bg-[#FF8C42] text-[#1B1F3B] px-4 py-1.5 rounded-md font-semibold hover:bg-orange-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#FF8C42] text-[#1B1F3B] px-4 py-1.5 rounded-md font-semibold hover:bg-orange-400 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
