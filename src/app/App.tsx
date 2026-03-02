import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}