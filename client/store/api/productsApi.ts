import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  discountPercentage?: number;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
}

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({

    getDummyJsonProducts: builder.query<ProductsResponse, { limit?: number; skip?: number; category?: string }>({
      query: ({ limit = 20, skip = 0, category }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: skip.toString(),
        });
        
        const baseUrl = category 
          ? `https://dummyjson.com/products/category/${category}`
          : 'https://dummyjson.com/products';
          
        return `${baseUrl}?${params}`;
      },
    }),
    
    getDummyJsonProduct: builder.query<DummyJsonProduct, number>({
      query: (id) => `https://dummyjson.com/products/${id}`,
    }),
    
    getDummyJsonCategories: builder.query<string[], void>({
      query: () => 'https://dummyjson.com/products/categories',
    }),
    
    getFakeStoreProducts: builder.query<Product[], { category?: string }>({
      query: ({ category }) => {
        const baseUrl = category 
          ? `https://fakestoreapi.com/products/category/${category}`
          : 'https://fakestoreapi.com/products';
        return baseUrl;
      },
    }),
    
    getFakeStoreProduct: builder.query<Product, number>({
      query: (id) => `https://fakestoreapi.com/products/${id}`,
    }),
    
    getFakeStoreCategories: builder.query<string[], void>({
      query: () => 'https://fakestoreapi.com/products/categories',
    }),

    searchDummyJsonProducts: builder.query<ProductsResponse, string>({
      query: (searchTerm) => `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`,
    }),
  }),
});

export const {
  useGetDummyJsonProductsQuery,
  useGetDummyJsonProductQuery,
  useGetDummyJsonCategoriesQuery,
  useGetFakeStoreProductsQuery,
  useGetFakeStoreProductQuery,
  useGetFakeStoreCategoriesQuery,
  useSearchDummyJsonProductsQuery,
} = productsApi;
