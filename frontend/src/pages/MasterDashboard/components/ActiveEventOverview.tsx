import React, { useEffect, useState } from 'react';
import { RoomCard } from './RoomCard';
import { Leaderboard } from './Leaderboard';
import './ActiveEventOverview.css';

interface Competition {
  id: number;
  name: string;
  date: string;
  feedbackReleased?: boolean;
}

interface ActiveEventOverviewProps {
  competition: Competition;
  onDeactivate: () => void;
}

export const ActiveEventOverview: React.FC<ActiveEventOverviewProps> = ({ competition, onDeactivate }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackReleased, setFeedbackReleased] = useState(!!competition.feedbackReleased);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchRooms();
    setFeedbackReleased(!!competition.feedbackReleased);
  }, [competition.id, competition.feedbackReleased]);

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

  const handleToggleFeedback = async () => {
    try {
      const res = await fetch(`${API_URL}/competitions/${competition.id}/release-feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackReleased: !feedbackReleased })
      });
      if (res.ok) {
        const data = await res.json();
        setFeedbackReleased(data.feedbackReleased);
      }
    } catch (err) {
      console.error('Error toggling feedback release:', err);
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

      <div className="ae-section-title" style={{ marginTop: '32px' }}>
        <h3 className="text-headline-md">Global Controls</h3>
      </div>
      <section className="glass-card global-controls-section">
        <div>
          <h4 className="text-headline-sm global-controls-title">Release Feedback</h4>
          <p className="text-body-sm global-controls-desc">
            Allow teams to view their evaluation scores and judge feedback on their dashboard.
          </p>
        </div>
        <button 
          onClick={handleToggleFeedback}
          className={`global-controls-btn ${feedbackReleased ? 'released' : 'unreleased'}`}
        >
          {feedbackReleased ? 'Revoke Feedback' : 'Release Feedback'}
        </button>
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
