# HabitFlow

HabitFlow is a modern habit-tracking web app built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Create, edit, delete, and track daily habits
- Habit categories, search, and filtering
- Dashboard with progress overview and habit cards
- Calendar and analytics views with streak and completion insights
- Light/Dark theme support
- Local-first persistence with `localStorage`
- JSON backup import/export
- Reset app data or clear history from settings

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Oxlint
- Lucide icons + canvas-confetti

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173` by default.

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Type-check and build for production
- `npm run lint` — Run Oxlint
- `npm run preview` — Preview production build locally

## Project Structure

```text
src/
  components/   UI views and reusable components
  context/      Habit and toast state management
  types/        Shared TypeScript types
  utils/        Date helpers, storage, and seed data
```

## Data Storage

HabitFlow stores all data in browser `localStorage` using:

- `habitflow_habits`
- `habitflow_records`
- `habitflow_settings`

No backend service is required.
