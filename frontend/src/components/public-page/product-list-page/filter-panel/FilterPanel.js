import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  fetchFilteredProducts,
} from "../../../../features/products/productSlice";
import { getAllCategories } from "../../../../services/categoryService";
import { getAllPublishers } from "../../../../services/publisherService";
import { Form } from "react-bootstrap";
import "./FilterPanel.scss";

const FilterPanel = () => {
  // State hooks to manage local state for categories, publishers, and filters
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState("0-10000000");
  const [selectedFormalities, setSelectedFormalities] = useState([]);

  // Redux hooks to dispatch actions and select state
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.products.filters); // Lấy filters từ Redux store
  const selectedCategory = useSelector(
    (state) => state.category.selectedCategoryId
  );

  // Fetch categories and publishers when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, publishersResponse] = await Promise.all([
          getAllCategories(),
          getAllPublishers(),
        ]);
        setCategories(categoriesResponse.result);
        setPublishers(publishersResponse.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const newCategoryId = Number(e.target.value);
    if (selectedCategoryId !== newCategoryId) {
      setSelectedCategoryId(newCategoryId);
      dispatch(setFilters({ ...filters, categoryId: newCategoryId, page: 0 }));
      dispatch(
        fetchFilteredProducts({ ...filters, categoryId: newCategoryId })
      );
    }
  };

  // Handle publisher selection change
  const handlePublisherChange = (e) => {
    const newPublisherId = Number(e.target.value); // Convert selected value to number
    if (selectedPublisherId !== newPublisherId) {
      setSelectedPublisherId(newPublisherId); // Update local state
      dispatch(
        setFilters({ ...filters, publisherId: newPublisherId, page: 0 }) // Update filters in Redux store
      );
      dispatch(
        fetchFilteredProducts({ ...filters, publisherId: newPublisherId }) // Fetch products with new filter
      );
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number); // Split and convert range to numbers
    if (selectedPriceRange !== e.target.value) {
      setSelectedPriceRange(e.target.value);
      dispatch(
        setFilters({ ...filters, minPrice: min, maxPrice: max, page: 0 }) // Update filters in Redux store
      );
      dispatch(
        fetchFilteredProducts({
          ...filters,
          minPrice: min,
          maxPrice: max,
          page: 0, // Reset page to 0 when filter changes
        })
      );
    }
  };

  // Handle formality (binding format) change
  const handleFormalityChange = (e) => {
    const { value, checked } = e.target; // Get value and checked status
    const newFormalities = checked
      ? [...selectedFormalities, value] // Add value if checked
      : selectedFormalities.filter((item) => item !== value); // Remove value if unchecked

    if (
      JSON.stringify(newFormalities) !== JSON.stringify(selectedFormalities)
    ) {
      setSelectedFormalities(newFormalities); // Update local state
      dispatch(setFilters({ ...filters, formality: newFormalities, page: 0 })); // Update filters in Redux store
      dispatch(
        fetchFilteredProducts({
          ...filters,
          formality: newFormalities,
          page: 0, // Reset page to 0 when filter changes
        })
      );
    }
  };

  // Price range options
  const priceRanges = [
    { id: "0-150000", label: "0đ - 150000đ" },
    { id: "150000-300000", label: "150000đ - 300000đ" },
    { id: "300000-500000", label: "300000đ - 500000đ" },
    { id: "500000-700000", label: "500000đ - 700000đ" },
    { id: "700000-10000000", label: "700000đ - Above" },
  ];

  // Formality options
  const formalities = [
    { id: "PAPERBACK", label: "PAPERBACK" },
    { id: "HARDCOVER", label: "HARDCOVER" },
    { id: "AUDIOCD", label: "AUDIOCD" },
  ];

  return (
    <div className="filter-panel">
      {/* Category filter */}
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={selectedCategoryId || selectedCategory || ""}
          onChange={handleCategoryChange}
        >
          <option>All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Publisher filter */}
      <Form.Group className="mb-3">
        <Form.Label>Publisher</Form.Label>
        <Form.Select
          value={selectedPublisherId || ""}
          onChange={handlePublisherChange}
        >
          <option>All Publishers</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Price range filter */}
      <Form.Group className="mb-3">
        <Form.Label>Price Range</Form.Label>
        {priceRanges.map((range) => (
          <Form.Check
            key={range.id}
            type="radio"
            name="priceRange"
            id={range.id}
            label={range.label}
            value={range.id}
            checked={selectedPriceRange === range.id}
            onChange={handlePriceRangeChange}
          />
        ))}
      </Form.Group>

      {/* Formality filter */}
      <Form.Group className="mb-3">
        <Form.Label>Formality</Form.Label>
        {formalities.map((formality) => (
          <Form.Check
            key={formality.id}
            type="checkbox"
            id={formality.id}
            label={formality.label}
            value={formality.id}
            checked={selectedFormalities.includes(formality.id)}
            onChange={handleFormalityChange}
          />
        ))}
      </Form.Group>
    </div>
  );
};

export default FilterPanel;
