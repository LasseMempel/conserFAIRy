# React + shadcn/ui for Vue3/Quasar Developers

A practical mapping of the concepts you already know in Vue3/Quasar to their React/shadcn equivalents. Code-first, opinionated — where there are multiple "valid" React answers, I picked the one that's idiomatic in a shadcn/Vite/TS stack and told you why.

## Quick mental model shift

Vue's reactivity system (proxies via `ref`/`reactive`) tracks *mutations*. React's model is **re-render on state change, compare via reference equality**. This is the single biggest mindset shift:

- In Vue, mutating `state.items.push(x)` works because the proxy intercepts it.
- In React, mutating an array/object in place does **nothing visible** — React doesn't know it changed. You must create a *new* reference: `setItems([...items, x])`.

Keep "immutable updates" in your head for everything below. It explains 80% of React footguns coming from Vue.

| Vue3 / Quasar | React / shadcn ecosystem |
|---|---|
| `ref()` / `reactive()` | `useState()` |
| `computed()` | derived value in render, or `useMemo()` |
| `watch()` / `watchEffect()` | `useEffect()` |
| `onMounted()` / `onUnmounted()` | `useEffect(() => { ...; return cleanup }, [])` |
| Composables (`useXyz.ts`) | Custom hooks (`useXyz.ts`) |
| `v-if` / `v-show` | ternary / `&&` in JSX |
| `v-for` | `.map()` |
| `v-model` | controlled input (`value` + `onChange`) |
| Slots | `children` / render props |
| `vue-router` | `react-router` |
| Pinia | Zustand |
| Quasar components (`QBtn`, `QTable`...) | shadcn primitives (`Button`, `DataTable`...) + Tailwind |
| `$refs` / template refs | `useRef()` |
| `provide`/`inject` | `Context` |
| VueUse | usehooks-ts / TanStack Query / roll your own hook |

---

## 1. Dynamic variables & rendering

Vue:
```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
<template>
  <p>Count: {{ count }}</p>
  <button @click="count++">Increment</button>
</template>
```

React:
```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}
```

Key differences:
- `setCount` **replaces** the value; it doesn't mutate. For objects/arrays always spread: `setUser({ ...user, name: 'x' })`.
- `setCount(count + 1)` reads stale `count` if called multiple times in one tick. Use the updater form when the new value depends on the old one: `setCount(c => c + 1)`.
- There's no separate `.value` unwrapping — JSX expressions are just JS expressions in `{}`.

## 2. Computed values

Vue:
```vue
<script setup>
const fullName = computed(() => `${first.value} ${last.value}`)
</script>
```

React — for cheap derivations, just compute inline on every render (React re-renders are cheap, this is *not* premature pessimization):
```tsx
const fullName = `${first} ${last}` // recalculated every render, fine
```

Only reach for `useMemo` when the calculation is genuinely expensive (e.g. filtering/sorting thousands of rows) or you need referential stability for a dependency array:
```tsx
const sorted = useMemo(() => [...items].sort(compareFn), [items])
```

## 3. Conditional rendering

Vue:
```vue
<template>
  <div v-if="status === 'loading'">Loading…</div>
  <div v-else-if="status === 'error'">{{ error }}</div>
  <div v-else>{{ data }}</div>
  <div v-show="isVisible">Toggled without unmount</div>
</template>
```

React — no special directive, it's just JS branching inside JSX:
```tsx
function Status({ status, error, data, isVisible }: Props) {
  if (status === 'loading') return <div>Loading…</div>
  if (status === 'error') return <div>{error}</div>

  return (
    <>
      <div>{data}</div>
      <div style={{ display: isVisible ? 'block' : 'none' }}>
        Toggled without unmount
      </div>
    </>
  )
}
```

For inline branches, ternary for either/or, `&&` for show/nothing:
```tsx
{isLoggedIn ? <Dashboard /> : <LoginForm />}
{hasErrors && <ErrorBanner />}
```

