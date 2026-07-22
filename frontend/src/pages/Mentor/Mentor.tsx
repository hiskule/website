import React from 'react';
import './Mentor.css';
import { team } from '../../assets/coffeehouse';
import mentorSections from '../../data/mentor';
import SectionComponent from './components/Sections';

const Mentor: React.FC = () => {
  return (
    <div className="mentor-page-container">
      {/* Top Hero Box */}
      <div className="mentor-hero">
        <div>
          <h1 className="mentor-hero-title">MENTORS ARE OUR BACKBONE</h1>
          <p className="mentor-hero-desc">
            Volunteer mentors are the lifeblood of our events. Without them, <strong>Hi-Skule™</strong> would be unable to run events and workshops at the city-wide scale we do.
          </p>
        </div>
        <div>
          <img className="mentor-hero-img" src={team} alt="Hi-Skule™ Mentors Team" />
        </div>
      </div>

      {/* Sections List */}
      <div>
        {mentorSections.map((section, idx) => (
          <SectionComponent key={idx} data={section} />
        ))}
      </div>
    </div>
  );
};

export default Mentor;