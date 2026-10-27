const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.hiskule.skule.ca';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('hiskule_token');
  const headers = new Headers(init?.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed with status ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.error) {
        errorMsg = errData.error;
      } else if (errData?.message) {
        errorMsg = errData.message;
      }
    } catch {
      // response was not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}
