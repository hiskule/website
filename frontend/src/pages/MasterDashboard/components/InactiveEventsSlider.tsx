import React from 'react';
import Slider from 'react-slick';
import './InactiveEventsSlider.css';

interface Competition {
  id: number;
  name: string;
  date: string;
}

interface InactiveEventsSliderProps {
  competitions: Competition[];
  onActivate: (id: number) => void;
}

export const InactiveEventsSlider: React.FC<InactiveEventsSliderProps> = ({ competitions, onActivate }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  if (competitions.length === 0) return null;

  const handleActivate = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/competitions/${id}/activate`, {
        method: 'POST'
      });
      if (res.ok) {
        onActivate(id);
      }
    } catch (err) {
      console.error('Error activating competition:', err);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <section className="inactive-events-section">
      <div className="inactive-events-header">
        <h3 className="text-headline-md">Other Events</h3>
      </div>
      <div className="inactive-slider-container">
        <Slider {...settings}>
          {competitions.map(comp => (
            <div key={comp.id} className="inactive-slide-wrapper">
              <div className="inactive-event-card">
                <h4 className="text-headline-md inactive-event-name">{comp.name}</h4>
                <p className="text-label-sm inactive-event-date">{comp.date}</p>
                <button 
                  className="activate-btn"
                  onClick={() => handleActivate(comp.id)}
                >
                  Set Active
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};
