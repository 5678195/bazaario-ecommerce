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
    { to: '/orders', label: 'Orders', icon: '📋' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-full md:w-64 bg-[#1B1F3B] text-white flex flex-row md:flex-col md:min-h-screen overflow-x-auto md:overflow-visible">
      <div className="p-4 md:p-6 border-b-0 md:border-b border-white/10 flex-shrink-0">
        <h1 className="font-bold text-lg md:text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Bazaa<span className="text-[#FF8C42]">rio</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1 hidden md:block">Admin Panel</p>
      </div>

      <nav className="flex flex-row md:flex-col md:flex-1 p-2 md:p-4 gap-1 md:space-y-1">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
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

      <div className="hidden md:block p-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-2">Logged in as</p>
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full bg-white/10 hover:bg-white/20 text-sm py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="md:hidden flex items-center px-3 py-2 my-2 mr-2 bg-white/10 rounded-md text-xs whitespace-nowrap"
      >
        Logout
      </button>
    </aside>
  );
}
