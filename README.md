# 💸 Angular Expense Tracker

An expense tracking dashboard built with Angular standalone components, Tailwind CSS, and reactive forms. This project includes category-based tracking, currency conversion, infinite scroll pagination, and exchange rate integration.

---

## 📐 Overview of Architecture & Structure

This application follows a **modular and reactive architecture** using Angular standalone components.

src/
├── app/
│ ├── core/ # Core services, models, and utilities
│ │ ├── services/
│ │ ├── models/
│ ├── components/ # Feature components
│ │ ├── dashboard/ # Dashboard with list, filters, currency selector
│ │ └── expense/ # Expense addition form
│ ├── shared/ # Shared UI components
│ └── app.config.ts # Angular standalone config (routes, providers)

- Uses **ReactiveFormsModule** for form control and validation.
- State is temporarily handled via services (`ExpensesStore`, `AuthStore`).
- API calls are handled using Angular's `HttpClient` in services.
- Expenses, categories, and exchange rates are managed reactively using `Observables`.

---

## 🔌 API Integration

API integration is done inside the `ExpensesStore` service using Angular's `HttpClient`. Exchange rates are fetched from:

https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD

- Responses are cached in `localStorage` for 24 hours to reduce API calls.
- A BehaviorSubject holds exchange rate state, which components subscribe to for reactive updates.

---

## 📄 Pagination Strategy

The app uses **API-based pagination**:

- Each call to `getFilteredExpenses(filter, page, pageSize)` fetches a specific page.
- The first page is fetched on filter change.
- More pages are appended on scroll via `loadMore()`, combining the current list with new items.

---

## ⚖️ Trade-offs & Assumptions

- Original and converted amounts are not shown side-by-side yet.
- Currency conversion mutates the `amount` field — future versions will separate `amountOriginal` and `convertedAmount`.
- State management is handled manually in services (no NgRx for now).
- Exchange rate caching is done via localStorage; no fallback cache if offline.
- Basic validations are present, but advanced UX enhancements (animations, loaders, error states) are minimal.

---

### Setup

````bash
git clone https://github.com/your-username/angular-expense-tracker.git
cd angular-expense-tracker
npm install

---

### 🔧 Key Structure:

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
````

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Unimplemented Features

- CI/CD with GitHub Actions or Bitbucket Pipelines

- Export to CSV or PDF

- State Management with NgRx

- Proper Typography & Layout Enhancements

- Dual display of original and converted amounts

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
