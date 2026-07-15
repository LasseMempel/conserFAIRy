# Tech Context

## Backend
- Django + django-ninja
- PostgreSQL (JSONB)
- pyoxigraph
- django-guardian (object permissions)
- django-allauth (ORCID OAuth2)
- pytest + pytest-django

### allauth headless configuration
- `HEADLESS_ONLY = True` - classic views disabled
- `HEADLESS_FRONTEND_URLS` defines callback URLs for OAuth flow
- `SOCIALACCOUNT_ONLY = True` - no local email/password signup
- `ACCOUNT_SIGNUP_FIELDS = ["email*"]` - minimal signup requirements
- Session-based auth with cookies (no JWT)
- CORS: `CORS_ALLOW_CREDENTIALS = True`, `CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:5173"]`
- CSRF: `CSRF_TRUSTED_ORIGINS = ["http://127.0.0.1:5173"]`

## Frontend
- Vite + React + TypeScript
- shadcn/ui
- @rjsf/core + @rjsf/shadcn (Forms)
- ajv (Validation)
- React Flow + dagre (Graph visualization)
- vitest + React Testing Library
- TanStackQuery
- react-router-dom

### allauth headless client (`auth-client.ts`)
- `getSession()` - Returns `{ user, isAuthenticated }` from `result.data.user` and `result.meta.is_authenticated`
- `redirectToProvider(providerId, callbackUrl)` - Form POST to trigger OAuth redirect
- `completeProviderSignup()` - Completes pending signup for new social accounts
- Uses `credentials: 'include'` for cookie-based session

## Tooling
- uv (Python dependencies)
