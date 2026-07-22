import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../shared/config/routes';
import './MasterDashboard.css';

export default function MasterDashboard() {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate(ROUTES.home);
    }
  }, [role, navigate]);

  if (role !== 'admin') return null;

  return (
    <div className="master-dashboard-container">
      <h1 className="master-dashboard-title">Master Dashboard</h1>
      <p className="master-dashboard-welcome">Welcome back, {user?.username}. Live event monitoring is active.</p>
      {/* TODO: Add Leaderboard and Room Overview components here */}
    </div>
  );
}
