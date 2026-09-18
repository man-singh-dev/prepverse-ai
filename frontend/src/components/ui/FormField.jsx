export default function FormField({ label, htmlFor, error, hint, required = false, children }) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
          {required && (
            <span className="required-mark" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <span className="form-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="form-hint">{hint}</span>
      ) : null}
    </div>
  );
}
