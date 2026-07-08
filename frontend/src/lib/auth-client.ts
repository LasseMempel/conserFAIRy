/**
 * allauth headless API client for conserFAIRy
 * 
 * Provides fetch wrapper with CSRF handling and credentials for session-based auth.
 * Uses browser client type for cookie/session authentication.
 * 
 * Note: Uses relative URLs to work with Vite proxy for same-origin requests.
 */

const ALLAUTH_API_BASE = '/_allauth/browser/v1';

/**
 * Extract CSRF token from the csrftoken cookie
 */
function getCsrfToken(): string {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return '';
}

/**
 * Custom fetch wrapper that includes CSRF token and credentials
 * for all unsafe HTTP methods (POST, PUT, DELETE, PATCH)
 */
export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${ALLAUTH_API_BASE}${endpoint}`;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add CSRF token for unsafe methods
  if (options.method && !['GET', 'HEAD', 'OPTIONS'].includes(options.method.toUpperCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      (headers as Record<string, string>)['X-CSRFToken'] = csrfToken;
    }
  }

  // Always include credentials for cookie-based auth
  // Note: Using relative URLs, so cookies work via Vite proxy
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
    mode: 'cors',
  });
}

/**
 * Get the current authentication session
 */
export async function getSession(): Promise<{
  user: {
    id: string;
    email: string;
    name?: string; // Note: API returns 'display' and 'username', not 'name'
    avatar?: string;
  } | null;
  isAuthenticated: boolean;
}> {
  const response = await authFetch('/auth/session');
  
  if (response.status === 200) {
    const result = await response.json();
    // Access user from data.user instead of root user
    const userData = result.data?.user || null;
    
    return {
      user: userData ? {
        id: userData.id.toString(), // Convert number ID to string
        email: userData.email,
        name: userData.display, // Map display or username to name
        // avatar: undefined // Not provided in API
      } : null,
      isAuthenticated: result.meta?.is_authenticated ?? false,
    };
  }
  
  return {
    user: null,
    isAuthenticated: false,
  };
}

/**
 * Get the list of available social authentication providers
 */
export async function getProviders(): Promise<
  Array<{
    id: string;
    name: string;
  }>
> {
  const response = await authFetch('/auth/providers');
  
  if (response.status === 200) {
    const data = await response.json();
    return data.providers || [];
  }
  
  return [];
}

/**
 * Initiate logout
 */
export async function logout(): Promise<void> {
  await authFetch('/auth/session', {
    method: 'DELETE',
  });
}

/**
 * Redirect to a social provider for authentication.
 * 
 * This performs a form POST to the headless API's redirect endpoint,
 * which responds with a 302 redirect to the provider's login page.
 * This is required when HEADLESS_ONLY = True in Django settings.
 * 
 * @param providerId - The provider ID (e.g., 'orcid')
 * @param callbackUrl - Absolute URL to redirect to after successful login
 */
export function redirectToProvider(
  providerId: string,
  callbackUrl: string
): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `${ALLAUTH_API_BASE}/auth/provider/redirect`;
  form.style.display = 'none';

  const fields: Record<string, string> = {
    provider: providerId,
    callback_url: callbackUrl,
    process: 'login',
    csrfmiddlewaretoken: getCsrfToken(),
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export async function completeProviderSignup(): Promise<Response> {
  return authFetch('/auth/provider/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}

export const settings = {
  client: 'browser' as const,
  apiBase: ALLAUTH_API_BASE,
};

export const Client = {
  BROWSER: 'browser',
} as const;