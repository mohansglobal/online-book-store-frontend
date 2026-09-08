# AGENTS.md

## Purpose

This file defines engineering rules for the Next.js frontend.

All AI agents and contributors must follow these rules when creating, editing, refactoring, reviewing, or deleting frontend code.

Primary goals:

* readable code
* predictable structure
* strong TypeScript safety
* small focused components
* clear separation of concerns
* reusable feature logic
* predictable data fetching
* minimal global state
* accessible UI
* minimal duplication
* easy testing
* easy maintenance

Prefer simple code over clever code.

Do not introduce abstractions, folders, libraries, patterns, or dependencies unless they solve a real problem.

---

# 1. Project Stack

Frontend stack:

```text
Next.js 16+
App Router
React 19+
TypeScript strict mode
TanStack Query
Zustand
Tailwind CSS
shadcn/ui / Radix UI
React Hook Form
Zod
```

Backend is a separate Node.js + Express API.

Do not move backend business logic into Next.js Route Handlers.

Next.js is the frontend application.

The Node.js API remains authoritative for:

```text
authentication
authorization
prices
stock
discounts
orders
payments
seller ownership
business rules
database operations
```

---

# 2. Core Principles

Follow these priorities:

1. Correctness
2. Readability
3. Simplicity
4. Consistency
5. Type safety
6. Separation of concerns
7. Maintainability
8. Performance
9. Reusability

Do not optimize for fewer lines.

Do not optimize for cleverness.

Prefer:

```text
explicit
boring
typed
predictable
small
composable
```

over:

```text
magical
over-abstracted
deeply nested
prematurely optimized
```

---

# 3. Preferred Project Structure

Use feature/domain-based organization.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── globals.css
│   │
│   ├── books/
│   ├── authors/
│   ├── publishers/
│   ├── categories/
│   ├── cart/
│   ├── checkout/
│   └── dashboard/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── books/
│   │   ├── components/
│   │   ├── queries/
│   │   ├── mutations/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── auth/
│   ├── cart/
│   ├── authors/
│   ├── publishers/
│   └── categories/
│
├── stores/
├── hooks/
├── lib/
├── providers/
├── types/
└── constants/
```

Do not create every folder automatically.

Create folders only when the feature needs them.

A simple feature can be:

```text
features/auth/
├── components/
├── auth.api.ts
├── auth.queries.ts
└── auth.types.ts
```

Grow structure gradually.

---

# 4. App Router Responsibilities

`app/` primarily defines:

```text
routing
layouts
route segments
metadata
loading UI
error boundaries
page composition
server-side data entry points
```

Do not place large feature implementations directly inside:

```text
page.tsx
layout.tsx
```

Good:

```tsx
import { BooksPage } from "@/features/books/components/books-page";

export default function Page() {
  return <BooksPage />;
}
```

Avoid 400-line `page.tsx` files containing:

```text
API logic
state management
forms
business logic
large JSX trees
data transformations
```

---

# 5. Server Components First

Components are Server Components by default.

Do not add:

```tsx
"use client";
```

automatically.

Use Client Components only when needed for:

```text
useState
useEffect
event handlers
browser APIs
TanStack Query hooks
Zustand hooks
React Hook Form
interactive UI
```

Keep the client boundary as small as practical.

Bad:

```text
entire page
    ↓
"use client"
    ↓
all child components become client-side
```

Better:

```text
Server Page
├── Static Header
├── Server Content
└── InteractiveBookFilters ("use client")
```

---

# 6. Separation of Concerns

A component should not simultaneously handle:

```text
API calls
data transformation
global state
complex business logic
large markup
form validation
navigation rules
```

Separate responsibilities.

Preferred flow:

```text
Page
 ↓
Feature Component
 ↓
Query / Mutation Hook
 ↓
Feature API Function
 ↓
HTTP Client
 ↓
Node.js Backend
```

Example:

```text
books-page.tsx
    ↓
