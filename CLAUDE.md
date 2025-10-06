# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Information
- Next.js 15.5.4 Todo application with TypeScript and Tailwind CSS
- PostgreSQL database with TypeORM for data persistence
- React 19 with client-side state management

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

### Database Layer (TypeORM + PostgreSQL)
- **Data Source**: `src/lib/db/data-source.ts` - Singleton pattern for DB connection initialization
- **Entities**: Located in `src/lib/db/entities/`
  - `Todo.ts` - UUID primary keys, supports title, description, priority (low/medium/high), dueDate, completion status
  - `User.ts` - User entity (referenced but not fully implemented)
- **Environment Variables Required**: DB_URL, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT in `.env.local`
- Auto-synchronization enabled in development mode only

### Service Layer
- `src/lib/services/todo.service.ts` - Singleton TodoService class
  - Handles lazy database initialization
  - Provides CRUD operations with filtering support
  - Methods: findAll, findById, create, update, delete, toggleComplete

### API Routes (Next.js App Router)
- `src/app/api/todos/route.ts` - GET (with filters) and POST endpoints
- `src/app/api/todos/[id]/route.ts` - PATCH and DELETE endpoints
- All routes use standardized response format via `src/lib/utils/api-response.ts`

### Frontend Architecture
- **Main Page**: `src/app/page.tsx` - Client component with filtering and stats
- **Custom Hook**: `src/hooks/useTodos.ts` - Manages all todo state and API calls
- **Components**:
  - `src/components/todo/` - TodoForm, TodoItem, TodoList, TodoFilter
  - `src/components/ui/` - Reusable UI components (Button, Input, Card)

### Type System
- `src/types/todo.types.ts` - Todo domain types
- `src/types/api.types.ts` - API request/response types
- TypeScript decorators enabled for TypeORM entities

## Important Notes
- Known typo in codebase: "descriptrion" instead of "description" (in Todo entity and API routes)
- Database must be running before starting the app
- The app uses path aliases: `@/*` maps to `src/*`
