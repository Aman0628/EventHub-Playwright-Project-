# Test Suite Architecture & Progression Guide

This repository demonstrates the evolution of Playwright test architecture across 3 progressive stages:

```
tests/
├── 01-without-pom/          # Stage 1: Raw End-to-End without Page Objects
│   └── e2e-booking-without-pom.spec.js
│
├── 02-with-pom/             # Stage 2: Structured using Page Object Model (POM)
│   ├── addnewEvent.spec.js
│   ├── authSecurity.spec.js
│   ├── booking.spec.js
│   ├── dashboard.spec.js
│   ├── eventsSearchFilter.spec.js
│   └── login.spec.js
│
└── 03-with-fixtures/        # Stage 3: Modern Playwright with Custom Fixtures
    ├── customFixtures.js
    └── e2e-booking-with-fixtures.spec.js
```

---

## Stage Breakdown

### 🟢 Stage 1: `01-without-pom/` (Raw Playwright Script)
- **Goal**: Write a fast, single-file script directly using Playwright locators (`page.locator`, `page.getByRole`, etc.).
- **Pros**: Zero initial setup; ideal for quick POCs or single-page checks.
- **Cons**: Locators are duplicated across files; UI changes require updating multiple test files.

### 🟡 Stage 2: `02-with-pom/` (Page Object Model)
- **Goal**: Separate test logic from UI locators using dedicated page classes (`Pages.js/`) orchestrated through `POmanager`.
- **Pros**: Clean abstraction; locator changes only happen once in the page object.
- **Cons**: Requires repetitive `new POmanager(page)` initialization and boilerplate login in `beforeEach`.

### 🔵 Stage 3: `03-with-fixtures/` (Playwright Custom Fixtures)
- **Goal**: Leverage Playwright's built-in dependency injection (`test.extend`) to auto-instantiate page objects and workflows.
- **Pros**:
  - Zero `new POmanager(page)` boilerplate.
  - Pre-authenticated session via `authenticatedSession` fixture.
  - On-demand execution (only requested fixtures run).
  - Test files read like pure declarative business requirements.

---

## Running the Tests

```powershell
# Run all tests across all stages
npx playwright test

# Run only Stage 1 (without POM)
npx playwright test tests/01-without-pom

# Run only Stage 2 (with POM)
npx playwright test tests/02-with-pom

# Run only Stage 3 (with Fixtures)
npx playwright test tests/03-with-fixtures
```
