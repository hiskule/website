import React from "react";

type ButtonType = {
  label: string;
  link?: string;
};

type ImageType = {
  src: string;
  type: "horizontal" | "vertical";
  position: "left" | "right";
};

type MentorSection = {
  header: string;
  text: string;
  buttons: ButtonType[];
  image?: ImageType;
};

type SectionsProps = { data: MentorSection };

const SectionComponent: React.FC<SectionsProps> = ({ data }) => {
  const renderImage = () => {
    if (!data.image) return null;
    return (
      <div>
        <img
          className={
            data.image.type === "horizontal"
              ? "mentor-img-horizontal"
              : "mentor-img-vertical"
          }
          src={data.image.src}
          alt={data.header}
        />
      </div>
    );
  };

  return (
    <article className="mentor-section-card">
      {data.image?.position === "left" && renderImage()}

      <div className="mentor-text-col">
        <h3 className="mentor-section-header">{data.header}</h3>
        <div
          className="mentor-section-p"
          dangerouslySetInnerHTML={{ __html: data.text }}
        />

        {data.buttons && data.buttons.length > 0 && (
          <div className="mentor-buttons-row">
            {data.buttons.map((btn, bIdx) => (
              <button
                key={bIdx}
                className={btn.link ? "btn-primary-gold" : "btn-secondary-navy"}
                style={!btn.link ? { color: "var(--color-deep-navy)", borderColor: "var(--color-deep-navy)" } : {}}
                onClick={() => {
                  if (btn.link) window.open(btn.link, "_blank");
                }}
              >
                {btn.label} {btn.link && "→"}
              </button>
            ))}
          </div>
        )}
      </div>

      {data.image?.position === "right" && renderImage()}
    </article>
  );
};

export default SectionComponent;