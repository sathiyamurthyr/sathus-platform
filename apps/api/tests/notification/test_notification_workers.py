"""Unit tests for Phase 3 Background Workers and Worker Manager."""

from uuid import uuid4

import pytest

from app.notification.workers.workers import EmailWorker, SmsWorker
from app.notification.workers.worker_manager import WorkerManager


@pytest.mark.asyncio
async def test_email_worker_lifecycle():
    """Test EmailWorker start, pause, resume, and status report."""
    worker = EmailWorker()
    assert worker.channel_name == "email"

    report = worker.get_status_report()
    assert report["worker_type"] == "email"
    assert report["status"] == "stopped"

    await worker.start()
    assert worker.get_status_report()["status"] == "active"

    await worker.pause()
    assert worker.get_status_report()["status"] == "paused"

    await worker.resume()
    assert worker.get_status_report()["status"] == "active"

    await worker.stop()
    assert worker.get_status_report()["status"] == "stopped"


@pytest.mark.asyncio
async def test_worker_manager_orchestration():
    """Test WorkerManager lifecycle operations."""
    manager = WorkerManager()
    manager.bootstrap_default_workers()

    statuses = manager.get_all_worker_statuses()
    assert len(statuses) >= 5

    await manager.start_all()
    statuses_active = manager.get_all_worker_statuses()
    assert len(statuses_active) >= 5
    assert all(s["status"] == "active" for s in statuses_active)

    await manager.pause_all()
    statuses_paused = manager.get_all_worker_statuses()
    assert all(s["status"] == "paused" for s in statuses_paused)

    await manager.resume_all()
    statuses_resumed = manager.get_all_worker_statuses()
    assert all(s["status"] == "active" for s in statuses_resumed)

    await manager.stop_all()
    statuses_stopped = manager.get_all_worker_statuses()
    assert all(s["status"] == "stopped" for s in statuses_stopped)
