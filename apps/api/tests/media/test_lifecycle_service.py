"""Tests for lifecycle service."""

import pytest
from datetime import datetime
from unittest.mock import MagicMock
from uuid import UUID, uuid4

from app.media.application.lifecycle_service import (
    LifecycleService,
    Job,
    JobStatus,
    JobType,
    LifecyclePolicy,
)
from app.media.domain.lifecycle_exceptions import (
    ArchiveFailureError,
    JobExecutionError,
    LifecyclePolicyError,
    QueueProcessingError,
    ReconciliationError,
    RestoreFailureError,
)


class TestJob:
    """Tests for Job model."""

    def test_job_creation(self):
        """Test creating a job."""
        job = Job(
            id=uuid4(),
            type=JobType.IMAGE_PROCESSING,
            status=JobStatus.PENDING,
        )
        assert job.type == JobType.IMAGE_PROCESSING
        assert job.status == JobStatus.PENDING
        assert job.retry_count == 0

    def test_job_with_metadata(self):
        """Test creating a job with metadata."""
        job = Job(
            id=uuid4(),
            type=JobType.VIDEO_PROCESSING,
            status=JobStatus.RUNNING,
            asset_id=uuid4(),
            priority=5,
        )
        assert job.priority == 5
        assert job.asset_id is not None


class TestLifecyclePolicy:
    """Tests for LifecyclePolicy model."""

    def test_lifecycle_policy_creation(self):
        """Test creating a lifecycle policy."""
        policy = LifecyclePolicy(
            id=uuid4(),
            name="default",
            delete_after_days=30,
            archive_after_days=90,
        )
        assert policy.name == "default"
        assert policy.delete_after_days == 30
        assert policy.enabled is True


class TestLifecycleService:
    """Tests for LifecycleService."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock()

    @pytest.fixture
    def lifecycle_service(self, mock_asset_repo):
        """Create lifecycle service instance."""
        return LifecycleService(asset_repo=mock_asset_repo)

    @pytest.mark.asyncio
    async def test_enqueue_job(self, lifecycle_service):
        """Test enqueuing a job."""
        job = await lifecycle_service.enqueue_job(
            job_type=JobType.IMAGE_PROCESSING,
            asset_id=uuid4(),
        )
        assert job.type == JobType.IMAGE_PROCESSING
        assert job.status == JobStatus.PENDING

    @pytest.mark.asyncio
    async def test_get_job(self, lifecycle_service):
        """Test getting a job."""
        job = await lifecycle_service.enqueue_job(
            job_type=JobType.VIDEO_PROCESSING,
        )
        retrieved = await lifecycle_service.get_job(job.id)
        assert retrieved is not None
        assert retrieved.id == job.id

    @pytest.mark.asyncio
    async def test_get_jobs(self, lifecycle_service):
        """Test getting all jobs."""
        await lifecycle_service.enqueue_job(job_type=JobType.IMAGE_PROCESSING)
        await lifecycle_service.enqueue_job(job_type=JobType.VIDEO_PROCESSING)
        jobs = await lifecycle_service.get_jobs()
        assert len(jobs) == 2

    @pytest.mark.asyncio
    async def test_retry_job(self, lifecycle_service):
        """Test retrying a job."""
        job = await lifecycle_service.enqueue_job(job_type=JobType.CLEANUP)
        retried = await lifecycle_service.retry_job(job.id)
        assert retried.retry_count == 1
        assert retried.status == JobStatus.RETRYING

    @pytest.mark.asyncio
    async def test_retry_job_not_found(self, lifecycle_service):
        """Test retrying non-existent job raises error."""
        with pytest.raises(JobExecutionError):
            await lifecycle_service.retry_job(uuid4())

    @pytest.mark.asyncio
    async def test_cancel_job(self, lifecycle_service):
        """Test cancelling a job."""
        job = await lifecycle_service.enqueue_job(job_type=JobType.CLEANUP)
        result = await lifecycle_service.cancel_job(job.id)
        assert result is True
        assert job.status == JobStatus.CANCELLED

    @pytest.mark.asyncio
    async def test_create_lifecycle_policy(self, lifecycle_service):
        """Test creating a lifecycle policy."""
        policy = await lifecycle_service.create_lifecycle_policy(
            name="default",
            delete_after_days=30,
        )
        assert policy.name == "default"
        assert policy.delete_after_days == 30

    @pytest.mark.asyncio
    async def test_get_lifecycle_policies(self, lifecycle_service):
        """Test getting all lifecycle policies."""
        await lifecycle_service.create_lifecycle_policy(name="policy1")
        await lifecycle_service.create_lifecycle_policy(name="policy2")
        policies = await lifecycle_service.get_lifecycle_policies()
        assert len(policies) == 2

    @pytest.mark.asyncio
    async def test_archive_asset(self, lifecycle_service):
        """Test archiving an asset."""
        result = await lifecycle_service.archive_asset(uuid4())
        assert result is True

    @pytest.mark.asyncio
    async def test_restore_asset(self, lifecycle_service):
        """Test restoring an asset."""
        result = await lifecycle_service.restore_asset(uuid4())
        assert result is True

    @pytest.mark.asyncio
    async def test_purge_asset(self, lifecycle_service):
        """Test purging an asset."""
        result = await lifecycle_service.purge_asset(uuid4())
        assert result is True

    @pytest.mark.asyncio
    async def test_run_cleanup_job(self, lifecycle_service):
        """Test running cleanup job."""
        count = await lifecycle_service.run_cleanup_job()
        assert isinstance(count, int)

    @pytest.mark.asyncio
    async def test_run_reconciliation(self, lifecycle_service):
        """Test running reconciliation."""
        report = await lifecycle_service.run_reconciliation()
        assert "checked" in report

    @pytest.mark.asyncio
    async def test_get_queue_stats(self, lifecycle_service):
        """Test getting queue statistics."""
        await lifecycle_service.enqueue_job(job_type=JobType.CLEANUP)
        stats = await lifecycle_service.get_queue_stats()
        assert "pending" in stats


class TestLifecycleExceptions:
    """Tests for lifecycle exceptions."""

    def test_job_execution_error(self):
        """Test JobExecutionError message."""
        error = JobExecutionError("Test error")
        assert "Test error" in str(error)

    def test_archive_failure_error(self):
        """Test ArchiveFailureError message."""
        error = ArchiveFailureError("Test error")
        assert "Test error" in str(error)

    def test_restore_failure_error(self):
        """Test RestoreFailureError message."""
        error = RestoreFailureError("Test error")
        assert "Test error" in str(error)

    def test_lifecycle_policy_error(self):
        """Test LifecyclePolicyError message."""
        error = LifecyclePolicyError("Test error")
        assert "Test error" in str(error)

    def test_queue_processing_error(self):
        """Test QueueProcessingError message."""
        error = QueueProcessingError("Test error")
        assert "Test error" in str(error)

    def test_reconciliation_error(self):
        """Test ReconciliationError message."""
        error = ReconciliationError("Test error")
        assert "Test error" in str(error)