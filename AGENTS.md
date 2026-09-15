# AGENTS.md

## Stack

Next.js 16+
React 19+
TypeScript strict
TanStack Query
Zustand
Tailwind
shadcn/ui / Radix
React Hook Form
Zod

Backend is a separate Node.js/Express application.

Never move backend business rules into the frontend.

Backend remains authoritative for:
- authentication / authorization
- prices / discounts
- stock
- orders
- payments
- seller ownership
- database operations



Default coding style: Prefer 2–5 simple readable statements over one complex statement. Give intermediate business values meaningful names. A reader should not need to mentally execute an expression to understand what it does.

For example, prefer:

const unitPrice = listing.sellingPriceInPaise;
const quantity = item.quantity;

const subtotal = unitPrice * quantity;
const discount = calculateDiscount(subtotal);
const total = subtotal - discount;

instead of:

const total =
  listing.sellingPriceInPaise * item.quantity -
  calculateDiscount(listing.sellingPriceInPaise * item.quantity);



# No Property Guessing

Do not guess which property contains the real value by chaining several possible fields.

Avoid:

```ts
const name =
  order.name ||
  order.customerName ||
  order.userName ||
  order.fullName ||
  "-";
```

Avoid:

```ts
const id =
  order._id ||
  order.orderId ||
  order.id ||
  order.slug ||
  "";
```

This hides an unclear data contract.

Know which property the API returns and use that property directly.

Prefer:

```ts
const customerName = order.customerName;
```

If the value is only needed for display, a simple display fallback is allowed:

```ts
const customerName = order.customerName || "-";
```

Or:

```tsx
<p>{order.customerName || "-"}</p>
```

For nullable values where `0`, `false`, or an empty string may be valid, prefer `??`:

```ts
const stock = order.stock ?? 0;
```

Do not write:

```ts
const stock = order.stock || 0;
```

when `0` is a meaningful value.

## API Shape Differences

If different API responses genuinely have different property names, normalize them once at the boundary.

Example:

```ts
const customerName = apiOrder.customerName;

return {
  customerName,
};
```

Then the rest of the application uses only:

```ts
order.customerName
```

Do not repeat compatibility fallbacks throughout components:

```ts
order.customerName ||
order.name ||
order.user?.name ||
order.customer?.name ||
"-"
```

If legacy compatibility is required, keep it inside one clearly named normalization function and document the precedence.

## Rule

Use:

```text
one known property
+
one simple display fallback when needed
```

Prefer:

```ts
order.name || "-"
```

over:

```ts
order.name ||
order.fullName ||
order.customerName ||
order.user?.name ||
order.profile?.name ||
"-"
```

Multiple property fallbacks usually mean the data contract needs to be fixed or normalized.


## Core Engineering Rules

Prefer:
- simple
- explicit
- typed
- predictable
- feature-focused

Avoid:
- clever abstractions
- premature optimization
- unnecessary dependencies
- duplicated sources of truth
- giant components


## Project Structure

Use feature-based organization.

src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
├── features/
├── stores/
├── hooks/
├── lib/
├── providers/
├── types/
└── constants/

Create folders only when needed.


## App Router

`app/` owns routing, layouts, metadata, loading/error states,
and lightweight page composition.

Keep page.tsx small.

Do not put API calls, forms, large JSX trees, business logic,
or complex state management directly in page.tsx.


## Server vs Client Components

Server Components are the default.

Only use `"use client"` when required for:
- React state/effects
- event handlers
- browser APIs
- TanStack Query hooks
- Zustand
- React Hook Form
- interactive UI

Keep client boundaries as small as practical.


## State Ownership

BACKEND DATA
→ TanStack Query

SHARED CLIENT UI STATE
→ Zustand

LOCAL COMPONENT STATE
→ useState / useReducer

SHAREABLE NAVIGATION STATE
→ URL / searchParams

Never duplicate TanStack Query server data in Zustand.


## API Architecture

Preferred flow:

Page
→ Feature Component
→ Query / Mutation Hook
→ Feature API Function
→ api-client
→ Express Backend

Do not make API calls directly inside large UI components.

Centralize HTTP configuration.

Do not hardcode backend URLs.


## TanStack Query

Use domain-specific query hooks.

Maintain consistent query-key factories.

Do not scatter arbitrary query keys.

Mutations should invalidate/update the smallest relevant cache scope.

Do not create generic `useApiQuery` / `useUniversalMutation`
abstractions without demonstrated need.


## TypeScript

Keep strict mode enabled.

Avoid:
- any
- @ts-ignore
- unsafe type assertions
- duplicated API/domain types

Prefer `type` unless interface extension/declaration merging is useful.

Validate runtime boundaries with Zod where necessary.


## Components

Components should primarily handle rendering and interaction.

STRICT:
- no file/component >= 300 lines
- review files around 200–250 lines
- ideally components stay below ~120 lines

Split by actual responsibility, not merely to reduce line count.

Extract:
- meaningful UI sections
- reusable logic
- schemas
- domain types
- constants


## Forms

Use React Hook Form + Zod for non-trivial forms.

Keep schema, mutation, and large form rendering separated when useful.


## UI

Use existing shadcn/Radix primitives for standard controls.

Prefer:
- Button
- Input
- Select
- Dialog
- Checkbox
- RadioGroup

over rebuilding equivalent controls with raw HTML.

Preserve existing design tokens and UI during migration.


## URL State

Search, pagination, sorting, and shareable filters should generally
live in search params.

Validate and normalize search params.

Use allowlists for values such as sorting.


## Money

Backend totals are authoritative.

Use paise internally when defined by the backend contract.

Convert to rupees only for presentation.

Never trust frontend-generated checkout totals.


## Authentication

Frontend guards improve UX only.

Backend authorization provides security.

Never trust frontend roles, hidden buttons, route guards,
or client-supplied ownership IDs for authorization.


## Navigation

Use Next.js APIs:
- next/link
- useRouter
- usePathname
- useSearchParams

Do not introduce TanStack Router.


## Effects

Do not reach for useEffect automatically.

First determine whether the logic can be:
- derived during render
- handled by an event
- handled by TanStack Query
- represented in the URL

Effects are mainly for synchronization with external systems.


## Accessibility & Responsive UI

Use semantic interactive elements.

Buttons perform actions.
Links perform navigation.

Forms require labels.
Images require meaningful alt text.

Support both mobile and desktop deliberately.


## Migration

The previous React application is the visual/behavioral reference.

Preserve:
- layout
- spacing
- typography
- colors
- responsive behavior
- user flows

Do not redesign unless explicitly requested.


## Before Editing

Inspect:
1. existing implementation
2. old React implementation if migrating
3. nearby conventions
4. shared components
5. hooks/query keys/stores
6. package.json before adding dependencies

Make the smallest coherent change.


## After Editing

Check:
- dead code
- unused imports
- debugging logs
- unnecessary `"use client"`
- duplicated state
- accessibility
- responsive behavior

Then run available checks:

npm run typecheck
npm run lint
npm run build
npm test

If no typecheck script exists:

npx tsc --noEmit

Never claim a command passed unless it was actually executed.


## Final Rule

Write code another developer can understand without asking
the original author for an explanation.

When two approaches work equally well, choose the one with:
- fewer concepts
- fewer dependencies
- clearer ownership
- smaller client boundary
- simpler testing
- less hidden behavior