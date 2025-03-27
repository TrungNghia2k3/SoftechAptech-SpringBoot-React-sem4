export const OAuthConfig = {
  clientId:
    "717110965142-vvo65i71osc992k0983lfbo7m73sg2ha.apps.googleusercontent.com",
  redirectUri: "http://localhost:3000/authenticate", //Google sẽ trả response về Url này
  authUri: "https://accounts.google.com/o/oauth2/auth",
};

export const GHNConfig = {
  tokenApi: "5f63213c-4842-11ef-8e53-0a00184fe694",

  // https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/all (with header tokenApi)
  data: {
    last_offset: 197411,
    shops: [
      {
        _id: 193102,
        name: "Softech Aptech Book Store",
        phone: "0799353628",
        address: "38 Yên Bái",
        ward_code: "40103",
        district_id: 1526,
        client_id: 2507857,
        bank_account_id: 0,
        status: 1,
        location: {},
        version_no: "94f6762e-e8f7-43c9-b392-1d277ae0917b",
        is_created_chat_channel: false,
        updated_ip: "171.225.184.120",
        updated_employee: 0,
        updated_client: 2507857,
        updated_source: "shiip",
        updated_date: "2024-07-22T15:58:49.419Z",
        created_ip: "",
        created_employee: 0,
        created_client: 0,
        created_source: "",
        created_date: "2024-07-22T15:51:11.38Z",
      },
    ],
  },
};

export const CONFIG = {
  API_GATEWAY: "http://localhost:8080/api",
};

