import { request } from '../../../shared/api/http'
import type { Judge, Scores, Team } from '../model/types'

interface PreviousScoresResponse {
  previousScores?: Partial<Scores>
}

interface SubmitScoresResponse {
  message?: string
}

export const judgingApi = {
  getJudges: () => request<Judge[]>('/judgeDropdown'),
  getRooms: () => request<string[]>('/rooms'),
  getTeams: (room: string) =>
    request<Team[]>(`/rooms/${encodeURIComponent(room)}/teams`),
  getScores: (judgeName: string, teamNumber: number) =>
    request<PreviousScoresResponse>(
      `/scores/${encodeURIComponent(judgeName)}/${teamNumber}`,
    ),
  submitScores: (payload: Scores & { judgeName: string; room: string; teamNumber: number }) =>
    request<SubmitScoresResponse>('/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
}
