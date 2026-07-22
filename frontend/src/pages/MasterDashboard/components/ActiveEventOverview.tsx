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
      <div className="active-event-header">
        <div className="active-event-info">
          <span className="active-badge">Live Now</span>
          <h2 className="active-event-name">{competition.name}</h2>
          <span className="active-event-date">{competition.date}</span>
        </div>
        <button className="deactivate-btn" onClick={handleDeactivate}>
          Deactivate Event
        </button>
      </div>

      <Leaderboard competitionId={competition.id} />

      <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Room Overview</h3>
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.7)' }}>Loading rooms...</div>
      ) : (
        <div className="rooms-grid">
          {rooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
          {rooms.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>No rooms configured for this event.</p>
          )}
        </div>
      )}
    </div>
  );
};
