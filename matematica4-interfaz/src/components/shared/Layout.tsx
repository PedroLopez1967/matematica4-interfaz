/**
 * Layout - Estructura principal de la aplicación
 */
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">
            Matemática IV (Cód. 735) - Universidad Nacional Abierta (UNA)
          </p>
          <p className="text-xs mt-1">Lapso 2025-2</p>
        </div>
      </footer>
    </div>
  );
}
