# AI Coding Guidelines for MyCryptoFundsClassic

## Architecture Overview
This is an Angular application for managing cryptocurrency funds, built with Angular 21, using NgModules (not standalone components). It follows a traditional Angular structure with:

- **Components**: Organized by feature (assets, chains, coins, wallets) with page-level components for list, detail, edit, and new views
- **Services**: HTTP-based data services for CRUD operations against a backend API
- **Models**: Simple TypeScript interfaces defining data structures
- **Forms**: Generic `DataForm` component driven by field configurations
- **Routing**: Standard Angular Router with lazy-loaded feature routes

Key data flow: Components inject services → Services make HTTP calls to `/api/*` endpoints (proxied to `localhost:8000`) → Observables handle async data → Templates use async pipe and control flow syntax.

## Key Patterns & Conventions

### Component Structure
- Each component has `.ts`, `.html`, `.css`, `.spec.ts` files in dedicated folders
- Use `@Component` with `standalone: false` (contrary to Angular 21 defaults)
- Prefer signals for component state where applicable, but lifecycle hooks (OnInit/OnDestroy) are common
- Example: [src/app/coins/coins-page/coins-page.ts](src/app/coins/coins-page/coins-page.ts) uses Subject for refresh triggers

### Forms
- Use Reactive Forms with `FormBuilder`
- Leverage the shared `DataForm<T>` component for CRUD forms
- Define form fields via `FormField<T>[]` configs (e.g., [src/app/form-fields/coin-fields.ts](src/app/form-fields/coin-fields.ts))
- Handle submissions with `SubmitRequest<T>` callbacks for success/error feedback

### Services
- Singleton services with `providedIn: 'root'`
- Return `Observable<T>` from HTTP methods using `HttpClient`
- Example: [src/app/services/coins-service.ts](src/app/services/coins-service.ts) follows RESTful patterns

### Templates
- Use native control flow (`@if`, `@for`) instead of structural directives
- Async pipe for observables: `coins$ | async`
- Router links: `routerLink="/coin-new"`
- Tailwind CSS classes for styling

### State Management
- Local component state with signals or traditional properties
- RxJS Subjects for event-driven refreshes (e.g., after mutations)
- No global state library; keep state localized to components/services

## Developer Workflows

### Running the App
```bash
npm start  # Runs ng serve with proxy to localhost:8000
```
- Proxy config routes `/api/*` to backend server
- Auto-reloads on file changes

### Testing
```bash
npm test  # Runs Vitest (not Karma)
```
- Unit tests in `.spec.ts` files
- Use Vitest's API for assertions and mocks

### Building
```bash
ng build  # Production build to dist/
```
- Includes Tailwind processing via PostCSS

### Code Generation
Use Angular CLI schematics, but note `standalone: false` in [angular.json](angular.json):
```bash
ng generate component my-component  # Will create NgModule-based component
```

## Project-Specific Notes
- **Backend Integration**: All data operations hit `/api/*` endpoints; ensure backend runs on port 8000
- **Styling**: Tailwind v4 with PostCSS; custom utilities in [src/styles.css](src/styles.css)
- **Linting/Formatting**: Prettier config in [package.json](package.json) with Angular HTML parser
- **Accessibility**: Components must pass AXE checks and WCAG AA (focus management, ARIA, contrast)
- **Error Handling**: Services return observables; handle errors in subscribe blocks with user feedback
- **Data Refresh**: Use Subject-based patterns for optimistic updates (see coins-page example)

When adding new entities, follow the established pattern: create model interface, service, form fields config, and CRUD page components.</content>
<parameter name="filePath">c:\Projects\my-crypto-funds_old\.github\copilot-instructions.md