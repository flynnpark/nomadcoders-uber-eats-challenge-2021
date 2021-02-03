import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  className?: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  className,
}) => (
  <button
    className={`${className} py-3 text-white text-xl font-bold focus:outline-none  transition-colors rounded-sm ${
      canClick
        ? 'bg-blue-400 hover:bg-blue-500'
        : 'bg-gray-300 pointer-events-none'
    }`}
  >
    {loading ? 'Loading...' : actionText}
  </button>
);
