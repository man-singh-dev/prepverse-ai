import { Outlet } from 'react-router';
import Logo from './Logo';

const highlights = [
  'Practice with realistic, role-specific mock interviews',
  'Get instant, actionable feedback on every answer',
  'Build a polished resume in minutes',
];

export default function AuthLayout() {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Logo />
        <h1 className="auth-panel-title">Get interview-ready, faster.</h1>
        <p className="auth-panel-subtitle">
          Join thousands of candidates using PrepVerse AI to practice, get feedback, and land the offer.
        </p>
        <ul className="auth-panel-list">
          {highlights.map((item) => (
            <li key={item}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 12.5 10.2 15.7 17 8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="auth-form-panel">
        <Outlet />
      </div>
    </div>
  );
}
