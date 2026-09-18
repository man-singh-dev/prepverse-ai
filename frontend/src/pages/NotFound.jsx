import { Link } from 'react-router';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '100svh' }}>
      <div className="empty-state-icon" aria-hidden="true">
        <span style={{ fontSize: '1.5rem' }}>404</span>
      </div>
      <h1>Page not found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
