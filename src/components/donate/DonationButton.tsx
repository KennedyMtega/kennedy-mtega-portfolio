
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import DonationForm from './DonationForm';
import Button from '../ui/Button';
import { Heart } from 'lucide-react';

interface DonationButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'default' | 'icon';
  className?: string;
}

const DonationButton: React.FC<DonationButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        icon={<Heart size={16} />}
        onClick={() => setIsOpen(true)}
      >
        Support My Work
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg p-0">
          <DonationForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationButton;
