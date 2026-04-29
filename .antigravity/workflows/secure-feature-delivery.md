---
description: Secure Feature Delivery Workflow
---

# Secure Feature Delivery

This is the mandatory lifecycle workflow for delivering any significant task or feature request in this project. All AI agents, especially the Lead Delivery Agent, must conform to this sequence.

## Step 1: Understand & Clarify
- Read the user request carefully.
- If uncertain about unstated requirements or non-functional constraints, **ask for clarification** before proceeding.
- **External Integration Check**: Identify if external advisory inputs (e.g., OpenAI expert reviews via MCP) are available or required. Schedule their ingestion into the planning phase.

## Step 2: Task List Creation
- Break down the request into a precise, actionable checklist.
- The task list must structurally allocate time for planning, architecture review, and security review before the coding phase.

## Step 3: Implementation Strategy Formulation
- Draft a cohesive implementation plan detailing the exact code changes and structural modifications needed across the frontend, backend, or infrastructure.

## Step 4: Architecture Definition & Review
- Extract the architectural implications from the implementation plan and evaluate them against `docs/architecture/architecture-baseline.md`.
- Explicitly define: Core component responsibilities, layer boundaries, data flow paths, strict API contracts, and deployment contexts.
- **Do not proceed** if the architecture introduces tight coupling or ignores boundary definitions.

## Step 5: Security Defensibility Review
- Submit the plan for aggressive evaluation against `docs/security/security-baseline.md`.
- Identify theoretical risks, classify their severity, specify the affected areas, and dictate recommendations.
- Ensure strict input validation paradigms and safe secret management are in place. 
- **Do not proceed** if critical vulnerabilities (like client-side secret exposure) are present.

## Step 6: Code Implementation
- Apply the reviewed, secure architectural plan to the codebase.
- Write code precisely according to the implementation strategy, strictly following the `standards/project-rules.md`.
- Ensure changes are atomic, maintainable, and well-structured.

## Step 7: Proof of Closure
- Provide undeniable proof of completion. 
- Execute tests locally, provide terminal output logs, or visually detail UI interactions.
- **Never close a task without evidence** that the feature works reliably and securely in the defined context.
