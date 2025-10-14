import { BASE_URL } from '../settings';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Client endpoints
  async createTask(taskData) {
    return this.request('/api/v1/clients/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTasks() {
    return this.request('/api/v1/clients/tasks');
  }

  async getServices() {
    return this.request('/api/v1/clients/services');
  }

  // Admin endpoints
  async getAdmins() {
    return this.request('/api/v1/admins/');
  }

  async createAdmin(adminData) {
    return this.request('/api/v1/admins/', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }
}

export const apiClient = new ApiClient(BASE_URL);