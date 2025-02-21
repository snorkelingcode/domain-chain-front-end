// src/components/ui/alert-dialog.tsx
import React from 'react';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

interface AlertDialogActionProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface AlertDialogCancelProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ 
  open, 
  onOpenChange, 
  children 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ 
  children,
  className = ""
}) => (
  <div className={`bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 ${className}`}>
    {children}
  </div>
);

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ 
  children 
}) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ 
  children 
}) => (
  <h2 className="text-xl font-semibold">
    {children}
  </h2>
);

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ 
  children 
}) => (
  <p className="text-gray-600 mt-2">
    {children}
  </p>
);

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ 
  children 
}) => (
  <div className="flex justify-end gap-3 p-6 pt-4 border-t">
    {children}
  </div>
);

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ 
  onClick,
  disabled,
  className = "",
  children 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${
      disabled ? 'bg-gray-300 cursor-not-allowed' : className || 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
  >
    {children}
  </button>
);

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ 
  onClick,
  children 
}) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
  >
    {children}
  </button>
);