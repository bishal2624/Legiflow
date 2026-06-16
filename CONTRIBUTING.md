# Contributing to LegiFlow

Thank you for your interest in contributing to LegiFlow! Contributors like you help make legal documents accessible and simplified for everyone.

To maintain a high-quality codebase, we follow a strict workflow process. Please read through these guidelines before submitting a contribution.

---

## 🛠️ Local Development Setup

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Legiflow.git
   cd Legiflow
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run Locally:**
   ```bash
   npm run dev
   ```

---

## 🔄 Contribution Workflow Rules

We adhere to the following workflow principles to ensure reviewable, clean commits:

1. **One Scope Per Branch:** Every branch should target **one** specific feature or bug fix. Avoid combining unrelated changes.
2. **Branch Naming Standard:**
   - Use descriptive, hyphen-separated, lowercase branch names.
   - Prefix branch names based on classification:
     - Bug Fixes: `fix/` (e.g. `fix/navbar-mobile-overflow`)
     - Features: `feat/` (e.g. `feat/loading-skeleton-ui`)
     - Docs: `docs/` (e.g. `docs/improve-installation-guide`)
     - Refactoring: `refactor/` (e.g. `refactor/reusable-modal-component`)
3. **Keep PRs Mergeable:** Pull the latest upstream changes from the `main` branch before submitting. Resolve any conflicts locally.
4. **Commit Guidelines:**
   - Commit messages must follow semantic formatting (e.g. `fix: resolve sidebar overflow on mobile`).
   - Avoid generic messages such as `updated code` or `fixed bugs`.

---

## 🧪 Quality and Testing

Before submitting a Pull Request, please ensure the following validations pass:

- **Type Safety Checks:** `npm run typecheck` must complete successfully without errors.
- **Lint Verification:** Run `npm run lint` and fix any format warnings.
- **Production Build:** Verify that the project compiles with `npm run build`.
- **Layout Responsiveness:** Confirm that visual layouts look polished and scale on all desktop and mobile viewports.
- **Accessibility:** Ensure interactive components use proper labels and can be navigated via keyboard focus.
