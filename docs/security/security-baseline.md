# Security Baseline

## Objective
Establish a non-negotiable "Security-First" defensive posture for the project. Every piece of code, every API endpoint, and every architectural decision must be systematically evaluated against this baseline.

## Mandatory Controls

### 1. Data Protection & Secret Management
- **No Client-Side Secrets**: Never embed API keys, OAuth secrets, database credentials, or any sensitive tokens in frontend source code (`src/pages/`, `src/components/`, etc.). 
- **Server-Side Environment Context**: All secrets must be securely managed via environment variables (e.g., `.env`) injected only into the backend process.
- **Data at Rest**: Passwords and sensitive PII must be strongly hashed (e.g., using `bcrypt` or `argon2`) and salted before persistence.

### 2. Network & Boundary Defense
- **Input Validation Everywhere**: Do not trust the client. Validate the type, length, and format of all incoming network payloads, form submissions, and query parameters synchronously at the boundary (e.g., using schema validators like `zod` or `joi`).
- **Defensive Headers**: Apply security headers (like `helmet` for Express apps) to enforce strict content security policies and prevent common XSS/Clickjacking vectors.
- **Review Exposed Endpoints**: Ensure only strictly necessary paths are exposed publicly. Secure internal systems and admin endpoints aggressively.

### 3. Authentication & Authorization
- **Explicit Authn/Authz**: Protect every restricted endpoint. Verify the session or access token securely and validate that the authorized context actually has the privilege to perform the action (Authorization).
- **Least Privilege Principle**: Give users, database connections, service accounts, and system processes only the bare minimum permissions necessary to function.

### 4. Observability & Operations
- **Safe Logging**: Explicitly scrub passwords, session tokens, and sensitive PII before writing data to any logs or console outputs. Ensure failure login attempts log the event but never the attempted credential.
- **Dependency Awareness**: Review external libraries routinely. Do not introduce untested, highly suspicious, or completely undocumented third-party dependencies without severe scrutiny.
- **Safe Terminal Execution**: AI agents and developers must review all potentially destructive commands before execution.

## Review Audit Output Format
When the Security Agent conducts an audit for a new feature implementation plan, the output must be structured precisely:
- **Risk Category** (e.g., XSS, Secret Exposure, CSRF)
- **Severity** (Low, Medium, High, Critical)
- **Affected Area** (Specific file paths or conceptual modules)
- **Recommendation** (Actionable mitigation steps)
- **Status** (Blocking or Non-Blocking)