use-books-query.ts
    ↓
books.api.ts
    ↓
api-client.ts
```

---

# 7. Component Responsibilities

Components should primarily handle:

```text
rendering
composition
user interaction
small UI-specific transformations
```

Avoid direct API calls inside large UI components.

Bad:

```tsx
export function BooksPage() {
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/books")
      .then(...)
  }, []);

  ...
}
```

Prefer:

```tsx
const { data, isPending } = useBooksQuery(filters);
```

---

# 8. Component Categories

Use these concepts when helpful.

## Page Component

Route entry and feature composition.

```text
app/books/page.tsx
```

## Feature Component

Feature-specific UI.

```text
features/books/components/books-page.tsx
features/books/components/book-card.tsx
```

## Shared Component

Reusable across multiple domains.

```text
components/shared/
```

Examples:

```text
pagination
empty-state
page-header
search-input
```

## UI Primitive

Generic presentation components from `components/ui/`.

Examples:

```text
button
dialog
input
card
select
label
radio-group
checkbox
textarea
```

**Rule: Always use shadcn/ui and Radix UI components (from `components/ui/`) for inputs, buttons, selects, checkboxes, dialogs, and other UI controls. Raw HTML elements (`<input>`, `<button>`) are secondary.**

Do not place bookstore business logic inside `components/ui`.

---

# 9. Component Size

There is no strict maximum line count.

Use this as guidance:

```text
< 120 lines       usually ideal
120–200 lines     acceptable when cohesive
200–300 lines     review responsibilities
300–400 lines     usually split
> 400 lines       strongly consider decomposition
```

Do not split files merely to satisfy a number.

A cohesive 180-line component is better than five meaningless 35-line components.

Split when responsibilities differ.

Typical extraction signs:

```text
large independent UI section
separate form
complex table
complex modal
reusable list item
independent state
independent data fetching
large transformation logic
```

---

# 10. Function Size

Keep functions focused.

Prefer:

```text
one function
one clear responsibility
```

Avoid deeply nested conditions.

Prefer early returns.

Bad:

```ts
if (user) {
  if (user.role === "seller") {
    if (book) {
      if (book.isActive) {
        ...
      }
    }
  }
}
```

Prefer:

```ts
if (!user) return null;
if (user.role !== "seller") return null;
if (!book) return null;
if (!book.isActive) return null;
```

---

# 11. TypeScript

Keep:

```text
strict: true
```

Never disable strict rules merely to remove an error.

Avoid:

```ts
any
```

Prefer:

```ts
unknown
```

when something is actually unknown.

Narrow unknown values before use.

Avoid unsafe assertions:

```ts
value as Book
```

unless runtime guarantees exist.

Never use:

```ts
// @ts-ignore
```

to hide problems.

Use `@ts-expect-error` only when genuinely required and explain why.

---

# 12. Type Inference

Do not type obvious primitives unnecessarily.

Bad:

```ts
const page: number = 1;
const title: string = "Books";
```

Good:

```ts
const page = 1;
const title = "Books";
```

Explicitly type important boundaries:

```text
API responses
API inputs
shared domain objects
component public props
store state
external data
complex function returns
```

---

# 13. Type vs Interface

Prefer:

```ts
type
```

for:

```text
API contracts
component props
unions
domain data
store state
utility types
```

Example:

```ts
type BookCardProps = {
  book: Book;
};
```

Use `interface` when declaration merging or extension genuinely provides value.

Do not prefix with:

```text
IUser
IBook
IProduct
```

Prefer:

```text
User
Book
Product
```

---

# 14. API Types

Do not redefine the same API object everywhere.

Bad:

```text
books.api.ts       BookResponse
book-card.tsx      Book
books-page.tsx     BookData
store.ts           BookItem
```

when all describe exactly the same object.

Create the domain type once.

Example:

```text
features/books/types/book.types.ts
```

```ts
export type Book = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
};
```

Separate types only when boundaries genuinely differ.

Examples:

```text
Book
BookDetails
CreateBookInput
UpdateBookInput
BookListItem
```

---

# 15. Runtime Validation

TypeScript does not validate runtime data.

Use Zod where runtime validation is important.

Examples:

```text
forms
URL/search parameters
localStorage data
unknown external responses
environment variables
```

Do not duplicate a Zod schema and TypeScript type manually.

Prefer:

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;
```

