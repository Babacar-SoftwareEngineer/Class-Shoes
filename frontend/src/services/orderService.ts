import { API_BASE_URL, parseApiError } from '../lib/api';
import type { CreateOrderPayload, CreateOrderResponse } from '../types/order';

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return await response.json() as CreateOrderResponse;
}
