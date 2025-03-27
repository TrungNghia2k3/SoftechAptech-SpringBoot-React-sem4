import React from "react";
import { Image } from "react-bootstrap";
import "./DetailsThumb.css"; // Thêm file CSS cho các kiểu

const DetailsThumb = ({ images, onImageClick }) => {
  return (
    <div className="thumb">
      {images.map((img, index) => (
        <Image
          src={img}
          alt={`Thumbnail ${index}`}
          key={index}
          onClick={() => onImageClick(index)}
          className="thumbnail"
        />
      ))}
    </div>
  );
};

export default DetailsThumb;
