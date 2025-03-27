import { useEffect, useState } from "react";
import { getAddressList } from "../services/userAddressService";

const useAddresses = (userId) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addressData = await getAddressList(userId);
        setAddresses(addressData.result);
        if (addressData.result.length > 0) {
          setSelectedAddress(addressData.result[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [userId]);

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    refreshAddresses: () =>
      getAddressList(userId).then((data) => setAddresses(data.result)),
  };
};

export default useAddresses;
