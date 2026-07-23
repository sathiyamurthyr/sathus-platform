# Enterprise Context Engine Operational Manual

**Document:** `docs/knowledge/context-engine.md`  
**EPIC:** EPIC-028 (Story 28.6)  
**Status:** Production Ready  

---

## Overview

The **Enterprise Context Engine** constructs, ranks, compresses, and caches multi-scope context windows for LLM agents (up to 128k+ token limits).

---

## Multi-Scope Resolution Matrix

- **Tenant Scope**: Tenant-wide governance rules and enterprise boundaries.
- **Workspace Scope**: Active project, team, and workspace configs.
- **Workflow Scope**: Current approval or state machine status.
- **User / Memory Scope**: User preferences and agent memory history.
- **Live Context**: Dynamic runtime events.