Watch the `&&` footgun: `{count && <Badge>{count}</Badge>}` renders a literal `0` when `count` is `0`, since `0` is falsy but still gets rendered as a node. Use `{count > 0 && ...}` or `{Boolean(count) && ...}`.

## 4. List rendering

Vue:
```vue
<template>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</template>
```

React:
```tsx
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

Same rule as Vue: `key` must be stable and unique (use an ID, never the array index unless the list is static and never reordered).

## 5. Two-way binding & forms

Vue's `v-model` doesn't exist in React — every input is "controlled" explicitly via `value` + `onChange`:

```tsx
const [name, setName] = useState('')
<Input value={name} onChange={e => setName(e.target.value)} />
```

For anything beyond a single field, hand-rolling controlled inputs gets tedious fast. shadcn's own form blocks are built on **react-hook-form + zod**, and it's worth adopting that pattern directly rather than fighting it:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  title: z.string().min(1, 'Required'),
  vocabularyUri: z.string().url(),
})

function VocabForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', vocabularyUri: '' },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values) // already validated & typed
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
```

This is the React/shadcn equivalent of Quasar's `QForm` + validation rules, except validation lives in one zod schema you can also share with your Pydantic/LinkML-generated types' shape if you keep field names aligned.

## 6. Props & events

Vue:
```vue
<script setup>
defineProps<{ label: string }>()
const emit = defineEmits<{ save: [value: string] }>()
</script>
<template>
  <button @click="emit('save', label)">{{ label }}</button>
</template>
```

React — props are just a typed function argument; "events" are just callback props you name yourself:
```tsx
type ButtonProps = {
  label: string
  onSave: (value: string) => void
}

function SaveButton({ label, onSave }: ButtonProps) {
  return <button onClick={() => onSave(label)}>{label}</button>
}
```

No `emit` mechanism, no event name strings — it's plain function calls, which TypeScript checks for you.

## 7. Watchers & side effects

Vue:
```vue
<script setup>
watch(searchQuery, (newVal) => {
  fetchResults(newVal)
})
</script>
```

React:
```tsx
useEffect(() => {
  fetchResults(searchQuery)
}, [searchQuery]) // re-runs whenever searchQuery changes
```

The dependency array is the part Vue devs trip on most — it's not optional decoration, it's the actual mechanism that decides when the effect re-runs. Missing a dependency is the #1 source of stale-closure bugs in React. `eslint-plugin-react-hooks` will catch most of these; turn it on.

`watchEffect`'s "auto-track whatever you read" behavior has no React equivalent — you declare dependencies explicitly, always.

## 8. Lifecycle hooks

Vue:
```vue
<script setup>
onMounted(() => {
  const sub = subscribe()
  onUnmounted(() => sub.close())
})
</script>
```

React — mount/unmount is just an effect with an empty dependency array and a cleanup return:
```tsx
useEffect(() => {
  const sub = subscribe()
  return () => sub.close() // cleanup, runs on unmount (and before every re-run)
}, [])
```

No separate `onUnmounted` — the cleanup function returned from `useEffect` *is* your unmount hook, and it also runs between re-runs if dependencies change, which is genuinely useful for things like aborting stale fetches.

## 9. DOM refs

Vue:
```vue
<template><input ref="inputEl" /></template>
<script setup>
const inputEl = ref<HTMLInputElement>()
onMounted(() => inputEl.value?.focus())
</script>
```

React:
```tsx
const inputEl = useRef<HTMLInputElement>(null)
useEffect(() => inputEl.current?.focus(), [])
return <input ref={inputEl} />
```

`useRef` is also React's escape hatch for "a mutable value that should survive re-renders but never trigger one" — your closest equivalent to a non-reactive Vue variable.

## 10. Composables → custom hooks

This one maps almost 1:1 in spirit. A Vue composable:
```ts
// useThesaurusSearch.ts
export function useThesaurusSearch(query: Ref<string>) {
  const results = ref<Concept[]>([])
  watch(query, async (q) => { results.value = await search(q) })
  return { results }
}
```

