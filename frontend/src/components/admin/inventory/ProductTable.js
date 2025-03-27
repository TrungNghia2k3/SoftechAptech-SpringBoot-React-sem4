import React from "react";
import { Table, Button } from "react-bootstrap";
import "./ProductTable.scss"; // Import CSS for responsive styling

const ProductTable = ({ products, onImport, onViewManufactures }) => {
  return (
    <div className="table-product-inventory-responsive">
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Main Image</th>
            <th>Sold Items</th>
            <th>In Stock</th>
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
              <td>{product.sold_items}</td>
              <td>{product.in_stock}</td>
              <td>
                <div className="btn-product-inventory">
                  <Button variant="primary" onClick={() => onImport(product)}>
                    Import Product
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => onViewManufactures(product)}
                  >
                    View Manufactures
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;
