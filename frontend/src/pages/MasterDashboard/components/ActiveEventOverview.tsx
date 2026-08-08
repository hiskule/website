import React, { useEffect, useState } from 'react';
import { RoomCard } from './RoomCard';
import { Leaderboard } from './Leaderboard';
import { request } from '../../../shared/api/http';
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

  useEffect(() => {
    fetchRooms();
    setFeedbackReleased(!!competition.feedbackReleased);
  }, [competition.id, competition.feedbackReleased]);

  const fetchRooms = async () => {
    try {
      const data = await request<any[]>(`/rooms?competitionId=${competition.id}`);
      setRooms(data);
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
      await request('/competitions/deactivate-all', {
        method: 'POST'
      });
      onDeactivate();
    } catch (err) {
      console.error('Error deactivating:', err);
    }
  };

  const handleToggleFeedback = async () => {
    try {
      const data = await request<any>(`/competitions/${competition.id}/release-feedback`, {
        method: 'PUT',
        body: JSON.stringify({ feedbackReleased: !feedbackReleased })
      });
      setFeedbackReleased(data.feedbackReleased);
    } catch (err) {
      console.error('Error toggling feedback release:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('hiskule_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/leaderboard/export?competitionId=${competition.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to export CSV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cd = res.headers.get('Content-Disposition');
      let filename = "results.csv";
      if (cd && cd.includes('filename="')) {
        filename = cd.split('filename="')[1].split('"')[0];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export results.");
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
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              onClick={handleExportCSV}
              className="ae-export-btn"
            >
              Export Results to CSV
            </button>
            <button className="ae-deactivate-btn" onClick={handleDeactivate}>
              Deactivate Event
            </button>
          </div>
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
            <RoomCard 
              key={room.id} 
              room={room} 
              allRooms={rooms} 
              onUpdate={fetchRooms}
              competitionId={competition.id}
            />
          ))}
          {rooms.length === 0 && (
            <p style={{ color: 'var(--color-on-surface-variant)', padding: '1rem' }}>No rooms configured for this event.</p>
          )}
        </div>
      )}
    </div>
  );
};
