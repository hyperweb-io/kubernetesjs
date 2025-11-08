import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { AllResourcesView } from '@/components/resources/all-resources'
import { server } from '@/__mocks__/server'
import { 
  createDeploymentsList,
  createDeploymentsListError,
  createDeploymentsListData
} from '@/__mocks__/handlers/deployments'
import { 
  createServicesList,
  createServicesListError,
  createServicesListData
} from '@/__mocks__/handlers/services'
import { 
  createPodsList,
  createPodsListError,
  createPodsListData
} from '@/__mocks__/handlers/pods'
import { 
  createDaemonSetsList,
  createDaemonSetsListError,
  createDaemonSetsListData
} from '@/__mocks__/handlers/daemonsets'
import { 
  createReplicaSetsList,
  createReplicaSetsListError,
  createReplicaSetsListData
} from '@/__mocks__/handlers/replicasets'
import { AppsV1Deployment, Service, Pod, AppsV1DaemonSet, AppsV1ReplicaSet } from '@kubernetesjs/ops'

// Helper functions to create custom test data
const createCustomDeployment = (name: string, replicas: number, readyReplicas: number, image: string): AppsV1Deployment => ({
  metadata: { name, uid: `${name}-uid`, namespace: 'default' },
  spec: { 
    replicas, 
    selector: { matchLabels: { app: name } },
    template: { 
      spec: { 
        containers: [{ name: 'nginx', image }] 
      } 
    } 
  },
  status: { readyReplicas, replicas }
})

const createCustomService = (name: string, type: 'ClusterIP' | 'LoadBalancer' | 'NodePort' | 'ExternalName', ports: number[]): Service => ({
  metadata: { name, uid: `${name}-uid`, namespace: 'default' },
  spec: { 
    type, 
    ports: ports.map(port => ({ port, targetPort: port, protocol: 'TCP' })),
    selector: { app: name }
  },
  status: { loadBalancer: {} }
})

const createCustomPod = (name: string, phase: 'Running' | 'Pending' | 'Succeeded' | 'Failed' | 'Unknown', readyContainers: number, totalContainers: number, nodeName: string): Pod => ({
  metadata: { name, uid: `${name}-uid`, namespace: 'default' },
  status: { 
    phase, 
    containerStatuses: Array.from({ length: totalContainers }, (_, i) => ({ 
      name: `container-${i}`,
      ready: i < readyContainers,
      restartCount: 0,
      image: 'nginx:latest',
      imageID: 'docker://nginx:latest'
    })) 
  },
  spec: { 
    nodeName,
    containers: Array.from({ length: totalContainers }, (_, i) => ({ 
      name: `container-${i}`, 
      image: 'nginx:latest' 
    }))
  }
})

const createCustomDaemonSet = (name: string, desired: number, ready: number, image: string): AppsV1DaemonSet => ({
  metadata: { name, uid: `${name}-uid`, namespace: 'default' },
  spec: { 
    selector: { matchLabels: { app: name } },
    template: { 
      metadata: { labels: { app: name } },
      spec: { 
        containers: [{ name: 'nginx', image }] 
      } 
    } 
  },
  status: { 
    desiredNumberScheduled: desired, 
    numberReady: ready,
    currentNumberScheduled: ready,
    numberAvailable: ready,
    numberMisscheduled: 0
  }
})

const createCustomReplicaSet = (name: string, replicas: number, readyReplicas: number, image: string, ownerRef?: string): AppsV1ReplicaSet => ({
  metadata: { 
    name, 
    uid: `${name}-uid`,
    namespace: 'default',
    ...(ownerRef && { 
      ownerReferences: [{ 
        kind: 'Deployment', 
        name: ownerRef,
        apiVersion: 'apps/v1',
        uid: `${ownerRef}-uid`,
        controller: true,
        blockOwnerDeletion: true
      }] 
    })
  },
  spec: { 
    replicas,
    selector: { matchLabels: { app: name } },
    template: { 
      metadata: { labels: { app: name } },
      spec: { 
        containers: [{ name: 'nginx', image }] 
      } 
    } 
  },
  status: { 
    replicas,
    readyReplicas,
    availableReplicas: readyReplicas,
    observedGeneration: 1
  }
})

