/** Auto-generated typed resources for operator: ingress-nginx*/
import type { KubernetesResource, AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration, AppsV1Deployment, BatchV1Job, ConfigMap, Namespace, NetworkingK8sIoV1IngressClass, RbacAuthorizationK8sIoV1ClusterRole, RbacAuthorizationK8sIoV1ClusterRoleBinding, RbacAuthorizationK8sIoV1Role, RbacAuthorizationK8sIoV1RoleBinding, Service, ServiceAccount } from "@kubernetesjs/ops";
export const Namespace_IngressNginx: Namespace = {
  apiVersion: "v1",
  kind: "Namespace",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "ingress-nginx"
    },
    name: "ingress-nginx"
  }
};
export const ServiceAccount_IngressNginx: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx",
    namespace: "ingress-nginx"
  },
  automountServiceAccountToken: true
};
export const ConfigMap_IngressNginxController: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-controller",
    namespace: "ingress-nginx"
  },
  data: {
    "allow-snippet-annotations": "false"
  }
};
export const ClusterRole_IngressNginx: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx"
  },
  rules: [{
    apiGroups: [""],
    resources: ["configmaps", "endpoints", "nodes", "pods", "secrets", "namespaces"],
    verbs: ["list", "watch"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resources: ["leases"],
    verbs: ["list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["nodes"],
    verbs: ["get"]
  }, {
    apiGroups: [""],
    resources: ["services"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses/status"],
    verbs: ["update"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingressclasses"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["discovery.k8s.io"],
    resources: ["endpointslices"],
    verbs: ["list", "watch", "get"]
  }]
};
export const ClusterRoleBinding_IngressNginx: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "ingress-nginx"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "ingress-nginx",
    namespace: "ingress-nginx"
  }]
};
export const Role_IngressNginx: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx",
    namespace: "ingress-nginx"
  },
  rules: [{
    apiGroups: [""],
    resources: ["namespaces"],
    verbs: ["get"]
  }, {
    apiGroups: [""],
    resources: ["configmaps", "pods", "secrets", "endpoints"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["services"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses/status"],
    verbs: ["update"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingressclasses"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resourceNames: ["ingress-nginx-leader"],
    resources: ["leases"],
    verbs: ["get", "update"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resources: ["leases"],
    verbs: ["create"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }, {
    apiGroups: ["discovery.k8s.io"],
    resources: ["endpointslices"],
    verbs: ["list", "watch", "get"]
  }]
};
export const RoleBinding_IngressNginx: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx",
    namespace: "ingress-nginx"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "ingress-nginx"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "ingress-nginx",
    namespace: "ingress-nginx"
  }]
};
export const Service_IngressNginxControllerMetrics: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-controller-metrics",
    namespace: "ingress-nginx"
  },
  spec: {
    ports: [{
      name: "metrics",
      port: 10254,
      protocol: "TCP",
      targetPort: "metrics"
    }],
    selector: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/name": "ingress-nginx"
    },
    type: "ClusterIP"
  }
};
export const Service_IngressNginxControllerAdmission: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-controller-admission",
    namespace: "ingress-nginx"
  },
  spec: {
    ports: [{
      appProtocol: "https",
      name: "https-webhook",
      port: 443,
      targetPort: "webhook"
    }],
    selector: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/name": "ingress-nginx"
    },
    type: "ClusterIP"
  }
};
export const Service_IngressNginxController: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    annotations: null,
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-controller",
    namespace: "ingress-nginx"
  },
  spec: {
    ipFamilies: ["IPv4"],
    ipFamilyPolicy: "SingleStack",
    ports: [{
      appProtocol: "http",
      name: "http",
      port: 80,
      protocol: "TCP",
      targetPort: "http"
    }, {
      appProtocol: "https",
      name: "https",
      port: 443,
      protocol: "TCP",
      targetPort: "https"
    }],
    selector: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/name": "ingress-nginx"
    },
    type: "LoadBalancer"
  }
};
export const Deployment_IngressNginxController: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-controller",
    namespace: "ingress-nginx"
  },
  spec: {
    minReadySeconds: 0,
    replicas: 1,
    revisionHistoryLimit: 10,
    selector: {
      matchLabels: {
        "app.kubernetes.io/component": "controller",
        "app.kubernetes.io/instance": "ingress-nginx",
        "app.kubernetes.io/name": "ingress-nginx"
      }
    },
    template: {
      metadata: {
        annotations: {
          prometheus: "map[io/port:10254 io/scrape:true]"
        },
        labels: {
          "app.kubernetes.io/component": "controller",
          "app.kubernetes.io/instance": "ingress-nginx",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "ingress-nginx",
          "app.kubernetes.io/part-of": "ingress-nginx",
          "app.kubernetes.io/version": "1.11.2",
          "helm.sh/chart": "ingress-nginx-4.11.2"
        }
      },
      spec: {
        containers: [{
          args: ["/nginx-ingress-controller", "--publish-service=$(POD_NAMESPACE)/ingress-nginx-controller", "--election-id=ingress-nginx-leader", "--controller-class=k8s.io/ingress-nginx", "--ingress-class=nginx", "--configmap=$(POD_NAMESPACE)/ingress-nginx-controller", "--validating-webhook=:8443", "--validating-webhook-certificate=/usr/local/certificates/cert", "--validating-webhook-key=/usr/local/certificates/key"],
          env: [{
            name: "POD_NAME",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.name"
              }
            }
          }, {
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }, {
            name: "LD_PRELOAD",
            value: "/usr/local/lib/libmimalloc.so"
          }],
          image: "registry.k8s.io/ingress-nginx/controller:v1.11.2@sha256:d5f8217feeac4887cb1ed21f27c2674e58be06bd8f5184cacea2a69abaf78dce",
          imagePullPolicy: "IfNotPresent",
          lifecycle: {
            preStop: {
              exec: {
                command: ["/wait-shutdown"]
              }
            }
          },
          livenessProbe: {
            failureThreshold: 5,
            httpGet: {
              path: "/healthz",
              port: 10254,
              scheme: "HTTP"
            },
            initialDelaySeconds: 10,
            periodSeconds: 10,
            successThreshold: 1,
            timeoutSeconds: 1
          },
          name: "controller",
          ports: [{
            containerPort: 80,
            name: "http",
            protocol: "TCP"
          }, {
            containerPort: 443,
            name: "https",
            protocol: "TCP"
          }, {
            containerPort: 10254,
            name: "metrics",
            protocol: "TCP"
          }, {
            containerPort: 8443,
            name: "webhook",
            protocol: "TCP"
          }],
          readinessProbe: {
            failureThreshold: 3,
            httpGet: {
              path: "/healthz",
              port: 10254,
              scheme: "HTTP"
            },
            initialDelaySeconds: 10,
            periodSeconds: 10,
            successThreshold: 1,
            timeoutSeconds: 1
          },
          resources: {
            requests: {
              cpu: "100m",
              memory: "90Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              add: ["NET_BIND_SERVICE"],
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: false,
            runAsNonRoot: true,
            runAsUser: 101,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          },
          volumeMounts: [{
            mountPath: "/usr/local/certificates/",
            name: "webhook-cert",
            readOnly: true
          }]
        }],
        dnsPolicy: "ClusterFirst",
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        serviceAccountName: "ingress-nginx",
        terminationGracePeriodSeconds: 300,
        volumes: [{
          name: "webhook-cert",
          secret: {
            secretName: "ingress-nginx-admission"
          }
        }]
      }
    }
  }
};
export const IngressClass_Nginx: NetworkingK8sIoV1IngressClass = {
  apiVersion: "networking.k8s.io/v1",
  kind: "IngressClass",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "nginx"
  },
  spec: {
    controller: "k8s.io/ingress-nginx"
  }
};
export const ValidatingWebhookConfiguration_IngressNginxAdmission: AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration = {
  apiVersion: "admissionregistration.k8s.io/v1",
  kind: "ValidatingWebhookConfiguration",
  metadata: {
    annotations: null,
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission"
  },
  webhooks: [{
    admissionReviewVersions: ["v1"],
    clientConfig: {
      service: {
        name: "ingress-nginx-controller-admission",
        namespace: "ingress-nginx",
        path: "/networking/v1/ingresses"
      }
    },
    failurePolicy: "Fail",
    matchPolicy: "Equivalent",
    name: "validate.nginx.ingress.kubernetes.io",
    rules: [{
      apiGroups: ["networking.k8s.io"],
      apiVersions: ["v1"],
      operations: ["CREATE", "UPDATE"],
      resources: ["ingresses"]
    }],
    sideEffects: "None"
  }]
};
export const ServiceAccount_IngressNginxAdmission: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    annotations: {
      "helm.sh/hook": "pre-install,pre-upgrade,post-install,post-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission",
    namespace: "ingress-nginx"
  },
  automountServiceAccountToken: true
};
export const ClusterRole_IngressNginxAdmission: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    annotations: {
      "helm.sh/hook": "pre-install,pre-upgrade,post-install,post-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission"
  },
  rules: [{
    apiGroups: ["admissionregistration.k8s.io"],
    resources: ["validatingwebhookconfigurations"],
    verbs: ["get", "update"]
  }]
};
export const ClusterRoleBinding_IngressNginxAdmission: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    annotations: {
      "helm.sh/hook": "pre-install,pre-upgrade,post-install,post-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "ingress-nginx-admission"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "ingress-nginx-admission",
    namespace: "ingress-nginx"
  }]
};
export const Role_IngressNginxAdmission: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    annotations: {
      "helm.sh/hook": "pre-install,pre-upgrade,post-install,post-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission",
    namespace: "ingress-nginx"
  },
  rules: [{
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "create"]
  }]
};
export const RoleBinding_IngressNginxAdmission: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    annotations: {
      "helm.sh/hook": "pre-install,pre-upgrade,post-install,post-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission",
    namespace: "ingress-nginx"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "ingress-nginx-admission"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "ingress-nginx-admission",
    namespace: "ingress-nginx"
  }]
};
export const Job_IngressNginxAdmissionCreate: BatchV1Job = {
  apiVersion: "batch/v1",
  kind: "Job",
  metadata: {
    annotations: {
      "helm.sh/hook": "pre-install,pre-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission-create",
    namespace: "ingress-nginx"
  },
  spec: {
    template: {
      metadata: {
        labels: {
          "app.kubernetes.io/component": "admission-webhook",
          "app.kubernetes.io/instance": "ingress-nginx",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "ingress-nginx",
          "app.kubernetes.io/part-of": "ingress-nginx",
          "app.kubernetes.io/version": "1.11.2",
          "helm.sh/chart": "ingress-nginx-4.11.2"
        },
        name: "ingress-nginx-admission-create"
      },
      spec: {
        containers: [{
          args: ["create", "--host=ingress-nginx-controller-admission,ingress-nginx-controller-admission.$(POD_NAMESPACE).svc", "--namespace=$(POD_NAMESPACE)", "--secret-name=ingress-nginx-admission"],
          env: [{
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }],
          image: "registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.4.3@sha256:a320a50cc91bd15fd2d6fa6de58bd98c1bd64b9a6f926ce23a600d87043455a3",
          imagePullPolicy: "IfNotPresent",
          name: "create",
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            runAsUser: 65532,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        restartPolicy: "OnFailure",
        serviceAccountName: "ingress-nginx-admission"
      }
    }
  }
};
export const Job_IngressNginxAdmissionPatch: BatchV1Job = {
  apiVersion: "batch/v1",
  kind: "Job",
  metadata: {
    annotations: {
      "helm.sh/hook": "post-install,post-upgrade",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded"
    },
    labels: {
      "app.kubernetes.io/component": "admission-webhook",
      "app.kubernetes.io/instance": "ingress-nginx",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "ingress-nginx",
      "app.kubernetes.io/part-of": "ingress-nginx",
      "app.kubernetes.io/version": "1.11.2",
      "helm.sh/chart": "ingress-nginx-4.11.2"
    },
    name: "ingress-nginx-admission-patch",
    namespace: "ingress-nginx"
  },
  spec: {
    template: {
      metadata: {
        labels: {
          "app.kubernetes.io/component": "admission-webhook",
          "app.kubernetes.io/instance": "ingress-nginx",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "ingress-nginx",
          "app.kubernetes.io/part-of": "ingress-nginx",
          "app.kubernetes.io/version": "1.11.2",
          "helm.sh/chart": "ingress-nginx-4.11.2"
        },
        name: "ingress-nginx-admission-patch"
      },
      spec: {
        containers: [{
          args: ["patch", "--webhook-name=ingress-nginx-admission", "--namespace=$(POD_NAMESPACE)", "--patch-mutating=false", "--secret-name=ingress-nginx-admission", "--patch-failure-policy=Fail"],
          env: [{
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }],
          image: "registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.4.3@sha256:a320a50cc91bd15fd2d6fa6de58bd98c1bd64b9a6f926ce23a600d87043455a3",
          imagePullPolicy: "IfNotPresent",
          name: "patch",
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            runAsUser: 65532,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        restartPolicy: "OnFailure",
        serviceAccountName: "ingress-nginx-admission"
      }
    }
  }
};
export const resources: ReadonlyArray<KubernetesResource> = [Namespace_IngressNginx, ServiceAccount_IngressNginx, ConfigMap_IngressNginxController, ClusterRole_IngressNginx, ClusterRoleBinding_IngressNginx, Role_IngressNginx, RoleBinding_IngressNginx, Service_IngressNginxControllerMetrics, Service_IngressNginxControllerAdmission, Service_IngressNginxController, Deployment_IngressNginxController, IngressClass_Nginx, ValidatingWebhookConfiguration_IngressNginxAdmission, ServiceAccount_IngressNginxAdmission, ClusterRole_IngressNginxAdmission, ClusterRoleBinding_IngressNginxAdmission, Role_IngressNginxAdmission, RoleBinding_IngressNginxAdmission, Job_IngressNginxAdmissionCreate, Job_IngressNginxAdmissionPatch];
export default {
  resources: resources
};
