# GitHub Repo Health Dashboard

GitHub Repo Health Dashboard is a static, editorial-style workspace for reviewing a curated snapshot of repository activity, security signals, workflows, and pull-request status. It presents a primary overview as well as repository-level drill-down pages in the **Signal Ledger** visual language.

The deployed dashboard is available at [ghdash-jo8qumw2.manus.space](https://ghdash-jo8qumw2.manus.space). The project source is mirrored to the private [balajirajput96/github-dashboard](https://github.com/balajirajput96/github-dashboard) repository.

## Local development

Use Node.js 22 and pnpm 10.4 or later. Install dependencies with `pnpm install`, start the development server with `pnpm dev`, run static validation with `pnpm check`, and create the deployment bundle with `pnpm build`.

## Deployment and quality gate

The app is published through the managed production deployment. Every GitHub push and pull request targeting `main` runs the same TypeScript validation and production build in GitHub Actions through `.github/workflows/ci.yml`.

## Data and integration boundary

The current interface intentionally displays a collected repository snapshot and does not ship GitHub credentials or call GitHub APIs from the browser. Live repository synchronization should be implemented only after adding a secure backend/API proxy and storing access credentials outside client-side code.
