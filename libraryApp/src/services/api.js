// Bazowa konfiguracja API
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Uniwersalna funkcja do wykonywania requestów HTTP
 * @param {string} endpoint - ścieżka API (np. '/ksiazki')
 * @param {object} options - opcje fetch (method, body, headers, etc.)
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  // Obsługa błędów
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }

    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Jeśli response jest pusty (204 No Content), zwróć null
  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return null;
  }

  return response.json();
};

export default apiRequest;