---

# 16. TanStack Query Responsibility

TanStack Query owns **server state**.

Use it for data originating from the backend:

```text
books
authors
publishers
categories
user profile
orders
wishlist
persistent cart
seller listings
reviews
```

Do not copy Query data into Zustand without a real reason.

Bad:

```text
TanStack Query fetches books
        ↓
copy books into Zustand
        ↓
components read Zustand
```

This creates two sources of truth.

Prefer:

```text
TanStack Query
        ↓
component
```

---

# 17. Query Keys

Use consistent query keys.

Example:

```ts
export const bookKeys = {
  all: ["books"] as const,

  lists: () => [...bookKeys.all, "list"] as const,

  list: (filters: BookFilters) =>
    [...bookKeys.lists(), filters] as const,

  details: () => [...bookKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...bookKeys.details(), id] as const,
};
```

Do not scatter arbitrary arrays across components:

```ts
["books"]
["allBooks"]
["book-list"]
["getBooks"]
```

for the same resource.

---

# 18. Query Hooks

Feature-specific queries belong near their feature.

Example:

```text
features/books/queries/use-books-query.ts
```

```ts
export const useBooksQuery = (filters: BookFilters) =>
  useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: () => getBooks(filters),
  });
```

Components should consume the hook rather than know API implementation details.

---

# 19. Query Functions

Query functions should be simple.

```ts
export const getBooks = async (
  filters: BookFilters,
): Promise<BooksResponse> => {
  return apiClient.get("/books", {
    params: filters,
  });
};
```

Do not put React state inside API functions.

API functions must not use:

```text
useState
useEffect
Zustand hooks
React hooks
JSX
```

---

# 20. Mutations

Use mutations for server changes.

Examples:

```text
login
register
add to wishlist
update cart
create listing
update book
delete listing
checkout
```

Keep mutation side effects deliberate.

Example:

```ts
const queryClient = useQueryClient();

return useMutation({
  mutationFn: updateBook,

  onSuccess: (book) => {
    queryClient.setQueryData(
      bookKeys.detail(book.id),
      book,
    );

    queryClient.invalidateQueries({
      queryKey: bookKeys.lists(),
    });
  },
});
```

Do not invalidate every query after every mutation.

Invalidate the smallest relevant scope.

---

# 21. Avoid Query Over-Abstraction

Do not create generic hooks such as:

```text
useGenericQuery
useApiQuery
useUniversalMutation
```

unless the project demonstrates a real repeated need.

Prefer domain-specific hooks:

```text
useBooksQuery
useBookQuery
useCreateListingMutation
useUpdateCartMutation
```

Readable duplication is sometimes better than hidden generic behavior.

---

# 22. Zustand Responsibility

Zustand owns **client state** that must be shared.

Good candidates:

```text
temporary UI state
sidebar state
cart drawer state
multi-step form state
client preferences
temporary checkout UI state
complex shared filters
```

Do not use Zustand for everything.

Local state should remain local.

Bad:

```ts
const useStore = create(() => ({
  modalOpen: false,
}));
```

when only one component needs the modal state.

Prefer:

```ts
const [modalOpen, setModalOpen] = useState(false);
```

---

# 23. Server State vs Client State

Use this decision:

```text
Does the backend own this value?
        ↓ yes
TanStack Query
```

```text
Does this state need to be shared across distant client components?
        ↓ yes
Zustand
```

```text
Is it only needed by one component/subtree?
        ↓ yes
useState / useReducer
```

Examples:

