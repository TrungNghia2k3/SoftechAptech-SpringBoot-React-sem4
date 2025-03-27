import React from "react";
import { Badge, Button, Card, Form } from "react-bootstrap";

const AddressList = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  onEditAddress,
  onAddNewAddress,
}) => (
  <div
    className="delivery-address bg-white p-3"
    style={{ border: "1px solid #ccc", borderRadius: "8px" }}
  >
    <h5>SHIPPING ADDRESS</h5>
    <div className="delivery-address-list">
      {addresses.map((address) => (
        <Card key={address.id} style={{ marginBottom: "10px" }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  name="selectedAddress"
                  value={address.id}
                  checked={selectedAddress === address.id}
                  onChange={() => onAddressSelect(address)}
                  label={`${address.fullName}, ${address.phone}, ${address.fullAddress}`}
                  className="mb-0"
                />
                {address.default && <Badge bg="danger ms-3">Default</Badge>}
              </div>
              <Button variant="primary" onClick={() => onEditAddress(address)}>
                Edit
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
    <Button variant="success" onClick={onAddNewAddress}>
      Add New Address
    </Button>
  </div>
);

export default AddressList;
