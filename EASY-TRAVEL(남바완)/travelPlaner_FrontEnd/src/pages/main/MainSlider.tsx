import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MainSlider.css";

const MainSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const items = ["example1", "example2", "example3", "example4", "example5"];

  return (
    <Slider {...settings}>
      {items.map((itemUrl, index) => (
        <div key={index}>
          <div>
            <img
              className="slider-image"
              src={`/images/${itemUrl}.jpg`}
              alt="Main_image"
            />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default MainSlider;