```text
books                  → TanStack Query
orders                 → TanStack Query
logged-in user         → TanStack Query
wishlist from backend  → TanStack Query

mobile menu open       → local state
dialog open            → local state

cart drawer open       → Zustand
dashboard sidebar      → Zustand
temporary UI settings  → Zustand
```

---

# 24. Zustand Store Design

Keep stores focused.

Bad:

```text
useAppStore
```

containing:

```text
user
books
cart
sidebar
theme
filters
checkout
orders
modals
```

Prefer:

```text
use-cart-ui-store.ts
use-dashboard-store.ts
use-search-filter-store.ts
```

when genuinely needed.

Do not create dozens of microscopic stores either.

---

# 25. Zustand Selectors

Subscribe only to the state required.

Prefer:

```ts
const isOpen = useCartUiStore(
  (state) => state.isOpen,
);
```

Avoid:

```ts
const store = useCartUiStore();
```

when the component needs only one value.

This prevents unnecessary renders.

---

# 26. Do Not Duplicate Server Data in Zustand

Avoid storing:

```text
books
authors
orders
product listings
user profile
```

inside Zustand when TanStack Query already owns them.

Zustand is not an API cache.

TanStack Query is not a general UI-state manager.

Keep responsibilities distinct.

---

# 27. API Layer

Centralize HTTP configuration.

Preferred:

```text
src/lib/api-client.ts
```

or:

```text
src/lib/http/
```

The API layer may handle:

```text
base URL
credentials
common headers
response parsing
known API error mapping
```

Feature endpoints should live with the feature.

Example:

```text
features/books/api/books.api.ts
features/auth/api/auth.api.ts
```

---

# 28. Backend URL

Do not hardcode URLs throughout components.

Bad:

```ts
fetch("http://localhost:5000/api/v1/books");
```

Use environment configuration.

Example:

```text
NEXT_PUBLIC_API_URL
```

Access environment configuration from a centralized location when practical.

---

# 29. API Responses

Frontend types should match the actual backend contract.

