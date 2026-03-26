import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div>
        <h1>Product Dashboard</h1>
        <p>Welcome, {user?.name || 'User'}</p>
      </div>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
