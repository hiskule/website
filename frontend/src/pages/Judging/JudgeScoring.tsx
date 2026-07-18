import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Select from 'react-select'
import './JudgeScoring.css'
import { judgingApi } from '../../features/judging/api/judgingApi'
import { EMPTY_SCORES } from '../../features/judging/model/types'
import type { Judge, Scores } from '../../features/judging/model/types'

type Option<T> = { value: T; label: string }

export default function JudgeScoringPage() {
  const [judges, setJudges] = useState<Judge[]>([])
  const [rooms, setRooms] = useState<string[]>([])
  const [teams, setTeams] = useState<Option<number>[]>([])
  const [judge, setJudge] = useState<Option<string> | null>(null)
  const [room, setRoom] = useState<Option<string> | null>(null)
  const [team, setTeam] = useState<Option<number> | null>(null)
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([judgingApi.getJudges(), judgingApi.getRooms()])
      .then(([judgeData, roomData]) => { setJudges(judgeData); setRooms(roomData) })
      .catch(() => setMessage('Unable to load judging data. Please try again.'))
  }, [])

  useEffect(() => {
    setTeam(null)
    setTeams([])
    if (!room) return
    judgingApi.getTeams(room.value)
      .then((data) => setTeams(data.map(({ team_number }) => ({ value: team_number, label: `Team ${team_number}` }))))
      .catch(() => setMessage('Unable to load teams for this room.'))
  }, [room])

  useEffect(() => {
    setScores(EMPTY_SCORES)
    if (!judge || !team) return
    judgingApi.getScores(judge.value, team.value)
      .then(({ previousScores }) => {
        setScores({ ...EMPTY_SCORES, ...previousScores })
        setMessage(previousScores ? 'Loaded previous scores.' : 'No previous scores found.')
      })
      .catch(() => setMessage('Unable to load previous scores.'))
  }, [judge, team])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!judge || !room || !team) return
    setSubmitting(true)
    try {
      const result = await judgingApi.submitScores({ judgeName: judge.value, room: room.value, teamNumber: team.value, ...scores })
      setMessage(result.message ?? 'Scores submitted.')
    } catch {
      setMessage('Unable to submit scores. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="judging-page">
      <div className="judging-container">
        <h1 className="judging-title">🏆 Judge Scoring</h1>
        <form className="judging-form" onSubmit={handleSubmit}>
          <div className="judging-field"><label className="judging-label">Judge</label><Select options={judges.map(({ name }) => ({ value: name, label: name }))} value={judge} onChange={setJudge} placeholder="Select judge" /></div>
          {judge && <div className="judging-field"><label className="judging-label">Room</label><Select options={rooms.map((value) => ({ value, label: value }))} value={room} onChange={setRoom} placeholder="Select room" /></div>}
          {room && <div className="judging-field"><label className="judging-label">Team</label><Select options={teams} value={team} onChange={setTeam} placeholder="Select team" /></div>}
          {team && <div className="judging-grid">{(Object.keys(scores) as (keyof Scores)[]).map((category, index) => <div className="judging-field" key={category}><label className="judging-label" htmlFor={category}>Category {index + 1}</label><input className="judging-input" id={category} type="number" min={0} max={10} value={scores[category] ?? ''} onChange={(event) => setScores((current) => ({ ...current, [category]: event.target.value === '' ? null : Number(event.target.value) }))} /></div>)}</div>}
          {team && <button className="judging-button" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit scores'}</button>}
        </form>
        {message && <p className="judging-message" role="status">{message}</p>}
      </div>
    </div>
  )
}

