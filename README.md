# Smart Expense & Fund Manager

A premium single-page JavaScript application for managing personal finances — tracking income, expenses, budgets, and savings goals with a clean interactive dashboard.

> Built with **Vanilla JavaScript (ES6+)**, HTML5, and CSS3. No frameworks, no dependencies.

## Live Features

- **User Auth** — Register and login with simulated session management
- **Transaction Tracking** — Add income and expenses across 10 categories
- **Dashboard** — Real-time summary of balance, income, expenses, and savings
- **Monthly Budgeting** — Set budgets with live progress tracking and overspend warnings
- **Savings Goals** — Set targets and track contributions over time
- **Transaction History** — Search, filter by type, category, and month
- **Dark / Light Mode** — Full theme toggle with persistence
- **Undo** — Instantly undo the last transaction
- **Recurring Expenses** — Auto-adds recurring items every month
- **Data Export** — Export all transactions to JSON
- **Data Persistence** — All data saved in browser via localStorage

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | CSS3 (Custom properties, Flexbox, Grid, Animations) |
| Logic | Vanilla JavaScript ES6+ |
| Storage | localStorage API |
| Architecture | OOP with ES6 Classes and Modules |

## Project Structure

fund-manager/
├── index.html          # Main entry point
├── style.css           # Full design system
└── js/
├── app.js          # Main controller — DOM, events, views
├── user.js         # Auth simulation (register/login/logout)
├── transaction.js  # Transaction CRUD, filtering, search
├── budget.js       # Budget and savings goal logic
├── storage.js      # localStorage wrapper
└── utils.js        # Constants, helpers, category metadata

## JavaScript Concepts Demonstrated

- **ES6 Classes** — UserManager, TransactionManager, BudgetManager, StorageManager
- **Modules** — Logic split across 6 files by responsibility
- **DOM Manipulation** — Dynamic rendering of all views
- **Event Handling** — Form submission, delegation, debouncing
- **Array Methods** — map, filter, reduce, find, sort used throughout
- **OOP Principles** — Encapsulation, single responsibility per class
- **localStorage** — Full persistence across sessions
- **Form Validation** — Type checking, required fields, numeric formatting

## How to Run

Since this project uses ES6 Modules, serve it via a local server:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node.js
npx serve .

# Option 3 — VS Code
Install the "Live Server" extension → Right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` in your browser.

## Future Scope

This project is designed to evolve. Planned extensions:
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB for persistent multi-user storage
- **Auth**: Real JWT-based authentication with bcrypt password hashing
- **Charts**: Chart.js integration for visual analytics
- **PDF Export**: Transaction reports as downloadable PDFs
