import type { Produto } from "./produto.inteface";

export interface RespostaApi<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface RespostaProduto {
  data: Produto[];
  message: number;
}

export interface RespostaAutenticacao {
  access_token: string;
}
