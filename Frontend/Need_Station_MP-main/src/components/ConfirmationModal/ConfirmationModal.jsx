import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onClose}>
            {cancelText}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
