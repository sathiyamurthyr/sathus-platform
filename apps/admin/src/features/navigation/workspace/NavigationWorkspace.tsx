'use client';

import * as React from 'react';
import { Plus, History, Eye, Link as LinkIcon } from 'lucide-react';
import { useWorkspaceState, useTrees, useMenus, useMenuDetail, useCreateNode, useDeleteNode, useMoveNode, useCopyNode, useArchiveMenu, useRestoreMenu, useCloneMenu, useCreateVersion, usePublishMenu, useSchedulePublish, useRollbackMenu, useUpdateNode, useVersions, useHistory, useBrokenRoutes, usePreview } from './hooks/use-navigation-workspace';
import { TreeEditor, NodeEditor, VersionHistory, PublishDialog, PreviewPanel } from './components';
import type { NavigationNode } from './navigation-types';

export function NavigationWorkspace() {
  const ws = useWorkspaceState();
  const treesQuery = useTrees();
  const menusQuery = useMenus(ws.selectedTreeId ?? '');
  const detailQuery = useMenuDetail(ws.selectedMenuId ?? '');
  const versionsQuery = useVersions(ws.selectedMenuId ?? '');
  const historyQuery = useHistory(ws.selectedTreeId ?? '', ws.selectedMenuId ?? undefined);
  const brokenQuery = useBrokenRoutes(ws.selectedMenuId ?? '');
  const [previewVersionId, setPreviewVersionId] = React.useState<string | null>(null);
  const previewQuery = usePreview(ws.selectedMenuId ?? '', previewVersionId ?? versionsQuery.data?.[0]?.id ?? '');

  const createNode = useCreateNode();
  const deleteNode = useDeleteNode();
  const moveNode = useMoveNode();
  const copyNode = useCopyNode();
  const archiveMenu = useArchiveMenu();
  const restoreMenu = useRestoreMenu();
  const cloneMenu = useCloneMenu();
  const createVersion = useCreateVersion();
  const publishMenu = usePublishMenu();
  const schedulePublish = useSchedulePublish();
  const rollbackMenu = useRollbackMenu();
  const updateNode = useUpdateNode();

  const [publishOpen, setPublishOpen] = React.useState(false);
  const [showVersionForm, setShowVersionForm] = React.useState(false);
  const [versionLabel, setVersionLabel] = React.useState('');

  const selectedNode = React.useMemo(() => {
    if (!detailQuery.data?.nodes) return null;
    const find = (nodes: import('@/types/navigation-data').NavigationNode[]): NavigationNode | null => {
      for (const n of nodes) {
        if (n.id === ws.selectedNodeId) return n;
        const found = find(n.children);
        if (found) return found;
      }
      return null;
    };
    return find(detailQuery.data.nodes);
  }, [detailQuery.data?.nodes, ws.selectedNodeId]);

  const handleCreateNode = async (parentId?: string) => {
    if (!ws.selectedMenuId) return;
    await createNode.mutateAsync({
      menuId: ws.selectedMenuId,
      parentId,
      displayName: 'New Node',
      itemType: 'Link',
      targetType: 'Internal',
      referenceKind: 'None',
    });
  };

  const handleDeleteNode = async () => {
    if (!ws.selectedMenuId || !ws.selectedNodeId) return;
    await deleteNode.mutateAsync({ menuId: ws.selectedMenuId, nodeId: ws.selectedNodeId });
    ws.setSelectedNode(null);
  };

  const tabs = [
    { id: 'tree', label: 'Tree' },
    { id: 'versions', label: 'Versions' },
    { id: 'preview', label: 'Preview' },
    { id: 'routes', label: 'Routes' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'localization', label: 'Localization' },
    { id: 'history', label: 'History' },
  ] as const;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <select
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            value={ws.selectedTreeId ?? ''}
            onChange={(e) => { ws.setSelectedTree(e.target.value || null); ws.setSelectedMenu(null); }}
          >
            <option value="">Select Tree</option>
            {treesQuery.data?.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.platform})</option>
            ))}
          </select>

          {ws.selectedTreeId && (
            <select
              className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
              value={ws.selectedMenuId ?? ''}
              onChange={(e) => { ws.setSelectedMenu(e.target.value || null); }}
            >
              <option value="">Select Menu</option>
              {menusQuery.data?.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.menuType})</option>
              ))}
            </select>
          )}
        </div>

        {ws.selectedMenuId && (
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-md p-1.5 text-xs hover:bg-muted" onClick={() => setShowVersionForm(true)} aria-label="Create version">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" className="rounded-md p-1.5 text-xs hover:bg-muted" onClick={() => setPublishOpen(true)} aria-label="Publish">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 border-b border-border px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`border-b-2 px-3 py-2 text-xs transition-colors ${
              ws.activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => ws.setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {ws.activeTab === 'tree' && (
          <>
            <div className="w-64 shrink-0 border-r border-border">
              {detailQuery.data?.nodes ? (
                <TreeEditor
                  nodes={detailQuery.data.nodes}
                  selectedNodeId={ws.selectedNodeId}
                  onSelectNode={ws.setSelectedNode}
                  onCreateNode={handleCreateNode}
                  onMoveNode={(nodeId, newParentId, newOrder) => moveNode.mutate({ menuId: ws.selectedMenuId!, nodeId, newParentId, newOrder })}
                  onDeleteNode={handleDeleteNode}
                  onCopyNode={(nodeId) => copyNode.mutate({ menuId: ws.selectedMenuId!, nodeId })}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">Select a menu to edit its navigation tree.</div>
              )}
            </div>
            <div className="flex-1">
              <NodeEditor
                node={selectedNode}
                onSave={(data) => {
                  if (!ws.selectedMenuId || !ws.selectedNodeId) return;
                  updateNode.mutate({ menuId: ws.selectedMenuId, nodeId: ws.selectedNodeId, ...data });
                }}
                onDelete={handleDeleteNode}
                onClose={() => ws.setSelectedNode(null)}
              />
            </div>
          </>
        )}

        {ws.activeTab === 'versions' && (
          <div className="flex-1 overflow-y-auto p-4">
            {versionsQuery.data && versionsQuery.data.length > 0 ? (
              <VersionHistory versions={versionsQuery.data} onRestore={(id) => rollbackMenu.mutate({ menuId: ws.selectedMenuId!, versionId: id })} onPreview={(id) => { setPreviewVersionId(id); ws.setActiveTab('preview'); }} currentVersionId={detailQuery.data?.publishedVersionId} />
            ) : (
              <p className="text-sm text-muted-foreground">No versions yet. Create one to get started.</p>
            )}
          </div>
        )}

        {ws.activeTab === 'preview' && (
          <div className="flex-1">
            <PreviewPanel items={previewQuery.data ?? []} isLoading={previewQuery.isLoading} />
          </div>
        )}

        {ws.activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-4">
            {historyQuery.data && historyQuery.data.length > 0 ? (
              <ul className="space-y-2">
                {historyQuery.data.slice(0, 50).map((h) => (
                  <li key={h.id} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{h.operation}</span>
                      <span className="text-xs text-muted-foreground">{new Date(h.occurredAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{h.payload}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No history entries.</p>
            )}
          </div>
        )}

        {ws.activeTab === 'routes' && (
          <div className="flex-1 overflow-y-auto p-4">
            {brokenQuery.data && brokenQuery.data.length > 0 ? (
              <div className="space-y-2">
                {brokenQuery.data.map((r) => (
                  <div key={r.id} className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <p className="font-medium text-destructive">{r.routePath}</p>
                    <p className="text-xs text-muted-foreground">{r.referenceKind} - {r.targetUrl ?? 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No broken routes.</p>
            )}
          </div>
        )}

        {ws.activeTab === 'permissions' && (
          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode && selectedNode.permissions.length > 0 ? (
              <ul className="space-y-2">
                {selectedNode.permissions.map((p, i) => (
                  <li key={i} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.permission}</span>
                      <span className="text-xs text-muted-foreground">{p.effect}</span>
                    </div>
                    {p.role && <p className="text-xs text-muted-foreground">Role: {p.role}</p>}
                    <p className="text-xs text-muted-foreground">Mode: {p.requirement}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Select a node to view permissions. Use the Node editor to set them.</p>
            )}
          </div>
        )}

        {ws.activeTab === 'localization' && (
          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode && selectedNode.localizations.length > 0 ? (
              <ul className="space-y-2">
                {selectedNode.localizations.map((l, i) => (
                  <li key={i} className="rounded-md border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{l.languageCode}</span>
                      {l.isFallback && <span className="text-xs text-muted-foreground">Fallback</span>}
                    </div>
                    <p>{l.displayName}</p>
                    {l.routePath && <p className="text-xs text-muted-foreground">{l.routePath}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Select a node to view localizations.</p>
            )}
          </div>
        )}
      </div>

      {publishOpen && (
        <PublishDialog
          open={publishOpen}
          versions={versionsQuery.data ?? []}
          currentVersionId={detailQuery.data?.publishedVersionId}
          onClose={() => setPublishOpen(false)}
          onPublish={(versionId) => { publishMenu.mutate({ menuId: ws.selectedMenuId!, versionId }); setPublishOpen(false); }}
          onSchedule={(versionId, date) => { schedulePublish.mutate({ menuId: ws.selectedMenuId!, versionId, scheduledAt: date }); setPublishOpen(false); }}
          publishing={publishMenu.isPending}
        />
      )}

      {showVersionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal>
          <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Create Version</h3>
            <input
              className="mb-4 h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              placeholder="Version label"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-md border px-3 py-1.5 text-sm" onClick={() => setShowVersionForm(false)}>Cancel</button>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                onClick={() => {
                  if (!versionLabel.trim() || !ws.selectedMenuId) return;
                  createVersion.mutate({ menuId: ws.selectedMenuId, label: versionLabel.trim() });
                  setVersionLabel('');
                  setShowVersionForm(false);
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
