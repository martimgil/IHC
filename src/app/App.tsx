import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import { BookingProvider } from './context/BookingContext';
import { LobbyProvider } from './context/LobbyContext';


export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <LobbyProvider>
            <BookingProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" richColors closeButton />
            </BookingProvider>
          </LobbyProvider>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}