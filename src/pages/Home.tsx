import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Produto {
  Codigo: string;
  NomeProduto: string;
  Status: string;
  Categoria: string,
  urlImagem: string;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ Categoria: '' })
  const [produtos, setProducts] = useState<Produto[]>([])
  const [paginaAtual, setCurrentPage] = useState(1)
  const [itensPorPagina] = useState(100)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarGrid = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const mockParaTestes:Produto[] = [
      {
        Codigo: "50478",
        NomeProduto: "TENIS 70T18-COM BICO COMPOSITE 40",
        Status: "TENIS DE SEGURANÇA CONFECCIONADO EM MICROFIBRA (TECIDO DE FIBRA CURTA DE",
        Categoria: "SEGU_01",
        urlImagem: "Sem imagem"
      },
      {
        Codigo: "50480",
        NomeProduto: "TENIS 70T18-COM BICO COMPOSITE 42",
        Status: "TENIS DE SEGURANÇA CONFECCIONADO EM MICROFIBRA (TECIDO DE FIBRA CURTA DE",
        Categoria: "SEGU_01",
        urlImagem: "https://btequipamentos.agilecdn.com.br/102156_1.jpg"
      },
      {
        Codigo: "50797",
        NomeProduto: "LUVA NITRILON VD 610 PROMAT  CA.3814",
        Status: "LUVA NITRILON VERDE 610 PROMAT LUVA EM NITRILON VERDE FORRADA 26CM PUNHO",
        Categoria: "SEGU_02",
        urlImagem: "Sem imagem"
      },
      {
        Codigo: "51779",
        NomeProduto: "ESTILETE RETRATIL STARRET S014",
        Status: "cancelado mrp",
        Categoria: "null",
        urlImagem: "https://live.staticflickr.com/4151/5433952208_382f210765_c.jpg"
      },
      {
        Codigo: "51834",
        NomeProduto: "PILHA ENERGIZER ALC  AA 1,5V CART C/ 2UN",
        Status: "",
        Categoria: "PILH_01",
        urlImagem: "https://lutandistribuidora.agilecdn.com.br/10842.jpg"
      },
      {
        Codigo: "52018",
        NomeProduto: "ROLO DE ESPUMA P PINTURA 5CM",
        Status: "aplicação rebobinadeira sjp06 e 9",
        Categoria: "ROLO_01",
        urlImagem: "Sem imagem"
      },
      {
        Codigo: "52030",
        NomeProduto: "DESENGRAXANTE UNIVERSAL OZZYJUICE SW-4",
        Status: "DESENGRAXANTE UNIVERSAL OZZYJUICE SW-4 / MARCA:CHEMFREE",
        Categoria: "DSGX_01",
        urlImagem: "https://media.hayley-group.co.uk/api/2/GET/IMAGE/WEBMAIN/40368600.jpg"
      },
      {
        Codigo: "52218",
        NomeProduto: "APRESENTADOR SEM FIO LASER POINT R400",
        Status: "APRESENTADOR SEM FIO LASER POINT R400",
        Categoria: "APRS_01",
        urlImagem: "https://images.tcdn.com.br/img/img_prod/591628/apresentador_sem_fio_logitech_r400_laser_pointer_vermelho_usb_preto_33113_1_8c4e091a42af7f51d61f12f8300c489f.jpg"
      },
      {
        Codigo: "77018",
        NomeProduto: "MOTOR SIEMENS 3KW 220/380V 50/60HZ",
        Status: "MATERIAL RECUPERADO",
        Categoria: "MOTO_01",
        urlImagem: "Sem imagem"
      },
      {
        Codigo: "77050",
        NomeProduto: "MOTOR SIEMENS 1LA7130-4AA91-Z",
        Status: "MATERIAL RECUPERADO",
        Categoria: "MOTO_01",
        urlImagem: "https://abfprdstorage.blob.core.windows.net/productmedia-abf/small_cccbfe774f1b8eda951860552e92fedda0373be3_801056_2.jpg"
      },
      {
        Codigo: "77585",
        NomeProduto: "REDUTOR MRIV50UO3AHB71A4B5/35,5 B3i=50,7",
        Status: "AJUSTADO CONFORME PLANILHA CURVA ABC REVISADA MANUTENÇÃO",
        Categoria: "REDT_01",
        urlImagem: "Sem imagem"
      },
      {
        Codigo: "78032",
        NomeProduto: "ROLAMENTO MANCAL LUCT 40 2LS",
        Status: "APLICAÇÃO SML ESTERIA NORDSON",
        Categoria: "ROLM_01",
        urlImagem: "https://tiimg.tistatic.com/fp/2/001/496/corrosion-resistant-pbc-linear-bearing-034.jpg"
      }
    ]

      setProducts(mockParaTestes)
      setTotalItems(mockParaTestes.length)
    } catch (erro) {
      console.error(`Erro ao executar chamada para exibir produtos da grid -> ${erro}`)
      setError('Erro ao carregar produtos. Tente novamente mais tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarGrid(/*paginaAtual, itensPorPagina*/)
  }, [paginaAtual, itensPorPagina])

  const totalPages = Math.ceil(totalItems / itensPorPagina)

  const irParaPagina = (pagina: number) => {
    console.log(`Indo para página: ${pagina}`)
    if (pagina >= 1 && pagina <= totalPages) {
      setCurrentPage(pagina)
    }
  }

  // Filtrar peças
  const filteredParts = produtos.filter(produto => {
    const matchesSearch = produto.NomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filters.Categoria ? produto.Categoria == filters.Categoria : true
    return matchesSearch && matchesCategory
  })

  // Gerar números de página com ellipsis
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 p-6">
      <title>🔧Busca de Peças</title>

      <h1 className="text-3xl font-bold text-center mb-8">🔧Busca de Peças</h1>
      
      {/* Barra de Busca */}
      <div className="max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Digite o nome da peça..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filtros */}
      <div className="flex gap-4 justify-center mb-8">
        <select
          className="p-2 rounded-lg border border-gray-300"
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

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Lista de Peças */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredParts.map(produto => (
              <div key={produto.Codigo} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <img 
                  src={produto.urlImagem || 'https://placehold.co/150x150/?text=Produto'} 
                  alt={produto.NomeProduto}
                  className="w-full h-48 object-contain mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://placehold.co/150x150?text=Produto'
                  }}
                />
                <h3 className="text-xl font-semibold mb-2">{produto.NomeProduto}</h3>
                <p className="text-gray-600 mb-2">Categoria: {produto.Categoria}</p>
                <p className="text-blue-600 font-bold mb-4">Código: {produto.Codigo}</p>
                <Link 
                  to={`/produto/${produto.Codigo}`} 
                  className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Ver Detalhes
                </Link>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {produtos.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-sm text-gray-600">
                Mostrando {(paginaAtual - 1) * itensPorPagina + 1} a{' '}
                {Math.min(paginaAtual * itensPorPagina, totalItems)} de {totalItems} itens
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => irParaPagina(1)}
                  disabled={paginaAtual === 1}
                  className={`px-3 py-1 rounded-md ${paginaAtual === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                >
                  «
                </button>
                
                <button
                  onClick={() => irParaPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                  className={`px-3 py-1 rounded-md ${paginaAtual === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                >
                  ‹
                </button>
                
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? irParaPagina(page) : null}
                    disabled={page === '...'}
                    className={`px-3 py-1 rounded-md ${page === paginaAtual ? 'bg-blue-500 text-white' : page === '...' ? 'bg-white text-gray-500 cursor-default' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => irParaPagina(paginaAtual + 1)}
                  disabled={paginaAtual === 999999}
                  className={`px-3 py-1 rounded-md ${paginaAtual === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                >
                  ›
                </button>
                
                <button
                  onClick={() => irParaPagina(totalPages)}
                  disabled={paginaAtual === totalPages}
                  className={`px-3 py-1 rounded-md ${paginaAtual === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}