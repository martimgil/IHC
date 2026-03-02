import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </UserProvider>
    </ThemeProvider>
  );
}