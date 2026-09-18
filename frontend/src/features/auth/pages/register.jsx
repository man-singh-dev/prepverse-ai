import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import FormField from '../../../components/ui/FormField';
import Checkbox from '../../../components/ui/Checkbox';
import PasswordStrengthMeter from '../../../components/ui/PasswordStrengthMeter';
import { useToast } from '../../../components/ui/ToastContext';
import { isValidEmail, getPasswordStrength } from '../../../utils/validators';
// MOCK — replace with real API integration later.
import { mockRegister } from '../mockAuth';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export default function Register() {
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

    if (!form.name.trim()) {
      nextErrors.name = 'Full name is required.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (getPasswordStrength(form.password).score < 2) {
      nextErrors.password = 'Choose a stronger password (8+ characters, mix of letters & numbers).';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!form.acceptTerms) {
      nextErrors.acceptTerms = 'You must accept the Terms & Conditions to continue.';
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
      const user = await mockRegister(form);
      showToast(`Account created — welcome, ${user.name}!`, { type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h2>Create your account</h2>
      <p className="text-muted auth-card-subtitle">Start practicing in less than a minute.</p>

      {formError && (
        <div className="form-banner form-banner-error" role="alert">
          {formError}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit}>
        <FormField label="Full name" htmlFor="register-name" error={errors.name} required>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.name}
            error={Boolean(errors.name)}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </FormField>

        <FormField label="Email address" htmlFor="register-email" error={errors.email} required>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            error={Boolean(errors.email)}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="register-password"
          error={errors.password}
          hint={!errors.password ? 'Use 8+ characters with a mix of letters & numbers.' : undefined}
          required
        >
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={form.password}
            error={Boolean(errors.password)}
            onChange={(e) => updateField('password', e.target.value)}
          />
          <PasswordStrengthMeter password={form.password} />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor="register-confirm-password"
          error={errors.confirmPassword}
          required
        >
          <PasswordInput
            id="register-confirm-password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            error={Boolean(errors.confirmPassword)}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
          />
        </FormField>

        <FormField error={errors.acceptTerms}>
          <Checkbox
            id="register-terms"
            checked={form.acceptTerms}
            onChange={(e) => updateField('acceptTerms', e.target.checked)}
            label={
              <>
                I agree to the <a href="#terms">Terms & Conditions</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </>
            }
          />
        </FormField>

        <Button type="submit" fullWidth loading={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
