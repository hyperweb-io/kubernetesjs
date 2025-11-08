import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"

export interface DatabaseInfo {
  name: string
  namespace: string
  status: 'running' | 'stopped' | 'creating' | 'error' | 'deleting'
  version?: string
  size?: string
  replicas?: number
  createdAt?: string
  description?: string
}

export const createDatabasesListData = (): DatabaseInfo[] => {
  return [
    {
      name: 'postgres-main',
      namespace: 'default',
      status: 'running',
      version: '15.3',
      size: '10Gi',
      replicas: 1,
      createdAt: '2024-01-01T10:00:00Z',
      description: 'Main PostgreSQL database'
    },
    {
      name: 'postgres-test',
      namespace: 'default',
      status: 'running',
      version: '15.3',
      size: '5Gi',
      replicas: 1,
      createdAt: '2024-01-02T10:00:00Z',
      description: 'Test PostgreSQL database'
    },
    {
      name: 'postgres-dev',
      namespace: 'development',
      status: 'creating',
      version: '15.3',
      size: '2Gi',
      replicas: 1,
      createdAt: '2024-01-03T10:00:00Z',
      description: 'Development PostgreSQL database'
    },
    {
      name: 'postgres-backup',
      namespace: 'default',
      status: 'stopped',
      version: '14.9',
      size: '20Gi',
      replicas: 0,
      createdAt: '2024-01-04T10:00:00Z',
      description: 'Backup PostgreSQL database'
    },
    {
      name: 'postgres-failed',
      namespace: 'default',
      status: 'error',
      version: '15.3',
      size: '1Gi',
      replicas: 0,
      createdAt: '2024-01-05T10:00:00Z',
      description: 'Failed PostgreSQL database'
    }
  ]
}

export const createDatabasesList = (databases: DatabaseInfo[] = createDatabasesListData()) => {
  return http.get('/api/databases', () => {
    return HttpResponse.json(databases)
  })
}

