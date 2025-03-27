import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomPagination from "../../components/pagination/CustomPagination";
import ProductCard from "../../components/product-list-page/ProductCard";
import FilterPanel from "../../components/public-page/product-list-page/filter-panel/FilterPanel";
import {
  fetchFilteredProducts,
  selectFilteredProducts,
  setFilters,
} from "../../features/products/productSlice";

const ProductList = () => {
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const filters = useSelector((state) => state.products.filters); // Get current filters from Redux state
  const filteredProducts = useSelector(selectFilteredProducts); // Get filtered products from Redux state
  const products = filteredProducts.content; // Extract product list from filteredProducts
  const page = filteredProducts.pageNumber; // Extract current page number
  const totalPages = filteredProducts.totalPages; // Extract total pages
  const [sortOption, setSortOption] = useState("price-asc"); // Local state for sort option

  useEffect(() => {
    // Effect hook to fetch products when sortOption or filters change
    const fetchProducts = async () => {
      try {
        // Split sortOption into sortBy and asc
        const [sortBy, asc] = sortOption.split("-");
        const updatedFilters = { ...filters, sortBy, asc: asc === "asc" };

        // Only fetch products if filters have changed
        if (JSON.stringify(updatedFilters) !== JSON.stringify(filters)) {
          dispatch(setFilters(updatedFilters)); // Update filters in Redux store
          await dispatch(fetchFilteredProducts(updatedFilters)); // Fetch products with updated filters
        }
      } catch (error) {
        console.error("Failed to fetch products:", error); // Handle errors
      }
    };

    fetchProducts(); // Call fetchProducts
  }, [sortOption, filters, dispatch]); // Dependencies: sortOption, filters, and dispatch

  const handleSortChange = (e) => {
    setSortOption(e.target.value); // Update local sortOption state
    dispatch(setFilters({ ...filters, page: 0 }));
  };

  const handlePageChange = (page) => {
    // Update page number in filters and fetch products for new page
    const updatedPage = Math.max(0, Math.min(page - 1, totalPages - 1));
    dispatch(setFilters({ ...filters, page: updatedPage }));
    dispatch(fetchFilteredProducts({ ...filters, page: updatedPage }));
  };

  return (
    <Container>
      <Row>
        <Col lg={2}>
          <FilterPanel /> {/* Filter panel component */}
        </Col>
        <Col lg={10}>
          <div className="product-list">
            <Row className="mb-3">
              <Form.Group className="w-25">
                <Form.Label>Sort By</Form.Label>
                <Form.Select value={sortOption} onChange={handleSortChange}>
                  <option value="price-asc">Price (ASC)</option>
                  <option value="price-desc">Price (DESC)</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              {products.length > 0 ? (
                // Render list of products
                products.map((product, index) => (
                  <ProductCard product={product} />
                ))
              ) : (
                <p>No products found</p>
              )}
            </Row>

            <Row className="mt-2">
              <CustomPagination
                currentPage={page} // Adjust page number for CustomPagination (1-based index)
                totalPages={totalPages}
                onPageChange={handlePageChange} // Handler for page change
              />
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;
