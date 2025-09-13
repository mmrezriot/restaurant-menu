import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div className={cn(
          'relative transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg animate-fade-in',
          className
        )}>
          <div className="bg-gradient-to-br from-white to-gray-50 px-6 pb-6 pt-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
