'use client';

import { useState, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NamespaceSwitcher } from '@/components/namespace-switcher';
import { ContextSwitcher } from '@/components/context-switcher';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { InfraHeader } from '@/components/headers/infra-header';
import { SmartObjectsHeader } from '@/components/headers/smart-objects-header';
import { useKubernetes } from '../k8s/context';
import {
  Package,
  Server,
  Shield,
  Settings,
  Key,
  Copy,
  Activity,
  Home,
  Menu,
  PanelLeftClose,
  FileCode2,
  Layers,
  Calendar,
  Clock,
  Gauge,
  ShieldCheck,
  Star,
  Cpu,
  Globe,
  Network,
  Link,
  HardDrive,
  Database,
  Paperclip,
  Bot,
  UserCheck,
  Users,
  Zap,
  BarChart,
  Grid3x3,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Heart,
  Code,
  MessageSquare,
  CloudIcon,
  FunctionSquare,
  Play,
  Code2,
} from 'lucide-react';

// Smart Objects navigation
const smartObjectsNavigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/d' },

  // Cloud section
  { id: 'cloud-header', label: 'Cloud', isHeader: true, section: 'cloud' },
  { id: 'databases', label: 'Databases', icon: Database, href: '/d/databases', section: 'cloud' },
  { id: 'functions', label: 'Cloud Functions', icon: Zap, href: '/d/functions', section: 'cloud' },

  // Blockchain section
  { id: 'blockchain-header', label: 'Blockchain', isHeader: true, section: 'blockchain' },
  { id: 'chains', label: 'Blockchains', icon: Link, href: '/d/chains', section: 'blockchain' },
  { id: 'contracts', label: 'Contracts', icon: FileCode2, href: '/d/contracts', section: 'blockchain' },
  { id: 'playground', label: 'Playground', icon: Code2, href: '/d/playground', section: 'blockchain' },
  { id: 'relayers', label: 'Relayers', icon: Globe, href: '/d/relayers', section: 'blockchain' },
  { id: 'registry', label: 'Registry', icon: Database, href: '/d/registry', section: 'blockchain' },

  // Settings
  { id: 'settings', label: 'Settings', icon: Settings, href: '/d/settings' },
];

