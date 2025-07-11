# JJ-P1114 Studio Software Management Platform

## Overview

This is a full-stack software management platform built with React, Express, and TypeScript. The application provides a comprehensive solution for managing software licenses, processing orders, handling customer inquiries, and building prototypes. It features a modern web interface with authentication, role-based access control, and an admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.
Project language: French (UI and user interactions).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with ESBuild for production builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with JSON responses

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Managed through Drizzle Kit
- **Connection**: Neon Database serverless connection with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC integration (fully operational)
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Role Management**: User roles (client, admin, staff) with role-based access control
- **Security**: HTTP-only secure cookies with session TTL
- **User Experience**: Non-authenticated users can access homepage, authenticated users see personalized dashboard

### Software Management
- **Catalog**: Software products with pricing, descriptions, and features
- **Licensing**: Automatic license generation upon purchase
- **Orders**: Order processing with status tracking
- **Downloads**: License-based software download access

### Prototype Builder
- **Interactive Designer**: Drag-and-drop interface for creating prototypes
- **Component Library**: Pre-built UI components (buttons, inputs, tables, charts)
- **Collaboration**: Comments and specifications for prototype feedback
- **Persistence**: Save and load prototype configurations

### Admin Dashboard
- **Statistics**: Overview of orders, licenses, and user activity
- **Order Management**: View and update order statuses
- **User Management**: Role assignment and user oversight
- **Content Management**: Software catalog administration

## Data Flow

### Authentication Flow
1. User initiates login via `/api/login`
2. Redirects to Replit OIDC provider
3. Returns with authorization code
4. Server exchanges code for tokens
5. User session created in PostgreSQL
6. Client receives authentication status

### Order Processing Flow
1. User selects software from catalog
2. Order created with "pending" status
3. Payment processing (simulated)
4. License automatically generated
5. Order status updated to "completed"
6. User gains download access

### Prototype Creation Flow
1. User accesses prototype builder
2. Drags components onto canvas
3. Configures component properties
4. Saves prototype to database
5. Generates shareable prototype links

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: WebSocket-based connection for serverless compatibility
- **Pooling**: Connection pooling for performance

### Authentication
- **Replit Auth**: OpenID Connect provider
- **Session Storage**: PostgreSQL table for session persistence
- **Security**: HTTPS-only cookies with secure flags

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Comprehensive icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `/dist/public`
2. **Backend**: ESBuild bundles server code to `/dist/index.js`
3. **Assets**: Static files served from build directory
4. **Environment**: Production/development environment detection

### Production Setup
- **Server**: Express.js serving both API and static files
- **Database**: PostgreSQL with connection pooling
- **Sessions**: Persistent session storage
- **Security**: HTTPS enforcement, secure cookies

### Development Setup
- **Hot Reloading**: Vite dev server with HMR
- **API Proxy**: Development server proxies API requests
- **Database**: Shared development database
- **Auth**: Replit Auth configured for development domain

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPLIT_DOMAINS`: Allowed domains for OIDC
- `ISSUER_URL`: OIDC provider URL
- `REPL_ID`: Replit environment identifier

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across frontend and backend while maintaining clear separation of concerns.