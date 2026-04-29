# Documentation Index

This directory holds the fundamental knowledge base for the project. 

## Structure

### `/architecture`
Contains the structural blueprints and baselines for the software.
- **`architecture-baseline.md`**: The universal checklist used to define and evaluate boundaries, API contracts, deployment risks, and separation of concerns before implementation begins.

### `/security`
Contains the defensive guidelines and principles for the software.
- **`security-baseline.md`**: The mandatory controls that must be enforced (e.g., no client-side API keys, strict input validation, safe logging). Plans that fail this baseline must be rejected.

### `/adr`
Contains **Architecture Decision Records**. 
An ADR is a short, immutable document tracking a consequential technical decision. If you introduce a new core framework, choose a database, or alter the system architecture fundamentally from the established norm, you must create a new ADR here to document the *Context*, the *Decision*, and the *Consequences*.
