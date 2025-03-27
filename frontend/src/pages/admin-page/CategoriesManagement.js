import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import CategoryModal from "../../components/admin/categories-management/modals/CategoryModal";
import CategoryTable from "../../components/admin/categories-management/tables/CategoryTable";
import ViewProductsModal from "../../components/admin/view-products-modal/ViewProductsModal";
import CustomPagination from "../../components/pagination/CustomPagination";
import {
  createCategory,
  deleteCategory,
  getAllPaginationSortCategories,
  toggleDisableCategory,
  updateCategory,
} from "../../services/categoryService";
import { getAllProductsByCategoryId } from "../../services/productService";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalType, setModalType] = useState("create");
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    code: "",
    images: "",
    disabled: false,
  });

  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]); // State for products
  const [showProductsModal, setShowProductsModal] = useState(false); // State for products modal

  useEffect(() => {
    fetchCategories(currentPage, sortBy, sortDirection);
  }, [currentPage, sortBy, sortDirection]);

  const fetchCategories = async (page, sortBy, sortDirection) => {
    try {
      const response = await getAllPaginationSortCategories(
        page,
        10,
        sortBy,
        sortDirection
      );
      setCategories(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleShowModal = (type, category = { name: "" }) => {
    setModalType(type);
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory({
      name: "",
      code: "",
      images: "",
      disabled: false,
    });
    setImage(null);
  };

  const handleSaveCategory = async () => {
    try {
      if (modalType === "create") {
        console.log(currentCategory.code, currentCategory.name, image);
        await createCategory(currentCategory.code, currentCategory.name, image);
        setCurrentPage(1);
        setSortDirection("desc");
        toast.success("Category created successfully");
      } else {
        await updateCategory(
          currentCategory.id,
          currentCategory.code,
          currentCategory.name,
          image
        );
        toast.success("Category updated successfully");
      }

      fetchCategories(currentPage, sortBy, sortDirection);
      handleCloseModal();
    } catch (error) {
      if (
        error.response.data.code === 1032 ||
        error.response.data.code === 1033
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to save category");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      // Call delete service function here
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories(currentPage, sortBy, sortDirection);
    } catch (error) {
      if (error.response.data.code === 1035) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleToggleDisable = async (category) => {
    try {
      await toggleDisableCategory(category.id);
      toast.success(
        `Category ${category.disabled ? "enabled" : "disabled"} successfully`
      );
      fetchCategories(currentPage, sortBy, sortDirection);
    } catch (error) {
      toast.error("Failed to toggle category status");
    }
  };

  const handleViewProducts = async (categoryId) => {
    try {
      const products = await getAllProductsByCategoryId(categoryId);
      console.log(products.result);
      if (products.result.length === 0) {
        toast.info("No products found for this category.");
      } else {
        setProducts(products.result);
        setShowProductsModal(true);
      }
    } catch (error) {
      if (error.response.data.code === 1024) {
        toast.info("No products found for this category.");
      } else {
        toast.error("Failed to fetch products");
      }
    }
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setProducts([]);
  };

  return (
    <>
      <h1 className="fw-bold">Categories Management</h1>
      <Button variant="success" onClick={() => handleShowModal("create")}>
        Create Category
      </Button>

      <div className="table-responsive mt-3">
        <CategoryTable
          categories={categories}
          onEdit={(category) => handleShowModal("edit", category)}
          onDelete={handleDeleteCategory}
          onToggleDisable={handleToggleDisable}
          onViewProductsModal={handleViewProducts} // Pass the function to CategoryTable
        />
      </div>

      <CategoryModal
        showModal={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={currentCategory}
        onImageChange={(file) => setImage(file)}
        onNameChange={(name) =>
          setCurrentCategory({ ...currentCategory, name })
        }
        onCodeChange={(code) =>
          setCurrentCategory({ ...currentCategory, code })
        }
        image={image}
      />

      <ViewProductsModal
        show={showProductsModal}
        onClose={handleCloseProductsModal}
        products={products}
        type={"Category"}
      />

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default CategoriesManagement;
