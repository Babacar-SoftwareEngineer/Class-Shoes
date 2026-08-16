export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function parseApiError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { message?: string; error?: string };
    return payload.message || payload.error || `La requête a échoué (${response.status}).`;
  } catch {
    return `La requête a échoué (${response.status}).`;
  }
}
