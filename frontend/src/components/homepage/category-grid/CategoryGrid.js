import React from "react";
import { Grid } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFilteredProducts,
  setFilters,
} from "../../../features/products/productSlice";
import { setSelectedCategoryId } from "../../../features/category/categorySlice";
import "./CategoryGrid.scss";

const CategoryGrid = ({ categories }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.products.filters); // Get filters from Redux store
  const selectedCategoryId = useSelector(
    (state) => state.category.selectedCategoryId
  ); // Get selectedCategoryId from Redux store
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId) => {
    const newCategoryId = Number(categoryId);
    dispatch(setSelectedCategoryId(newCategoryId)); // Update selectedCategoryId in Redux store
    dispatch(setFilters({ ...filters, categoryId: newCategoryId }));
    dispatch(fetchFilteredProducts({ ...filters, categoryId: newCategoryId }));

    navigate("/product-list");
  };

  return (
    <div className="category-grid my-4">
      <div className="category-title p-2">
        <h5>
          <Grid className="me-2" />
          Category
        </h5>
      </div>
      <div className="category-row">
        {categories.map((category, idx) => (
          <div
            key={idx}
            className={`category-item col-6 col-sm-4 col-md-3 col-lg-2 ${
              selectedCategoryId === category.id ? "selected" : ""
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="image-container">
              <img src={category.image} alt={category.name} />
            </div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
