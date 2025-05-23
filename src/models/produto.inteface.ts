export interface Produto {
  Codigo: string;
  NomeProduto: string;
  TipoMaterial: string;
  Status?: string;
  DescricaoTecnica: string;
  criado: string;
  atualizado: string;
  imageUrls: string[];
  Categoria: string;
  DescricaoBasica: string;
}