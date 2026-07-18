import React from "react";
import { FaTimes } from "react-icons/fa";
import "./card_pop.css";

interface PopupProps {
  data: { name: string; role: string; bio: string; img: string; };
  onClose: () => void;
}

const PopUp: React.FC<PopupProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
        <img className="popup-modal-img" src={data.img} alt={data.name} />
        <div className="popup-modal-content">
          <span className="popup-modal-role">{data.role}</span>
          <h2 className="popup-modal-name">{data.name}</h2>
          <div
            className="popup-modal-bio"
            dangerouslySetInnerHTML={{ __html: data.bio }}
          />
        </div>
      </div>
    </div>
  );
};

export default PopUp;

