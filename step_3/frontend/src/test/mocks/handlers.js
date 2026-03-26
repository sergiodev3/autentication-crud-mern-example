import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api/v1';

export const handlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();

    if (body.email === 'jane@example.com' && body.password === 'Password1') {
      return HttpResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            token: 'mock-jwt-token',
            user: { _id: 'user-1', name: 'Jane Dev', email: 'jane@example.com' }
          }
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid credentials'
      },
      { status: 401 }
    );
  }),

  http.get(`${API_URL}/products`, () =>
    HttpResponse.json(
      {
        success: true,
        message: 'Products fetched successfully',
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
      },
      { status: 200 }
    )
  )
];
