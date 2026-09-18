import { Link } from 'react-router';

export default function Logo() {
  return (
    <Link to="/" className="navbar-brand" aria-label="PrepVerse AI home">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="7" fill="var(--primary)" />
        <path d="M7 12.5 10.2 15.7 17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      PrepVerse AI
    </Link>
  );
}
