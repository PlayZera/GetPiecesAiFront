export interface Produto {
  Codigo: string;
  NomeProduto: string;
  Status?: string;
  Categoria: string;
  urlImagem: string;
  TipoMaterial?: string;
  DescricaoTecnica?: string;
  criado?: string;
  atualizado?: string;
  imageUrls?: string[];
  DescricaoBasica?: string;
}

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
