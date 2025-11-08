import { useMutation, useQuery } from '@tanstack/react-query';

export interface CreateDatabaseParams {
  ns: string;
  name: string;
  instances: number;
  storage: string;
  storageClass: string;
  appUsername: string;
  appPassword: string;
  superuserPassword: string;
  enablePooler: boolean;
  poolerName: string;
  poolerInstances: number;
}


export function useCreateDatabases() {
  return useMutation<any, Error, CreateDatabaseParams>({
    mutationFn: async (params) => {
      const { ns, name, instances, storage, storageClass, appUsername, appPassword, superuserPassword, enablePooler, poolerName, poolerInstances } = params;
      
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
    }
  });
}

export function useQueryBackups(ns: string, name: string){
  return useQuery({
    queryKey: ['backups', ns, name],
    queryFn: async () => {
      const r = await fetch(`/api/databases/${ns}/${name}/backups`, { cache: 'no-store' });
      if (!r.ok) throw new Error('Failed to list backups');
      return r.json();
    },
  });
}

export interface CreateBackupParams {
  ns: string;
  name: string;
  method?: string;
}

export function useCreateBackup(){
  return useMutation({
    mutationFn: async (params: CreateBackupParams) => {
      const { ns, name, method } = params;
      const r = await fetch(`/api/databases/${ns}/${name}/backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, type: 'onDemand' }),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
  });
}