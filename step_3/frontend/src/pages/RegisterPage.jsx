import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ErrorAlert from '../components/ErrorAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import useAuth from '../hooks/useAuth';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const handleChange = (event) => {
    clearError();
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate('/products');
    } catch {
      // message managed in context
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p>Register to start managing your products.</p>

        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>

        <ErrorAlert message={error} />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>

        {loading && <LoadingSpinner label="Creating account" />}

        <p className={styles.linkRow}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
