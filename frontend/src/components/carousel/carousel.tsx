import React from "react";
import "./carousel.css";
import Slider from "react-slick";

interface Props {
  images: string[];
}

const Carousel: React.FC<Props> = ({ images }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="carousel-wrapper">
      <Slider {...sliderSettings}>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Event image ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;

