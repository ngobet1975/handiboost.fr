# Architecture Decision Records (ADRs)

## What is an ADR?
An Architecture Decision Record is a lightweight document that records a consequential technical decision, capturing its context, the decision itself, and the expected consequences.

## Why use them?
Over the lifecycle of software, the *reasons* why certain frameworks or architectural patterns were chosen are often lost. By maintaining ADRs, future developers and AI agents understand the hard constraints and historical context of the codebase, preventing expensive "re-writes" based on a lack of historical context.

## When to write one
Write a new ADR whenever the Lead agent or engineering team makes a decision that:
- Fixes the project to a specific heavy dependency (e.g., React vs. Vue, Postgres vs. MongoDB).
- Defines a core systemic pattern (e.g., moving to microservices, choosing a specific authentication provider like Auth0).
- Alters or contradicts a previously established baseline.

## How to format an ADR
Create a new markdown file sequentially numbered (e.g., `001-choose-react-for-frontend.md`).

Format the file using the following structure:
```markdown
# [Title of the Decision]

## Context
What is the business or technical problem that forced a decision to be made? What are the technological constraints?

## Decision
What is the specific decision chosen to solve the problem? Be concise and declarative.

## Consequences
What becomes easier as a result of this decision? 
What becomes harder or introduces new technical debt?
```
