import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const createProduct = async (
  productRequest,
  imageMain,
  imageSubOne,
  imageSubTwo,
  audio
) => {
  try {
    const formData = new FormData();
    formData.append("request", JSON.stringify(productRequest));
    formData.append("imageMain", imageMain);
    if (imageSubOne) formData.append("imageSubOne", imageSubOne);
    if (imageSubTwo) formData.append("imageSubTwo", imageSubTwo);
    if (audio) formData.append("audio", audio); //them audio

    const response = await httpClient.post(API.CREATE_PRODUCT, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id,
  productRequest,
  imageMain,
  imageSubOne,
  imageSubTwo,
  audio
) => {
  try {
    const formData = new FormData();
    formData.append("request", JSON.stringify(productRequest));
    if (imageMain) formData.append("imageMain", imageMain);
    if (imageSubOne) formData.append("imageSubOne", imageSubOne);
    if (imageSubTwo) formData.append("imageSubTwo", imageSubTwo);
    if (audio) formData.append("audio", audio); //them audio

    const response = await httpClient.put(
      `${API.UPDATE_PRODUCT}/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// export const getAllProducts = async (sortBy = "id", sortDirection = "asc") => {
//   try {
//     const response = await httpClient.get(API.GET_ALL_PRODUCTS, {
//       params: { sortBy, sortDirection },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };

export const getAllProducts = async (
  page = 1,
  size = 10,
  sortBy = "id",
  sortDirection = "asc"
) => {
  try {
    const response = await httpClient.get(API.GET_ALL_PRODUCTS, {
      params: { page, size, sortBy, sortDirection },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const searchProducts = async (keyword) => {
  try {
    const response = await httpClient.get(API.SEARCH_PRODUCTS, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const rankingMostPopularProducts = async () => {
  try {
    const response = await httpClient.get(API.RANKING_MOST_POPULAR_PRODUCTS, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product by author name:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await httpClient.get(`${API.GET_PRODUCT_BY_ID}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

export const getAllProductsByCategoryId = async (categoryId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_PRODUCTS_BY_CATEGORY_ID}/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product by category id:", error);
    throw error;
  }
};

export const getAllProductsByPublisherId = async (publisherId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_PRODUCTS_BY_PUBLISHER_ID}/${publisherId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product by publisher id:", error);
    throw error;
  }
};

export const getAllProductsByManufactureId = async (manufactureId) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_PRODUCTS_BY_MANUFACTURE_ID}/${manufactureId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product by manufacture id:", error);
    throw error;
  }
};

export const getAllProductsByAuthorName = async (authorName) => {
  try {
    const response = await httpClient.get(
      `${API.GET_ALL_PRODUCTS_BY_AUTHOR}/${authorName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product by author name:", error);
    throw error;
  }
};

// Fetch sản phẩm đã lọc dựa trên các bộ lọc
export const fetchFilteredProductsFromAPI = async (params) => {
  const query = new URLSearchParams(params).toString(); // Chuyển đổi đối tượng params thành chuỗi query
  const response = await fetch(`http://localhost:8080/api/products?${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
