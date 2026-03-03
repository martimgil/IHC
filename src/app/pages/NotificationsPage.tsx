import { useNavigate } from 'react-router';
import { sports } from '../data';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  FaArrowLeft,
  FaBell,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
  FaCalendarDays,
  FaTrashCan
} from 'react-icons/fa6';
import { Notification } from '../types';
import { toast } from 'sonner';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('Marcada como lida');
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('Todas marcadas como lidas');
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast.success('Notificação eliminada');

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = 'Notificação eliminada';
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const getNotificationIcon = (notification: Notification) => {
    const sportIcon = notification.data?.sportId
      ? sports.find(s => s.id === notification.data.sportId)?.icon
      : null;

    if (sportIcon) {
      return <div className="text-2xl w-5 h-5 flex items-center justify-center" role="img">{sportIcon}</div>;
    }

    switch (notification.type) {
      case 'session-available':
        return <FaCircleCheck className="w-5 h-5 text-green-600" aria-hidden="true" />;
      case 'booking-failed':
        return <FaCircleExclamation className="w-5 h-5 text-red-600" aria-hidden="true" />;
      case 'alternative-suggestion':
        return <FaBell className="w-5 h-5 text-blue-600" aria-hidden="true" />;
      case 'urgent-match':
        return <FaClock className="w-5 h-5 text-orange-600" aria-hidden="true" />;
      case 'lobby-full':
        return <FaCircleCheck className="w-5 h-5 text-green-600" aria-hidden="true" />;
      case 'reminder':
        return <FaCalendarDays className="w-5 h-5 text-purple-600" aria-hidden="true" />;
      default:
        return <FaBell className="w-5 h-5 text-gray-600" aria-hidden="true" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('pt-PT');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-2 min-h-[44px]"
        aria-label="Voltar à página anterior"
      >
        <FaArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
        Voltar
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground mt-1" aria-live="polite">
              {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="min-h-[44px]"
            aria-label={`Marcar ${unreadCount} notificações como lidas`}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <Separator />

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div
          className="space-y-3"
          role="list"
          aria-label="Lista de notificações"
        >
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all active:scale-[0.99] ${!notification.read
                ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40 shadow-md'
                : 'hover:shadow-md'
                }`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              role="listitem"
              aria-label={`${notification.read ? 'Lida' : 'Não lida'}: ${notification.title}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge className="bg-blue-600 shrink-0" aria-label="Nova notificação">
                          Nova
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <time
                        className="text-xs text-gray-500 dark:text-gray-400"
                        dateTime={notification.timestamp}
                      >
                        {formatTimestamp(notification.timestamp)}
                      </time>
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && notification.actionLabel && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-[36px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(notification.actionUrl!);
                            }}
                            aria-label={notification.actionLabel}
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="min-h-[36px] min-w-[36px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          aria-label="Eliminar notificação"
                        >
                          <FaTrashCan className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FaBell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
            <p className="text-muted-foreground mb-2">Não há notificações</p>
            <p className="text-sm text-muted-foreground/70">
              Quando houver novidades, aparecerão aqui
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}