import { useEffect, useState } from "react";
import { Container, Row, Tab, Tabs } from "react-bootstrap";
import CarouselSlider from "../../components/homepage/carousel-slider/CarouselSlider";
import CategoryGrid from "../../components/homepage/category-grid/CategoryGrid";
import HomeCarousel from "../../components/homepage/home-carousels/HomeCarousel";
import ProductCard from "../../components/homepage/product-card/ProductCard";
import ProductCarousel from "../../components/homepage/product-carousel/ProductCarousel";
import { getAllCategories } from "../../services/categoryService";
import {
  getAllProducts,
  getAllProductsByAuthorName,
  getAllProductsByPublisherId,
} from "../../services/productService";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [
    listProductByCambridgeUniversity,
    setListProductByCambridgeUniversity,
  ] = useState([]);
  const [listProductByOxfordUniversity, setListProductByOxfordUniversity] =
    useState([]);
  const [listProductByMITUniversity, setListProductByMITUniversity] = useState(
    []
  );
  const [bestSellerProductsList, setBetSellerProductsList] = useState([]);

  const [
    productsListByWilliamShakespeare,
    setProductsListByWilliamShakespeare,
  ] = useState([]);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllProductsByCambridgeUniversity = async () => {
    try {
      const response = await getAllProductsByPublisherId(4);
      setListProductByCambridgeUniversity(response.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllProductsByOxfordUniversity = async () => {
    try {
      const response = await getAllProductsByPublisherId(9);
      setListProductByOxfordUniversity(response.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllProductsByMITUniversity = async () => {
    try {
      const response = await getAllProductsByPublisherId(10);
      setListProductByMITUniversity(response.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBestSellerProducts = async () => {
    try {
      const response = await getAllProducts(1, 20, "soldItems", "desc");
      setBetSellerProductsList(response.content);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProductsByWilliamShakespeare = async () => {
    try {
      const response = await getAllProductsByAuthorName("William Shakespeare");
      setProductsListByWilliamShakespeare(response.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
    fetchAllProductsByCambridgeUniversity();
    fetchAllProductsByOxfordUniversity();
    fetchAllProductsByMITUniversity();
    fetchBestSellerProducts();
    fetchAllProductsByWilliamShakespeare();
  }, []);

  // console.log(listProductByCambridgeUniversity);

  return (
    <Container className="p-0">
      <h1 className="title text-center">Explore Worlds Within Our Walls</h1>
      <Row className="home-carousel mb-3">
        <HomeCarousel />
      </Row>

      {/* Best Seller Products Section  */}
      <Container>
        <h2 className="text-center my-4">Best Seller Products</h2>
        <Row>
          {bestSellerProductsList.slice(0, 20).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      </Container>

      {/* Category grid */}
      <CategoryGrid categories={categories} />

      {/* Carousel slider of William Shakespeare */}
      <div>
        <CarouselSlider
          productsListByWilliamShakespeare={productsListByWilliamShakespeare}
        />
      </div>

      <div>
        <img
          className="d-block w-100"
          src="/images/banner/banner-1.webp"
          alt="Third slide"
        />
      </div>

      {/* Most Famous Publishers Section*/}
      <Container className="bg-white p-0 rounded-top">
        <Tabs
          defaultActiveKey="cambridge"
          id="university-products-tabs"
          className="my-3"
        >
          <Tab eventKey="cambridge" title="Cambridge University">
            <ProductCarousel products={listProductByCambridgeUniversity} />
          </Tab>
          <Tab eventKey="oxford" title="Oxford University">
            <ProductCarousel products={listProductByOxfordUniversity} />
          </Tab>
          <Tab eventKey="mit" title="MIT University">
            <ProductCarousel products={listProductByMITUniversity} />
          </Tab>
        </Tabs>
      </Container>
    </Container>
  );
}
