# Central Audit Logs Platform (Story 15.9)

Immutable audit trail engine for Sathus Cloud Platform.

## Features
- **Immutable Stream**: Hash-signed (`sha256:...`) event log across 10 categories (`authentication`, `security`, `user_activity`, `config_change`, `billing`, `api`, `workflow`, `ai`, `search`, `admin_action`).
- **SIEM Log Export**: JSON & CSV export compatible with Splunk, Datadog, AWS CloudTrail, and Azure Sentinel.
- **Log Retention Policies**: Retention policy engine supporting 90-day, 1-year, and 7-year legal holds.
