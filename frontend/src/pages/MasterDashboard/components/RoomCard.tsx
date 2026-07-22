import React from 'react';
import './RoomCard.css';

interface Team {
  id: number;
  team_number: number;
  start_time: string;
  end_time: string;
  presentation_link: string | null;
  isGraded: boolean;
}

interface Judge {
  name: string;
}

interface RoomData {
  id: number;
  room: string;
  judges: Judge[];
  teams: Team[];
}

interface RoomCardProps {
  room: RoomData;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-card-header">
        <h3 className="room-card-title">Room {room.room}</h3>
        <p className="room-judges">
          Judges: {room.judges.length > 0 ? room.judges.map(j => j.name).join(', ') : 'None assigned'}
        </p>
      </div>
      
      <div className="room-teams-list">
        {room.teams && room.teams.length > 0 ? (
          room.teams.map(team => (
            <div key={team.id} className="room-team-item">
              <div className="room-team-info">
                <span className="room-team-name">Team {team.team_number}</span>
                <span className="room-team-time">{team.start_time} - {team.end_time}</span>
              </div>
              <div className="room-team-status">
                {team.presentation_link ? (
                  <span className="status-badge submitted">File Submitted</span>
                ) : (
                  <span className="status-badge missing">No File</span>
                )}
                
                {team.isGraded ? (
                  <span className="status-badge graded">Graded</span>
                ) : (
                  <span className="status-badge missing">Not Graded</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>No teams scheduled.</p>
        )}
      </div>
    </div>
  );
};
