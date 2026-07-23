# Infrastructure as Code (IaC) State Platform

The IaC State Platform provides workspace configuration, state concurrency locking, plan/apply executions, and active drift checks.

## Features

### 1. Template Registry
Supports Terraform, OpenTofu, and Pulumi providers, with schema validation for parameters and variables.

### 2. State Concurrency Locking
Prevents double-deployments and state corruption by acquiring exclusive lock IDs during plan/apply phases.

### 3. Change Planning & Applying
Simulates template dry-runs to estimate resource creation, updates, or destruction, and writes state datasets on successful applies.

### 4. Continuous Drift Detection
Compares expectation states from templates against running cloud instances to detect attribute variations and out-of-band updates.

## Database Schema
- **IaCTemplate**: Multi-tenant template scripts and validation models.
- **IaCModule**: Reusable configurations and version mappings.
- **IaCState**: Dynamic state JSON and lock descriptors.
- **InfrastructureChange**: Auditable plan/apply runs, drift results, and user timestamps.
