import React from "react";
import { CarouselWrapper } from './carousel.style';
import Slider from "react-slick";

interface Props {
  images: string[]; 
}

const Carousel: React.FC<Props> = ({ images }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // maybe we can keep it?
    autoplay: true,         
    autoplaySpeed: 3000,   //3 secons
    pauseOnHover: true,   
  };

  return (

        <CarouselWrapper>
            <Slider {...sliderSettings}>
            {images.map((src, index) => (
                <div key={index}>
                <img src={src} alt={`Event image ${index + 1}`} />
                </div>
            ))}
            </Slider>
        </CarouselWrapper>


    );
};

export default Carousel