Example:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
```

Paginated:

```ts
type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
```

Do not invent frontend-only backend response structures.

---

# 30. Error Handling

Handle errors at the correct level.

API layer:

```text
normalize network/backend errors
```

Query/mutation:

```text
query status
mutation status
retry behavior
cache behavior
```

UI:

```text
display useful feedback
```

Avoid:

```tsx
try {
  ...
} catch {
  alert("Something went wrong");
}
```

repeated throughout components.

---

# 31. Forms

Use React Hook Form for non-trivial forms.

Use Zod for validation.

Keep:

```text
form rendering
validation schema
submission mutation
```

separate when the form becomes complex.

Example:

```text
features/auth/
├── components/login-form.tsx
├── schemas/login.schema.ts
└── mutations/use-login-mutation.ts
```

Do not manually maintain dozens of:

```ts
useState(...)
```

values for large forms.

---

# 32. URL State

Prefer the URL for state that should be:

```text
shareable
bookmarkable
refresh-safe
navigation-safe
```

Examples:

```text
search
category
page
sort
filters
```

Example:

```text
/books?page=2&sort=price-asc&category=fiction
```

Do not automatically put all filter state into Zustand.

---

# 33. Search Params

Validate and normalize search params before using them.

Never assume:

```text
page
sort
categoryId
query
```

contains valid values.

Use an allowlist for sort values.

Example:

```ts
type BookSort =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc";
```

---

# 34. Navigation

Use Next.js navigation APIs.

Use:

```tsx
import Link from "next/link";
```

Use:

```tsx
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
```

Do not introduce TanStack Router into the migrated Next.js application.

---

# 35. Images

Use Next.js image handling where appropriate.

Prefer:

```tsx
import Image from "next/image";
```

Remote image hosts must be configured intentionally.

Always provide meaningful:

```text
alt
width/height or fill sizing
```

Avoid layout shifts.

Do not use empty alt text for meaningful book covers or author images.

---

# 36. Styling

Use existing design tokens.

Prefer semantic classes and CSS variables.

Avoid arbitrary hardcoded colors when an existing token represents the concept.

Bad:

```tsx
className="text-[#102418]"
```

when the application already provides:

```tsx
className="text-foreground"
```

Preserve the existing design system during migration.

Do not redesign a migrated page unless explicitly requested.

---

# 37. Tailwind Class Management

Keep class strings readable.

Use utilities such as `cn()` for conditional composition.

Avoid unreadable deeply nested string interpolation.

Do not create a custom CSS abstraction for every Tailwind combination.

Extract a component when repeated class patterns represent an actual reusable UI concept.

---

# 38. Responsive Design

Build mobile and desktop intentionally.

Do not fix layout issues with large numbers of arbitrary pixel values.

Test common breakpoints.

Avoid components depending on a specific viewport unless intentionally designed that way.

---

# 39. Accessibility

Interactive elements must use the correct semantic HTML.

Prefer:

```text
button → action
a / Link → navigation
label → form control
nav → navigation
main → primary content
```

Do not use:

```tsx
<div onClick={...}>
```

when a button is appropriate.

Interactive elements must be keyboard accessible.

Images require appropriate alt text.

Forms require labels.

Dialogs and menus should use accessible primitives where practical.

---

# 40. Loading States

Use deliberate loading UI.

Prefer:

```text
skeleton
spinner
progress state
button pending state
```

depending on context.

Do not leave the user wondering whether an action occurred.

Avoid flashing empty states before a query finishes.

Handle:

```text
pending
error
empty
success
```

separately.

---

# 41. Empty States

An empty successful result is not an error.

Example:

```text
No books found
No orders yet
No wishlist items
```

Do not treat empty arrays as API failures.

---

# 42. Authentication

Frontend authentication guards are UX.

Backend authorization is security.

Never assume these protect an API:

```text
middleware redirects
hidden buttons
disabled buttons
Zustand role state
localStorage role
client-side route guards
```

Backend must authorize every protected operation.

Frontend may use authentication state only for interface behavior.

---

# 43. Sensitive Data

Do not store sensitive values unnecessarily in:

```text
localStorage
sessionStorage
Zustand persisted state
URL params
console logs
```

Never expose:

```text
passwords
refresh tokens
payment secrets
JWT signing secrets
private API keys
```

to the client bundle.

Only variables intentionally prefixed for client exposure should reach browser code.

---

# 44. Effects

Do not use `useEffect` automatically.

Before writing an effect ask:

```text
Can this be derived during render?
Can this be an event handler?
Can TanStack Query handle it?
Can URL state handle it?
```

Bad:

```tsx
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Prefer:

```ts
const fullName = `${firstName} ${lastName}`;
```

Effects are primarily for synchronizing with external systems.

---

# 45. Derived State

Do not store values that can cheaply be derived.

Bad:

```ts
const [filteredBooks, setFilteredBooks] = useState([]);

useEffect(() => {
  setFilteredBooks(
    books.filter(...)
  );
}, [books]);
```

Prefer:

```ts
const filteredBooks = books.filter(...);
```

Use `useMemo` only when calculation cost or referential stability actually matters.

---

# 46. Memoization

Do not automatically add:

```text
useMemo
useCallback
React.memo
```

everywhere.

Use them when there is evidence they improve behavior or performance.

Do not make simple code harder to read for theoretical optimization.

---

# 47. Reusability

Do not duplicate meaningful logic.

Good shared candidates:

```text
pagination
money formatting
date formatting
query keys
API errors
slug handling
permission helpers
image URL helpers
```

Do not create:

```text
utils.ts
helpers.ts
common.ts
```

as dumping grounds.

Prefer:

```text
format-money.ts
pagination.ts
api-error.ts
image-url.ts
```

Domain-specific logic should stay inside its feature.

---

# 48. Hooks

Custom hooks should encapsulate actual reusable React behavior.