// Infrastructure (Kubernetes) navigation
const infraNavigation = [
  // Top items (no section)
  { id: 'overview', label: 'Overview', icon: Home, href: '/i' },
  { id: 'all', label: 'All Resources', icon: Grid3x3, href: '/i/all' },
  { id: 'templates', label: 'Templates', icon: FileCode2, href: '/i/templates' },

  // Workloads
  { id: 'workloads-header', label: 'Workloads', isHeader: true, section: 'workloads' },
  { id: 'deployments', label: 'Deployments', icon: Package, href: '/i/deployments', section: 'workloads' },
  { id: 'replicasets', label: 'ReplicaSets', icon: Copy, href: '/i/replicasets', section: 'workloads' },
  { id: 'statefulsets', label: 'StatefulSets', icon: Layers, href: '/i/statefulsets', section: 'workloads' },
  { id: 'daemonsets', label: 'DaemonSets', icon: Shield, href: '/i/daemonsets', section: 'workloads' },
  { id: 'pods', label: 'Pods', icon: Activity, href: '/i/pods', section: 'workloads' },
  { id: 'jobs', label: 'Jobs', icon: Zap, href: '/i/jobs', section: 'workloads' },
  { id: 'cronjobs', label: 'CronJobs', icon: Calendar, href: '/i/cronjobs', section: 'workloads' },

  // Config & Storage
  { id: 'config-header', label: 'Config & Storage', isHeader: true, section: 'config' },
  { id: 'configmaps', label: 'ConfigMaps', icon: Settings, href: '/i/configmaps', section: 'config' },
  { id: 'secrets', label: 'Secrets', icon: Key, href: '/i/secrets', section: 'config' },
  { id: 'pvcs', label: 'Persistent Volume Claims', icon: HardDrive, href: '/i/pvcs', section: 'config' },
  { id: 'pvs', label: 'Persistent Volumes', icon: Database, href: '/i/pvs', section: 'config' },
  { id: 'storageclasses', label: 'Storage Classes', icon: Database, href: '/i/storageclasses', section: 'config' },
  {
    id: 'volumeattachments',
    label: 'Volume Attachments',
    icon: Paperclip,
    href: '/i/volumeattachments',
    section: 'config',
  },

  // Network
  { id: 'network-header', label: 'Network', isHeader: true, section: 'network' },
  { id: 'services', label: 'Services', icon: Server, href: '/i/services', section: 'network' },
  { id: 'ingresses', label: 'Ingresses', icon: Globe, href: '/i/ingresses', section: 'network' },
  { id: 'networkpolicies', label: 'Network Policies', icon: Shield, href: '/i/networkpolicies', section: 'network' },
  { id: 'endpoints', label: 'Endpoints', icon: Network, href: '/i/endpoints', section: 'network' },
  { id: 'endpointslices', label: 'Endpoint Slices', icon: Network, href: '/i/endpointslices', section: 'network' },

  // Access Control
  { id: 'rbac-header', label: 'Access Control', isHeader: true, section: 'rbac' },
  { id: 'serviceaccounts', label: 'Service Accounts', icon: Bot, href: '/i/serviceaccounts', section: 'rbac' },
  { id: 'roles', label: 'Roles', icon: UserCheck, href: '/i/roles', section: 'rbac' },
  { id: 'rolebindings', label: 'Role Bindings', icon: Users, href: '/i/rolebindings', section: 'rbac' },

  // Cluster
  { id: 'cluster-header', label: 'Cluster', isHeader: true, section: 'cluster' },
  { id: 'resourcequotas', label: 'Resource Quotas', icon: Gauge, href: '/i/resourcequotas', section: 'cluster' },
  { id: 'hpas', label: 'Horizontal Pod Autoscalers', icon: BarChart, href: '/i/hpas', section: 'cluster' },
  { id: 'pdbs', label: 'Pod Disruption Budgets', icon: ShieldCheck, href: '/i/pdbs', section: 'cluster' },
  { id: 'priorityclasses', label: 'Priority Classes', icon: Star, href: '/i/priorityclasses', section: 'cluster' },
  { id: 'runtimeclasses', label: 'Runtime Classes', icon: Cpu, href: '/i/runtimeclasses', section: 'cluster' },
  { id: 'events', label: 'Events', icon: Clock, href: '/i/events', section: 'cluster' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  onChatToggle: () => void;
  chatVisible: boolean;
  chatLayoutMode: 'floating' | 'snapped';
  chatWidth: number;
  mode: 'smart-objects' | 'infra';
}

export function DashboardLayout({
  children,
  onChatToggle,
  chatVisible,
  chatLayoutMode,
  chatWidth,
  mode,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['workloads', 'config', 'network', 'rbac', 'cluster', 'cloud', 'blockchain'])
  );
  const pathname = usePathname();
  const { config } = useKubernetes();

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedSidebarOpen = localStorage.getItem('hyperweb-sidebar-open');
    const savedSidebarCompact = localStorage.getItem('hyperweb-sidebar-compact');
    const savedExpandedSections = localStorage.getItem('hyperweb-expanded-sections');

    if (savedSidebarOpen !== null) {
      setSidebarOpen(JSON.parse(savedSidebarOpen));
    }
    if (savedSidebarCompact !== null) {
      setSidebarCompact(JSON.parse(savedSidebarCompact));
    }
    if (savedExpandedSections !== null) {
      setExpandedSections(new Set(JSON.parse(savedExpandedSections)));
    }
  }, []);

  // Choose navigation based on context
  const navigationItems = mode === 'smart-objects' ? smartObjectsNavigation : infraNavigation;

  // Robust toggle function to prevent race conditions
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      const newValue = !prev;
      localStorage.setItem('hyperweb-sidebar-open', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  // Toggle compact sidebar mode
  const toggleSidebarCompact = useCallback(() => {
    setSidebarCompact((prev) => {
      const newValue = !prev;
      localStorage.setItem('hyperweb-sidebar-compact', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  // Find active section based on pathname
  const activeSection = navigationItems.find((item) => !item.isHeader && item.href === pathname)?.label || 'Overview';

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
    localStorage.setItem('hyperweb-expanded-sections', JSON.stringify(Array.from(newExpanded)));
  };

  // Calculate if we need to adjust layout for snapped chat
  const isSnappedAndOpen = chatVisible && chatLayoutMode === 'snapped';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? (sidebarCompact ? 'w-16' : 'w-64') : 'w-0'
        } transition-all duration-300 overflow-hidden bg-card border-r flex flex-col h-screen`}
      >
        <div className={`p-4 flex w-full items-center justify-center relative`}>
          {sidebarCompact ? (
            // Compact mode: logo + expand button
            <div className="flex flex-col items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 139 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M30.4517 169.905V72.2202L54.0205 55.5219V106.034L84.4722 84.7439V0L0 58.4441V191.196L30.4517 169.905ZM107.624 50.0945V147.78L84.0551 164.478V113.966L53.6034 135.256V220L138.076 161.556V28.8042L107.624 50.0945Z"
                  fill="url(#paint0_linear_compact)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_compact"
                    x1="69.0378"
                    y1="0"
                    x2="69.0378"
                    y2="220"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3ED2FF" />
                    <stop offset="1" stopColor="#337EFF" />
                  </linearGradient>
                </defs>
              </svg>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebarCompact}
                className="w-6 h-6 p-0 opacity-60 hover:opacity-100"
                title="Expand sidebar"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            // Full logo
            <svg xmlns="http://www.w3.org/2000/svg" width={172} height={54} fill="none" className="text-foreground">
              <path
                fill="currentColor"
                d="M111.602 45.092c0-.578.118-1.09.355-1.536a2.654 2.654 0 0 1 2.371-1.41c.376 0 .745.084 1.107.251.369.16.661.376.877.648v-2.779h1.201v7.73h-1.201v-.868a2.218 2.218 0 0 1-.814.69 2.485 2.485 0 0 1-1.181.271c-.501 0-.961-.125-1.378-.376a2.792 2.792 0 0 1-.982-1.065 3.345 3.345 0 0 1-.355-1.556Zm4.71.02c0-.396-.083-.74-.25-1.033a1.678 1.678 0 0 0-1.494-.898 1.67 1.67 0 0 0-.856.23 1.68 1.68 0 0 0-.648.657c-.16.286-.24.627-.24 1.024s.08.745.24 1.044c.167.3.383.53.648.69a1.716 1.716 0 0 0 1.712 0c.265-.154.477-.377.638-.669.167-.3.25-.647.25-1.044Zm2.368-.02c0-.578.119-1.09.355-1.536a2.654 2.654 0 0 1 2.361-1.41c.452 0 .846.09 1.18.272.341.174.613.393.815.658v-.836h1.201v5.755h-1.201v-.856a2.365 2.365 0 0 1-.825.679 2.546 2.546 0 0 1-1.191.271c-.494 0-.947-.125-1.358-.376a2.792 2.792 0 0 1-.982-1.065 3.357 3.357 0 0 1-.355-1.556Zm4.711.02a2.05 2.05 0 0 0-.251-1.033 1.69 1.69 0 0 0-.637-.669 1.682 1.682 0 0 0-.857-.23 1.68 1.68 0 0 0-.856.23c-.265.146-.48.366-.648.658-.16.286-.24.627-.24 1.024s.08.745.24 1.044c.168.3.383.53.648.69a1.719 1.719 0 0 0 1.713 0 1.69 1.69 0 0 0 .637-.669c.167-.3.251-.647.251-1.044Zm4.853 2.977c-.452 0-.859-.08-1.222-.24a2.21 2.21 0 0 1-.846-.668 1.698 1.698 0 0 1-.334-.95h1.233a.86.86 0 0 0 .344.615c.216.16.484.24.805.24.334 0 .591-.062.772-.187.188-.133.282-.3.282-.502 0-.216-.104-.376-.313-.48-.202-.105-.526-.22-.971-.345a9.377 9.377 0 0 1-1.055-.345 1.89 1.89 0 0 1-.71-.511c-.195-.23-.293-.533-.293-.909 0-.306.091-.585.272-.836.181-.257.438-.459.773-.605a2.93 2.93 0 0 1 1.169-.22c.655 0 1.181.167 1.578.502.403.327.619.776.647 1.347h-1.191a.844.844 0 0 0-.313-.616c-.188-.153-.442-.23-.762-.23-.314 0-.554.06-.721.178a.55.55 0 0 0-.251.47.51.51 0 0 0 .167.386c.112.105.248.188.408.25.16.056.397.13.71.22a6.84 6.84 0 0 1 1.024.345c.271.111.504.278.699.501.195.223.296.519.303.888 0 .327-.09.62-.271.877-.181.258-.439.46-.773.606-.327.146-.714.22-1.16.22Zm6.467-5.943c.439 0 .829.094 1.17.282.348.188.62.467.815.836.202.369.303.815.303 1.337v3.394h-1.181v-3.217c0-.515-.128-.908-.386-1.18-.258-.278-.609-.418-1.055-.418-.445 0-.801.14-1.065.418-.258.272-.387.665-.387 1.18v3.217h-1.19v-7.728h1.19v2.642c.202-.244.456-.432.763-.564a2.6 2.6 0 0 1 1.023-.199Zm4.997.95c.202-.278.477-.504.825-.678a2.56 2.56 0 0 1 1.18-.272c.509 0 .968.122 1.379.366.411.244.735.592.971 1.044.237.446.355.958.355 1.536 0 .578-.118 1.096-.355 1.556a2.685 2.685 0 0 1-.981 1.065c-.411.25-.867.376-1.369.376a2.64 2.64 0 0 1-1.19-.26 2.293 2.293 0 0 1-.815-.67v.836h-1.191v-7.728h1.191v2.83Zm3.499 1.996c0-.397-.084-.738-.251-1.024a1.595 1.595 0 0 0-.647-.658 1.716 1.716 0 0 0-1.713 0 1.758 1.758 0 0 0-.648.669c-.16.292-.24.637-.24 1.034s.08.745.24 1.044c.167.293.383.515.648.669a1.716 1.716 0 0 0 1.713 0c.271-.16.487-.39.647-.69.167-.3.251-.647.251-1.044Zm4.885 2.997a2.983 2.983 0 0 1-1.473-.365 2.717 2.717 0 0 1-1.034-1.045c-.25-.452-.376-.974-.376-1.566 0-.585.129-1.104.387-1.557.257-.452.609-.8 1.055-1.044a3.057 3.057 0 0 1 1.493-.366c.55 0 1.048.122 1.494.366a2.68 2.68 0 0 1 1.055 1.044c.257.453.386.972.386 1.557 0 .584-.132 1.103-.397 1.556a2.768 2.768 0 0 1-1.086 1.055 3.122 3.122 0 0 1-1.504.365Zm0-1.034c.306 0 .592-.073.856-.22a1.65 1.65 0 0 0 .658-.657c.168-.292.251-.648.251-1.065 0-.418-.08-.77-.24-1.055a1.617 1.617 0 0 0-.637-.658 1.744 1.744 0 0 0-.857-.22c-.306 0-.591.074-.856.22a1.566 1.566 0 0 0-.616.658c-.153.285-.23.637-.23 1.055 0 .62.157 1.1.47 1.44.32.335.721.502 1.201.502Zm3.767-1.963c0-.578.119-1.09.355-1.536a2.654 2.654 0 0 1 2.361-1.41c.452 0 .846.09 1.18.272.341.174.613.393.815.658v-.836h1.201v5.755h-1.201v-.856a2.365 2.365 0 0 1-.825.679 2.546 2.546 0 0 1-1.191.271c-.494 0-.947-.125-1.358-.376a2.792 2.792 0 0 1-.982-1.065 3.357 3.357 0 0 1-.355-1.556Zm4.711.02a2.05 2.05 0 0 0-.251-1.033 1.69 1.69 0 0 0-.637-.669 1.682 1.682 0 0 0-.857-.23 1.68 1.68 0 0 0-.856.23c-.265.146-.48.366-.648.658-.16.286-.24.627-.24 1.024s.08.745.24 1.044c.168.3.383.53.648.69a1.719 1.719 0 0 0 1.713 0 1.69 1.69 0 0 0 .637-.669c.167-.3.251-.647.251-1.044Zm3.955-2.036c.174-.293.404-.519.69-.679.292-.167.637-.25 1.034-.25v1.232h-.303c-.467 0-.822.118-1.066.355-.236.237-.355.648-.355 1.232v3.03h-1.19V42.24h1.19v.836Zm2.421 2.016c0-.578.119-1.09.355-1.536a2.654 2.654 0 0 1 2.371-1.41c.376 0 .745.084 1.107.251.369.16.662.376.878.648v-2.779h1.201v7.73h-1.201v-.868a2.222 2.222 0 0 1-.815.69 2.481 2.481 0 0 1-1.18.271 2.63 2.63 0 0 1-1.379-.376 2.792 2.792 0 0 1-.982-1.065 3.357 3.357 0 0 1-.355-1.556Zm4.711.02a2.05 2.05 0 0 0-.251-1.033 1.69 1.69 0 0 0-.637-.669 1.682 1.682 0 0 0-.857-.23 1.68 1.68 0 0 0-.856.23 1.68 1.68 0 0 0-.648.658c-.16.286-.24.627-.24 1.024s.08.745.24 1.044c.167.3.383.53.648.69a1.716 1.716 0 0 0 1.713 0 1.69 1.69 0 0 0 .637-.669c.167-.3.251-.647.251-1.044Z"
              />
              <path
                fill="url(#a)"
                fillRule="evenodd"
                d="M7.41 41.348V17.575l5.736-4.063v12.292l7.411-5.18V0L0 14.223v32.306l7.41-5.181ZM26.192 12.19v23.772l-5.736 4.064V27.734l-7.41 5.182v20.623l20.557-14.223V7.01l-7.41 5.18Z"
                clipRule="evenodd"
              />
              <path
                fill="currentColor"
                d="M61.754 18.716v17.01h-3.411V28.49h-7.287v7.238h-3.412v-17.01h3.412v6.994h7.287v-6.995h3.411Zm16.274 3.51L69.67 42.112h-3.632l2.925-6.727-5.41-13.16h3.826l3.485 9.432 3.533-9.431h3.631Zm5.251 1.95c.44-.618 1.04-1.13 1.804-1.536.78-.422 1.665-.634 2.656-.634 1.154 0 2.194.285 3.12.853.942.569 1.681 1.381 2.217 2.437.553 1.04.829 2.25.829 3.631 0 1.381-.276 2.608-.829 3.68-.536 1.056-1.275 1.877-2.217 2.462-.926.585-1.966.877-3.12.877-.99 0-1.868-.203-2.632-.61a5.648 5.648 0 0 1-1.828-1.535v8.36h-3.411V22.225h3.412v1.95Zm7.14 4.751c0-.812-.17-1.51-.51-2.095-.326-.602-.764-1.056-1.317-1.365a3.455 3.455 0 0 0-1.754-.463c-.618 0-1.203.162-1.755.487-.536.309-.975.764-1.316 1.365-.325.601-.487 1.308-.487 2.12 0 .813.162 1.52.487 2.12.341.602.78 1.064 1.316 1.39a3.543 3.543 0 0 0 1.755.463c.633 0 1.218-.163 1.754-.488a3.503 3.503 0 0 0 1.316-1.389c.341-.601.512-1.316.512-2.145Zm18.516-.243c0 .487-.033.926-.098 1.316h-9.87c.082.974.423 1.738 1.024 2.29.601.553 1.34.83 2.218.83 1.267 0 2.168-.545 2.705-1.634h3.68c-.39 1.3-1.138 2.372-2.243 3.217-1.104.829-2.461 1.243-4.069 1.243-1.3 0-2.47-.284-3.51-.853a6.277 6.277 0 0 1-2.412-2.461c-.569-1.056-.853-2.275-.853-3.656 0-1.397.284-2.624.853-3.68a5.951 5.951 0 0 1 2.388-2.437c1.024-.568 2.201-.853 3.534-.853 1.283 0 2.429.277 3.436.829a5.723 5.723 0 0 1 2.364 2.364c.568 1.007.853 2.169.853 3.485Zm-3.534-.975c-.016-.877-.333-1.576-.95-2.096-.618-.536-1.373-.804-2.267-.804-.845 0-1.559.26-2.144.78-.569.503-.918 1.21-1.048 2.12h6.409Zm9.436-3.387a4.82 4.82 0 0 1 1.706-1.682c.715-.406 1.527-.61 2.437-.61v3.583h-.902c-1.072 0-1.885.252-2.437.756-.536.503-.804 1.38-.804 2.632v6.726h-3.412V22.226h3.412v2.096Zm25.157-2.096-3.948 13.5h-3.68l-2.461-9.43-2.462 9.43h-3.704l-3.972-13.5h3.46l2.389 10.284 2.583-10.284h3.607l2.534 10.26 2.388-10.26h3.266Zm14.396 6.458c0 .487-.032.926-.097 1.316h-9.87c.081.974.423 1.738 1.024 2.29.601.553 1.34.83 2.217.83 1.268 0 2.169-.545 2.705-1.634h3.68c-.39 1.3-1.137 2.372-2.242 3.217-1.105.829-2.461 1.243-4.07 1.243-1.3 0-2.469-.284-3.509-.853a6.274 6.274 0 0 1-2.412-2.461c-.569-1.056-.853-2.275-.853-3.656 0-1.397.284-2.624.853-3.68a5.944 5.944 0 0 1 2.388-2.437c1.023-.568 2.201-.853 3.533-.853 1.284 0 2.429.277 3.437.829a5.723 5.723 0 0 1 2.364 2.364c.568 1.007.852 2.169.852 3.485Zm-3.533-.975c-.016-.877-.333-1.576-.951-2.096-.617-.536-1.372-.804-2.266-.804-.845 0-1.56.26-2.145.78-.568.503-.918 1.21-1.047 2.12h6.409Zm9.436-3.51c.438-.65 1.039-1.177 1.803-1.583.78-.407 1.665-.61 2.656-.61 1.154 0 2.194.285 3.12.853.942.569 1.681 1.381 2.217 2.437.553 1.04.829 2.25.829 3.631 0 1.381-.276 2.608-.829 3.68-.536 1.056-1.275 1.877-2.217 2.462-.926.585-1.966.877-3.12.877-1.007 0-1.892-.195-2.656-.585-.747-.406-1.348-.926-1.803-1.56v1.926h-3.412V17.693h3.412V24.2Zm7.14 4.728c0-.812-.171-1.51-.512-2.095-.325-.602-.763-1.056-1.316-1.365a3.454 3.454 0 0 0-1.754-.463c-.618 0-1.203.162-1.755.487-.536.309-.975.764-1.316 1.365-.325.601-.487 1.308-.487 2.12 0 .813.162 1.52.487 2.12.341.602.78 1.064 1.316 1.39a3.542 3.542 0 0 0 1.755.463c.633 0 1.218-.163 1.754-.488a3.5 3.5 0 0 0 1.316-1.389c.341-.601.512-1.316.512-2.145Z"
              />
              <defs>
                <linearGradient id="a" x1={16.801} x2={16.801} y1={0} y2={53.539} gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1EC9FF" />
                  <stop offset={1} stopColor="#1E78FF" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Compact Toggle Button - only show in full sidebar mode */}
          {!sidebarCompact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebarCompact}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Context Switcher */}
        {sidebarCompact ? <ContextSwitcher variant="compact" /> : <ContextSwitcher />}

        <nav className="flex-1 mt-4 pb-4 overflow-y-auto">
          {navigationItems.map((item, index) => {
            // Headers (collapsible sections) - hide in compact mode
            if (item.isHeader) {
              if (sidebarCompact) return null;
              const isExpanded = expandedSections.has(item.section!);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleSection(item.section!)}
                  className="w-full flex items-center justify-between px-4 py-2 mt-4 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>{item.label}</span>
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              );
            }

            // Skip items in collapsed sections (unless in compact mode)
            if (item.section && !expandedSections.has(item.section) && !sidebarCompact) {
              return null;
            }

            // Regular navigation items
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const marginLeft = item.section && !sidebarCompact ? 'ml-4' : ''; // Indent items in sections

            if (!item.href || !Icon) {
              return null; // Skip items without href or icon
            }

            // Check if this is the first item of a new section (for compact mode borders)
            const prevItem = navigationItems[index - 1];
            const isFirstInSection =
              sidebarCompact && item.section && (!prevItem || prevItem.isHeader || prevItem.section !== item.section);

            return (
              <div key={item.id}>
                {/* Section separator in compact mode */}
                {isFirstInSection && index > 0 && <div className="mx-2 my-2 border-t border-border/50" />}
                <NextLink
                  href={item.href}
                  className={`w-full flex items-center ${
                    sidebarCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
                  } text-sm hover:bg-accent hover:text-primary-foreground transition-colors ${
                    isActive ? 'bg-accent text-primary-foreground border-l-4 border-primary' : 'text-foreground'
                  } ${marginLeft}`}
                  title={sidebarCompact ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 ${sidebarCompact ? '' : 'mr-3'} flex-shrink-0`} />
                  {!sidebarCompact && <span className="truncate">{item.label}</span>}
                </NextLink>
              </div>
            );
          })}
        </nav>
        {/* Footer */}
        {!sidebarCompact && (
          <div className="p-4 border-t border-border text-center text-xs text-muted-foreground">
            Built with <Heart className="inline-block w-3 h-3 mx-1 text-red-500 fill-red-500" /> by Hyperweb
          </div>
        )}
      </div>
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSnappedAndOpen ? `mr-[${chatWidth}px]` : ''}`}
        style={isSnappedAndOpen ? { marginRight: `${chatWidth}px` } : {}}
      >
        {/* Header - Context Specific */}
        {mode === 'infra' ? (
          <InfraHeader
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
            activeSection={activeSection}
            onChatToggle={onChatToggle}
            chatVisible={chatVisible}
          />
        ) : (
          <SmartObjectsHeader
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
            activeSection={activeSection}
            onChatToggle={onChatToggle}
            chatVisible={chatVisible}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
