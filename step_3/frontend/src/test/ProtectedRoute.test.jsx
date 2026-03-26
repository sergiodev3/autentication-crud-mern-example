import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('ProtectedRoute', () => {
  test('redirects unauthenticated users to login page', async () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });
});
