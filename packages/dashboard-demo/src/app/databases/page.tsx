'use client';

import { useDatabaseStatus } from '@/hooks/use-database-status';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function DatabasesPage() {
  // For now default to the standard ns/name; later we can add list + picker
  const [ns, setNs] = useState('postgres-db');
  const [name, setName] = useState('postgres-cluster');
  const { data: status, isLoading, error, refetch } = useDatabaseStatus(ns, name) as any;
  const qc = useQueryClient();
  const [methodChoice, setMethodChoice] = useState<'auto'|'barmanObjectStore'|'volumeSnapshot'>('auto');

  // Create DB form state (required fields)
  const [showCreate, setShowCreate] = useState(false);
  const [instances, setInstances] = useState<number>(1);
  const [storage, setStorage] = useState<string>('1Gi');
  const [storageClass, setStorageClass] = useState<string>('');
  const [appUsername, setAppUsername] = useState<string>('appuser');
  const [appPassword, setAppPassword] = useState<string>('appuser123!');
  const [superuserPassword, setSuperuserPassword] = useState<string>('postgres123!');
  const [enablePooler, setEnablePooler] = useState<boolean>(true);
  const [poolerName, setPoolerName] = useState<string>('postgres-pooler');
  const [poolerInstances, setPoolerInstances] = useState<number>(1);

  const createDb = useMutation({
    mutationFn: async () => {
      const r = await fetch(`/api/databases/${ns}/${name}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances,
          storage,
          storageClass: storageClass || undefined,
          appUsername,
          appPassword,
          superuserPassword,
          enablePooler,
          poolerName: enablePooler ? poolerName : undefined,
          poolerInstances: enablePooler ? poolerInstances : undefined,
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: async () => {
      setShowCreate(false);
      await Promise.all([
        refetch?.(),
        qc.invalidateQueries({ queryKey: ['db-status', ns, name] }),
      ]);
    },
  });

  const backups = useQuery({
    queryKey: ['db-backups', ns, name],
    queryFn: async () => {
      const r = await fetch(`/api/databases/${ns}/${name}/backups`, { cache: 'no-store' });
      if (!r.ok) throw new Error('Failed to list backups');
      return r.json();
    },
    enabled: !!status,
    refetchInterval: 20000,
  });

  const createBackup = useMutation({
    mutationFn: async (method?: string) => {
      const r = await fetch(`/api/databases/${ns}/${name}/backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'onDemand', method }),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['db-backups', ns, name] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Databases</h1>
          <p className="text-gray-600">CloudNativePG clusters and status</p>
        </div>
        <div className="flex gap-2">
          <input className="border rounded px-2 py-1" placeholder="Namespace" value={ns} onChange={(e) => setNs(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Cluster name" value={name} onChange={(e) => setName(e.target.value)} />
          <button
            className="border rounded px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowCreate((v) => !v)}
          >
            {showCreate ? 'Close' : 'Create DB'}
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h2 className="text-lg font-semibold">Create PostgreSQL (CloudNativePG)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">Instances</span>
              <input type="number" min={1} max={5} value={instances} onChange={(e) => setInstances(parseInt(e.target.value || '1', 10))} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">Storage</span>
              <input value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="10Gi" className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-gray-600">Storage Class (optional)</span>
              <input value={storageClass} onChange={(e) => setStorageClass(e.target.value)} placeholder="standard" className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">App Username</span>
              <input value={appUsername} onChange={(e) => setAppUsername(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-600">App Password</span>
              <input type="password" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-gray-600">Superuser Password</span>
              <input type="password" value={superuserPassword} onChange={(e) => setSuperuserPassword(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={enablePooler} onChange={(e) => setEnablePooler(e.target.checked)} />
              <span className="text-gray-700">Enable PgBouncer Pooler</span>
            </label>
            {enablePooler && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Pooler Name</span>
                  <input value={poolerName} onChange={(e) => setPoolerName(e.target.value)} className="border rounded px-2 py-1" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-gray-600">Pooler Instances</span>
                  <input type="number" min={1} max={5} value={poolerInstances} onChange={(e) => setPoolerInstances(parseInt(e.target.value || '1', 10))} className="border rounded px-2 py-1" />
                </label>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="border rounded px-3 py-1 bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowCreate(false)}
              disabled={createDb.isPending}
            >Cancel</button>
            <button
              className="border rounded px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => createDb.mutate()}
              disabled={createDb.isPending}
            >{createDb.isPending ? 'Creating…' : 'Create'}</button>
            {createDb.error && (
              <span className="text-red-600 text-sm">{String((createDb.error as any)?.message || createDb.error)}</span>
            )}
          </div>
        </div>
      )}

      {isLoading && <div className="text-gray-600">Loading status...</div>}
      {(!isLoading && (status as any)?.notFound) && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-lg font-semibold mb-1">No database found</h2>
          <p className="text-gray-600 text-sm">Use the Create DB button to deploy a PostgreSQL cluster in “{ns}” named “{name}”.</p>
        </div>
      )}
      {!isLoading && !status && error && (
        <div className="text-red-600">Failed to load: {(error as Error).message}</div>
      )}

      {status && !(status as any).notFound && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cluster Summary */}
          <div className="lg:col-span-2 rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold mb-3">Cluster Summary</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div><dt className="text-gray-500">Name</dt><dd className="font-medium">{status.name}</dd></div>
              <div><dt className="text-gray-500">PostgreSQL Image</dt><dd className="font-medium">{status.image || 'unknown'}</dd></div>
              <div><dt className="text-gray-500">Primary instance</dt><dd className="font-medium">{status.primary || 'unknown'}</dd></div>
              <div><dt className="text-gray-500">Primary start time</dt><dd className="font-medium">{status.primaryStartTime || 'unknown'}</dd></div>
              <div><dt className="text-gray-500">Status</dt><dd className="font-medium">{status.phase || 'unknown'}</dd></div>
              <div><dt className="text-gray-500">Instances</dt><dd className="font-medium">{status.instances}</dd></div>
              <div><dt className="text-gray-500">Ready instances</dt><dd className="font-medium">{status.readyInstances}</dd></div>
              <div><dt className="text-gray-500">System ID</dt><dd className="font-medium">{status.systemID || 'unknown'}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Services</dt><dd className="font-medium break-all">rw: {status.services.rw} | ro: {status.services.ro} {status.services.poolerRw ? `| pooler-rw: ${status.services.poolerRw}` : ''}</dd></div>
            </dl>
          </div>

          {/* Backup/Streaming */}
          <div className="rounded-lg border bg-white p-4 space-y-3">
            <h2 className="text-lg font-semibold">Protection</h2>
            <div>
              <div className="text-gray-500 text-sm">Continuous Backup</div>
              <div className="font-medium text-sm">{status.backups.configured ? `Scheduled: ${status.backups.scheduledCount}, last: ${status.backups.lastBackupTime || 'n/a'}` : 'Not configured'}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Streaming Replication</div>
              <div className="font-medium text-sm">{status.streaming.configured ? `${status.streaming.replicas} replica(s)` : 'Not configured'}</div>
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={methodChoice}
                  onChange={(e) => setMethodChoice(e.target.value as any)}
                >
                  <option value="auto">Auto</option>
                  <option value="barmanObjectStore" disabled={backups.isFetched && backups.data?.methodConfigured !== 'barmanObjectStore'}>
                    barmanObjectStore
                  </option>
                  <option value="volumeSnapshot" disabled={backups.isFetched && !backups.data?.snapshotSupported}>
                    volumeSnapshot
                  </option>
                </select>
                <button
                  className="px-3 py-1 rounded bg-primary text-white disabled:opacity-50"
                  disabled={
                    createBackup.isPending ||
                    (backups.isFetched && (
                      (methodChoice === 'auto' && !(backups.data?.configured || backups.data?.snapshotSupported)) ||
                      (methodChoice === 'barmanObjectStore' && backups.data?.methodConfigured !== 'barmanObjectStore') ||
                      (methodChoice === 'volumeSnapshot' && !backups.data?.snapshotSupported)
                    ))
                  }
                  onClick={() => {
                    const methodParam = methodChoice === 'auto' ? undefined : methodChoice;
                    createBackup.mutate(methodParam);
                  }}
                  title={(() => {
                    if (!backups.isFetched) return 'Create on-demand backup';
                    if (methodChoice === 'auto' && !(backups.data?.configured || backups.data?.snapshotSupported)) return 'Configure backups (barman) or install VolumeSnapshot CRDs';
                    if (methodChoice === 'barmanObjectStore' && backups.data?.methodConfigured !== 'barmanObjectStore') return 'Cluster is not configured for barman backups';
                    if (methodChoice === 'volumeSnapshot' && !backups.data?.snapshotSupported) return 'VolumeSnapshot CRDs/CSI not available';
                    return 'Create on-demand backup';
                  })()}
                >
                  {createBackup.isPending ? 'Creating…' : 'Create Backup'}
                </button>
              </div>
            </div>
          </div>

          {/* Backups table moved earlier for prominence */}
          <div className="lg:col-span-3 rounded-lg border bg-white p-4 order-last lg:order-none">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-3">Backups</h2>
              {backups.isFetching && <span className="text-xs text-gray-500">Refreshing…</span>}
            </div>
            {backups.isLoading && <div className="text-gray-600">Loading backups…</div>}
            {backups.error && <div className="text-red-600">Failed to load backups</div>}
            {backups.data && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1 pr-4">Name</th>
                      <th className="py-1 pr-4">Method</th>
                      <th className="py-1 pr-4">Phase</th>
                      <th className="py-1 pr-4">Started</th>
                      <th className="py-1 pr-4">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(backups.data.backups || []).map((b: any) => (
                      <tr key={b.name} className="border-t">
                        <td className="py-1 pr-4 font-medium">{b.name}</td>
                        <td className="py-1 pr-4">{b.method || '-'}</td>
                        <td className="py-1 pr-4">{b.phase || '-'}</td>
                        <td className="py-1 pr-4">{b.startedAt || '-'}</td>
                        <td className="py-1 pr-4">{b.completedAt || '-'}</td>
                      </tr>
                    ))}
                    {(!backups.data.backups || backups.data.backups.length === 0) && (
                      <tr><td className="py-2 text-gray-500" colSpan={5}>No backups</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Instances table */}
          <div className="lg:col-span-3 rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold mb-3">Instances status</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-1 pr-4">Name</th>
                    <th className="py-1 pr-4">Role</th>
                    <th className="py-1 pr-4">Status</th>
                    <th className="py-1 pr-4">Ready</th>
                    <th className="py-1 pr-4">Restarts</th>
                    <th className="py-1 pr-4">QoS</th>
                    <th className="py-1 pr-4">Node</th>
                    <th className="py-1 pr-4">Start Time</th>
                  </tr>
                </thead>
                <tbody>
                  {status.instancesTable.map((row) => (
                    <tr key={row.name} className="border-t">
                      <td className="py-1 pr-4 font-medium">{row.name}</td>
                      <td className="py-1 pr-4">{row.role}</td>
                      <td className="py-1 pr-4">
                        <span className={row.status === 'OK' ? 'text-green-700' : 'text-red-700'}>{row.status}</span>
                      </td>
                      <td className="py-1 pr-4">{row.ready || '-'}</td>
                      <td className="py-1 pr-4">{row.restarts ?? '-'}</td>
                      <td className="py-1 pr-4">{row.qosClass || '-'}</td>
                      <td className="py-1 pr-4">{row.node || '-'}</td>
                      <td className="py-1 pr-4">{row.startTime || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Backups table */}
          <div className="lg:col-span-3 rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-3">Backups</h2>
              {backups.isFetching && <span className="text-xs text-gray-500">Refreshing…</span>}
            </div>
            {backups.isLoading && <div className="text-gray-600">Loading backups…</div>}
            {backups.error && <div className="text-red-600">Failed to load backups</div>}
            {backups.data && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1 pr-4">Name</th>
                      <th className="py-1 pr-4">Method</th>
                      <th className="py-1 pr-4">Phase</th>
                      <th className="py-1 pr-4">Started</th>
                      <th className="py-1 pr-4">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(backups.data.backups || []).map((b: any) => (
                      <tr key={b.name} className="border-t">
                        <td className="py-1 pr-4 font-medium">{b.name}</td>
                        <td className="py-1 pr-4">{b.method || '-'}</td>
                        <td className="py-1 pr-4">{b.phase || '-'}</td>
                        <td className="py-1 pr-4">{b.startedAt || '-'}</td>
                        <td className="py-1 pr-4">{b.completedAt || '-'}</td>
                      </tr>
                    ))}
                    {(!backups.data.backups || backups.data.backups.length === 0) && (
                      <tr><td className="py-2 text-gray-500" colSpan={5}>No backups</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
