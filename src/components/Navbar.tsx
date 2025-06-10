import { Link } from "react-router-dom";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches && 
           localStorage.getItem('darkMode') !== 'false');
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

  const toggleDarkMode = () => {
    setDarkMode(darkMode);
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 p-4 text-white shadow-lg transition-colors duration-200">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo e links principais */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-xl font-bold hover:text-white/90 transition-colors flex items-center"
          >
            <span className="bg-white dark:bg-gray-200 text-blue-600 dark:text-gray-800 rounded-md p-1 mr-2">
              🔧
            </span>
            <span>PeçasPro</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="px-3 py-1 rounded-md hover:bg-blue-700 dark:hover:bg-gray-700/80 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Links de autenticação e tema */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-blue-700 dark:bg-gray-700 text-white dark:text-yellow-300 hover:bg-blue-800 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5"/>
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          <Link 
            to="/login" 
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/20 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </div>

      {/* Menu mobile (opcional) */}
      <div className="md:hidden container mx-auto mt-2">
        <div className="flex space-x-2">
          <Link 
            to="/products" 
            className="px-3 py-1 text-sm rounded-md hover:bg-blue-700 dark:hover:bg-gray-700/80 transition-colors block w-full text-center"
          >
            Catálogo
          </Link>
          <Link 
            to="/dashboard" 
            className="px-3 py-1 text-sm rounded-md hover:bg-blue-700 dark:hover:bg-gray-700/80 transition-colors block w-full text-center"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}