import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "../../../services/ghnService";

const AddressModal = ({
  show,
  handleClose,
  handleSave,
  modalType,
  selectedAddress,
}) => {
  const initialFormState = {
    fullName: "",
    phone: "",
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    fullAddress: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const fetchProvincesData = useCallback(async () => {
    try {
      const response = await fetchProvinces();
      setProvinces(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  }, []);

  const fetchDistrictsData = useCallback(async (provinceCode) => {
    try {
      const response = await fetchDistricts(provinceCode);
      setDistricts(response.data.data || []);
      setWards([]); // Clear wards when province changes
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  }, []);

  const fetchWardsData = useCallback(async (districtCode) => {
    try {
      const response = await fetchWards(districtCode);
      setWards(response.data.data || []);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  }, []);

  useEffect(() => {
    if (show) {
      fetchProvincesData();

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
        });

        fetchDistrictsData(selectedAddress.provinceCode);
        fetchWardsData(selectedAddress.districtCode);
      }
    } else {
      resetForm();
    }
  }, [show, modalType, selectedAddress, fetchProvincesData, fetchDistrictsData, fetchWardsData]);

  const handleInputChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const selectedProvince = provinces.find(
      (p) => p.ProvinceID === parseInt(provinceCode, 10)
    );
    setForm((prevForm) => ({
      ...prevForm,
      provinceCode,
      provinceName: selectedProvince?.ProvinceName || "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    }));
    fetchDistrictsData(provinceCode);
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const selectedDistrict = districts.find(
      (d) => d.DistrictID === parseInt(districtCode, 10)
    );
    setForm((prevForm) => ({
      ...prevForm,
      districtCode,
      districtName: selectedDistrict?.DistrictName || "",
      wardCode: "",
      wardName: "",
    }));
    fetchWardsData(districtCode);
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const selectedWard = wards.find((w) => w.WardCode === wardCode);
    setForm((prevForm) => ({
      ...prevForm,
      wardCode,
      wardName: selectedWard?.WardName || "",
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setDistricts([]);
    setWards([]);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const onSave = () => {
    handleSave(form);
    resetForm();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === "create" ? "Add" : "Edit"} Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleInputChange}
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
              disabled={!form.provinceCode} 
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
              value={String(form.wardCode)}
              disabled={!form.districtCode}
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
              onChange={handleInputChange}
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
