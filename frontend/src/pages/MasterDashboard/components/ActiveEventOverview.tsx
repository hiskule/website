import React, { useEffect, useState } from 'react';
import { RoomCard } from './RoomCard';
import { Leaderboard } from './Leaderboard';
import './ActiveEventOverview.css';

interface Competition {
  id: number;
  name: string;
  date: string;
}

interface ActiveEventOverviewProps {
  competition: Competition;
  onDeactivate: () => void;
}

export const ActiveEventOverview: React.FC<ActiveEventOverviewProps> = ({ competition, onDeactivate }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchRooms();
  }, [competition.id]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/rooms?competitionId=${competition.id}`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    const isConfirmed = window.confirm("ARE YOU SURE, THIS WILL DISABLE ALL LOGINS");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/competitions/deactivate-all`, {
        method: 'POST'
      });
      if (res.ok) {
        onDeactivate();
      }
    } catch (err) {
      console.error('Error deactivating:', err);
    }
  };

  return (
    <div className="active-event-overview">
      <section className="glass-card ae-card">
        <div className="ae-header-row">
          <div className="ae-info-col">
            <div className="ae-badge-row">
              <span className="ae-pulse-container">
                <span className="status-pulse ae-pulse-bg"></span>
                <span className="ae-pulse-dot"></span>
              </span>
              <span className="ae-badge-text">LIVE NOW</span>
            </div>
            <h2 className="text-headline-lg ae-title">{competition.name}</h2>
            <p className="text-label-sm ae-date">Competition Date: {competition.date}</p>
          </div>
          <button className="ae-deactivate-btn" onClick={handleDeactivate}>
            Deactivate Event
          </button>
        </div>
      </section>

      <Leaderboard competitionId={competition.id} />

      <div className="ae-section-title">
        <h3 className="text-headline-md">Room Overview</h3>
      </div>
      {loading ? (
        <div style={{ color: 'var(--color-ink-black)', padding: '1rem' }}>Loading rooms...</div>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
          {rooms.length === 0 && (
            <p style={{ color: 'var(--color-on-surface-variant)', padding: '1rem' }}>No rooms configured for this event.</p>
          )}
        </div>
      )}
    </div>
  );
};
