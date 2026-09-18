import { Link } from 'react-router';
import Button from '../../../components/ui/Button';

const features = [
  {
    title: 'Realistic mock interviews',
    description: 'Practice role-specific questions in a timed, structured interview flow.',
    icon: '🎯',
  },
  {
    title: 'Instant AI feedback',
    description: 'Get a detailed breakdown of your strengths, weaknesses, and score after every session.',
    icon: '⚡',
  },
  {
    title: 'Resume builder',
    description: 'Build a polished, recruiter-ready resume with live preview as you type.',
    icon: '📄',
  },
];

const steps = [
  { title: 'Create your account', description: 'Sign up in under a minute — no credit card required.' },
  { title: 'Pick your track', description: 'Choose a role and difficulty that matches your goals.' },
  { title: 'Practice & improve', description: 'Review your report and track progress over time.' },
];

const stats = [
  { value: '12k+', label: 'Interviews completed' },
  { value: '4.8/5', label: 'Average rating' },
  { value: '87%', label: 'Report improved confidence' },
  { value: '25+', label: 'Interview tracks' },
];

export default function Home() {
  return (
    <>
      <section className="hero container">
        <span className="hero-badge">✨ Now with instant AI feedback</span>
        <h1 className="hero-title">Ace your next interview with confident, focused practice</h1>
        <p className="hero-subtitle">
          PrepVerse AI pairs realistic mock interviews with instant feedback and a resume builder, so
          you can walk in prepared.
        </p>
        <div className="hero-cta">
          <Link to="/register">
            <Button size="lg">Get started for free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      </section>

      <section className="container">
        <div className="features">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container how-it-works">
        <div className="page-header">
          <h2>How it works</h2>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <div key={step.title} className="step-card">
              <div className="step-number">{index + 1}</div>
              <h3 className="feature-title">{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="stats-band">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="stats-band-value">{stat.value}</div>
              <div className="stats-band-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="cta-section">
          <h2>Ready to practice smarter?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBlock: 'var(--space-3) var(--space-5)' }}>
            Create a free account and take your first mock interview today.
          </p>
          <Link to="/register">
            <Button size="lg">Create free account</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
