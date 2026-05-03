import { useState, useEffect, createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);
const SERVER_URL = 'http://localhost:3000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
        
        const newSocket = io(SERVER_URL);
        newSocket.on('connect', () => {
          const userData = JSON.parse(stored);
          newSocket.emit('join', userData.id);
        });
        newSocket.on('notice', (notice) => {
          alert(notice.message);
        });
        setSocket(newSocket);
        
        return () => newSocket.disconnect();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (socket) socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, socket, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });
}