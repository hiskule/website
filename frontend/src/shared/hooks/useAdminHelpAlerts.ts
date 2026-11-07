import { useEffect, useState, useCallback, useRef } from 'react';
import { request } from '../api/http';

export interface HelpRequest {
  id: number;
  competitionId: number | null;
  judgeId: number | null;
  judgeName: string;
  roomId: number | null;
  roomName: string;
  status: 'pending' | 'resolved' | 'cancelled';
  message: string | null;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface UseAdminHelpAlertsResult {
  helpRequests: HelpRequest[];
  unresolvedCount: number;
  loading: boolean;
  error: string | null;
  hasNewAlert: boolean;
  resolveHelpRequest: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAdminHelpAlerts(competitionId?: number | string | null): UseAdminHelpAlertsResult {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNewAlert, setHasNewAlert] = useState<boolean>(false);
  const prevCountRef = useRef<number>(0);

  const fetchHelpRequests = useCallback(async () => {
    try {
      const query = competitionId ? `?competitionId=${competitionId}&status=pending` : '?status=pending';
      const data = await request<{ requests: HelpRequest[] }>(`/help-requests${query}`);
      const list = data?.requests || [];
      
      // If count increased, trigger new alert notification
      if (list.length > prevCountRef.current && prevCountRef.current !== 0) {
        setHasNewAlert(true);
        // Play gentle notification beep if supported
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch {
          // Audio autoplay restrictions or not supported
        }
      }
      prevCountRef.current = list.length;
      setHelpRequests(list);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch help requests');
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  const resolveHelpRequest = useCallback(async (id: number) => {
    // Optimistic removal for instant UI feedback
    setHelpRequests(prev => prev.filter(r => r.id !== id));
    prevCountRef.current = Math.max(0, prevCountRef.current - 1);
    try {
      await request(`/help-requests/${id}/resolve`, {
        method: 'PUT'
      });
      fetchHelpRequests();
    } catch (err: any) {
      console.error('Failed to resolve help request:', err);
      fetchHelpRequests();
    }
  }, [fetchHelpRequests]);

  useEffect(() => {
    fetchHelpRequests();

    // Fast polling every 3.5 seconds so admin dashboard stays dynamically updated without reload
    const interval = setInterval(fetchHelpRequests, 3500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchHelpRequests();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchHelpRequests]);

  return {
    helpRequests,
    unresolvedCount: helpRequests.length,
    loading,
    error,
    hasNewAlert,
    resolveHelpRequest,
    refresh: fetchHelpRequests
  };
}
