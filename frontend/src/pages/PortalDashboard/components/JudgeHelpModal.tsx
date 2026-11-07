import React, { useState } from 'react';
import './JudgeHelpModal.css';

interface HelpRequest {
  id: number;
  roomName: string;
  judgeName: string;
  status: string;
  message: string | null;
  createdAt: string;
}

interface JudgeHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  judgeName: string;
  activeRequest: HelpRequest | null;
  onSubmit: (message: string) => Promise<void>;
  onCancelRequest: () => Promise<void>;
  submitting: boolean;
}

const QUICK_REASONS = [
  'Tech / AV or Projector Issue',
  'Question on Rubric / Rules',
  'Team Delayed or Missing',
  'Mentor Missing in Room',
  'Other / Urgent Assistance'
];

export const JudgeHelpModal: React.FC<JudgeHelpModalProps> = ({
  isOpen,
  onClose,
  roomName,
  judgeName,
  activeRequest,
  onSubmit,
  onCancelRequest,
  submitting
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = [selectedReason, customMessage.trim()].filter(Boolean).join(' - ') || 'Judge requested assistance in room.';
    await onSubmit(finalMsg);
    setSelectedReason('');
    setCustomMessage('');
  };

  const handleQuickSelect = (reason: string) => {
    if (selectedReason === reason) {
      setSelectedReason('');
    } else {
      setSelectedReason(reason);
    }
  };

  return (
    <div className="judge-help-overlay" onClick={onClose}>
      <div className="judge-help-modal" onClick={e => e.stopPropagation()}>
        <div className="judge-help-header">
          <div className="judge-help-header-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="judge-help-sos-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>{activeRequest ? 'Help Request Active' : 'Request Admin Assistance'}</h3>
          </div>
          <button className="judge-help-close-btn" onClick={onClose}>&times;</button>
        </div>

        {activeRequest ? (
          <div className="judge-help-active-body">
            <div className="judge-help-active-alert">
              <span className="judge-help-pulse-dot"></span>
              <div>
                <strong>Help Alert Sent to Admin Dashboard!</strong>
                <p>An administrator has been notified that you need support in <strong>{roomName || 'your room'}</strong>.</p>
              </div>
            </div>

            <div className="judge-help-request-details">
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-val">{activeRequest.roomName || roomName || 'Unassigned'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Requested by:</span>
                <span className="detail-val">{judgeName}</span>
              </div>
              {activeRequest.message && (
                <div className="detail-row">
                  <span className="detail-label">Message:</span>
                  <span className="detail-val">{activeRequest.message}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-val status-pending">Pending Admin Response</span>
              </div>
            </div>

            <div className="judge-help-modal-actions">
              <button
                type="button"
                className="judge-help-cancel-req-btn"
                onClick={onCancelRequest}
                disabled={submitting}
              >
                {submitting ? 'Cancelling...' : 'Cancel Request (Problem Resolved)'}
              </button>
              <button
                type="button"
                className="judge-help-dismiss-btn"
                onClick={onClose}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="judge-help-form">
            <div className="judge-help-context-bar">
              <span>Notifying for: <strong>{roomName || 'Your Room'}</strong> ({judgeName})</span>
            </div>

            <div className="judge-help-field">
              <label className="judge-help-field-label">Quick Reason (optional):</label>
              <div className="judge-help-chips">
                {QUICK_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`judge-help-chip ${selectedReason === reason ? 'selected' : ''}`}
                    onClick={() => handleQuickSelect(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="judge-help-field">
              <label className="judge-help-field-label" htmlFor="helpNote">
                Additional Notes / Details:
              </label>
              <textarea
                id="helpNote"
                className="judge-help-textarea"
                rows={3}
                placeholder="e.g. Need help with room sound, or need a replacement score sheet..."
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
              />
            </div>

            <div className="judge-help-modal-actions">
              <button
                type="submit"
                className="judge-help-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'SENDING ALERT...' : '🚨 SEND HELP ALERT TO ADMIN'}
              </button>
              <button
                type="button"
                className="judge-help-dismiss-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
