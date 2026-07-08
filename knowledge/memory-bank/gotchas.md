# Gotchas & Known Pitfalls

## Django / Backend
- **JSONB Extra Fields:** When saving to the Storage Model, `extra='allow'` means typos in field names are silently ignored and not saved. Do not add strict validation to the storage model to "catch" these; the spec explicitly prefers losing typo'd data over blocking the save.
- **Oxigraph Sync:** Oxigraph is rebuilt via Django signals. If a test fails due to missing SPARQL data, ensure the signal handlers are mocked or triggered correctly in the test setup.
- **Split Visibility:** Remember that metadata visibility and attachment visibility are independent. Use `django-guardian` to assign these specific object-level permissions.

## React / Frontend
- **@rjsf/core Styling:** `@rjsf/core` default widgets don't match `shadcn/ui`. You MUST use the `@rjsf/shadcn` theme (or write custom widgets that wrap shadcn components). Do not mix raw HTML inputs with shadcn components in the form renderer.
- **Schema Versioning:** The form renderer must accept the specific JSON Schema version the record was created with, not just the "latest" schema from the `schemas/` folder.

## ORCID OAuth Authentication
- **Origin Mismatch (localhost vs 127.0.0.1):** Browsers treat `localhost` and `127.0.0.1` as different origins with separate cookie jars. **Fix**: Standardize entire stack on `127.0.0.1`:
  - `vite.config.ts`: `server.host = "127.0.0.1"`
  - `settings.py`: `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `HEADLESS_FRONTEND_URLS` all use `http://127.0.0.1:5173`
  - `nav-user.tsx`: Hardcode callback URL to `http://127.0.0.1:5173/auth/callback`, not `window.location.origin`

- **provider_signup Pending Flow:** New ORCID accounts return `is_pending: true` from allauth headless. The frontend must explicitly call `completeProviderSignup()` to finalize account creation. **Fix**: In `auth-callback.tsx`, after OAuth redirect, check if `!session.isAuthenticated`, then call `completeProviderSignup()` and re-fetch session.

- **409 Conflict on Signup:** A 409 response from `completeProviderSignup()` means "account already exists" - this is expected in React StrictMode (effects run twice). **Fix**: Always re-fetch session after signup attempt, regardless of response status. Catch 409 as non-error.

- **allauth API Response Structure:** User data is nested under `result.data.user`, not at root level. `is_authenticated` is in `result.meta`. **Fix**: In `getSession()`, access `result.data?.user` and `result.meta?.is_authenticated`.

- **allauth Adapter Method Name:** allauth 65.18.0 renamed `authentication_error` to `on_authentication_error`. **Fix**: In `adapters.py`, use `on_authentication_error()` method name.

- **Logout Endpoint Method:** allauth headless uses `DELETE /auth/session` to terminate the session, not `POST /auth/logout`. **Fix**: In `auth-client.ts`, `logout()` performs `DELETE /auth/session`.
