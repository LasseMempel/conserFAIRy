# Active Context

## Current Focus

**ORCID OAuth Authentication** - django-allauth integration with ORCID sandbox for user authentication. **Status: Working** - Full OAuth flow completes successfully with user data displayed in NavUser.

## Authentication Architecture

### Backend (Django)
- **Library**: `django-allauth` with `django-allauth[socialaccount]` and `django-environ`
- **Provider**: ORCID sandbox (`sandbox.orcid.org`)
- **Session-based auth** via cookies (no JWT)
- **Headless mode**: `HEADLESS_ONLY = True` - classic views disabled, only headless API available

### Key Backend Files
- `backend/djangoproject/settings.py`:
  - `INSTALLED_APPS`: `django.contrib.sites`, `allauth`, `allauth.socialaccount`, `allauth.socialaccount.providers.orcid`, `allauth.headless`
  - `SITE_ID = 1`
  - `SOCIALACCOUNT_PROVIDERS` with ORCID sandbox config (`base_domain: "sandbox.orcid.org"`)
  - CORS: `CORS_ALLOW_CREDENTIALS = True`, `CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:5173"]`
  - CSRF: `CSRF_TRUSTED_ORIGINS`, `CSRF_COOKIE_HTTPONLY = False`, `SESSION_COOKIE_SAMESITE = 'Lax'`
  - `HEADLESS_ONLY = True` - classic views disabled
  - `HEADLESS_FRONTEND_URLS` with `socialaccount_login_callback` for redirect after OAuth

- `backend/djangoproject/urls.py`:
  - `/accounts/` - OAuth provider callbacks (headless only)
  - `/_allauth/` - Headless API endpoints

- `backend/.env.example`: Template for `ORCID_CLIENT_ID` and `ORCID_CLIENT_SECRET`

### Frontend (React + Vite)
- **Auth Client**: `frontend/src/lib/auth-client.ts`
  - Uses relative URLs (proxied via Vite)
  - `getSession()` - Access `result.data.user` and `result.meta.is_authenticated`
  - `logout()` - `DELETE /auth/session` to terminate session
  - `redirectToProvider(providerId, callbackUrl)` - Form POST to trigger OAuth redirect
  - `completeProviderSignup()` - Completes pending signup for new social accounts
  - `credentials: 'include'` for cookie-based auth

- **Session Hook**: `frontend/src/hooks/use-session.ts`
  - `useSession()` - Returns user, isAuthenticated, isLoading
  - `useLogout()` - Logout mutation with cache invalidation
  - Uses TanStack Query for caching

- **NavUser Component**: `frontend/src/components/nav-user.tsx`
  - Shows "Sign in with ORCID" when not authenticated
  - Shows user dropdown menu when authenticated
  - Uses `redirectToProvider('orcid', ...)` for login

- **Auth Pages**:
  - `frontend/src/pages/auth-callback.tsx` - Handles successful OAuth redirect
  - `frontend/src/pages/auth-error.tsx` - Displays authentication errors

- **Vite Proxy** (`frontend/vite.config.ts`):
  - `/_allauth/*` → `http://127.0.0.1:8000/_allauth/*`
  - `/accounts/*` → `http://127.0.0.1:8000/accounts/*`
  - Enables same-origin cookie handling

### ORCID Sandbox Registration
- **URL**: https://sandbox.orcid.org/oauth/admin
- **Redirect URI**: `http://127.0.0.1:8000/accounts/orcid/login/callback/`
- **Application type**: Web application
- **Client type**: Confidential

### Flow
1. User clicks "Sign in with ORCID" in NavUser
2. `redirectToProvider()` creates form POST to `/_allauth/browser/v1/auth/provider/redirect`
3. Django responds with 302 redirect to ORCID sandbox login
4. User authenticates with ORCID
5. ORCID redirects back to `/accounts/orcid/login/callback/`
6. Django creates session, redirects to `/auth/callback` (per `HEADLESS_FRONTEND_URLS`)
7. **For new users**: `auth-callback.tsx` calls `completeProviderSignup()` to finalize account creation
8. Session is re-fetched, user data populated from `result.data.user`
9. Frontend redirects to `/` with authenticated user displayed in NavUser
10. Subsequent `/session` requests return 200 with user data

### API Response Structure (allauth headless)
```json
{
  "status": 200,
  "data": {
    "user": {
      "id": 1,
      "display": "username",
      "email": "user@example.com",
      "has_usable_password": false,
      "username": "username"
    },
    "methods": [...]
  },
  "meta": {
    "is_authenticated": true
  }
}
```
**Key**: User data is nested under `data.user`, not at root level. `is_authenticated` is in `meta`.

## Next Steps
- Add ORCID credentials to `backend/.env`
- Test full login flow
- Implement `<Concept>Storage` and `<Concept>Quality` dual-model generation logic
- Set up the basic Django-ninja API structure
- Set up the SKOS TTL -> Pydantic -> JSON Schema generation pipeline in `schemas/scripts/`