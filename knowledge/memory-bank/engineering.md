# 1. Software Engineering Standards
- **Read Before Write:** Before creating a new utility, helper, or component, you MUST search the codebase (`list_files`, `read_file`) to ensure one doesn't already exist.
- **Extend, Don't Append (DRY):** NEVER copy-paste an existing function to create a slightly different version (e.g., `process_data_v2` or `process_data_with_flag`). You MUST refactor the original function to accept new parameters, use default arguments, or use composition.
- **Refactoring over Appending:** If a file exceeds ~300 lines, or a function exceeds ~50 lines, you must stop and propose refactoring it into smaller, reusable modules or classes before adding new features to it. (Functional Programming)
- **Use Classes for State:** Use Object-Oriented Programming (Classes) when managing shared state, complex domain entities , or database connections. Do not scatter related state across loose, standalone functions.
- **No Dead Code:** Do not comment out old code "just in case." Delete it. Git handles history.
- **Fix mess instantly:** When modifying a file, if you see a small piece of messy code, duplicate logic, or a missing type hint nearby, clean it up as part of your current task.


# 2. Frontend React/shadcn Workflows

- **Check Existing Components First:** Always check `/frontend/src/components` and `/frontend/src/components/ui` for existing shadcn components before creating new ones. Install new shadcn components if needed via `npx shadcn@latest add <component>`.

- **Color Scheme:** Always use CSS variables from `/frontend/src/index.css`. Never hardcode hex values. Extend the theme if new colors are needed.

- **Component Structure:**

- Routes defined in `/frontend/src/App.tsx`

- Layouts in `/frontend/src/layouts/`

- Pages in `/frontend/src/pages/`

- Modified/Nested App specific Components in `/frontend/src/components/`

- Installed bare Components from shadcn to be build from in `/frontend/src/components/ui/`

- **Nested Component Logic:** Build small, reusable, nested components. A page should compose layout + components, not contain inline JSX logic.

- **Form Rendering:** Use `@rjsf/core` with `@rjsf/shadcn` theme for schema-driven forms. Never hardcode form fields.

# 3. Testing Standards
- Backend: `pytest` + `pytest-django`.
- Frontend: `vitest` + React Testing Library.