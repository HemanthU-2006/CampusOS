# CampusOS 🎓

> Unified modern campus operating system for Students, Faculty, Club Heads, Maintenance Staff, and Administrators.

## Overview
CampusOS is built from the ground up to solve campus fragmentation:
- **Venue Booking**: Real-time conflict queries, reservation workflows with approvals.
- **Campus Events**: Capacity management, waitlisting with auto-promotion, QR-based check-in.
- **Resource Management**: Lab gear and hardware checkout lifecycle (requested -> approved -> issued -> returned/overdue).
- **Clubs & Communities**: Member tracking, announcements, and activity point system.
- **Lost & Found**: Geo-tagged post-and-match suggestions with claim verification.
- **Attendance**: Faculty bulk-entry, low-attendance warnings (<75%), and CSV reporting.
- **Maintenance Ticketing**: Student photo reports, staff assignment, resolution tracking, and rating.
- **Global Search**: Instant grouped search across venues, events, clubs, and lost & found.
- **Admin Analytics**: Aggregated metrics across campus utilization, events, and maintenance SLA.

---

## Tech Stack
- **Client**: React 19 / Vite, TypeScript, Tailwind CSS v4, Lucide Icons, Radix UI Primitives, TanStack Query, React Hook Form + Zod, Framer Motion, Recharts, Sonner, Axios.
- **Server**: Node.js, Express, TypeScript, MongoDB + Mongoose, Zod validation, JWT in httpOnly cookies, bcryptjs, Helmet, CORS, express-rate-limit, Multer.

---

## Quick Start

### 1. Install Dependencies
```bash
# Root and child workspaces
npm run install:all
```

### 2. Environment Configuration
Copy `.env.example` in both `server` and `client`:
```bash
# In server/
cp .env.example .env

# In client/
cp .env.example .env
```

### 3. Run Development Servers
```bash
npm run dev
```
- Client runs on `http://localhost:5173`
- Server runs on `http://localhost:5000`
- API proxy is configured so requests to `/api` on Vite route to Express.

---

## Design System Tokens
- **Background**: `#090909` (Ultra-dark page)
- **Cards**: `#1B1B1B` (Pill & card surfaces)
- **Borders/Rings**: `#232323` and `#2F2F2F`
- **Accent**: `#83F34D` (Electric Lime) & `#0B2400` (Lime Ink)
- **Ambient Glow**: `#1D2E13` (Radial lime backlights)
- **Typography**: `Figtree` (UI/Headings) & `Lexend` (Search input)
