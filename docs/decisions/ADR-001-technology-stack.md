# ADR-001: UniCompute Technology Stack

- **Project:** UniCompute
- **Jira Issue:** UNICOM-65
- **Date:** 8 November 2026
- **Status:** Proposed - Pending Team Confirmation
- **Owner:** Member 4

## 1. Purpose

This document records the proposed technology stack for the UniCompute platform based on the latest mentor discussion and the team's current implementation direction.

The objective is to establish a consistent technology foundation for frontend development, backend implementation, database management, scheduler integration and supporting services.

## 2. Proposed Technology Stack

| Component | Proposed Technology |
|---|---|
| Frontend | Next.js + TypeScript |
| Main Backend | Node.js + TypeScript + NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| ML Resource Advisor | Python + FastAPI |
| Development and Deployment | Docker + Docker Compose |
| Scheduler | Mock Scheduler initially |
| Future Scheduler Integration | Scheduler Adapter with Real Slurm support |

## 3. Frontend Technology

The frontend implementation currently uses:

- Next.js
- React
- TypeScript
- Lucide React for icons

The existing implementation is available in the `feature/UNICOM-35-dashboard` branch.

The proposed frontend direction is Next.js with TypeScript.

## 4. Main Backend Technology

The proposed main backend is Node.js with TypeScript using the NestJS framework.

The backend will initially be developed as one application containing logically separated modules.

Expected responsibilities include:

- Authentication and authorization.
- User and group management.
- Resource management.
- Job submission and monitoring.
- Scheduler communication.
- Storage management.
- GPU reservation management.
- Credit and payment coordination.
- Notification coordination.
- ML Resource Advisor integration.

Individual backend modules will not initially be deployed as separate microservices.

## 5. Database and ORM

The proposed database technology is PostgreSQL.

Prisma is proposed as the ORM for database access and schema management.

Database structure and migrations should be coordinated with Member 2.

## 6. ML Resource Advisor

The ML Resource Advisor is proposed as a separate Python-based service using FastAPI.

Its responsibility is to provide resource recommendations based on job requirements.

The exact deployment and communication approach will be confirmed during implementation.

## 7. Scheduler Integration

The initial implementation will use a Mock Scheduler.

A Scheduler Adapter will separate the main backend from the scheduler implementation.

Initial direction:

- The backend communicates with the Mock Scheduler.
- Job submission and status updates are simulated.
- Real HPC execution is not claimed.

Future direction:

- The adapter will support integration with a real Slurm scheduler.
- Real Slurm integration depends on infrastructure access and approval.

## 8. Backend Architecture Direction

The initial backend will remain one application with clear internal module boundaries.

A Modular Monolith approach and Clean/Onion Architecture are directions to investigate.

They are not yet confirmed architectural decisions.

Unnecessary microservice separation should be avoided at this stage.

## 9. Reasons for the Proposed Stack

- Next.js is already being used in the current frontend implementation.
- TypeScript provides a consistent programming language across frontend and main backend.
- NestJS supports modular backend development.
- PostgreSQL provides the proposed relational database foundation.
- Prisma provides database access and migration capabilities.
- FastAPI allows the ML functionality to remain separate from the main backend.
- The Scheduler Adapter supports future Slurm integration without tightly coupling the backend to a specific scheduler.
- Docker and Docker Compose support a consistent development environment.

## 10. Team Coordination

| Member | Coordination Area |
|---|---|
| Member 1 | Backend module boundaries, scheduler integration and API contracts |
| Member 2 | PostgreSQL database structure and Prisma migrations |
| Member 3 | Frontend/backend communication and API requirements |
| Member 4 | Architecture documentation, technology decisions and integration coordination |

## 11. Pending Confirmations

The following items must be confirmed with the mentor and team:

- Final acceptance of the proposed technology stack.
- Internal backend module boundaries.
- Whether Modular Monolith and Clean/Onion Architecture will be adopted.
- Database schema and migration conventions.
- API contracts between frontend and backend.
- Payment provider and payment workflow.
- Notification implementation.
- Storage integration details.
- Real Slurm access and integration arrangements.
- Deployment environment.

## 12. Conclusion

The proposed technology direction establishes Next.js and TypeScript for the frontend, NestJS and TypeScript for the main backend, PostgreSQL with Prisma for data management, and Python with FastAPI for the ML Resource Advisor.

The initial scheduler implementation will use a Mock Scheduler with an adapter designed to support future Real Slurm integration.

These proposals will be confirmed with the mentor and team before being treated as final technical decisions.
