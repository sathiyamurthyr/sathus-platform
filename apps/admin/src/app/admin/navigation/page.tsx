import { NavigationWorkspace } from '@/features/navigation/workspace/NavigationWorkspace';

export default function NavigationPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Navigation & Site Builder</h1>
        <p className="text-muted-foreground">Manage navigation trees, menus, and site structure across all Sathus platforms.</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <NavigationWorkspace />
      </div>
    </div>
  );
}
