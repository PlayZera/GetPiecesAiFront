import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

import { ProductService, AuthService } from '../api/api';

import type { ProdutosPagina } from '../models/produtosPagina.interface';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ Categoria: '' })
  const [produtos, setProducts] = useState<ProdutosPagina[]>([])
  const [paginaAtual, setCurrentPage] = useState(1)
  const [itensPorPagina] = useState(100)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
            localStorage.getItem('darkMode') !== 'false')
  })


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

  const gerarToken = async () => {
    try {

      if (localStorage.getItem('token') != undefined) {
        console.log('Token já existe:', localStorage.getItem('token'));
        return localStorage.getItem('token');
      }
      
      const response = await AuthService.login()

      const token = response.data.access_token;

      console.log('Token gerado com sucesso:', token);

      localStorage.setItem('authToken', token);

      return token;
      
    } catch (error) {
      console.error(`Erro ao gerar token: ${error}`);
      setError('Erro ao gerar token. Tente novamente mais tarde.');
    }
  }

  const carregarGrid = async (pagina: number, limite: number, token: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response= await ProductService.getAllProducts(pagina, limite, token)

      const produtos = await response.data.data.data;

      setProducts(produtos)
      setTotalItems(produtos.length)
      
    } catch (erro) {
      console.error(`Erro ao executar chamada para exibir produtos da grid -> ${erro}`)

      localStorage.removeItem('authToken');

      gerarToken().then(token => carregarGrid(pagina, limite, token ?? ''));
      
      setError('Erro ao carregar produtos. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    gerarToken().then(token => carregarGrid(paginaAtual, itensPorPagina, token ?? ''))
  }, [paginaAtual, itensPorPagina])

  const totalPages = Math.ceil(totalItems / itensPorPagina)

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPages) {
      setCurrentPage(pagina)
    }
  }

  const filteredParts = produtos.filter(produto => {
    const matchesSearch = produto.NomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filters.Categoria ? produto.Categoria == filters.Categoria : true
    return matchesSearch && matchesCategory
  })

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const leftBound = Math.max(1, paginaAtual - 2)
      const rightBound = Math.min(totalPages, paginaAtual + 2)
      
      if (leftBound > 1) pages.push(1)
      if (leftBound > 2) pages.push('...')
      
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i)
      }
      
      if (rightBound < totalPages - 1) pages.push('...')
      if (rightBound < totalPages) pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
      <title>🔧Busca de Peças</title>

      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho com toggle de tema */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center">
              <span className="mr-3">🔧</span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                Busca de Peças
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Encontre as peças que você precisa em nosso catálogo completo
            </p>
          </div>
          
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
        
        {/* Barra de Busca e Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar peça
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Digite o nome da peça..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                id="category"
                className="block w-full py-2.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={filters.Categoria}
                onChange={(e) => setFilters({ ...filters, Categoria: e.target.value })}
              >
                <option value="">Todas as Categorias</option>
                <option value="SEGU_01">Segurança</option>
                <option value="PILH_01">Pilhas</option>
                <option value="ROLO_01">Rolos</option>
                <option value="MOTO_01">Motores</option>
                <option value="APRS_01">Apresentadores</option>
                <option value="DSGX_01">Desengraxantes</option>
                <option value="REDT_01">Redutores</option>
                <option value="ROLM_01">Rolamentos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando produtos...</span>
          </div>
        )}

        {/* Lista de Peças */}
        {!isLoading && (
          <>
            {/* Contagem de resultados */}
            {filteredParts.length > 0 && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {filteredParts.length} {filteredParts.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredParts.length > 0 ? (
                filteredParts.map(produto => (
                  <div 
                    key={produto.Codigo} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4 flex-1">
                      <div className="aspect-w-1 aspect-h-1 w-full bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                        <img 
                          src={produto.urlImagem || 'https://placehold.co/300x300/e5e7eb/6b7280?text=Produto'} 
                          alt={produto.NomeProduto}
                          className="w-full h-48 object-contain object-center"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://placehold.co/300x300/e5e7eb/6b7280?text=Produto'
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {produto.NomeProduto}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {produto.Categoria ?? "Sem Categoria"}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">
                        Código: {produto.Codigo}
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <Link 
                        to={`/produto/${produto.Codigo}`} 
                        className="block w-full text-center bg-blue-400 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors color"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Nenhum produto encontrado</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Tente ajustar sua busca ou filtros</p>
                </div>
              )}
            </div>

            {/* Paginação */}
            {filteredParts.length > 0 && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando <span className="font-medium dark:text-white">{(paginaAtual - 1) * itensPorPagina + 1}</span> a{' '}
                  <span className="font-medium dark:text-white">{Math.min(paginaAtual * itensPorPagina, totalItems)}</span> de{' '}
                  <span className="font-medium dark:text-white">{totalItems}</span> itens
                </div>
                
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => irParaPagina(1)}
                    disabled={paginaAtual === 1}
                    className={`px-3 py-1.5 rounded-md ${paginaAtual === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'}`}
                    aria-label="Primeira página"
                  >
                    «
                  </button>
                  
                  <button
                    onClick={() => irParaPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className={`px-3 py-1.5 rounded-md ${paginaAtual === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'}`}
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? irParaPagina(page) : null}
                      disabled={page === '...'}
                      className={`px-3.5 py-1.5 rounded-md ${page === paginaAtual ? 'bg-blue-600 text-white' : page === '...' ? 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'}`}
                      aria-current={page === paginaAtual ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => irParaPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPages}
                    className={`px-3 py-1.5 rounded-md ${paginaAtual === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'}`}
                    aria-label="Próxima página"
                  >
                    ›
                  </button>
                  
                  <button
                    onClick={() => irParaPagina(totalPages)}
                    disabled={paginaAtual === totalPages}
                    className={`px-3 py-1.5 rounded-md ${paginaAtual === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'}`}
                    aria-label="Última página"
                  >
                    »
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}