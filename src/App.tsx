import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from "./components/Layout";
import ApiDiagnostic from "./components/ApiDiagnostic";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashborad";
import ProductDetail from "./pages/ProductDetail";

// Criar uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rota de login sem layout */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas com layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/produto/:productId" element={<ProductDetail />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        
        {/* Componente de diagnóstico da API - só em desenvolvimento */}
        <ApiDiagnostic />
      </BrowserRouter>
    </QueryClientProvider>
  );
}