import React from "react";
import "./about.css";

const About: React.FC = () => {
  return (
    <>
      {/* Pillars Section */}
      <section className="about-section">
        <div className="about-intro-section">
          <h2 className="about-intro-title">ABOUT US</h2>
          <p className="about-intro-desc">
            <strong>Hi-Skule™</strong> is an engineering outreach and mentorship club at the University of Toronto. We organize design challenges and networking events for high school students interested in engineering at UofT. We understand that choosing programs and universities is tough (we’ve been there as well!), so we aim to provide accurate and thorough information about engineering at UofT.
          </p>
        </div>

        <div className="about-header">
          <h2 className="about-title">Empowering Future Engineers</h2>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <h3 className="pillar-card-title">Learning the Engineering Profession</h3>
            <p className="pillar-card-desc">
              We work to raise awareness about what engineering entails by having our U of T students and professors share their insights on university life and what it truly means to be an engineer.
            </p>
          </div>

          <div className="pillar-card">
            <h3 className="pillar-card-title">Developing an Engineering Mindset</h3>
            <p className="pillar-card-desc">
              We aim to instill a strong foundation of engineering principles in youth through engaging workshops, lectures, and innovative content created by our team.
            </p>
          </div>

          <div className="pillar-card">
            <h3 className="pillar-card-title">Mentorship & Outreach Opportunities</h3>
            <p className="pillar-card-desc">
              We connect high school students with current engineering students and professors to foster relationships that guide their educational journeys.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;


