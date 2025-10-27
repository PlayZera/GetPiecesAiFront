import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useProduct, useAuth } from '../hooks/useApi';

export default function ProductDetail() {
  const { productId } = useParams();
  const { token } = useAuth();
  const [mainImage, setMainImage] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
            localStorage.getItem('darkMode') !== 'false')
  });

  // Hook para buscar produto
  const { 
    data: productData, 
    isLoading: loading, 
    error 
  } = useProduct(productId || '', token || undefined);

  const product = (productData as any)?.produto;

  // Aplica tema escuro no body
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

  // Define imagem principal quando produto carrega
  useEffect(() => {
    if (product?.imageUrls?.length > 0) {
      setMainImage(product.imageUrls[0]);
    } else if (product?.urlImagem) {
      setMainImage(product.urlImagem);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/20 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando produto
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aguarde um momento...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {error?.message || 'Produto não encontrado'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Verifique se o código do produto está correto ou tente novamente mais tarde
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
    <div className="min-h-full">
      <title>{product.NomeProduto} - Detalhes</title>

      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 shadow-lg group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-yellow-300 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 shadow-lg"
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-inner">
                    <img 
                      src={mainImage || product.urlImagem || 'https://placehold.co/600x600/e5e7eb/6b7280?text=Produto'} 
                      alt={product.NomeProduto}
                      className="w-full h-full object-contain object-center p-6"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://placehold.co/600x600/e5e7eb/6b7280?text=Produto'
                      }}
                    />
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {product.imageUrls && product.imageUrls.length > 1 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Outras imagens</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {product.imageUrls.map((url: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setMainImage(url)}
                          className={`relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden transition-all duration-200 ${
                            mainImage === url 
                              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 scale-105' 
                              : 'hover:scale-105 hover:shadow-lg'
                          }`}
                        >
                          <img 
                            src={url} 
                            alt={`${product.NomeProduto} - Imagem ${index + 1}`}
                            className="w-full h-full object-contain object-center p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://placehold.co/150x150/e5e7eb/6b7280?text=Erro'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    {product.Categoria || 'Categoria não informada'}
                  </span>
                  {product.Status && (
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${
                      product.Status === 'Ativo' 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                        : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
                    }`}>
                      {product.Status}
                    </span>
                  )}
                </div>

                {/* Title and Code */}
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
                    {product.NomeProduto}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Código:</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300">
                      {product.Codigo}
                    </span>
                  </div>
                </div>

                {/* Basic Description */}
                {product.DescricaoBasica && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></span>
                      Descrição
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-5">
                      {product.DescricaoBasica}
                    </p>
                  </div>
                )}

                {/* Material Type */}
                {product.TipoMaterial && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"></span>
                      Tipo de Material
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 pl-5">
                      {product.TipoMaterial}
                    </p>
                  </div>
                )}

                {/* Additional Information */}
                <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-700/20 dark:to-gray-800/20 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/30">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-3"></span>
                    Informações Adicionais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">{formatDate(product.criado)}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Atualizado em</dt>
                      <dd className="text-gray-900 dark:text-white font-medium">{formatDate(product.atualizado)}</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Description */}
            {product.DescricaoTecnica && (
              <div className="border-t border-gray-200/50 dark:border-gray-700/30 p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mr-3"></span>
                  Descrição Técnica
                </h3>
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300">
                  <ReactMarkdown>{product.DescricaoTecnica}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}