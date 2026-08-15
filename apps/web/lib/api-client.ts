import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;
  private refreshing: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true, // for refresh token cookie
      timeout: 30000,
    });

    // Request interceptor — attach access token
    this.client.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor — handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (!this.refreshing) {
              this.refreshing = this.doRefresh();
            }
            const newToken = await this.refreshing;
            this.refreshing = null;
            this.setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch {
            this.refreshing = null;
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login?reason=session_expired';
            }
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async doRefresh(): Promise<string> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return response.data.data.accessToken;
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('at') || localStorage.getItem('at');
  }

  public setAccessToken(token: string) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('at', token);
  }

  public clearTokens() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('at');
    localStorage.removeItem('at');
  }

  // Typed wrappers
  async get<T>(url: string, params?: any): Promise<T> {
    const res = await this.client.get<{ data: T }>(url, { params });
    return res.data.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const res = await this.client.post<{ data: T }>(url, data);
    return res.data.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const res = await this.client.patch<{ data: T }>(url, data);
    return res.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const res = await this.client.delete<{ data: T }>(url);
    return res.data.data;
  }

  async upload<T>(url: string, formData: FormData): Promise<T> {
    const res = await this.client.post<{ data: T }>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  }
}

export const apiClient = new ApiClient();
