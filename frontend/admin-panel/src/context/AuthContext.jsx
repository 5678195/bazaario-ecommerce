import { createContext, useContext, useState } from 'react';
import { api } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });

    if (data.user.role !== 'admin') {
      throw { response: { data: { error: 'Access denied: admin accounts only' } } };
    }

    localStorage.setItem('adminAccessToken', data.accessToken);
    localStorage.setItem('adminRefreshToken', data.refreshToken);
    localStorage.setItem('adminUser', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);