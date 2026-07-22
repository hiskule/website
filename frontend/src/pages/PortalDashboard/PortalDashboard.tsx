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

      
      {role === 'judge' && <JudgeView />}
      {role === 'team' && <TeamView />}
    </div>
  );
}
