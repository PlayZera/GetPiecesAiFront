import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

import { ProductService } from '../api/api'
import type { RespostaApi } from '../models/respostaApi.interface';
import type { Produto } from '../models/produto.inteface';

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Produto>();
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
            localStorage.getItem('darkMode') !== 'false')
  });

  // Aplicar tema escuro no body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        const response = await fetch(`https://get-pieces-api-production.up.railway.app/products/${productId}?token=${token}`);
        
        const produto = await response.json();

        console.log(produto);

        if (!produto.sucesso) {
          throw new Error(produto.mensagem || 'Produto não encontrado');
        }

        setProduct(produto.produto);

        if (produto.produto.imageUrls?.length > 0) {
          setMainImage(produto.produto.imageUrls[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-3">{error || 'Produto não encontrado'}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">Verifique se o código do produto está correto</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 transition-colors duration-200">
      <title>{product.NomeProduto}</title>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb e toggle de tema */}
        <div className="flex justify-between items-center mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
              <li className="inline-flex items-center">
                <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-500 dark:text-gray-400 md:ml-2">{product.NomeProduto}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Galeria de Imagens */}
          <div className="lg:w-1/2">
            <div className="sticky top-4">
              {/* Imagem principal */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
                <img
                  src={mainImage || product.imageUrls[0] || 'https://placehold.co/600x600/e5e7eb/6b7280?text=Sem+Imagem'}
                  alt={product.NomeProduto}
                  className="w-full h-96 object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x600/e5e7eb/6b7280?text=Imagem+Não+Disponível';
                  }}
                />
              </div>
              
              {/* Miniaturas */}
              {product.imageUrls?.length > 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Outras imagens</h3>
                  <div className="flex gap-3 overflow-x-auto py-1">
                    {product.imageUrls.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setMainImage(img)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                      >
                        <img
                          src={img}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/100x100/e5e7eb/6b7280?text=Imagem';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="lg:w-1/2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              {/* Cabeçalho */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  {/* Status */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.Status?.includes('cancelado') 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                      : product.Status?.includes('ativo') 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  }`}>
                    {product.Status}
                  </span>
                  
                  {/* Código */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Código: {product.Codigo}</p>
                </div>
                
                {/* Categoria */}
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    {product.Categoria}
                  </span>
                </div>
              </div>
              
              {/* Nome do Produto */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.NomeProduto}</h1>
              
              {/* Material */}
              <div className="flex items-center text-gray-700 dark:text-gray-300 mb-6">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="font-medium">Material:</span>
                <span className="ml-1">{product.TipoMaterial || 'Não especificado'}</span>
              </div>
              
              {/* Descrição Básica */}
              {product.DescricaoBasica && (
                <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Descrição</h3>
                  <p className="text-gray-700 dark:text-gray-300">{product.DescricaoBasica}</p>
                </div>
              )}
              
              {/* Descrição Técnica */}
              <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Especificações Técnicas</h3>
                {product.DescricaoTecnica ? (
                  product.DescricaoTecnica.split('\n').map((paragraph, i) => (
                    <div key={i} className="mb-3 text-gray-700 dark:text-gray-300">
                      <ReactMarkdown>{paragraph}</ReactMarkdown>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma descrição técnica disponível</p>
                )}
              </div>
              
              {/* Metadados */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Cadastrado em:</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(product.criado)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Última atualização:</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(product.atualizado)}</p>
                  </div>
                </div>
              </div>
              
              {/* Botão de Voltar */}
              <div className="mt-8">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar para a lista de produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}