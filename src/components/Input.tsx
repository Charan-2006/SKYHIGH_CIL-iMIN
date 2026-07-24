import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-semibold uppercase tracking-wider text-cortex-gray"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-cortex-dark 
            placeholder-cortex-light-gray transition-colors outline-none
            focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-cortex-border'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs text-red-600 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-cortex-gray/80">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