React custom hook (just a function starting with `use` that calls other hooks):
```ts
// useThesaurusSearch.ts
export function useThesaurusSearch(query: string) {
  const [results, setResults] = useState<Concept[]>([])
  useEffect(() => {
    search(query).then(setResults)
  }, [query])
  return { results }
}
```

Same extraction philosophy — pull stateful logic out of components into reusable functions. The naming convention (`use*`) is enforced by the Rules of Hooks (hooks can only be called at the top level of a component or another hook, never conditionally or in loops).

## 11. Slots → children & render props

Vue:
```vue
<template>
  <Card>
    <template #header>Title</template>
    <p>Body content</p>
  </Card>
</template>
```

React — default slot is just `children`:
```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>
}
<Card><p>Body content</p></Card>
```

For named slots, pass elements as regular props:
```tsx
function Card({ header, children }: { header?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      {children}
    </div>
  )
}
<Card header={<h2>Title</h2>}><p>Body content</p></Card>
```

shadcn components (e.g. `Dialog`, `Card`, `Accordion`) lean heavily on this composition-via-children pattern instead of named slots.

## 12. Routes & pages

Vue:
```ts
const routes = [
  { path: '/vocabularies', component: VocabList },
  { path: '/vocabularies/:id', component: VocabDetail },
]
```

React — recommend **react-router** (v6/v7, "data router" API) over alternatives like TanStack Router for a Vite SPA migrating from vue-router, since the mental model (route config → component, `useParams`, nested `<Outlet>`) maps closely to what you already know:

```tsx
import { createBrowserRouter, RouterProvider, Outlet, useParams, Link } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // has <Outlet/> where children render — like router-view
    children: [
      { path: 'vocabularies', element: <VocabList /> },
      { path: 'vocabularies/:id', element: <VocabDetail /> },
    ],
  },
])

function VocabDetail() {
  const { id } = useParams() // === route.params.id in vue-router
  // ...
}

function App() {
  return <RouterProvider router={router} />
}
```

Navigation: `<Link to="/vocabularies">` instead of `<router-link to="...">`; `useNavigate()` instead of `router.push(...)`.

If conserFAIRy's routes need data loaded *before* the page renders (avoiding a loading flash), react-router's `loader` functions on each route are the equivalent of Vue Router's navigation guards + Pinia fetch-on-enter pattern — worth adopting once you've got the basics down, not necessary for v1.

## 13. Global state — the Pinia equivalent

**Recommendation: Zustand.** It's the closest thing to Pinia's ergonomics (no boilerplate, no providers, just a hook), versus Redux Toolkit (much more ceremony) or bare Context (fine for rarely-changing values, bad for frequently-updated state — every consumer re-renders on every change).

Pinia:
```ts
// stores/vocab.ts
export const useVocabStore = defineStore('vocab', {
  state: () => ({ concepts: [] as Concept[], selectedId: null as string | null }),
  getters: {
    selected: (state) => state.concepts.find(c => c.id === state.selectedId),
  },
  actions: {
    async fetchConcepts() {
      this.concepts = await api.getConcepts()
    },
  },
})
```

Zustand:
```ts
// stores/vocabStore.ts
import { create } from 'zustand'

type VocabState = {
  concepts: Concept[]
  selectedId: string | null
  fetchConcepts: () => Promise<void>
  select: (id: string) => void
}

export const useVocabStore = create<VocabState>((set, get) => ({
  concepts: [],
  selectedId: null,
  fetchConcepts: async () => {
    const concepts = await api.getConcepts()
    set({ concepts })
  },
  select: (id) => set({ selectedId: id }),
}))

// "getter" equivalent — just a selector function, computed at usage site
export const useSelectedConcept = () =>
  useVocabStore(state => state.concepts.find(c => c.id === state.selectedId))
```

Usage in any component, on any page, no provider wrapping needed (this is the big win over Context):
```tsx
function ConceptList() {
  const { concepts, fetchConcepts } = useVocabStore()
  useEffect(() => { fetchConcepts() }, [])
  return <ul>{concepts.map(c => <li key={c.id}>{c.name}</li>)}</ul>
}
```

