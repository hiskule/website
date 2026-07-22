import React from 'react';
import './Team.css';
import TeamCard from './components/team_card';
import Card from './components/card';
import PopUp from './components/card_pop';
import { teamData, cardData } from '../../data/team';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes';

interface CardData {
  name: string;
  role: string;
  bio: string;
  img: string;
  emaillink: string;
  link: string;
}

const Team: React.FC = () => {
  const [popupData, setPopupData] = React.useState<CardData | null>(null);
  const navigate = useNavigate();

  return (
    <div className="team-page-container">
      {/* Page Header */}
      <div className="team-hero-header">
        <h1 className="team-hero-title">
          Meet the <span className="team-hero-gold">Team</span>
        </h1>
        <p className="team-hero-desc">
          The Hi-Skule™ committee is composed of dedicated Engineering students from the University of Toronto, passionate about inspiring the next generation of engineers.
        </p>
      </div>

      {/* Our Mission Box */}
      <TeamCard
        imageSrc={teamData.imageSrc}
        description={teamData.description}
      />

      {/* Meet the Team Section */}
      <div className="team-section-heading">
        <span>Events & Operations Leads</span>
        <div className="team-section-divider" />
      </div>

      <div className="team-cards-grid">
        {cardData.map((card) => (
          <Card key={card.name} data={card} onClick={() => setPopupData(card as any)} />
        ))}
      </div>

      {/* Join the Committee Section */}
      <section className="team-join-cta">
        <span className="team-join-tag">Take the Lead</span>
        <h2 className="team-join-title">Join the Committee</h2>
        <p className="team-join-desc">
          Are you a U of T Engineering student looking to give back? We're always looking for passionate organizers, mentors, and creative thinkers to join our team.
        </p>
        <div className="team-join-buttons">
          <button
            className="btn-primary-gold"
            onClick={() => navigate(ROUTES.mentor)}
          >
            APPLY TO BE A MENTOR
          </button>
          <button
            className="btn-secondary-navy"
            onClick={() => navigate(ROUTES.contact)}
          >
            CONTACT OUR TEAM
          </button>
        </div>
      </section>

      {popupData && <PopUp data={popupData as any} onClose={() => setPopupData(null)} />}
    </div>
  );
};

export default Team;

