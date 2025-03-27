import React from "react";
import { Card } from "react-bootstrap";
import { formatLeadTime, formatCurrencyVND } from "../../../utilities/Utils";

const ShippingMethod = ({ leadTime, fee }) =>
  leadTime &&
  fee && (
    <div className="mt-3">
      <Card>
        <Card.Body>
          <h5>SHIPPING METHOD</h5>
          <p className="m-0">Lead Time: {formatLeadTime(leadTime)}</p>
          <p className="m-0">Shipping Fee: {formatCurrencyVND(fee)}</p>
        </Card.Body>
      </Card>
    </div>
  );

export default ShippingMethod;
