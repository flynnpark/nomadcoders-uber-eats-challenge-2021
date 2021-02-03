import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span
    role="alert"
    className="w-full text-left my-1 text-red-500 text-sm font-medium"
  >
    {errorMessage}
  </span>
);
