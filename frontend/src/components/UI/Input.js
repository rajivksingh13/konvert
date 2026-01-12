import React from 'react';

export const TextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  readOnly = false,
  className = '',
  id,
  ...props 
}) => {
  return (
    <textarea
      id={id}
      className={`textarea-modern ${readOnly ? 'bg-[var(--bg-secondary)]' : ''} ${className}`.trim()}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      {...props}
    />
  );
};

export const Select = ({ 
  value, 
  onChange, 
  options, 
  className = '',
  id,
  ...props 
}) => {
  return (
    <select
      id={id}
      className={`input-modern ${className}`.trim()}
      value={value}
      onChange={onChange}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const Label = ({ children, htmlFor, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-semibold text-[var(--text-primary)] ${className}`.trim()}>
      {children}
    </label>
  );
};
