const BASE_URL = 'https://mock-backend-hintro.vercel.app';


async function apiRequest(endpoint, userId, params = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId
  };

  let url = `${BASE_URL}${endpoint}`;
  
  if (Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  
  getProfile: (userId) => apiRequest('/api/auth/profile', userId),

  
  getDashboard: (userId) => apiRequest('/api/auth/dashboard', userId),

  
  getStats: (userId) => apiRequest('/api/call-sessions/stats', userId),

  
  getCallHistory: (userId, limit = 10) => apiRequest('/api/call-sessions', userId, { limit })
};
