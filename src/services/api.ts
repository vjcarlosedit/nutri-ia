const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Almacenar token
let authToken: string | null = localStorage.getItem('nutriia_token');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('nutriia_token', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('nutriia_token');
};

// Función helper para hacer requests
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error: ${response.statusText}`);
  }

  return response.json();
}

// ========== AUTH ==========
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const data = await request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAuthToken(data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data;
  },

  verify: async () => {
    return request('/auth/verify');
  },

  logout: () => {
    clearAuthToken();
  },
};

// ========== EVALUATIONS ==========
export const evaluationsAPI = {
  getAll: async () => {
    return request<any[]>('/evaluations');
  },

  getByPatient: async (patientName: string) => {
    return request<any[]>(`/evaluations/patient/${encodeURIComponent(patientName)}`);
  },

  create: async (evaluationData: any) => {
    return request<any>('/evaluations', {
      method: 'POST',
      body: JSON.stringify(evaluationData),
    });
  },

  getStats: async () => {
    return request<{
      totalEvaluations: number;
      todayConsultations: number;
      activePatients: number;
    }>('/evaluations/stats');
  },
};

// ========== MEAL PLANS ==========
export const mealPlansAPI = {
  getAll: async () => {
    return request<any[]>('/meal-plans');
  },

  getByPatient: async (patientName: string) => {
    return request<any[]>(`/meal-plans/patient/${encodeURIComponent(patientName)}`);
  },

  generate: async (patientName: string, evaluationId: number, considerations?: string) => {
    return request<any>('/meal-plans/generate', {
      method: 'POST',
      body: JSON.stringify({ patientName, evaluationId, considerations }),
    });
  },

  create: async (planData: any) => {
    return request<any>('/meal-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },
};

// ========== MONITORING ==========
export const monitoringAPI = {
  getAll: async () => {
    return request<any[]>('/monitoring');
  },

  analyze: async (patientName: string) => {
    return request<any>('/monitoring/analyze', {
      method: 'POST',
      body: JSON.stringify({ patientName }),
    });
  },

  saveTracking: async (patientName: string, trackingData: any) => {
    return request<any>('/monitoring/tracking', {
      method: 'POST',
      body: JSON.stringify({ patientName, trackingData }),
    });
  },

  getPatients: async () => {
    return request<any[]>('/monitoring/patients');
  },
};

