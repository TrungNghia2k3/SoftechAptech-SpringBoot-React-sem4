import { useEffect, useState } from "react";
import { getProductById } from "../services/productService";

const useProductDetails = (products) => {
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await Promise.all(
          products.map((product) => getProductById(product.productId))
        );
        setProductDetails(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (products.length && !productDetails.length) {
      fetchDetails();
    }
  }, [products, productDetails.length]);

  return productDetails;
};

export default useProductDetails;
