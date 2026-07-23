"""Infrastructure as Code (IaC) application service."""

import uuid
import json
from uuid import UUID
from typing import Sequence, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.cloud_platform.infrastructure.repositories import CloudPlatformRepository
from app.cloud_platform.infrastructure.models import (
    IaCTemplate,
    IaCState,
    InfrastructureChange,
    IaCProvider,
    IaCChangeAction,
    IaCChangeStatus,
)


class IaCService:
    """Service handling Infrastructure as Code configurations, state locks, drift reports, and deployment workflows."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = CloudPlatformRepository(session)

    async def register_template(
        self, tenant_id: UUID, name: str, content: str, provider: IaCProvider = IaCProvider.TERRAFORM, variables_schema: dict | None = None, description: str | None = None
    ) -> IaCTemplate:
        """Register a new IaC template."""
        return await self.repository.create_iac_template(
            tenant_id=tenant_id,
            name=name,
            content=content,
            provider=provider,
            variables_schema=variables_schema,
            description=description,
        )

    async def list_templates(self, tenant_id: UUID) -> Sequence[IaCTemplate]:
        return await self.repository.list_iac_templates(tenant_id)

    async def lock_state(self, template_id: UUID, environment: str, lock_id: str) -> bool:
        """Lock the state to prevent concurrent modifications."""
        state = await self.repository.get_iac_state(template_id, environment)
        if not state:
            state = await self.repository.create_or_update_iac_state(template_id, environment, {})
        
        if state.is_locked:
            return False
            
        state.is_locked = True
        state.locked_by = lock_id
        await self.session.flush()
        return True

    async def unlock_state(self, template_id: UUID, environment: str, lock_id: str) -> bool:
        """Unlock the state file."""
        state = await self.repository.get_iac_state(template_id, environment)
        if not state or not state.is_locked or state.locked_by != lock_id:
            return False
            
        state.is_locked = False
        state.locked_by = None
        await self.session.flush()
        return True

    async def plan_changes(
        self, template_id: UUID, environment: str, applied_by: UUID | None = None
    ) -> InfrastructureChange:
        """Runs infrastructure plan simulation, checking configuration and generating diff."""
        template = await self.repository.get_iac_template(template_id)
        if not template:
            raise ValueError("IaC Template not found")

        # Simulate resource parsing from template content
        # For simplicity, extract resource names or lines
        resources = []
        for line in template.content.split("\n"):
            line = line.strip()
            if line.startswith("resource ") or line.startswith("resource"):
                resources.append(line)

        add_count = len(resources) if resources else 3
        change_count = 1
        destroy_count = 0

        summary = {
            "add": add_count,
            "change": change_count,
            "destroy": destroy_count,
            "resources": resources or ["aws_s3_bucket.data_warehouse", "aws_iam_role.ecs_execution", "aws_security_group.db_sg"]
        }

        # Check for drift
        drift_report = await self.detect_drift(template_id, environment)

        change = await self.repository.create_infrastructure_change(
            template_id=template_id,
            environment=environment,
            action=IaCChangeAction.PLAN,
            change_summary=summary,
            applied_by=applied_by,
        )
        change.drift_detected = drift_report["drift_detected"]
        change.drift_report = drift_report
        change.status = IaCChangeStatus.PENDING

        await self.session.flush()
        return change

    async def apply_changes(
        self, change_id: UUID, applied_by: UUID | None = None
    ) -> InfrastructureChange:
        """Executes the planned changes, updating the environment state file."""
        result = await self.session.execute(
            select(InfrastructureChange).where(InfrastructureChange.id == change_id)
        )
        change = result.scalar_one_or_none()
        if not change:
            raise ValueError("Infrastructure Change Plan not found")

        # Acquire lock
        lock_id = f"apply-{change_id}"
        locked = await self.lock_state(change.template_id, change.environment, lock_id)
        if not locked:
            raise RuntimeError("IaC State is locked. Concurrency error.")

        try:
            # Simulate applying state resources
            current_state = await self.repository.get_iac_state(change.template_id, change.environment)
            state_data = current_state.state_data if (current_state and current_state.state_data is not None) else {}
            
            # Update resources in state data
            resources = change.change_summary.get("resources", [])
            for res in resources:
                state_data[res] = {
                    "id": f"id-{res.replace('.', '-')}",
                    "status": "active",
                    "managed_by": "odyssey-iac",
                    "last_updated": datetime.now(timezone.utc).isoformat()
                }

            await self.repository.create_or_update_iac_state(
                template_id=change.template_id,
                environment=change.environment,
                state_data=state_data
            )

            change.action = IaCChangeAction.APPLY
            change.status = IaCChangeStatus.APPLIED
            change.applied_by = applied_by
            change.applied_at = datetime.now(timezone.utc)

            await self.session.flush()
        finally:
            # Unlock
            await self.unlock_state(change.template_id, change.environment, lock_id)

        return change

    async def detect_drift(self, template_id: UUID, environment: str) -> Dict[str, Any]:
        """Simulates configuration comparison vs active state to check for resource drifts."""
        state = await self.repository.get_iac_state(template_id, environment)
        if not state or not state.state_data:
            return {
                "drift_detected": False,
                "drifted_resources": [],
                "checked_at": datetime.now(timezone.utc).isoformat()
            }

        # Simulate static checks
        # Let's say, 10% chance drift is detected if there is state data
        drifted = (hash(template_id) + len(environment)) % 10 == 0
        drifted_resources = []
        if drifted:
            keys = list(state.state_data.keys())
            if keys:
                drifted_resources.append({
                    "resource": keys[0],
                    "attribute": "tags",
                    "expected": {"Environment": environment},
                    "actual": None,
                    "reason": "Resource tags deleted out-of-band"
                })

        return {
            "drift_detected": len(drifted_resources) > 0,
            "drifted_resources": drifted_resources,
            "checked_at": datetime.now(timezone.utc).isoformat()
        }
from sqlalchemy import select
