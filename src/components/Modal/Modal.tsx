import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

function Modal({ children, closeModal }: ModalProps) {
  const backdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleCloseModal = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleCloseModal);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleCloseModal);
      document.body.style.overflow = '';
    };
  }, [closeModal]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={backdropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}

export default Modal;
