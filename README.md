# UniCompute

UniCompute is a university High-Performance Computing (HPC) resource management platform designed to simplify access to computing resources through a secure and user-friendly interface.

The platform aims to help users select CPU and GPU resources, submit and monitor computing jobs, manage storage, and access HPC resources without manually handling complex scheduler commands.

## Main Features

The planned platform features include:

- **Resource Management:** View available CPU, GPU, and memory resources.
- **Job Management:** Submit jobs and monitor their execution status.
- **Storage Management:** Manage storage resources separately from processing resources.
- **Resource Sharing:** Allow resource owners to share resources with groups through permissions.
- **GPU Reservations:** Reserve GPU resources for future time periods.
- **Credit Management:** Support usage-based resource charging and credit management.
- **ML Resource Advisor:** Recommend suitable computing resources based on job requirements.

## Proposed Technology Stack

The following technologies are proposed for the project and are subject to team and mentor review.

| Component | Proposed Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Main Backend | Node.js, TypeScript, NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| ML Service | Python, FastAPI |
| Development Environment | Docker, Docker Compose |
| Scheduler Integration | Mock Scheduler initially, Real Slurm integration later |

## Project Structure

The following is the proposed repository structure. It will be updated as implementation progresses.

```text
UniCompute/
├── frontend/
├── backend/
├── ml-service/
├── docs/
│   ├── architecture/
│   └── decisions/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Git Branching Strategy

The project follows a feature-branch workflow.

| Branch | Purpose |
|---|---|
| `main` | Stable project version |
| `Dev` | Team integration and development branch |
| `feature/*` | New feature development |
| `bugfix/*` | Bug fixes |
| `docs/*` | Documentation changes |
| `chore/*` | Configuration and maintenance tasks |

### Development Workflow

1. Create a feature branch from `Dev`.
2. Implement the assigned task in that branch.
3. Commit and push changes to the remote repository.
4. Create a Pull Request targeting `Dev`.
5. Request a review from another team member.
6. Merge after review and successful testing.
7. Merge stable, tested changes from `Dev` into `main` when appropriate.

Direct pushes to `main` and `Dev` should be avoided.

## Current Development Status

The project is currently in its initial development phase.

Sprint 1 focuses on establishing the project foundation and developing a small working prototype.

The initial prototype is planned to demonstrate:

- Simulated resource availability.
- Basic job submission.
- Mock scheduler job status updates.
- Basic job monitoring.

**Note:** The initial scheduler demonstration uses simulated behaviour. Integration with a real HPC environment and Slurm scheduler is planned for a later stage, subject to infrastructure access and approval.

## Contribution Guidelines

All team members should:

- Work on their assigned feature or task branches.
- Follow the agreed branch naming conventions.
- Write clear commit messages.
- Create Pull Requests for code changes.
- Review and test changes before merging.
- Keep project documentation updated.

## Project Goal

The overall goal of UniCompute is to provide a centralized platform that makes university HPC resources easier to access, manage, share, and utilize.
