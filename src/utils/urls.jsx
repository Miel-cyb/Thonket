
//192.168.16.143
//10.10.60.132
//10.10.61.80
const CATEGORY_BASE_URL = 'http://192.168.22.143:5002/api/categories'; // Change this to your backend URL

const PRODUCT_BASE_URL = 'http://192.168.22.143:5002/api/products'; // Change this to your backend URL

const PRICE_BASE_URL = 'http://192.168.22.143:5002/api/prices';

const SUPPLIER_BASE_URL = 'http://192.168.22.143:5004/api/supplier';

const PURCHASE_ORDER_BASE_URL = 'http://192.168.22.143:5004/api/purchase-order';

export const API_ENDPOINTS = {
    CATEGORIES: CATEGORY_BASE_URL,
    PRODUCTS: PRODUCT_BASE_URL,
    PRICES: PRICE_BASE_URL,
    SUPPLIERS: SUPPLIER_BASE_URL,
    PURCHASE_ORDERS: PURCHASE_ORDER_BASE_URL,
    // Add more endpoints as needed
};