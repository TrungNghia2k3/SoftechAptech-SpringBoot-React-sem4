import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { FaBook, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatCurrencyVND } from "../../../utilities/Utils";
import "./CarouselSlider.scss";

const CarouselSlider = ({ productsListByWilliamShakespeare }) => {
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  useEffect(() => {
    // Hàm để tính toán số lượng sản phẩm trên mỗi slide dựa trên kích thước màn hình
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

    updateItemsPerSlide(); // Cập nhật số lượng sản phẩm khi component được mount
    window.addEventListener("resize", updateItemsPerSlide); // Lắng nghe sự kiện thay đổi kích thước màn hình

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide); // Hủy lắng nghe khi component bị unmount
    };
  }, []);

  const handleSlide = (direction) => {
    if (direction === "left") {
      setIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (direction === "right") {
      setIndex((prevIndex) =>
        Math.min(
          Math.ceil(productsListByWilliamShakespeare.length / itemsPerSlide) -
            1,
          prevIndex + 1
        )
      );
    }
  };

  return (
    <Container className="carousel-slider my-4">
      <div className="carousel-title p-2">
        <h5>
          <FaBook className="me-2" />
          Books by author William Shakespeare
        </h5>
      </div>
      <div className="carousel-content position-relative py-3">
        <div className="carousel-slide d-flex justify-content-center">
          {productsListByWilliamShakespeare
            .slice(index * itemsPerSlide, (index + 1) * itemsPerSlide)
            .map((product) => (
              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none"
                key={product.id}
              >
                <Card
                  className="mx-2"
                  style={{
                    width: "200px",
                    height: "360px",
                    flex: "0 0 auto",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={product.image_main}
                    alt={product.title}
                    className="carousel-img"
                  />
                  <Card.Body>
                    <Card.Title className="carousel-title">
                      {product.title}
                    </Card.Title>
                    <Card.Text className="carousel-price">
                      {formatCurrencyVND(product.price)}
                    </Card.Text>
                    <Card.Text className="carousel-sold">
                      Sold items: {product.sold_items}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            ))}
        </div>
        <div
          className="carousel-arrow-left position-absolute top-50 start-0 translate-middle-y"
          onClick={() => index > 0 && handleSlide("left")}
        >
          <FaChevronLeft size={30} />
        </div>
        <div
          className="carousel-arrow-right position-absolute top-50 end-0 translate-middle-y"
          onClick={() =>
            index <
              Math.ceil(
                productsListByWilliamShakespeare.length / itemsPerSlide
              ) -
                1 && handleSlide("right")
          }
        >
          <FaChevronRight size={30} />
        </div>
      </div>
    </Container>
  );
};

export default CarouselSlider;
