import { AxiosInstance } from 'axios';

declare interface Product {
  Codigo: string;
  NomeProduto: string;
  Status: string;
  Categoria: string;
  urlImagem: string;
  TipoMaterial?: string;
  DescricaoTecnica?: string;
  criado?: string;
  atualizado?: string;
  imageUrls?: string[];
  DescricaoBasica?: string;
}

declare interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

declare interface ProductsResponse {
  data: Product[];
  message: number;
}

declare interface AuthResponse {
  token: string;
  expiresIn: number;
}

declare const api: AxiosInstance;

declare const ProductService: {
  getProduct: (id: string, token: string) => Promise<ApiResponse<Product>>;
  searchProducts: (query: string, token: string) => Promise<ApiResponse<Product[]>>;
  getAllProducts: (page?: number, limit?: number, token?: string) => Promise<ProductsResponse>;
};

declare const AuthService: {
  login: () => Promise<AuthResponse>;
};

export { api, ProductService, AuthService, ApiResponse, ProductsResponse, AuthResponse, Product };