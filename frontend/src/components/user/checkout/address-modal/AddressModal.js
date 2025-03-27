import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../../../../services/ghnService";

const AddressModal = ({
  show,
  handleClose,
  handleSave,
  modalType,
  selectedAddress,
}) => {
  // Initialize state for form data and location options
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    fullAddress: "",
    default: false,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Fetch provinces when the component mounts
  useEffect(() => {
    fetchProvinces()
      .then((response) => setProvinces(response.data.data))
      .catch((error) => console.error("Error fetching provinces:", error));

    // If editing an address, populate the form with the selected address data
    if (modalType === "edit" && selectedAddress) {
      setForm({
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        provinceCode: selectedAddress.provinceCode,
        provinceName: selectedAddress.provinceName,
        districtCode: selectedAddress.districtCode,
        districtName: selectedAddress.districtName,
        wardCode: selectedAddress.wardCode,
        wardName: selectedAddress.wardName,
        fullAddress: selectedAddress.fullAddress,
        default: selectedAddress.default || false,
      });
      setSelectedProvince(selectedAddress.provinceCode);
      setSelectedDistrict(selectedAddress.districtCode);
      setSelectedWard(selectedAddress.wardCode);
    }
  }, [modalType, selectedAddress]);

  // Fetch districts when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince)
        .then((response) => {
          setDistricts(response.data.data || []);
          setWards([]); // Clear wards when province changes
        })
        .catch((error) => console.error("Error fetching districts:", error));
    }
  }, [selectedProvince]);

  // Fetch wards when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict)
        .then((response) => setWards(response.data.data || []))
        .catch((error) => console.error("Error fetching wards:", error));
    }
  }, [selectedDistrict]);

  // Handle form input changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle province selection change
  const handleProvinceChange = (e) => {
    const provinceIdString = e.target.value;
    const provinceId = parseInt(provinceIdString, 10);
    setSelectedProvince(provinceId);

    // Find the selected province and update the form
    const selectedProvince = provinces.find((p) => p.ProvinceID === provinceId);
    setForm({
      ...form,
      provinceCode: provinceIdString,
      provinceName: selectedProvince?.ProvinceName || "",
      districtCode: "", // Clear district when province changes
      districtName: "",
      wardCode: "", // Clear ward when province changes
      wardName: "",
    });
  };

  // Handle district selection change
  const handleDistrictChange = (e) => {
    const districtIdString = e.target.value;
    const districtId = parseInt(districtIdString, 10);
    setSelectedDistrict(districtId);

    // Find the selected district and update the form
    const selectedDistrict = districts.find((d) => d.DistrictID === districtId);
    setForm({
      ...form,
      districtCode: districtIdString,
      districtName: selectedDistrict?.DistrictName || "",
      wardCode: "", // Clear ward when district changes
      wardName: "",
    });
  };

  // Handle ward selection change
  const handleWardChange = (e) => {
    const wardIdString = e.target.value;
    // const wardId = parseInt(wardIdString, 10);
    setSelectedWard(wardIdString);

    // Find the selected ward and update the form
    const selectedWard = wards.find((w) => w.WardCode === wardIdString);
    setForm({
      ...form,
      wardCode: wardIdString,
      wardName: selectedWard?.WardName || "",
    });
  };

  // Handle the checkbox change for setting default address
  const handleDefaultChange = (e) => {
    setForm({
      ...form,
      default: e.target.checked,
    });
  };

  // Reset form to its initial state
  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      provinceCode: "",
      provinceName: "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
      fullAddress: "",
      default: false,
    });
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
  };

  // Close the modal and reset the form
  const handleCloseModal = () => {
    resetForm();
    handleClose();
  };

  // Save the form data and reset the form
  const onSave = () => {
    handleSave(form);
    resetForm();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === "create" ? "Create" : "Edit"} Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFullName">
            <Form.Label>Fullname</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleFormChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group controlId="formProvince">
            <Form.Label>Province</Form.Label>
            <Form.Select
              required
              onChange={handleProvinceChange}
              value={form.provinceCode}
            >
              <option value="">Choose province</option>
              {provinces.map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formDistrict">
            <Form.Label>District</Form.Label>
            <Form.Select
              required
              onChange={handleDistrictChange}
              value={form.districtCode}
              disabled={!form.provinceCode} // Disable if no province is selected
            >
              <option value="">Choose district</option>
              {districts.map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formWard">
            <Form.Label>Ward</Form.Label>
            <Form.Select
              required
              onChange={handleWardChange}
              value={form.wardCode}
              disabled={!form.districtCode} // Disable if no district is selected
            >
              <option value="">Choose ward</option>
              {wards.map((ward) => (
                <option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formFullAddress">
            <Form.Label>Full Address</Form.Label>
            <Form.Control
              required
              type="text"
              name="fullAddress"
              value={form.fullAddress}
              onChange={handleFormChange}
            />
          </Form.Group>

          <Form.Group controlId="defaultAddress">
            <Form.Check
              type="checkbox"
              id="default-address"  
              label="Set as Default Address"
              checked={form.default}
              onChange={handleDefaultChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddressModal;
