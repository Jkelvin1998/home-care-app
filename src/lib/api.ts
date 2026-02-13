const API_BASE =
   import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'authToken';

export function getAuthToken() {
   return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
   localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
   localStorage.removeItem(TOKEN_KEY);
}

type RequestOptions = RequestInit & {
   auth?: boolean;
};

export async function apiRequest<T>(
   path: string,
   options: RequestOptions = {},
): Promise<T> {
   const headers = new Headers(options.headers || {});

   if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
   }

   if (options.auth) {
      const token = getAuthToken();

      if (token) {
         headers.set('Authorization', `Bearer ${token}`);
      }
   }

   const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
   });

   if (!response.ok) {
      let message = 'Request failed';

      try {
         const error = await response.json();
         message = error.message || message;
      } catch {
         // ignore JSON parse errors
      }
      throw new Error(message);
   }

   if (response.status === 204) {
      return undefined as T;
   }

   return response.json() as Promise<T>;
}

// console.log('API_BASE', import.meta.env.VITE_API_BASE_URL);
