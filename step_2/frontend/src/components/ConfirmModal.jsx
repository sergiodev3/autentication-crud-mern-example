import styles from './ConfirmModal.module.css';

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  isLoading = false
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{title}</h3>
        <p>{description}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className={styles.danger} onClick={onConfirm} disabled={isLoading}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