Good:

```text
useBooksQuery
useDebounce
useMediaQuery
useCreateListingMutation
```

Avoid hooks that merely rename one line.

Bad:

```ts
const useBookTitle = (book: Book) => book.title;
```

Do not create hooks solely to reduce component line count.

---

# 49. Naming

Components use PascalCase:

```text
BookCard
BookDetails
CheckoutSummary
```

Functions use camelCase:

```text
formatPrice
getBookById
buildBookFilters
```

Hooks begin with:

```text
use
```

Boolean values should read naturally:

```text
isLoading
isOpen
hasStock
canEdit
shouldRedirect
```

Avoid vague names:

```text
data1
temp
stuff
handleThing
processData
helper
common
manager
```

---

# 50. File Naming

Use consistent kebab-case filenames.

Preferred:

```text
book-card.tsx
book-details.tsx
book.types.ts
book.api.ts
book.keys.ts
use-books-query.ts
use-create-book-mutation.ts
cart.store.ts
```

Do not mix:

```text
BookCard.tsx
book_card.tsx
bookCard.tsx
book-card.tsx
```

throughout the same feature.

---

# 51. Props

Keep component props focused.

Avoid components receiving 15–20 unrelated props.

Bad:

```tsx
<BookCard
  id={}
  title={}
  author={}
  price={}
  image={}
  stock={}
  seller={}
  rating={}
  category={}
  publisher={}
  ...
/>
```

Often better:

```tsx
<BookCard book={book} />
```

But do not blindly pass huge database objects when a component only needs a small view model.

Use judgment.

---

# 52. Prop Drilling

Passing props through one or two levels is normal.

Do not introduce Zustand or Context merely because two components need a value.

Introduce shared state when prop passing becomes genuinely awkward or represents shared application state.

---

# 53. Context

Use React Context primarily for stable application-wide dependencies/providers.

Examples:

```text
TanStack Query provider
theme provider
special library providers
```

Do not create large mutable application state in Context when Zustand solves the problem more clearly.

---

# 54. Feature Boundaries

Major bookstore domains should stay reasonably independent:

```text
auth
books
authors
publishers
categories
cart
wishlist
checkout
orders
reviews
seller
discounts
```

Avoid reaching into deep internal feature files.

Bad:

```ts
import {
  internalNormalizeOrder,
} from "@/features/orders/internal/private-helper";
```

Prefer using the feature's deliberate public API when cross-feature access is required.

Avoid circular dependencies.

---

# 55. Barrel Files

Do not create `index.ts` everywhere.

Barrel files may be used when they intentionally define a feature's public API.

Do not hide dependency relationships behind large chains of barrel imports.

Avoid circular dependency problems caused by barrels.

---

# 56. Imports

Prefer import order:

```text
1. React / Next.js
2. third-party libraries
3. project aliases
4. local files
5. type-only imports
```

Use type imports where appropriate.

```ts
import type { Book } from "../types/book.types";
```

Use the project's `@/` alias consistently.

Avoid deeply nested:

```text
../../../../../../
```

imports.

---

# 57. Dependencies

Before installing a dependency:

1. Check whether the project already solves the problem.
2. Check whether React/Next.js/browser APIs solve it.
3. Check whether an installed package already provides it.
4. Check maintenance status.
5. Determine whether it materially reduces complexity.

Do not add multiple libraries for the same responsibility.

Examples:

```text
TanStack Query → server state
Zustand → shared client state
React Hook Form → complex forms
Zod → validation
```

Do not casually introduce another library for the same jobs.

---

# 58. Avoid Premature Abstraction

Do not automatically create:

```text
generic API hooks
generic query factories
generic store factories
BaseComponent
BaseForm
global event buses
custom state frameworks
complex dependency injection
large design-system abstractions
```

Start simple.

Extract after repetition or complexity appears.

---

# 59. Performance

Performance changes should be evidence-based.

Before optimizing:

