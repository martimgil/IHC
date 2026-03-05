import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { FaHouse, FaMapLocationDot, FaUser, FaRightFromBracket, FaBell, FaCircleQuestion, FaCircleUser, FaGear, FaBolt, FaArrowRight, FaXmark, FaCalendarDay, FaSun, FaMoon } from 'react-icons/fa6';
import { Badge } from './components/ui/badge';
import { useTheme } from './context/ThemeContext';
import { useUser } from './context/UserContext';
import { useNotifications } from './context/NotificationContext';
import HelpSheet from './components/HelpSheet';
import OnboardingTutorial from './components/OnboardingTutorial';
import ScrollBounce from './components/ScrollBounce';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { sessionUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    if (!sessionUser) {
      navigate('/login');
    }
  }, [sessionUser, navigate]);

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
              className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg group"
              aria-label="Ir para página inicial"
            >
              <img src="/icon.jpg" alt="matchIn logo" className="w-8 h-8 object-contain transition-transform group-hover:scale-110" />
              <h1 className="text-xl font-extrabold text-foreground tracking-tighter">
                match<span className="text-primary italic">In</span>
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
                <FaCircleQuestion className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
                aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              >
                {theme === 'dark' ? (
                  <FaSun className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <FaMoon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Notifications (desktop only) */}
              <Link
                to="/notifications"
                className="relative p-3 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center max-md:hidden"
                aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
              >
                <FaBell className="w-6 h-6 text-foreground" aria-hidden="true" />
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
                <FaUser className="w-6 h-6 text-foreground" aria-hidden="true" />
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
          className="bg-card border-t border-border px-1 py-1 md:hidden safe-area-bottom fixed bottom-0 left-0 right-0 shadow-lg z-50"
          aria-label="Navegação inferior"
        >
          <div className="flex justify-around items-center">
            <Link
              to="/"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-h-[48px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/') && location.pathname === '/' ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Página inicial"
              aria-current={isActive('/') && location.pathname === '/' ? 'page' : undefined}
            >
              <FaHouse className="w-5 h-5 mb-0.5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">Início</span>
            </Link>
            <Link
              to="/map"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-h-[48px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/map') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Mapa de locais"
              aria-current={isActive('/map') ? 'page' : undefined}
            >
              <FaMapLocationDot className="w-5 h-5 mb-0.5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">Mapa</span>
            </Link>
            <Link
              to="/bookings"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-h-[48px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/bookings') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Minhas Reservas"
              aria-current={isActive('/bookings') ? 'page' : undefined}
            >
              <FaCalendarDay className="w-5 h-5 mb-0.5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">Reservas</span>
            </Link>
            <Link
              to="/notifications"
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-h-[48px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/notifications') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label={`Alertas${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
              aria-current={isActive('/notifications') ? 'page' : undefined}
            >
              <FaBell className="w-5 h-5 mb-0.5" aria-hidden="true" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute top-0.5 right-2 h-3.5 w-3.5 flex items-center justify-center p-0 text-[9px]"
                  aria-label={`${unreadCount} alertas não lidos`}
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="text-[10px] font-medium leading-none">Alertas</span>
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-h-[48px] min-w-[60px] focus:outline-none focus:ring-2 focus:ring-primary ${isActive('/profile') ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
              aria-label="Perfil"
              aria-current={isActive('/profile') ? 'page' : undefined}
            >
              <FaUser className="w-5 h-5 mb-0.5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">Perfil</span>
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