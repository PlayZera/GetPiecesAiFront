import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches &&
        localStorage.getItem('darkMode') !== 'false')
  });
  const [activeTab, setActiveTab] = useState('products');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [productData, setProductData] = useState({
    name: '',
    code: '',
    category: '',
    description: ''
  });

  // Aplicar tema escuro no body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para enviar os dados do produto
    console.log('Dados do produto:', productData);
    console.log('Imagens:', previewImages);
    // Reset form after submission
    setProductData({
      name: '',
      code: '',
      category: '',
      description: ''
    });
    setPreviewImages([]);
    alert('Produto cadastrado com sucesso!');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
      <title>👔Administrativo</title>

      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho com toggle de tema */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center">
              <span className="mr-3">👔</span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                Painel Administrativo
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Gerencie produtos, categorias e configurações
            </p>
          </div>
        </div>

        {/* Abas de navegação - Versão refinada */}
        <div className="mb-8">
          <nav className="flex space-x-30 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'products'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'categories'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Categorias
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === 'settings'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              Configurações
            </button>
          </nav>
        </div>

        {/* Conteúdo das abas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-200">
          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Adicionar Novo Produto</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={productData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Código
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={productData.code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={productData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
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

                  <div>
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Imagens do Produto
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="images"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={productData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Pré-visualização das imagens */}
                {previewImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pré-visualização das Imagens</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {previewImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Gerenciar Categorias</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">Funcionalidade de categorias em desenvolvimento.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Configurações</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">Configurações do sistema em desenvolvimento.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}