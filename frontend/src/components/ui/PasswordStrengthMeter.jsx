import { getPasswordStrength } from '../../utils/validators';

const LEVEL_CLASS = ['', 'weak', 'weak', 'fair', 'good', 'strong'];

export default function PasswordStrengthMeter({ password }) {
  const { score, label } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-bars">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`password-strength-bar ${i < score ? LEVEL_CLASS[score] : ''}`}
          />
        ))}
      </div>
      <span className={`password-strength-label ${LEVEL_CLASS[score]}`}>{label}</span>
    </div>
  );
}
