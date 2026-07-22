import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../shared/config/routes';
import { ActiveEventOverview } from './components/ActiveEventOverview';
import { InactiveEventsSlider } from './components/InactiveEventsSlider';
import './MasterDashboard.css';

interface Competition {
  id: number;
  name: string;
  date: string;
  isActive: boolean;
}

export default function MasterDashboard() {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'admin') {
      navigate(ROUTES.home);
    }
  }, [role, navigate]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (role === 'admin') {
      fetchCompetitions();
    }
  }, [role]);

  const fetchCompetitions = async () => {
    try {
      const res = await fetch(`${API_URL}/competitions`);
      if (res.ok) {
        const data = await res.json();
        setCompetitions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'admin') return null;

  const activeEvent = competitions.find(c => c.isActive);
  const inactiveEvents = competitions.filter(c => !c.isActive);

  return (
    <div className="master-dashboard-container">
      <div className="hero-header">
        <header className="hero-header-content">
          <div className="hero-header-text">
            <h1 className="text-display-lg">Master Dashboard</h1>
            <p className="text-body-lg hero-subtitle">
              Welcome back, <strong>{user?.name || user?.username}</strong>. Live event monitoring is active.
            </p>
          </div>
        </header>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.7)', marginTop: '2rem' }}>Loading events...</div>
      ) : (
        <div className="master-content-wrapper">
          {activeEvent ? (
            <ActiveEventOverview 
              competition={activeEvent} 
              onDeactivate={fetchCompetitions} 
            />
          ) : (
            <div className="no-active-event">
              <h2>No Active Event</h2>
              <p>Please select an event below to activate it for live monitoring.</p>
            </div>
          )}

          <InactiveEventsSlider 
            competitions={inactiveEvents} 
            onActivate={fetchCompetitions} 
          />
        </div>
      )}
    </div>
  );
}
