import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className={styles.spinnerWrap} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}
