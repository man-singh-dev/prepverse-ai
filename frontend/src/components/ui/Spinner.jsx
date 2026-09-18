export default function Spinner({ size = 'md', label = 'Loading' }) {
  const classes = ['spinner', size === 'sm' && 'spinner-sm', size === 'lg' && 'spinner-lg']
    .filter(Boolean)
    .join(' ');

  return <span className={classes} role="status" aria-label={label} />;
}
