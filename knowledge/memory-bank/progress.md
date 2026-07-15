# Progress

## Milestones

### Authentication & User Management
- [x] **ORCID OAuth Authentication** - django-allauth integration with ORCID sandbox for user authentication. Full OAuth flow completes successfully with user data displayed in NavUser.
  - Backend: django-allauth with HEADLESS_ONLY mode, session-based auth via cookies
  - Frontend: auth-client.ts with getSession(), redirectToProvider(), completeProviderSignup()
  - Auth callback handling with error detection (orcid_email_missing, signup_failed, network_error)
  - Layout separation: AuthLayout for auth pages, AppLayout for main app with sidebar

### Core Architecture
- [x] Project architecture and Cline memory bank established.

### In Progress
- [ ] **Extended Django User Schema** - Configure user database scheme to store relevant information for user-connected SKOS concept schemes (main application functionality)