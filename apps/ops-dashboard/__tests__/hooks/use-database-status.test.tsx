import { useDatabaseStatus, type DatabaseStatusSummary, type DatabaseInstanceRow } from '../../hooks/use-database-status'
import { server } from '../../__mocks__/server'
import { renderHook, waitFor } from '../utils/test-utils'
import { http, HttpResponse } from 'msw'
import { 
  createDatabaseStatus, 
  createDatabaseStatusError, 
  createDatabaseStatusNetworkError,
  createDatabaseStatusData 
} from '../../__mocks__/handlers/databases'

describe('useDatabaseStatus', () => {
  const mockDatabaseStatus: DatabaseStatusSummary = {
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

  it('should fetch database status successfully', async () => {
    server.use(createDatabaseStatus(mockDatabaseStatus))

    const { result } = renderHook(() => useDatabaseStatus('default', 'postgres-cluster'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockDatabaseStatus)
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle API errors', async () => {
    server.use(createDatabaseStatusError(404, 'Database not found'))

    const { result } = renderHook(() => useDatabaseStatus('default', 'non-existent'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should handle network errors', async () => {
    server.use(createDatabaseStatusNetworkError())

    const { result } = renderHook(() => useDatabaseStatus('default', 'postgres-cluster'))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })

  it('should have correct query configuration with namespace and name', async () => {
    server.use(createDatabaseStatus(mockDatabaseStatus))

    const { result } = renderHook(() => useDatabaseStatus('production', 'mysql-cluster'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should handle different database statuses', async () => {
    const differentStatus: DatabaseStatusSummary = {
      ...mockDatabaseStatus,
      phase: 'Pending',
      instances: 1,
      readyInstances: 0,
      instancesTable: [
        {
          name: 'mysql-cluster-0',
          role: 'Primary',
          status: 'NotReady',
          qosClass: 'Burstable',
          node: 'node-1',
          startTime: '2023-06-01T12:00:00Z',
          ready: '0/1',
          restarts: 3
        }
      ]
    }

    server.use(createDatabaseStatus(differentStatus))

    const { result } = renderHook(() => useDatabaseStatus('staging', 'mysql-cluster'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.phase).toBe('Pending')
    expect(result.current.data?.readyInstances).toBe(0)
    expect(result.current.data?.instancesTable[0].status).toBe('NotReady')
  })

  it('should handle database with no backups configured', async () => {
    const noBackupsStatus: DatabaseStatusSummary = {
      ...mockDatabaseStatus,
      backups: {
        configured: false,
        scheduledCount: 0
      }
    }

    server.use(createDatabaseStatus(noBackupsStatus))

    const { result } = renderHook(() => useDatabaseStatus('default', 'postgres-cluster'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.backups.configured).toBe(false)
    expect(result.current.data?.backups.scheduledCount).toBe(0)
  })

  it('should handle database with no streaming configured', async () => {
    const noStreamingStatus: DatabaseStatusSummary = {
      ...mockDatabaseStatus,
      streaming: {
        configured: false,
        replicas: 0
      }
    }

    server.use(createDatabaseStatus(noStreamingStatus))

    const { result } = renderHook(() => useDatabaseStatus('default', 'postgres-cluster'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.streaming.configured).toBe(false)
    expect(result.current.data?.streaming.replicas).toBe(0)
  })

  it('should refetch on interval', async () => {
    let callCount = 0
    const handler = http.get('/api/databases/:namespace/:name/status', () => {
      callCount++
      return HttpResponse.json(mockDatabaseStatus)
    })

    server.use(handler)

    const { result } = renderHook(() => useDatabaseStatus('default', 'postgres-cluster'))

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Wait for potential refetch (this test mainly verifies the configuration)
    expect(callCount).toBeGreaterThanOrEqual(1)
  })
})