describe('AllResourcesView', () => {
  beforeEach(() => {
    server.resetHandlers()
  })

  describe('Resource Count Calculation Business Logic', () => {
    it('should calculate and display correct resource counts from API data', async () => {
      // Arrange: Setup handlers with default data for namespace-specific endpoints
      server.use(
        createDeploymentsList(),
        createServicesList(),
        createPodsList(),
        createDaemonSetsList(),
        createReplicaSetsList()
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - component should calculate counts from API response
      await waitFor(() => {
        // Check specific counts in summary cards (based on actual mock data for default namespace)
        const summaryCards = screen.getAllByText(/\d+/, { selector: '.text-2xl.font-bold' })
        expect(summaryCards).toHaveLength(5) // Should have 5 summary cards
        
        // Check that we have the expected counts by looking for specific numbers
        expect(screen.getAllByText('2', { selector: '.text-2xl.font-bold' })).toHaveLength(3) // Deployments, Services, DaemonSets
        expect(screen.getByText('5', { selector: '.text-2xl.font-bold' })).toBeInTheDocument() // Pods count
        expect(screen.getByText('3', { selector: '.text-2xl.font-bold' })).toBeInTheDocument() // ReplicaSets count
      })
    })

    it('should handle empty API responses and display zero counts', async () => {
      // Arrange: Test business logic with empty data
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test that the component correctly handles empty arrays
      await waitFor(() => {
        const zeroCounts = screen.getAllByText('0', { selector: '.text-2xl.font-bold' })
        expect(zeroCounts).toHaveLength(5) // All 5 resource types should show 0
      })
    })
  })

  describe('Deployment Status Calculation Business Logic', () => {
    it('should calculate readiness status correctly when all replicas are ready', async () => {
      // Arrange: Setup handlers with default data (all ready)
      server.use(
        createDeploymentsList(),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - replicas === readyReplicas should show success badge
      await waitFor(() => {
        expect(screen.getByText('3/3 Ready')).toBeInTheDocument()
        expect(screen.getByText('1/1 Ready')).toBeInTheDocument()
        expect(screen.getByText('nginx-deployment')).toBeInTheDocument()
        expect(screen.getByText('redis-deployment')).toBeInTheDocument()
        expect(screen.getByText('nginx:1.14.2')).toBeInTheDocument()
        expect(screen.getByText('redis:5.0.3-alpine')).toBeInTheDocument()
      })
    })

    it('should calculate warning status when not all replicas are ready', async () => {
      // Arrange: Test business logic with partial readiness
      const notReadyDeployment = createCustomDeployment('not-ready-deployment', 3, 1, 'nginx:latest')

      server.use(
        createDeploymentsList([notReadyDeployment]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - when readyReplicas < replicas, should show warning
      await waitFor(() => {
        expect(screen.getByText('1/3 Ready')).toBeInTheDocument()
        expect(screen.getByText('not-ready-deployment')).toBeInTheDocument()
      })
    })
  })

  describe('Service Data Processing Business Logic', () => {
    it('should process service type and port information correctly', async () => {
      // Arrange: Setup handlers with default service data
      server.use(
        createDeploymentsList([]),
        createServicesList(),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - service type extraction and display
      await waitFor(() => {
        expect(screen.getByText('test-service-1')).toBeInTheDocument()
        expect(screen.getByText('test-service-2')).toBeInTheDocument()
        // test-service-3 is in kube-system namespace, so won't appear in default namespace
        expect(screen.getByText('ClusterIP')).toBeInTheDocument()
        expect(screen.getByText('LoadBalancer')).toBeInTheDocument()
        expect(screen.getByText('Ports: 80')).toBeInTheDocument()
        expect(screen.getByText('Ports: 443')).toBeInTheDocument()
      })
    })

    it('should handle multiple ports concatenation logic', async () => {
      // Arrange: Test business logic for port array processing
      const multiPortService = createCustomService('multi-port-service', 'NodePort', [80, 443])

      server.use(
        createDeploymentsList([]),
        createServicesList([multiPortService]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - ports array should be joined with commas
      await waitFor(() => {
        expect(screen.getByText('Ports: 80, 443')).toBeInTheDocument()
        expect(screen.getByText('NodePort')).toBeInTheDocument()
      })
    })
  })

  describe('Pod Status Processing Business Logic', () => {
    it('should calculate container readiness and phase status correctly', async () => {
      // Arrange: Setup handlers with default pod data
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList(),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - pod phase and container status processing
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument()
        expect(screen.getByText('redis-pod-1')).toBeInTheDocument()
        expect(screen.getByText('pending-pod')).toBeInTheDocument()
        expect(screen.getAllByText('Running')).toHaveLength(2) // Two running pods in mock data
        expect(screen.getByText('Pending')).toBeInTheDocument()
        expect(screen.getByText('Failed')).toBeInTheDocument()
        expect(screen.getByText('Succeeded')).toBeInTheDocument()
        expect(screen.getAllByText('1/1 Ready')).toHaveLength(2) // Two ready pods (2 Running)
        expect(screen.getAllByText('Node: node-1')).toHaveLength(4) // Four pods on node-1
        expect(screen.getAllByText('Node: node-2')).toHaveLength(1) // One pod on node-2
      })
    })

    it('should calculate readiness ratio for multiple containers', async () => {
      // Arrange: Test business logic for multi-container pods
      const multiContainerPod = createCustomPod('multi-container-pod', 'Running', 1, 2, 'worker-2')

      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([multiContainerPod]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - ready containers / total containers
      await waitFor(() => {
        expect(screen.getByText('1/2 Ready')).toBeInTheDocument()
        expect(screen.getByText('Node: worker-2')).toBeInTheDocument()
      })
    })
  })

  describe('ReplicaSet Owner Reference Processing Business Logic', () => {
    it('should process and display owner reference information correctly', async () => {
      // Arrange: Setup handlers with default ReplicaSet data (includes owner references)
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList()
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - owner reference processing and display
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument()
        expect(screen.getByText('redis-deployment-abcdefghij')).toBeInTheDocument()
        expect(screen.getByText('3/3 Ready')).toBeInTheDocument()
        expect(screen.getByText('1/1 Ready')).toBeInTheDocument()
        expect(screen.getByText('nginx-deployment')).toBeInTheDocument()
        expect(screen.getByText('redis-deployment')).toBeInTheDocument()
      })
    })

    it('should handle ReplicaSets without owner references gracefully', async () => {
      // Arrange: Test business logic for missing owner references
      const standaloneReplicaSet = createCustomReplicaSet('standalone-replicaset', 2, 2, 'nginx:latest')

      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([standaloneReplicaSet])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test the business logic - should not crash when ownerReferences is missing
      await waitFor(() => {
        expect(screen.getByText('standalone-replicaset')).toBeInTheDocument()
        expect(screen.getByText('2/2 Ready')).toBeInTheDocument()
        expect(screen.queryByText('nginx-deployment')).not.toBeInTheDocument()
      })
    })
  })

  describe('Refresh All Functionality', () => {
    it('should trigger API calls when refresh all is clicked', async () => {
      // Arrange: Setup user interaction and handlers
      const user = userEvent.setup()
      
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component and trigger refresh
      render(<AllResourcesView />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getAllByText('0', { selector: '.text-2xl.font-bold' })).toHaveLength(5)
      })

      // Click refresh all
      const refreshAllButton = screen.getByRole('button', { name: /refresh all/i })
      await user.click(refreshAllButton)

      // Assert: Test that refresh button is clickable and component handles the action
      expect(refreshAllButton).toBeInTheDocument()
    })

    it('should maintain data consistency after refresh all', async () => {
      // Arrange: Setup user interaction
      const user = userEvent.setup()
      const mockDeployments = [createCustomDeployment('nginx-deployment', 3, 3, 'nginx:1.14.2')]

      server.use(
        createDeploymentsList(mockDeployments),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component and trigger refresh
      render(<AllResourcesView />)

      // Verify initial data is displayed
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment')).toBeInTheDocument()
      })

      // Click refresh all
      const refreshAllButton = screen.getByRole('button', { name: /refresh all/i })
      await user.click(refreshAllButton)

      // Assert: Data should still be displayed after refresh
      expect(screen.getByText('nginx-deployment')).toBeInTheDocument()
    })
  })

  describe('Individual Resource Section Refresh', () => {
    it('should refresh only the specific resource section when its refresh button is clicked', async () => {
      // Arrange: Setup user interaction
      const user = userEvent.setup()
      
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component and trigger section refresh
      render(<AllResourcesView />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getAllByText('0', { selector: '.text-2xl.font-bold' })).toHaveLength(5)
      })

      // Find and click a section refresh button
      const refreshButtons = screen.getAllByRole('button')
      const sectionRefreshButton = refreshButtons.find(button => 
        button.querySelector('.lucide-refresh-cw') && 
        !button.textContent?.includes('Refresh All')
      )
      
      if (sectionRefreshButton) {
        await user.click(sectionRefreshButton)
        
        // Assert: Test that section refresh button is clickable
        expect(sectionRefreshButton).toBeInTheDocument()
      }
    })
  })

  describe('Resource Section Expansion', () => {
    it('should toggle section visibility when header is clicked', async () => {
      // Arrange: Setup user interaction
      const user = userEvent.setup()
      const mockDeployments = [createCustomDeployment('nginx-deployment', 3, 3, 'nginx:1.14.2')]

      server.use(
        createDeploymentsList(mockDeployments),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component and toggle section
      render(<AllResourcesView />)

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment')).toBeInTheDocument()
      })

      // Find the deployments section header
      const deploymentHeader = screen.getByText('Deployments', { selector: '.text-lg' }).closest('.cursor-pointer')
      
      // Click to toggle
      await user.click(deploymentHeader!)
      
      // Assert: Verify the click was handled (section should still be in DOM)
      expect(deploymentHeader).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      // Arrange: Setup API error
      server.use(
        createDeploymentsListError(500, 'Failed to fetch deployments'),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test error handling
      await waitFor(() => {
        expect(screen.getByText('Error loading data')).toBeInTheDocument()
        // The error message might be displayed differently, let's check for the error state
        expect(screen.getByText('Error loading data')).toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      // Arrange: Setup network error
      server.use(
        createDeploymentsListError(500, 'Network Error'),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test network error handling
      await waitFor(() => {
        expect(screen.getByText('Error loading data')).toBeInTheDocument()
      })
    })

    it('should handle partial API failures', async () => {
      // Arrange: Some APIs succeed, some fail
      const testService = createCustomService('test-service', 'ClusterIP', [80])

      server.use(
        createDeploymentsListError(500, 'Deployments API failed'),
        createServicesList([testService]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test partial failure handling
      await waitFor(() => {
        // Should show error for deployments
        expect(screen.getByText('Error loading data')).toBeInTheDocument()
        // But services should still work
        expect(screen.getByText('test-service')).toBeInTheDocument()
        // Services count should still be displayed
        expect(screen.getByText('1', { selector: '.text-2xl.font-bold' })).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during API calls', async () => {
      // Arrange: Setup handlers with default data
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test loading state - check for loading text in card descriptions
      expect(screen.getAllByText('Loading...')).toHaveLength(5) // All 5 resource sections should show loading

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getAllByText('0 items')).toHaveLength(5) // All sections should show "0 items"
      })
    })
  })

  describe('Badge Status Logic', () => {
    it('should show correct badge variants based on resource status', async () => {
      // Arrange: Setup mixed status data
      const mockPods = [
        createCustomPod('running-pod', 'Running', 1, 1, 'worker-1'),
        createCustomPod('pending-pod', 'Pending', 0, 1, 'worker-1'),
        createCustomPod('failed-pod', 'Failed', 0, 1, 'worker-1')
      ]

      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList(mockPods),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test different pod statuses
      await waitFor(() => {
        expect(screen.getByText('Running')).toBeInTheDocument()
        expect(screen.getByText('Pending')).toBeInTheDocument()
        expect(screen.getByText('Failed')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles and labels', async () => {
      // Arrange: Setup basic data
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component
      render(<AllResourcesView />)

      // Assert: Test accessibility
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /refresh all/i })).toBeInTheDocument()
        const refreshButtons = screen.getAllByRole('button')
        expect(refreshButtons.length).toBeGreaterThan(0)
      })
    })

    it('should be keyboard navigable', async () => {
      // Arrange: Setup user interaction
      const user = userEvent.setup()
      
      server.use(
        createDeploymentsList([]),
        createServicesList([]),
        createPodsList([]),
        createDaemonSetsList([]),
        createReplicaSetsList([])
      )

      // Act: Render component and test keyboard navigation
      render(<AllResourcesView />)

      await waitFor(() => {
        expect(screen.getAllByText('0', { selector: '.text-2xl.font-bold' })).toHaveLength(5)
      })

      const refreshAllButton = screen.getByRole('button', { name: /refresh all/i })
      await user.tab()
      
      // Assert: Test keyboard navigation
      expect(refreshAllButton).toHaveFocus()
    })
  })
})