1. identify the slow interaction
2. identify unnecessary renders
3. inspect network requests
4. inspect bundle size
5. inspect large client components
6. inspect images
7. inspect duplicated requests
8. measure again

Do not add memoization everywhere.

Do not move everything client-side for convenience.

Do not fetch huge datasets and filter them entirely in the browser when the backend can paginate/filter them.

---

# 60. Lists

Always use stable keys.

Good:

```tsx
books.map((book) => (
  <BookCard
    key={book.id}
    book={book}
  />
));
```

Avoid array indexes as keys when list order can change.

---

# 61. Pagination

Large collections should use backend pagination.

Do not fetch thousands of:

```text
books
authors
orders
seller listings
reviews
```

to the frontend unnecessarily.

URL should generally represent pagination:

```text
?page=2
```

TanStack Query should include pagination inputs in the query key.

---

# 62. Search

Debounce search when useful.

Do not perform expensive API requests on every keystroke without reason.

Search state should usually be URL-based when users should be able to share or refresh the result.

The backend remains responsible for scalable database searching.

---

# 63. Money

Never use frontend calculations as authoritative order totals.

Frontend may display calculations for UX.

Backend must determine authoritative:

```text
price
discount
subtotal
shipping
tax
total
```

Represent money consistently with the backend contract.

For this bookstore project, use paise-based fields where defined:

```text
mrpInPaise
sellingPriceInPaise
```

Convert to display rupees only at presentation boundaries.

---

# 64. Cart

If the cart is persistent on the backend, TanStack Query should own server cart data.

Zustand may own cart UI state such as:

```text
drawer open
temporary optimistic UI state
```

Do not make persisted Zustand/localStorage cart state authoritative when the server cart exists.

Checkout must revalidate with the backend.

---

# 65. Seller Data

Never trust frontend seller information for authorization.

The frontend may display:

```text
seller dashboard
seller listings
seller controls
```

but the backend determines which seller owns the resource.

Do not send client-selected ownership IDs when the backend can derive them from authentication.

---

# 66. Error Boundaries

Use Next.js:

```text
error.tsx
not-found.tsx
loading.tsx
```

where route-level behavior benefits from them.

Do not create error boundaries around every tiny component.

---

# 67. Comments

Comments should explain WHY.

Bad:

```ts
// Get books
const books = ...
```

Good:

```ts
// Keep the previous page visible while the next page loads
// to avoid layout jumping during pagination.
```

Readable code should explain WHAT.

---

# 68. TODOs

Avoid vague TODOs.

Bad:

```ts
// TODO fix
```

Better:

```ts
// TODO(cart): remove local fallback after server cart migration is complete.
```

Do not leave required functionality as TODO and claim the feature is complete.

---

# 69. No Fake Production Behavior

Do not silently create:

```text
fake authentication
fake orders
fake payments
fake seller permissions
fake API persistence
```

during integration.

Mocks must be clearly temporary.

Do not present mock behavior as finished backend integration.

---

# 70. Migration Rules

The existing React/TanStack application remains the visual and behavioral reference during migration.

When migrating:

```text
preserve UI
preserve spacing
preserve typography
preserve colors
preserve responsive behavior
preserve user flows
```

Do not redesign unless explicitly requested.

Replace TanStack Router concepts with Next.js equivalents.

Examples:

```text
TanStack Link
    ↓
next/link

useNavigate
    ↓
useRouter

route params
    ↓
Next.js params / useParams

TanStack route files
    ↓
App Router folders
```

---

# 71. Agent Workflow Before Editing

Before writing code:

1. inspect the existing feature
2. inspect the old React implementation when migrating
3. inspect nearby project conventions
4. inspect existing shared components
5. inspect existing hooks
6. inspect existing query keys
7. inspect Zustand stores
8. inspect `package.json` before adding dependencies
9. determine Server vs Client Component requirements
10. make the smallest coherent change

Do not start by generating new architecture.

Understand the existing project first.

---

