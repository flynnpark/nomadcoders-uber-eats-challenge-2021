import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
}

export default function FormError({ errorMessage }: IFormErrorProps) {
  return <span className="font-medium text-red-500">{errorMessage}</span>;
}
