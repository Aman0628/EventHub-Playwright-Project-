# 🎭 EventHub Playwright Test Automation Framework

[![Playwright Tests](https://github.com/Aman0628/EventHub-Playwright-Project-/actions/workflows/playwright.yml/badge.svg)](https://github.com/Aman0628/EventHub-Playwright-Project-/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-v1.63+-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(ES6+)-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)

An end-to-end (E2E) and REST API test automation framework built with [Playwright](https://playwright.dev/) for the **EventHub** web application.

This repository demonstrates the **architectural evolution** of test automation across four progressive stages — starting from raw Playwright scripts, advancing to the Page Object Model (POM), streamlining workflows with Playwright Custom Fixtures, and culminating in high-speed Pure API and Hybrid (API + UI) testing.

---

## 📑 Table of Contents

- [Application Under Test (AUT)](#-application-under-test-aut)
- [Framework Architecture & Evolution](#-framework-architecture--evolution)
  - [Stage 1: Without POM (Raw E2E)](#-stage-1-01-without-pom-raw-e2e)
  - [Stage 2: Page Object Model (POM)](#-stage-2-02-with-pom-page-object-model)
  - [Stage 3: Custom Fixtures (Dependency Injection)](#-stage-3-03-with-fixtures-playwright-custom-fixtures)
  - [Stage 4: API & Hybrid Testing](#-stage-4-04-api-testing-pure-api--hybrid-api--ui)
  - [Architectural Comparison](#-architectural-comparison)
- [Project Directory Structure](#-project-directory-structure)
- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Test Reports & Debugging](#-test-reports--debugging)
- [CI/CD Workflow (GitHub Actions)](#-cicd-workflow-github-actions)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🌐 Application Under Test (AUT)

The framework automates and validates user workflows and RESTful APIs for the EventHub platform:

| Interface | URL | Description |
|---|---|---|
| **Web Application** | `https://eventhub.rahulshettyacademy.com` | Event management, user authentication, event browsing, search/filter, and ticket booking UI. |
| **REST API** | `https://api.eventhub.rahulshettyacademy.com/api` | Backend microservices for auth tokens, event queries, and booking management. |

---

## 🏛️ Framework Architecture & Evolution

The test suite in [`tests/`](file:///c:/Users/Aman%20Kori/EventHub-Playwright-Project--main/tests) is organized into four progressive maturity levels:

```
tests/
├── 01-without-pom/      # 🟢 Stage 1: Fast scripts with inline selectors
├── 02-with-pom/         # 🟡 Stage 2: Clean Page Object abstraction
├── 03-with-fixtures/    # 🔵 Stage 3: Declarative tests with dependency injection
└── 04-api-testing/      # 🚀 Stage 4: Sub-second API tests & Hybrid test design
```

### 🟢 Stage 1: `01-without-pom/` (Raw E2E)
- **Concept**: Fast, single-script implementation with direct locators (`page.locator`, `page.getByRole`, etc.).
- **Ideal For**: Quick Proof of Concepts (POC) and isolated smoke verifications.
- **Trade-offs**: Selectors are duplicated across test files, making maintenance costly when UI changes.

### 🟡 Stage 2: `02-with-pom/` (Page Object Model)
- **Concept**: Encapsulates UI elements and page actions in dedicated classes located in [`Pages.js/`](file:///c:/Users/Aman%20Kori/EventHub-Playwright-Project--main/Pages.js), coordinated via [`poManager.js`](file:///c:/Users/Aman%20Kori/EventHub-Playwright-Project--main/Pages.js/poManager.js).
- **Ideal For**: Enterprise-level test suites requiring strict modularity and locator reusability.
- **Coverage**:
  - `login.spec.js` - Data-driven positive and negative login validations.
  - `authSecurity.spec.js` - Route protection and authorization checks.
  - `dashboard.spec.js` - Dashboard cards, navigation, and metrics validation.
  - `eventsSearchFilter.spec.js` - Real-time event search and category filters.
  - `addnewEvent.spec.js` - Event creation modal and form submissions.
  - `booking.spec.js` - Multi-step booking flow and confirmation dialogs.

### 🔵 Stage 3: `03-with-fixtures/` (Playwright Custom Fixtures)
- **Concept**: Uses Playwright's built-in dependency injection ([`fixtures/customFixtures.js`](file:///c:/Users/Aman%20Kori/EventHub-Playwright-Project--main/fixtures/customFixtures.js)) to inject page objects directly into test arguments.
- **Key Advantages**:
  - Eliminates boilerplate instantiation (`new POmanager(page)`).
  - Provides a pre-authenticated session fixture (`authenticatedSession`) that logs in before test execution.
  - Fixtures run on-demand (only instantiated if requested in the test signature).

### 🚀 Stage 4: `04-api-testing/` (Pure API & Hybrid API + UI)
- **Concept**: Direct REST API automation with Playwright's `request` context, paired with hybrid test scenarios.
- **Coverage**:
  - `events-api.spec.js` - Query params, pagination, event details validation.
  - `bookings-api.spec.js` - Booking creation, user booking history, and cancellation.
  - `hybrid-api-ui.spec.js` - **Hybrid pattern**: Creates required test data via API in ~200ms, then immediately validates UI presentation, bypassing repetitive frontend setup.

---

### 📊 Architectural Comparison

| Dimension | Stage 1 (Raw Script) | Stage 2 (POM) | Stage 3 (Fixtures) | Stage 4 (API & Hybrid) |
|---|:---:|:---:|:---:|:---:|
| **Execution Speed** | Medium | Medium | Medium-Fast | ⚡ Ultra-Fast (~100-300ms) |
| **Boilerplate Code** | Low | High | Minimal | Very Low |
| **Maintenance Cost** | High | Low | Very Low | Minimal |
| **State Setup** | UI Actions | UI Actions | Auto Fixture | Direct API Calls |
| **Test Readability** | Technical | Structured | Business-focused | API / Workflow focused |

---

## 📂 Project Directory Structure

```text
EventHub-Playwright-Project-/
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI workflow
├── Pages.js/                         # Page Object Model classes
│   ├── addnewEventPage.js            # "Add New Event" modal locators & actions
│   ├── confirmBookingPage.js         # Booking confirmation & modal workflows
│   ├── dashboardPage.js              # Dashboard metrics & navigation
│   ├── eventsPage.js                 # Event list, search, and category filters
│   ├── loginPage.js                  # Authentication form & error validations
│   └── poManager.js                  # Page Object Manager (orchestrator)
├── fixtures/
│   └── customFixtures.js             # Custom Playwright fixtures & auto-auth session
├── Utils.js/
│   ├── apiHelper.js                  # Reusable Axios/Playwright API client
│   └── testData.json                 # Data-driven test datasets (valid & invalid creds)
├── tests/
│   ├── 01-without-pom/
│   │   └── e2e-booking-without-pom.spec.js
│   ├── 02-with-pom/
│   │   ├── addnewEvent.spec.js
│   │   ├── authSecurity.spec.js
│   │   ├── booking.spec.js
│   │   ├── dashboard.spec.js
│   │   ├── eventsSearchFilter.spec.js
│   │   └── login.spec.js
│   ├── 03-with-fixtures/
│   │   └── e2e-booking-with-fixtures.spec.js
│   ├── 04-api-testing/
│   │   ├── bookings-api.spec.js
│   │   ├── events-api.spec.js
│   │   └── hybrid-api-ui.spec.js
│   └── README.md                     # Deep-dive architecture reference
├── playwright.config.js              # Playwright global configuration
├── package.json                      # Project dependencies and test scripts
└── README.md                         # Framework documentation
```

---

## ✨ Key Features

- **Multi-Paradigm Testing**: Supports Raw E2E, Page Object Model, Custom Fixtures, REST API, and Hybrid testing.
- **Page Object Orchestrator (`POmanager`)**: Centralized access point to all page instances.
- **Dependency Injection**: Seamless test arguments injection with custom fixtures.
- **Data-Driven Testing**: Parametrized test execution using external JSON data sources.
- **Hybrid Test Acceleration**: Ultra-fast state preparation via REST API before browser verification.
- **Rich Reporting**: Built-in Playwright HTML reports with traces, screenshots, and video recordings.
- **Continuous Integration (CI/CD)**: GitHub Actions workflow with automated browser installations and artifact archival.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` (bundled with Node.js)
- Git

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aman0628/EventHub-Playwright-Project-.git
   cd EventHub-Playwright-Project-
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers and system dependencies**:
   ```bash
   npx playwright install --with-deps
   ```

---

## 🧪 Running Tests

### Standard NPM Scripts

Run predefined commands configured in [`package.json`](file:///c:/Users/Aman%20Kori/EventHub-Playwright-Project--main/package.json):

```bash
# Run all tests headlessly
npm test

# Run tests in headed browser mode
npm run test:headed

# Launch interactive Playwright UI Mode
npm run test:ui

# View generated HTML test report
npm run test:report
```

### Run Tests by Architectural Stage

```bash
# Stage 1: Without POM
npx playwright test tests/01-without-pom

# Stage 2: With Page Object Model (POM)
npx playwright test tests/02-with-pom

# Stage 3: With Custom Fixtures
npx playwright test tests/03-with-fixtures

# Stage 4: Pure API & Hybrid Testing
npx playwright test tests/04-api-testing
```

### Targeted Execution & Debugging

```bash
# Run a specific test file
npx playwright test tests/02-with-pom/login.spec.js

# Run tests with title matching a keyword
npx playwright test -g "Valid Login"

# Run tests in debug mode (Playwright Inspector)
npx playwright test --debug

# Run tests in headed mode with slow motion
npx playwright test --headed --project=chromium
```

---

## 📊 Test Reports & Debugging

Playwright automatically records execution traces, screenshots, and logs:

1. **HTML Report**:
   ```bash
   npx playwright show-report
   ```
   Inspect individual steps, network logs, console messages, and failure snapshots.

2. **Playwright Trace Viewer**:
   When retried tests fail, traces are captured automatically according to `playwright.config.js`:
   ```bash
   npx playwright show-trace test-results/<path-to-trace.zip>
   ```

3. **Playwright UI Mode**:
   Provides time-travel debugging, watch mode, and interactive locator inspection:
   ```bash
   npm run test:ui
   ```

---

## 🔄 CI/CD Workflow (GitHub Actions)

This project includes automated continuous integration via [GitHub Actions](file:///c:/Users/Aman%20Kori/EventHub-Playwright-Project--main/.github/workflows/playwright.yml):

- **Triggers**: Executed on every `push` and `pull_request` to `main` and `master` branches.
- **Job Steps**:
  1. Checks out repository code (`actions/checkout@v4`).
  2. Sets up Node.js LTS (`actions/setup-node@v4`).
  3. Installs dependencies (`npm ci`).
  4. Downloads Playwright browser binaries with dependencies (`npx playwright install --with-deps`).
  5. Runs the test suite (`npx playwright test`).
  6. Uploads the HTML report artifact with a 30-day retention period (`actions/upload-artifact@v4`).

---

## 👤 Author & Acknowledgments

- **Author**: [Aman Kori](https://github.com/Aman0628)
- **Application Under Test**: [Rahul Shetty Academy EventHub](https://eventhub.rahulshettyacademy.com)
- **Framework**: [Playwright Test](https://playwright.dev/)
