import React from 'react';

interface IButtonProps {
  type?: 'submit' | 'reset' | 'button';
  disabled: boolean;
  loading: boolean;
  actionText: string;
  className?: string;
}

export const Button: React.FC<IButtonProps> = ({
  type = 'button',
  disabled,
  loading,
  actionText,
  className,
}) => {
  return (
    <button
      type={type}
      role="button"
      className={`${className} py-3 text-white text-xl font-bold focus:outline-none  transition-colors rounded-sm ${
        disabled
          ? 'bg-gray-300 pointer-events-none'
          : 'bg-blue-400 hover:bg-blue-500'
      }`}
      disabled={disabled}
    >
      {loading ? 'Loading...' : actionText}
    </button>
  );
};