export const API = {
  // Authentication
  LOGIN: "/auth/token",
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",

  // User
  MY_INFO: "/users/my-info",
  CHANGE_PASSWORD: "/users/change-password",
  CREATE_USER: "/users",
  VERIFY_ACCOUNT: "/users/verify-account",
  REGENERATE_OTP: "/users/regenerate-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  RESET_PASSWORD: "/users/reset-password",
  GET_ALL_USERS: "/users",
  GET_USER: "/users",
  GET_ALL_USERS_PAGINATION_SORT: "/users/pagination-sort",
  UPDATE_USER: "/users",

  // Permissions
  CREATE_PERMISSION: "/permissions",
  GET_ALL_PERMISSION: "/permissions",
  DELETE_PERMISSON: "/permissions",

  // Categories
  CREATE_CATEGORY: "/categories/create",
  UPDATE_CATEGORY: "/categories",
  GET_ALL_CATEGORIES: "/categories",
  SEARCH_BY_KEYWORD: "/categories/search",
  GET_ALL_CATAGORIES_PAGINATION_SORT: "/categories/pagination-sort",
  GET_CATEGORY_BY_ID: "/categories",
  TOGGLE_DISABLE_CATEGORY: "/categories",
  DELETE_CATEGORY: "/categories",

  // Products
  CREATE_PRODUCT: "/products/create",
  GET_PRODUCT_BY_ID: "/products",
  UPDATE_PRODUCT: "/products",
  GET_ALL_PRODUCTS: "/products/getAll",
  GET_ALL_PRODUCTS_BY_CATEGORY_ID: "/products/category",
  GET_ALL_PRODUCTS_BY_PUBLISHER_ID: "/products/publisher",
  GET_ALL_PRODUCTS_BY_MANUFACTURE_ID: "/products/manufacture",
  GET_ALL_PRODUCTS_BY_AUTHOR: "products/author",
  FILTER_PRODUCTS: "/products",
  RANKING_MOST_POPULAR_PRODUCTS: "/products/rankingMostPopularProducts",
  SEARCH_PRODUCTS: "/products/search",

  // Transaction
  CASH_ON_DELIVERY: "/transactions/cash-on-delivery",

  // Payment
  PAY: "/payment/vn-pay",
  CALLBACK_PAY: "/transactions/vn-pay-callback",

  // Publisher
  GET_ALL_PUBLISHERS: "/publishers",
  CREATE_PUBLISHER: "/publishers/add",
  EDIT_PUBLISHER: "/publishers",
  DELETE_PUBLISHER: "/publishers",
  GET_PUBLISHER_BY_ID: "/publishers",
  GET_ALL_PUBLISHERS_PAGINATION_SORT: "/publishers/pagination-sort",
  TOGGLE_DISABLE_PUBLISHER: "/publishers",

  //Manufacture
  CREATE_MANUFACTURE: "/manufactures/create",
  GET_ALL_MANUFACTURE: "/manufactures",
  DELETE_MANUFACTURE: "/manufactures",
  EDIT_MANUFACTURE: "/manufactures",
  GET_MANUFACTURE_BY_ID: "/manufactures",
  GET_ALL_MANUFACTURES_PAGINATION_SORT: "/manufactures/pagination-sort",

  // Cart
  ADD_TO_CART: "/cart/add",
  GET_CART_BY_USER_ID: "/cart",
  EDIT_CART_PRODUCT_QUANTITIES: "/cart/edit",
  REMOVE_PRODUCT_FROM_CART: "/cart/remove",

  // UserAddress
  GET_ADDRESS_LIST: "/useraddresses",
  CREATE_ADDRESS: "/useraddresses",
  EDIT_ADDRESS: "/useraddresses",

  // Order
  CREATE_ORDER: "/order/create",
  GET_ALL_ORDERS_BY_USER_ID: "/order/getAll",
  GET_ALL_ORDERS: "/order/getAll",
  GET_ORDER_SUMMARY: "/order/getOrderSummary",
  GET_ALL_ORDERS_WITH_ORDER_PLACED_STATUS:
    "/order/getAllOrdersWithOrderPlacedStatus",
  GET_ORDER_BY_ID: "/order/getById",
  CANCEL_ORDER: "/order/changeStatusCancel",
  UPDATE_ORDER_STATUS: "/order/changeStatusOrder",

  //Feedback
  CREATE_FEEDBACK: "/feedbacks/create",
  GET_ALL_FEEDBACKS: "/feedbacks",
  DELETE_FEEDBACK: "/feedbacks",
  GET_ALL_FEEDBACKS_PAGINATION_SORT: "/feedbacks/pagination-sort",

  // Manufactures
  GET_ALL_MANUFACTURES: "/manufactures",

  // ManufactureProducts
  IMPORT_PRODUCT: "/manufacture-products/import",
  GET_MANUFACTURES_BY_PRODUCT_ID: "/manufacture-products/product",
  GET_MANUFACTURE_PRODUCT_BY_ID: "/manufacture-products/getById",
  EDIT_MANUFACTURE_PRODUCT: "/manufacture-products/edit",
  DELETE_MANUFACTURE_PRODUCT: "/manufacture-products/delete",

  // Notifications
  GET_ALL_NOTIFICATIONS_BY_USER_ID: "/notifications",
  MARK_ALL_NOTIFICATIONS_AS_READ: "/notifications/markAllAsRead",

  // Wishlist
  GET_WISHLIST_BY_USER_ID: "/wishlist/user",
  ADD_PRODUCT_TO_WISHLIST: "/wishlist/add",
  REMOVE_PRODUCT_FROM_WISHLIST: "/wishlist/remove",
  CHECK_IF_IN_WISH_LIST: "/wishlist/check",

  //Coupon
  CREATE_COUPON: "/coupons",
  GET_ALL_COUPONS_PAGINATION_SORT: "/coupons/pagination-sort",
  GET_ALL_COUPONS: "/coupons",
  EDIT_COUPON: "/coupons",
  DELETE_COUPON: "/coupons",
  GET_COUPON_BY_ID: "/coupons",
  REDEEM_COUPON: "/coupons/redeem-coupon",
  GET_ALL_COUPONS_BY_USER_ID: "/coupons/user",
  APPLY_COUPONS: "/coupons/apply",

  // Comment
  GET_COMMENT_BY_ID: "/comments/getById",
  GET_ALL_COMMENTS: "/comments/getAllComments",
  ADD_ADMIN_RESPONSE: "/comments/admin-response",
  GET_ALL_COMMENT_AND_RATING_BY_PRODUCT_ID: "/comments/getAllCommentAndRatingByProductId",
  CREATE_COMMENT_AND_RATING: "/comments/create",
  CHECK_USER_PURCHASED_PRODUCT: "/comments/check",
  UPDATE_COMMENT_AND_RATING: "/comments/update",
  DELETE_COMMENT_AND_RATING: "/comments/remove",
};
