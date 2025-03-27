import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Cart, Heart, HeartFill, Pencil, Trash } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import QuantityControl from "../../../components/quantity-control/QuantityControl";
import ReadMore from "../../../components/read-more/ReadMore";
import { addProductToCart } from "../../../features/cart/cartSlice";
import { getProductById } from "../../../services/productService";
import {
  addProductToWishlist,
  checkIfInWishlist,
  removeProductFromWishlist,
} from "../../../services/wishlistService";
import {
  capitalizeFirstLetter,
  formatCurrencyVND,
  formatDate,
  formatNotificationDate,
} from "../../../utilities/Utils";
import "./ProductDetail.scss";
import {
  checkUserPurchasedProduct,
  createCommentAndRating,
  deleteCommentAndRating,
  getAllCommentAndRatingByProductId,
  updateCommentAndRating,
} from "../../../services/commentService";
import StarRatings from "react-star-ratings";
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null); // State for audio URL
  const [isInWishlist, setIsInWishlist] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const dispatch = useDispatch();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [canComment, setCanComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.result);
        setMainImage(response.result.image_main);
        setAudioUrl(response.result.audio); // Set audio URL

        if (userId) {
          const wishlistResponse = await checkIfInWishlist(userId, id);
          setIsInWishlist(wishlistResponse.result);

          const purchaseResponse = await checkUserPurchasedProduct(userId, id);
          setCanComment(purchaseResponse.result);
        }

        const commentsResponse = await getAllCommentAndRatingByProductId(id);
        setComments(commentsResponse.result);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id, userId]);

  const handleAddToCart = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const resultAction = await dispatch(
        addProductToCart({ userId: userId, productId: id, quantity })
      );

      if (addProductToCart.fulfilled.match(resultAction)) {
        // Thông báo thành công
        toast.success("Product added to cart successfully!");
        setQuantity(1);
      } else {
        // Xử lý lỗi
        if (resultAction.payload) {
          // Lỗi từ phía server
          toast.error(
            resultAction.payload + ".Please check your shopping cart again"
          );
        } else {
          // Lỗi khác (mạng, không phản hồi, v.v.)
          toast.error("Failed to add product to cart.");
        }
      }
    } catch (error) {
      // Xử lý lỗi không mong đợi
      toast.error("An unexpected error occurred.");
    }
  };

  const handleBuyNow = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const resultAction = await dispatch(
        addProductToCart({ userId: userId, productId: id, quantity })
      );

      if (addProductToCart.fulfilled.match(resultAction)) {
        // Thông báo thành công
        toast.success("Product added to cart successfully!");
        setQuantity(1);
        navigate("/user/cart");
      } else {
        // Xử lý lỗi
        if (resultAction.payload) {
          // Lỗi từ phía server
          toast.error(
            resultAction.payload + ".Please check your shopping cart again"
          );
        } else {
          // Lỗi khác (mạng, không phản hồi, v.v.)
          toast.error("Failed to add product to cart.");
        }
      }
    } catch (error) {
      // Xử lý lỗi không mong đợi
      toast.error("An unexpected error occurred.");
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addProductToWishlist(userId, id);
      setIsInWishlist(true);
      toast.success("Product added to wishlist!");
    } catch (error) {
      toast.error("Failed to add product to wishlist.");
    }
  };

  const handleRemoveFromWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await removeProductFromWishlist(userId, id);
      setIsInWishlist(false);
      toast.success("Product removed from wishlist!");
    } catch (error) {
      toast.error("Failed to remove product from wishlist.");
    }
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const subImages = [product.image_sub_one, product.image_sub_two].filter(
    Boolean
  );

  // New feature

  const handleAddComment = async () => {
    try {
      const newCommentData = {
        content: newComment,
        stars: newRating,
      };

      console.log(userId, id, newCommentData);

      const response = await createCommentAndRating(userId, id, newCommentData);
      setComments([...comments, response.result]);
      setNewComment("");
      // Use a callback function to ensure state is updated correctly
      setNewRating(() => 0);
      setCanComment(false);
      toast.success("Comment added successfully!");
    } catch (error) {
      if (error.response.data.code === 1044) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(key + " " + validationErrors[key]);
        }
      } else {
        toast.error("Failed to add comment.");
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const updatedCommentData = {
        content: newComment,
        stars: newRating,
      };

      const response = await updateCommentAndRating(
        commentId,
        updatedCommentData
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.result : comment
        )
      );

      setIsEditing(false);
      setNewComment("");
      setNewRating(0);
      setEditCommentId(null);
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.log(error);

      if (error.response.data.code === 1002) {
        toast.error(error.response.data.message);
      } else if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(key + " " + validationErrors[key]);
        }
      } else {
        toast.error("Failed to update comment.");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentAndRating(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <Container>
      <Row>
        {/* Phần bên trái: hình ảnh và các nút */}
        <Col
          md={4}
          className="bg-white p-3 d-flex flex-column align-items-center"
          style={{
            border: "1px solid #DEE2E6",
            borderRadius: "8px",
          }}
        >
          <Image src={mainImage} fluid className="main-image mb-3" />
          <Row className="mb-3 d-flex justify-content-center">
            <Image
              src={product.image_main}
              fluid
              className="thumbnail mx-1"
              onClick={() => handleImageClick(product.image_main)}
            />
            {subImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                fluid
                className="thumbnail mx-1"
                onClick={() => handleImageClick(image)}
              />
            ))}

            {/* Audio */}
            {audioUrl && (
              <div className="audio-player mt-3 d-flex justify-content-center">
                <audio controls>
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </Row>
          <div className="d-flex justify-content-between">
            <QuantityControl quantity={quantity} setQuantity={setQuantity} />

            {/*  AddToList/RemoveFromList */}
            {isInWishlist ? (
              <HeartFill
                className="wishlist-icon"
                onClick={handleRemoveFromWishlist}
              />
            ) : (
              <Heart className="wishlist-icon" onClick={handleAddToWishlist} />
            )}
          </div>

          {/* Check if inStock is greater than 0 */}
          {product.in_stock > 0 ? (
            <>
              <Button
                variant="primary"
                className="w-75"
                onClick={handleAddToCart}
              >
                <Cart className="me-1 mb-1" />
                Add to cart
              </Button>
              <Button
                variant="success"
                className="w-75 my-2"
                onClick={handleBuyNow}
              >
                Buy now
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" className="w-75" disabled>
                <Cart className="me-1 mb-1" />
                Add to cart
              </Button>
              <Button variant="success" className="w-75 my-2" disabled>
                Buy now
              </Button>
              <div className="out-of-stock mt-3 text-danger fw-bold fs-4">
                OUT OF STOCK
              </div>
            </>
          )}
        </Col>

        {/* Phần bên phải: thông tin chi tiết sản phẩm */}
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="product-title">{product.title}</Card.Title>
              <Card.Text className="product-author">
                Author: {product.author}
              </Card.Text>
              <Card.Text className="product-publisher">
                Publisher: {product.publisher.name}
              </Card.Text>
              <Card.Text className="product-category">
                Category: {product.category.name}
              </Card.Text>
              <Card.Text className="product-in-stock">
                In Stock: {product.in_stock}
              </Card.Text>
              <Card.Text className="product-price text-danger fs-3 fw-bold">
                {formatCurrencyVND(product.price)}
              </Card.Text>
            </Card.Body>
          </Card>

          <ListGroup className="product-details">
            <ListGroup.Item className="product-id">
              <h5 className="fw-bold"> Product details</h5>
            </ListGroup.Item>
            <ListGroup.Item className="product-id">
              Product Code: {product.id}
            </ListGroup.Item>
            <ListGroup.Item className="product-formality">
              Formality: {capitalizeFirstLetter(product.formality)}
            </ListGroup.Item>
            <ListGroup.Item className="product-publication-date">
              Publication date: {formatDate(product.publication_date)}
            </ListGroup.Item>
            <ListGroup.Item className="product-edition">
              Edition: {product.edition}
            </ListGroup.Item>
            <ListGroup.Item className="product-language">
              Language: {product.language}
            </ListGroup.Item>
            <ListGroup.Item className="product-isbn10">
              ISBN10: {product.isbn10}
            </ListGroup.Item>
            <ListGroup.Item className="product-isbn13">
              ISBN13: {product.isbn13}
            </ListGroup.Item>
            <ListGroup.Item className="product-quantity-page">
              Quantity of Page: {product.page_number}
            </ListGroup.Item>
            <ListGroup.Item className="product-weight">
              Weight: {product.weight} pounds
            </ListGroup.Item>
            <ListGroup.Item className="product-dimensions">
              Dimensions: {product.length} x {product.thickness} x{" "}
              {product.width} inches
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>

      {/* Phần mô tả sản phẩm */}
      <Row
        className="bg-white p-3 mt-4"
        style={{
          border: "1px solid #DEE2E6",
          borderRadius: "8px",
        }}
      >
        <Col>
          <h5 className="fw-bold">Product Description</h5>
          <ReadMore>{product.description}</ReadMore>
        </Col>
      </Row>

      {/* // Phần comment and rating sản phẩm */}
      <Row
        className="bg-white p-3 mt-4"
        style={{ border: "1px solid #DEE2E6", borderRadius: "8px" }}
      >
        <Col>
          <h5 className="fw-bold">Product Comments and Ratings</h5>
          <div className="comments-section mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="mb-2">
                  <Card.Body>
                    <div className="comment-header d-flex justify-content-between">
                      <div>
                        <p className="m-0 fw-bold">
                          {comment.user.firstName} {comment.user.lastName}
                        </p>
                        <div style={{ fontSize: "12px" }}>
                          <StarRatings
                            rating={comment.stars}
                            starRatedColor="gold"
                            starEmptyColor="gray"
                            starDimension="16px"
                            starSpacing="2px"
                            numberOfStars={5}
                            isSelectable={false} // Không cho chỉnh sửa
                          />
                          <p>{formatNotificationDate(comment.createdDate)}</p>
                        </div>
                      </div>
                      {comment.user.id === userId && (
                        <div>
                          <Pencil
                            className="me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setIsEditing(true);
                              setEditCommentId(comment.id);
                              setNewComment(comment.content); // Đổ dữ liệu content của comment hiện tại
                              setNewRating(comment.stars); // Đổ dữ liệu rating của comment hiện tại
                            }}
                          />
                          <Trash
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteComment(comment.id)}
                          />
                        </div>
                      )}
                    </div>
                    {isEditing && editCommentId === comment.id ? (
                      <Form>
                        <Form.Group controlId="editCommentTextArea">
                          <Form.Control
                            as="textarea"
                            required
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                        </Form.Group>
                        <div>
                          <StarRatings
                            rating={newRating}
                            starRatedColor="gold"
                            starEmptyColor="gray"
                            starDimension="16px"
                            starSpacing="2px"
                            numberOfStars={5}
                            changeRating={(newRating) =>
                              setNewRating(newRating)
                            }
                          />
                        </div>
                        <Button
                          variant="primary"
                          className="mt-2"
                          onClick={() => {
                            handleUpdateComment(comment.id);
                            setIsEditing(false);
                            setEditCommentId(null);
                            setNewComment(""); // Reset comment sau khi lưu
                            setNewRating(0); // Reset rating sau khi lưu
                          }}
                        >
                          Save Changes
                        </Button>
                      </Form>
                    ) : (
                      <>
                        <Card.Text>{comment.content}</Card.Text>
                        {comment.adminResponse && (
                          <Card.Text className="bg-light bg-gradient p-2">
                            Seller's response:
                            <br />
                            <p className="text-muted m-0">
                              {comment.adminResponse}
                            </p>
                          </Card.Text>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>

          {canComment && !isEditing && (
            <Form className="mt-4">
              <Form.Group controlId="commentTextArea">
                <Form.Label className="m-0">Leave a Comment</Form.Label>
                <div className="mb-2">
                  <StarRatings
                    rating={newRating}
                    starRatedColor="gold"
                    starEmptyColor="gray"
                    starDimension="16px"
                    starSpacing="2px"
                    numberOfStars={5}
                    changeRating={(newRating) => setNewRating(newRating)}
                  />
                </div>
                <Form.Control
                  as="textarea"
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                className="mt-3"
                onClick={handleAddComment}
              >
                Submit Comment
              </Button>
            </Form>
          )}
        </Col>
      </Row>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default ProductDetail;
