/**
 * Header - Navegación principal
 */
import { Link, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';

export default function Header() {
  const location = useLocation();
  const { totalPoints } = useProgressStore();

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/limites', label: 'Límites', icon: '🚀' },
    { path: '/derivadas', label: 'Derivadas', icon: '🔬' },
    { path: '/lagrange', label: 'Lagrange', icon: '🗺️' },
    { path: '/gradiente', label: 'Gradiente', icon: '🧭' },
    { path: '/campos', label: 'Campos', icon: '🕵️' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">📐</span>
            <span className="font-heading font-bold text-xl text-gradient">
              Matemática IV
            </span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Puntos */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold flex items-center space-x-2">
              <span>⭐</span>
              <span>{totalPoints}</span>
            </div>
          </div>
        </div>

        {/* Navegación Mobile */}
        <nav className="md:hidden flex overflow-x-auto pb-2 space-x-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 whitespace-nowrap text-sm ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
