import { Outlet, Link, useLocation } from 'react-router';
import { Bell, Home, User, MapPin } from 'lucide-react';
import { Badge } from './components/ui/badge';

export default function Root() {
  const location = useLocation();
  const unreadCount = 2; // Mock unread notifications

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-blue-500"
      >
        Saltar para o conteúdo
      </a>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            aria-label="Ir para página inicial"
          >
            <div className="text-2xl" role="img" aria-label="Logo SportMatch">⚡</div>
            <h1 className="text-xl font-bold text-gray-900">SportMatch</h1>
          </Link>
          <nav className="flex items-center gap-2 max-md:hidden" aria-label="Navegação principal">
            <Link
              to="/notifications"
              className="relative p-3 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
            >
              <Bell className="w-6 h-6 text-gray-700" aria-hidden="true" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  aria-label={`${unreadCount} notificações não lidas`}
                >
                  {unreadCount}
                </Badge>
              )}
            </Link>
            <Link
              to="/profile"
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Ir para perfil"
            >
              <User className="w-6 h-6 text-gray-700" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-y-auto" role="main">
        <div className="max-w-7xl mx-auto p-4 pb-20 md:pb-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav
        className="bg-white border-t border-gray-200 px-2 py-2 md:hidden safe-area-bottom fixed bottom-0 left-0 right-0 shadow-lg"
        aria-label="Navegação inferior"
      >
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive('/') && location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            aria-label="Página inicial"
            aria-current={isActive('/') && location.pathname === '/' ? 'page' : undefined}
          >
            <Home className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link
            to="/search-location"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive('/search-location') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            aria-label="Procurar locais"
            aria-current={isActive('/search-location') ? 'page' : undefined}
          >
            <MapPin className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs font-medium">Locais</span>
          </Link>
          <Link
            to="/notifications"
            className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive('/notifications') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            aria-label={`Alertas${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
            aria-current={isActive('/notifications') ? 'page' : undefined}
          >
            <Bell className="w-6 h-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <Badge
                className="absolute top-1 right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
                aria-label={`${unreadCount} alertas não lidos`}
              >
                {unreadCount}
              </Badge>
            )}
            <span className="text-xs font-medium">Alertas</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            aria-label="Perfil"
            aria-current={isActive('/profile') ? 'page' : undefined}
          >
            <User className="w-6 h-6" aria-hidden="true" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}