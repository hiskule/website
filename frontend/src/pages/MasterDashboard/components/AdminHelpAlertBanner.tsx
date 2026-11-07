import React, { useState, useRef, useLayoutEffect } from 'react';
import { useAdminHelpAlerts } from '../../../shared/hooks/useAdminHelpAlerts';
import './AdminHelpAlertBanner.css';

interface AdminHelpAlertBannerProps {
  competitionId?: number | string | null;
}

export const AdminHelpAlertBanner: React.FC<AdminHelpAlertBannerProps> = ({ competitionId }) => {
  const { helpRequests, unresolvedCount, resolveHelpRequest } = useAdminHelpAlerts(competitionId);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripHeight, setStripHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!stripRef.current || unresolvedCount === 0) {
      setStripHeight(0);
      return;
    }

    const updateHeight = () => {
      if (stripRef.current) {
        setStripHeight(stripRef.current.offsetHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(stripRef.current);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [unresolvedCount, helpRequests]);

  if (unresolvedCount === 0) return null;

  const handleResolve = async (id: number) => {
    setResolvingId(id);
    try {
      await resolveHelpRequest(id);
    } finally {
      setResolvingId(null);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins === 1) return '1 min ago';
      if (mins < 60) return `${mins} mins ago`;
      const hrs = Math.floor(mins / 60);
      return `${hrs}h ago`;
    } catch {
      return '';
    }
  };

  return (
    <>
      <div ref={stripRef} className="admin-help-top-strip">
      <div className="admin-help-top-inner">
        <aside className="admin-help-banner" aria-live="assertive" role="alert">
          <div className="admin-help-banner-header">
            <div className="admin-help-badge-group">
              <span className="admin-help-pulse-ring"></span>
              <span className="admin-help-dot"></span>
              <svg className="admin-help-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="admin-help-title">
                JUDGE ASSISTANCE REQUIRED ({unresolvedCount})
              </span>
            </div>
          </div>

          <div className="admin-help-items-list">
            {helpRequests.map((req) => (
              <div key={req.id} className="admin-help-item-card">
                <div className="admin-help-item-left">
                  <div className="admin-help-room-badge">
                    <span className="admin-help-room-tag">ROOM</span>
                    <span className="admin-help-room-title">{req.roomName || 'Unassigned'}</span>
                  </div>
                  <div className="admin-help-details">
                    <div className="admin-help-judge-row">
                      <span className="admin-help-judge-name">{req.judgeName || `Judge #${req.judgeId}`}</span>
                      <span className="admin-help-time">{formatTimeAgo(req.createdAt)}</span>
                    </div>
                    <p className="admin-help-message">
                      {req.message || 'Judge requested assistance in this room.'}
                    </p>
                  </div>
                </div>
                <div className="admin-help-item-actions">
                  <button
                    type="button"
                    className="admin-help-resolve-btn"
                    disabled={resolvingId === req.id}
                    onClick={() => handleResolve(req.id)}
                    title="Mark this request as handled"
                  >
                    {resolvingId === req.id ? 'Resolving...' : '✓ Resolve / Handled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
    <div
      className="admin-help-spacer"
      style={{ height: stripHeight > 0 ? `${stripHeight}px` : undefined }}
      aria-hidden="true"
    />
  </>
  );
};
