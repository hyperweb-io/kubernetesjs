/** Auto-generated typed resources for operator: knative-serving*/
import type { KubernetesResource, AdmissionregistrationK8sIoV1MutatingWebhookConfiguration, AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration, ApiextensionsK8sIoV1CustomResourceDefinition, AppsV1Deployment, AutoscalingV2HorizontalPodAutoscaler, CachingInternalKnativeDevV1alpha1Image, ConfigMap, Namespace, NetworkingInternalKnativeDevV1alpha1Certificate, PolicyV1PodDisruptionBudget, RbacAuthorizationK8sIoV1ClusterRole, RbacAuthorizationK8sIoV1ClusterRoleBinding, RbacAuthorizationK8sIoV1Role, RbacAuthorizationK8sIoV1RoleBinding, Secret, Service, ServiceAccount } from "@interweb/interwebjs";
export const CustomResourceDefinition_CertificatesNetworkingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "networking",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "certificates.networking.internal.knative.dev"
  },
  spec: {
    group: "networking.internal.knative.dev",
    names: {
      categories: ["knative-internal", "networking"],
      kind: "Certificate",
      plural: "certificates",
      shortNames: ["kcert"],
      singular: "certificate"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "Certificate is responsible for provisioning a SSL certificate for the\ngiven hosts. It is a Knative abstraction for various SSL certificate\nprovisioning solutions (such as cert-manager or self-signed SSL certificate).",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec is the desired state of the Certificate.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                dnsNames: {
                  description: "DNSNames is a list of DNS names the Certificate could support.\nThe wildcard format of DNSNames (e.g. *.default.example.com) is supported.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                domain: {
                  description: "Domain is the top level domain of the values for DNSNames.",
                  type: "string"
                },
                secretName: {
                  description: "SecretName is the name of the secret resource to store the SSL certificate in.",
                  type: "string"
                }
              },
              required: ["dnsNames", "secretName"],
              type: "object"
            },
            status: {
              description: "Status is the current state of the Certificate.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                http01Challenges: {
                  description: "HTTP01Challenges is a list of HTTP01 challenges that need to be fulfilled\nin order to get the TLS certificate..",
                  items: {
                    description: "HTTP01Challenge defines the status of a HTTP01 challenge that a certificate needs\nto fulfill.",
                    properties: {
                      serviceName: {
                        description: "ServiceName is the name of the service to serve HTTP01 challenge requests.",
                        type: "string"
                      },
                      serviceNamespace: {
                        description: "ServiceNamespace is the namespace of the service to serve HTTP01 challenge requests.",
                        type: "string"
                      },
                      servicePort: {
                        anyOf: [{
                          type: "integer"
                        }, {
                          type: "string"
                        }],
                        description: "ServicePort is the port of the service to serve HTTP01 challenge requests.",
                        "x-kubernetes-int-or-string": true
                      },
                      url: {
                        description: "URL is the URL that the HTTP01 challenge is expected to serve on.",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                notAfter: {
                  description: "The expiration time of the TLS certificate stored in the secret named\nby this resource in spec.secretName.",
                  format: "date-time",
                  type: "string"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_ConfigurationsServingKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "duck.knative.dev/podspecable": "true",
      "knative.dev/crd-install": "true"
    },
    name: "configurations.serving.knative.dev"
  },
  spec: {
    group: "serving.knative.dev",
    names: {
      categories: ["all", "knative", "serving"],
      kind: "Configuration",
      plural: "configurations",
      shortNames: ["config", "cfg"],
      singular: "configuration"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.latestCreatedRevisionName",
        name: "LatestCreated",
        type: "string"
      }, {
        jsonPath: ".status.latestReadyRevisionName",
        name: "LatestReady",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "Configuration represents the \"floating HEAD\" of a linear history of Revisions.\nUsers create new Revisions by updating the Configuration's spec.\nThe \"latest created\" revision's name is available under status, as is the\n\"latest ready\" revision's name.\nSee also: https://github.com/knative/serving/blob/main/docs/spec/overview.md#configuration",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "ConfigurationSpec holds the desired state of the Configuration (from the client).",
              properties: {
                template: {
                  description: "Template holds the latest specification for the Revision to be stamped out.",
                  properties: {
                    metadata: {
                      properties: {
                        annotations: {
                          additionalProperties: {
                            type: "string"
                          },
                          type: "object"
                        },
                        finalizers: {
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        labels: {
                          additionalProperties: {
                            type: "string"
                          },
                          type: "object"
                        },
                        name: {
                          type: "string"
                        },
                        namespace: {
                          type: "string"
                        }
                      },
                      type: "object",
                      "x-kubernetes-preserve-unknown-fields": true
                    },
                    spec: {
                      description: "RevisionSpec holds the desired state of the Revision (from the client).",
                      properties: {
                        affinity: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-affinity",
                          type: "object",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        automountServiceAccountToken: {
                          description: "AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.",
                          type: "boolean"
                        },
                        containerConcurrency: {
                          description: "ContainerConcurrency specifies the maximum allowed in-flight (concurrent)\nrequests per container of the Revision.  Defaults to `0` which means\nconcurrency to the application is not limited, and the system decides the\ntarget concurrency for the autoscaler.",
                          format: "int64",
                          type: "integer"
                        },
                        containers: {
                          description: "List of containers belonging to the pod.\nContainers cannot currently be added or removed.\nThere must be at least one container in a Pod.\nCannot be updated.",
                          items: {
                            description: "A single application container that you want to run within a pod.",
                            properties: {
                              args: {
                                description: "Arguments to the entrypoint.\nThe container image's CMD is used if this is not provided.\nVariable references $(VAR_NAME) are expanded using the container's environment. If a variable\ncannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. \"$$(VAR_NAME)\" will\nproduce the string literal \"$(VAR_NAME)\". Escaped references will never be expanded, regardless\nof whether the variable exists or not. Cannot be updated.\nMore info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              command: {
                                description: "Entrypoint array. Not executed within a shell.\nThe container image's ENTRYPOINT is used if this is not provided.\nVariable references $(VAR_NAME) are expanded using the container's environment. If a variable\ncannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. \"$$(VAR_NAME)\" will\nproduce the string literal \"$(VAR_NAME)\". Escaped references will never be expanded, regardless\nof whether the variable exists or not. Cannot be updated.\nMore info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              env: {
                                description: "List of environment variables to set in the container.\nCannot be updated.",
                                items: {
                                  description: "EnvVar represents an environment variable present in a Container.",
                                  properties: {
                                    name: {
                                      description: "Name of the environment variable. Must be a C_IDENTIFIER.",
                                      type: "string"
                                    },
                                    value: {
                                      description: "Variable references $(VAR_NAME) are expanded\nusing the previously defined environment variables in the container and\nany service environment variables. If a variable cannot be resolved,\nthe reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e.\n\"$$(VAR_NAME)\" will produce the string literal \"$(VAR_NAME)\".\nEscaped references will never be expanded, regardless of whether the variable\nexists or not.\nDefaults to \"\".",
                                      type: "string"
                                    },
                                    valueFrom: {
                                      description: "Source for the environment variable's value. Cannot be used if value is not empty.",
                                      properties: {
                                        configMapKeyRef: {
                                          description: "Selects a key of a ConfigMap.",
                                          properties: {
                                            key: {
                                              description: "The key to select.",
                                              type: "string"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "Specify whether the ConfigMap or its key must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          required: ["key"],
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        },
                                        fieldRef: {
                                          description: "This is accessible behind a feature flag - kubernetes.podspec-fieldref",
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic",
                                          "x-kubernetes-preserve-unknown-fields": true
                                        },
                                        resourceFieldRef: {
                                          description: "This is accessible behind a feature flag - kubernetes.podspec-fieldref",
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic",
                                          "x-kubernetes-preserve-unknown-fields": true
                                        },
                                        secretKeyRef: {
                                          description: "Selects a key of a secret in the pod's namespace",
                                          properties: {
                                            key: {
                                              description: "The key of the secret to select from.  Must be a valid secret key.",
                                              type: "string"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "Specify whether the Secret or its key must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          required: ["key"],
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        }
                                      },
                                      type: "object"
                                    }
                                  },
                                  required: ["name"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              envFrom: {
                                description: "List of sources to populate environment variables in the container.\nThe keys defined within a source must be a C_IDENTIFIER. All invalid keys\nwill be reported as an event when the container is starting. When a key exists in multiple\nsources, the value associated with the last source will take precedence.\nValues defined by an Env with a duplicate key will take precedence.\nCannot be updated.",
                                items: {
                                  description: "EnvFromSource represents the source of a set of ConfigMaps",
                                  properties: {
                                    configMapRef: {
                                      description: "The ConfigMap to select from",
                                      properties: {
                                        name: {
                                          description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                          type: "string"
                                        },
                                        optional: {
                                          description: "Specify whether the ConfigMap must be defined",
                                          type: "boolean"
                                        }
                                      },
                                      type: "object",
                                      "x-kubernetes-map-type": "atomic"
                                    },
                                    prefix: {
                                      description: "An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.",
                                      type: "string"
                                    },
                                    secretRef: {
                                      description: "The Secret to select from",
                                      properties: {
                                        name: {
                                          description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                          type: "string"
                                        },
                                        optional: {
                                          description: "Specify whether the Secret must be defined",
                                          type: "boolean"
                                        }
                                      },
                                      type: "object",
                                      "x-kubernetes-map-type": "atomic"
                                    }
                                  },
                                  type: "object"
                                },
                                type: "array"
                              },
                              image: {
                                description: "Container image name.\nMore info: https://kubernetes.io/docs/concepts/containers/images\nThis field is optional to allow higher level config management to default or override\ncontainer images in workload controllers like Deployments and StatefulSets.",
                                type: "string"
                              },
                              imagePullPolicy: {
                                description: "Image pull policy.\nOne of Always, Never, IfNotPresent.\nDefaults to Always if :latest tag is specified, or IfNotPresent otherwise.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/containers/images#updating-images",
                                type: "string"
                              },
                              livenessProbe: {
                                description: "Periodic probe of container liveness.\nContainer will be restarted if the probe fails.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                properties: {
                                  exec: {
                                    description: "Exec specifies the action to take.",
                                    properties: {
                                      command: {
                                        description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                        items: {
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  failureThreshold: {
                                    description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  grpc: {
                                    description: "GRPC specifies an action involving a GRPC port.",
                                    properties: {
                                      port: {
                                        description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                        format: "int32",
                                        type: "integer"
                                      },
                                      service: {
                                        description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                        type: "string"
                                      }
                                    },
                                    required: ["port"],
                                    type: "object"
                                  },
                                  httpGet: {
                                    description: "HTTPGet specifies the http request to perform.",
                                    properties: {
                                      host: {
                                        description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                        type: "string"
                                      },
                                      httpHeaders: {
                                        description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                        items: {
                                          description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                          properties: {
                                            name: {
                                              description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                              type: "string"
                                            },
                                            value: {
                                              description: "The header field value",
                                              type: "string"
                                            }
                                          },
                                          required: ["name", "value"],
                                          type: "object"
                                        },
                                        type: "array"
                                      },
                                      path: {
                                        description: "Path to access on the HTTP server.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      },
                                      scheme: {
                                        description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  initialDelaySeconds: {
                                    description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  periodSeconds: {
                                    description: "How often (in seconds) to perform the probe.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  successThreshold: {
                                    description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  tcpSocket: {
                                    description: "TCPSocket specifies an action involving a TCP port.",
                                    properties: {
                                      host: {
                                        description: "Optional: Host name to connect to, defaults to the pod IP.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    type: "object"
                                  },
                                  timeoutSeconds: {
                                    description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  }
                                },
                                type: "object"
                              },
                              name: {
                                description: "Name of the container specified as a DNS_LABEL.\nEach container in a pod must have a unique name (DNS_LABEL).\nCannot be updated.",
                                type: "string"
                              },
                              ports: {
                                description: "List of ports to expose from the container. Not specifying a port here\nDOES NOT prevent that port from being exposed. Any port which is\nlistening on the default \"0.0.0.0\" address inside a container will be\naccessible from the network.\nModifying this array with strategic merge patch may corrupt the data.\nFor more information See https://github.com/kubernetes/kubernetes/issues/108255.\nCannot be updated.",
                                items: {
                                  description: "ContainerPort represents a network port in a single container.",
                                  properties: {
                                    containerPort: {
                                      description: "Number of port to expose on the pod's IP address.\nThis must be a valid port number, 0 < x < 65536.",
                                      format: "int32",
                                      type: "integer"
                                    },
                                    name: {
                                      description: "If specified, this must be an IANA_SVC_NAME and unique within the pod. Each\nnamed port in a pod must have a unique name. Name for the port that can be\nreferred to by services.",
                                      type: "string"
                                    },
                                    protocol: {
                                      default: "TCP",
                                      description: "Protocol for port. Must be UDP, TCP, or SCTP.\nDefaults to \"TCP\".",
                                      type: "string"
                                    }
                                  },
                                  required: ["containerPort"],
                                  type: "object"
                                },
                                type: "array",
                                "x-kubernetes-list-map-keys": ["containerPort", "protocol"],
                                "x-kubernetes-list-type": "map"
                              },
                              readinessProbe: {
                                description: "Periodic probe of container service readiness.\nContainer will be removed from service endpoints if the probe fails.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                properties: {
                                  exec: {
                                    description: "Exec specifies the action to take.",
                                    properties: {
                                      command: {
                                        description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                        items: {
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  failureThreshold: {
                                    description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  grpc: {
                                    description: "GRPC specifies an action involving a GRPC port.",
                                    properties: {
                                      port: {
                                        description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                        format: "int32",
                                        type: "integer"
                                      },
                                      service: {
                                        description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                        type: "string"
                                      }
                                    },
                                    required: ["port"],
                                    type: "object"
                                  },
                                  httpGet: {
                                    description: "HTTPGet specifies the http request to perform.",
                                    properties: {
                                      host: {
                                        description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                        type: "string"
                                      },
                                      httpHeaders: {
                                        description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                        items: {
                                          description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                          properties: {
                                            name: {
                                              description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                              type: "string"
                                            },
                                            value: {
                                              description: "The header field value",
                                              type: "string"
                                            }
                                          },
                                          required: ["name", "value"],
                                          type: "object"
                                        },
                                        type: "array"
                                      },
                                      path: {
                                        description: "Path to access on the HTTP server.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      },
                                      scheme: {
                                        description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  initialDelaySeconds: {
                                    description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  periodSeconds: {
                                    description: "How often (in seconds) to perform the probe.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  successThreshold: {
                                    description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  tcpSocket: {
                                    description: "TCPSocket specifies an action involving a TCP port.",
                                    properties: {
                                      host: {
                                        description: "Optional: Host name to connect to, defaults to the pod IP.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    type: "object"
                                  },
                                  timeoutSeconds: {
                                    description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  }
                                },
                                type: "object"
                              },
                              resources: {
                                description: "Compute Resources required by this container.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                                properties: {
                                  claims: {
                                    description: "Claims lists the names of resources, defined in spec.resourceClaims,\nthat are used by this container.\n\n\nThis is an alpha field and requires enabling the\nDynamicResourceAllocation feature gate.\n\n\nThis field is immutable. It can only be set for containers.",
                                    items: {
                                      description: "ResourceClaim references one entry in PodSpec.ResourceClaims.",
                                      properties: {
                                        name: {
                                          description: "Name must match the name of one entry in pod.spec.resourceClaims of\nthe Pod where this field is used. It makes that resource available\ninside a container.",
                                          type: "string"
                                        }
                                      },
                                      required: ["name"],
                                      type: "object"
                                    },
                                    type: "array",
                                    "x-kubernetes-list-map-keys": ["name"],
                                    "x-kubernetes-list-type": "map"
                                  },
                                  limits: {
                                    additionalProperties: {
                                      anyOf: [{
                                        type: "integer"
                                      }, {
                                        type: "string"
                                      }],
                                      pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                      "x-kubernetes-int-or-string": true
                                    },
                                    description: "Limits describes the maximum amount of compute resources allowed.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                                    type: "object"
                                  },
                                  requests: {
                                    additionalProperties: {
                                      anyOf: [{
                                        type: "integer"
                                      }, {
                                        type: "string"
                                      }],
                                      pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                      "x-kubernetes-int-or-string": true
                                    },
                                    description: "Requests describes the minimum amount of compute resources required.\nIf Requests is omitted for a container, it defaults to Limits if that is explicitly specified,\notherwise to an implementation-defined value. Requests cannot exceed Limits.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                                    type: "object"
                                  }
                                },
                                type: "object"
                              },
                              securityContext: {
                                description: "SecurityContext defines the security options the container should be run with.\nIf set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.\nMore info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/",
                                properties: {
                                  allowPrivilegeEscalation: {
                                    description: "AllowPrivilegeEscalation controls whether a process can gain more\nprivileges than its parent process. This bool directly controls if\nthe no_new_privs flag will be set on the container process.\nAllowPrivilegeEscalation is true always when the container is:\n1) run as Privileged\n2) has CAP_SYS_ADMIN\nNote that this field cannot be set when spec.os.name is windows.",
                                    type: "boolean"
                                  },
                                  capabilities: {
                                    description: "The capabilities to add/drop when running containers.\nDefaults to the default set of capabilities granted by the container runtime.\nNote that this field cannot be set when spec.os.name is windows.",
                                    properties: {
                                      add: {
                                        description: "This is accessible behind a feature flag - kubernetes.containerspec-addcapabilities",
                                        items: {
                                          description: "Capability represent POSIX capabilities type",
                                          type: "string"
                                        },
                                        type: "array"
                                      },
                                      drop: {
                                        description: "Removed capabilities",
                                        items: {
                                          description: "Capability represent POSIX capabilities type",
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  readOnlyRootFilesystem: {
                                    description: "Whether this container has a read-only root filesystem.\nDefault is false.\nNote that this field cannot be set when spec.os.name is windows.",
                                    type: "boolean"
                                  },
                                  runAsGroup: {
                                    description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.\nNote that this field cannot be set when spec.os.name is windows.",
                                    format: "int64",
                                    type: "integer"
                                  },
                                  runAsNonRoot: {
                                    description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                    type: "boolean"
                                  },
                                  runAsUser: {
                                    description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.\nNote that this field cannot be set when spec.os.name is windows.",
                                    format: "int64",
                                    type: "integer"
                                  },
                                  seccompProfile: {
                                    description: "The seccomp options to use by this container. If seccomp options are\nprovided at both the pod & container level, the container options\noverride the pod options.\nNote that this field cannot be set when spec.os.name is windows.",
                                    properties: {
                                      localhostProfile: {
                                        description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                        type: "string"
                                      },
                                      type: {
                                        description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                        type: "string"
                                      }
                                    },
                                    required: ["type"],
                                    type: "object"
                                  }
                                },
                                type: "object"
                              },
                              startupProbe: {
                                description: "StartupProbe indicates that the Pod has successfully initialized.\nIf specified, no other probes are executed until this completes successfully.\nIf this probe fails, the Pod will be restarted, just as if the livenessProbe failed.\nThis can be used to provide different probe parameters at the beginning of a Pod's lifecycle,\nwhen it might take a long time to load data or warm a cache, than during steady-state operation.\nThis cannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                properties: {
                                  exec: {
                                    description: "Exec specifies the action to take.",
                                    properties: {
                                      command: {
                                        description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                        items: {
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  failureThreshold: {
                                    description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  grpc: {
                                    description: "GRPC specifies an action involving a GRPC port.",
                                    properties: {
                                      port: {
                                        description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                        format: "int32",
                                        type: "integer"
                                      },
                                      service: {
                                        description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                        type: "string"
                                      }
                                    },
                                    required: ["port"],
                                    type: "object"
                                  },
                                  httpGet: {
                                    description: "HTTPGet specifies the http request to perform.",
                                    properties: {
                                      host: {
                                        description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                        type: "string"
                                      },
                                      httpHeaders: {
                                        description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                        items: {
                                          description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                          properties: {
                                            name: {
                                              description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                              type: "string"
                                            },
                                            value: {
                                              description: "The header field value",
                                              type: "string"
                                            }
                                          },
                                          required: ["name", "value"],
                                          type: "object"
                                        },
                                        type: "array"
                                      },
                                      path: {
                                        description: "Path to access on the HTTP server.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      },
                                      scheme: {
                                        description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  initialDelaySeconds: {
                                    description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  periodSeconds: {
                                    description: "How often (in seconds) to perform the probe.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  successThreshold: {
                                    description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  tcpSocket: {
                                    description: "TCPSocket specifies an action involving a TCP port.",
                                    properties: {
                                      host: {
                                        description: "Optional: Host name to connect to, defaults to the pod IP.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    type: "object"
                                  },
                                  timeoutSeconds: {
                                    description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  }
                                },
                                type: "object"
                              },
                              terminationMessagePath: {
                                description: "Optional: Path at which the file to which the container's termination message\nwill be written is mounted into the container's filesystem.\nMessage written is intended to be brief final status, such as an assertion failure message.\nWill be truncated by the node if greater than 4096 bytes. The total message length across\nall containers will be limited to 12kb.\nDefaults to /dev/termination-log.\nCannot be updated.",
                                type: "string"
                              },
                              terminationMessagePolicy: {
                                description: "Indicate how the termination message should be populated. File will use the contents of\nterminationMessagePath to populate the container status message on both success and failure.\nFallbackToLogsOnError will use the last chunk of container log output if the termination\nmessage file is empty and the container exited with an error.\nThe log output is limited to 2048 bytes or 80 lines, whichever is smaller.\nDefaults to File.\nCannot be updated.",
                                type: "string"
                              },
                              volumeMounts: {
                                description: "Pod volumes to mount into the container's filesystem.\nCannot be updated.",
                                items: {
                                  description: "VolumeMount describes a mounting of a Volume within a container.",
                                  properties: {
                                    mountPath: {
                                      description: "Path within the container at which the volume should be mounted.  Must\nnot contain ':'.",
                                      type: "string"
                                    },
                                    name: {
                                      description: "This must match the Name of a Volume.",
                                      type: "string"
                                    },
                                    readOnly: {
                                      description: "Mounted read-only if true, read-write otherwise (false or unspecified).\nDefaults to false.",
                                      type: "boolean"
                                    },
                                    subPath: {
                                      description: "Path within the volume from which the container's volume should be mounted.\nDefaults to \"\" (volume's root).",
                                      type: "string"
                                    }
                                  },
                                  required: ["mountPath", "name"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              workingDir: {
                                description: "Container's working directory.\nIf not specified, the container runtime's default will be used, which\nmight be configured in the container image.\nCannot be updated.",
                                type: "string"
                              }
                            },
                            type: "object"
                          },
                          type: "array"
                        },
                        dnsConfig: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-dnsconfig",
                          type: "object",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        dnsPolicy: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-dnspolicy",
                          type: "string"
                        },
                        enableServiceLinks: {
                          description: "EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Knative defaults this to false.",
                          type: "boolean"
                        },
                        hostAliases: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-hostaliases",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-hostaliases",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        idleTimeoutSeconds: {
                          description: "IdleTimeoutSeconds is the maximum duration in seconds a request will be allowed\nto stay open while not receiving any bytes from the user's application. If\nunspecified, a system default will be provided.",
                          format: "int64",
                          type: "integer"
                        },
                        imagePullSecrets: {
                          description: "ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec.\nIf specified, these secrets will be passed to individual puller implementations for them to use.\nMore info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod",
                          items: {
                            description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                            properties: {
                              name: {
                                description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                type: "string"
                              }
                            },
                            type: "object",
                            "x-kubernetes-map-type": "atomic"
                          },
                          type: "array"
                        },
                        initContainers: {
                          description: "List of initialization containers belonging to the pod.\nInit containers are executed in order prior to containers being started. If any\ninit container fails, the pod is considered to have failed and is handled according\nto its restartPolicy. The name for an init container or normal container must be\nunique among all containers.\nInit containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.\nThe resourceRequirements of an init container are taken into account during scheduling\nby finding the highest request/limit for each resource type, and then using the max of\nof that value or the sum of the normal containers. Limits are applied to init containers\nin a similar fashion.\nInit containers cannot currently be added or removed.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-init-containers",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        nodeSelector: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-nodeselector",
                          type: "object",
                          "x-kubernetes-map-type": "atomic",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        priorityClassName: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-priorityclassname",
                          type: "string",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        responseStartTimeoutSeconds: {
                          description: "ResponseStartTimeoutSeconds is the maximum duration in seconds that the request\nrouting layer will wait for a request delivered to a container to begin\nsending any network traffic.",
                          format: "int64",
                          type: "integer"
                        },
                        runtimeClassName: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-runtimeclassname",
                          type: "string",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        schedulerName: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-schedulername",
                          type: "string",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        securityContext: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-securitycontext",
                          type: "object",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        serviceAccountName: {
                          description: "ServiceAccountName is the name of the ServiceAccount to use to run this pod.\nMore info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
                          type: "string"
                        },
                        shareProcessNamespace: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-shareproccessnamespace",
                          type: "boolean",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        timeoutSeconds: {
                          description: "TimeoutSeconds is the maximum duration in seconds that the request instance\nis allowed to respond to a request. If unspecified, a system default will\nbe provided.",
                          format: "int64",
                          type: "integer"
                        },
                        tolerations: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-tolerations",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-tolerations",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        topologySpreadConstraints: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-topologyspreadconstraints",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-topologyspreadconstraints",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        volumes: {
                          description: "List of volumes that can be mounted by containers belonging to the pod.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes",
                          items: {
                            description: "Volume represents a named volume in a pod that may be accessed by any container in the pod.",
                            properties: {
                              configMap: {
                                description: "configMap represents a configMap that should populate this volume",
                                properties: {
                                  defaultMode: {
                                    description: "defaultMode is optional: mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nDefaults to 0644.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  items: {
                                    description: "items if unspecified, each key-value pair in the Data field of the referenced\nConfigMap will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the ConfigMap,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                    items: {
                                      description: "Maps a string key to a path within a volume.",
                                      properties: {
                                        key: {
                                          description: "key is the key to project.",
                                          type: "string"
                                        },
                                        mode: {
                                          description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                          format: "int32",
                                          type: "integer"
                                        },
                                        path: {
                                          description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                          type: "string"
                                        }
                                      },
                                      required: ["key", "path"],
                                      type: "object"
                                    },
                                    type: "array"
                                  },
                                  name: {
                                    description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                    type: "string"
                                  },
                                  optional: {
                                    description: "optional specify whether the ConfigMap or its keys must be defined",
                                    type: "boolean"
                                  }
                                },
                                type: "object",
                                "x-kubernetes-map-type": "atomic"
                              },
                              emptyDir: {
                                description: "This is accessible behind a feature flag - kubernetes.podspec-emptydir",
                                type: "object",
                                "x-kubernetes-preserve-unknown-fields": true
                              },
                              name: {
                                description: "name of the volume.\nMust be a DNS_LABEL and unique within the pod.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                type: "string"
                              },
                              persistentVolumeClaim: {
                                description: "This is accessible behind a feature flag - kubernetes.podspec-persistent-volume-claim",
                                type: "object",
                                "x-kubernetes-preserve-unknown-fields": true
                              },
                              projected: {
                                description: "projected items for all in one resources secrets, configmaps, and downward API",
                                properties: {
                                  defaultMode: {
                                    description: "defaultMode are the mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  sources: {
                                    description: "sources is the list of volume projections",
                                    items: {
                                      description: "Projection that may be projected along with other supported volume types",
                                      properties: {
                                        configMap: {
                                          description: "configMap information about the configMap data to project",
                                          properties: {
                                            items: {
                                              description: "items if unspecified, each key-value pair in the Data field of the referenced\nConfigMap will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the ConfigMap,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                              items: {
                                                description: "Maps a string key to a path within a volume.",
                                                properties: {
                                                  key: {
                                                    description: "key is the key to project.",
                                                    type: "string"
                                                  },
                                                  mode: {
                                                    description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                                    format: "int32",
                                                    type: "integer"
                                                  },
                                                  path: {
                                                    description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["key", "path"],
                                                type: "object"
                                              },
                                              type: "array"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "optional specify whether the ConfigMap or its keys must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        },
                                        downwardAPI: {
                                          description: "downwardAPI information about the downwardAPI data to project",
                                          properties: {
                                            items: {
                                              description: "Items is a list of DownwardAPIVolume file",
                                              items: {
                                                description: "DownwardAPIVolumeFile represents information to create the file containing the pod field",
                                                properties: {
                                                  fieldRef: {
                                                    description: "Required: Selects a field of the pod: only annotations, labels, name and namespace are supported.",
                                                    properties: {
                                                      apiVersion: {
                                                        description: "Version of the schema the FieldPath is written in terms of, defaults to \"v1\".",
                                                        type: "string"
                                                      },
                                                      fieldPath: {
                                                        description: "Path of the field to select in the specified API version.",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["fieldPath"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  mode: {
                                                    description: "Optional: mode bits used to set permissions on this file, must be an octal value\nbetween 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                                    format: "int32",
                                                    type: "integer"
                                                  },
                                                  path: {
                                                    description: "Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'",
                                                    type: "string"
                                                  },
                                                  resourceFieldRef: {
                                                    description: "Selects a resource of the container: only resources limits and requests\n(limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.",
                                                    properties: {
                                                      containerName: {
                                                        description: "Container name: required for volumes, optional for env vars",
                                                        type: "string"
                                                      },
                                                      divisor: {
                                                        anyOf: [{
                                                          type: "integer"
                                                        }, {
                                                          type: "string"
                                                        }],
                                                        description: "Specifies the output format of the exposed resources, defaults to \"1\"",
                                                        pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                                        "x-kubernetes-int-or-string": true
                                                      },
                                                      resource: {
                                                        description: "Required: resource to select",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["resource"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  }
                                                },
                                                required: ["path"],
                                                type: "object"
                                              },
                                              type: "array"
                                            }
                                          },
                                          type: "object"
                                        },
                                        secret: {
                                          description: "secret information about the secret data to project",
                                          properties: {
                                            items: {
                                              description: "items if unspecified, each key-value pair in the Data field of the referenced\nSecret will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the Secret,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                              items: {
                                                description: "Maps a string key to a path within a volume.",
                                                properties: {
                                                  key: {
                                                    description: "key is the key to project.",
                                                    type: "string"
                                                  },
                                                  mode: {
                                                    description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                                    format: "int32",
                                                    type: "integer"
                                                  },
                                                  path: {
                                                    description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["key", "path"],
                                                type: "object"
                                              },
                                              type: "array"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "optional field specify whether the Secret or its key must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        },
                                        serviceAccountToken: {
                                          description: "serviceAccountToken is information about the serviceAccountToken data to project",
                                          properties: {
                                            audience: {
                                              description: "audience is the intended audience of the token. A recipient of a token\nmust identify itself with an identifier specified in the audience of the\ntoken, and otherwise should reject the token. The audience defaults to the\nidentifier of the apiserver.",
                                              type: "string"
                                            },
                                            expirationSeconds: {
                                              description: "expirationSeconds is the requested duration of validity of the service\naccount token. As the token approaches expiration, the kubelet volume\nplugin will proactively rotate the service account token. The kubelet will\nstart trying to rotate the token if the token is older than 80 percent of\nits time to live or if the token is older than 24 hours.Defaults to 1 hour\nand must be at least 10 minutes.",
                                              format: "int64",
                                              type: "integer"
                                            },
                                            path: {
                                              description: "path is the path relative to the mount point of the file to project the\ntoken into.",
                                              type: "string"
                                            }
                                          },
                                          required: ["path"],
                                          type: "object"
                                        }
                                      },
                                      type: "object"
                                    },
                                    type: "array"
                                  }
                                },
                                type: "object"
                              },
                              secret: {
                                description: "secret represents a secret that should populate this volume.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
                                properties: {
                                  defaultMode: {
                                    description: "defaultMode is Optional: mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values\nfor mode bits. Defaults to 0644.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  items: {
                                    description: "items If unspecified, each key-value pair in the Data field of the referenced\nSecret will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the Secret,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                    items: {
                                      description: "Maps a string key to a path within a volume.",
                                      properties: {
                                        key: {
                                          description: "key is the key to project.",
                                          type: "string"
                                        },
                                        mode: {
                                          description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                          format: "int32",
                                          type: "integer"
                                        },
                                        path: {
                                          description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                          type: "string"
                                        }
                                      },
                                      required: ["key", "path"],
                                      type: "object"
                                    },
                                    type: "array"
                                  },
                                  optional: {
                                    description: "optional field specify whether the Secret or its keys must be defined",
                                    type: "boolean"
                                  },
                                  secretName: {
                                    description: "secretName is the name of the secret in the pod's namespace to use.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              }
                            },
                            required: ["name"],
                            type: "object"
                          },
                          type: "array"
                        }
                      },
                      required: ["containers"],
                      type: "object"
                    }
                  },
                  type: "object"
                }
              },
              type: "object"
            },
            status: {
              description: "ConfigurationStatus communicates the observed state of the Configuration (from the controller).",
              properties: {
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                latestCreatedRevisionName: {
                  description: "LatestCreatedRevisionName is the last revision that was created from this\nConfiguration. It might not be ready yet, for that use LatestReadyRevisionName.",
                  type: "string"
                },
                latestReadyRevisionName: {
                  description: "LatestReadyRevisionName holds the name of the latest Revision stamped out\nfrom this Configuration that has had its \"Ready\" condition become \"True\".",
                  type: "string"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_ClusterdomainclaimsNetworkingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "networking",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "clusterdomainclaims.networking.internal.knative.dev"
  },
  spec: {
    group: "networking.internal.knative.dev",
    names: {
      categories: ["knative-internal", "networking"],
      kind: "ClusterDomainClaim",
      plural: "clusterdomainclaims",
      shortNames: ["cdc"],
      singular: "clusterdomainclaim"
    },
    scope: "Cluster",
    versions: [{
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "ClusterDomainClaim is a cluster-wide reservation for a particular domain name.",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec is the desired state of the ClusterDomainClaim.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                namespace: {
                  description: "Namespace is the namespace which is allowed to create a DomainMapping\nusing this ClusterDomainClaim's name.",
                  type: "string"
                }
              },
              required: ["namespace"],
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_DomainmappingsServingKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "domainmappings.serving.knative.dev"
  },
  spec: {
    group: "serving.knative.dev",
    names: {
      categories: ["all", "knative", "serving"],
      kind: "DomainMapping",
      plural: "domainmappings",
      shortNames: ["dm"],
      singular: "domainmapping"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.url",
        name: "URL",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1beta1",
      schema: {
        openAPIV3Schema: {
          description: "DomainMapping is a mapping from a custom hostname to an Addressable.",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec is the desired state of the DomainMapping.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                ref: {
                  description: "Ref specifies the target of the Domain Mapping.\n\n\nThe object identified by the Ref must be an Addressable with a URL of the\nform `{name}.{namespace}.{domain}` where `{domain}` is the cluster domain,\nand `{name}` and `{namespace}` are the name and namespace of a Kubernetes\nService.\n\n\nThis contract is satisfied by Knative types such as Knative Services and\nKnative Routes, and by Kubernetes Services.",
                  properties: {
                    address: {
                      description: "Address points to a specific Address Name.",
                      type: "string"
                    },
                    apiVersion: {
                      description: "API version of the referent.",
                      type: "string"
                    },
                    group: {
                      description: "Group of the API, without the version of the group. This can be used as an alternative to the APIVersion, and then resolved using ResolveGroup.\nNote: This API is EXPERIMENTAL and might break anytime. For more details: https://github.com/knative/eventing/issues/5086",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the referent.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
                      type: "string"
                    },
                    name: {
                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                      type: "string"
                    },
                    namespace: {
                      description: "Namespace of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/\nThis is optional field, it gets defaulted to the object holding it if left out.",
                      type: "string"
                    }
                  },
                  required: ["kind", "name"],
                  type: "object"
                },
                tls: {
                  description: "TLS allows the DomainMapping to terminate TLS traffic with an existing secret.",
                  properties: {
                    secretName: {
                      description: "SecretName is the name of the existing secret used to terminate TLS traffic.",
                      type: "string"
                    }
                  },
                  required: ["secretName"],
                  type: "object"
                }
              },
              required: ["ref"],
              type: "object"
            },
            status: {
              description: "Status is the current state of the DomainMapping.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                address: {
                  description: "Address holds the information needed for a DomainMapping to be the target of an event.",
                  properties: {
                    audience: {
                      description: "Audience is the OIDC audience for this address.",
                      type: "string"
                    },
                    CACerts: {
                      description: "CACerts is the Certification Authority (CA) certificates in PEM format\naccording to https://www.rfc-editor.org/rfc/rfc7468.",
                      type: "string"
                    },
                    name: {
                      description: "Name is the name of the address.",
                      type: "string"
                    },
                    url: {
                      type: "string"
                    }
                  },
                  type: "object"
                },
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                },
                url: {
                  description: "URL is the URL of this DomainMapping.",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_IngressesNetworkingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "networking",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "ingresses.networking.internal.knative.dev"
  },
  spec: {
    group: "networking.internal.knative.dev",
    names: {
      categories: ["knative-internal", "networking"],
      kind: "Ingress",
      plural: "ingresses",
      shortNames: ["kingress", "king"],
      singular: "ingress"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "Ingress is a collection of rules that allow inbound connections to reach the endpoints defined\nby a backend. An Ingress can be configured to give services externally-reachable URLs, load\nbalance traffic, offer name based virtual hosting, etc.\n\n\nThis is heavily based on K8s Ingress https://godoc.org/k8s.io/api/networking/v1beta1#Ingress\nwhich some highlighted modifications.",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec is the desired state of the Ingress.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                httpOption: {
                  description: "HTTPOption is the option of HTTP. It has the following two values:\n`HTTPOptionEnabled`, `HTTPOptionRedirected`",
                  type: "string"
                },
                rules: {
                  description: "A list of host rules used to configure the Ingress.",
                  items: {
                    description: "IngressRule represents the rules mapping the paths under a specified host to\nthe related backend services. Incoming requests are first evaluated for a host\nmatch, then routed to the backend associated with the matching IngressRuleValue.",
                    properties: {
                      hosts: {
                        description: "Host is the fully qualified domain name of a network host, as defined\nby RFC 3986. Note the following deviations from the \"host\" part of the\nURI as defined in the RFC:\n1. IPs are not allowed. Currently a rule value can only apply to the\n\t  IP in the Spec of the parent .\n2. The `:` delimiter is not respected because ports are not allowed.\n\t  Currently the port of an Ingress is implicitly :80 for http and\n\t  :443 for https.\nBoth these may change in the future.\nIf the host is unspecified, the Ingress routes all traffic based on the\nspecified IngressRuleValue.\nIf multiple matching Hosts were provided, the first rule will take precedent.",
                        items: {
                          type: "string"
                        },
                        type: "array"
                      },
                      http: {
                        description: "HTTP represents a rule to apply against incoming requests. If the\nrule is satisfied, the request is routed to the specified backend.",
                        properties: {
                          paths: {
                            description: "A collection of paths that map requests to backends.\n\n\nIf they are multiple matching paths, the first match takes precedence.",
                            items: {
                              description: "HTTPIngressPath associates a path regex with a backend. Incoming URLs matching\nthe path are forwarded to the backend.",
                              properties: {
                                appendHeaders: {
                                  additionalProperties: {
                                    type: "string"
                                  },
                                  description: "AppendHeaders allow specifying additional HTTP headers to add\nbefore forwarding a request to the destination service.\n\n\nNOTE: This differs from K8s Ingress which doesn't allow header appending.",
                                  type: "object"
                                },
                                headers: {
                                  additionalProperties: {
                                    description: "HeaderMatch represents a matching value of Headers in HTTPIngressPath.\nCurrently, only the exact matching is supported.",
                                    properties: {
                                      exact: {
                                        type: "string"
                                      }
                                    },
                                    required: ["exact"],
                                    type: "object"
                                  },
                                  description: "Headers defines header matching rules which is a map from a header name\nto HeaderMatch which specify a matching condition.\nWhen a request matched with all the header matching rules,\nthe request is routed by the corresponding ingress rule.\nIf it is empty, the headers are not used for matching",
                                  type: "object"
                                },
                                path: {
                                  description: "Path represents a literal prefix to which this rule should apply.\nCurrently it can contain characters disallowed from the conventional\n\"path\" part of a URL as defined by RFC 3986. Paths must begin with\na '/'. If unspecified, the path defaults to a catch all sending\ntraffic to the backend.",
                                  type: "string"
                                },
                                rewriteHost: {
                                  description: "RewriteHost rewrites the incoming request's host header.\n\n\nThis field is currently experimental and not supported by all Ingress\nimplementations.",
                                  type: "string"
                                },
                                splits: {
                                  description: "Splits defines the referenced service endpoints to which the traffic\nwill be forwarded to.",
                                  items: {
                                    description: "IngressBackendSplit describes all endpoints for a given service and port.",
                                    properties: {
                                      appendHeaders: {
                                        additionalProperties: {
                                          type: "string"
                                        },
                                        description: "AppendHeaders allow specifying additional HTTP headers to add\nbefore forwarding a request to the destination service.\n\n\nNOTE: This differs from K8s Ingress which doesn't allow header appending.",
                                        type: "object"
                                      },
                                      percent: {
                                        description: "Specifies the split percentage, a number between 0 and 100.  If\nonly one split is specified, we default to 100.\n\n\nNOTE: This differs from K8s Ingress to allow percentage split.",
                                        type: "integer"
                                      },
                                      serviceName: {
                                        description: "Specifies the name of the referenced service.",
                                        type: "string"
                                      },
                                      serviceNamespace: {
                                        description: "Specifies the namespace of the referenced service.\n\n\nNOTE: This differs from K8s Ingress to allow routing to different namespaces.",
                                        type: "string"
                                      },
                                      servicePort: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Specifies the port of the referenced service.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    required: ["serviceName", "serviceNamespace", "servicePort"],
                                    type: "object"
                                  },
                                  type: "array"
                                }
                              },
                              required: ["splits"],
                              type: "object"
                            },
                            type: "array"
                          }
                        },
                        required: ["paths"],
                        type: "object"
                      },
                      visibility: {
                        description: "Visibility signifies whether this rule should `ClusterLocal`. If it's not\nspecified then it defaults to `ExternalIP`.",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                tls: {
                  description: "TLS configuration. Currently Ingress only supports a single TLS\nport: 443. If multiple members of this list specify different hosts, they\nwill be multiplexed on the same port according to the hostname specified\nthrough the SNI TLS extension, if the ingress controller fulfilling the\ningress supports SNI.",
                  items: {
                    description: "IngressTLS describes the transport layer security associated with an Ingress.",
                    properties: {
                      hosts: {
                        description: "Hosts is a list of hosts included in the TLS certificate. The values in\nthis list must match the name/s used in the tlsSecret. Defaults to the\nwildcard host setting for the loadbalancer controller fulfilling this\nIngress, if left unspecified.",
                        items: {
                          type: "string"
                        },
                        type: "array"
                      },
                      secretName: {
                        description: "SecretName is the name of the secret used to terminate SSL traffic.",
                        type: "string"
                      },
                      secretNamespace: {
                        description: "SecretNamespace is the namespace of the secret used to terminate SSL traffic.\nIf not set the namespace should be assumed to be the same as the Ingress.\nIf set the secret should have the same namespace as the Ingress otherwise\nthe behaviour is undefined and not supported.",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                }
              },
              type: "object"
            },
            status: {
              description: "Status is the current state of the Ingress.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                },
                privateLoadBalancer: {
                  description: "PrivateLoadBalancer contains the current status of the load-balancer.",
                  properties: {
                    ingress: {
                      description: "Ingress is a list containing ingress points for the load-balancer.\nTraffic intended for the service should be sent to these ingress points.",
                      items: {
                        description: "LoadBalancerIngressStatus represents the status of a load-balancer ingress point:\ntraffic intended for the service should be sent to an ingress point.",
                        properties: {
                          domain: {
                            description: "Domain is set for load-balancer ingress points that are DNS based\n(typically AWS load-balancers)",
                            type: "string"
                          },
                          domainInternal: {
                            description: "DomainInternal is set if there is a cluster-local DNS name to access the Ingress.\n\n\nNOTE: This differs from K8s Ingress, since we also desire to have a cluster-local\n      DNS name to allow routing in case of not having a mesh.",
                            type: "string"
                          },
                          ip: {
                            description: "IP is set for load-balancer ingress points that are IP based\n(typically GCE or OpenStack load-balancers)",
                            type: "string"
                          },
                          meshOnly: {
                            description: "MeshOnly is set if the Ingress is only load-balanced through a Service mesh.",
                            type: "boolean"
                          }
                        },
                        type: "object"
                      },
                      type: "array"
                    }
                  },
                  type: "object"
                },
                publicLoadBalancer: {
                  description: "PublicLoadBalancer contains the current status of the load-balancer.",
                  properties: {
                    ingress: {
                      description: "Ingress is a list containing ingress points for the load-balancer.\nTraffic intended for the service should be sent to these ingress points.",
                      items: {
                        description: "LoadBalancerIngressStatus represents the status of a load-balancer ingress point:\ntraffic intended for the service should be sent to an ingress point.",
                        properties: {
                          domain: {
                            description: "Domain is set for load-balancer ingress points that are DNS based\n(typically AWS load-balancers)",
                            type: "string"
                          },
                          domainInternal: {
                            description: "DomainInternal is set if there is a cluster-local DNS name to access the Ingress.\n\n\nNOTE: This differs from K8s Ingress, since we also desire to have a cluster-local\n      DNS name to allow routing in case of not having a mesh.",
                            type: "string"
                          },
                          ip: {
                            description: "IP is set for load-balancer ingress points that are IP based\n(typically GCE or OpenStack load-balancers)",
                            type: "string"
                          },
                          meshOnly: {
                            description: "MeshOnly is set if the Ingress is only load-balanced through a Service mesh.",
                            type: "boolean"
                          }
                        },
                        type: "object"
                      },
                      type: "array"
                    }
                  },
                  type: "object"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_MetricsAutoscalingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "metrics.autoscaling.internal.knative.dev"
  },
  spec: {
    group: "autoscaling.internal.knative.dev",
    names: {
      categories: ["knative-internal", "autoscaling"],
      kind: "Metric",
      plural: "metrics",
      singular: "metric"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "Metric represents a resource to configure the metric collector with.",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec holds the desired state of the Metric (from the client).",
              properties: {
                panicWindow: {
                  description: "PanicWindow is the aggregation window for metrics where quick reactions are needed.",
                  format: "int64",
                  type: "integer"
                },
                scrapeTarget: {
                  description: "ScrapeTarget is the K8s service that publishes the metric endpoint.",
                  type: "string"
                },
                stableWindow: {
                  description: "StableWindow is the aggregation window for metrics in a stable state.",
                  format: "int64",
                  type: "integer"
                }
              },
              required: ["panicWindow", "scrapeTarget", "stableWindow"],
              type: "object"
            },
            status: {
              description: "Status communicates the observed state of the Metric (from the controller).",
              properties: {
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_PodautoscalersAutoscalingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "podautoscalers.autoscaling.internal.knative.dev"
  },
  spec: {
    group: "autoscaling.internal.knative.dev",
    names: {
      categories: ["knative-internal", "autoscaling"],
      kind: "PodAutoscaler",
      plural: "podautoscalers",
      shortNames: ["kpa", "pa"],
      singular: "podautoscaler"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.desiredScale",
        name: "DesiredScale",
        type: "integer"
      }, {
        jsonPath: ".status.actualScale",
        name: "ActualScale",
        type: "integer"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "PodAutoscaler is a Knative abstraction that encapsulates the interface by which Knative\ncomponents instantiate autoscalers.  This definition is an abstraction that may be backed\nby multiple definitions.  For more information, see the Knative Pluggability presentation:\nhttps://docs.google.com/presentation/d/19vW9HFZ6Puxt31biNZF3uLRejDmu82rxJIk1cWmxF7w/edit",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec holds the desired state of the PodAutoscaler (from the client).",
              properties: {
                containerConcurrency: {
                  description: "ContainerConcurrency specifies the maximum allowed\nin-flight (concurrent) requests per container of the Revision.\nDefaults to `0` which means unlimited concurrency.",
                  format: "int64",
                  type: "integer"
                },
                protocolType: {
                  description: "The application-layer protocol. Matches `ProtocolType` inferred from the revision spec.",
                  type: "string"
                },
                reachability: {
                  description: "Reachability specifies whether or not the `ScaleTargetRef` can be reached (ie. has a route).\nDefaults to `ReachabilityUnknown`",
                  type: "string"
                },
                scaleTargetRef: {
                  description: "ScaleTargetRef defines the /scale-able resource that this PodAutoscaler\nis responsible for quickly right-sizing.",
                  properties: {
                    apiVersion: {
                      description: "API version of the referent.",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the referent.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
                      type: "string"
                    },
                    name: {
                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                      type: "string"
                    }
                  },
                  type: "object",
                  "x-kubernetes-map-type": "atomic"
                }
              },
              required: ["protocolType", "scaleTargetRef"],
              type: "object"
            },
            status: {
              description: "Status communicates the observed state of the PodAutoscaler (from the controller).",
              properties: {
                actualScale: {
                  description: "ActualScale shows the actual number of replicas for the revision.",
                  format: "int32",
                  type: "integer"
                },
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                desiredScale: {
                  description: "DesiredScale shows the current desired number of replicas for the revision.",
                  format: "int32",
                  type: "integer"
                },
                metricsServiceName: {
                  description: "MetricsServiceName is the K8s Service name that provides revision metrics.\nThe service is managed by the PA object.",
                  type: "string"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                },
                serviceName: {
                  description: "ServiceName is the K8s Service name that serves the revision, scaled by this PA.\nThe service is created and owned by the ServerlessService object owned by this PA.",
                  type: "string"
                }
              },
              required: ["metricsServiceName", "serviceName"],
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_RevisionsServingKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "revisions.serving.knative.dev"
  },
  spec: {
    group: "serving.knative.dev",
    names: {
      categories: ["all", "knative", "serving"],
      kind: "Revision",
      plural: "revisions",
      shortNames: ["rev"],
      singular: "revision"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".metadata.labels['serving\\.knative\\.dev/configuration']",
        name: "Config Name",
        type: "string"
      }, {
        jsonPath: ".metadata.labels['serving\\.knative\\.dev/configurationGeneration']",
        name: "Generation",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }, {
        jsonPath: ".status.actualReplicas",
        name: "Actual Replicas",
        type: "integer"
      }, {
        jsonPath: ".status.desiredReplicas",
        name: "Desired Replicas",
        type: "integer"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "Revision is an immutable snapshot of code and configuration.  A revision\nreferences a container image. Revisions are created by updates to a\nConfiguration.\n\n\nSee also: https://github.com/knative/serving/blob/main/docs/spec/overview.md#revision",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "RevisionSpec holds the desired state of the Revision (from the client).",
              properties: {
                affinity: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-affinity",
                  type: "object",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                automountServiceAccountToken: {
                  description: "AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.",
                  type: "boolean"
                },
                containerConcurrency: {
                  description: "ContainerConcurrency specifies the maximum allowed in-flight (concurrent)\nrequests per container of the Revision.  Defaults to `0` which means\nconcurrency to the application is not limited, and the system decides the\ntarget concurrency for the autoscaler.",
                  format: "int64",
                  type: "integer"
                },
                containers: {
                  description: "List of containers belonging to the pod.\nContainers cannot currently be added or removed.\nThere must be at least one container in a Pod.\nCannot be updated.",
                  items: {
                    description: "A single application container that you want to run within a pod.",
                    properties: {
                      args: {
                        description: "Arguments to the entrypoint.\nThe container image's CMD is used if this is not provided.\nVariable references $(VAR_NAME) are expanded using the container's environment. If a variable\ncannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. \"$$(VAR_NAME)\" will\nproduce the string literal \"$(VAR_NAME)\". Escaped references will never be expanded, regardless\nof whether the variable exists or not. Cannot be updated.\nMore info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell",
                        items: {
                          type: "string"
                        },
                        type: "array"
                      },
                      command: {
                        description: "Entrypoint array. Not executed within a shell.\nThe container image's ENTRYPOINT is used if this is not provided.\nVariable references $(VAR_NAME) are expanded using the container's environment. If a variable\ncannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. \"$$(VAR_NAME)\" will\nproduce the string literal \"$(VAR_NAME)\". Escaped references will never be expanded, regardless\nof whether the variable exists or not. Cannot be updated.\nMore info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell",
                        items: {
                          type: "string"
                        },
                        type: "array"
                      },
                      env: {
                        description: "List of environment variables to set in the container.\nCannot be updated.",
                        items: {
                          description: "EnvVar represents an environment variable present in a Container.",
                          properties: {
                            name: {
                              description: "Name of the environment variable. Must be a C_IDENTIFIER.",
                              type: "string"
                            },
                            value: {
                              description: "Variable references $(VAR_NAME) are expanded\nusing the previously defined environment variables in the container and\nany service environment variables. If a variable cannot be resolved,\nthe reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e.\n\"$$(VAR_NAME)\" will produce the string literal \"$(VAR_NAME)\".\nEscaped references will never be expanded, regardless of whether the variable\nexists or not.\nDefaults to \"\".",
                              type: "string"
                            },
                            valueFrom: {
                              description: "Source for the environment variable's value. Cannot be used if value is not empty.",
                              properties: {
                                configMapKeyRef: {
                                  description: "Selects a key of a ConfigMap.",
                                  properties: {
                                    key: {
                                      description: "The key to select.",
                                      type: "string"
                                    },
                                    name: {
                                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                      type: "string"
                                    },
                                    optional: {
                                      description: "Specify whether the ConfigMap or its key must be defined",
                                      type: "boolean"
                                    }
                                  },
                                  required: ["key"],
                                  type: "object",
                                  "x-kubernetes-map-type": "atomic"
                                },
                                fieldRef: {
                                  description: "This is accessible behind a feature flag - kubernetes.podspec-fieldref",
                                  type: "object",
                                  "x-kubernetes-map-type": "atomic",
                                  "x-kubernetes-preserve-unknown-fields": true
                                },
                                resourceFieldRef: {
                                  description: "This is accessible behind a feature flag - kubernetes.podspec-fieldref",
                                  type: "object",
                                  "x-kubernetes-map-type": "atomic",
                                  "x-kubernetes-preserve-unknown-fields": true
                                },
                                secretKeyRef: {
                                  description: "Selects a key of a secret in the pod's namespace",
                                  properties: {
                                    key: {
                                      description: "The key of the secret to select from.  Must be a valid secret key.",
                                      type: "string"
                                    },
                                    name: {
                                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                      type: "string"
                                    },
                                    optional: {
                                      description: "Specify whether the Secret or its key must be defined",
                                      type: "boolean"
                                    }
                                  },
                                  required: ["key"],
                                  type: "object",
                                  "x-kubernetes-map-type": "atomic"
                                }
                              },
                              type: "object"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        type: "array"
                      },
                      envFrom: {
                        description: "List of sources to populate environment variables in the container.\nThe keys defined within a source must be a C_IDENTIFIER. All invalid keys\nwill be reported as an event when the container is starting. When a key exists in multiple\nsources, the value associated with the last source will take precedence.\nValues defined by an Env with a duplicate key will take precedence.\nCannot be updated.",
                        items: {
                          description: "EnvFromSource represents the source of a set of ConfigMaps",
                          properties: {
                            configMapRef: {
                              description: "The ConfigMap to select from",
                              properties: {
                                name: {
                                  description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                  type: "string"
                                },
                                optional: {
                                  description: "Specify whether the ConfigMap must be defined",
                                  type: "boolean"
                                }
                              },
                              type: "object",
                              "x-kubernetes-map-type": "atomic"
                            },
                            prefix: {
                              description: "An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.",
                              type: "string"
                            },
                            secretRef: {
                              description: "The Secret to select from",
                              properties: {
                                name: {
                                  description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                  type: "string"
                                },
                                optional: {
                                  description: "Specify whether the Secret must be defined",
                                  type: "boolean"
                                }
                              },
                              type: "object",
                              "x-kubernetes-map-type": "atomic"
                            }
                          },
                          type: "object"
                        },
                        type: "array"
                      },
                      image: {
                        description: "Container image name.\nMore info: https://kubernetes.io/docs/concepts/containers/images\nThis field is optional to allow higher level config management to default or override\ncontainer images in workload controllers like Deployments and StatefulSets.",
                        type: "string"
                      },
                      imagePullPolicy: {
                        description: "Image pull policy.\nOne of Always, Never, IfNotPresent.\nDefaults to Always if :latest tag is specified, or IfNotPresent otherwise.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/containers/images#updating-images",
                        type: "string"
                      },
                      livenessProbe: {
                        description: "Periodic probe of container liveness.\nContainer will be restarted if the probe fails.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                        properties: {
                          exec: {
                            description: "Exec specifies the action to take.",
                            properties: {
                              command: {
                                description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              }
                            },
                            type: "object"
                          },
                          failureThreshold: {
                            description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                            format: "int32",
                            type: "integer"
                          },
                          grpc: {
                            description: "GRPC specifies an action involving a GRPC port.",
                            properties: {
                              port: {
                                description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                format: "int32",
                                type: "integer"
                              },
                              service: {
                                description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                type: "string"
                              }
                            },
                            required: ["port"],
                            type: "object"
                          },
                          httpGet: {
                            description: "HTTPGet specifies the http request to perform.",
                            properties: {
                              host: {
                                description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                type: "string"
                              },
                              httpHeaders: {
                                description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                items: {
                                  description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                  properties: {
                                    name: {
                                      description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                      type: "string"
                                    },
                                    value: {
                                      description: "The header field value",
                                      type: "string"
                                    }
                                  },
                                  required: ["name", "value"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              path: {
                                description: "Path to access on the HTTP server.",
                                type: "string"
                              },
                              port: {
                                anyOf: [{
                                  type: "integer"
                                }, {
                                  type: "string"
                                }],
                                description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                "x-kubernetes-int-or-string": true
                              },
                              scheme: {
                                description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                type: "string"
                              }
                            },
                            type: "object"
                          },
                          initialDelaySeconds: {
                            description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                            format: "int32",
                            type: "integer"
                          },
                          periodSeconds: {
                            description: "How often (in seconds) to perform the probe.",
                            format: "int32",
                            type: "integer"
                          },
                          successThreshold: {
                            description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                            format: "int32",
                            type: "integer"
                          },
                          tcpSocket: {
                            description: "TCPSocket specifies an action involving a TCP port.",
                            properties: {
                              host: {
                                description: "Optional: Host name to connect to, defaults to the pod IP.",
                                type: "string"
                              },
                              port: {
                                anyOf: [{
                                  type: "integer"
                                }, {
                                  type: "string"
                                }],
                                description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                "x-kubernetes-int-or-string": true
                              }
                            },
                            type: "object"
                          },
                          timeoutSeconds: {
                            description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                            format: "int32",
                            type: "integer"
                          }
                        },
                        type: "object"
                      },
                      name: {
                        description: "Name of the container specified as a DNS_LABEL.\nEach container in a pod must have a unique name (DNS_LABEL).\nCannot be updated.",
                        type: "string"
                      },
                      ports: {
                        description: "List of ports to expose from the container. Not specifying a port here\nDOES NOT prevent that port from being exposed. Any port which is\nlistening on the default \"0.0.0.0\" address inside a container will be\naccessible from the network.\nModifying this array with strategic merge patch may corrupt the data.\nFor more information See https://github.com/kubernetes/kubernetes/issues/108255.\nCannot be updated.",
                        items: {
                          description: "ContainerPort represents a network port in a single container.",
                          properties: {
                            containerPort: {
                              description: "Number of port to expose on the pod's IP address.\nThis must be a valid port number, 0 < x < 65536.",
                              format: "int32",
                              type: "integer"
                            },
                            name: {
                              description: "If specified, this must be an IANA_SVC_NAME and unique within the pod. Each\nnamed port in a pod must have a unique name. Name for the port that can be\nreferred to by services.",
                              type: "string"
                            },
                            protocol: {
                              default: "TCP",
                              description: "Protocol for port. Must be UDP, TCP, or SCTP.\nDefaults to \"TCP\".",
                              type: "string"
                            }
                          },
                          required: ["containerPort"],
                          type: "object"
                        },
                        type: "array",
                        "x-kubernetes-list-map-keys": ["containerPort", "protocol"],
                        "x-kubernetes-list-type": "map"
                      },
                      readinessProbe: {
                        description: "Periodic probe of container service readiness.\nContainer will be removed from service endpoints if the probe fails.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                        properties: {
                          exec: {
                            description: "Exec specifies the action to take.",
                            properties: {
                              command: {
                                description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              }
                            },
                            type: "object"
                          },
                          failureThreshold: {
                            description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                            format: "int32",
                            type: "integer"
                          },
                          grpc: {
                            description: "GRPC specifies an action involving a GRPC port.",
                            properties: {
                              port: {
                                description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                format: "int32",
                                type: "integer"
                              },
                              service: {
                                description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                type: "string"
                              }
                            },
                            required: ["port"],
                            type: "object"
                          },
                          httpGet: {
                            description: "HTTPGet specifies the http request to perform.",
                            properties: {
                              host: {
                                description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                type: "string"
                              },
                              httpHeaders: {
                                description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                items: {
                                  description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                  properties: {
                                    name: {
                                      description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                      type: "string"
                                    },
                                    value: {
                                      description: "The header field value",
                                      type: "string"
                                    }
                                  },
                                  required: ["name", "value"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              path: {
                                description: "Path to access on the HTTP server.",
                                type: "string"
                              },
                              port: {
                                anyOf: [{
                                  type: "integer"
                                }, {
                                  type: "string"
                                }],
                                description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                "x-kubernetes-int-or-string": true
                              },
                              scheme: {
                                description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                type: "string"
                              }
                            },
                            type: "object"
                          },
                          initialDelaySeconds: {
                            description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                            format: "int32",
                            type: "integer"
                          },
                          periodSeconds: {
                            description: "How often (in seconds) to perform the probe.",
                            format: "int32",
                            type: "integer"
                          },
                          successThreshold: {
                            description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                            format: "int32",
                            type: "integer"
                          },
                          tcpSocket: {
                            description: "TCPSocket specifies an action involving a TCP port.",
                            properties: {
                              host: {
                                description: "Optional: Host name to connect to, defaults to the pod IP.",
                                type: "string"
                              },
                              port: {
                                anyOf: [{
                                  type: "integer"
                                }, {
                                  type: "string"
                                }],
                                description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                "x-kubernetes-int-or-string": true
                              }
                            },
                            type: "object"
                          },
                          timeoutSeconds: {
                            description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                            format: "int32",
                            type: "integer"
                          }
                        },
                        type: "object"
                      },
                      resources: {
                        description: "Compute Resources required by this container.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                        properties: {
                          claims: {
                            description: "Claims lists the names of resources, defined in spec.resourceClaims,\nthat are used by this container.\n\n\nThis is an alpha field and requires enabling the\nDynamicResourceAllocation feature gate.\n\n\nThis field is immutable. It can only be set for containers.",
                            items: {
                              description: "ResourceClaim references one entry in PodSpec.ResourceClaims.",
                              properties: {
                                name: {
                                  description: "Name must match the name of one entry in pod.spec.resourceClaims of\nthe Pod where this field is used. It makes that resource available\ninside a container.",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            type: "array",
                            "x-kubernetes-list-map-keys": ["name"],
                            "x-kubernetes-list-type": "map"
                          },
                          limits: {
                            additionalProperties: {
                              anyOf: [{
                                type: "integer"
                              }, {
                                type: "string"
                              }],
                              pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                              "x-kubernetes-int-or-string": true
                            },
                            description: "Limits describes the maximum amount of compute resources allowed.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                            type: "object"
                          },
                          requests: {
                            additionalProperties: {
                              anyOf: [{
                                type: "integer"
                              }, {
                                type: "string"
                              }],
                              pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                              "x-kubernetes-int-or-string": true
                            },
                            description: "Requests describes the minimum amount of compute resources required.\nIf Requests is omitted for a container, it defaults to Limits if that is explicitly specified,\notherwise to an implementation-defined value. Requests cannot exceed Limits.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                            type: "object"
                          }
                        },
                        type: "object"
                      },
                      securityContext: {
                        description: "SecurityContext defines the security options the container should be run with.\nIf set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.\nMore info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/",
                        properties: {
                          allowPrivilegeEscalation: {
                            description: "AllowPrivilegeEscalation controls whether a process can gain more\nprivileges than its parent process. This bool directly controls if\nthe no_new_privs flag will be set on the container process.\nAllowPrivilegeEscalation is true always when the container is:\n1) run as Privileged\n2) has CAP_SYS_ADMIN\nNote that this field cannot be set when spec.os.name is windows.",
                            type: "boolean"
                          },
                          capabilities: {
                            description: "The capabilities to add/drop when running containers.\nDefaults to the default set of capabilities granted by the container runtime.\nNote that this field cannot be set when spec.os.name is windows.",
                            properties: {
                              add: {
                                description: "This is accessible behind a feature flag - kubernetes.containerspec-addcapabilities",
                                items: {
                                  description: "Capability represent POSIX capabilities type",
                                  type: "string"
                                },
                                type: "array"
                              },
                              drop: {
                                description: "Removed capabilities",
                                items: {
                                  description: "Capability represent POSIX capabilities type",
                                  type: "string"
                                },
                                type: "array"
                              }
                            },
                            type: "object"
                          },
                          readOnlyRootFilesystem: {
                            description: "Whether this container has a read-only root filesystem.\nDefault is false.\nNote that this field cannot be set when spec.os.name is windows.",
                            type: "boolean"
                          },
                          runAsGroup: {
                            description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.\nNote that this field cannot be set when spec.os.name is windows.",
                            format: "int64",
                            type: "integer"
                          },
                          runAsNonRoot: {
                            description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                            type: "boolean"
                          },
                          runAsUser: {
                            description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.\nNote that this field cannot be set when spec.os.name is windows.",
                            format: "int64",
                            type: "integer"
                          },
                          seccompProfile: {
                            description: "The seccomp options to use by this container. If seccomp options are\nprovided at both the pod & container level, the container options\noverride the pod options.\nNote that this field cannot be set when spec.os.name is windows.",
                            properties: {
                              localhostProfile: {
                                description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                type: "string"
                              },
                              type: {
                                description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                type: "string"
                              }
                            },
                            required: ["type"],
                            type: "object"
                          }
                        },
                        type: "object"
                      },
                      startupProbe: {
                        description: "StartupProbe indicates that the Pod has successfully initialized.\nIf specified, no other probes are executed until this completes successfully.\nIf this probe fails, the Pod will be restarted, just as if the livenessProbe failed.\nThis can be used to provide different probe parameters at the beginning of a Pod's lifecycle,\nwhen it might take a long time to load data or warm a cache, than during steady-state operation.\nThis cannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                        properties: {
                          exec: {
                            description: "Exec specifies the action to take.",
                            properties: {
                              command: {
                                description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              }
                            },
                            type: "object"
                          },
                          failureThreshold: {
                            description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                            format: "int32",
                            type: "integer"
                          },
                          grpc: {
                            description: "GRPC specifies an action involving a GRPC port.",
                            properties: {
                              port: {
                                description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                format: "int32",
                                type: "integer"
                              },
                              service: {
                                description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                type: "string"
                              }
                            },
                            required: ["port"],
                            type: "object"
                          },
                          httpGet: {
                            description: "HTTPGet specifies the http request to perform.",
                            properties: {
                              host: {
                                description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                type: "string"
                              },
                              httpHeaders: {
                                description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                items: {
                                  description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                  properties: {
                                    name: {
                                      description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                      type: "string"
                                    },
                                    value: {
                                      description: "The header field value",
                                      type: "string"
                                    }
                                  },
                                  required: ["name", "value"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              path: {
                                description: "Path to access on the HTTP server.",
                                type: "string"
                              },
                              port: {
                                anyOf: [{
                                  type: "integer"
                                }, {
                                  type: "string"
                                }],
                                description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                "x-kubernetes-int-or-string": true
                              },
                              scheme: {
                                description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                type: "string"
                              }
                            },
                            type: "object"
                          },
                          initialDelaySeconds: {
                            description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                            format: "int32",
                            type: "integer"
                          },
                          periodSeconds: {
                            description: "How often (in seconds) to perform the probe.",
                            format: "int32",
                            type: "integer"
                          },
                          successThreshold: {
                            description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                            format: "int32",
                            type: "integer"
                          },
                          tcpSocket: {
                            description: "TCPSocket specifies an action involving a TCP port.",
                            properties: {
                              host: {
                                description: "Optional: Host name to connect to, defaults to the pod IP.",
                                type: "string"
                              },
                              port: {
                                anyOf: [{
                                  type: "integer"
                                }, {
                                  type: "string"
                                }],
                                description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                "x-kubernetes-int-or-string": true
                              }
                            },
                            type: "object"
                          },
                          timeoutSeconds: {
                            description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                            format: "int32",
                            type: "integer"
                          }
                        },
                        type: "object"
                      },
                      terminationMessagePath: {
                        description: "Optional: Path at which the file to which the container's termination message\nwill be written is mounted into the container's filesystem.\nMessage written is intended to be brief final status, such as an assertion failure message.\nWill be truncated by the node if greater than 4096 bytes. The total message length across\nall containers will be limited to 12kb.\nDefaults to /dev/termination-log.\nCannot be updated.",
                        type: "string"
                      },
                      terminationMessagePolicy: {
                        description: "Indicate how the termination message should be populated. File will use the contents of\nterminationMessagePath to populate the container status message on both success and failure.\nFallbackToLogsOnError will use the last chunk of container log output if the termination\nmessage file is empty and the container exited with an error.\nThe log output is limited to 2048 bytes or 80 lines, whichever is smaller.\nDefaults to File.\nCannot be updated.",
                        type: "string"
                      },
                      volumeMounts: {
                        description: "Pod volumes to mount into the container's filesystem.\nCannot be updated.",
                        items: {
                          description: "VolumeMount describes a mounting of a Volume within a container.",
                          properties: {
                            mountPath: {
                              description: "Path within the container at which the volume should be mounted.  Must\nnot contain ':'.",
                              type: "string"
                            },
                            name: {
                              description: "This must match the Name of a Volume.",
                              type: "string"
                            },
                            readOnly: {
                              description: "Mounted read-only if true, read-write otherwise (false or unspecified).\nDefaults to false.",
                              type: "boolean"
                            },
                            subPath: {
                              description: "Path within the volume from which the container's volume should be mounted.\nDefaults to \"\" (volume's root).",
                              type: "string"
                            }
                          },
                          required: ["mountPath", "name"],
                          type: "object"
                        },
                        type: "array"
                      },
                      workingDir: {
                        description: "Container's working directory.\nIf not specified, the container runtime's default will be used, which\nmight be configured in the container image.\nCannot be updated.",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                dnsConfig: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-dnsconfig",
                  type: "object",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                dnsPolicy: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-dnspolicy",
                  type: "string"
                },
                enableServiceLinks: {
                  description: "EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Knative defaults this to false.",
                  type: "boolean"
                },
                hostAliases: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-hostaliases",
                  items: {
                    description: "This is accessible behind a feature flag - kubernetes.podspec-hostaliases",
                    type: "object",
                    "x-kubernetes-preserve-unknown-fields": true
                  },
                  type: "array"
                },
                idleTimeoutSeconds: {
                  description: "IdleTimeoutSeconds is the maximum duration in seconds a request will be allowed\nto stay open while not receiving any bytes from the user's application. If\nunspecified, a system default will be provided.",
                  format: "int64",
                  type: "integer"
                },
                imagePullSecrets: {
                  description: "ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec.\nIf specified, these secrets will be passed to individual puller implementations for them to use.\nMore info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod",
                  items: {
                    description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                    properties: {
                      name: {
                        description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                        type: "string"
                      }
                    },
                    type: "object",
                    "x-kubernetes-map-type": "atomic"
                  },
                  type: "array"
                },
                initContainers: {
                  description: "List of initialization containers belonging to the pod.\nInit containers are executed in order prior to containers being started. If any\ninit container fails, the pod is considered to have failed and is handled according\nto its restartPolicy. The name for an init container or normal container must be\nunique among all containers.\nInit containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.\nThe resourceRequirements of an init container are taken into account during scheduling\nby finding the highest request/limit for each resource type, and then using the max of\nof that value or the sum of the normal containers. Limits are applied to init containers\nin a similar fashion.\nInit containers cannot currently be added or removed.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/",
                  items: {
                    description: "This is accessible behind a feature flag - kubernetes.podspec-init-containers",
                    type: "object",
                    "x-kubernetes-preserve-unknown-fields": true
                  },
                  type: "array"
                },
                nodeSelector: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-nodeselector",
                  type: "object",
                  "x-kubernetes-map-type": "atomic",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                priorityClassName: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-priorityclassname",
                  type: "string",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                responseStartTimeoutSeconds: {
                  description: "ResponseStartTimeoutSeconds is the maximum duration in seconds that the request\nrouting layer will wait for a request delivered to a container to begin\nsending any network traffic.",
                  format: "int64",
                  type: "integer"
                },
                runtimeClassName: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-runtimeclassname",
                  type: "string",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                schedulerName: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-schedulername",
                  type: "string",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                securityContext: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-securitycontext",
                  type: "object",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                serviceAccountName: {
                  description: "ServiceAccountName is the name of the ServiceAccount to use to run this pod.\nMore info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
                  type: "string"
                },
                shareProcessNamespace: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-shareproccessnamespace",
                  type: "boolean",
                  "x-kubernetes-preserve-unknown-fields": true
                },
                timeoutSeconds: {
                  description: "TimeoutSeconds is the maximum duration in seconds that the request instance\nis allowed to respond to a request. If unspecified, a system default will\nbe provided.",
                  format: "int64",
                  type: "integer"
                },
                tolerations: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-tolerations",
                  items: {
                    description: "This is accessible behind a feature flag - kubernetes.podspec-tolerations",
                    type: "object",
                    "x-kubernetes-preserve-unknown-fields": true
                  },
                  type: "array"
                },
                topologySpreadConstraints: {
                  description: "This is accessible behind a feature flag - kubernetes.podspec-topologyspreadconstraints",
                  items: {
                    description: "This is accessible behind a feature flag - kubernetes.podspec-topologyspreadconstraints",
                    type: "object",
                    "x-kubernetes-preserve-unknown-fields": true
                  },
                  type: "array"
                },
                volumes: {
                  description: "List of volumes that can be mounted by containers belonging to the pod.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes",
                  items: {
                    description: "Volume represents a named volume in a pod that may be accessed by any container in the pod.",
                    properties: {
                      configMap: {
                        description: "configMap represents a configMap that should populate this volume",
                        properties: {
                          defaultMode: {
                            description: "defaultMode is optional: mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nDefaults to 0644.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                            format: "int32",
                            type: "integer"
                          },
                          items: {
                            description: "items if unspecified, each key-value pair in the Data field of the referenced\nConfigMap will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the ConfigMap,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                            items: {
                              description: "Maps a string key to a path within a volume.",
                              properties: {
                                key: {
                                  description: "key is the key to project.",
                                  type: "string"
                                },
                                mode: {
                                  description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                  format: "int32",
                                  type: "integer"
                                },
                                path: {
                                  description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                  type: "string"
                                }
                              },
                              required: ["key", "path"],
                              type: "object"
                            },
                            type: "array"
                          },
                          name: {
                            description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                            type: "string"
                          },
                          optional: {
                            description: "optional specify whether the ConfigMap or its keys must be defined",
                            type: "boolean"
                          }
                        },
                        type: "object",
                        "x-kubernetes-map-type": "atomic"
                      },
                      emptyDir: {
                        description: "This is accessible behind a feature flag - kubernetes.podspec-emptydir",
                        type: "object",
                        "x-kubernetes-preserve-unknown-fields": true
                      },
                      name: {
                        description: "name of the volume.\nMust be a DNS_LABEL and unique within the pod.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                        type: "string"
                      },
                      persistentVolumeClaim: {
                        description: "This is accessible behind a feature flag - kubernetes.podspec-persistent-volume-claim",
                        type: "object",
                        "x-kubernetes-preserve-unknown-fields": true
                      },
                      projected: {
                        description: "projected items for all in one resources secrets, configmaps, and downward API",
                        properties: {
                          defaultMode: {
                            description: "defaultMode are the mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                            format: "int32",
                            type: "integer"
                          },
                          sources: {
                            description: "sources is the list of volume projections",
                            items: {
                              description: "Projection that may be projected along with other supported volume types",
                              properties: {
                                configMap: {
                                  description: "configMap information about the configMap data to project",
                                  properties: {
                                    items: {
                                      description: "items if unspecified, each key-value pair in the Data field of the referenced\nConfigMap will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the ConfigMap,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                      items: {
                                        description: "Maps a string key to a path within a volume.",
                                        properties: {
                                          key: {
                                            description: "key is the key to project.",
                                            type: "string"
                                          },
                                          mode: {
                                            description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                            format: "int32",
                                            type: "integer"
                                          },
                                          path: {
                                            description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                            type: "string"
                                          }
                                        },
                                        required: ["key", "path"],
                                        type: "object"
                                      },
                                      type: "array"
                                    },
                                    name: {
                                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                      type: "string"
                                    },
                                    optional: {
                                      description: "optional specify whether the ConfigMap or its keys must be defined",
                                      type: "boolean"
                                    }
                                  },
                                  type: "object",
                                  "x-kubernetes-map-type": "atomic"
                                },
                                downwardAPI: {
                                  description: "downwardAPI information about the downwardAPI data to project",
                                  properties: {
                                    items: {
                                      description: "Items is a list of DownwardAPIVolume file",
                                      items: {
                                        description: "DownwardAPIVolumeFile represents information to create the file containing the pod field",
                                        properties: {
                                          fieldRef: {
                                            description: "Required: Selects a field of the pod: only annotations, labels, name and namespace are supported.",
                                            properties: {
                                              apiVersion: {
                                                description: "Version of the schema the FieldPath is written in terms of, defaults to \"v1\".",
                                                type: "string"
                                              },
                                              fieldPath: {
                                                description: "Path of the field to select in the specified API version.",
                                                type: "string"
                                              }
                                            },
                                            required: ["fieldPath"],
                                            type: "object",
                                            "x-kubernetes-map-type": "atomic"
                                          },
                                          mode: {
                                            description: "Optional: mode bits used to set permissions on this file, must be an octal value\nbetween 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                            format: "int32",
                                            type: "integer"
                                          },
                                          path: {
                                            description: "Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'",
                                            type: "string"
                                          },
                                          resourceFieldRef: {
                                            description: "Selects a resource of the container: only resources limits and requests\n(limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.",
                                            properties: {
                                              containerName: {
                                                description: "Container name: required for volumes, optional for env vars",
                                                type: "string"
                                              },
                                              divisor: {
                                                anyOf: [{
                                                  type: "integer"
                                                }, {
                                                  type: "string"
                                                }],
                                                description: "Specifies the output format of the exposed resources, defaults to \"1\"",
                                                pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                                "x-kubernetes-int-or-string": true
                                              },
                                              resource: {
                                                description: "Required: resource to select",
                                                type: "string"
                                              }
                                            },
                                            required: ["resource"],
                                            type: "object",
                                            "x-kubernetes-map-type": "atomic"
                                          }
                                        },
                                        required: ["path"],
                                        type: "object"
                                      },
                                      type: "array"
                                    }
                                  },
                                  type: "object"
                                },
                                secret: {
                                  description: "secret information about the secret data to project",
                                  properties: {
                                    items: {
                                      description: "items if unspecified, each key-value pair in the Data field of the referenced\nSecret will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the Secret,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                      items: {
                                        description: "Maps a string key to a path within a volume.",
                                        properties: {
                                          key: {
                                            description: "key is the key to project.",
                                            type: "string"
                                          },
                                          mode: {
                                            description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                            format: "int32",
                                            type: "integer"
                                          },
                                          path: {
                                            description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                            type: "string"
                                          }
                                        },
                                        required: ["key", "path"],
                                        type: "object"
                                      },
                                      type: "array"
                                    },
                                    name: {
                                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                      type: "string"
                                    },
                                    optional: {
                                      description: "optional field specify whether the Secret or its key must be defined",
                                      type: "boolean"
                                    }
                                  },
                                  type: "object",
                                  "x-kubernetes-map-type": "atomic"
                                },
                                serviceAccountToken: {
                                  description: "serviceAccountToken is information about the serviceAccountToken data to project",
                                  properties: {
                                    audience: {
                                      description: "audience is the intended audience of the token. A recipient of a token\nmust identify itself with an identifier specified in the audience of the\ntoken, and otherwise should reject the token. The audience defaults to the\nidentifier of the apiserver.",
                                      type: "string"
                                    },
                                    expirationSeconds: {
                                      description: "expirationSeconds is the requested duration of validity of the service\naccount token. As the token approaches expiration, the kubelet volume\nplugin will proactively rotate the service account token. The kubelet will\nstart trying to rotate the token if the token is older than 80 percent of\nits time to live or if the token is older than 24 hours.Defaults to 1 hour\nand must be at least 10 minutes.",
                                      format: "int64",
                                      type: "integer"
                                    },
                                    path: {
                                      description: "path is the path relative to the mount point of the file to project the\ntoken into.",
                                      type: "string"
                                    }
                                  },
                                  required: ["path"],
                                  type: "object"
                                }
                              },
                              type: "object"
                            },
                            type: "array"
                          }
                        },
                        type: "object"
                      },
                      secret: {
                        description: "secret represents a secret that should populate this volume.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
                        properties: {
                          defaultMode: {
                            description: "defaultMode is Optional: mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values\nfor mode bits. Defaults to 0644.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                            format: "int32",
                            type: "integer"
                          },
                          items: {
                            description: "items If unspecified, each key-value pair in the Data field of the referenced\nSecret will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the Secret,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                            items: {
                              description: "Maps a string key to a path within a volume.",
                              properties: {
                                key: {
                                  description: "key is the key to project.",
                                  type: "string"
                                },
                                mode: {
                                  description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                  format: "int32",
                                  type: "integer"
                                },
                                path: {
                                  description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                  type: "string"
                                }
                              },
                              required: ["key", "path"],
                              type: "object"
                            },
                            type: "array"
                          },
                          optional: {
                            description: "optional field specify whether the Secret or its keys must be defined",
                            type: "boolean"
                          },
                          secretName: {
                            description: "secretName is the name of the secret in the pod's namespace to use.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
                            type: "string"
                          }
                        },
                        type: "object"
                      }
                    },
                    required: ["name"],
                    type: "object"
                  },
                  type: "array"
                }
              },
              required: ["containers"],
              type: "object"
            },
            status: {
              description: "RevisionStatus communicates the observed state of the Revision (from the controller).",
              properties: {
                actualReplicas: {
                  description: "ActualReplicas reflects the amount of ready pods running this revision.",
                  format: "int32",
                  type: "integer"
                },
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                containerStatuses: {
                  description: "ContainerStatuses is a slice of images present in .Spec.Container[*].Image\nto their respective digests and their container name.\nThe digests are resolved during the creation of Revision.\nContainerStatuses holds the container name and image digests\nfor both serving and non serving containers.\nref: http://bit.ly/image-digests",
                  items: {
                    description: "ContainerStatus holds the information of container name and image digest value",
                    properties: {
                      imageDigest: {
                        type: "string"
                      },
                      name: {
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                desiredReplicas: {
                  description: "DesiredReplicas reflects the desired amount of pods running this revision.",
                  format: "int32",
                  type: "integer"
                },
                initContainerStatuses: {
                  description: "InitContainerStatuses is a slice of images present in .Spec.InitContainer[*].Image\nto their respective digests and their container name.\nThe digests are resolved during the creation of Revision.\nContainerStatuses holds the container name and image digests\nfor both serving and non serving containers.\nref: http://bit.ly/image-digests",
                  items: {
                    description: "ContainerStatus holds the information of container name and image digest value",
                    properties: {
                      imageDigest: {
                        type: "string"
                      },
                      name: {
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                logUrl: {
                  description: "LogURL specifies the generated logging url for this particular revision\nbased on the revision url template specified in the controller's config.",
                  type: "string"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_RoutesServingKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "duck.knative.dev/addressable": "true",
      "knative.dev/crd-install": "true"
    },
    name: "routes.serving.knative.dev"
  },
  spec: {
    group: "serving.knative.dev",
    names: {
      categories: ["all", "knative", "serving"],
      kind: "Route",
      plural: "routes",
      shortNames: ["rt"],
      singular: "route"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.url",
        name: "URL",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "Route is responsible for configuring ingress over a collection of Revisions.\nSome of the Revisions a Route distributes traffic over may be specified by\nreferencing the Configuration responsible for creating them; in these cases\nthe Route is additionally responsible for monitoring the Configuration for\n\"latest ready revision\" changes, and smoothly rolling out latest revisions.\nSee also: https://github.com/knative/serving/blob/main/docs/spec/overview.md#route",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec holds the desired state of the Route (from the client).",
              properties: {
                traffic: {
                  description: "Traffic specifies how to distribute traffic over a collection of\nrevisions and configurations.",
                  items: {
                    description: "TrafficTarget holds a single entry of the routing table for a Route.",
                    properties: {
                      configurationName: {
                        description: "ConfigurationName of a configuration to whose latest revision we will send\nthis portion of traffic. When the \"status.latestReadyRevisionName\" of the\nreferenced configuration changes, we will automatically migrate traffic\nfrom the prior \"latest ready\" revision to the new one.  This field is never\nset in Route's status, only its spec.  This is mutually exclusive with\nRevisionName.",
                        type: "string"
                      },
                      latestRevision: {
                        description: "LatestRevision may be optionally provided to indicate that the latest\nready Revision of the Configuration should be used for this traffic\ntarget.  When provided LatestRevision must be true if RevisionName is\nempty; it must be false when RevisionName is non-empty.",
                        type: "boolean"
                      },
                      percent: {
                        description: "Percent indicates that percentage based routing should be used and\nthe value indicates the percent of traffic that is be routed to this\nRevision or Configuration. `0` (zero) mean no traffic, `100` means all\ntraffic.\nWhen percentage based routing is being used the follow rules apply:\n- the sum of all percent values must equal 100\n- when not specified, the implied value for `percent` is zero for\n  that particular Revision or Configuration",
                        format: "int64",
                        type: "integer"
                      },
                      revisionName: {
                        description: "RevisionName of a specific revision to which to send this portion of\ntraffic.  This is mutually exclusive with ConfigurationName.",
                        type: "string"
                      },
                      tag: {
                        description: "Tag is optionally used to expose a dedicated url for referencing\nthis target exclusively.",
                        type: "string"
                      },
                      url: {
                        description: "URL displays the URL for accessing named traffic targets. URL is displayed in\nstatus, and is disallowed on spec. URL must contain a scheme (e.g. http://) and\na hostname, but may not contain anything else (e.g. basic auth, url path, etc.)",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                }
              },
              type: "object"
            },
            status: {
              description: "Status communicates the observed state of the Route (from the controller).",
              properties: {
                address: {
                  description: "Address holds the information needed for a Route to be the target of an event.",
                  properties: {
                    audience: {
                      description: "Audience is the OIDC audience for this address.",
                      type: "string"
                    },
                    CACerts: {
                      description: "CACerts is the Certification Authority (CA) certificates in PEM format\naccording to https://www.rfc-editor.org/rfc/rfc7468.",
                      type: "string"
                    },
                    name: {
                      description: "Name is the name of the address.",
                      type: "string"
                    },
                    url: {
                      type: "string"
                    }
                  },
                  type: "object"
                },
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                },
                traffic: {
                  description: "Traffic holds the configured traffic distribution.\nThese entries will always contain RevisionName references.\nWhen ConfigurationName appears in the spec, this will hold the\nLatestReadyRevisionName that we last observed.",
                  items: {
                    description: "TrafficTarget holds a single entry of the routing table for a Route.",
                    properties: {
                      configurationName: {
                        description: "ConfigurationName of a configuration to whose latest revision we will send\nthis portion of traffic. When the \"status.latestReadyRevisionName\" of the\nreferenced configuration changes, we will automatically migrate traffic\nfrom the prior \"latest ready\" revision to the new one.  This field is never\nset in Route's status, only its spec.  This is mutually exclusive with\nRevisionName.",
                        type: "string"
                      },
                      latestRevision: {
                        description: "LatestRevision may be optionally provided to indicate that the latest\nready Revision of the Configuration should be used for this traffic\ntarget.  When provided LatestRevision must be true if RevisionName is\nempty; it must be false when RevisionName is non-empty.",
                        type: "boolean"
                      },
                      percent: {
                        description: "Percent indicates that percentage based routing should be used and\nthe value indicates the percent of traffic that is be routed to this\nRevision or Configuration. `0` (zero) mean no traffic, `100` means all\ntraffic.\nWhen percentage based routing is being used the follow rules apply:\n- the sum of all percent values must equal 100\n- when not specified, the implied value for `percent` is zero for\n  that particular Revision or Configuration",
                        format: "int64",
                        type: "integer"
                      },
                      revisionName: {
                        description: "RevisionName of a specific revision to which to send this portion of\ntraffic.  This is mutually exclusive with ConfigurationName.",
                        type: "string"
                      },
                      tag: {
                        description: "Tag is optionally used to expose a dedicated url for referencing\nthis target exclusively.",
                        type: "string"
                      },
                      url: {
                        description: "URL displays the URL for accessing named traffic targets. URL is displayed in\nstatus, and is disallowed on spec. URL must contain a scheme (e.g. http://) and\na hostname, but may not contain anything else (e.g. basic auth, url path, etc.)",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                url: {
                  description: "URL holds the url that will distribute traffic over the provided traffic targets.\nIt generally has the form http[s]://{route-name}.{route-namespace}.{cluster-level-suffix}",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_ServerlessservicesNetworkingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "networking",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "serverlessservices.networking.internal.knative.dev"
  },
  spec: {
    group: "networking.internal.knative.dev",
    names: {
      categories: ["knative-internal", "networking"],
      kind: "ServerlessService",
      plural: "serverlessservices",
      shortNames: ["sks"],
      singular: "serverlessservice"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".spec.mode",
        name: "Mode",
        type: "string"
      }, {
        jsonPath: ".spec.numActivators",
        name: "Activators",
        type: "integer"
      }, {
        jsonPath: ".status.serviceName",
        name: "ServiceName",
        type: "string"
      }, {
        jsonPath: ".status.privateServiceName",
        name: "PrivateServiceName",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "ServerlessService is a proxy for the K8s service objects containing the\nendpoints for the revision, whether those are endpoints of the activator or\nrevision pods.\nSee: https://knative.page.link/naxz for details.",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec is the desired state of the ServerlessService.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                mode: {
                  description: "Mode describes the mode of operation of the ServerlessService.",
                  type: "string"
                },
                numActivators: {
                  description: "NumActivators contains number of Activators that this revision should be\nassigned.\nO means — assign all.",
                  format: "int32",
                  type: "integer"
                },
                objectRef: {
                  description: "ObjectRef defines the resource that this ServerlessService\nis responsible for making \"serverless\".",
                  properties: {
                    apiVersion: {
                      description: "API version of the referent.",
                      type: "string"
                    },
                    fieldPath: {
                      description: "If referring to a piece of an object instead of an entire object, this string\nshould contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2].\nFor example, if the object reference is to a container within a pod, this would take on a value like:\n\"spec.containers{name}\" (where \"name\" refers to the name of the container that triggered\nthe event) or if no container name is specified \"spec.containers[2]\" (container with\nindex 2 in this pod). This syntax is chosen only to have some well-defined way of\nreferencing a part of an object.\nTODO: this design is not final and this field is subject to change in the future.",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the referent.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
                      type: "string"
                    },
                    name: {
                      description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                      type: "string"
                    },
                    namespace: {
                      description: "Namespace of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/",
                      type: "string"
                    },
                    resourceVersion: {
                      description: "Specific resourceVersion to which this reference is made, if any.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency",
                      type: "string"
                    },
                    uid: {
                      description: "UID of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids",
                      type: "string"
                    }
                  },
                  type: "object",
                  "x-kubernetes-map-type": "atomic"
                },
                protocolType: {
                  description: "The application-layer protocol. Matches `RevisionProtocolType` set on the owning pa/revision.\nserving imports networking, so just use string.",
                  type: "string"
                }
              },
              required: ["objectRef", "protocolType"],
              type: "object"
            },
            status: {
              description: "Status is the current state of the ServerlessService.\nMore info: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                },
                privateServiceName: {
                  description: "PrivateServiceName holds the name of a core K8s Service resource that\nload balances over the user service pods backing this Revision.",
                  type: "string"
                },
                serviceName: {
                  description: "ServiceName holds the name of a core K8s Service resource that\nload balances over the pods backing this Revision (activator or revision).",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_ServicesServingKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "duck.knative.dev/addressable": "true",
      "duck.knative.dev/podspecable": "true",
      "knative.dev/crd-install": "true"
    },
    name: "services.serving.knative.dev"
  },
  spec: {
    group: "serving.knative.dev",
    names: {
      categories: ["all", "knative", "serving"],
      kind: "Service",
      plural: "services",
      shortNames: ["kservice", "ksvc"],
      singular: "service"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.url",
        name: "URL",
        type: "string"
      }, {
        jsonPath: ".status.latestCreatedRevisionName",
        name: "LatestCreated",
        type: "string"
      }, {
        jsonPath: ".status.latestReadyRevisionName",
        name: "LatestReady",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type=='Ready')].reason",
        name: "Reason",
        type: "string"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "Service acts as a top-level container that manages a Route and Configuration\nwhich implement a network service. Service exists to provide a singular\nabstraction which can be access controlled, reasoned about, and which\nencapsulates software lifecycle decisions such as rollout policy and\nteam resource ownership. Service acts only as an orchestrator of the\nunderlying Routes and Configurations (much as a kubernetes Deployment\norchestrates ReplicaSets), and its usage is optional but recommended.\n\n\nThe Service's controller will track the statuses of its owned Configuration\nand Route, reflecting their statuses and conditions as its own.\n\n\nSee also: https://github.com/knative/serving/blob/main/docs/spec/overview.md#service",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "ServiceSpec represents the configuration for the Service object.\nA Service's specification is the union of the specifications for a Route\nand Configuration.  The Service restricts what can be expressed in these\nfields, e.g. the Route must reference the provided Configuration;\nhowever, these limitations also enable friendlier defaulting,\ne.g. Route never needs a Configuration name, and may be defaulted to\nthe appropriate \"run latest\" spec.",
              properties: {
                template: {
                  description: "Template holds the latest specification for the Revision to be stamped out.",
                  properties: {
                    metadata: {
                      properties: {
                        annotations: {
                          additionalProperties: {
                            type: "string"
                          },
                          type: "object"
                        },
                        finalizers: {
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        labels: {
                          additionalProperties: {
                            type: "string"
                          },
                          type: "object"
                        },
                        name: {
                          type: "string"
                        },
                        namespace: {
                          type: "string"
                        }
                      },
                      type: "object",
                      "x-kubernetes-preserve-unknown-fields": true
                    },
                    spec: {
                      description: "RevisionSpec holds the desired state of the Revision (from the client).",
                      properties: {
                        affinity: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-affinity",
                          type: "object",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        automountServiceAccountToken: {
                          description: "AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.",
                          type: "boolean"
                        },
                        containerConcurrency: {
                          description: "ContainerConcurrency specifies the maximum allowed in-flight (concurrent)\nrequests per container of the Revision.  Defaults to `0` which means\nconcurrency to the application is not limited, and the system decides the\ntarget concurrency for the autoscaler.",
                          format: "int64",
                          type: "integer"
                        },
                        containers: {
                          description: "List of containers belonging to the pod.\nContainers cannot currently be added or removed.\nThere must be at least one container in a Pod.\nCannot be updated.",
                          items: {
                            description: "A single application container that you want to run within a pod.",
                            properties: {
                              args: {
                                description: "Arguments to the entrypoint.\nThe container image's CMD is used if this is not provided.\nVariable references $(VAR_NAME) are expanded using the container's environment. If a variable\ncannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. \"$$(VAR_NAME)\" will\nproduce the string literal \"$(VAR_NAME)\". Escaped references will never be expanded, regardless\nof whether the variable exists or not. Cannot be updated.\nMore info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              command: {
                                description: "Entrypoint array. Not executed within a shell.\nThe container image's ENTRYPOINT is used if this is not provided.\nVariable references $(VAR_NAME) are expanded using the container's environment. If a variable\ncannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. \"$$(VAR_NAME)\" will\nproduce the string literal \"$(VAR_NAME)\". Escaped references will never be expanded, regardless\nof whether the variable exists or not. Cannot be updated.\nMore info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              env: {
                                description: "List of environment variables to set in the container.\nCannot be updated.",
                                items: {
                                  description: "EnvVar represents an environment variable present in a Container.",
                                  properties: {
                                    name: {
                                      description: "Name of the environment variable. Must be a C_IDENTIFIER.",
                                      type: "string"
                                    },
                                    value: {
                                      description: "Variable references $(VAR_NAME) are expanded\nusing the previously defined environment variables in the container and\nany service environment variables. If a variable cannot be resolved,\nthe reference in the input string will be unchanged. Double $$ are reduced\nto a single $, which allows for escaping the $(VAR_NAME) syntax: i.e.\n\"$$(VAR_NAME)\" will produce the string literal \"$(VAR_NAME)\".\nEscaped references will never be expanded, regardless of whether the variable\nexists or not.\nDefaults to \"\".",
                                      type: "string"
                                    },
                                    valueFrom: {
                                      description: "Source for the environment variable's value. Cannot be used if value is not empty.",
                                      properties: {
                                        configMapKeyRef: {
                                          description: "Selects a key of a ConfigMap.",
                                          properties: {
                                            key: {
                                              description: "The key to select.",
                                              type: "string"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "Specify whether the ConfigMap or its key must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          required: ["key"],
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        },
                                        fieldRef: {
                                          description: "This is accessible behind a feature flag - kubernetes.podspec-fieldref",
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic",
                                          "x-kubernetes-preserve-unknown-fields": true
                                        },
                                        resourceFieldRef: {
                                          description: "This is accessible behind a feature flag - kubernetes.podspec-fieldref",
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic",
                                          "x-kubernetes-preserve-unknown-fields": true
                                        },
                                        secretKeyRef: {
                                          description: "Selects a key of a secret in the pod's namespace",
                                          properties: {
                                            key: {
                                              description: "The key of the secret to select from.  Must be a valid secret key.",
                                              type: "string"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "Specify whether the Secret or its key must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          required: ["key"],
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        }
                                      },
                                      type: "object"
                                    }
                                  },
                                  required: ["name"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              envFrom: {
                                description: "List of sources to populate environment variables in the container.\nThe keys defined within a source must be a C_IDENTIFIER. All invalid keys\nwill be reported as an event when the container is starting. When a key exists in multiple\nsources, the value associated with the last source will take precedence.\nValues defined by an Env with a duplicate key will take precedence.\nCannot be updated.",
                                items: {
                                  description: "EnvFromSource represents the source of a set of ConfigMaps",
                                  properties: {
                                    configMapRef: {
                                      description: "The ConfigMap to select from",
                                      properties: {
                                        name: {
                                          description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                          type: "string"
                                        },
                                        optional: {
                                          description: "Specify whether the ConfigMap must be defined",
                                          type: "boolean"
                                        }
                                      },
                                      type: "object",
                                      "x-kubernetes-map-type": "atomic"
                                    },
                                    prefix: {
                                      description: "An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.",
                                      type: "string"
                                    },
                                    secretRef: {
                                      description: "The Secret to select from",
                                      properties: {
                                        name: {
                                          description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                          type: "string"
                                        },
                                        optional: {
                                          description: "Specify whether the Secret must be defined",
                                          type: "boolean"
                                        }
                                      },
                                      type: "object",
                                      "x-kubernetes-map-type": "atomic"
                                    }
                                  },
                                  type: "object"
                                },
                                type: "array"
                              },
                              image: {
                                description: "Container image name.\nMore info: https://kubernetes.io/docs/concepts/containers/images\nThis field is optional to allow higher level config management to default or override\ncontainer images in workload controllers like Deployments and StatefulSets.",
                                type: "string"
                              },
                              imagePullPolicy: {
                                description: "Image pull policy.\nOne of Always, Never, IfNotPresent.\nDefaults to Always if :latest tag is specified, or IfNotPresent otherwise.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/containers/images#updating-images",
                                type: "string"
                              },
                              livenessProbe: {
                                description: "Periodic probe of container liveness.\nContainer will be restarted if the probe fails.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                properties: {
                                  exec: {
                                    description: "Exec specifies the action to take.",
                                    properties: {
                                      command: {
                                        description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                        items: {
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  failureThreshold: {
                                    description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  grpc: {
                                    description: "GRPC specifies an action involving a GRPC port.",
                                    properties: {
                                      port: {
                                        description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                        format: "int32",
                                        type: "integer"
                                      },
                                      service: {
                                        description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                        type: "string"
                                      }
                                    },
                                    required: ["port"],
                                    type: "object"
                                  },
                                  httpGet: {
                                    description: "HTTPGet specifies the http request to perform.",
                                    properties: {
                                      host: {
                                        description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                        type: "string"
                                      },
                                      httpHeaders: {
                                        description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                        items: {
                                          description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                          properties: {
                                            name: {
                                              description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                              type: "string"
                                            },
                                            value: {
                                              description: "The header field value",
                                              type: "string"
                                            }
                                          },
                                          required: ["name", "value"],
                                          type: "object"
                                        },
                                        type: "array"
                                      },
                                      path: {
                                        description: "Path to access on the HTTP server.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      },
                                      scheme: {
                                        description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  initialDelaySeconds: {
                                    description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  periodSeconds: {
                                    description: "How often (in seconds) to perform the probe.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  successThreshold: {
                                    description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  tcpSocket: {
                                    description: "TCPSocket specifies an action involving a TCP port.",
                                    properties: {
                                      host: {
                                        description: "Optional: Host name to connect to, defaults to the pod IP.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    type: "object"
                                  },
                                  timeoutSeconds: {
                                    description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  }
                                },
                                type: "object"
                              },
                              name: {
                                description: "Name of the container specified as a DNS_LABEL.\nEach container in a pod must have a unique name (DNS_LABEL).\nCannot be updated.",
                                type: "string"
                              },
                              ports: {
                                description: "List of ports to expose from the container. Not specifying a port here\nDOES NOT prevent that port from being exposed. Any port which is\nlistening on the default \"0.0.0.0\" address inside a container will be\naccessible from the network.\nModifying this array with strategic merge patch may corrupt the data.\nFor more information See https://github.com/kubernetes/kubernetes/issues/108255.\nCannot be updated.",
                                items: {
                                  description: "ContainerPort represents a network port in a single container.",
                                  properties: {
                                    containerPort: {
                                      description: "Number of port to expose on the pod's IP address.\nThis must be a valid port number, 0 < x < 65536.",
                                      format: "int32",
                                      type: "integer"
                                    },
                                    name: {
                                      description: "If specified, this must be an IANA_SVC_NAME and unique within the pod. Each\nnamed port in a pod must have a unique name. Name for the port that can be\nreferred to by services.",
                                      type: "string"
                                    },
                                    protocol: {
                                      default: "TCP",
                                      description: "Protocol for port. Must be UDP, TCP, or SCTP.\nDefaults to \"TCP\".",
                                      type: "string"
                                    }
                                  },
                                  required: ["containerPort"],
                                  type: "object"
                                },
                                type: "array",
                                "x-kubernetes-list-map-keys": ["containerPort", "protocol"],
                                "x-kubernetes-list-type": "map"
                              },
                              readinessProbe: {
                                description: "Periodic probe of container service readiness.\nContainer will be removed from service endpoints if the probe fails.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                properties: {
                                  exec: {
                                    description: "Exec specifies the action to take.",
                                    properties: {
                                      command: {
                                        description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                        items: {
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  failureThreshold: {
                                    description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  grpc: {
                                    description: "GRPC specifies an action involving a GRPC port.",
                                    properties: {
                                      port: {
                                        description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                        format: "int32",
                                        type: "integer"
                                      },
                                      service: {
                                        description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                        type: "string"
                                      }
                                    },
                                    required: ["port"],
                                    type: "object"
                                  },
                                  httpGet: {
                                    description: "HTTPGet specifies the http request to perform.",
                                    properties: {
                                      host: {
                                        description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                        type: "string"
                                      },
                                      httpHeaders: {
                                        description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                        items: {
                                          description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                          properties: {
                                            name: {
                                              description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                              type: "string"
                                            },
                                            value: {
                                              description: "The header field value",
                                              type: "string"
                                            }
                                          },
                                          required: ["name", "value"],
                                          type: "object"
                                        },
                                        type: "array"
                                      },
                                      path: {
                                        description: "Path to access on the HTTP server.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      },
                                      scheme: {
                                        description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  initialDelaySeconds: {
                                    description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  periodSeconds: {
                                    description: "How often (in seconds) to perform the probe.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  successThreshold: {
                                    description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  tcpSocket: {
                                    description: "TCPSocket specifies an action involving a TCP port.",
                                    properties: {
                                      host: {
                                        description: "Optional: Host name to connect to, defaults to the pod IP.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    type: "object"
                                  },
                                  timeoutSeconds: {
                                    description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  }
                                },
                                type: "object"
                              },
                              resources: {
                                description: "Compute Resources required by this container.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                                properties: {
                                  claims: {
                                    description: "Claims lists the names of resources, defined in spec.resourceClaims,\nthat are used by this container.\n\n\nThis is an alpha field and requires enabling the\nDynamicResourceAllocation feature gate.\n\n\nThis field is immutable. It can only be set for containers.",
                                    items: {
                                      description: "ResourceClaim references one entry in PodSpec.ResourceClaims.",
                                      properties: {
                                        name: {
                                          description: "Name must match the name of one entry in pod.spec.resourceClaims of\nthe Pod where this field is used. It makes that resource available\ninside a container.",
                                          type: "string"
                                        }
                                      },
                                      required: ["name"],
                                      type: "object"
                                    },
                                    type: "array",
                                    "x-kubernetes-list-map-keys": ["name"],
                                    "x-kubernetes-list-type": "map"
                                  },
                                  limits: {
                                    additionalProperties: {
                                      anyOf: [{
                                        type: "integer"
                                      }, {
                                        type: "string"
                                      }],
                                      pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                      "x-kubernetes-int-or-string": true
                                    },
                                    description: "Limits describes the maximum amount of compute resources allowed.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                                    type: "object"
                                  },
                                  requests: {
                                    additionalProperties: {
                                      anyOf: [{
                                        type: "integer"
                                      }, {
                                        type: "string"
                                      }],
                                      pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                      "x-kubernetes-int-or-string": true
                                    },
                                    description: "Requests describes the minimum amount of compute resources required.\nIf Requests is omitted for a container, it defaults to Limits if that is explicitly specified,\notherwise to an implementation-defined value. Requests cannot exceed Limits.\nMore info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
                                    type: "object"
                                  }
                                },
                                type: "object"
                              },
                              securityContext: {
                                description: "SecurityContext defines the security options the container should be run with.\nIf set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.\nMore info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/",
                                properties: {
                                  allowPrivilegeEscalation: {
                                    description: "AllowPrivilegeEscalation controls whether a process can gain more\nprivileges than its parent process. This bool directly controls if\nthe no_new_privs flag will be set on the container process.\nAllowPrivilegeEscalation is true always when the container is:\n1) run as Privileged\n2) has CAP_SYS_ADMIN\nNote that this field cannot be set when spec.os.name is windows.",
                                    type: "boolean"
                                  },
                                  capabilities: {
                                    description: "The capabilities to add/drop when running containers.\nDefaults to the default set of capabilities granted by the container runtime.\nNote that this field cannot be set when spec.os.name is windows.",
                                    properties: {
                                      add: {
                                        description: "This is accessible behind a feature flag - kubernetes.containerspec-addcapabilities",
                                        items: {
                                          description: "Capability represent POSIX capabilities type",
                                          type: "string"
                                        },
                                        type: "array"
                                      },
                                      drop: {
                                        description: "Removed capabilities",
                                        items: {
                                          description: "Capability represent POSIX capabilities type",
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  readOnlyRootFilesystem: {
                                    description: "Whether this container has a read-only root filesystem.\nDefault is false.\nNote that this field cannot be set when spec.os.name is windows.",
                                    type: "boolean"
                                  },
                                  runAsGroup: {
                                    description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.\nNote that this field cannot be set when spec.os.name is windows.",
                                    format: "int64",
                                    type: "integer"
                                  },
                                  runAsNonRoot: {
                                    description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                    type: "boolean"
                                  },
                                  runAsUser: {
                                    description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in PodSecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.\nNote that this field cannot be set when spec.os.name is windows.",
                                    format: "int64",
                                    type: "integer"
                                  },
                                  seccompProfile: {
                                    description: "The seccomp options to use by this container. If seccomp options are\nprovided at both the pod & container level, the container options\noverride the pod options.\nNote that this field cannot be set when spec.os.name is windows.",
                                    properties: {
                                      localhostProfile: {
                                        description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                        type: "string"
                                      },
                                      type: {
                                        description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                        type: "string"
                                      }
                                    },
                                    required: ["type"],
                                    type: "object"
                                  }
                                },
                                type: "object"
                              },
                              startupProbe: {
                                description: "StartupProbe indicates that the Pod has successfully initialized.\nIf specified, no other probes are executed until this completes successfully.\nIf this probe fails, the Pod will be restarted, just as if the livenessProbe failed.\nThis can be used to provide different probe parameters at the beginning of a Pod's lifecycle,\nwhen it might take a long time to load data or warm a cache, than during steady-state operation.\nThis cannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                properties: {
                                  exec: {
                                    description: "Exec specifies the action to take.",
                                    properties: {
                                      command: {
                                        description: "Command is the command line to execute inside the container, the working directory for the\ncommand  is root ('/') in the container's filesystem. The command is simply exec'd, it is\nnot run inside a shell, so traditional shell instructions ('|', etc) won't work. To use\na shell, you need to explicitly call out to that shell.\nExit status of 0 is treated as live/healthy and non-zero is unhealthy.",
                                        items: {
                                          type: "string"
                                        },
                                        type: "array"
                                      }
                                    },
                                    type: "object"
                                  },
                                  failureThreshold: {
                                    description: "Minimum consecutive failures for the probe to be considered failed after having succeeded.\nDefaults to 3. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  grpc: {
                                    description: "GRPC specifies an action involving a GRPC port.",
                                    properties: {
                                      port: {
                                        description: "Port number of the gRPC service. Number must be in the range 1 to 65535.",
                                        format: "int32",
                                        type: "integer"
                                      },
                                      service: {
                                        description: "Service is the name of the service to place in the gRPC HealthCheckRequest\n(see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\n\nIf this is not specified, the default behavior is defined by gRPC.",
                                        type: "string"
                                      }
                                    },
                                    required: ["port"],
                                    type: "object"
                                  },
                                  httpGet: {
                                    description: "HTTPGet specifies the http request to perform.",
                                    properties: {
                                      host: {
                                        description: "Host name to connect to, defaults to the pod IP. You probably want to set\n\"Host\" in httpHeaders instead.",
                                        type: "string"
                                      },
                                      httpHeaders: {
                                        description: "Custom headers to set in the request. HTTP allows repeated headers.",
                                        items: {
                                          description: "HTTPHeader describes a custom header to be used in HTTP probes",
                                          properties: {
                                            name: {
                                              description: "The header field name.\nThis will be canonicalized upon output, so case-variant names will be understood as the same header.",
                                              type: "string"
                                            },
                                            value: {
                                              description: "The header field value",
                                              type: "string"
                                            }
                                          },
                                          required: ["name", "value"],
                                          type: "object"
                                        },
                                        type: "array"
                                      },
                                      path: {
                                        description: "Path to access on the HTTP server.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Name or number of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      },
                                      scheme: {
                                        description: "Scheme to use for connecting to the host.\nDefaults to HTTP.",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  initialDelaySeconds: {
                                    description: "Number of seconds after the container has started before liveness probes are initiated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  periodSeconds: {
                                    description: "How often (in seconds) to perform the probe.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  successThreshold: {
                                    description: "Minimum consecutive successes for the probe to be considered successful after having failed.\nDefaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  tcpSocket: {
                                    description: "TCPSocket specifies an action involving a TCP port.",
                                    properties: {
                                      host: {
                                        description: "Optional: Host name to connect to, defaults to the pod IP.",
                                        type: "string"
                                      },
                                      port: {
                                        anyOf: [{
                                          type: "integer"
                                        }, {
                                          type: "string"
                                        }],
                                        description: "Number or name of the port to access on the container.\nNumber must be in the range 1 to 65535.\nName must be an IANA_SVC_NAME.",
                                        "x-kubernetes-int-or-string": true
                                      }
                                    },
                                    type: "object"
                                  },
                                  timeoutSeconds: {
                                    description: "Number of seconds after which the probe times out.\nDefaults to 1 second. Minimum value is 1.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
                                    format: "int32",
                                    type: "integer"
                                  }
                                },
                                type: "object"
                              },
                              terminationMessagePath: {
                                description: "Optional: Path at which the file to which the container's termination message\nwill be written is mounted into the container's filesystem.\nMessage written is intended to be brief final status, such as an assertion failure message.\nWill be truncated by the node if greater than 4096 bytes. The total message length across\nall containers will be limited to 12kb.\nDefaults to /dev/termination-log.\nCannot be updated.",
                                type: "string"
                              },
                              terminationMessagePolicy: {
                                description: "Indicate how the termination message should be populated. File will use the contents of\nterminationMessagePath to populate the container status message on both success and failure.\nFallbackToLogsOnError will use the last chunk of container log output if the termination\nmessage file is empty and the container exited with an error.\nThe log output is limited to 2048 bytes or 80 lines, whichever is smaller.\nDefaults to File.\nCannot be updated.",
                                type: "string"
                              },
                              volumeMounts: {
                                description: "Pod volumes to mount into the container's filesystem.\nCannot be updated.",
                                items: {
                                  description: "VolumeMount describes a mounting of a Volume within a container.",
                                  properties: {
                                    mountPath: {
                                      description: "Path within the container at which the volume should be mounted.  Must\nnot contain ':'.",
                                      type: "string"
                                    },
                                    name: {
                                      description: "This must match the Name of a Volume.",
                                      type: "string"
                                    },
                                    readOnly: {
                                      description: "Mounted read-only if true, read-write otherwise (false or unspecified).\nDefaults to false.",
                                      type: "boolean"
                                    },
                                    subPath: {
                                      description: "Path within the volume from which the container's volume should be mounted.\nDefaults to \"\" (volume's root).",
                                      type: "string"
                                    }
                                  },
                                  required: ["mountPath", "name"],
                                  type: "object"
                                },
                                type: "array"
                              },
                              workingDir: {
                                description: "Container's working directory.\nIf not specified, the container runtime's default will be used, which\nmight be configured in the container image.\nCannot be updated.",
                                type: "string"
                              }
                            },
                            type: "object"
                          },
                          type: "array"
                        },
                        dnsConfig: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-dnsconfig",
                          type: "object",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        dnsPolicy: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-dnspolicy",
                          type: "string"
                        },
                        enableServiceLinks: {
                          description: "EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Knative defaults this to false.",
                          type: "boolean"
                        },
                        hostAliases: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-hostaliases",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-hostaliases",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        idleTimeoutSeconds: {
                          description: "IdleTimeoutSeconds is the maximum duration in seconds a request will be allowed\nto stay open while not receiving any bytes from the user's application. If\nunspecified, a system default will be provided.",
                          format: "int64",
                          type: "integer"
                        },
                        imagePullSecrets: {
                          description: "ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec.\nIf specified, these secrets will be passed to individual puller implementations for them to use.\nMore info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod",
                          items: {
                            description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                            properties: {
                              name: {
                                description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                type: "string"
                              }
                            },
                            type: "object",
                            "x-kubernetes-map-type": "atomic"
                          },
                          type: "array"
                        },
                        initContainers: {
                          description: "List of initialization containers belonging to the pod.\nInit containers are executed in order prior to containers being started. If any\ninit container fails, the pod is considered to have failed and is handled according\nto its restartPolicy. The name for an init container or normal container must be\nunique among all containers.\nInit containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes.\nThe resourceRequirements of an init container are taken into account during scheduling\nby finding the highest request/limit for each resource type, and then using the max of\nof that value or the sum of the normal containers. Limits are applied to init containers\nin a similar fashion.\nInit containers cannot currently be added or removed.\nCannot be updated.\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-init-containers",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        nodeSelector: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-nodeselector",
                          type: "object",
                          "x-kubernetes-map-type": "atomic",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        priorityClassName: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-priorityclassname",
                          type: "string",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        responseStartTimeoutSeconds: {
                          description: "ResponseStartTimeoutSeconds is the maximum duration in seconds that the request\nrouting layer will wait for a request delivered to a container to begin\nsending any network traffic.",
                          format: "int64",
                          type: "integer"
                        },
                        runtimeClassName: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-runtimeclassname",
                          type: "string",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        schedulerName: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-schedulername",
                          type: "string",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        securityContext: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-securitycontext",
                          type: "object",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        serviceAccountName: {
                          description: "ServiceAccountName is the name of the ServiceAccount to use to run this pod.\nMore info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
                          type: "string"
                        },
                        shareProcessNamespace: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-shareproccessnamespace",
                          type: "boolean",
                          "x-kubernetes-preserve-unknown-fields": true
                        },
                        timeoutSeconds: {
                          description: "TimeoutSeconds is the maximum duration in seconds that the request instance\nis allowed to respond to a request. If unspecified, a system default will\nbe provided.",
                          format: "int64",
                          type: "integer"
                        },
                        tolerations: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-tolerations",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-tolerations",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        topologySpreadConstraints: {
                          description: "This is accessible behind a feature flag - kubernetes.podspec-topologyspreadconstraints",
                          items: {
                            description: "This is accessible behind a feature flag - kubernetes.podspec-topologyspreadconstraints",
                            type: "object",
                            "x-kubernetes-preserve-unknown-fields": true
                          },
                          type: "array"
                        },
                        volumes: {
                          description: "List of volumes that can be mounted by containers belonging to the pod.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes",
                          items: {
                            description: "Volume represents a named volume in a pod that may be accessed by any container in the pod.",
                            properties: {
                              configMap: {
                                description: "configMap represents a configMap that should populate this volume",
                                properties: {
                                  defaultMode: {
                                    description: "defaultMode is optional: mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nDefaults to 0644.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  items: {
                                    description: "items if unspecified, each key-value pair in the Data field of the referenced\nConfigMap will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the ConfigMap,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                    items: {
                                      description: "Maps a string key to a path within a volume.",
                                      properties: {
                                        key: {
                                          description: "key is the key to project.",
                                          type: "string"
                                        },
                                        mode: {
                                          description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                          format: "int32",
                                          type: "integer"
                                        },
                                        path: {
                                          description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                          type: "string"
                                        }
                                      },
                                      required: ["key", "path"],
                                      type: "object"
                                    },
                                    type: "array"
                                  },
                                  name: {
                                    description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                    type: "string"
                                  },
                                  optional: {
                                    description: "optional specify whether the ConfigMap or its keys must be defined",
                                    type: "boolean"
                                  }
                                },
                                type: "object",
                                "x-kubernetes-map-type": "atomic"
                              },
                              emptyDir: {
                                description: "This is accessible behind a feature flag - kubernetes.podspec-emptydir",
                                type: "object",
                                "x-kubernetes-preserve-unknown-fields": true
                              },
                              name: {
                                description: "name of the volume.\nMust be a DNS_LABEL and unique within the pod.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                type: "string"
                              },
                              persistentVolumeClaim: {
                                description: "This is accessible behind a feature flag - kubernetes.podspec-persistent-volume-claim",
                                type: "object",
                                "x-kubernetes-preserve-unknown-fields": true
                              },
                              projected: {
                                description: "projected items for all in one resources secrets, configmaps, and downward API",
                                properties: {
                                  defaultMode: {
                                    description: "defaultMode are the mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  sources: {
                                    description: "sources is the list of volume projections",
                                    items: {
                                      description: "Projection that may be projected along with other supported volume types",
                                      properties: {
                                        configMap: {
                                          description: "configMap information about the configMap data to project",
                                          properties: {
                                            items: {
                                              description: "items if unspecified, each key-value pair in the Data field of the referenced\nConfigMap will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the ConfigMap,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                              items: {
                                                description: "Maps a string key to a path within a volume.",
                                                properties: {
                                                  key: {
                                                    description: "key is the key to project.",
                                                    type: "string"
                                                  },
                                                  mode: {
                                                    description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                                    format: "int32",
                                                    type: "integer"
                                                  },
                                                  path: {
                                                    description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["key", "path"],
                                                type: "object"
                                              },
                                              type: "array"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "optional specify whether the ConfigMap or its keys must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        },
                                        downwardAPI: {
                                          description: "downwardAPI information about the downwardAPI data to project",
                                          properties: {
                                            items: {
                                              description: "Items is a list of DownwardAPIVolume file",
                                              items: {
                                                description: "DownwardAPIVolumeFile represents information to create the file containing the pod field",
                                                properties: {
                                                  fieldRef: {
                                                    description: "Required: Selects a field of the pod: only annotations, labels, name and namespace are supported.",
                                                    properties: {
                                                      apiVersion: {
                                                        description: "Version of the schema the FieldPath is written in terms of, defaults to \"v1\".",
                                                        type: "string"
                                                      },
                                                      fieldPath: {
                                                        description: "Path of the field to select in the specified API version.",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["fieldPath"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  mode: {
                                                    description: "Optional: mode bits used to set permissions on this file, must be an octal value\nbetween 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                                    format: "int32",
                                                    type: "integer"
                                                  },
                                                  path: {
                                                    description: "Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'",
                                                    type: "string"
                                                  },
                                                  resourceFieldRef: {
                                                    description: "Selects a resource of the container: only resources limits and requests\n(limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.",
                                                    properties: {
                                                      containerName: {
                                                        description: "Container name: required for volumes, optional for env vars",
                                                        type: "string"
                                                      },
                                                      divisor: {
                                                        anyOf: [{
                                                          type: "integer"
                                                        }, {
                                                          type: "string"
                                                        }],
                                                        description: "Specifies the output format of the exposed resources, defaults to \"1\"",
                                                        pattern: "^(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))(([KMGTPE]i)|[numkMGTPE]|([eE](\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))))?$",
                                                        "x-kubernetes-int-or-string": true
                                                      },
                                                      resource: {
                                                        description: "Required: resource to select",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["resource"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  }
                                                },
                                                required: ["path"],
                                                type: "object"
                                              },
                                              type: "array"
                                            }
                                          },
                                          type: "object"
                                        },
                                        secret: {
                                          description: "secret information about the secret data to project",
                                          properties: {
                                            items: {
                                              description: "items if unspecified, each key-value pair in the Data field of the referenced\nSecret will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the Secret,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                              items: {
                                                description: "Maps a string key to a path within a volume.",
                                                properties: {
                                                  key: {
                                                    description: "key is the key to project.",
                                                    type: "string"
                                                  },
                                                  mode: {
                                                    description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                                    format: "int32",
                                                    type: "integer"
                                                  },
                                                  path: {
                                                    description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["key", "path"],
                                                type: "object"
                                              },
                                              type: "array"
                                            },
                                            name: {
                                              description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                                              type: "string"
                                            },
                                            optional: {
                                              description: "optional field specify whether the Secret or its key must be defined",
                                              type: "boolean"
                                            }
                                          },
                                          type: "object",
                                          "x-kubernetes-map-type": "atomic"
                                        },
                                        serviceAccountToken: {
                                          description: "serviceAccountToken is information about the serviceAccountToken data to project",
                                          properties: {
                                            audience: {
                                              description: "audience is the intended audience of the token. A recipient of a token\nmust identify itself with an identifier specified in the audience of the\ntoken, and otherwise should reject the token. The audience defaults to the\nidentifier of the apiserver.",
                                              type: "string"
                                            },
                                            expirationSeconds: {
                                              description: "expirationSeconds is the requested duration of validity of the service\naccount token. As the token approaches expiration, the kubelet volume\nplugin will proactively rotate the service account token. The kubelet will\nstart trying to rotate the token if the token is older than 80 percent of\nits time to live or if the token is older than 24 hours.Defaults to 1 hour\nand must be at least 10 minutes.",
                                              format: "int64",
                                              type: "integer"
                                            },
                                            path: {
                                              description: "path is the path relative to the mount point of the file to project the\ntoken into.",
                                              type: "string"
                                            }
                                          },
                                          required: ["path"],
                                          type: "object"
                                        }
                                      },
                                      type: "object"
                                    },
                                    type: "array"
                                  }
                                },
                                type: "object"
                              },
                              secret: {
                                description: "secret represents a secret that should populate this volume.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
                                properties: {
                                  defaultMode: {
                                    description: "defaultMode is Optional: mode bits used to set permissions on created files by default.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values\nfor mode bits. Defaults to 0644.\nDirectories within the path are not affected by this setting.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                    format: "int32",
                                    type: "integer"
                                  },
                                  items: {
                                    description: "items If unspecified, each key-value pair in the Data field of the referenced\nSecret will be projected into the volume as a file whose name is the\nkey and content is the value. If specified, the listed keys will be\nprojected into the specified paths, and unlisted keys will not be\npresent. If a key is specified which is not present in the Secret,\nthe volume setup will error unless it is marked optional. Paths must be\nrelative and may not contain the '..' path or start with '..'.",
                                    items: {
                                      description: "Maps a string key to a path within a volume.",
                                      properties: {
                                        key: {
                                          description: "key is the key to project.",
                                          type: "string"
                                        },
                                        mode: {
                                          description: "mode is Optional: mode bits used to set permissions on this file.\nMust be an octal value between 0000 and 0777 or a decimal value between 0 and 511.\nYAML accepts both octal and decimal values, JSON requires decimal values for mode bits.\nIf not specified, the volume defaultMode will be used.\nThis might be in conflict with other options that affect the file\nmode, like fsGroup, and the result can be other mode bits set.",
                                          format: "int32",
                                          type: "integer"
                                        },
                                        path: {
                                          description: "path is the relative path of the file to map the key to.\nMay not be an absolute path.\nMay not contain the path element '..'.\nMay not start with the string '..'.",
                                          type: "string"
                                        }
                                      },
                                      required: ["key", "path"],
                                      type: "object"
                                    },
                                    type: "array"
                                  },
                                  optional: {
                                    description: "optional field specify whether the Secret or its keys must be defined",
                                    type: "boolean"
                                  },
                                  secretName: {
                                    description: "secretName is the name of the secret in the pod's namespace to use.\nMore info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              }
                            },
                            required: ["name"],
                            type: "object"
                          },
                          type: "array"
                        }
                      },
                      required: ["containers"],
                      type: "object"
                    }
                  },
                  type: "object"
                },
                traffic: {
                  description: "Traffic specifies how to distribute traffic over a collection of\nrevisions and configurations.",
                  items: {
                    description: "TrafficTarget holds a single entry of the routing table for a Route.",
                    properties: {
                      configurationName: {
                        description: "ConfigurationName of a configuration to whose latest revision we will send\nthis portion of traffic. When the \"status.latestReadyRevisionName\" of the\nreferenced configuration changes, we will automatically migrate traffic\nfrom the prior \"latest ready\" revision to the new one.  This field is never\nset in Route's status, only its spec.  This is mutually exclusive with\nRevisionName.",
                        type: "string"
                      },
                      latestRevision: {
                        description: "LatestRevision may be optionally provided to indicate that the latest\nready Revision of the Configuration should be used for this traffic\ntarget.  When provided LatestRevision must be true if RevisionName is\nempty; it must be false when RevisionName is non-empty.",
                        type: "boolean"
                      },
                      percent: {
                        description: "Percent indicates that percentage based routing should be used and\nthe value indicates the percent of traffic that is be routed to this\nRevision or Configuration. `0` (zero) mean no traffic, `100` means all\ntraffic.\nWhen percentage based routing is being used the follow rules apply:\n- the sum of all percent values must equal 100\n- when not specified, the implied value for `percent` is zero for\n  that particular Revision or Configuration",
                        format: "int64",
                        type: "integer"
                      },
                      revisionName: {
                        description: "RevisionName of a specific revision to which to send this portion of\ntraffic.  This is mutually exclusive with ConfigurationName.",
                        type: "string"
                      },
                      tag: {
                        description: "Tag is optionally used to expose a dedicated url for referencing\nthis target exclusively.",
                        type: "string"
                      },
                      url: {
                        description: "URL displays the URL for accessing named traffic targets. URL is displayed in\nstatus, and is disallowed on spec. URL must contain a scheme (e.g. http://) and\na hostname, but may not contain anything else (e.g. basic auth, url path, etc.)",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                }
              },
              type: "object"
            },
            status: {
              description: "ServiceStatus represents the Status stanza of the Service resource.",
              properties: {
                address: {
                  description: "Address holds the information needed for a Route to be the target of an event.",
                  properties: {
                    audience: {
                      description: "Audience is the OIDC audience for this address.",
                      type: "string"
                    },
                    CACerts: {
                      description: "CACerts is the Certification Authority (CA) certificates in PEM format\naccording to https://www.rfc-editor.org/rfc/rfc7468.",
                      type: "string"
                    },
                    name: {
                      description: "Name is the name of the address.",
                      type: "string"
                    },
                    url: {
                      type: "string"
                    }
                  },
                  type: "object"
                },
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                latestCreatedRevisionName: {
                  description: "LatestCreatedRevisionName is the last revision that was created from this\nConfiguration. It might not be ready yet, for that use LatestReadyRevisionName.",
                  type: "string"
                },
                latestReadyRevisionName: {
                  description: "LatestReadyRevisionName holds the name of the latest Revision stamped out\nfrom this Configuration that has had its \"Ready\" condition become \"True\".",
                  type: "string"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                },
                traffic: {
                  description: "Traffic holds the configured traffic distribution.\nThese entries will always contain RevisionName references.\nWhen ConfigurationName appears in the spec, this will hold the\nLatestReadyRevisionName that we last observed.",
                  items: {
                    description: "TrafficTarget holds a single entry of the routing table for a Route.",
                    properties: {
                      configurationName: {
                        description: "ConfigurationName of a configuration to whose latest revision we will send\nthis portion of traffic. When the \"status.latestReadyRevisionName\" of the\nreferenced configuration changes, we will automatically migrate traffic\nfrom the prior \"latest ready\" revision to the new one.  This field is never\nset in Route's status, only its spec.  This is mutually exclusive with\nRevisionName.",
                        type: "string"
                      },
                      latestRevision: {
                        description: "LatestRevision may be optionally provided to indicate that the latest\nready Revision of the Configuration should be used for this traffic\ntarget.  When provided LatestRevision must be true if RevisionName is\nempty; it must be false when RevisionName is non-empty.",
                        type: "boolean"
                      },
                      percent: {
                        description: "Percent indicates that percentage based routing should be used and\nthe value indicates the percent of traffic that is be routed to this\nRevision or Configuration. `0` (zero) mean no traffic, `100` means all\ntraffic.\nWhen percentage based routing is being used the follow rules apply:\n- the sum of all percent values must equal 100\n- when not specified, the implied value for `percent` is zero for\n  that particular Revision or Configuration",
                        format: "int64",
                        type: "integer"
                      },
                      revisionName: {
                        description: "RevisionName of a specific revision to which to send this portion of\ntraffic.  This is mutually exclusive with ConfigurationName.",
                        type: "string"
                      },
                      tag: {
                        description: "Tag is optionally used to expose a dedicated url for referencing\nthis target exclusively.",
                        type: "string"
                      },
                      url: {
                        description: "URL displays the URL for accessing named traffic targets. URL is displayed in\nstatus, and is disallowed on spec. URL must contain a scheme (e.g. http://) and\na hostname, but may not contain anything else (e.g. basic auth, url path, etc.)",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                url: {
                  description: "URL holds the url that will distribute traffic over the provided traffic targets.\nIt generally has the form http[s]://{route-name}.{route-namespace}.{cluster-level-suffix}",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const CustomResourceDefinition_ImagesCachingInternalKnativeDev: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "knative.dev/crd-install": "true"
    },
    name: "images.caching.internal.knative.dev"
  },
  spec: {
    group: "caching.internal.knative.dev",
    names: {
      categories: ["knative-internal", "caching"],
      kind: "Image",
      plural: "images",
      singular: "image"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".spec.image",
        name: "Image",
        type: "string"
      }],
      name: "v1alpha1",
      schema: {
        openAPIV3Schema: {
          description: "Image is a Knative abstraction that encapsulates the interface by which Knative\ncomponents express a desire to have a particular image cached.",
          properties: {
            apiVersion: {
              description: "APIVersion defines the versioned schema of this representation of an object.\nServers should convert recognized schemas to the latest internal value, and\nmay reject unrecognized values.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
              type: "string"
            },
            kind: {
              description: "Kind is a string value representing the REST resource this object represents.\nServers may infer this from the endpoint the client submits requests to.\nCannot be updated.\nIn CamelCase.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
              type: "string"
            },
            metadata: {
              type: "object"
            },
            spec: {
              description: "Spec holds the desired state of the Image (from the client).",
              properties: {
                image: {
                  description: "Image is the name of the container image url to cache across the cluster.",
                  type: "string"
                },
                imagePullSecrets: {
                  description: "ImagePullSecrets contains the names of the Kubernetes Secrets containing login\ninformation used by the Pods which will run this container.",
                  items: {
                    description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                    properties: {
                      name: {
                        description: "Name of the referent.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names\nTODO: Add other useful fields. apiVersion, kind, uid?",
                        type: "string"
                      }
                    },
                    type: "object",
                    "x-kubernetes-map-type": "atomic"
                  },
                  type: "array"
                },
                serviceAccountName: {
                  description: "ServiceAccountName is the name of the Kubernetes ServiceAccount as which the Pods\nwill run this container.  This is potentially used to authenticate the image pull\nif the service account has attached pull secrets.  For more information:\nhttps://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account",
                  type: "string"
                }
              },
              required: ["image"],
              type: "object"
            },
            status: {
              description: "Status communicates the observed state of the Image (from the controller).",
              properties: {
                annotations: {
                  additionalProperties: {
                    type: "string"
                  },
                  description: "Annotations is additional Status fields for the Resource to save some\nadditional State as well as convey more information to the user. This is\nroughly akin to Annotations on any k8s resource, just the reconciler conveying\nricher information outwards.",
                  type: "object"
                },
                conditions: {
                  description: "Conditions the latest available observations of a resource's current state.",
                  items: {
                    description: "Condition defines a readiness condition for a Knative resource.\nSee: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the last time the condition transitioned from one status to another.\nWe use VolatileTime in place of metav1.Time to exclude this from creating equality.Semantic\ndifferences (all other things held constant).",
                        type: "string"
                      },
                      message: {
                        description: "A human readable message indicating details about the transition.",
                        type: "string"
                      },
                      reason: {
                        description: "The reason for the condition's last transition.",
                        type: "string"
                      },
                      severity: {
                        description: "Severity with which to treat failures of this type of condition.\nWhen this is not specified, it defaults to Error.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of True, False, Unknown.",
                        type: "string"
                      },
                      type: {
                        description: "Type of condition.",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array"
                },
                observedGeneration: {
                  description: "ObservedGeneration is the 'Generation' of the Service that\nwas last processed by the controller.",
                  format: "int64",
                  type: "integer"
                }
              },
              type: "object"
            }
          },
          type: "object"
        }
      },
      served: true,
      storage: true,
      subresources: {
        status: {}
      }
    }]
  }
};
export const Namespace_KnativeServing: Namespace = {
  apiVersion: "v1",
  kind: "Namespace",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving"
  }
};
export const Role_KnativeServingActivator: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "serving.knative.dev/controller": "true"
    },
    name: "knative-serving-activator",
    namespace: "knative-serving"
  },
  rules: [{
    apiGroups: [""],
    resources: ["configmaps", "secrets"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resourceNames: ["routing-serving-certs", "knative-serving-certs"],
    resources: ["secrets"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_KnativeServingActivatorCluster: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "serving.knative.dev/controller": "true"
    },
    name: "knative-serving-activator-cluster"
  },
  rules: [{
    apiGroups: [""],
    resources: ["services", "endpoints"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["serving.knative.dev"],
    resources: ["revisions"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_KnativeServingAggregatedAddressableResolver: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving-aggregated-addressable-resolver"
  },
  aggregationRule: {
    clusterRoleSelectors: [{
      matchLabels: {
        "duck.knative.dev/addressable": "true"
      }
    }]
  }
};
export const ClusterRole_KnativeServingAddressableResolver: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "duck.knative.dev/addressable": "true"
    },
    name: "knative-serving-addressable-resolver"
  },
  rules: [{
    apiGroups: ["serving.knative.dev"],
    resources: ["routes", "routes/status", "services", "services/status"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_KnativeServingNamespacedAdmin: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "rbac.authorization.k8s.io/aggregate-to-admin": "true"
    },
    name: "knative-serving-namespaced-admin"
  },
  rules: [{
    apiGroups: ["serving.knative.dev"],
    resources: ["*"],
    verbs: ["*"]
  }, {
    apiGroups: ["networking.internal.knative.dev", "autoscaling.internal.knative.dev", "caching.internal.knative.dev"],
    resources: ["*"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_KnativeServingNamespacedEdit: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "rbac.authorization.k8s.io/aggregate-to-edit": "true"
    },
    name: "knative-serving-namespaced-edit"
  },
  rules: [{
    apiGroups: ["serving.knative.dev"],
    resources: ["*"],
    verbs: ["create", "update", "patch", "delete"]
  }, {
    apiGroups: ["networking.internal.knative.dev", "autoscaling.internal.knative.dev", "caching.internal.knative.dev"],
    resources: ["*"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_KnativeServingNamespacedView: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "rbac.authorization.k8s.io/aggregate-to-view": "true"
    },
    name: "knative-serving-namespaced-view"
  },
  rules: [{
    apiGroups: ["serving.knative.dev", "networking.internal.knative.dev", "autoscaling.internal.knative.dev", "caching.internal.knative.dev"],
    resources: ["*"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_KnativeServingCore: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "serving.knative.dev/controller": "true"
    },
    name: "knative-serving-core"
  },
  rules: [{
    apiGroups: [""],
    resources: ["pods", "namespaces", "secrets", "configmaps", "endpoints", "services", "events", "serviceaccounts"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: [""],
    resources: ["endpoints/restricted"],
    verbs: ["create"]
  }, {
    apiGroups: [""],
    resources: ["namespaces/finalizers"],
    verbs: ["update"]
  }, {
    apiGroups: ["apps"],
    resources: ["deployments", "deployments/finalizers"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["admissionregistration.k8s.io"],
    resources: ["mutatingwebhookconfigurations", "validatingwebhookconfigurations"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["apiextensions.k8s.io"],
    resources: ["customresourcedefinitions", "customresourcedefinitions/status"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["autoscaling"],
    resources: ["horizontalpodautoscalers"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resources: ["leases"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["serving.knative.dev", "autoscaling.internal.knative.dev", "networking.internal.knative.dev"],
    resources: ["*", "*/status", "*/finalizers"],
    verbs: ["get", "list", "create", "update", "delete", "deletecollection", "patch", "watch"]
  }, {
    apiGroups: ["caching.internal.knative.dev"],
    resources: ["images"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "clusterissuers", "certificaterequests", "issuers"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["rbac.authorization.k8s.io"],
    resourceNames: ["knative-serving-certmanager"],
    resources: ["clusterroles"],
    verbs: ["delete"]
  }]
};
export const ClusterRole_KnativeServingPodspecableBinding: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "duck.knative.dev/podspecable": "true"
    },
    name: "knative-serving-podspecable-binding"
  },
  rules: [{
    apiGroups: ["serving.knative.dev"],
    resources: ["configurations", "services"],
    verbs: ["list", "watch", "patch"]
  }]
};
export const ServiceAccount_Controller: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "controller",
    namespace: "knative-serving"
  }
};
export const ClusterRole_KnativeServingAdmin: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving-admin"
  },
  aggregationRule: {
    clusterRoleSelectors: [{
      matchLabels: {
        "serving.knative.dev/controller": "true"
      }
    }]
  }
};
export const ClusterRoleBinding_KnativeServingControllerAdmin: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving-controller-admin"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "knative-serving-admin"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "controller",
    namespace: "knative-serving"
  }]
};
export const ClusterRoleBinding_KnativeServingControllerAddressableResolver: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving-controller-addressable-resolver"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "knative-serving-aggregated-addressable-resolver"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "controller",
    namespace: "knative-serving"
  }]
};
export const ServiceAccount_Activator: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "activator",
    namespace: "knative-serving"
  }
};
export const RoleBinding_KnativeServingActivator: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving-activator",
    namespace: "knative-serving"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "knative-serving-activator"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "activator",
    namespace: "knative-serving"
  }]
};
export const ClusterRoleBinding_KnativeServingActivatorCluster: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "knative-serving-activator-cluster"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "knative-serving-activator-cluster"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "activator",
    namespace: "knative-serving"
  }]
};
export const Certificate_RoutingServingCerts: NetworkingInternalKnativeDevV1alpha1Certificate = {
  apiVersion: "networking.internal.knative.dev/v1alpha1",
  kind: "Certificate",
  metadata: {
    annotations: {
      "networking.knative.dev/certificate.class": "cert-manager.certificate.networking.knative.dev"
    },
    labels: {
      "networking.knative.dev/certificate-type": "system-internal"
    },
    name: "routing-serving-certs",
    namespace: "knative-serving"
  },
  spec: {
    dnsNames: ["kn-routing", "data-plane.knative.dev"],
    secretName: "routing-serving-certs"
  }
};
export const Image_QueueProxy: CachingInternalKnativeDevV1alpha1Image = {
  apiVersion: "caching.internal.knative.dev/v1alpha1",
  kind: "Image",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "queue-proxy",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "queue-proxy",
    namespace: "knative-serving"
  },
  spec: {
    image: "gcr.io/knative-releases/knative.dev/serving/cmd/queue@sha256:d313c823f25a09326a7c3c2ec9833c5e005791bc3acb4036ebf33735cbb62bee"
  }
};
export const ConfigMap_ConfigAutoscaler: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "47c2487f"
    },
    labels: {
      "app.kubernetes.io/component": "autoscaler",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-autoscaler",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# The Revision ContainerConcurrency field specifies the maximum number\n# of requests the Container can handle at once. Container concurrency\n# target percentage is how much of that maximum to use in a stable\n# state. E.g. if a Revision specifies ContainerConcurrency of 10, then\n# the Autoscaler will try to maintain 7 concurrent connections per pod\n# on average.\n# Note: this limit will be applied to container concurrency set at every\n# level (ConfigMap, Revision Spec or Annotation).\n# For legacy and backwards compatibility reasons, this value also accepts\n# fractional values in (0, 1] interval (i.e. 0.7 ⇒ 70%).\n# Thus minimal percentage value must be greater than 1.0, or it will be\n# treated as a fraction.\n# NOTE: that this value does not affect actual number of concurrent requests\n#       the user container may receive, but only the average number of requests\n#       that the revision pods will receive.\ncontainer-concurrency-target-percentage: \"70\"\n\n# The container concurrency target default is what the Autoscaler will\n# try to maintain when concurrency is used as the scaling metric for the\n# Revision and the Revision specifies unlimited concurrency.\n# When revision explicitly specifies container concurrency, that value\n# will be used as a scaling target for autoscaler.\n# When specifying unlimited concurrency, the autoscaler will\n# horizontally scale the application based on this target concurrency.\n# This is what we call \"soft limit\" in the documentation, i.e. it only\n# affects number of pods and does not affect the number of requests\n# individual pod processes.\n# The value must be a positive number such that the value multiplied\n# by container-concurrency-target-percentage is greater than 0.01.\n# NOTE: that this value will be adjusted by application of\n#       container-concurrency-target-percentage, i.e. by default\n#       the system will target on average 70 concurrent requests\n#       per revision pod.\n# NOTE: Only one metric can be used for autoscaling a Revision.\ncontainer-concurrency-target-default: \"100\"\n\n# The requests per second (RPS) target default is what the Autoscaler will\n# try to maintain when RPS is used as the scaling metric for a Revision and\n# the Revision specifies unlimited RPS. Even when specifying unlimited RPS,\n# the autoscaler will horizontally scale the application based on this\n# target RPS.\n# Must be greater than 1.0.\n# NOTE: Only one metric can be used for autoscaling a Revision.\nrequests-per-second-target-default: \"200\"\n\n# The target burst capacity specifies the size of burst in concurrent\n# requests that the system operator expects the system will receive.\n# Autoscaler will try to protect the system from queueing by introducing\n# Activator in the request path if the current spare capacity of the\n# service is less than this setting.\n# If this setting is 0, then Activator will be in the request path only\n# when the revision is scaled to 0.\n# If this setting is > 0 and container-concurrency-target-percentage is\n# 100% or 1.0, then activator will always be in the request path.\n# -1 denotes unlimited target-burst-capacity and activator will always\n# be in the request path.\n# Other negative values are invalid.\ntarget-burst-capacity: \"211\"\n\n# When operating in a stable mode, the autoscaler operates on the\n# average concurrency over the stable window.\n# Stable window must be in whole seconds.\nstable-window: \"60s\"\n\n# When observed average concurrency during the panic window reaches\n# panic-threshold-percentage the target concurrency, the autoscaler\n# enters panic mode. When operating in panic mode, the autoscaler\n# scales on the average concurrency over the panic window which is\n# panic-window-percentage of the stable-window.\n# Must be in the [1, 100] range.\n# When computing the panic window it will be rounded to the closest\n# whole second, at least 1s.\npanic-window-percentage: \"10.0\"\n\n# The percentage of the container concurrency target at which to\n# enter panic mode when reached within the panic window.\npanic-threshold-percentage: \"200.0\"\n\n# Max scale up rate limits the rate at which the autoscaler will\n# increase pod count. It is the maximum ratio of desired pods versus\n# observed pods.\n# Cannot be less or equal to 1.\n# I.e with value of 2.0 the number of pods can at most go N to 2N\n# over single Autoscaler period (2s), but at least N to\n# N+1, if Autoscaler needs to scale up.\nmax-scale-up-rate: \"1000.0\"\n\n# Max scale down rate limits the rate at which the autoscaler will\n# decrease pod count. It is the maximum ratio of observed pods versus\n# desired pods.\n# Cannot be less or equal to 1.\n# I.e. with value of 2.0 the number of pods can at most go N to N/2\n# over single Autoscaler evaluation period (2s), but at\n# least N to N-1, if Autoscaler needs to scale down.\nmax-scale-down-rate: \"2.0\"\n\n# Scale to zero feature flag.\nenable-scale-to-zero: \"true\"\n\n# Scale to zero grace period is the time an inactive revision is left\n# running before it is scaled to zero (must be positive, but recommended\n# at least a few seconds if running with mesh networking).\n# This is the upper limit and is provided not to enforce timeout after\n# the revision stopped receiving requests for stable window, but to\n# ensure network reprogramming to put activator in the path has completed.\n# If the system determines that a shorter period is satisfactory,\n# then the system will only wait that amount of time before scaling to 0.\n# NOTE: this period might actually be 0, if activator has been\n# in the request path sufficiently long.\n# If there is necessity for the last pod to linger longer use\n# scale-to-zero-pod-retention-period flag.\nscale-to-zero-grace-period: \"30s\"\n\n# Scale to zero pod retention period defines the minimum amount\n# of time the last pod will remain after Autoscaler has decided to\n# scale to zero.\n# This flag is for the situations where the pod startup is very expensive\n# and the traffic is bursty (requiring smaller windows for fast action),\n# but patchy.\n# The larger of this flag and `scale-to-zero-grace-period` will effectively\n# determine how the last pod will hang around.\nscale-to-zero-pod-retention-period: \"0s\"\n\n# pod-autoscaler-class specifies the default pod autoscaler class\n# that should be used if none is specified. If omitted,\n# the Knative Pod Autoscaler (KPA) is used by default.\npod-autoscaler-class: \"kpa.autoscaling.knative.dev\"\n\n# The capacity of a single activator task.\n# The `unit` is one concurrent request proxied by the activator.\n# activator-capacity must be at least 1.\n# This value is used for computation of the Activator subset size.\n# See the algorithm here: http://bit.ly/38XiCZ3.\n# TODO(vagababov): tune after actual benchmarking.\nactivator-capacity: \"100.0\"\n\n# initial-scale is the cluster-wide default value for the initial target\n# scale of a revision after creation, unless overridden by the\n# \"autoscaling.knative.dev/initialScale\" annotation.\n# This value must be greater than 0 unless allow-zero-initial-scale is true.\ninitial-scale: \"1\"\n\n# allow-zero-initial-scale controls whether either the cluster-wide initial-scale flag,\n# or the \"autoscaling.knative.dev/initialScale\" annotation, can be set to 0.\nallow-zero-initial-scale: \"false\"\n\n# min-scale is the cluster-wide default value for the min scale of a revision,\n# unless overridden by the \"autoscaling.knative.dev/minScale\" annotation.\nmin-scale: \"0\"\n\n# max-scale is the cluster-wide default value for the max scale of a revision,\n# unless overridden by the \"autoscaling.knative.dev/maxScale\" annotation.\n# If set to 0, the revision has no maximum scale.\nmax-scale: \"0\"\n\n# scale-down-delay is the amount of time that must pass at reduced\n# concurrency before a scale down decision is applied. This can be useful,\n# for example, to maintain replica count and avoid a cold start penalty if\n# more requests come in within the scale down delay period.\n# The default, 0s, imposes no delay at all.\nscale-down-delay: \"0s\"\n\n# max-scale-limit sets the maximum permitted value for the max scale of a revision.\n# When this is set to a positive value, a revision with a maxScale above that value\n# (including a maxScale of \"0\" = unlimited) is disallowed.\n# A value of zero (the default) allows any limit, including unlimited.\nmax-scale-limit: \"0\"\n"
  }
};
export const ConfigMap_ConfigCertmanager: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "b7a9a602"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/certificate-provider": "cert-manager"
    },
    name: "config-certmanager",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this block and unindented to actually change the configuration.\n\n# issuerRef is a reference to the issuer for external-domain certificates used for ingress.\n# IssuerRef should be either `ClusterIssuer` or `Issuer`.\n# Please refer `IssuerRef` in https://cert-manager.io/docs/concepts/issuer/\n# for more details about IssuerRef configuration.\n# If the issuerRef is not specified, the self-signed `knative-selfsigned-issuer` ClusterIssuer is used.\nissuerRef: |\n  kind: ClusterIssuer\n  name: letsencrypt-issuer\n\n# clusterLocalIssuerRef is a reference to the issuer for cluster-local-domain certificates used for ingress.\n# clusterLocalIssuerRef should be either `ClusterIssuer` or `Issuer`.\n# Please refer `IssuerRef` in https://cert-manager.io/docs/concepts/issuer/\n# for more details about ClusterInternalIssuerRef configuration.\n# If the clusterLocalIssuerRef is not specified, the self-signed `knative-selfsigned-issuer` ClusterIssuer is used.\nclusterLocalIssuerRef: |\n  kind: ClusterIssuer\n  name: your-company-issuer\n\n# systemInternalIssuerRef is a reference to the issuer for certificates for system-internal-tls certificates used by Knative internal components.\n# systemInternalIssuerRef should be either `ClusterIssuer` or `Issuer`.\n# Please refer `IssuerRef` in https://cert-manager.io/docs/concepts/issuer/\n# for more details about ClusterInternalIssuerRef configuration.\n# If the systemInternalIssuerRef is not specified, the self-signed `knative-selfsigned-issuer` ClusterIssuer is used.\nsystemInternalIssuerRef: |\n  kind: ClusterIssuer\n  name: knative-selfsigned-issuer\n"
  }
};
export const ConfigMap_ConfigDefaults: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "5b64ff5c"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-defaults",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# revision-timeout-seconds contains the default number of\n# seconds to use for the revision's per-request timeout, if\n# none is specified.\nrevision-timeout-seconds: \"300\"  # 5 minutes\n\n# max-revision-timeout-seconds contains the maximum number of\n# seconds that can be used for revision-timeout-seconds.\n# This value must be greater than or equal to revision-timeout-seconds.\n# If omitted, the system default is used (600 seconds).\n#\n# If this value is increased, the activator's terminationGracePeriodSeconds\n# should also be increased to prevent in-flight requests being disrupted.\nmax-revision-timeout-seconds: \"600\"  # 10 minutes\n\n# revision-response-start-timeout-seconds contains the default number of\n# seconds a request will be allowed to stay open while waiting to\n# receive any bytes from the user's application, if none is specified.\n#\n# This defaults to 'revision-timeout-seconds'\nrevision-response-start-timeout-seconds: \"300\"\n\n# revision-idle-timeout-seconds contains the default number of\n# seconds a request will be allowed to stay open while not receiving any\n# bytes from the user's application, if none is specified.\nrevision-idle-timeout-seconds: \"0\"  # infinite\n\n# revision-cpu-request contains the cpu allocation to assign\n# to revisions by default.  If omitted, no value is specified\n# and the system default is used.\n# Below is an example of setting revision-cpu-request.\n# By default, it is not set by Knative.\nrevision-cpu-request: \"400m\"  # 0.4 of a CPU (aka 400 milli-CPU)\n\n# revision-memory-request contains the memory allocation to assign\n# to revisions by default.  If omitted, no value is specified\n# and the system default is used.\n# Below is an example of setting revision-memory-request.\n# By default, it is not set by Knative.\nrevision-memory-request: \"100M\"  # 100 megabytes of memory\n\n# revision-ephemeral-storage-request contains the ephemeral storage\n# allocation to assign to revisions by default.  If omitted, no value is\n# specified and the system default is used.\nrevision-ephemeral-storage-request: \"500M\"  # 500 megabytes of storage\n\n# revision-cpu-limit contains the cpu allocation to limit\n# revisions to by default.  If omitted, no value is specified\n# and the system default is used.\n# Below is an example of setting revision-cpu-limit.\n# By default, it is not set by Knative.\nrevision-cpu-limit: \"1000m\"  # 1 CPU (aka 1000 milli-CPU)\n\n# revision-memory-limit contains the memory allocation to limit\n# revisions to by default.  If omitted, no value is specified\n# and the system default is used.\n# Below is an example of setting revision-memory-limit.\n# By default, it is not set by Knative.\nrevision-memory-limit: \"200M\"  # 200 megabytes of memory\n\n# revision-ephemeral-storage-limit contains the ephemeral storage\n# allocation to limit revisions to by default.  If omitted, no value is\n# specified and the system default is used.\nrevision-ephemeral-storage-limit: \"750M\"  # 750 megabytes of storage\n\n# container-name-template contains a template for the default\n# container name, if none is specified.  This field supports\n# Go templating and is supplied with the ObjectMeta of the\n# enclosing Service or Configuration, so values such as\n# {{.Name}} are also valid.\ncontainer-name-template: \"user-container\"\n\n# init-container-name-template contains a template for the default\n# init container name, if none is specified.  This field supports\n# Go templating and is supplied with the ObjectMeta of the\n# enclosing Service or Configuration, so values such as\n# {{.Name}} are also valid.\ninit-container-name-template: \"init-container\"\n\n# container-concurrency specifies the maximum number\n# of requests the Container can handle at once, and requests\n# above this threshold are queued.  Setting a value of zero\n# disables this throttling and lets through as many requests as\n# the pod receives.\ncontainer-concurrency: \"0\"\n\n# The container concurrency max limit is an operator setting ensuring that\n# the individual revisions cannot have arbitrary large concurrency\n# values, or autoscaling targets. `container-concurrency` default setting\n# must be at or below this value.\n#\n# Must be greater than 1.\n#\n# Note: even with this set, a user can choose a containerConcurrency\n# of 0 (i.e. unbounded) unless allow-container-concurrency-zero is\n# set to \"false\".\ncontainer-concurrency-max-limit: \"1000\"\n\n# allow-container-concurrency-zero controls whether users can\n# specify 0 (i.e. unbounded) for containerConcurrency.\nallow-container-concurrency-zero: \"true\"\n\n# enable-service-links specifies the default value used for the\n# enableServiceLinks field of the PodSpec, when it is omitted by the user.\n# See: https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/#accessing-the-service\n#\n# This is a tri-state flag with possible values of (true|false|default).\n#\n# In environments with large number of services it is suggested\n# to set this value to `false`.\n# See https://github.com/knative/serving/issues/8498.\nenable-service-links: \"false\"\n"
  }
};
export const ConfigMap_ConfigDeployment: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "720ddb97"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-deployment",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# List of repositories for which tag to digest resolving should be skipped\nregistries-skipping-tag-resolving: \"kind.local,ko.local,dev.local\"\n\n# Maximum time allowed for an image's digests to be resolved.\ndigest-resolution-timeout: \"10s\"\n\n# Duration we wait for the deployment to be ready before considering it failed.\nprogress-deadline: \"600s\"\n\n# Sets the queue proxy's CPU request.\n# If omitted, a default value (currently \"25m\"), is used.\nqueue-sidecar-cpu-request: \"25m\"\n\n# Sets the queue proxy's CPU limit.\n# If omitted, a default value (currently \"1000m\"), is used when\n# `queueproxy.resource-defaults` is set to `Enabled`.\nqueue-sidecar-cpu-limit: \"1000m\"\n\n# Sets the queue proxy's memory request.\n# If omitted, a default value (currently \"400Mi\"), is used when\n# `queueproxy.resource-defaults` is set to `Enabled`.\nqueue-sidecar-memory-request: \"400Mi\"\n\n# Sets the queue proxy's memory limit.\n# If omitted, a default value (currently \"800Mi\"), is used when\n# `queueproxy.resource-defaults` is set to `Enabled`.\nqueue-sidecar-memory-limit: \"800Mi\"\n\n# Sets the queue proxy's ephemeral storage request.\n# If omitted, no value is specified and the system default is used.\nqueue-sidecar-ephemeral-storage-request: \"512Mi\"\n\n# Sets the queue proxy's ephemeral storage limit.\n# If omitted, no value is specified and the system default is used.\nqueue-sidecar-ephemeral-storage-limit: \"1024Mi\"\n\n# Sets tokens associated with specific audiences for queue proxy - used by QPOptions\n#\n# For example, to add the `service-x` audience:\n#    queue-sidecar-token-audiences: \"service-x\"\n# Also supports a list of audiences, for example:\n#    queue-sidecar-token-audiences: \"service-x,service-y\"\n# If omitted, or empty, no tokens are created\nqueue-sidecar-token-audiences: \"\"\n\n# Sets rootCA for the queue proxy - used by QPOptions\n# If omitted, or empty, no rootCA is added to the golang rootCAs\nqueue-sidecar-rootca: \"\"\n\n# If set, it automatically configures pod anti-affinity requirements for all Knative services.\n# It employs the `preferredDuringSchedulingIgnoredDuringExecution` weighted pod affinity term,\n# aligning with the Knative revision label. It yields the configuration below in all workloads' deployments:\n# `\n#   affinity:\n#     podAntiAffinity:\n#       preferredDuringSchedulingIgnoredDuringExecution:\n#       - podAffinityTerm:\n#           topologyKey: kubernetes.io/hostname\n#           labelSelector:\n#             matchLabels:\n#               serving.knative.dev/revision: {{revision-name}}\n#         weight: 100\n# `\n# This may be \"none\" or \"prefer-spread-revision-over-nodes\" (default)\n# default-affinity-type: \"prefer-spread-revision-over-nodes\"\n\n# runtime-class-name contains the selector for which runtimeClassName\n# is selected to put in a revision.\n# By default, it is not set by Knative.\n#\n# Example:\n# runtime-class-name: |\n#   \"\":\n#     selector:\n#       use-default-runc: \"yes\"\n#   kata: {}\n#   gvisor:\n#     selector:\n#       use-gvisor: \"please\"\nruntime-class-name: \"\"",
    "queue-sidecar-image": "gcr.io/knative-releases/knative.dev/serving/cmd/queue@sha256:d313c823f25a09326a7c3c2ec9833c5e005791bc3acb4036ebf33735cbb62bee"
  }
};
export const ConfigMap_ConfigDomain: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "26c09de5"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-domain",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# Default value for domain.\n# Routes having the cluster domain suffix (by default 'svc.cluster.local')\n# will not be exposed through Ingress. You can define your own label\n# selector to assign that domain suffix to your Route here, or you can set\n# the label\n#    \"networking.knative.dev/visibility=cluster-local\"\n# to achieve the same effect.  This shows how to make routes having\n# the label app=secret only exposed to the local cluster.\nsvc.cluster.local: |\n  selector:\n    app: secret\n\n# These are example settings of domain.\n# example.com will be used for all routes, but it is the least-specific rule so it\n# will only be used if no other domain matches.\nexample.com: |\n\n# example.org will be used for routes having app=nonprofit.\nexample.org: |\n  selector:\n    app: nonprofit\n"
  }
};
export const ConfigMap_ConfigFeatures: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "632d47dd"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-features",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# Default SecurityContext settings to secure-by-default values\n# if unset.\n#\n# This value will default to \"enabled\" in a future release,\n# probably Knative 1.10\nsecure-pod-defaults: \"disabled\"\n\n# Indicates whether multi container support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/configuration/feature-flags/#multiple-containers\nmulti-container: \"enabled\"\n\n# Indicates whether multi container probing is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/configuration/feature-flags/#multiple-container-probing\nmulti-container-probing: \"disabled\"\n\n# Indicates whether Kubernetes affinity support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-node-affinity\nkubernetes.podspec-affinity: \"disabled\"\n\n# Indicates whether Kubernetes topologySpreadConstraints support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-topology-spread-constraints\nkubernetes.podspec-topologyspreadconstraints: \"disabled\"\n\n# Indicates whether Kubernetes hostAliases support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-host-aliases\nkubernetes.podspec-hostaliases: \"disabled\"\n\n# Indicates whether Kubernetes nodeSelector support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-node-selector\nkubernetes.podspec-nodeselector: \"disabled\"\n\n# Indicates whether Kubernetes tolerations support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-toleration\nkubernetes.podspec-tolerations: \"disabled\"\n\n# Indicates whether Kubernetes FieldRef support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-fieldref\nkubernetes.podspec-fieldref: \"disabled\"\n\n# Indicates whether Kubernetes RuntimeClassName support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-runtime-class\nkubernetes.podspec-runtimeclassname: \"disabled\"\n\n# Indicates whether Kubernetes DNSPolicy support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-dnspolicy\nkubernetes.podspec-dnspolicy: \"disabled\"\n\n# Indicates whether Kubernetes DNSConfig support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-dnsconfig\nkubernetes.podspec-dnsconfig: \"disabled\"\n\n# This feature allows end-users to set a subset of fields on the Pod's SecurityContext\n#\n# When set to \"enabled\" or \"allowed\" it allows the following\n# PodSecurityContext properties:\n# - FSGroup\n# - RunAsGroup\n# - RunAsNonRoot\n# - SupplementalGroups\n# - RunAsUser\n# - SeccompProfile\n#\n# This feature flag should be used with caution as the PodSecurityContext\n# properties may have a side-effect on non-user sidecar containers that come\n# from Knative or your service mesh\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-security-context\nkubernetes.podspec-securitycontext: \"disabled\"\n\n# Indicated whether sharing the process namespace via ShareProcessNamespace pod spec is allowed.\n# This can be especially useful for sharing data from images directly between sidecars\n#\n# See: https://knative.dev/docs/serving/configuration/feature-flags/#kubernetes-share-process-namespace\nkubernetes.podspec-shareprocessnamespace: \"disabled\"\n\n# Indicates whether Kubernetes PriorityClassName support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-priority-class-name\nkubernetes.podspec-priorityclassname: \"disabled\"\n\n# Indicates whether Kubernetes SchedulerName support is enabled\n#\n# WARNING: Cannot safely be disabled once enabled.\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-scheduler-name\nkubernetes.podspec-schedulername: \"disabled\"\n\n# This feature flag allows end-users to add a subset of capabilities on the Pod's SecurityContext.\n#\n# When set to \"enabled\" or \"allowed\" it allows capabilities to be added to the container.\n# For a list of possible capabilities, see https://man7.org/linux/man-pages/man7/capabilities.7.html\nkubernetes.containerspec-addcapabilities: \"disabled\"\n\n# This feature validates PodSpecs from the validating webhook\n# against the K8s API Server.\n#\n# When \"enabled\", the server will always run the extra validation.\n# When \"allowed\", the server will not run the dry-run validation by default.\n#   However, clients may enable the behavior on an individual Service by\n#   attaching the following metadata annotation: \"features.knative.dev/podspec-dryrun\":\"enabled\".\n# See: https://knative.dev/docs/serving/feature-flags/#kubernetes-dry-run\nkubernetes.podspec-dryrun: \"allowed\"\n\n# Controls whether tag header based routing feature are enabled or not.\n# 1. Enabled: enabling tag header based routing\n# 2. Disabled: disabling tag header based routing\n# See: https://knative.dev/docs/serving/feature-flags/#tag-header-based-routing\ntag-header-based-routing: \"disabled\"\n\n# Controls whether http2 auto-detection should be enabled or not.\n# 1. Enabled: http2 connection will be attempted via upgrade.\n# 2. Disabled: http2 connection will only be attempted when port name is set to \"h2c\".\nautodetect-http2: \"disabled\"\n\n# Controls whether volume support for EmptyDir is enabled or not.\n# 1. Enabled: enabling EmptyDir volume support\n# 2. Disabled: disabling EmptyDir volume support\nkubernetes.podspec-volumes-emptydir: \"enabled\"\n\n# Controls whether init containers support is enabled or not.\n# 1. Enabled: enabling init containers support\n# 2. Disabled: disabling init containers support\nkubernetes.podspec-init-containers: \"disabled\"\n\n# Controls whether persistent volume claim support is enabled or not.\n# 1. Enabled: enabling persistent volume claim support\n# 2. Disabled: disabling persistent volume claim support\nkubernetes.podspec-persistent-volume-claim: \"disabled\"\n\n# Controls whether write access for persistent volumes is enabled or not.\n# 1. Enabled: enabling write access for persistent volumes\n# 2. Disabled: disabling write access for persistent volumes\nkubernetes.podspec-persistent-volume-write: \"disabled\"\n\n# Controls if the queue proxy podInfo feature is enabled, allowed or disabled\n#\n# This feature should be enabled/allowed when using queue proxy Options (Extensions)\n# Enabling will mount a podInfo volume to the queue proxy container.\n# The volume will contains an 'annotations' file (from the pod's annotation field).\n# The annotations in this file include the Service annotations set by the client creating the service.\n# If mounted, the annotations can be accessed by queue proxy extensions at /etc/podinfo/annnotations\n#\n# 1. \"enabled\": always mount a podInfo volume\n# 2. \"disabled\": never mount a podInfo volume\n# 3. \"allowed\": by default, do not mount a podInfo volume\n#   However, a client may mount the podInfo volume on an individual Service by attaching\n#   the following metadata annotation to the Service: \"features.knative.dev/queueproxy-podinfo\":\"enabled\".\n#\n# NOTE THAT THIS IS AN EXPERIMENTAL / ALPHA FEATURE\nqueueproxy.mount-podinfo: \"disabled\"\n\n# Default queue proxy resource requests and limits to good values for most cases if set.\nqueueproxy.resource-defaults: \"disabled\""
  }
};
export const ConfigMap_ConfigGc: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "aa3813a8"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-gc",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# ---------------------------------------\n# Garbage Collector Settings\n# ---------------------------------------\n#\n# Active\n#   * Revisions which are referenced by a Route are considered active.\n#   * Individual revisions may be marked with the annotation\n#      \"serving.knative.dev/no-gc\":\"true\" to be permanently considered active.\n#   * Active revisions are not considered for GC.\n# Retention\n#   * Revisions are retained if they are any of the following:\n#       1. Active\n#       2. Were created within \"retain-since-create-time\"\n#       3. Were last referenced by a route within\n#           \"retain-since-last-active-time\"\n#       4. There are fewer than \"min-non-active-revisions\"\n#     If none of these conditions are met, or if the count of revisions exceed\n#      \"max-non-active-revisions\", they will be deleted by GC.\n#     The special value \"disabled\" may be used to turn off these limits.\n#\n# Example config to immediately collect any inactive revision:\n#    min-non-active-revisions: \"0\"\n#    max-non-active-revisions: \"0\"\n#    retain-since-create-time: \"disabled\"\n#    retain-since-last-active-time: \"disabled\"\n#\n# Example config to always keep around the last ten non-active revisions:\n#     retain-since-create-time: \"disabled\"\n#     retain-since-last-active-time: \"disabled\"\n#     max-non-active-revisions: \"10\"\n#\n# Example config to disable all garbage collection:\n#     retain-since-create-time: \"disabled\"\n#     retain-since-last-active-time: \"disabled\"\n#     max-non-active-revisions: \"disabled\"\n#\n# Example config to keep recently deployed or active revisions,\n# always maintain the last two in case of rollback, and prevent\n# burst activity from exploding the count of old revisions:\n#      retain-since-create-time: \"48h\"\n#      retain-since-last-active-time: \"15h\"\n#      min-non-active-revisions: \"2\"\n#      max-non-active-revisions: \"1000\"\n\n# Duration since creation before considering a revision for GC or \"disabled\".\nretain-since-create-time: \"48h\"\n\n# Duration since active before considering a revision for GC or \"disabled\".\nretain-since-last-active-time: \"15h\"\n\n# Minimum number of non-active revisions to retain.\nmin-non-active-revisions: \"20\"\n\n# Maximum number of non-active revisions to retain\n# or \"disabled\" to disable any maximum limit.\nmax-non-active-revisions: \"1000\"\n"
  }
};
export const ConfigMap_ConfigLeaderElection: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "f4b71f57"
    },
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-leader-election",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# lease-duration is how long non-leaders will wait to try to acquire the\n# lock; 15 seconds is the value used by core kubernetes controllers.\nlease-duration: \"60s\"\n\n# renew-deadline is how long a leader will try to renew the lease before\n# giving up; 10 seconds is the value used by core kubernetes controllers.\nrenew-deadline: \"40s\"\n\n# retry-period is how long the leader election client waits between tries of\n# actions; 2 seconds is the value used by core kubernetes controllers.\nretry-period: \"10s\"\n\n# buckets is the number of buckets used to partition key space of each\n# Reconciler. If this number is M and the replica number of the controller\n# is N, the N replicas will compete for the M buckets. The owner of a\n# bucket will take care of the reconciling for the keys partitioned into\n# that bucket.\nbuckets: \"1\"\n"
  }
};
export const ConfigMap_ConfigLogging: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "9f25d429"
    },
    labels: {
      "app.kubernetes.io/component": "logging",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-logging",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# Common configuration for all Knative codebase\nzap-logger-config: |\n  {\n    \"level\": \"info\",\n    \"development\": false,\n    \"outputPaths\": [\"stdout\"],\n    \"errorOutputPaths\": [\"stderr\"],\n    \"encoding\": \"json\",\n    \"encoderConfig\": {\n      \"timeKey\": \"timestamp\",\n      \"levelKey\": \"severity\",\n      \"nameKey\": \"logger\",\n      \"callerKey\": \"caller\",\n      \"messageKey\": \"message\",\n      \"stacktraceKey\": \"stacktrace\",\n      \"lineEnding\": \"\",\n      \"levelEncoder\": \"\",\n      \"timeEncoder\": \"iso8601\",\n      \"durationEncoder\": \"\",\n      \"callerEncoder\": \"\"\n    }\n  }\n\n# Log level overrides\n# For all components except the queue proxy,\n# changes are picked up immediately.\n# For queue proxy, changes require recreation of the pods.\nloglevel.controller: \"info\"\nloglevel.autoscaler: \"info\"\nloglevel.queueproxy: \"info\"\nloglevel.webhook: \"info\"\nloglevel.activator: \"info\"\nloglevel.hpaautoscaler: \"info\"\nloglevel.net-istio-controller: \"info\"\nloglevel.net-contour-controller: \"info\"\nloglevel.net-kourier-controller: \"info\"\nloglevel.net-gateway-api-controller: \"info\"\n"
  }
};
export const ConfigMap_ConfigNetwork: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "0573e07d"
    },
    labels: {
      "app.kubernetes.io/component": "networking",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-network",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# ingress-class specifies the default ingress class\n# to use when not dictated by Route annotation.\n#\n# If not specified, will use the Istio ingress.\n#\n# Note that changing the Ingress class of an existing Route\n# will result in undefined behavior.  Therefore it is best to only\n# update this value during the setup of Knative, to avoid getting\n# undefined behavior.\ningress-class: \"istio.ingress.networking.knative.dev\"\n\n# certificate-class specifies the default Certificate class\n# to use when not dictated by Route annotation.\n#\n# If not specified, will use the Cert-Manager Certificate.\n#\n# Note that changing the Certificate class of an existing Route\n# will result in undefined behavior.  Therefore it is best to only\n# update this value during the setup of Knative, to avoid getting\n# undefined behavior.\ncertificate-class: \"cert-manager.certificate.networking.knative.dev\"\n\n# namespace-wildcard-cert-selector specifies a LabelSelector which\n# determines which namespaces should have a wildcard certificate\n# provisioned.\n#\n# Use an empty value to disable the feature (this is the default):\n#   namespace-wildcard-cert-selector: \"\"\n#\n# Use an empty object to enable for all namespaces\n#   namespace-wildcard-cert-selector: {}\n#\n# Useful labels include the \"kubernetes.io/metadata.name\" label to\n# avoid provisioning a certificate for the \"kube-system\" namespaces.\n# Use the following selector to match pre-1.0 behavior of using\n# \"networking.knative.dev/disableWildcardCert\" to exclude namespaces:\n#\n# matchExpressions:\n# - key: \"networking.knative.dev/disableWildcardCert\"\n#   operator: \"NotIn\"\n#   values: [\"true\"]\nnamespace-wildcard-cert-selector: \"\"\n\n# domain-template specifies the golang text template string to use\n# when constructing the Knative service's DNS name. The default\n# value is \"{{.Name}}.{{.Namespace}}.{{.Domain}}\".\n#\n# Valid variables defined in the template include Name, Namespace, Domain,\n# Labels, and Annotations. Name will be the result of the tag-template\n# below, if a tag is specified for the route.\n#\n# Changing this value might be necessary when the extra levels in\n# the domain name generated is problematic for wildcard certificates\n# that only support a single level of domain name added to the\n# certificate's domain. In those cases you might consider using a value\n# of \"{{.Name}}-{{.Namespace}}.{{.Domain}}\", or removing the Namespace\n# entirely from the template. When choosing a new value be thoughtful\n# of the potential for conflicts - for example, when users choose to use\n# characters such as `-` in their service, or namespace, names.\n# {{.Annotations}} or {{.Labels}} can be used for any customization in the\n# go template if needed.\n# We strongly recommend keeping namespace part of the template to avoid\n# domain name clashes:\n# eg. '{{.Name}}-{{.Namespace}}.{{ index .Annotations \"sub\"}}.{{.Domain}}'\n# and you have an annotation {\"sub\":\"foo\"}, then the generated template\n# would be {Name}-{Namespace}.foo.{Domain}\ndomain-template: \"{{.Name}}.{{.Namespace}}.{{.Domain}}\"\n\n# tag-template specifies the golang text template string to use\n# when constructing the DNS name for \"tags\" within the traffic blocks\n# of Routes and Configuration.  This is used in conjunction with the\n# domain-template above to determine the full URL for the tag.\ntag-template: \"{{.Tag}}-{{.Name}}\"\n\n# auto-tls is deprecated and replaced by external-domain-tls\nauto-tls: \"Disabled\"\n\n# Controls whether TLS certificates are automatically provisioned and\n# installed in the Knative ingress to terminate TLS connections\n# for cluster external domains (like: app.example.com)\n# - Enabled: enables the TLS certificate provisioning feature for cluster external domains.\n# - Disabled: disables the TLS certificate provisioning feature for cluster external domains.\nexternal-domain-tls: \"Disabled\"\n\n# Controls weather TLS certificates are automatically provisioned and\n# installed in the Knative ingress to terminate TLS connections\n# for cluster local domains (like: app.namespace.svc.<your-cluster-domain>)\n# - Enabled: enables the TLS certificate provisioning feature for cluster cluster-local domains.\n# - Disabled: disables the TLS certificate provisioning feature for cluster cluster local domains.\n# NOTE: This flag is in an alpha state and is mostly here to enable internal testing\n#       for now. Use with caution.\ncluster-local-domain-tls: \"Disabled\"\n\n# internal-encryption is deprecated and replaced by system-internal-tls\ninternal-encryption: \"false\"\n\n# system-internal-tls controls weather TLS encryption is used for connections between\n# the internal components of Knative:\n# - ingress to activator\n# - ingress to queue-proxy\n# - activator to queue-proxy\n#\n# Possible values for this flag are:\n# - Enabled: enables the TLS certificate provisioning feature for cluster cluster-local domains.\n# - Disabled: disables the TLS certificate provisioning feature for cluster cluster local domains.\n# NOTE: This flag is in an alpha state and is mostly here to enable internal testing\n#       for now. Use with caution.\nsystem-internal-tls: \"Disabled\"\n\n# Controls the behavior of the HTTP endpoint for the Knative ingress.\n# It requires auto-tls to be enabled.\n# - Enabled: The Knative ingress will be able to serve HTTP connection.\n# - Redirected: The Knative ingress will send a 301 redirect for all\n# http connections, asking the clients to use HTTPS.\n#\n# \"Disabled\" option is deprecated.\nhttp-protocol: \"Enabled\"\n\n# rollout-duration contains the minimal duration in seconds over which the\n# Configuration traffic targets are rolled out to the newest revision.\nrollout-duration: \"0\"\n\n# autocreate-cluster-domain-claims controls whether ClusterDomainClaims should\n# be automatically created (and deleted) as needed when DomainMappings are\n# reconciled.\n#\n# If this is \"false\" (the default), the cluster administrator is\n# responsible for creating ClusterDomainClaims and delegating them to\n# namespaces via their spec.Namespace field. This setting should be used in\n# multitenant environments which need to control which namespace can use a\n# particular domain name in a domain mapping.\n#\n# If this is \"true\", users are able to associate arbitrary names with their\n# services via the DomainMapping feature.\nautocreate-cluster-domain-claims: \"false\"\n\n# If true, networking plugins can add additional information to deployed\n# applications to make their pods directly accessible via their IPs even if mesh is\n# enabled and thus direct-addressability is usually not possible.\n# Consumers like Knative Serving can use this setting to adjust their behavior\n# accordingly, i.e. to drop fallback solutions for non-pod-addressable systems.\n#\n# NOTE: This flag is in an alpha state and is mostly here to enable internal testing\n#       for now. Use with caution.\nenable-mesh-pod-addressability: \"false\"\n\n# mesh-compatibility-mode indicates whether consumers of network plugins\n# should directly contact Pod IPs (most efficient), or should use the\n# Cluster IP (less efficient, needed when mesh is enabled unless\n# `enable-mesh-pod-addressability`, above, is set).\n# Permitted values are:\n#  - \"auto\" (default): automatically determine which mesh mode to use by trying Pod IP and falling back to Cluster IP as needed.\n#  - \"enabled\": always use Cluster IP and do not attempt to use Pod IPs.\n#  - \"disabled\": always use Pod IPs and do not fall back to Cluster IP on failure.\nmesh-compatibility-mode: \"auto\"\n\n# Defines the scheme used for external URLs if auto-tls is not enabled.\n# This can be used for making Knative report all URLs as \"HTTPS\" for example, if you're\n# fronting Knative with an external loadbalancer that deals with TLS termination and\n# Knative doesn't know about that otherwise.\ndefault-external-scheme: \"http\"\n"
  }
};
export const ConfigMap_ConfigObservability: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "54abd711"
    },
    labels: {
      "app.kubernetes.io/component": "observability",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-observability",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# logging.enable-var-log-collection defaults to false.\n# The fluentd daemon set will be set up to collect /var/log if\n# this flag is true.\nlogging.enable-var-log-collection: \"false\"\n\n# logging.revision-url-template provides a template to use for producing the\n# logging URL that is injected into the status of each Revision.\nlogging.revision-url-template: \"http://logging.example.com/?revisionUID=${REVISION_UID}\"\n\n# If non-empty, this enables queue proxy writing user request logs to stdout, excluding probe\n# requests.\n# NB: after 0.18 release logging.enable-request-log must be explicitly set to true\n# in order for request logging to be enabled.\n#\n# The value determines the shape of the request logs and it must be a valid go text/template.\n# It is important to keep this as a single line. Multiple lines are parsed as separate entities\n# by most collection agents and will split the request logs into multiple records.\n#\n# The following fields and functions are available to the template:\n#\n# Request: An http.Request (see https://golang.org/pkg/net/http/#Request)\n# representing an HTTP request received by the server.\n#\n# Response:\n# struct {\n#   Code    int       // HTTP status code (see https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)\n#   Size    int       // An int representing the size of the response.\n#   Latency float64   // A float64 representing the latency of the response in seconds.\n# }\n#\n# Revision:\n# struct {\n#   Name          string  // Knative revision name\n#   Namespace     string  // Knative revision namespace\n#   Service       string  // Knative service name\n#   Configuration string  // Knative configuration name\n#   PodName       string  // Name of the pod hosting the revision\n#   PodIP         string  // IP of the pod hosting the revision\n# }\n#\nlogging.request-log-template: '{\"httpRequest\": {\"requestMethod\": \"{{.Request.Method}}\", \"requestUrl\": \"{{js .Request.RequestURI}}\", \"requestSize\": \"{{.Request.ContentLength}}\", \"status\": {{.Response.Code}}, \"responseSize\": \"{{.Response.Size}}\", \"userAgent\": \"{{js .Request.UserAgent}}\", \"remoteIp\": \"{{js .Request.RemoteAddr}}\", \"serverIp\": \"{{.Revision.PodIP}}\", \"referer\": \"{{js .Request.Referer}}\", \"latency\": \"{{.Response.Latency}}s\", \"protocol\": \"{{.Request.Proto}}\"}, \"traceId\": \"{{index .Request.Header \"X-B3-Traceid\"}}\"}'\n\n# If true, the request logging will be enabled.\n# NB: up to and including Knative version 0.18 if logging.request-log-template is non-empty, this value\n# will be ignored.\nlogging.enable-request-log: \"false\"\n\n# If true, this enables queue proxy writing request logs for probe requests to stdout.\n# It uses the same template for user requests, i.e. logging.request-log-template.\nlogging.enable-probe-request-log: \"false\"\n\n# metrics.backend-destination field specifies the system metrics destination.\n# It supports either prometheus (the default) or opencensus.\nmetrics.backend-destination: prometheus\n\n# metrics.reporting-period-seconds specifies the global metrics reporting period for control and data plane components.\n# If a zero or negative value is passed the default reporting period is used (10 secs).\n# If the attribute is not specified a default value is used per metrics backend.\n# For the prometheus backend the default reporting period is 5s while for opencensus it is 60s.\nmetrics.reporting-period-seconds: \"5\"\n\n# metrics.request-metrics-backend-destination specifies the request metrics\n# destination. It enables queue proxy to send request metrics.\n# Currently supported values: prometheus (the default), opencensus.\nmetrics.request-metrics-backend-destination: prometheus\n\n# metrics.request-metrics-reporting-period-seconds specifies the request metrics reporting period in sec at queue proxy.\n# If a zero or negative value is passed the default reporting period is used (10 secs).\n# If the attribute is not specified, it is overridden by the value of metrics.reporting-period-seconds.\nmetrics.request-metrics-reporting-period-seconds: \"5\"\n\n# profiling.enable indicates whether it is allowed to retrieve runtime profiling data from\n# the pods via an HTTP server in the format expected by the pprof visualization tool. When\n# enabled, the Knative Serving pods expose the profiling data on an alternate HTTP port 8008.\n# The HTTP context root for profiling is then /debug/pprof/.\nprofiling.enable: \"false\"\n"
  }
};
export const ConfigMap_ConfigTracing: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    annotations: {
      "knative.dev/example-checksum": "26614636"
    },
    labels: {
      "app.kubernetes.io/component": "tracing",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config-tracing",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n#\n# This may be \"zipkin\" or \"none\" (default)\nbackend: \"none\"\n\n# URL to zipkin collector where traces are sent.\n# This must be specified when backend is \"zipkin\"\nzipkin-endpoint: \"http://zipkin.istio-system.svc.cluster.local:9411/api/v2/spans\"\n\n# Enable zipkin debug mode. This allows all spans to be sent to the server\n# bypassing sampling.\ndebug: \"false\"\n\n# Percentage (0-1) of requests to trace\nsample-rate: \"0.1\"\n"
  }
};
export const HorizontalPodAutoscaler_Activator: AutoscalingV2HorizontalPodAutoscaler = {
  apiVersion: "autoscaling/v2",
  kind: "HorizontalPodAutoscaler",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "activator",
    namespace: "knative-serving"
  },
  spec: {
    maxReplicas: 20,
    metrics: [{
      resource: {
        name: "cpu",
        target: {
          averageUtilization: 100,
          type: "Utilization"
        }
      },
      type: "Resource"
    }],
    minReplicas: 1,
    scaleTargetRef: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      name: "activator"
    }
  }
};
export const PodDisruptionBudget_ActivatorPdb: PolicyV1PodDisruptionBudget = {
  apiVersion: "policy/v1",
  kind: "PodDisruptionBudget",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "activator-pdb",
    namespace: "knative-serving"
  },
  spec: {
    minAvailable: "80%",
    selector: {
      matchLabels: {
        app: "activator"
      }
    }
  }
};
export const Deployment_Activator: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "activator",
    namespace: "knative-serving"
  },
  spec: {
    selector: {
      matchLabels: {
        app: "activator",
        role: "activator"
      }
    },
    template: {
      metadata: {
        labels: {
          app: "activator",
          "app.kubernetes.io/component": "activator",
          "app.kubernetes.io/name": "knative-serving",
          "app.kubernetes.io/version": "1.15.0",
          role: "activator"
        }
      },
      spec: {
        affinity: {
          podAntiAffinity: {
            preferredDuringSchedulingIgnoredDuringExecution: [{
              podAffinityTerm: {
                labelSelector: {
                  matchLabels: {
                    app: "activator"
                  }
                },
                topologyKey: "kubernetes.io/hostname"
              },
              weight: 100
            }]
          }
        },
        containers: [{
          env: [{
            name: "GOGC",
            value: "500"
          }, {
            name: "POD_NAME",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.name"
              }
            }
          }, {
            name: "POD_IP",
            valueFrom: {
              fieldRef: {
                fieldPath: "status.podIP"
              }
            }
          }, {
            name: "SYSTEM_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }, {
            name: "CONFIG_LOGGING_NAME",
            value: "config-logging"
          }, {
            name: "CONFIG_OBSERVABILITY_NAME",
            value: "config-observability"
          }, {
            name: "METRICS_DOMAIN",
            value: "knative.dev/internal/serving"
          }],
          image: "gcr.io/knative-releases/knative.dev/serving/cmd/activator@sha256:b6d7d96edd8942d679757249f6aa07373461411104ce7c93309f23fba2884f8f",
          livenessProbe: {
            failureThreshold: 12,
            httpGet: {
              port: 8012
            },
            initialDelaySeconds: 15,
            periodSeconds: 10
          },
          name: "activator",
          ports: [{
            containerPort: 9090,
            name: "metrics"
          }, {
            containerPort: 8008,
            name: "profiling"
          }, {
            containerPort: 8012,
            name: "http1"
          }, {
            containerPort: 8013,
            name: "h2c"
          }],
          readinessProbe: {
            failureThreshold: 5,
            httpGet: {
              port: 8012
            },
            periodSeconds: 5
          },
          resources: {
            limits: {
              cpu: "1000m",
              memory: "600Mi"
            },
            requests: {
              cpu: "300m",
              memory: "60Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        serviceAccountName: "activator",
        terminationGracePeriodSeconds: 600
      }
    }
  }
};
export const Service_ActivatorService: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "activator",
      "app.kubernetes.io/component": "activator",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "activator-service",
    namespace: "knative-serving"
  },
  spec: {
    ports: [{
      name: "http-metrics",
      port: 9090,
      targetPort: 9090
    }, {
      name: "http-profiling",
      port: 8008,
      targetPort: 8008
    }, {
      name: "http",
      port: 80,
      targetPort: 8012
    }, {
      name: "http2",
      port: 81,
      targetPort: 8013
    }, {
      name: "https",
      port: 443,
      targetPort: 8112
    }],
    selector: {
      app: "activator"
    },
    type: "ClusterIP"
  }
};
export const Deployment_Autoscaler: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "autoscaler",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "autoscaler",
    namespace: "knative-serving"
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        app: "autoscaler"
      }
    },
    strategy: {
      rollingUpdate: {
        maxUnavailable: 0
      },
      type: "RollingUpdate"
    },
    template: {
      metadata: {
        labels: {
          app: "autoscaler",
          "app.kubernetes.io/component": "autoscaler",
          "app.kubernetes.io/name": "knative-serving",
          "app.kubernetes.io/version": "1.15.0"
        }
      },
      spec: {
        affinity: {
          podAntiAffinity: {
            preferredDuringSchedulingIgnoredDuringExecution: [{
              podAffinityTerm: {
                labelSelector: {
                  matchLabels: {
                    app: "autoscaler"
                  }
                },
                topologyKey: "kubernetes.io/hostname"
              },
              weight: 100
            }]
          }
        },
        containers: [{
          env: [{
            name: "POD_NAME",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.name"
              }
            }
          }, {
            name: "POD_IP",
            valueFrom: {
              fieldRef: {
                fieldPath: "status.podIP"
              }
            }
          }, {
            name: "SYSTEM_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }, {
            name: "CONFIG_LOGGING_NAME",
            value: "config-logging"
          }, {
            name: "CONFIG_OBSERVABILITY_NAME",
            value: "config-observability"
          }, {
            name: "METRICS_DOMAIN",
            value: "knative.dev/serving"
          }],
          image: "gcr.io/knative-releases/knative.dev/serving/cmd/autoscaler@sha256:119157d871eb3db5a54944464d9920ad378d35292d4c12fd4a765cd016e24f0f",
          livenessProbe: {
            failureThreshold: 6,
            httpGet: {
              port: 8080
            }
          },
          name: "autoscaler",
          ports: [{
            containerPort: 9090,
            name: "metrics"
          }, {
            containerPort: 8008,
            name: "profiling"
          }, {
            containerPort: 8080,
            name: "websocket"
          }],
          readinessProbe: {
            httpGet: {
              port: 8080
            }
          },
          resources: {
            limits: {
              cpu: "1000m",
              memory: "1000Mi"
            },
            requests: {
              cpu: "100m",
              memory: "100Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        serviceAccountName: "controller"
      }
    }
  }
};
export const Service_Autoscaler: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "autoscaler",
      "app.kubernetes.io/component": "autoscaler",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "autoscaler",
    namespace: "knative-serving"
  },
  spec: {
    ports: [{
      name: "http-metrics",
      port: 9090,
      targetPort: 9090
    }, {
      name: "http-profiling",
      port: 8008,
      targetPort: 8008
    }, {
      name: "http",
      port: 8080,
      targetPort: 8080
    }],
    selector: {
      app: "autoscaler"
    }
  }
};
export const Deployment_Controller: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "controller",
    namespace: "knative-serving"
  },
  spec: {
    selector: {
      matchLabels: {
        app: "controller"
      }
    },
    template: {
      metadata: {
        labels: {
          app: "controller",
          "app.kubernetes.io/component": "controller",
          "app.kubernetes.io/name": "knative-serving",
          "app.kubernetes.io/version": "1.15.0"
        }
      },
      spec: {
        affinity: {
          podAntiAffinity: {
            preferredDuringSchedulingIgnoredDuringExecution: [{
              podAffinityTerm: {
                labelSelector: {
                  matchLabels: {
                    app: "controller"
                  }
                },
                topologyKey: "kubernetes.io/hostname"
              },
              weight: 100
            }]
          }
        },
        containers: [{
          env: [{
            name: "POD_NAME",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.name"
              }
            }
          }, {
            name: "SYSTEM_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }, {
            name: "CONFIG_LOGGING_NAME",
            value: "config-logging"
          }, {
            name: "CONFIG_OBSERVABILITY_NAME",
            value: "config-observability"
          }, {
            name: "METRICS_DOMAIN",
            value: "knative.dev/internal/serving"
          }],
          image: "gcr.io/knative-releases/knative.dev/serving/cmd/controller@sha256:80b9865a585900af6cecead24babe03aa79487e9e6306da1444b04148c21c96f",
          livenessProbe: {
            failureThreshold: 6,
            httpGet: {
              path: "/health",
              port: "probes",
              scheme: "HTTP"
            },
            periodSeconds: 5
          },
          name: "controller",
          ports: [{
            containerPort: 9090,
            name: "metrics"
          }, {
            containerPort: 8008,
            name: "profiling"
          }, {
            containerPort: 8080,
            name: "probes"
          }],
          readinessProbe: {
            failureThreshold: 3,
            httpGet: {
              path: "/readiness",
              port: "probes",
              scheme: "HTTP"
            },
            periodSeconds: 5
          },
          resources: {
            limits: {
              cpu: "1000m",
              memory: "1000Mi"
            },
            requests: {
              cpu: "100m",
              memory: "100Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        serviceAccountName: "controller"
      }
    }
  }
};
export const Service_Controller: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "controller",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "controller",
    namespace: "knative-serving"
  },
  spec: {
    ports: [{
      name: "http-metrics",
      port: 9090,
      targetPort: 9090
    }, {
      name: "http-profiling",
      port: 8008,
      targetPort: 8008
    }],
    selector: {
      app: "controller"
    }
  }
};
export const HorizontalPodAutoscaler_Webhook: AutoscalingV2HorizontalPodAutoscaler = {
  apiVersion: "autoscaling/v2",
  kind: "HorizontalPodAutoscaler",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "webhook",
    namespace: "knative-serving"
  },
  spec: {
    maxReplicas: 5,
    metrics: [{
      resource: {
        name: "cpu",
        target: {
          averageUtilization: 100,
          type: "Utilization"
        }
      },
      type: "Resource"
    }],
    minReplicas: 1,
    scaleTargetRef: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      name: "webhook"
    }
  }
};
export const PodDisruptionBudget_WebhookPdb: PolicyV1PodDisruptionBudget = {
  apiVersion: "policy/v1",
  kind: "PodDisruptionBudget",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "webhook-pdb",
    namespace: "knative-serving"
  },
  spec: {
    minAvailable: "80%",
    selector: {
      matchLabels: {
        app: "webhook"
      }
    }
  }
};
export const Deployment_Webhook: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "webhook",
    namespace: "knative-serving"
  },
  spec: {
    selector: {
      matchLabels: {
        app: "webhook",
        role: "webhook"
      }
    },
    template: {
      metadata: {
        labels: {
          app: "webhook",
          "app.kubernetes.io/component": "webhook",
          "app.kubernetes.io/name": "knative-serving",
          "app.kubernetes.io/version": "1.15.0",
          role: "webhook"
        }
      },
      spec: {
        affinity: {
          podAntiAffinity: {
            preferredDuringSchedulingIgnoredDuringExecution: [{
              podAffinityTerm: {
                labelSelector: {
                  matchLabels: {
                    app: "webhook"
                  }
                },
                topologyKey: "kubernetes.io/hostname"
              },
              weight: 100
            }]
          }
        },
        containers: [{
          env: [{
            name: "POD_NAME",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.name"
              }
            }
          }, {
            name: "SYSTEM_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }, {
            name: "CONFIG_LOGGING_NAME",
            value: "config-logging"
          }, {
            name: "CONFIG_OBSERVABILITY_NAME",
            value: "config-observability"
          }, {
            name: "WEBHOOK_NAME",
            value: "webhook"
          }, {
            name: "WEBHOOK_PORT",
            value: "8443"
          }, {
            name: "METRICS_DOMAIN",
            value: "knative.dev/internal/serving"
          }],
          image: "gcr.io/knative-releases/knative.dev/serving/cmd/webhook@sha256:732d9cdf7f5fa5c6055d26b1aa5aad40e3d74ba9f2cb76a1db0f0e4d072b7cd0",
          livenessProbe: {
            failureThreshold: 6,
            httpGet: {
              port: 8443,
              scheme: "HTTPS"
            },
            initialDelaySeconds: 20,
            periodSeconds: 10
          },
          name: "webhook",
          ports: [{
            containerPort: 9090,
            name: "metrics"
          }, {
            containerPort: 8008,
            name: "profiling"
          }, {
            containerPort: 8443,
            name: "https-webhook"
          }],
          readinessProbe: {
            httpGet: {
              port: 8443,
              scheme: "HTTPS"
            },
            periodSeconds: 1
          },
          resources: {
            limits: {
              cpu: "500m",
              memory: "500Mi"
            },
            requests: {
              cpu: "100m",
              memory: "100Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        serviceAccountName: "controller",
        terminationGracePeriodSeconds: 300
      }
    }
  }
};
export const Service_Webhook: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      role: "webhook"
    },
    name: "webhook",
    namespace: "knative-serving"
  },
  spec: {
    ports: [{
      name: "http-metrics",
      port: 9090,
      targetPort: 9090
    }, {
      name: "http-profiling",
      port: 8008,
      targetPort: 8008
    }, {
      name: "https-webhook",
      port: 443,
      targetPort: 8443
    }],
    selector: {
      app: "webhook",
      role: "webhook"
    }
  }
};
export const ValidatingWebhookConfiguration_ConfigWebhookServingKnativeDev: AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration = {
  apiVersion: "admissionregistration.k8s.io/v1",
  kind: "ValidatingWebhookConfiguration",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "config.webhook.serving.knative.dev"
  },
  webhooks: [{
    admissionReviewVersions: ["v1", "v1beta1"],
    clientConfig: {
      service: {
        name: "webhook",
        namespace: "knative-serving"
      }
    },
    failurePolicy: "Fail",
    name: "config.webhook.serving.knative.dev",
    objectSelector: {
      matchExpressions: [{
        key: "app.kubernetes.io/name",
        operator: "In",
        values: ["knative-serving"]
      }, {
        key: "app.kubernetes.io/component",
        operator: "In",
        values: ["autoscaler", "controller", "logging", "networking", "observability", "tracing", "net-certmanager"]
      }]
    },
    sideEffects: "None",
    timeoutSeconds: 10
  }]
};
export const MutatingWebhookConfiguration_WebhookServingKnativeDev: AdmissionregistrationK8sIoV1MutatingWebhookConfiguration = {
  apiVersion: "admissionregistration.k8s.io/v1",
  kind: "MutatingWebhookConfiguration",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "webhook.serving.knative.dev"
  },
  webhooks: [{
    admissionReviewVersions: ["v1", "v1beta1"],
    clientConfig: {
      service: {
        name: "webhook",
        namespace: "knative-serving"
      }
    },
    failurePolicy: "Fail",
    name: "webhook.serving.knative.dev",
    rules: [{
      apiGroups: ["autoscaling.internal.knative.dev", "networking.internal.knative.dev", "serving.knative.dev"],
      apiVersions: ["*"],
      operations: ["CREATE", "UPDATE"],
      resources: ["metrics", "podautoscalers", "certificates", "ingresses", "serverlessservices", "configurations", "revisions", "routes", "services", "domainmappings", "domainmappings/status"],
      scope: "*"
    }],
    sideEffects: "None",
    timeoutSeconds: 10
  }]
};
export const ValidatingWebhookConfiguration_ValidationWebhookServingKnativeDev: AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration = {
  apiVersion: "admissionregistration.k8s.io/v1",
  kind: "ValidatingWebhookConfiguration",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "validation.webhook.serving.knative.dev"
  },
  webhooks: [{
    admissionReviewVersions: ["v1", "v1beta1"],
    clientConfig: {
      service: {
        name: "webhook",
        namespace: "knative-serving"
      }
    },
    failurePolicy: "Fail",
    name: "validation.webhook.serving.knative.dev",
    rules: [{
      apiGroups: ["autoscaling.internal.knative.dev", "networking.internal.knative.dev", "serving.knative.dev"],
      apiVersions: ["*"],
      operations: ["CREATE", "UPDATE", "DELETE"],
      resources: ["metrics", "podautoscalers", "certificates", "ingresses", "serverlessservices", "configurations", "revisions", "routes", "services", "domainmappings", "domainmappings/status"],
      scope: "*"
    }],
    sideEffects: "None",
    timeoutSeconds: 10
  }]
};
export const Secret_WebhookCerts: Secret = {
  apiVersion: "v1",
  kind: "Secret",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0"
    },
    name: "webhook-certs",
    namespace: "knative-serving"
  }
};
export const Namespace_KourierSystem: Namespace = {
  apiVersion: "v1",
  kind: "Namespace",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "kourier-system"
  }
};
export const ConfigMap_KourierBootstrap: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "kourier-bootstrap",
    namespace: "kourier-system"
  },
  data: {
    "envoy-bootstrap.yaml": "dynamic_resources:\n  ads_config:\n    transport_api_version: V3\n    api_type: GRPC\n    rate_limit_settings: {}\n    grpc_services:\n    - envoy_grpc: {cluster_name: xds_cluster}\n  cds_config:\n    resource_api_version: V3\n    ads: {}\n  lds_config:\n    resource_api_version: V3\n    ads: {}\nnode:\n  cluster: kourier-knative\n  id: 3scale-kourier-gateway\nstatic_resources:\n  listeners:\n    - name: stats_listener\n      address:\n        socket_address:\n          address: 0.0.0.0\n          port_value: 9000\n      filter_chains:\n        - filters:\n            - name: envoy.filters.network.http_connection_manager\n              typed_config:\n                \"@type\": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager\n                stat_prefix: stats_server\n                http_filters:\n                  - name: envoy.filters.http.router\n                    typed_config:\n                      \"@type\": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router\n                route_config:\n                  virtual_hosts:\n                    - name: admin_interface\n                      domains:\n                        - \"*\"\n                      routes:\n                        - match:\n                            safe_regex:\n                              regex: '/(certs|stats(/prometheus)?|server_info|clusters|listeners|ready)?'\n                            headers:\n                              - name: ':method'\n                                string_match:\n                                  exact: GET\n                          route:\n                            cluster: service_stats\n                        - match:\n                            safe_regex:\n                              regex: '/drain_listeners'\n                            headers:\n                              - name: ':method'\n                                string_match:\n                                  exact: POST\n                          route:\n                            cluster: service_stats\n  clusters:\n    - name: service_stats\n      connect_timeout: 0.250s\n      type: static\n      load_assignment:\n        cluster_name: service_stats\n        endpoints:\n          lb_endpoints:\n            endpoint:\n              address:\n                socket_address:\n                  address: 127.0.0.1\n                  port_value: 9901\n    - name: xds_cluster\n      # This keepalive is recommended by envoy docs.\n      # https://www.envoyproxy.io/docs/envoy/latest/api-docs/xds_protocol\n      typed_extension_protocol_options:\n        envoy.extensions.upstreams.http.v3.HttpProtocolOptions:\n          \"@type\": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions\n          explicit_http_config:\n            http2_protocol_options:\n              connection_keepalive:\n                interval: 30s\n                timeout: 5s\n      connect_timeout: 1s\n      load_assignment:\n        cluster_name: xds_cluster\n        endpoints:\n          lb_endpoints:\n            endpoint:\n              address:\n                socket_address:\n                  address: \"net-kourier-controller.knative-serving\"\n                  port_value: 18000\n      type: STRICT_DNS\nadmin:\n  access_log:\n  - name: envoy.access_loggers.stdout\n    typed_config:\n      \"@type\": type.googleapis.com/envoy.extensions.access_loggers.stream.v3.StdoutAccessLog\n  address:\n    socket_address:\n      address: 127.0.0.1\n      port_value: 9901\n"
  }
};
export const ConfigMap_ConfigKourier: ConfigMap = {
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "config-kourier",
    namespace: "knative-serving"
  },
  data: {
    _example: "################################\n#                              #\n#    EXAMPLE CONFIGURATION     #\n#                              #\n################################\n\n# This block is not actually functional configuration,\n# but serves to illustrate the available configuration\n# options and document them in a way that is accessible\n# to users that `kubectl edit` this config map.\n#\n# These sample configuration options may be copied out of\n# this example block and unindented to be in the data block\n# to actually change the configuration.\n\n# Specifies whether requests reaching the Kourier gateway\n# in the context of services should be logged. Readiness\n# probes etc. must be configured via the bootstrap config.\nenable-service-access-logging: \"true\"\n\n# Specifies whether to use proxy-protocol in order to safely\n# transport connection information such as a client's address\n# across multiple layers of TCP proxies.\n# NOTE THAT THIS IS AN EXPERIMENTAL / ALPHA FEATURE\nenable-proxy-protocol: \"false\"\n\n# The server certificates to serve the internal TLS traffic for Kourier Gateway.\n# It is specified by the secret name in controller namespace, which has\n# the \"tls.crt\" and \"tls.key\" data field.\n# Use an empty value to disable the feature (default).\n#\n# NOTE: This flag is in an alpha state and is mostly here to enable internal testing\n#       for now. Use with caution.\ncluster-cert-secret: \"\"\n\n# Specifies the amount of time that Kourier waits for the incoming requests.\n# The default, 0s, imposes no timeout at all.\nstream-idle-timeout: \"0s\"\n\n# Specifies whether to use CryptoMB private key provider in order to\n# acclerate the TLS handshake.\n# NOTE THAT THIS IS AN EXPERIMENTAL / ALPHA FEATURE.\nenable-cryptomb: \"false\"\n\n# Configures the number of additional ingress proxy hops from the\n# right side of the x-forwarded-for HTTP header to trust.\ntrusted-hops-count: \"0\"\n\n# Specifies the cipher suites for TLS external listener.\n# Use ',' separated values like \"ECDHE-ECDSA-AES128-GCM-SHA256,ECDHE-ECDSA-CHACHA20-POLY1305\"\n# The default uses the default cipher suites of the envoy version.\ncipher-suites: \"\"\n"
  }
};
export const ServiceAccount_NetKourier: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "net-kourier",
    namespace: "knative-serving"
  }
};
export const ClusterRole_NetKourier: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "net-kourier"
  },
  rules: [{
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "update", "patch"]
  }, {
    apiGroups: [""],
    resources: ["pods", "endpoints", "services", "secrets"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["configmaps"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resources: ["leases"],
    verbs: ["get", "list", "create", "update", "delete", "patch", "watch"]
  }, {
    apiGroups: ["networking.internal.knative.dev"],
    resources: ["ingresses"],
    verbs: ["get", "list", "watch", "patch"]
  }, {
    apiGroups: ["networking.internal.knative.dev"],
    resources: ["ingresses/status"],
    verbs: ["update"]
  }]
};
export const ClusterRoleBinding_NetKourier: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "net-kourier"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "net-kourier"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "net-kourier",
    namespace: "knative-serving"
  }]
};
export const Deployment_NetKourierController: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "net-kourier-controller",
    namespace: "knative-serving"
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        app: "net-kourier-controller"
      }
    },
    strategy: {
      rollingUpdate: {
        maxSurge: "100%",
        maxUnavailable: 0
      },
      type: "RollingUpdate"
    },
    template: {
      metadata: {
        annotations: {
          "prometheus.io/path": "/metrics",
          "prometheus.io/port": "9090",
          "prometheus.io/scrape": "true"
        },
        labels: {
          app: "net-kourier-controller"
        }
      },
      spec: {
        containers: [{
          env: [{
            name: "CERTS_SECRET_NAMESPACE",
            value: ""
          }, {
            name: "CERTS_SECRET_NAME",
            value: ""
          }, {
            name: "SYSTEM_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }, {
            name: "METRICS_DOMAIN",
            value: "knative.dev/samples"
          }, {
            name: "KOURIER_GATEWAY_NAMESPACE",
            value: "kourier-system"
          }, {
            name: "ENABLE_SECRET_INFORMER_FILTERING_BY_CERT_UID",
            value: "false"
          }, {
            name: "KUBE_API_BURST",
            value: "200"
          }, {
            name: "KUBE_API_QPS",
            value: "200"
          }],
          image: "gcr.io/knative-releases/knative.dev/net-kourier/cmd/kourier@sha256:c9016f34165c5118373c75dcc373d1cd802fe37ffa9e1bce65960942a59bc5f1",
          livenessProbe: {
            failureThreshold: 6,
            grpc: {
              port: 18000
            },
            periodSeconds: 10
          },
          name: "controller",
          ports: [{
            containerPort: 18000,
            name: "http2-xds",
            protocol: "TCP"
          }, {
            containerPort: 9090,
            name: "metrics",
            protocol: "TCP"
          }],
          readinessProbe: {
            failureThreshold: 3,
            grpc: {
              port: 18000
            },
            periodSeconds: 10
          },
          resources: {
            limits: {
              cpu: "1",
              memory: "500Mi"
            },
            requests: {
              cpu: "200m",
              memory: "200Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true,
            runAsNonRoot: true,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          }
        }],
        restartPolicy: "Always",
        serviceAccountName: "net-kourier"
      }
    }
  }
};
export const Service_NetKourierController: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "net-kourier-controller",
    namespace: "knative-serving"
  },
  spec: {
    ports: [{
      name: "grpc-xds",
      port: 18000,
      protocol: "TCP",
      targetPort: 18000
    }, {
      name: "http-metrics",
      port: 9090,
      protocol: "TCP",
      targetPort: 9090
    }],
    selector: {
      app: "net-kourier-controller"
    },
    type: "ClusterIP"
  }
};
export const Deployment_3scaleKourierGateway: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "3scale-kourier-gateway",
    namespace: "kourier-system"
  },
  spec: {
    selector: {
      matchLabels: {
        app: "3scale-kourier-gateway"
      }
    },
    strategy: {
      rollingUpdate: {
        maxSurge: "100%",
        maxUnavailable: 0
      },
      type: "RollingUpdate"
    },
    template: {
      metadata: {
        annotations: {
          "networking.knative.dev/poke": "v0.26",
          "prometheus.io/path": "/stats/prometheus",
          "prometheus.io/port": "9000",
          "prometheus.io/scrape": "true"
        },
        labels: {
          app: "3scale-kourier-gateway"
        }
      },
      spec: {
        containers: [{
          args: ["--base-id 1", "-c /tmp/config/envoy-bootstrap.yaml", "--log-level info", "--drain-time-s $(DRAIN_TIME_SECONDS)", "--drain-strategy immediate"],
          command: ["/usr/local/bin/envoy"],
          env: [{
            name: "DRAIN_TIME_SECONDS",
            value: "15"
          }],
          image: "docker.io/envoyproxy/envoy:v1.26-latest",
          lifecycle: {
            preStop: {
              exec: {
                command: ["/bin/sh", "-c", "curl -X POST http://localhost:9901/drain_listeners?graceful; sleep $DRAIN_TIME_SECONDS"]
              }
            }
          },
          livenessProbe: {
            failureThreshold: 6,
            httpGet: {
              httpHeaders: [{
                name: "Host",
                value: "internalkourier"
              }],
              path: "/ready",
              port: 8081,
              scheme: "HTTP"
            },
            initialDelaySeconds: 10,
            periodSeconds: 5
          },
          name: "kourier-gateway",
          ports: [{
            containerPort: 8080,
            name: "http2-external",
            protocol: "TCP"
          }, {
            containerPort: 8081,
            name: "http2-internal",
            protocol: "TCP"
          }, {
            containerPort: 8443,
            name: "https-external",
            protocol: "TCP"
          }, {
            containerPort: 8090,
            name: "http-probe",
            protocol: "TCP"
          }, {
            containerPort: 9443,
            name: "https-probe",
            protocol: "TCP"
          }, {
            containerPort: 9000,
            name: "metrics",
            protocol: "TCP"
          }],
          readinessProbe: {
            failureThreshold: 3,
            httpGet: {
              httpHeaders: [{
                name: "Host",
                value: "internalkourier"
              }],
              path: "/ready",
              port: 8081,
              scheme: "HTTP"
            },
            initialDelaySeconds: 10,
            periodSeconds: 5
          },
          resources: {
            limits: {
              cpu: "1",
              memory: "800Mi"
            },
            requests: {
              cpu: "200m",
              memory: "200Mi"
            }
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: false,
            runAsGroup: 65534,
            runAsNonRoot: true,
            runAsUser: 65534,
            seccompProfile: {
              type: "RuntimeDefault"
            }
          },
          volumeMounts: [{
            mountPath: "/tmp/config",
            name: "config-volume"
          }]
        }],
        restartPolicy: "Always",
        terminationGracePeriodSeconds: 30,
        volumes: [{
          configMap: {
            name: "kourier-bootstrap"
          },
          name: "config-volume"
        }]
      }
    }
  }
};
export const Service_Kourier: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "kourier",
    namespace: "kourier-system"
  },
  spec: {
    ports: [{
      name: "http2",
      port: 80,
      protocol: "TCP",
      targetPort: 8080
    }, {
      name: "https",
      port: 443,
      protocol: "TCP",
      targetPort: 8443
    }],
    selector: {
      app: "3scale-kourier-gateway"
    },
    type: "LoadBalancer"
  }
};
export const Service_KourierInternal: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "kourier-internal",
    namespace: "kourier-system"
  },
  spec: {
    ports: [{
      name: "http2",
      port: 80,
      protocol: "TCP",
      targetPort: 8081
    }, {
      name: "https",
      port: 443,
      protocol: "TCP",
      targetPort: 8444
    }],
    selector: {
      app: "3scale-kourier-gateway"
    },
    type: "ClusterIP"
  }
};
export const HorizontalPodAutoscaler_3scaleKourierGateway: AutoscalingV2HorizontalPodAutoscaler = {
  apiVersion: "autoscaling/v2",
  kind: "HorizontalPodAutoscaler",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "3scale-kourier-gateway",
    namespace: "kourier-system"
  },
  spec: {
    maxReplicas: 10,
    metrics: [{
      resource: {
        name: "cpu",
        target: {
          averageUtilization: 100,
          type: "Utilization"
        }
      },
      type: "Resource"
    }],
    minReplicas: 1,
    scaleTargetRef: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      name: "3scale-kourier-gateway"
    }
  }
};
export const PodDisruptionBudget_3scaleKourierGatewayPdb: PolicyV1PodDisruptionBudget = {
  apiVersion: "policy/v1",
  kind: "PodDisruptionBudget",
  metadata: {
    labels: {
      "app.kubernetes.io/component": "net-kourier",
      "app.kubernetes.io/name": "knative-serving",
      "app.kubernetes.io/version": "1.15.0",
      "networking.knative.dev/ingress-provider": "kourier"
    },
    name: "3scale-kourier-gateway-pdb",
    namespace: "kourier-system"
  },
  spec: {
    minAvailable: "80%",
    selector: {
      matchLabels: {
        app: "3scale-kourier-gateway"
      }
    }
  }
};
export const resources: ReadonlyArray<KubernetesResource> = [CustomResourceDefinition_CertificatesNetworkingInternalKnativeDev, CustomResourceDefinition_ConfigurationsServingKnativeDev, CustomResourceDefinition_ClusterdomainclaimsNetworkingInternalKnativeDev, CustomResourceDefinition_DomainmappingsServingKnativeDev, CustomResourceDefinition_IngressesNetworkingInternalKnativeDev, CustomResourceDefinition_MetricsAutoscalingInternalKnativeDev, CustomResourceDefinition_PodautoscalersAutoscalingInternalKnativeDev, CustomResourceDefinition_RevisionsServingKnativeDev, CustomResourceDefinition_RoutesServingKnativeDev, CustomResourceDefinition_ServerlessservicesNetworkingInternalKnativeDev, CustomResourceDefinition_ServicesServingKnativeDev, CustomResourceDefinition_ImagesCachingInternalKnativeDev, Namespace_KnativeServing, Role_KnativeServingActivator, ClusterRole_KnativeServingActivatorCluster, ClusterRole_KnativeServingAggregatedAddressableResolver, ClusterRole_KnativeServingAddressableResolver, ClusterRole_KnativeServingNamespacedAdmin, ClusterRole_KnativeServingNamespacedEdit, ClusterRole_KnativeServingNamespacedView, ClusterRole_KnativeServingCore, ClusterRole_KnativeServingPodspecableBinding, ServiceAccount_Controller, ClusterRole_KnativeServingAdmin, ClusterRoleBinding_KnativeServingControllerAdmin, ClusterRoleBinding_KnativeServingControllerAddressableResolver, ServiceAccount_Activator, RoleBinding_KnativeServingActivator, ClusterRoleBinding_KnativeServingActivatorCluster, Certificate_RoutingServingCerts, Image_QueueProxy, ConfigMap_ConfigAutoscaler, ConfigMap_ConfigCertmanager, ConfigMap_ConfigDefaults, ConfigMap_ConfigDeployment, ConfigMap_ConfigDomain, ConfigMap_ConfigFeatures, ConfigMap_ConfigGc, ConfigMap_ConfigLeaderElection, ConfigMap_ConfigLogging, ConfigMap_ConfigNetwork, ConfigMap_ConfigObservability, ConfigMap_ConfigTracing, HorizontalPodAutoscaler_Activator, PodDisruptionBudget_ActivatorPdb, Deployment_Activator, Service_ActivatorService, Deployment_Autoscaler, Service_Autoscaler, Deployment_Controller, Service_Controller, HorizontalPodAutoscaler_Webhook, PodDisruptionBudget_WebhookPdb, Deployment_Webhook, Service_Webhook, ValidatingWebhookConfiguration_ConfigWebhookServingKnativeDev, MutatingWebhookConfiguration_WebhookServingKnativeDev, ValidatingWebhookConfiguration_ValidationWebhookServingKnativeDev, Secret_WebhookCerts, Namespace_KourierSystem, ConfigMap_KourierBootstrap, ConfigMap_ConfigKourier, ServiceAccount_NetKourier, ClusterRole_NetKourier, ClusterRoleBinding_NetKourier, Deployment_NetKourierController, Service_NetKourierController, Deployment_3scaleKourierGateway, Service_Kourier, Service_KourierInternal, HorizontalPodAutoscaler_3scaleKourierGateway, PodDisruptionBudget_3scaleKourierGatewayPdb];
export default {
  resources: resources
};
