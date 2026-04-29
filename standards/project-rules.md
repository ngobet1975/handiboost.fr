# Global Project Rules

These rules are absolute and bind both human developers and AI agents operating within this repository. 

## 1. Planning First
No implementation begins without a documented plan. You must break large features down into an actionable task list and write an implementation plan identifying the affected file changes before making those changes.

## 2. Architecture Validation
No code is written before the architectural boundaries, components, and API contracts are explicitly defined and verified against the `architecture-baseline.md`.

## 3. Security Validation
No pull request is merged, and no feature is considered complete, without a structured security review verifying that inputs are validated securely, secrets are protected, and least privilege is maintained against `security-baseline.md`.

## 4. Evidence-Based Closure
Never mark a task or feature as "Done" or close an issue without tangible validation proof. "It compiles" is not evidence. Provide test logs, screengrabs, or explicit walkthrough validations.

## 5. Advisory Input Integration
External intelligence (e.g., OpenAI o1/o3-mini expert reviews provided via MCP interfaces or manually) must be treated as **authoritative advisory inputs**. These inputs must be synthesized and resolved *during the planning phase*, before implementation coding begins.

## 6. Code Operations
- **Atomic Changes**: Produce small and clear diffs.
- **Zero Secrets**: No hardcoded credentials. Use `.env` files.
- **Untrusted Input**: Validate all network inputs unconditionally on the trusted server.
- **Safe Telemetry**: Log errors operationally without leaking application secrets or user passwords.
- **Separation of Concerns**: Keep business logic out of UI rendering code, and UI dependencies out of background services.
