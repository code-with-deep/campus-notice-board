# Campus Notice Board

A production-quality Notice Board CRUD application built with Next.js Pages Router, Prisma ORM, and a hosted MySQL database (TiDB Cloud). Designed for campus announcements with category, priority, and publish date management.

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- npm
- A hosted MySQL database (TiDB Cloud recommended)

### Steps

1. **Clone the repository**

```bash
git clone <your-repository-url>
cd campus-notice-board
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

On Windows (PowerShell):

```powershell
copy .env.example .env
```

Update `.env` with your MySQL connection string:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/DATABASE?sslaccept=strict"
```

4. **Run database migrations**

```bash
npm run db:migrate
```

5. **Start the development server**

```bash
npm run dev
```

6. **Open the application**

Visit [http://localhost:3000](http://localhost:3000)

### Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run test:e2e` | Run API end-to-end tests |

---

## One Thing I Would Improve With More Time

**Add role-based authentication and authorization.**

Right now the app supports open CRUD access. In a real campus deployment, only authorized staff should be able to create, edit, or delete notices, while students should have read-only access.

With more time, I would add login, role-based API protection, and an audit log for notice changes so the system is secure and accountable in production.

---

## Where and How AI Was Used

AI was used as a support tool during development, not as a substitute for engineering judgment.

It helped with:

- Understanding assignment requirements and planning the initial architecture
- Drafting parts of the documentation (including this README)
- Suggesting approaches for debugging environment and database setup issues
- Speeding up repetitive tasks such as boilerplate structure and test scripts



All submitted code was reviewed, tested, and validated by me before being included in the final project.

---

## Features

- Full CRUD for campus notices
- RESTful API with proper HTTP status codes
- Server-side validation for all notice fields
- Urgent notices sorted first via Prisma (`priority` → `publishDate` → `createdAt`)
- Responsive UI for mobile, tablet, and desktop
- Search, filter by category/priority, and pagination
- Delete confirmation modal, loading/empty/error states
- Image URL preview, character counter, dark mode, toast notifications
- Vercel deployment ready

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **UI:** React 18, Tailwind CSS
- **ORM:** Prisma 6
- **Database:** MySQL (TiDB Cloud)
- **Deployment:** Vercel

## Folder Structure

```
pages/
  index.js
  notices/new.js
  notices/edit/[id].js
  api/notices/index.js
  api/notices/[id].js

components/
  NoticeCard.jsx
  NoticeForm.jsx
  DeleteConfirmationModal.jsx
  NoticeFilters.jsx
  Pagination.jsx
  Layout.jsx
  Navbar.jsx
  ...

lib/
  prisma.js
  validation.js
  api.js
  notices-query.js

prisma/
  schema.prisma
```

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add `DATABASE_URL` in Vercel environment variables
4. Deploy
5. Run `npm run db:deploy` against production

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notices` | List notices (supports `q`, `category`, `priority`, `page`, `limit`) |
| `POST` | `/api/notices` | Create a notice |
| `GET` | `/api/notices/[id]` | Get a single notice |
| `PUT` | `/api/notices/[id]` | Update a notice |
| `DELETE` | `/api/notices/[id]` | Delete a notice |

**Status codes:** `200`, `201`, `400`, `404`, `405`, `500`
