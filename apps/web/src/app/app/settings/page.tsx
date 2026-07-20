import { Suspense } from 'react';
import { WorkspaceSettingsView } from '@/features/workspace/components/WorkspaceSettingsView';

export default function AppSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading settings...</div>}>
      <WorkspaceSettingsView />
    </Suspense>
  );
}
