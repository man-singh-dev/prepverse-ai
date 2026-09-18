import { RouterProvider } from 'react-router';
import { ToastProvider } from './components/ui/Toast';
import { router } from './app.routes';
import './style.scss';

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
