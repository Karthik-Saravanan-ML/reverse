import type { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:8080';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login failed:', response.status, errorText);
      throw new Error(`Login failed (${response.status})`);
    }

    const data: AuthResponse = await response.json();
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async forgotPassword(_email: string): Promise<void> {
    throw new Error('Forgot password is not connected to the backend yet');
  },

  async resetPassword(_password: string, _token: string): Promise<void> {
    throw new Error('Reset password is not connected to the backend yet');
  },
};
