# Enterprise DevOps & GitOps Platform

The DevOps Platform provides git-triggered CI/CD pipelines, container build workflows, security scans, and software supply chain integrity checks.

## Features

### 1. GitOps Sync
Pipelines are connected to target git repositories and branch configurations to continuously synchronize desired states with live cluster states.

### 2. Container Build & Digest Verification
Simulates secure container builds, producing verified digests (SHA256) registered in the artifacts repository.

### 3. Image Scans & SBOM
- Pluggable image scanners (Trivy) check for vulnerabilities (Critical, High, Medium, Low counts).
- Generates Software Bill of Materials (SBOM) listing dependencies, licenses, and packages for software supply chain compliance.

## Database Schema
- **DeploymentPipeline**: Repository URL, target branch, pipeline status, and custom YAML settings.
- **PipelineRun**: Logs execution status, run number, commit SHA, and phase logging.
- **Artifact**: Tracks build output versioning, Docker URL digests, and vulnerability scans.
