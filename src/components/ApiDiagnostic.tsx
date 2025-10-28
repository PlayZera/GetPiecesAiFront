import { useState, useEffect } from 'react';

interface ApiStatus {
  isHealthy: boolean;
  responseTime: number;
  error?: string;
  lastCheck: Date;
}

export const ApiDiagnostic = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkApiHealth = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://get-pieces-api-production.up.railway.app';

    try {
      const response = await fetch(`${apiUrl}/docs`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        setApiStatus({
          isHealthy: true,
          responseTime,
          lastCheck: new Date()
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setApiStatus({
        isHealthy: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Só mostra em desenvolvimento
  if (import.meta.env.VITE_DEV_MODE !== 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          API Status
        </h3>
        <button
          onClick={checkApiHealth}
          disabled={isChecking}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {apiStatus && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                apiStatus.isHealthy ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className={`text-sm ${
              apiStatus.isHealthy ? 'text-green-600' : 'text-red-600'
            }`}>
              {apiStatus.isHealthy ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>Response: {apiStatus.responseTime}ms</div>
            <div>Last check: {apiStatus.lastCheck.toLocaleTimeString()}</div>
            <div>
              URL: {import.meta.env.VITE_API_BASE_URL || 'https://get-pieces-api-production.up.railway.app'}
            </div>
            
            {apiStatus.error && (
              <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                Error: {apiStatus.error}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Environment Variables:
        </div>
        <div className="text-xs space-y-1 mt-1">
          <div>MODE: {import.meta.env.MODE}</div>
          <div>PROD: {import.meta.env.PROD ? 'true' : 'false'}</div>
          <div>DEV_MODE: {import.meta.env.VITE_DEV_MODE}</div>
        </div>
      </div>
    </div>
  );
};

export default ApiDiagnostic;