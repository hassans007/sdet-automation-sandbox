# 🧪 SDET Automation Sandbox

A full-stack test automation environment built to demonstrate SDET best practices — covering end-to-end testing, CI/CD pipelines, containerisation, and a live target application to test against.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [Running Tests](#running-tests)
  - [All Tests](#all-tests)
  - [Headed Mode](#headed-mode)
  - [HTML Report](#html-report)
- [CI/CD](#cicd)
- [Contributing](#contributing)

---

## Overview

The SDET Automation Sandbox is a self-contained project that pairs a real Node.js/Express web application (with a SQLite database) with a full Playwright test suite. It's designed to reflect real-world QA engineering workflows — including automated browser testing, API testing, Docker-based environments, and automated CI pipelines via GitHub Actions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Test Framework | [Playwright](https://playwright.dev/) |
| Language | TypeScript |
| Target App | Node.js + Express |
| Database | SQLite |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Editor Config | VSCode |

---

## Project Structure

```
sdet-automation-sandbox/
├── .github/
│   └── workflows/         # GitHub Actions CI pipeline
├── .vscode/               # VSCode settings & recommended extensions
├── db/                    # SQLite database files
├── public/                # Static assets for the target app
├── src/                   # Target web application source (Node.js/Express)
├── tests/                 # Playwright test specs
├── docker-compose.yml     # Docker Compose configuration
├── playwright.config.ts   # Playwright configuration
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [Docker](https://www.docker.com/) (optional, for containerised setup)

### Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/hassans007/sdet-automation-sandbox.git
cd sdet-automation-sandbox
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npx playwright install
```

4. **Start the target application**

```bash
node src/app.js
```

The app will be available at `http://localhost:3000` (or as configured).

### Running with Docker

To spin up the full environment using Docker Compose:

```bash
docker-compose up --build
```

This starts both the target application and any supporting services defined in `docker-compose.yml`.

---

## Running Tests

### All Tests

```bash
npx playwright test
```

### Headed Mode

Run tests with a visible browser window:

```bash
npx playwright test --headed
```

### Specific Test File

```bash
npx playwright test tests/example.spec.ts
```

### HTML Report

After a test run, view the full visual report:

```bash
npx playwright show-report
```

---

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/`) that automatically runs the full Playwright test suite on every push and pull request to `main`.

The pipeline:
1. Checks out the repository
2. Installs Node.js dependencies
3. Installs Playwright browsers
4. Starts the target application
5. Runs all Playwright tests
6. Uploads the HTML test report as a build artifact

---

## Contributing

This is a personal sandbox project, but suggestions and improvements are welcome.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

*Built by [Hassan Shahid](https://github.com/hassans007)*
