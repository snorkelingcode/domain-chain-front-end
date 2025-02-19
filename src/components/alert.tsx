import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  variant = 'default', 
  children, 
  className = '' 
}) => {
  const variantStyles = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div 
      role="alert" 
      className={`p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

const AlertTitle: React.FC<AlertTitleProps> = ({ 
  children, 
  className = '' 
}) => (
  <h5 className={`font-bold text-lg mb-2 ${className}`}>
    {children}
  </h5>
);

const AlertDescription: React.FC<AlertDescriptionProps> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-sm ${className}`}>
    {children}
  </p>
);

export { Alert, AlertTitle, AlertDescription };