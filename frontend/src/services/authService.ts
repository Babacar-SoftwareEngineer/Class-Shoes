import { API_BASE_URL, parseApiError } from '../lib/api';
import type { AuthResponse } from '../types/auth';

export interface RegisterPayload {
  email: string;
  password: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

async function requestAuth(path: '/api/auth/register' | '/api/auth/login', payload: RegisterPayload | LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return await response.json() as AuthResponse;
}

export function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return requestAuth('/api/auth/register', payload);
}

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return requestAuth('/api/auth/login', payload);
}
