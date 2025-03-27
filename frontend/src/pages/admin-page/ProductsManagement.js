import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllProducts, searchProducts } from "../../services/productService";

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchKeyword, setSearchKeyword] = useState(""); // State để lưu trữ từ khóa tìm kiếm
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchProducts(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchProducts = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllProducts(page, 10, sortBy, sortDirection);
      setProducts((prevProducts) => [...prevProducts, ...response.content]);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchKeyword) {
        const response = await searchProducts(searchKeyword.trim());
        setProducts(response.result); // Cập nhật sản phẩm với kết quả tìm kiếm
        setIsSearching(true);
      } else {
        // Nếu không có từ khóa, lấy tất cả sản phẩm
        setProducts([])
        fetchProducts(1, sortBy, sortDirection);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h1 className="fw-bold">Products Management</h1>

        {/* Form tìm kiếm */}
        <Form inline onSubmit={handleSearch}>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchKeyword} // Giá trị của input là searchKeyword
                onChange={(e) => setSearchKeyword(e.target.value)} // Cập nhật từ khóa tìm kiếm
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Search</Button>
            </Col>
          </Row>
        </Form>
      </div>

      <Button variant="success" onClick={() => navigate("/admin/products/add")}>
        Create Product
      </Button>

      <Table striped bordered hover className="mt-3" responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Main Image</th>
            <th>Category</th>
            <th>Publisher</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>
                <img
                  src={product.image_main}
                  alt={product.title}
                  width="50"
                  height="50"
                />
              </td>
              <td>{product.category.name}</td>
              <td>{product.publisher.name}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  Edit
                </Button>
                {/* <Button className="ms-2" variant="danger">
                  Delete
                </Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {currentPage < totalPages && !isSearching && (
        <Row className="mt-3">
          <Col className="text-center">
            <Button onClick={handleLoadMore}>Load More</Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductsManagement;
