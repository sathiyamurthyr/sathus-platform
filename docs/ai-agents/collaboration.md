# Multi-Agent Collaboration Engine (Story 27.4)

Hierarchical and peer-to-peer agent team framework supporting Coordinator, Worker, and Reviewer agents, task delegation, consensus strategies, and real-time Event Bus messaging.

## Architecture
- **Agent Teams**: Groupings of specialized agents with designated roles (`coordinator`, `worker`, `reviewer`).
- **Consensus Strategies**: `majority_vote`, `coordinator_override`, and `unanimous`.
- **Event Bus Integration**: Real-time cross-agent message routing and execution state synchronization.

## APIs
- `GET /api/v1/agents/collaboration/teams` — List active agent teams and members.
- `POST /api/v1/agents/messages/broadcast` — Broadcast agent-to-agent task delegation or context message.
