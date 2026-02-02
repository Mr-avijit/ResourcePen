# Backend Implementation Plan: Full System Migration

## Overview
This plan details the migration from a mock-based frontend to a fully realized NestJS backend system.
Goal: Replace `MockApiService` and `MockDB` with a production-ready NestJS application using Postgres, Redis, and external services.

## Phase 1: Foundation & Infrastructure
- [ ] **Infrastructure Setup**
    - [ ] Create `backend` directory (archive existing).
    - [ ] Initialize NestJS project.
    - [ ] Configure `docker-compose.yml` for PostgreSQL, Redis, and ElasticSearch/Meilisearch.
- [ ] **Database Schema (Prisma)**
    - [ ] modeling `User`, `Product`, `Order`, `Enquiry`, `Feedback`, `CMSConfig`, `TeamMember`, `BlogPost` based on `types.ts`.
    - [ ] Create migration scripts.
    - [ ] Create seed script using `SeedData.ts`.

## Phase 2: Core Modules Implementation
- [ ] **Auth Module**
    - [ ] JWT Strategy for session management.
    - [ ] Google & GitHub OAuth integration (Passport).
    - [ ] Role-based Guards (`Permissions`).
- [ ] **User Module**
    - [ ] Profile management.
    - [ ] User dashboard data aggregation.
- [ ] **Product Module** (Resource Marketplace)
    - [ ] CRUD for Products (Assets).
    - [ ] Search integration (ElasticSearch/Meilisearch).
    - [ ] File delivery (S3/Presigned URLs).

## Phase 3: Business Logic & External Services
- [ ] **Order & Payment Module**
    - [ ] Cart management (Redis).
    - [ ] Razorpay integration (Webhooks).
    - [ ] Invoice generation.
- [ ] **Communication Module**
    - [ ] Nodemailer + SES implementation.
    - [ ] Email templates for Welcome, Order Confirmation, OTP.
- [ ] **CMS & SEO Module**
    - [ ] Headless CMS endpoints for `CMSPageConfig`.
    - [ ] SEO automation rules and metric tracking.

## Phase 4: Frontend Integration
- [ ] **Legacy Removal**
    - [ ] Delete `MockDB.ts`.
    - [ ] Refactor `MockApiService.ts` -> `ApiService.ts`.
    - [ ] Update all frontend calls to use the new `ApiService`.
- [ ] **Verification**
    - [ ] E2E Testing with Playwright.

## Technical Stack Confirmation
- **Runtime**: Node.js (LTS)
- **Framework**: NestJS
- **DB**: PostgreSQL (via Prisma)
- **Cache**: Redis (via BullMQ)
- **Storage**: S3
- **Payments**: Razorpay

---

**Next Steps:**
1. Archive current `backend` folder.
2. Scaffold new NestJS app.
3. Define `schema.prisma`.
