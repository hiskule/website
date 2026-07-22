import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../shared/config/routes';
import JudgeView from './components/JudgeView';
import TeamView from './components/TeamView';
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
      <div className="portal-header-section">
        <h1 className="portal-dashboard-title">Portal Dashboard</h1>
        <p className="portal-dashboard-welcome">
          Welcome, <strong>{user?.name || user?.username}</strong> 
          <span className="role-badge">{role.toUpperCase()}</span>
        </p>
      </div>
      
      {role === 'judge' && <JudgeView />}
      {role === 'team' && <TeamView />}
    </div>
  );
}
