import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getAllCategories } from "../../services/categoryService";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";
import { getAllPublishers } from "../../services/publisherService";

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    author: "",
    title: "",
    publicationDate: new Date().toISOString().split("T")[0],
    edition: "",
    language: "",
    formality: "",
    isbn10: "",
    isbn13: "",
    description: "",
    pageNumber: "",
    price: "",
    weight: "",
    thickness: "",
    width: "",
    length: "",
    categoryId: "",
    publisherId: "",
  });
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [subImageOne, setSubImageOne] = useState(null);
  const [subImageTwo, setSubImageTwo] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [subImageOneUrl, setSubImageOneUrl] = useState("");
  const [subImageTwoUrl, setSubImageTwoUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null); // new
  const [audioFileUrl, setAudioFileUrl] = useState(""); // new
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAllCategories();
    fetchAllPublishers();
    if (id) {
      setIsEditMode(true);
      fetchProduct(id);
    }
  }, [id]);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllPublishers = async () => {
    try {
      const response = await getAllPublishers();
      setPublishers(response.result);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      const productData = await getProductById(productId);

      console.log(productData.result.publication_date);

      setProduct({
        title: productData.result.title,
        author: productData.result.author,
        publicationDate: new Date(productData.result.publication_date)
          .toISOString()
          .split("T")[0], // Ensure YYYY-MM-DD format
        edition: productData.result.edition,
        language: productData.result.language,
        formality: productData.result.formality,
        price: productData.result.price,
        isbn10: productData.result.isbn10,
        isbn13: productData.result.isbn13,
        description: productData.result.description,
        pageNumber: productData.result.page_number,
        weight: productData.result.weight,
        thickness: productData.result.thickness,
        width: productData.result.width,
        length: productData.result.length,
        categoryId: productData.result.category.id,
        publisherId: productData.result.publisher.id,
      });

      // Set initial image and audio previews
      setMainImageUrl(productData.result.image_main);
      setSubImageOneUrl(productData.result.image_sub_one);
      setSubImageTwoUrl(productData.result.image_sub_two);
      setAudioFileUrl(productData.result.audio); // Adjust according to your API response
    } catch (error) {
      console.error("Error fetching product:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // Lấy giá trị ngày từ sự kiện
    setProduct({ ...product, publicationDate: selectedDate });
  };

  const handleImageChange = (e, setImage, setImageUrl) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioFileUrl(audioUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const productRequest = {
      title: product.title,
      author: product.author,
      publicationDate: product.publicationDate,
      edition: product.edition,
      language: product.language,
      formality: product.formality,
      isbn10: product.isbn10,
      isbn13: product.isbn13,
      description: product.description,
      price: Number(product.price),
      weight: Number(product.weight),
      pageNumber: Number(product.pageNumber),
      thickness: Number(product.thickness),
      width: Number(product.width),
      length: Number(product.length),
      publisherId: product.publisherId,
      categoryId: product.categoryId,
    };
    try {
      if (isEditMode) {
        await updateProduct(
          id,
          productRequest,
          mainImage,
          subImageOne,
          subImageTwo,
          audioFile
        );
        toast.success("Updated product successfully");
      } else {
        await createProduct(
          productRequest,
          mainImage,
          subImageOne,
          subImageTwo,
          audioFile
        );
        toast.success("Created product successfully");
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000); // 1000 milliseconds = 1 seconds
    } catch (error) {
      if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(key + " " + validationErrors[key]);
        }
      } else {
        if (error.response.data.code === 1042) {
          toast.error(error.response.data.message);
        } else {
          console.error("Error saving product:", error);
          toast.error("Error saving product. Please try again.");
        }
      }
    }
    setLoading(false);
  };

  return (
    <Container>
      <h1 className="fw-bold">{isEditMode ? "Edit Product" : "Add Product"}</h1>
      {loading && <Spinner animation="border" />}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={product.author}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={product.title}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="publicationDate">
              <Form.Label>Publication Date</Form.Label>
              <Form.Control
                type="date"
                value={product.publicationDate} // Hiển thị giá trị ban đầu hoặc giá trị đã chọn
                onChange={handleDateChange} // Xử lý khi người dùng chọn giá trị mới
                className="form-control"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="edition">
              <Form.Label>Edition</Form.Label>
              <Form.Control
                type="text"
                name="edition"
                value={product.edition}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                name="language"
                value={product.language}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="formality">
              <Form.Label>Formality</Form.Label>
              <Form.Select
                type="text"
                name="formality"
                value={product.formality}
                onChange={handleInputChange}
              >
                <option>Open this select menu</option>
                <option value="PAPERBACK">PAPERBACK</option>
                <option value="HARDCOVER">HARDCOVER</option>
                <option value="AUDIOCD">AUDIOCD</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="isbn10">
              <Form.Label>ISBN10</Form.Label>
              <Form.Control
                type="text"
                name="isbn10"
                value={product.isbn10}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="isbn13">
              <Form.Label>ISBN13</Form.Label>
              <Form.Control
                type="text"
                name="isbn13"
                value={product.isbn13}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="pageNumber">
              <Form.Label>Page Number</Form.Label>
              <Form.Control
                type="number"
                name="pageNumber"
                value={product.pageNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="weight"
                value={product.weight}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="thickness">
              <Form.Label>Thickness</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="thickness"
                value={product.thickness}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="width">
              <Form.Label>Width</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="width"
                value={product.width}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="length">
              <Form.Label>Length</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="length"
                value={product.length}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={10}
            name="description"
            value={product.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="categoryId">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="publisherId">
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                as="select"
                name="publisherId"
                value={product.publisherId}
                onChange={handleInputChange}
              >
                <option value="">Select Publisher</option>
                {publishers.map((publisher) => (
                  <option key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Main Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setMainImage, setMainImageUrl)
                }
              />
              {mainImageUrl && (
                <img
                  src={mainImageUrl}
                  alt="Main"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Sub Image One</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setSubImageOne, setSubImageOneUrl)
                }
              />
              {subImageOneUrl && (
                <img
                  src={subImageOneUrl}
                  alt="SubImageOne"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Sub Image Two</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setSubImageTwo, setSubImageTwoUrl)
                }
              />
              {subImageTwoUrl && (
                <img
                  src={subImageTwoUrl}
                  alt="SubImageTwo"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Audio</Form.Label>
              <Form.Control
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
              />
              {audioFileUrl && (
                <audio controls src={audioFileUrl} style={{ width: "100%" }} />
              )}
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">
          {isEditMode ? "Update Product" : "Add Product"}
        </Button>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default AddEditProduct;
