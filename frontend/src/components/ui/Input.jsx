import { forwardRef } from 'react';

const Input = forwardRef(function Input({ error = false, className = '', ...rest }, ref) {
  const classes = ['input', error && 'is-error', className].filter(Boolean).join(' ');
  return <input ref={ref} className={classes} {...rest} />;
});

export default Input;
