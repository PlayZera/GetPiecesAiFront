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