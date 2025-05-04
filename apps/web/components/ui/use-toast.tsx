'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback(
    ({ title, description, variant = 'default' }: ToastProps) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return { toast, toasts };
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={cn(
            'mb-2 rounded-lg border p-4 shadow-lg',
            variant === 'default' && 'bg-background text-foreground',
            variant === 'destructive' && 'bg-destructive text-destructive-foreground'
          )}
        >
          {title && <h4 className="font-medium">{title}</h4>}
          {description && <p className="text-sm">{description}</p>}
        </div>
      ))}
    </div>
  );
} 