export default function Button({
  children,
  variant = 'primary',
  size,
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    fullWidth && 'btn-block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading && <span className="spinner spinner-sm" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
