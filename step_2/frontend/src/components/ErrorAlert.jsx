import styles from './ErrorAlert.module.css';

export default function ErrorAlert({ message }) {
  if (!message) {
    return null;
  }

  return <p className={styles.error}>{message}</p>;
}
