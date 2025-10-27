import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useProducts, useAuth } from '../hooks/useApi';

export default function Home() {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ Categoria: '' });
  const [paginaAtual, setCurrentPage] = useState(1);
  const [itensPorPagina] = useState(100);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
            localStorage.getItem('darkMode') !== 'false');
  });

  // Hook para buscar produtos
  const { 
    data: productsData, 
    isLoading, 
    error 
  } = useProducts(paginaAtual, itensPorPagina, token || '');

  const products = (productsData as any)?.produtos || [];

  // Aplica tema escuro no body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filtra produtos
  const filteredParts = products.filter((produto: any) => {
    const matchesSearch = produto.NomeProduto?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         produto.Codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.Categoria || produto.Categoria === filters.Categoria;
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredParts.length / itensPorPagina);
  const startIndex = (paginaAtual - 1) * itensPorPagina;
  const paginatedProducts = filteredParts.slice(startIndex, startIndex + itensPorPagina);

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPages) {
      setCurrentPage(pagina);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBound = Math.max(1, paginaAtual - 2);
      const rightBound = Math.min(totalPages, paginaAtual + 2);
      
      if (leftBound > 1) pages.push(1);
      if (leftBound > 2) pages.push('...');
      
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }
      
      if (rightBound < totalPages - 1) pages.push('...');
      if (rightBound < totalPages) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-full p-6">
      <title>🔧Busca de Peças</title>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent mb-3">
                🔧 Busca de Peças
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Encontre as peças que você precisa rapidamente
              </p>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-yellow-300 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 shadow-lg"
              aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar peças por nome..."
                  className="block w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <select
                className="block w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                value={filters.Categoria}
                onChange={(e) => setFilters({ ...filters, Categoria: e.target.value })}
              >
                <option value="">Todas as categorias</option>
                <option value="SEGU_01">🛡️ Segurança</option>
                <option value="PILH_01">🔋 Pilhas</option>
                <option value="ROLO_01">🎡 Rolos</option>
                <option value="MOTO_01">⚙️ Motores</option>
                <option value="APRS_01">📊 Apresentadores</option>
                <option value="DSGX_01">🧽 Desengraxantes</option>
                <option value="REDT_01">🔧 Redutores</option>
                <option value="ROLM_01">⚡ Rolamentos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">{error?.message || 'Erro ao carregar produtos'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">Carregando produtos...</span>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {/* Results Info */}
            {filteredParts.length > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  <span className="font-bold text-gray-900 dark:text-white">{filteredParts.length}</span> produtos encontrados
                  {searchTerm && (
                    <span> para "<span className="font-semibold">{searchTerm}</span>"</span>
                  )}
                </p>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((produto: any) => (
                  <Link
                    key={produto.Codigo}
                    to={`/produto/${produto.Codigo}`}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/30 hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      <img 
                        src={produto.urlImagem || 'https://placehold.co/300x300/e5e7eb/6b7280?text=Produto'} 
                        alt={produto.NomeProduto}
                        className="w-full h-full object-contain object-center p-4 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x300/e5e7eb/6b7280?text=Produto';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                          {produto.Categoria || 'Sem categoria'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {produto.NomeProduto}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Código: <span className="font-mono">{produto.Codigo}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          Ver detalhes
                        </span>
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum produto encontrado</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tente ajustar os filtros ou termos de busca.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Página <span className="font-semibold">{paginaAtual}</span> de{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => irParaPagina(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                      className="p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' ? irParaPagina(page) : undefined}
                        disabled={typeof page !== 'number'}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          page === paginaAtual
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : typeof page === 'number'
                            ? 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                            : 'text-gray-400 cursor-default'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => irParaPagina(paginaAtual + 1)}
                      disabled={paginaAtual === totalPages}
                      className="p-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}