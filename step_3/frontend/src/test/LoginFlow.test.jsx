import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('Login flow', () => {
  test('logs in successfully and lands on products dashboard', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password1');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
    });

    expect(await screen.findByRole('heading', { name: /product dashboard/i })).toBeInTheDocument();
  });
});
