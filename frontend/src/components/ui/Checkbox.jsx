export default function Checkbox({ id, label, className = '', ...rest }) {
  return (
    <label htmlFor={id} className={`checkbox ${className}`}>
      <input id={id} type="checkbox" className="checkbox-input" {...rest} />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}
