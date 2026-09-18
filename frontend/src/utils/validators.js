const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value).trim());
}

export function getPasswordStrength(value) {
  const password = String(value || '');
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const level = Math.min(score, 4);
  const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return { score: level, label: password ? labels[level] : '' };
}