One real difference from Pinia: **selector granularity matters for performance.** `useVocabStore()` with no selector subscribes the component to *every* field change. For a component that only needs `selectedId`, write `useVocabStore(state => state.selectedId)` so it only re-renders when that slice changes. Pinia's reactivity granularity is automatic; Zustand's is explicit.

## 14. Server state / data fetching (the thing VueUse or Pinia+axios usually does)

This isn't really a Vue concept you have a 1:1 name for, but it's worth calling out because it replaces a lot of what people otherwise cram into a Pinia store: caching, refetching, loading/error states, deduplication.

**Recommendation: TanStack Query** (`@tanstack/react-query` — same library has a Vue version, so the concepts you'd reach for there transfer directly):

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function VocabList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['concepts'],
    queryFn: () => api.getConcepts(),
  })

  if (isLoading) return <Spinner />
  if (error) return <ErrorBanner message={error.message} />
  return <ul>{data!.map(c => <li key={c.id}>{c.name}</li>)}</ul>
}

function useCreateConcept() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newConcept: NewConcept) => api.createConcept(newConcept),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['concepts'] }),
  })
}
```

Practical division of labor for conserFAIRy: **Zustand for client-only UI state** (selected concept, sidebar open/closed, form drafts) and **TanStack Query for anything coming from your django-ninja API** (vocab lists, SKOS concepts, Oxigraph-backed queries). Don't put server data in Zustand — you'll end up reinventing cache invalidation by hand.

## 15. Component library philosophy: Quasar vs shadcn

This is the one place where there's no code mapping, because the *model* is different, not just the syntax:

- **Quasar** ships a closed set of pre-styled, pre-behaviored components you import and configure via props (`<QTable :rows="rows" :columns="columns" />`). You take what it gives you and theme it via SCSS variables.
- **shadcn/ui** is not a library you install — it's a CLI that *copies component source code* into your repo (`components/ui/button.tsx`). You own and can edit every line. It's built on Radix UI primitives (unstyled, accessible behavior) + Tailwind (styling). There's no "shadcn version" running in node_modules; if you want to change how `Button` works, you edit the file directly.

Practical implication: anywhere Quasar gave you a prop to flip (`dense`, `outline`, `color="primary"`), shadcn gives you either a variant defined via `class-variance-authority` (`cva`) in the component file itself, or you just edit the Tailwind classes in place. There's no central theme config object to hunt through — the theme lives in your CSS variables (which you've already set up with the Azurit-Blau/Dunkelblau/Sandton palette) plus whatever each component's `cva` variants define.

For data-heavy UI like SKOS concept tables, there's no shadcn `QTable` equivalent out of the box — the common pairing is shadcn's `Table` primitive (just styled `<table>`) + **TanStack Table** for sorting/filtering/pagination logic, the same pairing philosophy as TanStack Query above.

## 16. Things with no real Vue equivalent — adjust your expectations

- **No template syntax** — there's no separate template language, no directives, no special attribute binding syntax (`:prop`, `@event`). JSX is just JavaScript; everything is an expression.
- **Re-renders, not fine-grained reactivity.** When state changes, the whole component function re-runs (cheaply — it's not a full DOM rebuild, React diffs and patches). This is why things like `useMemo`/`useCallback`/`React.memo` exist: not because React is slow, but as escape hatches for the cases where re-running is genuinely wasteful.
- **Closures over stale state** is the React-specific bug class you haven't had to think about in Vue's proxy-based reactivity. A function defined in one render "sees" the props/state values from *that* render, even if called later. This is what the `useEffect` dependency array protects you from.
- **Strict Mode double-invokes effects** in development (intentionally, to surface missing cleanup) — if you see effects firing twice locally, that's expected, not a bug.
- **No `<script setup>` magic compiler step.** Nothing in your component file is transformed beyond standard JSX→JS; what you write is closer to what runs.

---

If you want, I can also do a focused pass once you've got a couple of conserFAIRy pages drafted in React — happy to review your first Zustand store or your first react-router setup against the actual SKOS vocabulary management screens rather than toy examples.
