import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ImportProductModal from "../../components/admin/inventory/ImportProductModal";
import ProductTable from "../../components/admin/inventory/ProductTable";
import ViewManufacturesModal from "../../components/admin/inventory/ViewManufacturesModal";
import {
  deleteManufactureProduct,
  editManufactureProduct,
  getManufacturesByProductId,
  importProduct,
} from "../../services/manufactureProductsService";
import { getAllManufactures } from "../../services/manufacturesService";
import { getAllProducts, searchProducts } from "../../services/productService";
import LoadMoreButton from "../../components/admin/inventory/LoadMoreButton";
import { Button, Col, Form, Row } from "react-bootstrap";
import EditManufactureModal from "../../components/admin/inventory/EditManufactureModal";
import DeleteConfirmationModal from "../../components/admin/inventory/DeleteConfirmationModal";
const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const [showImportModal, setShowImportModal] = useState(false);
  const [showViewManufacturesModal, setShowViewManufacturesModal] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manufactures, setManufactures] = useState([]);
  const [selectedManufacture, setSelectedManufacture] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceOfUnits, setPriceOfUnits] = useState(0);
  const [productManufactures, setProductManufactures] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // State để lưu trữ từ khóa tìm kiếm
  const [isSearching, setIsSearching] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedManufactureProductId, setSelectedManufactureProductId] =
    useState(null);

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

  const openImportModal = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await getAllManufactures();
      setManufactures(response.result);
    } catch (error) {
      console.error("Error fetching manufactures:", error);
    }
    setShowImportModal(true);
  };

  const handleImportProduct = async () => {
    try {
      const request = {
        manufactureId: selectedManufacture,
        productId: selectedProduct.id,
        quantity: Number(quantity), // Ensure quantity is a number
        priceOfUnits: Number(priceOfUnits), // Ensure priceOfUnits is a number
      };
      await importProduct(request);

      // Update the product list locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                in_stock: Number(product.in_stock) + Number(quantity), // Ensure in_stock is a number
              }
            : product
        )
      );

      toast.success("Imported product successfully");
      setShowImportModal(false);
    } catch (error) {
      if (error.response.data.code === 1001) {
        const validationErrors = error.response.data.errors;
        for (const key in validationErrors) {
          toast.error(key + " " + validationErrors[key]);
        }
      } else {
        toast.error("An error occurred while importing the product.");
        console.error("Error importing product:", error);
      }
    }
  };

  const openViewManufacturesModal = async (product) => {
    try {
      const response = await getManufacturesByProductId(product.id);
      setProductManufactures(response.result);
      setShowViewManufacturesModal(true);
    } catch (error) {
      console.error("Error fetching manufactures for product:", error);
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
        setProducts([]);
        fetchProducts(1, sortBy, sortDirection);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getAllManufactures();
      setManufactures(response.result);
    } catch (error) {
      console.error("Error fetching manufactures:", error);
    }
    setSelectedManufactureProductId(id);
    setShowEditModal(true);
    setShowViewManufacturesModal(false); // Hide ViewManufacturesModal
  };

  const handleDelete = (id) => {
    console.log(id);
    setSelectedManufactureProductId(id);
    setShowDeleteModal(true);
    setShowViewManufacturesModal(false); // Hide ViewManufacturesModal
  };

  const handleUpdate = async (updatedData) => {
    try {
      // Prepare the request payload
      const request = {
        manufactureId: updatedData.selectedManufacture,
        productId: updatedData.productId,
        quantity: Number(updatedData.quantity), // Ensure quantity is a number
        priceOfUnits: Number(updatedData.priceOfUnits), // Ensure priceOfUnits is a number
      };

      // Call the API to update the manufacture product
      await editManufactureProduct(updatedData.id, request);

      // Check if the quantity has changed
      if (Number(updatedData.oldQuantity) !== Number(updatedData.quantity)) {
        // Update the product list locally by adjusting the in_stock value
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedData.productId
              ? {
                  ...product,
                  // Adjust the in_stock value: inStock - oldQuantity + new quantity
                  in_stock:
                    Number(product.in_stock) -
                    Number(updatedData.oldQuantity) +
                    Number(updatedData.quantity),
                }
              : product
          )
        );
      }

      // Show success notification
      toast.success("Updated product successfully");

      // Log updated data
      console.log("Updated data:", updatedData);

      // Close Edit Modal and open View Manufactures Modal
      setShowEditModal(false);
      setShowViewManufacturesModal(false);
    } catch (error) {
      // Handle error appropriately
      toast.error("Error updating product");
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteConfirm = async (deleteData) => {
    try {
      // Call the API to delete the manufacture product
      await deleteManufactureProduct(deleteData.id);

      // Log deleted data for debugging
      console.log("Deleted data:", deleteData);

      // Update the product list locally by adjusting the in_stock value
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === deleteData.productId
            ? {
                ...product,
                // Adjust the in_stock value: inStock - quantity
                in_stock:
                  Number(product.in_stock) - Number(deleteData.quantity),
              }
            : product
        )
      );

      // Close the Delete and ViewManufactures modals
      setShowDeleteModal(false);
      setShowViewManufacturesModal(false);

      // Optionally show a success message
      toast.success("Product deleted successfully");
    } catch (error) {
      // Handle error and show error message
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h1 className="fw-bold">Stock Inventory</h1>

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

      <>
        <ProductTable
          products={products}
          onImport={openImportModal}
          onViewManufactures={openViewManufacturesModal}
        />
        {!isSearching && (
          <LoadMoreButton
            onClick={handleLoadMore}
            isVisible={currentPage < totalPages}
          />
        )}
      </>

      <ViewManufacturesModal
        show={showViewManufacturesModal}
        onClose={() => setShowViewManufacturesModal(false)}
        productManufactures={productManufactures}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ImportProductModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        manufactures={manufactures}
        selectedManufacture={selectedManufacture}
        setSelectedManufacture={setSelectedManufacture}
        quantity={quantity}
        setQuantity={setQuantity}
        priceOfUnits={priceOfUnits}
        setPriceOfUnits={setPriceOfUnits}
        onImport={handleImportProduct}
      />

      <EditManufactureModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setShowViewManufacturesModal(true); // Show ViewManufacturesModal when Edit is closed
        }}
        manufactures={manufactures}
        manufactureId={selectedManufactureProductId}
        onUpdate={handleUpdate}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        manufactureId={selectedManufactureProductId}
        onClose={() => {
          setShowDeleteModal(false);
          setShowViewManufacturesModal(true); // Show ViewManufacturesModal when Delete is closed
        }}
        onDeleteConfirm={handleDeleteConfirm}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default InventoryManagement;
