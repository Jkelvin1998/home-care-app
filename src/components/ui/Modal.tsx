import { useEffect } from 'react';
import type { ModalProps } from '../../types/modal';
import '../../css/Modal.css';

export default function Modal({ open, onClose, children }: ModalProps) {
   useEffect(() => {
      if (!open) return;

      const onKey = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
   }, [open, onClose]);

   if (!open) return null;

   return (
      <div className="modal-backdrop" onClick={onClose}>
         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
         </div>
      </div>
   );
}