export const createDatabasesListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/databases`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createDatabasesListNetworkError = () => {
  return http.get(`${API_BASE}/api/databases`, () => {
    return HttpResponse.error()
  })
}

export const createCreateDatabase = (databaseName: string, namespace: string = 'default') => {
  return http.post(`${API_BASE}/api/databases`, ({ request }) => {
    return HttpResponse.json({ 
      success: true, 
      message: `Database ${databaseName} created successfully in namespace ${namespace}`,
      database: {
        name: databaseName,
        namespace,
        status: 'creating',
        version: '15.3',
        size: '10Gi',
        replicas: 1,
        createdAt: new Date().toISOString(),
        description: `Database ${databaseName}`
      }
    })
  })
}

export const createCreateDatabaseError = (status: number = 500, message: string = 'Database creation failed') => {
  return http.post(`${API_BASE}/api/databases`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createDeleteDatabase = (databaseName: string, namespace: string = 'default') => {
  return http.delete(`${API_BASE}/api/databases/${namespace}/${databaseName}`, () => {
    return HttpResponse.json({ 
      success: true, 
      message: `Database ${databaseName} deleted successfully from namespace ${namespace}` 
    })
  })
}

export const createDeleteDatabaseError = (databaseName: string, namespace: string = 'default', status: number = 500, message: string = 'Database deletion failed') => {
  return http.delete(`${API_BASE}/api/databases/${namespace}/${databaseName}`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createStartDatabase = (databaseName: string, namespace: string = 'default') => {
  return http.post(`${API_BASE}/api/databases/${namespace}/${databaseName}/start`, () => {
    return HttpResponse.json({ 
      success: true, 
      message: `Database ${databaseName} started successfully` 
    })
  })
}

export const createStopDatabase = (databaseName: string, namespace: string = 'default') => {
  return http.post(`${API_BASE}/api/databases/${namespace}/${databaseName}/stop`, () => {
    return HttpResponse.json({ 
      success: true, 
      message: `Database ${databaseName} stopped successfully` 
    })
  })
}

export const createScaleDatabase = (databaseName: string, namespace: string = 'default', replicas: number) => {
  return http.post(`${API_BASE}/api/databases/${namespace}/${databaseName}/scale`, ({ request }) => {
    return HttpResponse.json({ 
      success: true, 
      message: `Database ${databaseName} scaled to ${replicas} replicas`,
      replicas
    })
  })
}

export const createCreateDatabaseSlow = (databaseName: string, namespace: string = 'default', delay: number = 2000) => {
  return http.post(`${API_BASE}/api/databases`, async () => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return HttpResponse.json({ 
      success: true, 
      message: `Database ${databaseName} created successfully in namespace ${namespace}`,
      database: {
        name: databaseName,
        namespace,
        status: 'creating',
        version: '15.3',
        size: '10Gi',
        replicas: 1,
        createdAt: new Date().toISOString(),
        description: `Database ${databaseName}`
      }
    })
  })
}

// Database status handlers
export interface DatabaseStatusSummary {
  name: string;
  namespace: string;
  cluster: string;
  image?: string;
  phase?: string;
  primary?: string;
  primaryStartTime?: string;
  instances: number;
  readyInstances: number;
  systemID?: string;
  services: { rw: string; ro: string; poolerRw?: string };
  backups: { configured: boolean; scheduledCount: number; lastBackupTime?: string };
  streaming: { configured: boolean; replicas: number };
  instancesTable: Array<{
    name: string;
    role: 'Primary' | 'Replica' | 'Unknown';
    status: 'OK' | 'NotReady' | 'Unknown';
    qosClass?: string;
    node?: string;
    startTime?: string;
    ready?: string;
    restarts?: number;
  }>;
}

export const createDatabaseStatusData = (): DatabaseStatusSummary => {
  return {
    name: 'postgres-cluster',
    namespace: 'default',
    cluster: 'main',
    image: 'postgres:15',
    phase: 'Running',
    primary: 'postgres-cluster-0',
    primaryStartTime: '2023-06-01T12:00:00Z',
    instances: 3,
    readyInstances: 3,
    systemID: '12345',
    services: {
      rw: 'postgres-cluster-rw',
      ro: 'postgres-cluster-ro',
      poolerRw: 'postgres-cluster-pooler-rw'
    },
    backups: {
      configured: true,
      scheduledCount: 2,
      lastBackupTime: '2023-06-01T11:00:00Z'
    },
    streaming: {
      configured: true,
      replicas: 2
    },
    instancesTable: [
      {
        name: 'postgres-cluster-0',
        role: 'Primary',
        status: 'OK',
        qosClass: 'Guaranteed',
        node: 'node-1',
        startTime: '2023-06-01T12:00:00Z',
        ready: '1/1',
        restarts: 0
      },
      {
        name: 'postgres-cluster-1',
        role: 'Replica',
        status: 'OK',
        qosClass: 'Guaranteed',
        node: 'node-2',
        startTime: '2023-06-01T12:01:00Z',
        ready: '1/1',
        restarts: 0
      },
      {
        name: 'postgres-cluster-2',
        role: 'Replica',
        status: 'NotReady',
        qosClass: 'Guaranteed',
        node: 'node-3',
        startTime: '2023-06-01T12:02:00Z',
        ready: '0/1',
        restarts: 1
      }
    ]
  }
}

export const createDatabaseStatus = (status: DatabaseStatusSummary = createDatabaseStatusData()) => {
  return http.get('/api/databases/:namespace/:name/status', () => {
    return HttpResponse.json(status)
  })
}

export const createDatabaseStatusError = (status: number = 404, message: string = 'Database not found') => {
  return http.get('/api/databases/:namespace/:name/status', () => {
    return HttpResponse.json({ error: message }, { status })
  })
}

export const createDatabaseStatusNetworkError = () => {
  return http.get('/api/databases/:namespace/:name/status', () => {
    return HttpResponse.error()
  })
}

// Backup handlers
export interface BackupInfo {
  name: string
  timestamp: string
  size?: string
  status: 'completed' | 'failed' | 'in-progress'
  type: 'manual' | 'scheduled'
}

export const createBackupsListData = (): BackupInfo[] => {
  return [
    {
      name: 'backup-2024-01-01-00-00-00',
      timestamp: '2024-01-01T00:00:00Z',
      size: '2.5GB',
      status: 'completed',
      type: 'scheduled'
    },
    {
      name: 'backup-2024-01-02-00-00-00',
      timestamp: '2024-01-02T00:00:00Z',
      size: '2.6GB',
      status: 'completed',
      type: 'scheduled'
    },
    {
      name: 'manual-backup-2024-01-03-12-00-00',
      timestamp: '2024-01-03T12:00:00Z',
      size: '2.7GB',
      status: 'completed',
      type: 'manual'
    }
  ]
}

export const createBackupsList = (backups: BackupInfo[] = createBackupsListData()) => {
  return http.get('/api/databases/:namespace/:name/backups', () => {
    return HttpResponse.json(backups)
  })
}

export const createBackupsListError = (status: number = 500, message: string = 'Failed to fetch backups') => {
  return http.get('/api/databases/:namespace/:name/backups', () => {
    return HttpResponse.json({ error: message }, { status })
  })
}

export const createCreateBackup = (namespace: string, name: string, method: string = 'manual') => {
  return http.post('/api/databases/:namespace/:name/backups', () => {
    return HttpResponse.json({
      success: true,
      message: `Backup created successfully for ${name} in ${namespace}`,
      backup: {
        name: `backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'in-progress',
        type: method
      }
    })
  })
}

export const createCreateBackupError = (status: number = 500, message: string = 'Failed to create backup') => {
  return http.post('/api/databases/:namespace/:name/backups', () => {
    return HttpResponse.json({ error: message }, { status })
  })
}
