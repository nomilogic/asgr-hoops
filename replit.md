# ASGR Basketball Scouting Website

## Overview

ASGR Basketball is a comprehensive basketball scouting platform that provides detailed player rankings, scouting reports, and subscription-based packages for accessing elite high school basketball talent data. The application combines sports database functionality with e-commerce capabilities, allowing users to browse player rankings, view detailed profiles, and purchase scouting service packages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching with automatic caching and invalidation

**UI Component System**
- shadcn/ui component library (New York style variant) providing accessible, customizable components built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants
- Custom design system based on sports platforms (ESPN, Rivals, 247Sports) with emphasis on data-heavy tables and clean product showcases

**State Management Strategy**
- Server state managed via TanStack Query with query keys matching API endpoints
- Local component state using React hooks
- No global client state management library needed due to server-state-first approach

**Key Design Decisions**
- Accessibility-first approach using Radix UI primitives ensures WCAG compliance
- Mobile-responsive design with breakpoints at 768px (md) and 1024px (lg)
- Toast notifications for user feedback on actions
- Skeleton loading states for improved perceived performance

### Backend Architecture

**Server Framework**
- Express.js running on Node.js for HTTP server and API routing
- TypeScript for type safety across the full stack
- Custom middleware for JSON request logging and debugging

**API Design**
- RESTful API structure with resource-based endpoints
- Endpoints organized by resource type (products, players, cart)
- JSON request/response format with proper HTTP status codes
- Error handling middleware for consistent error responses

**Development vs Production**
- Vite dev server runs in middleware mode during development for HMR
- Production serves pre-built static assets from dist/public
- Replit-specific plugins for enhanced development experience (error overlay, cartographer, dev banner)

### Data Storage Solutions

**Database**
- PostgreSQL as the primary relational database
- Drizzle ORM for type-safe database queries and schema management
- Neon serverless PostgreSQL for deployment (@neondatabase/serverless driver)
- Schema-first approach with TypeScript types generated from Drizzle schema

**Data Models**
- **Products**: Scouting service packages with pricing, features, and categorization
- **Players**: Comprehensive player profiles with rankings, stats, college commitments
- **Cart Items**: Shopping cart functionality linking products with quantities

**In-Memory Storage (Development)**
- MemStorage class implements IStorage interface for development/testing
- Pre-seeded with sample data for immediate functionality
- Can be swapped with database implementation without code changes due to interface abstraction

**Schema Validation**
- Drizzle-Zod integration generates Zod schemas from database schema for runtime validation
- Type-safe insert operations with proper validation before database writes

### Authentication and Authorization

**Current Implementation**
- No authentication system currently implemented
- Cart is session-agnostic (single global cart)
- Ready for session-based auth integration via connect-pg-simple package

**Future Considerations**
- Session storage infrastructure present (connect-pg-simple dependency)
- Would require user model, login/registration endpoints, and session middleware
- Cart would need user association for multi-user support

### Design System

**Typography**
- Primary font: Inter for headings and strong emphasis
- Secondary font: Roboto for body text and data display
- Monospace font: Roboto Mono for stats and numerical data
- Custom font loading via Google Fonts API

**Color System**
- HSL-based color tokens for easy theming
- CSS custom properties for dynamic color values
- Support for light/dark modes (configured but not fully implemented)
- Semantic color naming (primary, secondary, muted, accent, destructive)

**Component Patterns**
- Compound components for complex UI (e.g., NavigationMenu, Dialog)
- Slot pattern for composition via Radix UI Slot
- Consistent spacing using Tailwind's spacing scale
- Hover/active states using custom utility classes (hover-elevate, active-elevate-2)

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless UI components providing accessibility, keyboard navigation, and ARIA attributes
- **shadcn/ui**: Pre-built component implementations combining Radix UI with Tailwind styling
- **Lucide React**: Icon library for consistent iconography throughout the application
- **cmdk**: Command palette component for advanced UI patterns

### Data Fetching & State
- **TanStack Query v5**: Server state management with intelligent caching, background refetching, and optimistic updates
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration layer for Zod schema validation with React Hook Form

### Database & ORM
- **Drizzle ORM**: TypeScript ORM with zero-runtime overhead and full type inference
- **Drizzle Kit**: CLI tool for schema migrations and database introspection
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless environments
- **Drizzle-Zod**: Generates Zod validation schemas from Drizzle table definitions

### Styling & UI Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **tailwindcss-animate**: Animation utilities for Tailwind
- **class-variance-authority**: Type-safe variant management for components
- **clsx & tailwind-merge**: Conditional class name utilities

### Carousel & Interactive Components
- **Embla Carousel**: Lightweight carousel library with React bindings
- **React Day Picker**: Flexible date picker component
- **date-fns**: Modern date utility library

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Static type checking
- **Replit Vite Plugins**: Development experience enhancements (runtime error overlay, cartographer for code navigation, dev banner)
- **esbuild**: Server-side code bundling for production

### Session Management (Ready but Unused)
- **connect-pg-simple**: PostgreSQL session store for Express sessions (installed but not configured)

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Node environment detection via `NODE_ENV` variable
- Replit-specific configuration via `REPL_ID` variable