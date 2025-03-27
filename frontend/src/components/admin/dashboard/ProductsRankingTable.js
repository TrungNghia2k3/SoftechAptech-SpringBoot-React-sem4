import React from "react";
import { Table } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";

const ProductsRankingTable = React.memo(({ products }) => {
  return (
    <div className="products-ranking-table">
      <div className="p-2">
        <h5>
          <StarFill className="me-2" />
          MOST POPULAR PRODUCTS
        </h5>
        <hr />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Title</th>
            <th>Sold Items</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="fw-bold">{product.product.id}</td>
              <td>{product.product.title}</td>
              <td>{product.product.soldItems}</td>
              <td>{product.totalQuantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});

export default ProductsRankingTable;
