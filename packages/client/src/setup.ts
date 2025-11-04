import {
  InterwebClient as InterwebKubernetesClient,
  KubernetesResource,
} from "@interweb/interwebjs";
import {
  getOperatorIds,
  getOperatorResources,
  getOperatorVersions,
  getOperatorInfo,
} from "@interweb/manifests";
import {
  ClusterSetupConfig,
  ApplicationConfig,
  DeploymentStatus,
  InterwebClientConfig,
  OperatorConfig,
  OperatorInfo,
  ClusterOverview,
  SecretConfig,
} from "./types";
import {
  applyKubernetesResource,
  applyKubernetesResources,
  deleteKubernetesResource,
  deleteKubernetesResources,
} from "./apply";

export class SetupClient {
  private client: InterwebKubernetesClient;
  private defaultNamespace: string;

  constructor(
    client: InterwebKubernetesClient,
    defaultNamespace: string = "default"
  ) {
    this.client = client;
    this.defaultNamespace = defaultNamespace || "default";
  }

  /**
   * Check if the Kubernetes cluster is accessible
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.client.listCoreV1Node({
        query: {},
      });
      return true;
    } catch (error) {
      console.error("Failed to connect to Kubernetes cluster:", error);
      return false;
    }
  }

  public async applyManifest(
    manifest: KubernetesResource,
    options?: { continueOnError?: boolean; log?: (msg: string) => void }
  ): Promise<void> {
    await applyKubernetesResource(this.client, manifest, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async applyManifests(
    manifests: KubernetesResource[],
    options?: { continueOnError?: boolean; log?: (msg: string) => void }
  ): Promise<void> {
    await applyKubernetesResources(this.client, manifests, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async deployApplicationResources(
    config: ApplicationConfig,
    options?: { continueOnError?: boolean; log?: (msg: string) => void }
  ): Promise<void> {
    const manifests = this.buildApplicationManifests(config);
    if (manifests.length === 0) {
      return;
    }
    await this.applyManifests(manifests, {
      continueOnError: options?.continueOnError ?? false,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async deleteApplicationResources(
    config: ApplicationConfig,
    options?: { continueOnError?: boolean; log?: (msg: string) => void }
  ): Promise<void> {
    const manifests = this.buildApplicationManifests(config).filter(
      (manifest) => manifest.kind !== "Namespace"
    );
    if (manifests.length === 0) {
      return;
    }
    await this.deleteManifests(manifests, {
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async deleteManifest(
    manifest: KubernetesResource,
    options?: { continueOnError?: boolean; log?: (msg: string) => void }
  ): Promise<void> {
    await deleteKubernetesResource(this.client, manifest, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async deleteManifests(
    manifests: KubernetesResource[],
    options?: { continueOnError?: boolean; log?: (msg: string) => void }
  ): Promise<void> {
    await deleteKubernetesResources(this.client, manifests, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  /**
   * Install operators based on cluster setup configuration
   */
  public async installOperators(config: ClusterSetupConfig): Promise<void> {
    // check config.spec.operators are in the SUPPORTED_OPERATORS
    for (const operator of config.spec.operators) {
      if (!getOperatorIds().includes(operator.name as any)) {
        throw new Error(`Unsupported operator: ${operator.name}`);
      }
    }

    const enabledOperators = config.spec.operators.filter(op => op.enabled);
    
    if (enabledOperators.length === 0) {
      console.log('No operators enabled for installation');
      return;
    }

    console.log(`Installing ${enabledOperators.length} operators in parallel...`);

    // Install operators in parallel for better performance with timeout
    const installPromises = enabledOperators.map(async (operator) => {
      console.log(`Starting installation: ${operator.name} ${operator.version}`);
      
      // Add timeout to prevent hanging during manifest application
      const installPromise = (async () => {
        const manifests = getOperatorResources(operator.name, operator.version);
        await this.applyManifests(manifests, {
          continueOnError: false,
          log: (m) => console.log(`[${operator.name}] ${m}`),
        });
        console.log(`✓ Operator manifests applied: ${operator.name} ${operator.version}`);
        
        // Wait for operator to be ready with timeout
        console.log(`[${operator.name}] Waiting for operator to be ready...`);
        await this.waitForOperator(operator.name, 180_000, 3_000); // 3 minutes timeout
        console.log(`✓ Operator ready: ${operator.name} ${operator.version}`);
      })();

      // Add overall timeout for the entire installation process
      // Use managed timeout that is cleared when install completes to avoid lingering timers/open handles
      return new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout: Operator ${operator.name} installation took longer than 5 minutes`));
        }, 300_000); // 5 minutes total timeout per operator

        installPromise
          .then(() => {
            clearTimeout(timeoutId);
            resolve();
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            reject(err);
          });
      });
    });

    try {
      await Promise.all(installPromises);
      console.log('✓ All operators installed and ready successfully');
    } catch (error) {
      console.error('✗ Failed to install one or more operators:', error);
      throw error;
    }
  }

  /**
   * Delete operators based on cluster setup configuration
   */
  public async deleteOperators(
    config: ClusterSetupConfig,
    options?: { continueOnError?: boolean }
  ): Promise<void> {
    // check config.spec.operators are in the SUPPORTED_OPERATORS
    for (const operator of config.spec.operators) {
      if (!getOperatorIds().includes(operator.name as any)) {
        throw new Error(`Unsupported operator: ${operator.name}`);
      }
    }

    // Process operators in reverse order for safer deletion
    const operatorsToDelete = config.spec.operators
      .filter((op) => op.enabled)
      .reverse();

    for (const operator of operatorsToDelete) {
      console.log(`Deleting operator: ${operator.name} ${operator.version}`);
      try {
        const manifests = getOperatorResources(operator.name, operator.version);
        await this.deleteManifests(manifests, {
          continueOnError: options?.continueOnError ?? true,
          log: (m) => console.log(m),
        });
        console.log(`Operator deleted: ${operator.name} ${operator.version}`);
      } catch (error) {
        const errorMsg = `Failed to delete operator ${operator.name}: ${error}`;
        if (options?.continueOnError ?? true) {
          console.warn(errorMsg);
        } else {
          throw new Error(errorMsg);
        }
      }
    }
  }

  /**
   * Get deployment status for a cluster setup
   */
  async getClusterSetupStatus(
    config: ClusterSetupConfig
  ): Promise<DeploymentStatus> {
    const namespace = config.metadata.namespace || "interweb-system";

    try {
      // Check if all operators are running
      const operatorStatuses = await Promise.all(
        config.spec.operators
          .filter((op) => op.enabled)
          .map(async (op) => {
            const status = await this.getOperatorStatus(op.name, "");
            return status;
          })
      );

      const allInstalled = operatorStatuses.every((status) => status.installed);
      const allReady = operatorStatuses.every((status) => status.ready);

      let phase: "pending" | "installing" | "ready" | "failed";
      let message: string;

      if (!allInstalled) {
        phase = "pending";
        message = "Some operators are not installed";
      } else if (!allReady) {
        phase = "installing";
        message = "Some operators are still installing";
      } else {
        phase = "ready";
        message = "All operators are ready";
      }

      return {
        phase,
        message,
        conditions: operatorStatuses.map((status, index) => ({
          type: "OperatorReady",
          status: status.ready ? "True" : "False",
          reason: status.installed ? (status.ready ? "Ready" : "Installing") : "NotInstalled",
          message: `Operator ${config.spec.operators[index].name} is ${status.installed ? (status.ready ? "ready" : "installing") : "not installed"}`,
          lastTransitionTime: new Date().toISOString(),
        })),
      };
    } catch (error) {
      return {
        phase: "failed",
        message: `Failed to get cluster setup status: ${error}`,
        conditions: [],
      };
    }
  }

  /**
   * Get deployment status for an application
   */
  async getApplicationStatus(
    config: ApplicationConfig
  ): Promise<DeploymentStatus> {
    const namespace = config.metadata.namespace || "default";

    try {
      const deployments = await this.client.listAppsV1NamespacedDeployment({
        path: { namespace },
        query: {},
      });
      const appDeployments = deployments.items.filter(
        (dep: any) =>
          dep.metadata?.labels?.["app.interweb.dev/instance"] ===
          config.metadata.name
      );

      if (appDeployments.length === 0) {
        return {
          phase: "pending",
          message: "No deployments found",
        };
      }

      const allReady = appDeployments.every(
        (dep: any) =>
          dep.status?.readyReplicas === dep.status?.replicas &&
          dep.status?.replicas > 0
      );

      return {
        phase: allReady ? "ready" : "installing",
        message: allReady
          ? "Application is ready"
          : "Application is still deploying",
        conditions: appDeployments.map((dep: any) => ({
          type: "DeploymentReady",
          status:
            dep.status?.readyReplicas === dep.status?.replicas
              ? "True"
              : "False",
          reason: "Deployment",
          message: `${dep.metadata?.name}: ${dep.status?.readyReplicas}/${dep.status?.replicas} replicas ready`,
          lastTransitionTime: new Date().toISOString(),
        })),
      };
    } catch (error) {
      return {
        phase: "failed",
        message: `Failed to get application status: ${error}`,
        conditions: [],
      };
    }
  }

  /**
   * Delete resources for a cluster setup
   */
  async deleteClusterSetup(config: ClusterSetupConfig): Promise<void> {
    const namespace = config.metadata.namespace || "interweb-system";

    try {
      // Delete namespace which will cascade delete all resources
      await this.deleteOperators(config, { continueOnError: true });
      await this.client.deleteCoreV1Namespace({
        path: { name: String(namespace) },
        query: {},
      });
      console.log(`Deleted namespace: ${namespace}`);
    } catch (error: any) {
      // Handle 404 errors (namespace not found) gracefully
      if (error.message?.includes('status: 404') || error.message?.includes('not found')) {
        console.log(`Namespace ${namespace} already deleted or does not exist`);
        return;
      }
      throw error;
    }
  }

  /**
   * Helper method to filter pods and check readiness for kube-prometheus-stack
   * Filters out test pods and node-exporter pods, then checks core deployments as fallback
   */
  private filterPodsAndCheckReadiness(
    pods: any[],
    operatorName: string
  ): { installed: boolean; ready: boolean } | null {
    // Filter out test pods and node-exporter pods for kube-prometheus-stack
    const relevantPods = pods.filter((pod: any) => {
      const podName = pod.metadata?.name || "";
      if (operatorName === "kube-prometheus-stack") {
        // Exclude test pods (they run once and may fail)
        if (podName.includes("-test")) return false;
        // Exclude node-exporter pods (they fail on Docker Desktop due to mount issues)
        if (podName.includes("node-exporter")) return false;
      }
      return true;
    });

    if (relevantPods.length === 0) {
      // If no relevant pods after filtering, check if we have core deployments
      const coreDeployments = pods.filter((pod: any) => {
        const podName = pod.metadata?.name || "";
        return podName.includes("grafana") || 
               podName.includes("operator") || 
               podName.includes("kube-state-metrics");
      });
      
      if (coreDeployments.length > 0) {
        const allReady = coreDeployments.every((pod: any) => {
          const phase = pod.status?.phase;
          return phase === "Running" || phase === "Succeeded";
        });
        return { installed: true, ready: allReady };
      }
      return { installed: true, ready: false };
    }

    const allReady = relevantPods.every((pod: any) => {
      const phase = pod.status?.phase;
      return phase === "Running" || phase === "Succeeded";
    });
    return { installed: true, ready: allReady };
  }

  private async getOperatorStatus(
    operatorName: string,
    namespace: string
  ): Promise<{ installed: boolean; ready: boolean }> {
    try {
      // Get the proper detector configuration for this operator
      const detector = this.getOperatorDetector(operatorName);
      const operatorNamespaces = detector.namespaces || [];
      const labelSelectors = detector.labelSelectors || [];

      // For operators with known namespaces, check if any of them exist
      if (operatorNamespaces.length > 0) {
        let namespaceExists = false;
        for (const ns of operatorNamespaces) {
          try {
            await this.client.readCoreV1Namespace({ path: { name: ns }, query: {} });
            namespaceExists = true;
            break;
          } catch (error: any) {
            // Namespace doesn't exist, continue checking others
            continue;
          }
        }

        if (!namespaceExists) {
          return { installed: false, ready: false };
        }

        // Check if operator pods are running in any of the namespaces using proper label selectors
        for (const ns of operatorNamespaces) {
          try {
            // Try each label selector to find pods
            for (const labelSelector of labelSelectors) {
              const pods = await this.client.listCoreV1NamespacedPod({
                path: { namespace: ns },
                query: { labelSelector },
              });

              if (pods.items.length > 0) {
                const result = this.filterPodsAndCheckReadiness(pods.items, operatorName);
                if (result) return result;
              }
            }
          } catch (error) {
            // Continue checking other namespaces
            continue;
          }
        }

        // Namespace exists but no pods found with proper selectors - try fallback
        for (const ns of operatorNamespaces) {
          try {
            const pods = await this.client.listCoreV1NamespacedPod({
              path: { namespace: ns },
              query: { labelSelector: `app=${operatorName}` },
            });

            if (pods.items.length > 0) {
              const result = this.filterPodsAndCheckReadiness(pods.items, operatorName);
              if (result) return result;
            }
          } catch (error) {
            // Continue checking other namespaces
            continue;
          }
        }

        // Namespace exists but no pods found - operator is installed but not ready
        return { installed: true, ready: false };
      }

      // Fallback: check if operator pods are running in the specified namespace
      // Try proper label selectors first
      for (const labelSelector of labelSelectors) {
        try {
          const pods = await this.client.listCoreV1NamespacedPod({
            path: { namespace },
            query: { labelSelector },
          });

          if (pods.items.length > 0) {
            const result = this.filterPodsAndCheckReadiness(pods.items, operatorName);
            if (result) return result;
          }
        } catch (error) {
          // Continue with next selector
          continue;
        }
      }

      // Final fallback with generic selector
      const pods = await this.client.listCoreV1NamespacedPod({
        path: { namespace },
        query: { labelSelector: `app=${operatorName}` },
      });

      // If no pods are found, check if namespace exists to determine if installed
      if (pods.items.length === 0) {
        try {
          await this.client.readCoreV1Namespace({ path: { name: namespace }, query: {} });
          return { installed: true, ready: false }; // Namespace exists but no pods
        } catch (error) {
          return { installed: false, ready: false }; // Namespace doesn't exist
        }
      }

      const allRunning = pods.items.every((pod: any) => pod.status?.phase === "Running");
      return { installed: true, ready: allRunning };
    } catch (error) {
      return { installed: false, ready: false };
    }
  }

  // ===== Dashboard-friendly helpers (reusable) =====

  /**
   * Install a single operator by name (optional version).
   */
  public async installOperatorByName(
    name: string,
    version?: string
  ): Promise<void> {
    const manifests = getOperatorResources(name, version);
    await this.applyManifests(manifests, {
      continueOnError: false,
      log: (m) => console.log(m),
    });
  }

  /**
   * Uninstall a single operator by name (optional version).
   */
  public async uninstallOperatorByName(
    name: string,
    version?: string
  ): Promise<void> {
    const manifests = getOperatorResources(name, version);
    await this.deleteManifests(manifests, {
      continueOnError: true,
      log: (m) => console.log(m),
    });
  }

  /**
   * List supported operators with detected status + version across all namespaces.
   */
  public async listOperatorsInfo(): Promise<OperatorInfo[]> {
    const results: OperatorInfo[] = [];
    for (const name of getOperatorIds()) {
      const meta = getOperatorInfo(name) || {
        name,
        displayName: name,
        description: "",
        docsUrl: undefined,
      };
      const entry = {
        name,
        displayName: meta.displayName,
        description: meta.description,
        docsUrl: meta.docsUrl,
      } as Pick<
        OperatorInfo,
        "name" | "displayName" | "description" | "docsUrl"
      >;
      const installs = await this.getOperatorInstallations(entry.name);
      // Derive summary
      const installed = installs.find((i) => i.status === "installed");
      const installing = installs.find((i) => i.status === "installing");
      const status = installed
        ? "installed"
        : installing
          ? "installing"
          : "not-installed";
      const version = installed?.version || installing?.version || "unknown";
      const namespace =
        installed?.namespace ||
        installing?.namespace ||
        this.getOperatorDetector(entry.name).namespaces?.[0] ||
        getOperatorInfo(name)?.namespaces?.[0];
      results.push({
        ...entry,
        status,
        version,
        namespace,
        installations: installs,
      });
    }
    return results;
  }

  /**
   * High-level cluster overview (nodes/pods/services/operators/version).
   */
  public async getClusterOverview(): Promise<ClusterOverview> {
    // Nodes
    const nodesResp = await this.client.listCoreV1Node({ query: {} as any });
    const nodes = (nodesResp?.items || []).map((node: any) => ({
      name: node?.metadata?.name || "",
      status:
        (node?.status?.conditions || []).find((c: any) => c.type === "Ready")
          ?.status === "True"
          ? "Ready"
          : "NotReady",
      version: node?.status?.nodeInfo?.kubeletVersion || "",
      roles: Object.keys(node?.metadata?.labels || {})
        .filter((k) => k.includes("node-role.kubernetes.io"))
        .map((k) => k.replace("node-role.kubernetes.io/", "")),
    }));

    // Pods/services across all namespaces
    let podCount = 0;
    let serviceCount = 0;
    const namespaces = await this.safeListNamespaces();
    for (const ns of namespaces) {
      const nsName = ns?.metadata?.name;
      if (!nsName) continue;
      try {
        const pods = await this.client.listCoreV1NamespacedPod({
          path: { namespace: nsName },
          query: {} as any,
        });
        podCount += (pods?.items || []).length;
      } catch { }
      try {
        const svcs = await this.client.listCoreV1NamespacedService({
          path: { namespace: nsName },
          query: {} as any,
        });
        serviceCount += (svcs?.items || []).length;
      } catch { }
    }

    // Server version
    let version = "unknown";
    try {
      const v = await this.client.getCodeVersion({} as any);
      version = String(v?.gitVersion || "unknown");
    } catch { }

    // Operators
    let operatorCount = 0;
    try {
      const ops = await this.listOperatorsInfo();
      operatorCount = ops.filter(
        (o) => o.status === "installed" || o.status === "installing"
      ).length;
    } catch { }

    return {
      healthy: nodes.every((n) => n.status === "Ready"),
      nodeCount: nodes.length,
      podCount,
      serviceCount,
      operatorCount,
      version,
      nodes,
    };
  }

  /**
   * Create a secret by applying a minimal Secret manifest.
   */
  public async createSecret(secret: SecretConfig): Promise<void> {
    const encoded = Object.fromEntries(
      Object.entries(secret.data).map(([k, v]) => [
        k,
        Buffer.from(String(v), "utf8").toString("base64"),
      ])
    );
    const manifest: KubernetesResource = {
      apiVersion: "v1",
      kind: "Secret",
      metadata: { name: secret.name, namespace: secret.namespace },
      // @ts-ignore
      type: secret.type,
      data: encoded,
    } as any;
    await this.applyManifests([manifest]);
  }

  /**
   * List secrets in one or all namespaces (name/namespace/type/age/keys).
   */
  public async listSecrets(
    namespace?: string
  ): Promise<
    Array<{
      name: string;
      namespace: string;
      type: string;
      age: string;
      keys: string[];
    }>
  > {
    const out: Array<{
      name: string;
      namespace: string;
      type: string;
      age: string;
      keys: string[];
    }> = [];
    const namespaces = namespace
      ? [{ metadata: { name: namespace } }]
      : await this.safeListNamespaces();
    for (const ns of namespaces) {
      const nsName = ns?.metadata?.name;
      if (!nsName) continue;
      try {
        const secrets = await this.client.listCoreV1NamespacedSecret({
          path: { namespace: nsName },
          query: {} as any,
        });
        (secrets?.items || []).forEach((s: any) => {
          out.push({
            name: s?.metadata?.name || "",
            namespace: s?.metadata?.namespace || nsName,
            type: s?.type || "",
            age: this.formatAge(s?.metadata?.creationTimestamp),
            keys: Object.keys(s?.data || {}),
          });
        });
      } catch { }
    }
    return out;
  }

  private buildApplicationManifests(
    config: ApplicationConfig
  ): KubernetesResource[] {
    const namespace = config.metadata.namespace || "default";
    const appName = config.metadata.name;
    const manifests: KubernetesResource[] = [];

    if (namespace !== "default") {
      manifests.push({
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: namespace,
          labels: {
            "app.interweb.dev/managed": "true",
            "app.interweb.dev/application": appName,
          },
        },
      });
    }

    const services = config.spec.services ?? [];
    const baseAppLabels = {
      "app.interweb.dev/instance": appName,
      "app.kubernetes.io/part-of": appName,
    } as Record<string, string>;

    services.forEach((svc, idx) => {
      const serviceName = svc.name || `${appName}-svc-${idx}`;
      const labels = {
        ...baseAppLabels,
        "app.kubernetes.io/name": serviceName,
        app: serviceName,
      };

      const env = svc.env
        ? Object.entries(svc.env).map(([name, value]) => ({ name, value }))
        : undefined;

      const container: any = {
        name: serviceName,
        image: svc.image,
        ports: [
          {
            containerPort: svc.port,
          },
        ],
      };

      if (env && env.length > 0) {
        container.env = env;
      }

      if (svc.resources) {
        container.resources = svc.resources;
      }

      manifests.push({
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          name: serviceName,
          namespace,
          labels,
        },
        spec: {
          replicas: svc.replicas ?? 1,
          selector: {
            matchLabels: labels,
          },
          template: {
            metadata: {
              labels,
            },
            spec: {
              containers: [container],
            },
          },
        },
      } as KubernetesResource);

      manifests.push({
        apiVersion: "v1",
        kind: "Service",
        metadata: {
          name: serviceName,
          namespace,
          labels,
        },
        spec: {
          selector: labels,
          ports: [
            {
              port: svc.port,
              targetPort: svc.port,
              protocol: "TCP",
            },
          ],
        },
      } as KubernetesResource);
    });

    if (config.spec.ingress?.enabled && services.length > 0) {
      const primaryService = services[0];
      const host = config.spec.ingress.host;
      const ingressManifest: KubernetesResource = {
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
          name: `${appName}-ingress`,
          namespace,
          labels: baseAppLabels,
          annotations: {
            "app.interweb.dev/managed": "true",
          },
        },
        spec: {
          rules: [
            {
              ...(host ? { host } : {}),
              http: {
                paths: [
                  {
                    path: config.spec.ingress.path || "/",
                    pathType: "Prefix",
                    backend: {
                      service: {
                        name: primaryService.name,
                        port: {
                          number: primaryService.port,
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      };

      if (config.spec.ingress.tls && host) {
        (ingressManifest.spec as any).tls = [
          {
            hosts: [host],
            secretName: `${appName}-tls`,
          },
        ];
      }

      manifests.push(ingressManifest);
    }

    return manifests;
  }

  // ----- internal helpers -----
  private async safeListNamespaces(): Promise<any[]> {
    try {
      const res = await this.client.listCoreV1Namespace({ query: {} as any });
      return res?.items || [];
    } catch {
      return [];
    }
  }

  private async findOperatorDeployment(
    namespaces: any[],
    operatorName: string
  ): Promise<{ deployment: any; namespace: string } | null> {
    for (const ns of namespaces) {
      const nsName = ns?.metadata?.name;
      if (!nsName) continue;
      try {
        const deployments = await this.client.listAppsV1NamespacedDeployment({
          path: { namespace: nsName },
          query: {} as any,
        });
        const found = (deployments?.items || []).find(
          (d: any) =>
            String(d?.metadata?.name || "").includes(operatorName) ||
            d?.metadata?.labels?.["app.kubernetes.io/name"] === operatorName
        );
        if (found) return { deployment: found, namespace: nsName };
      } catch { }
    }
    return null;
  }

  /**
   * Return best-effort install state for a known operator.
   * Uses deployment label selectors and defaults per operator, then falls back to a cluster-wide search.
   */
  public async getOperatorInstallations(
    name: string
  ): Promise<
    Array<{
      namespace: string;
      status: OperatorInfo["status"];
      version: string;
    }>
  > {
    const detector = this.getOperatorDetector(name);
    const namespaces = await this.safeListNamespaces();
    // If we have canonical namespaces, scan only those. Otherwise scan all.
    const nsOrder =
      detector.namespaces && detector.namespaces.length > 0
        ? detector.namespaces
        : (namespaces
          .map((n) => n?.metadata?.name)
          .filter(Boolean) as string[]);
    const seen = new Set<string>();
    const results: Array<{
      namespace: string;
      status: OperatorInfo["status"];
      version: string;
    }> = [];
    const trySelectors = detector.labelSelectors?.length
      ? detector.labelSelectors
      : [];

    for (const nsName of nsOrder) {
      if (!nsName || seen.has(nsName)) continue;
      seen.add(nsName);
      let found = false;
      // Try known deployment selectors
      for (const sel of trySelectors) {
        try {
          const dpls = await this.client.listAppsV1NamespacedDeployment({
            path: { namespace: nsName },
            query: { labelSelector: sel } as any,
          });
          const d = (dpls?.items || [])[0];
          if (d) {
            const ready = Number(d?.status?.readyReplicas || 0);
            const desired = Number(d?.spec?.replicas || 0);
            const status: OperatorInfo["status"] =
              desired > 0
                ? ready === desired
                  ? "installed"
                  : "installing"
                : "error";
            const version = String(
              d?.metadata?.labels?.["app.kubernetes.io/version"] ||
              d?.metadata?.annotations?.["version"] ||
              "unknown"
            );
            results.push({ namespace: nsName, status, version });
            found = true;
            break;
          }
        } catch { }
      }
      if (found) continue;
      // Fallback: any deployment with matching name/label
      try {
        const dpls = await this.client.listAppsV1NamespacedDeployment({
          path: { namespace: nsName },
          query: {} as any,
        });
        const d = (dpls?.items || []).find(
          (dep: any) =>
            String(dep?.metadata?.name || "").includes(name) ||
            dep?.metadata?.labels?.["app.kubernetes.io/name"] === name ||
            dep?.metadata?.labels?.["app"] === name
        );
        if (d) {
          const ready = Number(d?.status?.readyReplicas || 0);
          const desired = Number(d?.spec?.replicas || 0);
          const status: OperatorInfo["status"] =
            desired > 0
              ? ready === desired
                ? "installed"
                : "installing"
              : "error";
          const version = String(
            d?.metadata?.labels?.["app.kubernetes.io/version"] ||
            d?.metadata?.annotations?.["version"] ||
            "unknown"
          );
          results.push({ namespace: nsName, status, version });
          continue;
        }
      } catch { }
      // Last fallback: pods with selectors
      if (trySelectors.length > 0) {
        for (const sel of trySelectors) {
          try {
            const pods = await this.client.listCoreV1NamespacedPod({
              path: { namespace: nsName },
              query: { labelSelector: sel } as any,
            });
            const p = (pods?.items || [])[0];
            if (p) {
              const status: OperatorInfo["status"] = "installing";
              results.push({ namespace: nsName, status, version: "unknown" });
              break;
            }
          } catch { }
        }
      }
    }
    if (results.length > 0) return results;
    // CRD presence implies at least installing
    try {
      const crdNames = this.getOperatorCRDHints(name);
      if (crdNames.length > 0) {
        const crds =
          await this.client.listApiextensionsV1CustomResourceDefinition({
            query: {} as any,
          });
        const present = crdNames.every((n) =>
          crds?.items?.some((c: any) => c?.metadata?.name === n)
        );
        if (present) {
          return [
            {
              namespace: detector.namespaces?.[0] || "default",
              status: "installing",
              version: "unknown",
            },
          ];
        }
      }
    } catch { }
    return [];
  }

  /**
   * Wait until the operator reports 'installed' or timeout.
   */
  public async waitForOperator(
    name: string,
    timeoutMs = 180_000, // Reduced from 300_000 (5 min) to 180_000 (3 min)
    pollMs = 3_000 // Reduced from 5_000ms to 3_000ms for faster feedback
  ): Promise<void> {
    const start = Date.now();
    for (; ;) {
      const installs = await this.getOperatorInstallations(name);
      const installed = installs.find((i) => i.status === "installed");
      if (installed) return;
      if (Date.now() - start > timeoutMs) {
        throw new Error(
          `Timeout waiting for operator '${name}' to be installed`
        );
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  /**
   * Wait until the operator is fully removed from its canonical namespaces (and CRDs absent if hinted).
   */
  public async waitForOperatorDeletion(
    name: string,
    timeoutMs = 300_000,
    pollMs = 5_000
  ): Promise<void> {
    const start = Date.now();
    const detector = this.getOperatorDetector(name);
    for (; ;) {
      const installs = await this.getOperatorInstallations(name);
      const stillPresent = installs.filter((i) =>
        detector.namespaces?.includes(i.namespace)
      );
      let crdsPresent = false;
      try {
        const hints = this.getOperatorCRDHints(name);
        if (hints.length > 0) {
          const crds =
            await this.client.listApiextensionsV1CustomResourceDefinition({
              query: {} as any,
            });
          crdsPresent = hints.some((n) =>
            crds?.items?.some((c: any) => c?.metadata?.name === n)
          );
        }
      } catch { }
      if (stillPresent.length === 0 && !crdsPresent) return;
      if (Date.now() - start > timeoutMs) {
        throw new Error(`Timeout waiting for operator '${name}' to be deleted`);
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  /**
   * Detailed debug info for an operator: matched deployments/pods per namespace, and CRD presence.
   */
  public async getOperatorDebug(name: string): Promise<any> {
    const detector = this.getOperatorDetector(name);
    const namespaces = await this.safeListNamespaces();
    const nsOrder =
      detector.namespaces && detector.namespaces.length > 0
        ? detector.namespaces
        : (namespaces
          .map((n) => n?.metadata?.name)
          .filter(Boolean) as string[]);
    const trySelectors = detector.labelSelectors || [];
    const matches: Record<string, any> = {};

    for (const nsName of nsOrder) {
      if (!nsName) continue;
      matches[nsName] = { deployments: [], pods: [] };
      // Deployments by selectors
      for (const sel of trySelectors) {
        try {
          const dpls = await this.client.listAppsV1NamespacedDeployment({
            path: { namespace: nsName },
            query: { labelSelector: sel } as any,
          });
          (dpls?.items || []).forEach((d: any) => {
            matches[nsName].deployments.push({
              name: d?.metadata?.name,
              labels: d?.metadata?.labels,
              ready: d?.status?.readyReplicas || 0,
              replicas: d?.status?.replicas || d?.spec?.replicas || 0,
            });
          });
        } catch { }
      }
      // Fallback deployments by name/labels
      try {
        const dpls = await this.client.listAppsV1NamespacedDeployment({
          path: { namespace: nsName },
          query: {} as any,
        });
        (dpls?.items || []).forEach((d: any) => {
          const lname = String(
            d?.metadata?.labels?.["app.kubernetes.io/name"] ||
            d?.metadata?.labels?.["app"] ||
            ""
          );
          if (
            String(d?.metadata?.name || "").includes(name) ||
            lname === name
          ) {
            matches[nsName].deployments.push({
              name: d?.metadata?.name,
              labels: d?.metadata?.labels,
              ready: d?.status?.readyReplicas || 0,
              replicas: d?.status?.replicas || d?.spec?.replicas || 0,
            });
          }
        });
      } catch { }
      // Pods by selectors
      for (const sel of trySelectors) {
        try {
          const pods = await this.client.listCoreV1NamespacedPod({
            path: { namespace: nsName },
            query: { labelSelector: sel } as any,
          });
          (pods?.items || []).forEach((p: any) => {
            matches[nsName].pods.push({
              name: p?.metadata?.name,
              phase: p?.status?.phase,
              labels: p?.metadata?.labels,
            });
          });
        } catch { }
      }
    }
    // CRDs present
    const crdHints = this.getOperatorCRDHints(name);
    let crdsPresent: string[] = [];
    try {
      if (crdHints.length > 0) {
        const crds =
          await this.client.listApiextensionsV1CustomResourceDefinition({
            query: {} as any,
          });
        crdsPresent = crdHints.filter((n) =>
          crds?.items?.some((c: any) => c?.metadata?.name === n)
        );
      }
    } catch { }

    return { detector, matches, crdHints, crdsPresent };
  }

  private getOperatorDetector(name: string): {
    namespaces?: string[];
    labelSelectors?: string[];
  } {
    switch (name) {
      case "minio-operator":
        return {
          namespaces: ["minio-operator"],
          labelSelectors: [
            "app.kubernetes.io/instance=minio-operator",
            "app.kubernetes.io/name=operator",
            "app=minio-operator",
          ],
        };
      case "cloudnative-pg":
        return {
          namespaces: ["cnpg-system"],
          labelSelectors: [
            "app.kubernetes.io/name=cloudnative-pg",
            "app=cloudnative-pg",
          ],
        };
      case "cert-manager":
        return {
          namespaces: ["cert-manager"],
          labelSelectors: [
            "app.kubernetes.io/instance=cert-manager",
            "app.kubernetes.io/name=cert-manager",
            "app.kubernetes.io/name=cainjector",
            "app.kubernetes.io/name=webhook",
            "app=cert-manager",
          ],
        };
      case "ingress-nginx":
        return {
          namespaces: ["ingress-nginx"],
          labelSelectors: [
            "app.kubernetes.io/name=ingress-nginx",
            "app=ingress-nginx",
          ],
        };
      case "knative-serving":
        return {
          namespaces: ["knative-serving", "kourier-system"],
          labelSelectors: [
            "app.kubernetes.io/name=knative-serving",
            "app.kubernetes.io/part-of=knative-serving",
            "app=activator",
            "app=autoscaler", 
            "app=controller",
            "app=webhook",
            "app=3scale-kourier-gateway",
          ],
        };
      case "kube-prometheus-stack":
        return {
          namespaces: ["monitoring"],
          labelSelectors: [
            "app.kubernetes.io/instance=kube-prometheus-stack",
            "app.kubernetes.io/name=grafana",
            "app.kubernetes.io/name=kube-prometheus-stack-prometheus-operator",
            "app.kubernetes.io/name=kube-state-metrics",
            "app=kube-prometheus-stack-operator",
          ],
        };
      default:
        return {};
    }
  }

  private getOperatorCRDHints(name: string): string[] {
    switch (name) {
      case "minio-operator":
        return ["tenants.minio.min.io", "users.minio.min.io"];
      case "cloudnative-pg":
        return ["clusters.postgresql.cnpg.io", "backups.postgresql.cnpg.io"];
      case "cert-manager":
        return ["certificates.cert-manager.io", "issuers.cert-manager.io"];
      case "knative-serving":
        return ["services.serving.knative.dev"];
      default:
        return [];
    }
  }

  private formatAge(timestamp?: string): string {
    if (!timestamp) return "unknown";
    const now = Date.now();
    const created = new Date(timestamp).getTime();
    const diff = Math.max(0, now - created);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m`;
  }
}