# 72. Agent Workflow While Editing

While implementing:

```text
keep changes focused
preserve existing UI
reuse existing components
avoid unrelated cleanup
avoid mass renaming
avoid unnecessary "use client"
keep API logic outside UI
keep server state in TanStack Query
keep client state minimal
keep local state local
avoid duplicated types
avoid duplicated query keys
avoid arbitrary abstractions
keep types strict
```

---

# 73. Agent Workflow After Editing

After implementation:

1. reread changed code
2. remove dead code
3. remove unused imports
4. remove debugging logs
5. check accidental client components
6. check duplicated server/client state
7. check accessibility
8. check responsive layout
9. run TypeScript
10. run lint
11. run build
12. run relevant tests

Use existing scripts where available:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

For Next.js, if no separate `typecheck` script exists:

```bash
npx tsc --noEmit
```

Never claim checks passed unless they were actually executed.

---

# 74. Code Review Questions

Before accepting frontend code ask:

```text
Is this code in the correct feature?

Should this be a Server Component?

Does it genuinely require "use client"?

Is API logic separated from UI?

Is server state owned by TanStack Query?

Is client state unnecessarily in Zustand?

Could this state simply be local state?

Should this state live in the URL?

Are query keys consistent?

Are mutations invalidating the correct data?

Are API types safe?

Is any `any` being used unnecessarily?

Is the component doing multiple unrelated jobs?

Is the file becoming too large?

Is business/security logic incorrectly enforced only in frontend?

Is UI duplicated?

Is accessibility preserved?

Can another developer understand this quickly?
```

---

# 75. Anti-Patterns

Avoid:

```text
500+ line page components
500+ line feature components
API calls scattered across components
useEffect for normal data fetching
everything marked "use client"
all state placed in Zustand
server state duplicated in Zustand
one giant global store
one giant utils.ts
one giant types.ts
query keys scattered everywhere
generic query abstractions too early
any everywhere
unsafe type assertions
business authorization in frontend only
huge prop lists
deep nested JSX
large components with unrelated concerns
hardcoded API URLs
hardcoded design colors
fetching unlimited collections
duplicated backend calculations
localStorage as authoritative server state
premature memoization
premature abstractions
unnecessary dependencies
```

---

# 76. Simplicity Rule

When two implementations solve the same requirement equally well, choose the one with:

```text
fewer concepts
fewer dependencies
clearer state ownership
smaller client boundary
clearer names
less hidden behavior
easier testing
```

---

# 77. Refactoring Rule

Refactor when there is evidence of:

```text
duplication
high coupling
large unrelated responsibilities
hard-to-test code
difficult navigation
frequent bugs
confusing state ownership
performance problems
```

Do not refactor merely because another architecture looks prettier.

---

# 78. Definition of Done

A frontend feature is complete only when:

```text
requirements are implemented
UI matches intended design
server/client boundaries are appropriate
server state is handled correctly
client state is handled correctly
API integration works
loading states work
error states work
empty states work
types are safe
accessibility is reasonable
responsive behavior works
lint passes
TypeScript passes
build passes
relevant tests pass
debug code is removed
```

---

# Final Rule

Write frontend code another developer can understand without asking the original author to explain it.

Prefer:

```text
small
typed
predictable
explicit
feature-focused
accessible
reusable
boring
```

over:

```text
clever
magical
globally stateful
over-engineered
prematurely abstracted
```

## State Ownership Rule

Remember:

```text
BACKEND DATA
    ↓
TanStack Query

SHARED CLIENT UI STATE
    ↓
Zustand

LOCAL COMPONENT STATE
    ↓
useState / useReducer

SHAREABLE NAVIGATION STATE
    ↓
URL / searchParams
```

If state ownership is unclear, determine who owns the source of truth before writing code.

The goal is not to demonstrate how many React patterns can be used.

The goal is to make the bookstore frontend easy to build, debug, migrate, extend, integrate, and maintain.
