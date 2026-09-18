import { Navigate, Outlet } from 'react-router';
import Navbar from './Navbar';
import { getSession } from '../../features/auth/mockAuth';

export default function AppLayout() {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        <Outlet />
      </main>
    </div>
  );
}
