import { Suspense } from 'react';
import { WorkspaceSettingsView } from '@/features/workspace/components/WorkspaceSettingsView';

export default function AppProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading profile...</div>}>
      <WorkspaceSettingsView />
    </Suspense>
  );
}
