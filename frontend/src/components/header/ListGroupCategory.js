// src/components/ListGroupCategory/ListGroupCategory.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategoryId } from "../../features/category/categorySlice";
import { useNavigate } from "react-router-dom";
import {
  fetchFilteredProducts,
  setFilters,
} from "../../features/products/productSlice";
import { getAllCategories } from "../../services/categoryService";
import "./ListGroupCategory.scss";

const ListGroupCategory = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.products.filters);
  const selectedCategoryId = useSelector(
    (state) => state.category.selectedCategoryId
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAllCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryId !== categoryId) {
      dispatch(setSelectedCategoryId(categoryId));
      const newFilters = { ...filters, categoryId: Number(categoryId) };
      dispatch(setFilters(newFilters));
      dispatch(fetchFilteredProducts(newFilters));
      navigate("/product-list");
    }
  };

  return (
    <div className="category-bar">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`category-item ${
            selectedCategoryId === category.id ? "active" : ""
          }`}
          onClick={() => handleCategorySelect(category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default ListGroupCategory;
