import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export const Toast: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1B1B1B',
          color: '#FFFFFF',
          border: '1px solid #2F2F2F',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          fontFamily: 'var(--font-sans)',
        },
        className: 'font-sans',
      }}
    />
  );
};
