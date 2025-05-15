import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Produto {
  Codigo: string;
  NomeProduto: string;
  Status: string;
  Categoria: string,
  urlsImagem: string[];
  DescricaoTecnica: string;
}


export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Produto>();
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const mockParaTestes: Produto[] = [
          {
            Codigo: "50478",
            NomeProduto: "TENIS 70T18-COM BICO COMPOSITE 40",
            Status: "TENIS DE SEGURANÇA CONFECCIONADO EM MICROFIBRA (TECIDO DE FIBRA CURTA DE",
            Categoria: "SEGU_01",
            urlsImagem: [],
            DescricaoTecnica: ""
          },
          {
            Codigo: "50480",
            NomeProduto: "TENIS 70T18-COM BICO COMPOSITE 42",
            Status: "TENIS DE SEGURANÇA CONFECCIONADO EM MICROFIBRA (TECIDO DE FIBRA CURTA DE",
            Categoria: "SEGU_01",
            urlsImagem: ["https://btequipamentos.agilecdn.com.br/102156_1.jpg"],
            DescricaoTecnica: " ## Descrição Técnica\n    - Produto: Tenis 70T18-Com Bico Composito 40\n    - Material principal: Micofibra ZCON\n    - Categoria: SEGU_01 (Segurança)\n    - Tipo de Sole: Solado Injetado\n    - Resistente à água e produtos químicos\n    - Transpirável e lavavel\n    - Antibacteriano, antimagnetica, anticorrosiva e ultra-resistente\n    - Colarinho e lingueta soft\n    - Palmilha policlorester resinado\n    - C.A: 42586; Número: 40\n    - Fabricante: Marluvas\n\n   ## Site Oficial\n   - [Superepi](https://www.superepi.com.br/sapato-de-seguranca-marluvas-70t19-c-pad-microfibra-bico-composite-isolante-eletrico-ca-34556-2097-p1053303)\n   - [Epiemro](https://www.epiemro.com.br/tenis-marluvas-solado-70t18-bico-plastico-preto-ca34524-118495-1)\n   - [Epiemro](https://www.epiemro.com.br/tenis-marluvas-microfibra-70t18co-bico-composite-ca42586-102147-4)\n   - [Dimensional](https://www.dimensional.com.br/tenis-microfibra-cadarco-bidensidade-bico-de-plastico-preta-n33-70t18cobp---marluvas/p)\n   - [Marluvas](https://www.marluvas.com.br/products/246/tenis-da-linha-new-prime-ref-70t18-co-c)\n\n   ## Exemplos de Uso\n    - Emprego em ambientes industriais e laboratoriais onde o risco de lesão por acidente é elevado.\n    - Aplicação na indústria elétrica devido à sua resistentes a água e produtos químicos, além da característica isolante eletricamente."
          },
          {
            Codigo: "50797",
            NomeProduto: "LUVA NITRILON VD 610 PROMAT  CA.3814",
            Status: "LUVA NITRILON VERDE 610 PROMAT LUVA EM NITRILON VERDE FORRADA 26CM PUNHO",
            Categoria: "SEGU_02",
            urlsImagem: [
              "https://safetytrab.com.br/wp-content/uploads/2016/01/Luva-de-Protecao-Nitrilon-610-Promat-CA-3814_.jpg",
              "https://www.locaminas.com.br/produtos/8332016041249.jpg",
              "https://safetytrab.com.br/wp-content/uploads/2016/01/Luva-de-Protecao-Nitrilon-610-Promat-CA-3814_-247x247.jpg"
            ],
            DescricaoTecnica: " ## Descrição Técnica\n\n    - Produto: Luva Nitrilon VD 610 PROMAT\n    - Material: ZCON (Nitrilon)\n    - Cor: Verde\n    - Tipo de Forração: Forrada\n    - Tamanho Punho: 26CM Malha\n    - Palma: 8,5CM\n    - Certificado: CA3814\n    - Fabricante: PROMAT\n    - Referência: VD 610\n\n   ## Site Oficial\n\n   - [Luva de Nitrilon Latex Natural Tam 9.5/610 Promat](https://www.cordeiromaquinas.com.br/epi-e-sinalizacao/luvas/luva-de-nitrilon-latex-natural-tam-9-5-610-promat)\n   - [Luva de Segurança Proteção Nitrilion 610 Promat](https://safetytrab.com.br/produto/luva-de-seguranca-protecao-nitrilon-610-promat/)\n   - [Loja ConsuSegePI](https://www.consusegepi.com.br/produtos.php?cat=6)\n   - [Luva de Segurança Nitrilion Promat 610](https://www.boapracaepi.com.br/luvas/luva-de-seguranca-nitrilion-promat-610)\n   - [ConsultaCA – Luva para Proteção contra Agentes Mecânicos](https://consultaca.com/3814/luva-para-protecao-contra-agentes-mecanicos)\n\n   ## Exemplos de Uso\n\n   - Proteção contra agentes químicos e físicos\n   - Trabalho com máquinas, solda e metalurgia\n   - Usada em laboratórios de engenharia e química\n   - Proteção na indústria de alimentos e bebidas"
          },
          {
            Codigo: "51779",
            NomeProduto: "ESTILETE RETRATIL STARRET S014",
            Status: "cancelado mrp",
            Categoria: "null",
            urlsImagem: [
              "https://live.staticflickr.com/4151/5433952208_382f210765_c.jpg",
              "https://static.lojabrafer.com.br/public/brafer/imagens/produtos/estilete-retratil-s014-de-aluminio-lamina-trapezoidal-6435b3c6ef01c.jpg"
            ],
            DescricaoTecnica: " ## Descrição Técnica\n   - Código do produto: 51779\n   - Nome do produto: ESTILETE RETRATIL STARRET S014\n   - Tipo de material: ZCON (Precisa-se de mais informações para definir o tipo de material exactamente)\n   - Status do produto: cancelado mrp\n\n   ## Site Oficial\n   - [Starrett](https://starrett.com.br/estilete-serie-exact-plus-lamina-trapezoidal-gancho-design-exclusivo-s014)\n   - [Copafer](https://www.copafer.com.br/estilete-de-aluminio-retratil-s014-starrett-p1080470)\n   - [Anhanguera Ferramentas](https://www.anhangueraferramentas.com.br/produto/estilete-de-plastico-exact-plus-retratil-com-lamina-trapezoidal-18mm-s014-starrett-109689)\n   - [Ferimport](https://www.ferimport.com.br/estilete-retratil-starrett-s014-de-aluminio-lam-ganchotrapezio/p)\n   - [Antferramentas](https://www.antferramentas.com.br/estilete-retratil-starrett-s014/p)\n\n   ## Exemplos de Uso\n   É necessário consultar as páginas oficiais do produto para obter informações sobre o uso e instruções de segurança."
          },
          {
            Codigo: "51834",
            NomeProduto: "PILHA ENERGIZER ALC  AA 1,5V CART C/ 2UN",
            Status: "",
            Categoria: "PILH_01",
            urlsImagem: [
              "https://lutandistribuidora.agilecdn.com.br/10842.jpg",
              "https://phygital-files.mercafacil.com/catalogo/uploads/produto/_pilha_rayovac_alc_peq_aa_8x2unidade_20859__0e8b3733-712e-417d-88b2-031deec3679b.jpg"
            ],
            DescricaoTecnica: " ## Descrição técnica\n    - Código do produto: 51834\n    - Nome: Pilha ENERGIZER ALC AA 1,5V CART C/ 2UN\n    - Tipo de material: ZCON (não especificado em materiais_texto_longo)\n    - Status: Ativo\n\n## Site oficial\n- Pode ser encontrada no site oficial da Cosmos BlueSoft: [Cosmos](https://cosmos.bluesoft.com.br/ncms/85061019-outros/produtos)\n\n## Exemplos de uso\nEssa pilha é indicada para dispositivos como: rádios, flashes, câmeras fotográficas e outros. Ela possui uma capacidade de 1,5V e está disponível em uma caixa fechada com duas unidades."
          },
          {
            Codigo: "52018",
            NomeProduto: "ROLO DE ESPUMA P PINTURA 5CM",
            Status: "aplicação rebobinadeira sjp06 e 9",
            Categoria: "ROLO_01",
            urlsImagem: [],
            DescricaoTecnica: ""
          },
          {
            Codigo: "52030",
            NomeProduto: "DESENGRAXANTE UNIVERSAL OZZYJUICE SW-4",
            Status: "DESENGRAXANTE UNIVERSAL OZZYJUICE SW-4 / MARCA:CHEMFREE",
            Categoria: "DSGX_01",
            urlsImagem: [
              "https://media.hayley-group.co.uk/api/2/GET/IMAGE/WEBMAIN/40368600.jpg",
              "https://media.hayley-group.co.uk/api/2/GET/IMAGE/WEBMAIN/40368589.jpg",
              "https://media.hayley-group.co.uk/api/2/GET/IMAGE/WEBMAIN/42172793.jpg",
              "https://media.hayley-group.co.uk/api/2/GET/IMAGE/WEBMAIN/40368580.jpg",
              "https://media.hayley-group.co.uk/api/2/GET/IMAGE/WEBMAIN/40368758.jpg"
            ],
            DescricaoTecnica: " ### Descrição Técnica\n    #### Produto: DESENGRAXANTE UNIVERSAL OZZYJUICE SW-4\n    #### Marca: CHEMFREE\n    #### Tipo de Material: ZCON\n\n    Este desengraxante universal é indicado para uso em vários tipos de superfícies, sendo ele o DESENGRAXANTE UNIVERSAL OZZYJUICE SW-4 da marca CHEMFREE. Não há detalhes adicionais sobre a descrição técnica fornecidos.\n\n    ### Exemplos de Uso\n    Por favor, consultar o site oficial ou manual do produto para obter mais informações sobre como utilizar este desengraxante universal."
          },
          {
            Codigo: "52218",
            NomeProduto: "APRESENTADOR SEM FIO LASER POINT R400",
            Status: "APRESENTADOR SEM FIO LASER POINT R400",
            Categoria: "APRS_01",
            urlsImagem: [
              "https://images.tcdn.com.br/img/img_prod/591628/apresentador_sem_fio_logitech_r400_laser_pointer_vermelho_usb_preto_33113_1_8c4e091a42af7f51d61f12f8300c489f.jpg",
              "https://s.alicdn.com/@sc04/kf/He46d9cb17dc04b4581fcd15e6491b06fR.jpg_720x720q50.jpg"
            ],
            DescricaoTecnica: " ### Descrição Técnica\n\n    - **Produto**: Apresenatador Sem Fio Laser Point R400\n    - **Código**: 52218\n    - **Tipo de Material**: ZCON\n    - **Status**: Apresenatador Sem Fio Laser Point R400\n\n   ### Site Oficial\n\n   - [Logitech Store Brasil](https://www.logitechstore.com.br/apresentador-sem-fio-logitech-r400/)\n\n   ### Exemplos de Uso\n\n   - Utilizado para apresentações interativas com pontos de referência\n   - Compatível com dispositivos USB e pilha"
          },
          {
            Codigo: "77018",
            NomeProduto: "MOTOR SIEMENS 3KW 220/380V 50/60HZ",
            Status: "MATERIAL RECUPERADO",
            Categoria: "MOTO_01",
            urlsImagem: [],
            DescricaoTecnica: ""
          },
          {
            Codigo: "77050",
            NomeProduto: "MOTOR SIEMENS 1LA7130-4AA91-Z",
            Status: "MATERIAL RECUPERADO",
            Categoria: "MOTO_01",
            urlsImagem: [
              "https://abfprdstorage.blob.core.windows.net/productmedia-abf/small_cccbfe774f1b8eda951860552e92fedda0373be3_801056_2.jpg"
            ],
            DescricaoTecnica: " ### Descrição Técnica\n    - **Código**: 77050\n    - **Nome Produto**: Motor Siemens 1LA7130-4AA91-Z\n    - **Tipo de Material**: ZMAN\n    - **Status**: Material Recuperado\n\n    Não foi possível obter informações adicionais sobre a descrição técnica deste produto a partir das informações fornecidas. É recomendável consultar o site oficial do fabricante para mais detalhes.\n\n   ### Site Oficial\n   - [Link para Blog](https://la.sogears.com/Blog/frame-size-80m-voltage-400vac-50hz) (Por favor notar que este link não se refere especificamente ao produto 1LA7130-4AA91-Z, mas pode fornecer informações relevantes sobre o tipo geral de motor Siemens)\n   - [Link para Manuais Técnicos](https://mall.industry.siemens.com/spice/docuservice/docuservice?configid=14&docu.mlfb=1LA7130-4AA61-Z+M34&docu.inittype=MLFB&docu.generationtype=VIEW&docu.viewid=PDF&region=GB&language=en&docu.language.locale1=en&docu.language.locale2=en) (Por favor notar que este link se refere ao manual técnico para o motor 1LA7130-4AA61-Z, e não necessariamente a versão 4AA91-Z do produto em questão)\n   - [Link para compra](https://www.abf.store/s/en/electric-motors/1LA7130-4AA91-Z-SIEMENS/1154931)\n   - [Outro link para informações adicionais do produto](http://www.drillingsolutionsltd.com/siemens-motor-1la-series.html)\n   - [Link para outro manual técnico](https://mall.industry.siemens.com/spice/docuservice/docuservice?configid=14&docu.mlfb=1LA7080-4AA91-Z+K16%2BK17%2BL1C&docu.inittype=MLFB&docu.generationtype=VIEW&docu.viewid=PDF&region=GB&language=en&docu.language.locale1=en&docu.language.locale2=en) (Por favor notar que este link se refere ao manual técnico para o motor 1LA7080-4AA91-Z, e não necessariamente a versão 4AA91-Z do produto em questão)\n\n   ### Exemplos de Uso\n   Por favor notar que as informações sobre exemplos de uso não foram fornecidas para este produto. É recomendável consultar o site oficial do fabricante para mais detalhes sobre como utilizar este motor Siemens 1LA7130-4AA91-Z."
          },
          {
            Codigo: "77585",
            NomeProduto: "REDUTOR MRIV50UO3AHB71A4B5/35,5 B3i=50,7",
            Status: "AJUSTADO CONFORME PLANILHA CURVA ABC REVISADA MANUTENÇÃO",
            Categoria: "REDT_01",
            urlsImagem: [],
            DescricaoTecnica: ""
          },
          {
            Codigo: "78032",
            NomeProduto: "ROLAMENTO MANCAL LUCT 40 2LS",
            Status: "APLICAÇÃO SML ESTERIA NORDSON",
            Categoria: "ROLM_01",
            urlsImagem: [
              "https://tiimg.tistatic.com/fp/2/001/496/corrosion-resistant-pbc-linear-bearing-034.jpg",
              "https://pt.tradebearings.com/model/images/tbs-753.jpg"
            ],
            DescricaoTecnica: " ### Descrição técnica\n    O Rolamento Mancal Luct 40 2LS é um rolamento feito de material ZMAN, que está sendo aplicado em uma aplicação SML Esteria Nordson. Infelizmente, não há informações adicionais sobre as especificações técnicas deste produto disponíveis no momento.\n\n    ### Site oficial\n    - [Igusdo Brasil](https://www.igsdobrasil.com.br/produto/luct-50-2ls-bucha-de-esferas-com-mancal-skf/)\n\n    ### Exemplos de uso\n    Não há informações disponíveis sobre exemplos de uso para este produto. É recomendado consultar o manual de instruções oferecido pelo fabricante."
          }
        ]

        const mockProduto = mockParaTestes.find(produto => produto.Codigo == productId);

        setProduct(mockProduto);

        if (mockProduto?.urlsImagem?.length ?? 0 > 0) {
          setMainImage(mockProduto?.urlsImagem[0] ?? 'https://placehold.co/150x150/?text=Produto');
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Produto não encontrado</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li aria-current="page">
              <span className="text-gray-500">{product.NomeProduto}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Galeria de Imagens */}
          <div className="md:w-1/2">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                <img
                  src={mainImage || product.urlsImagem[0]}
                  alt={product.NomeProduto}
                  className="w-full h-96 object-contain"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto py-2">
                {product.urlsImagem?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 flex-shrink-0 border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Status */}
              <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${product.Status.includes('cancelado')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
                }`}>
                {product.Status}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.NomeProduto}</h1>
              <p className="text-gray-600 mb-4">Código: {product.Codigo}</p>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Material:</span>
                  <span>{product.Status}</span>
                </div>
              </div>

              {/* Descrição Formatada */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">Descrição Técnica</h3>
                {product.DescricaoTecnica.split('\n').map((paragraph: any, i: any) => (
                  <div key={i} className="mb-3 text-gray-700">
                    <ReactMarkdown>{paragraph}</ReactMarkdown>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}