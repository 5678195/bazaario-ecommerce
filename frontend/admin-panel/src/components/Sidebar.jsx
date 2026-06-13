import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/products', label: 'Products', icon: '📦' },
    { to: '/categories', label: 'Categories', icon: '🏷️' },
    { to: '/orders', label: 'Orders', icon: '🧾' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1B1F3B] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Bazaa<span className="text-[#FF8C42]">rio</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? 'bg-[#FF8C42] text-[#1B1F3B]'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-2">Logged in as</p>
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full bg-white/10 hover:bg-white/20 text-sm py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
