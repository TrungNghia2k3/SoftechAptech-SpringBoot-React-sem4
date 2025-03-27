import React, { useCallback, useEffect, useState } from "react";
import AddressList from "../../components/user/checkout/AddressList";
import { useSelector } from "react-redux";
import {
  createAddress,
  editAddress,
  getAddressList,
} from "../../services/userAddressService";
import AddressModal from "../../components/user/checkout/address-modal/AddressModal";
import { toast, ToastContainer } from "react-toastify";

const Addresses = () => {
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const openModal = useCallback((type, address = null) => {
    setModalType(type);
    setSelectedAddress(address);
    setShowModal(true);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const addressData = await getAddressList(user.id);
        const addressList = addressData.result;

        if (addressList.length > 0) {
          setSelectedAddress(addressList[0].id);
        } else {
          openModal("create"); // Mở modal nếu không có địa chỉ nào
          toast.info("Please enter your address information");
        }

        setAddresses(addressList);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [user.id, openModal]);

  // Hàm đóng modal với điều kiện addresses phải có phần tử
  const closeModal = useCallback(() => {
    // Kiểm tra nếu addresses không rỗng
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0].id); // Đặt lại địa chỉ đầu tiên sau khi đóng modal
      setShowModal(false); // Đóng modal
    } else {
      toast.info("Please enter your address information");
    }
  }, [addresses]);

  const handleSave = async (formData) => {
    try {
      // Lưu địa chỉ dựa trên loại modal (tạo mới hoặc chỉnh sửa)
      const response =
        modalType === "create"
          ? await createAddress(user.id, formData)
          : await editAddress(user.id, selectedAddress.id, formData);

      toast.success(
        `${modalType === "create" ? "Create" : "Edit"} address successfully`
      );

      // Lấy lại danh sách địa chỉ sau khi lưu
      const addressData = await getAddressList(user.id);
      const addressList = addressData.result;

      // Tìm và đặt địa chỉ mặc định mới sau khi lưu
      const defaultAddress = addressList.find((address) => address.default);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else {
        setSelectedAddress(response.result.id);
      }

      // Cập nhật danh sách địa chỉ
      setAddresses(addressList);

      setShowModal(false); // Đóng modal
    } catch (error) {
      if (error.response?.data?.code === 1036) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.code === 1001) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach((key) =>
          toast.error(`${key} ${validationErrors[key]}`)
        );
      } else {
        toast.error("Add address failed. Please try again.");
      }
    }
  };

  const handleAddressSelect = useCallback((address) => {
    setSelectedAddress(address.id);
  }, []);

  console.log(selectedAddress);

  return (
    <>
      <h3 className="fw-bold">My Addresses</h3>
      <AddressList
        addresses={addresses}
        selectedAddress={selectedAddress}
        onAddressSelect={handleAddressSelect}
        onEditAddress={(address) => openModal("edit", address)}
        onAddNewAddress={() => openModal("create")}
      />

      {showModal && (
        <AddressModal
          show={showModal}
          handleClose={closeModal}
          handleSave={handleSave}
          selectedAddress={selectedAddress}
          modalType={modalType}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Addresses;
