import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import FormField from '../../../components/ui/FormField';
import Checkbox from '../../../components/ui/Checkbox';
import { useToast } from '../../../components/ui/ToastContext';
import { isValidEmail } from '../../../utils/validators';
// MOCK — replace with real API integration later.
import { mockLogin } from '../mockAuth';

const initialForm = { email: '', password: '', rememberMe: false };

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (formError) setFormError('');
  }

  function validate() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError('');

    try {
      const user = await mockLogin(form);
      showToast(`Welcome back, ${user.name}!`, { type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h2>Log in to your account</h2>
      <p className="text-muted auth-card-subtitle">Welcome back — enter your details below.</p>

      {formError && (
        <div className="form-banner form-banner-error" role="alert">
          {formError}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit}>
        <FormField label="Email address" htmlFor="login-email" error={errors.email} required>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            error={Boolean(errors.email)}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </FormField>

        <FormField label="Password" htmlFor="login-password" error={errors.password} required>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            error={Boolean(errors.password)}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </FormField>

        <div className="auth-form-row">
          <Checkbox
            id="login-remember"
            label="Remember me"
            checked={form.rememberMe}
            onChange={(e) => updateField('rememberMe', e.target.checked)}
          />
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
