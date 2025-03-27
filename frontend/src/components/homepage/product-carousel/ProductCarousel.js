import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatCurrencyVND } from "../../../utilities/Utils";
import "./ProductCarousel.scss"; // Import file SCSS

const ProductCarousel = ({ products }) => {
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1200) {
        setItemsPerSlide(5);
      } else if (window.innerWidth >= 992) {
        setItemsPerSlide(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(2);
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const productChunks = chunkArray(products, itemsPerSlide);

  const handleSlide = (direction) => {
    if (direction === "left") {
      setIndex(index > 0 ? index - 1 : productChunks.length - 1);
    } else if (direction === "right") {
      setIndex(index < productChunks.length - 1 ? index + 1 : 0);
    }
  };

  return (
    <div className="carousel-container">
      <Carousel
        activeIndex={index}
        onSelect={() => {}}
        controls={false}
        indicators={false}
        interval={null}
      >
        {productChunks.map((chunk, chunkIndex) => (
          <Carousel.Item key={chunkIndex}>
            <div className="d-flex justify-content-center flex-wrap">
              {chunk.map((product, idx) => (
                <Link
                  key={idx}
                  to={`/product/${product.id}`}
                  className="text-decoration-none"
                >
                  <Card className="carousel-card">
                    <Card.Img
                      variant="top"
                      src={product.image_main}
                      alt={product.title}
                      className="carousel-card-img"
                    />
                    <Card.Body>
                      <Card.Title className="carousel-card-title">
                        {product.title}
                      </Card.Title>
                      <Card.Text className="carousel-card-text-red">
                        {formatCurrencyVND(product.price)}
                      </Card.Text>
                      <Card.Text className="carousel-card-text-green">
                        Sold items: {product.sold_items}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <div
        className="carousel-control-left"
        onClick={() => handleSlide("left")}
      >
        <FaChevronLeft />
      </div>
      <div
        className="carousel-control-right"
        onClick={() => handleSlide("right")}
      >
        <FaChevronRight />
      </div>
    </div>
  );
};

export default ProductCarousel;
