import React from "react";
import DashboardCard from "./DashboardCard";
import {
  BsPeople,
  BsBox,
  BsTags,
  BsBuilding,
  BsClipboardData,
  BsChatDots,
} from "react-icons/bs";
import { CalculatorFill, Truck, Receipt } from "react-bootstrap-icons";
import { formatCurrencyVND } from "../../../utilities/Utils";

const DashboardCards = React.memo(({ data }) => {
  const {
    numberUsers,
    numberProducts,
    numberCategories,
    numberPublishers,
    numberOrders,
    numberFeedbacks,
    numberManufactures,
    totalSale,
  } = data;

  return (
    <>
      <DashboardCard
        title="Users"
        value={numberUsers}
        icon={<BsPeople />}
        link="/admin/users"
      />
      <DashboardCard
        title="Products"
        value={numberProducts}
        icon={<BsBox />}
        link="/admin/products"
      />
      <DashboardCard
        title="Categories"
        value={numberCategories}
        icon={<BsTags />}
        link="/admin/categories"
      />
      <DashboardCard
        title="Publishers"
        value={numberPublishers}
        icon={<BsBuilding />}
        link="/admin/publishers"
      />
      <DashboardCard
        title="Orders"
        value={numberOrders}
        icon={<BsClipboardData />}
        link="/admin/orders"
      />
      <DashboardCard
        title="Feedbacks"
        value={numberFeedbacks}
        icon={<BsChatDots />}
        link="/admin/feedbacks"
      />
      <DashboardCard
        title="Manufactures"
        value={numberManufactures}
        icon={<Truck />}
        link="/admin/manufactures"
      />
      <DashboardCard
        title="Coupons"
        value="View All"
        icon={<Receipt />}
        link="/admin/coupons"
      />
      <DashboardCard
        title="Total Sale"
        value={formatCurrencyVND(totalSale)}
        icon={<CalculatorFill />}
        link="/admin/orders"
      />
    </>
  );
});

export default DashboardCards;
