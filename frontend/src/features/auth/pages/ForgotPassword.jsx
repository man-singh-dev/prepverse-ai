import { useState } from 'react';
import { Link } from 'react-router';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import FormField from '../../../components/ui/FormField';
import { isValidEmail } from '../../../utils/validators';

// MOCK — simulates sending a reset email. No network request is made.
function mockSendResetEmail() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setError('');
    setSubmitting(true);
    await mockSendResetEmail();
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-card">
        <h2>Check your inbox</h2>
        <p className="text-muted auth-card-subtitle">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your password.
        </p>
        <Link to="/login">
          <Button variant="secondary" fullWidth>
            Back to log in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2>Reset your password</h2>
      <p className="text-muted auth-card-subtitle">
        Enter the email associated with your account and we&apos;ll send a reset link.
      </p>

      <form noValidate onSubmit={handleSubmit}>
        <FormField label="Email address" htmlFor="forgot-email" error={error} required>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            error={Boolean(error)}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
          />
        </FormField>

        <Button type="submit" fullWidth loading={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="auth-switch">
        Remembered your password? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
