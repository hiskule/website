import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../shared/config/routes';
import './PortalDashboard.css';

export default function PortalDashboard() {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'judge' && role !== 'team') {
      navigate(ROUTES.home);
    }
  }, [role, navigate]);

  if (role !== 'judge' && role !== 'team') return null;

  return (
    <div className="portal-dashboard-container">
      <h1 className="portal-dashboard-title">Portal Dashboard</h1>
      <p className="portal-dashboard-welcome">Welcome, {user?.name || user?.username}. Logged in as: {role.toUpperCase()}</p>
      
      {role === 'judge' && (
        <div className="portal-dashboard-view">
          <h2>Judge View</h2>
          {/* TODO: Add Schedule and Scoring components */}
        </div>
      )}
      
      {role === 'team' && (
        <div className="portal-dashboard-view">
          <h2>Team View</h2>
          {/* TODO: Add Presentation link and Feedback components */}
        </div>
      )}
    </div>
  );
}
