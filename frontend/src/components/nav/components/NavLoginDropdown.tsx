import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role, type User } from '../../../context/AuthContext';
import { ROUTES } from '../../../shared/config/routes';
import './NavLoginDropdown.css';

interface NavLoginDropdownProps {
  onClose: () => void;
}

export default function NavLoginDropdown({ onClose }: NavLoginDropdownProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      login(data.role as Role, data.user as User);
      
      onClose();

      if (data.role === 'admin') {
        navigate(ROUTES.adminDashboard);
      } else if (data.role === 'judge' || data.role === 'team') {
        navigate(ROUTES.portal);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nav-login-dropdown" onClick={e => e.stopPropagation()}>
      <form className="nav-login-form" onSubmit={handleSubmit}>
        {error && <div className="nav-login-error">{error}</div>}
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="nav-login-input"
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="nav-login-input"
        />
        
        <button 
          type="submit" 
          className="nav-login-submit" 
          disabled={loading}
        >
          {loading ? '...' : 'LOGIN'}
        </button>
      </form>
    </div>
  );
}
