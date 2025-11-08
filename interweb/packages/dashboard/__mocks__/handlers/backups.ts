import { http, HttpResponse } from "msw"
import { API_BASE } from "./common"

export interface BackupInfo {
  name: string
  namespace: string
  status: 'Running' | 'Pending' | 'Failed' | 'Completed'
  ready: string
  restarts: number
  age: string
  nodeName: string
  createdAt?: string
  size?: string
  method?: string
}

export const createBackupsListData = (): BackupInfo[] => {
  return [
    {
      name: 'backup-1',
      namespace: 'postgres-db',
      status: 'Running',
      ready: '1/1',
      restarts: 0,
      age: '1d',
      nodeName: 'node-1',
      createdAt: '2024-01-01T10:00:00Z',
      size: '10Gi',
      method: 'pg_dump'
    },
    {
      name: 'backup-2',
      namespace: 'postgres-db',
      status: 'Pending',
      ready: '0/1',
      restarts: 0,
      age: '2h',
      nodeName: 'node-2',
      createdAt: '2024-01-01T12:00:00Z',
      size: '5Gi',
      method: 'pg_basebackup'
    },
    {
      name: 'backup-3',
      namespace: 'postgres-db',
      status: 'Failed',
      ready: '0/1',
      restarts: 3,
      age: '3h',
      nodeName: 'node-1',
      createdAt: '2024-01-01T09:00:00Z',
      size: '0Gi',
      method: 'pg_dump'
    }
  ]
}

export const createBackupsList = (backups: BackupInfo[] = createBackupsListData()) => {
  return http.get(`${API_BASE}/api/databases/:ns/:name/backups`, () => {
    return HttpResponse.json({ backups })
  })
}

export const createBackupsListError = (status: number = 500, message: string = 'Internal Server Error') => {
  return http.get(`${API_BASE}/api/databases/:ns/:name/backups`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createBackupsListNetworkError = () => {
  return http.get(`${API_BASE}/api/databases/:ns/:name/backups`, () => {
    return HttpResponse.error()
  })
}

export const createCreateBackup = (ns: string, name: string) => {
  return http.post(`${API_BASE}/api/databases/${ns}/${name}/backups`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ 
      success: true, 
      message: `Backup created successfully for database ${name}`,
      backup: {
        name: `backup-${Date.now()}`,
        namespace: ns,
        status: 'Pending',
        ready: '0/1',
        restarts: 0,
        age: '0s',
        nodeName: 'node-1',
        createdAt: new Date().toISOString(),
        method: body.method || 'pg_dump'
      }
    })
  })
}

export const createCreateBackupError = (ns: string, name: string, status: number = 500, message: string = 'Backup creation failed') => {
  return http.post(`${API_BASE}/api/databases/${ns}/${name}/backups`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createDeleteBackup = (ns: string, name: string, backupName: string) => {
  return http.delete(`${API_BASE}/api/databases/${ns}/${name}/backups/${backupName}`, () => {
    return HttpResponse.json({ 
      success: true, 
      message: `Backup ${backupName} deleted successfully` 
    })
  })
}

export const createDeleteBackupError = (ns: string, name: string, backupName: string, status: number = 500, message: string = 'Backup deletion failed') => {
  return http.delete(`${API_BASE}/api/databases/${ns}/${name}/backups/${backupName}`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}

export const createBackupLogs = (ns: string, name: string, backupName: string) => {
  return http.get(`${API_BASE}/api/databases/${ns}/${name}/backups/${backupName}/logs`, () => {
    return HttpResponse.json({ 
      logs: `Backup logs for ${backupName}\nStarting backup...\nBackup completed successfully.`
    })
  })
}

export const createBackupLogsError = (ns: string, name: string, backupName: string, status: number = 500, message: string = 'Failed to fetch backup logs') => {
  return http.get(`${API_BASE}/api/databases/${ns}/${name}/backups/${backupName}/logs`, () => {
    return HttpResponse.json(
      { error: message },
      { status }
    )
  })
}
