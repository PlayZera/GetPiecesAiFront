import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth, useLogout } from '../hooks/useApi';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navigation: NavItem[] = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
];

export default function SideNavBar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700/50 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-72'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">GP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GetPieces
              </h1>
              <p className="text-xs text-slate-400">Sistema de Peças</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group border border-slate-600/30 hover:border-slate-500/50"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className={`space-y-2 ${!isCollapsed ? 'mb-6' : 'mb-4'}`}>
          {!isCollapsed && (
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Navegação
            </h2>
          )}
          {navigation.map((item) => (
            <li key={item.name} className="list-none">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border border-transparent hover:border-slate-600/30'
                }`}
              >
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
                )}
                <span className="text-xl relative z-10">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-4 font-medium relative z-10">{item.name}</span>
                )}
                {isActive(item.path) && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full relative z-10"></div>
                )}
              </Link>
            </li>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="p-6 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm">
        {isAuthenticated ? (
          <div className="space-y-4">
            {!isCollapsed && user && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{user.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>
              </div>
            )}
            {!isCollapsed && !user && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                <div className="text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Usuário autenticado</span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-200 border ${
                logoutMutation.isPending 
                  ? 'opacity-50 cursor-not-allowed bg-slate-700/30 border-slate-600/30' 
                  : 'text-red-400 hover:bg-red-500/10 hover:text-red-300 border-transparent hover:border-red-500/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && (
                <span className="ml-3 font-medium">
                  {logoutMutation.isPending ? 'Saindo...' : 'Logout'}
                </span>
              )}
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center px-4 py-3 rounded-xl transition-all duration-200 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 hover:border-blue-400/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && (
              <span className="ml-3 font-medium text-blue-400">Login</span>
            )}
          </Link>
        )}
      </div>
    </div>
  );
}