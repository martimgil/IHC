import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Bell, Home, User, MapPin, Sun, Moon, HelpCircle, Map } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { useTheme } from './context/ThemeContext';
import HelpSheet from './components/HelpSheet';
import OnboardingTutorial from './components/OnboardingTutorial';
import ScrollBounce from './components/ScrollBounce';

export default function Root() {
  const location = useLocation();
  const unreadCount = 2;
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-background text-foreground">
        {/* Skip to Content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-card focus:p-4 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-primary"
        >
          Saltar para o conteúdo
        </a>

        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              aria-label="Ir para página inicial"
            >
              <div className="text-2xl" role="img" aria-label="Logo matchIn">⚡</div>
              <h1 className="text-xl font-bold text-foreground">
                match<span className="text-primary">In</span>
              </h1>
            </Link>

            <nav className="flex items-center gap-1" aria-label="Navegação principal">
              {/* Help */}
              <button
                onClick={() => setHelpOpen(true)}
                className="p-3 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
                aria-label="Ajuda"
                title="Ajuda"
              >
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
                aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Moon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Notifications (desktop only) */}
              <Link
                to="/notifications"
                className="relative p-3 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center max-md:hidden"
                aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
              >
                <Bell className="w-6 h-6 text-foreground" aria-hidden="true" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    aria-label={`${unreadCount} notificações não lidas`}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Link>

              {/* Profile (desktop only) */}
              <Link
                to="/profile"
                className="p-3 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center max-md:hidden"
                aria-label="Ir para perfil"
              >
                <User className="w-6 h-6 text-foreground" aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="flex-1 flex flex-col min-h-0" role="main">
          <ScrollBounce>
            <div className="max-w-7xl mx-auto p-4 pb-20 md:pb-4">
              <Outlet />
            </div>
          </ScrollBounce>
        </main>

        {/* Bottom Navigation - Mobile */}
        <nav
          className="bg-card border-t border-border px-2 py-2 md:hidden safe-area-bottom fixed bottom-0 left-0 right-0 shadow-lg"
          aria-label="Navegação inferior"
        >
          <div className="flex justify-around items-center">
            <Link
              to="/"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/') && location.pathname === '/' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Página inicial"
              aria-current={isActive('/') && location.pathname === '/' ? 'page' : undefined}
            >
              <Home className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-medium">Início</span>
            </Link>
            <Link
              to="/map"
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/map') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Mapa de locais"
              aria-current={isActive('/map') ? 'page' : undefined}
            >
              <Map className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-medium">Mapa</span>
            </Link>
            <Link
              to="/notifications"
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/notifications') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
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
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-h-[56px] min-w-[64px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/profile') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Perfil"
              aria-current={isActive('/profile') ? 'page' : undefined}
            >
              <User className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs font-medium">Perfil</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Help Sheet */}
      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Onboarding Tutorial – auto-shows on first visit */}
      <OnboardingTutorial />
    </>
  );
}