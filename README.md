# Swan Digital Solutions - Lead Management System (LMS)

A production-grade, full-stack Lead Management System engineered for **Swan Digital Solutions**, a software and digital marketing agency. Built with a focus on clean architectural separation, robust role-based access control (RBAC), end-to-end type/schema validation with Zod, accessible UI design, and comprehensive automated test coverage.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Key Features](#key-features)
3. [Architecture & Design Decisions](#architecture--design-decisions)
4. [Database Design & Indexing](#database-design--indexing)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [API Specification & Documentation](#api-specification--documentation)
7. [Getting Started & Local Development](#getting-started--local-development)
8. [Testing & Verification](#testing--verification)
9. [Project Directory Layout](#project-directory-layout)

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite (ES Modules, JSX)
- **Styling:** Tailwind CSS with custom tokens and typography (Inter)
- **State Management:** TanStack Query v5 (React Query) for server state caching, optimistic updates, and cache invalidation
- **Routing:** React Router v7 with protected routes and role redirection
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Visualizations:** Recharts (AreaChart for acquisition velocity, Pie/Donut for pipeline breakdown, BarChart for service demand)
- **Icons:** Lucide React (clean line iconography)
- **API Client:** Interceptor-based Axios with `withCredentials: true`

### Backend
- **Runtime:** Node.js (v20+) + Express.js (Native ES Modules)
- **Database:** MongoDB (via Mongoose 8) with explicit indexes and aggregation pipelines
- **Authentication:** Stateless JWT stored exclusively in secure `httpOnly`, `SameSite: Lax` cookies (protecting against XSS token exfiltration)
- **Request Validation:** Zod middleware validating `req.body`, `req.query`, and `req.params`
- **Security:** Helmet headers, CORS with strict origin validation, `express-mongo-sanitize` for NoSQL injection prevention, rate limiting on authentication routes
- **Documentation:** Interactive OpenAPI / Swagger UI at `/api/docs`
- **Testing:** Jest with Supertest and `mongodb-memory-server` for isolated integration testing

---

## Key Features

1. **Dual Lead Views:**
   - **Interactive Kanban Board:** Group leads across 5 stages (`New`, `Contacted`, `Qualified`, `Converted`, `Lost`) with visual status indicators.
   - **Data-Dense Table View:** High-density table featuring debounced search (by name, email, company), multi-field filtering (status, service), sorting, and customizable pagination (10, 25, 50 rows).
2. **Real-Time Analytics Dashboard:**
   - KPI metrics: Total Leads, Closed Deals, Pipeline Conversion Rate (%), and Actionable Follow-up Counts.
   - 30-Day Lead Acquisition Trend (Smooth gradient Area chart).
   - Pipeline Status Distribution (Interactive Donut chart).
   - Service Demand Breakdown (Horizontal Bar chart).
   - Priority Follow-up Queue categorized into **Overdue** (urgent alerts), **Today**, and **Upcoming 7 Days**.
3. **Deep Lead Drawer & Audit Trail:**
   - Slide-over create/edit lead drawer with responsive input validation.
   - Lead Overview modal with quick status updates across pipeline buttons.
   - In-app client interaction logging (notes, phone calls, meetings).
   - Chronological audit history tracking who created, updated, or shifted lead status.
4. **Sanitized CSV Data Export:**
   - Export filtered leads on demand.
   - Implements CSV Injection mitigation by quoting and sanitizing formula triggers (`=`, `+`, `-`, `@`).
5. **Theme & Accessibility:**
   - Dark mode and light mode support persisted across sessions.
   - Accessible keyboard dialog traps (Esc to close, focus retention).

---

## Architecture & Design Decisions

### 1. Separate Collection for Lead Activities (`LeadActivity`)
- **Trade-off:** Embedding activity logs directly inside the `Lead` document vs. using a dedicated `leadactivities` collection.
- **Decision:** Separate collection.
- **Rationale:** Lead logs are unbounded. A lead that undergoes negotiations, notes, and calls over several months can accumulate dozens of entries. Embedding inside `Lead` risks exceeding MongoDB's 16 MB document size limit and deteriorates read throughput for list queries. A separate collection allows indexed chronological queries (`{ lead: 1, createdAt: -1 }`) and independent pagination.

### 2. Database-Level Role Scoping
- **Trade-off:** Filtering out unauthorized leads in Node.js memory vs. database query filters.
- **Decision:** All role filtering is pushed down to MongoDB `$match` stages and Mongoose queries:
  ```javascript
  const roleFilter = user.role === 'ADMIN'
    ? {}
    : { $or: [{ createdBy: user._id }, { assignedTo: user._id }] };
  ```
- **Rationale:** Processing in memory leaks unauthorized data across the wire, wastes server RAM, breaks database-level pagination, and risks severe security breaches.

### 3. HttpOnly Cookie Authentication
- **Decision:** Tokens are never stored in `localStorage` or `sessionStorage`. They are issued as `httpOnly`, `SameSite: Lax`, `secure` (in production) cookies.
- **Benefit:** JavaScript running in the browser cannot read the JWT, immunizing the platform from XSS-based session hijacking.

---

## Database Design & Indexing

### Lead Schema (`leads`)
| Field | Type | Description |
|---|---|---|
| `name` | String | Lead contact name (trimmed, max 150) |
| `searchName` | String | Normalized lowercase name for fast search regex |
| `email` | String | Primary email (validated with regex) |
| `phone` | String | Optional contact phone |
| `company` | String | Organization / Brand name |
| `serviceInterested` | Enum | Services offered by Swan Digital |
| `status` | Enum | `New`, `Contacted`, `Qualified`, `Converted`, `Lost` |
| `followUpDate` | Date | Scheduled follow-up reminder |
| `notes` | String | Freeform brief and notes (max 5000 chars) |
| `createdBy` | ObjectId | Reference to `User` |
| `assignedTo` | ObjectId | Reference to `User` (assigned specialist) |

### Indexes Declared
- `{ status: 1 }` - Instant filtering by pipeline stage.
- `{ createdAt: -1 }` - Default sorting order.
- `{ followUpDate: 1 }` - High-speed dashboard follow-up query.
- `{ assignedTo: 1, status: 1, createdAt: -1 }` - Compound index for role-scoped filtered listings.
- `{ createdBy: 1, status: 1, createdAt: -1 }` - Compound index for creator filtered listings.
- `{ searchName: 1 }` & `{ email: 1 }` - Text lookup performance.

---

## Role-Based Access Control (RBAC)

| Capability | Sales Representative (`SALES`) | System Administrator (`ADMIN`) |
|---|:---:|:---:|
| View Dashboard Analytics | Scoped to own leads | Entire Agency Pipeline |
| Create New Lead | Yes | Yes |
| Edit / Update Lead | Owned or assigned leads only | Any Lead |
| Change Lead Pipeline Status | Owned or assigned leads only | Any Lead |
| View Activity History | Owned or assigned leads only | Any Lead |
| Assign Lead to Specialists | No | Yes |
| Delete Lead | Owned or assigned leads only | Any Lead |
| Export Filtered Leads to CSV | Yes (scoped data) | Yes (all agency data) |
| Manage Team Directory (`/users`) | No | Yes |

---

## API Specification & Documentation

The interactive OpenAPI / Swagger documentation is hosted at:
```
http://localhost:5000/api/docs
```

### Main Endpoints Summary
- **Authentication:**
  - `POST /api/v1/auth/register` - Create user account
  - `POST /api/v1/auth/login` - Authenticate & set cookie
  - `POST /api/v1/auth/logout` - Clear session cookie
  - `GET /api/v1/auth/me` - Current session user profile
- **Leads:**
  - `GET /api/v1/leads` - List leads (search, status, service, sort, pagination)
  - `POST /api/v1/leads` - Create new lead
  - `GET /api/v1/leads/:id` - Fetch single lead by ID
  - `PUT /api/v1/leads/:id` - Update lead details
  - `PATCH /api/v1/leads/:id/status` - Quick update status stage
  - `DELETE /api/v1/leads/:id` - Delete lead and associated activities
  - `GET /api/v1/leads/:id/activities` - Fetch activity timeline
  - `GET /api/v1/leads/export` - Export leads as CSV
- **Dashboard:**
  - `GET /api/v1/dashboard/stats` - KPI card metrics
  - `GET /api/v1/dashboard/trends` - 30-day volume trends
  - `GET /api/v1/dashboard/services` - Service demand aggregation
  - `GET /api/v1/dashboard/follow-ups` - Overdue, today, and upcoming follow-ups
  - `GET /api/v1/dashboard/recent-leads` - Recent 5 inquiries
- **Team / Users:**
  - `GET /api/v1/users` - List organization members (ADMIN only)

---

## Getting Started & Local Development

### Prerequisites
- **Node.js** v20.0.0 or higher
- **MongoDB** running locally or a MongoDB Atlas connection URI

### 1. Installation
Install all dependencies for both backend and frontend from the root:
```bash
npm run install:all
```

### 2. Environment Configuration
Check `server/.env` (a `.env.example` is also provided):
```env
PORT=5000
NODE_ENV=production
# MongoDB Atlas Connection URI:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/swan_lms?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
CLIENT_ORIGIN=https://your-frontend-app.vercel.app
```

### 3. Verify Database Connection
Before running the application or seeding data, verify your MongoDB Atlas cluster connectivity and read/write privileges:
```bash
npm run verify:db
```

### 4. Seed Realistic Test Data
Populate the database with realistic leads, audit events, and user accounts:
```bash
npm run seed
```

**Pre-seeded Demo Accounts:**
- **Administrator:** `admin@swandigital.io` / `Admin@1234`
- **Sales Specialist 1:** `priya.sales@swandigital.io` / `Sales@1234`
- **Sales Specialist 2:** `rohan.sales@swandigital.io` / `Sales@1234`

### 4. Keyboard Shortcuts
- `Ctrl/Cmd + K`: Open Command Palette anywhere in the application.
- `/`: Focus search input on the Leads page (when no input is currently focused).
- `Esc`: Close any open drawer, modal dialog, or command palette.

### 5. Running the Development Servers
In two separate terminals:
```bash
# Terminal 1: Backend Server (runs on port 5000)
npm run server:dev

# Terminal 2: Frontend Client (runs on port 5173)
npm run client:dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Testing & Verification

The backend includes a comprehensive automated test suite with in-memory database isolation (`mongodb-memory-server`):
```bash
npm test
```
All 27 integration tests cover:
- Authentication & registration validation
- Rate limiting protection
- Role-based scoping (SALES vs ADMIN visibility)
- Lead CRUD and pipeline state updates
- Audit logging on creation and updates
- Input sanitization & error responses

To verify the production frontend build:
```bash
npm run build
```

---

## Project Directory Layout

```
SWAN_Assignment/
├── package.json              # Root runner scripts
├── README.md                 # Complete system documentation
├── .gitignore
├── client/                   # Frontend React + Vite app (Dark Editorial Design)
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── api/              # Axios client and endpoint modules
│   │   ├── components/
│   │   │   ├── auth/         # AuthShell, PasswordField, PasswordStrength, ProtectedRoute
│   │   │   ├── dashboard/    # StatCard, ConversionKpi, StatusChart, TrendChart, ServiceChart, FollowUpsPanel, RecentLeads
│   │   │   ├── landing/      # SplitFlapText, HighlightText, AnimatedNoise, ScrambleText, SoundContext
│   │   │   ├── layout/       # AppLayout, Sidebar, MobileNav, CommandPalette, RouteErrorBoundary
│   │   │   ├── leads/        # LeadsToolbar, LeadsTable, LeadCard, LeadFormDrawer, ActivityTimeline, FilterSheet, DeleteLeadDialog
│   │   │   └── ui/           # Button, Card, DateInput, Dialog, Drawer, EmptyState, ErrorState, FieldWrapper, Input, Kbd, Pagination, SectionHeader, SegmentedControl, Select, Skeleton, StatusTag, Table, Textarea, Toaster, Tooltip
│   │   ├── context/          # AuthContext, ThemeContext, ToastContext
│   │   ├── hooks/            # useCountUp, useDebounce, useLeadFilters, useMediaQuery, useReducedMotion
│   │   ├── lib/              # constants, formatters, schemas, cn
│   │   ├── pages/            # LandingPage, LoginPage, RegisterPage, DashboardPage, LeadsPage, LeadDetailPage, UsersPage, SettingsPage, NotFoundPage
│   │   └── styles/           # Tailwind v4 globals & editorial tokens
└── server/                   # Backend Express + MongoDB API
    ├── src/
    │   ├── config/           # Environment config & Swagger definition
    │   ├── controllers/      # Route controllers
    │   ├── middleware/       # Auth, validation, error handler
    │   ├── models/           # Mongoose schemas (Lead, LeadActivity, User)
    │   ├── routes/           # Express routers
    │   ├── seeds/            # Idempotent database seeder
    │   ├── services/         # Business logic & aggregation pipelines
    │   ├── tests/            # Integration test suites with in-memory DB
    │   ├── utils/            # AppError, logger, CSV helpers
    │   ├── validators/       # Zod request schemas
    │   ├── app.js            # Express application setup
    │   └── server.js         # HTTP server entry point
```
