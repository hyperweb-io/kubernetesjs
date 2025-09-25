/** Auto-generated typed resources for operator: cert-manager*/
import type { KubernetesResource, AdmissionregistrationK8sIoV1MutatingWebhookConfiguration, AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration, ApiextensionsK8sIoV1CustomResourceDefinition, AppsV1Deployment, BatchV1Job, RbacAuthorizationK8sIoV1ClusterRole, RbacAuthorizationK8sIoV1ClusterRoleBinding, RbacAuthorizationK8sIoV1Role, RbacAuthorizationK8sIoV1RoleBinding, Service, ServiceAccount } from "@interweb/interwebjs";
export const ServiceAccount_CertManagerCainjector: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector",
    namespace: "cert-manager"
  },
  automountServiceAccountToken: true
};
export const ServiceAccount_CertManager: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager",
    namespace: "cert-manager"
  },
  automountServiceAccountToken: true
};
export const ServiceAccount_CertManagerWebhook: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook",
    namespace: "cert-manager"
  },
  automountServiceAccountToken: true
};
export const CustomResourceDefinition_CertificaterequestsCertManagerIo: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    annotations: {
      "helm.sh/resource-policy": "keep"
    },
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "certificaterequests.cert-manager.io"
  },
  spec: {
    group: "cert-manager.io",
    names: {
      categories: ["cert-manager"],
      kind: "CertificateRequest",
      listKind: "CertificateRequestList",
      plural: "certificaterequests",
      shortNames: ["cr", "crs"],
      singular: "certificaterequest"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type==\"Approved\")].status",
        name: "Approved",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Denied\")].status",
        name: "Denied",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".spec.issuerRef.name",
        name: "Issuer",
        type: "string"
      }, {
        jsonPath: ".spec.username",
        name: "Requester",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].message",
        name: "Status",
        priority: 1,
        type: "string"
      }, {
        description: "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.",
        jsonPath: ".metadata.creationTimestamp",
        name: "Age",
        type: "date"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "A CertificateRequest is used to request a signed certificate from one of the\nconfigured issuers.\n\nAll fields within the CertificateRequest's `spec` are immutable after creation.\nA CertificateRequest will either succeed or fail, as denoted by its `Ready` status\ncondition and its `status.failureTime` field.\n\nA CertificateRequest is a one-shot resource, meaning it represents a single\npoint in time request for a certificate and cannot be re-used.",
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
              description: "Specification of the desired state of the CertificateRequest resource.\nhttps://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                duration: {
                  description: "Requested 'duration' (i.e. lifetime) of the Certificate. Note that the\nissuer may choose to ignore the requested duration, just like any other\nrequested attribute.",
                  type: "string"
                },
                extra: {
                  additionalProperties: {
                    items: {
                      type: "string"
                    },
                    type: "array"
                  },
                  description: "Extra contains extra attributes of the user that created the CertificateRequest.\nPopulated by the cert-manager webhook on creation and immutable.",
                  type: "object"
                },
                groups: {
                  description: "Groups contains group membership of the user that created the CertificateRequest.\nPopulated by the cert-manager webhook on creation and immutable.",
                  items: {
                    type: "string"
                  },
                  type: "array",
                  "x-kubernetes-list-type": "atomic"
                },
                isCA: {
                  description: "Requested basic constraints isCA value. Note that the issuer may choose\nto ignore the requested isCA value, just like any other requested attribute.\n\nNOTE: If the CSR in the `Request` field has a BasicConstraints extension,\nit must have the same isCA value as specified here.\n\nIf true, this will automatically add the `cert sign` usage to the list\nof requested `usages`.",
                  type: "boolean"
                },
                issuerRef: {
                  description: "Reference to the issuer responsible for issuing the certificate.\nIf the issuer is namespace-scoped, it must be in the same namespace\nas the Certificate. If the issuer is cluster-scoped, it can be used\nfrom any namespace.\n\nThe `name` field of the reference must always be specified.",
                  properties: {
                    group: {
                      description: "Group of the resource being referred to.",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the resource being referred to.",
                      type: "string"
                    },
                    name: {
                      description: "Name of the resource being referred to.",
                      type: "string"
                    }
                  },
                  required: ["name"],
                  type: "object"
                },
                request: {
                  description: "The PEM-encoded X.509 certificate signing request to be submitted to the\nissuer for signing.\n\nIf the CSR has a BasicConstraints extension, its isCA attribute must\nmatch the `isCA` value of this CertificateRequest.\nIf the CSR has a KeyUsage extension, its key usages must match the\nkey usages in the `usages` field of this CertificateRequest.\nIf the CSR has a ExtKeyUsage extension, its extended key usages\nmust match the extended key usages in the `usages` field of this\nCertificateRequest.",
                  format: "byte",
                  type: "string"
                },
                uid: {
                  description: "UID contains the uid of the user that created the CertificateRequest.\nPopulated by the cert-manager webhook on creation and immutable.",
                  type: "string"
                },
                usages: {
                  description: "Requested key usages and extended key usages.\n\nNOTE: If the CSR in the `Request` field has uses the KeyUsage or\nExtKeyUsage extension, these extensions must have the same values\nas specified here without any additional values.\n\nIf unset, defaults to `digital signature` and `key encipherment`.",
                  items: {
                    description: "KeyUsage specifies valid usage contexts for keys.\nSee:\nhttps://tools.ietf.org/html/rfc5280#section-4.2.1.3\nhttps://tools.ietf.org/html/rfc5280#section-4.2.1.12\n\nValid KeyUsage values are as follows:\n\"signing\",\n\"digital signature\",\n\"content commitment\",\n\"key encipherment\",\n\"key agreement\",\n\"data encipherment\",\n\"cert sign\",\n\"crl sign\",\n\"encipher only\",\n\"decipher only\",\n\"any\",\n\"server auth\",\n\"client auth\",\n\"code signing\",\n\"email protection\",\n\"s/mime\",\n\"ipsec end system\",\n\"ipsec tunnel\",\n\"ipsec user\",\n\"timestamping\",\n\"ocsp signing\",\n\"microsoft sgc\",\n\"netscape sgc\"",
                    enum: ["signing", "digital signature", "content commitment", "key encipherment", "key agreement", "data encipherment", "cert sign", "crl sign", "encipher only", "decipher only", "any", "server auth", "client auth", "code signing", "email protection", "s/mime", "ipsec end system", "ipsec tunnel", "ipsec user", "timestamping", "ocsp signing", "microsoft sgc", "netscape sgc"],
                    type: "string"
                  },
                  type: "array"
                },
                username: {
                  description: "Username contains the name of the user that created the CertificateRequest.\nPopulated by the cert-manager webhook on creation and immutable.",
                  type: "string"
                }
              },
              required: ["issuerRef", "request"],
              type: "object"
            },
            status: {
              description: "Status of the CertificateRequest.\nThis is set and managed automatically.\nRead-only.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                ca: {
                  description: "The PEM encoded X.509 certificate of the signer, also known as the CA\n(Certificate Authority).\nThis is set on a best-effort basis by different issuers.\nIf not set, the CA is assumed to be unknown/not available.",
                  format: "byte",
                  type: "string"
                },
                certificate: {
                  description: "The PEM encoded X.509 certificate resulting from the certificate\nsigning request.\nIf not set, the CertificateRequest has either not been completed or has\nfailed. More information on failure can be found by checking the\n`conditions` field.",
                  format: "byte",
                  type: "string"
                },
                conditions: {
                  description: "List of status conditions to indicate the status of a CertificateRequest.\nKnown condition types are `Ready`, `InvalidRequest`, `Approved` and `Denied`.",
                  items: {
                    description: "CertificateRequestCondition contains condition information for a CertificateRequest.",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the timestamp corresponding to the last status\nchange of this condition.",
                        format: "date-time",
                        type: "string"
                      },
                      message: {
                        description: "Message is a human readable description of the details of the last\ntransition, complementing reason.",
                        type: "string"
                      },
                      reason: {
                        description: "Reason is a brief machine readable explanation for the condition's last\ntransition.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of (`True`, `False`, `Unknown`).",
                        enum: ["True", "False", "Unknown"],
                        type: "string"
                      },
                      type: {
                        description: "Type of the condition, known values are (`Ready`, `InvalidRequest`,\n`Approved`, `Denied`).",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array",
                  "x-kubernetes-list-map-keys": ["type"],
                  "x-kubernetes-list-type": "map"
                },
                failureTime: {
                  description: "FailureTime stores the time that this CertificateRequest failed. This is\nused to influence garbage collection and back-off.",
                  format: "date-time",
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
export const CustomResourceDefinition_CertificatesCertManagerIo: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    annotations: {
      "helm.sh/resource-policy": "keep"
    },
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "certificates.cert-manager.io"
  },
  spec: {
    group: "cert-manager.io",
    names: {
      categories: ["cert-manager"],
      kind: "Certificate",
      listKind: "CertificateList",
      plural: "certificates",
      shortNames: ["cert", "certs"],
      singular: "certificate"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".spec.secretName",
        name: "Secret",
        type: "string"
      }, {
        jsonPath: ".spec.issuerRef.name",
        name: "Issuer",
        priority: 1,
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].message",
        name: "Status",
        priority: 1,
        type: "string"
      }, {
        description: "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.",
        jsonPath: ".metadata.creationTimestamp",
        name: "Age",
        type: "date"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "A Certificate resource should be created to ensure an up to date and signed\nX.509 certificate is stored in the Kubernetes Secret resource named in `spec.secretName`.\n\nThe stored certificate will be renewed before it expires (as configured by `spec.renewBefore`).",
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
              description: "Specification of the desired state of the Certificate resource.\nhttps://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                additionalOutputFormats: {
                  description: "Defines extra output formats of the private key and signed certificate chain\nto be written to this Certificate's target Secret.\n\nThis is a Beta Feature enabled by default. It can be disabled with the\n`--feature-gates=AdditionalCertificateOutputFormats=false` option set on both\nthe controller and webhook components.",
                  items: {
                    description: "CertificateAdditionalOutputFormat defines an additional output format of a\nCertificate resource. These contain supplementary data formats of the signed\ncertificate chain and paired private key.",
                    properties: {
                      type: {
                        description: "Type is the name of the format type that should be written to the\nCertificate's target Secret.",
                        enum: ["DER", "CombinedPEM"],
                        type: "string"
                      }
                    },
                    required: ["type"],
                    type: "object"
                  },
                  type: "array"
                },
                commonName: {
                  description: "Requested common name X509 certificate subject attribute.\nMore info: https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.6\nNOTE: TLS clients will ignore this value when any subject alternative name is\nset (see https://tools.ietf.org/html/rfc6125#section-6.4.4).\n\nShould have a length of 64 characters or fewer to avoid generating invalid CSRs.\nCannot be set if the `literalSubject` field is set.",
                  type: "string"
                },
                dnsNames: {
                  description: "Requested DNS subject alternative names.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                duration: {
                  description: "Requested 'duration' (i.e. lifetime) of the Certificate. Note that the\nissuer may choose to ignore the requested duration, just like any other\nrequested attribute.\n\nIf unset, this defaults to 90 days.\nMinimum accepted duration is 1 hour.\nValue must be in units accepted by Go time.ParseDuration https://golang.org/pkg/time/#ParseDuration.",
                  type: "string"
                },
                emailAddresses: {
                  description: "Requested email subject alternative names.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                encodeUsagesInRequest: {
                  description: "Whether the KeyUsage and ExtKeyUsage extensions should be set in the encoded CSR.\n\nThis option defaults to true, and should only be disabled if the target\nissuer does not support CSRs with these X509 KeyUsage/ ExtKeyUsage extensions.",
                  type: "boolean"
                },
                ipAddresses: {
                  description: "Requested IP address subject alternative names.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                isCA: {
                  description: "Requested basic constraints isCA value.\nThe isCA value is used to set the `isCA` field on the created CertificateRequest\nresources. Note that the issuer may choose to ignore the requested isCA value, just\nlike any other requested attribute.\n\nIf true, this will automatically add the `cert sign` usage to the list\nof requested `usages`.",
                  type: "boolean"
                },
                issuerRef: {
                  description: "Reference to the issuer responsible for issuing the certificate.\nIf the issuer is namespace-scoped, it must be in the same namespace\nas the Certificate. If the issuer is cluster-scoped, it can be used\nfrom any namespace.\n\nThe `name` field of the reference must always be specified.",
                  properties: {
                    group: {
                      description: "Group of the resource being referred to.",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the resource being referred to.",
                      type: "string"
                    },
                    name: {
                      description: "Name of the resource being referred to.",
                      type: "string"
                    }
                  },
                  required: ["name"],
                  type: "object"
                },
                keystores: {
                  description: "Additional keystore output formats to be stored in the Certificate's Secret.",
                  properties: {
                    jks: {
                      description: "JKS configures options for storing a JKS keystore in the\n`spec.secretName` Secret resource.",
                      properties: {
                        alias: {
                          description: "Alias specifies the alias of the key in the keystore, required by the JKS format.\nIf not provided, the default alias `certificate` will be used.",
                          type: "string"
                        },
                        create: {
                          description: "Create enables JKS keystore creation for the Certificate.\nIf true, a file named `keystore.jks` will be created in the target\nSecret resource, encrypted using the password stored in\n`passwordSecretRef` or `password`.\nThe keystore file will be updated immediately.\nIf the issuer provided a CA certificate, a file named `truststore.jks`\nwill also be created in the target Secret resource, encrypted using the\npassword stored in `passwordSecretRef`\ncontaining the issuing Certificate Authority",
                          type: "boolean"
                        },
                        password: {
                          description: "Password provides a literal password used to encrypt the JKS keystore.\nMutually exclusive with passwordSecretRef.\nOne of password or passwordSecretRef must provide a password with a non-zero length.",
                          type: "string"
                        },
                        passwordSecretRef: {
                          description: "PasswordSecretRef is a reference to a non-empty key in a Secret resource\ncontaining the password used to encrypt the JKS keystore.\nMutually exclusive with password.\nOne of password or passwordSecretRef must provide a password with a non-zero length.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        }
                      },
                      required: ["create"],
                      type: "object"
                    },
                    pkcs12: {
                      description: "PKCS12 configures options for storing a PKCS12 keystore in the\n`spec.secretName` Secret resource.",
                      properties: {
                        create: {
                          description: "Create enables PKCS12 keystore creation for the Certificate.\nIf true, a file named `keystore.p12` will be created in the target\nSecret resource, encrypted using the password stored in\n`passwordSecretRef` or in `password`.\nThe keystore file will be updated immediately.\nIf the issuer provided a CA certificate, a file named `truststore.p12` will\nalso be created in the target Secret resource, encrypted using the\npassword stored in `passwordSecretRef` containing the issuing Certificate\nAuthority",
                          type: "boolean"
                        },
                        password: {
                          description: "Password provides a literal password used to encrypt the PKCS#12 keystore.\nMutually exclusive with passwordSecretRef.\nOne of password or passwordSecretRef must provide a password with a non-zero length.",
                          type: "string"
                        },
                        passwordSecretRef: {
                          description: "PasswordSecretRef is a reference to a non-empty key in a Secret resource\ncontaining the password used to encrypt the PKCS#12 keystore.\nMutually exclusive with password.\nOne of password or passwordSecretRef must provide a password with a non-zero length.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        profile: {
                          description: "Profile specifies the key and certificate encryption algorithms and the HMAC algorithm\nused to create the PKCS12 keystore. Default value is `LegacyRC2` for backward compatibility.\n\nIf provided, allowed values are:\n`LegacyRC2`: Deprecated. Not supported by default in OpenSSL 3 or Java 20.\n`LegacyDES`: Less secure algorithm. Use this option for maximal compatibility.\n`Modern2023`: Secure algorithm. Use this option in case you have to always use secure algorithms\n(eg. because of company policy). Please note that the security of the algorithm is not that important\nin reality, because the unencrypted certificate and private key are also stored in the Secret.",
                          enum: ["LegacyRC2", "LegacyDES", "Modern2023"],
                          type: "string"
                        }
                      },
                      required: ["create"],
                      type: "object"
                    }
                  },
                  type: "object"
                },
                literalSubject: {
                  description: "Requested X.509 certificate subject, represented using the LDAP \"String\nRepresentation of a Distinguished Name\" [1].\nImportant: the LDAP string format also specifies the order of the attributes\nin the subject, this is important when issuing certs for LDAP authentication.\nExample: `CN=foo,DC=corp,DC=example,DC=com`\nMore info [1]: https://datatracker.ietf.org/doc/html/rfc4514\nMore info: https://github.com/cert-manager/cert-manager/issues/3203\nMore info: https://github.com/cert-manager/cert-manager/issues/4424\n\nCannot be set if the `subject` or `commonName` field is set.",
                  type: "string"
                },
                nameConstraints: {
                  description: "x.509 certificate NameConstraint extension which MUST NOT be used in a non-CA certificate.\nMore Info: https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.10\n\nThis is an Alpha Feature and is only enabled with the\n`--feature-gates=NameConstraints=true` option set on both\nthe controller and webhook components.",
                  properties: {
                    critical: {
                      description: "if true then the name constraints are marked critical.",
                      type: "boolean"
                    },
                    excluded: {
                      description: "Excluded contains the constraints which must be disallowed. Any name matching a\nrestriction in the excluded field is invalid regardless\nof information appearing in the permitted",
                      properties: {
                        dnsDomains: {
                          description: "DNSDomains is a list of DNS domains that are permitted or excluded.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        emailAddresses: {
                          description: "EmailAddresses is a list of Email Addresses that are permitted or excluded.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        ipRanges: {
                          description: "IPRanges is a list of IP Ranges that are permitted or excluded.\nThis should be a valid CIDR notation.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        uriDomains: {
                          description: "URIDomains is a list of URI domains that are permitted or excluded.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        }
                      },
                      type: "object"
                    },
                    permitted: {
                      description: "Permitted contains the constraints in which the names must be located.",
                      properties: {
                        dnsDomains: {
                          description: "DNSDomains is a list of DNS domains that are permitted or excluded.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        emailAddresses: {
                          description: "EmailAddresses is a list of Email Addresses that are permitted or excluded.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        ipRanges: {
                          description: "IPRanges is a list of IP Ranges that are permitted or excluded.\nThis should be a valid CIDR notation.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        uriDomains: {
                          description: "URIDomains is a list of URI domains that are permitted or excluded.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        }
                      },
                      type: "object"
                    }
                  },
                  type: "object"
                },
                otherNames: {
                  description: "`otherNames` is an escape hatch for SAN that allows any type. We currently restrict the support to string like otherNames, cf RFC 5280 p 37\nAny UTF8 String valued otherName can be passed with by setting the keys oid: x.x.x.x and UTF8Value: somevalue for `otherName`.\nMost commonly this would be UPN set with oid: 1.3.6.1.4.1.311.20.2.3\nYou should ensure that any OID passed is valid for the UTF8String type as we do not explicitly validate this.",
                  items: {
                    properties: {
                      oid: {
                        description: "OID is the object identifier for the otherName SAN.\nThe object identifier must be expressed as a dotted string, for\nexample, \"1.2.840.113556.1.4.221\".",
                        type: "string"
                      },
                      utf8Value: {
                        description: "utf8Value is the string value of the otherName SAN.\nThe utf8Value accepts any valid UTF8 string to set as value for the otherName SAN.",
                        type: "string"
                      }
                    },
                    type: "object"
                  },
                  type: "array"
                },
                privateKey: {
                  description: "Private key options. These include the key algorithm and size, the used\nencoding and the rotation policy.",
                  properties: {
                    algorithm: {
                      description: "Algorithm is the private key algorithm of the corresponding private key\nfor this certificate.\n\nIf provided, allowed values are either `RSA`, `ECDSA` or `Ed25519`.\nIf `algorithm` is specified and `size` is not provided,\nkey size of 2048 will be used for `RSA` key algorithm and\nkey size of 256 will be used for `ECDSA` key algorithm.\nkey size is ignored when using the `Ed25519` key algorithm.",
                      enum: ["RSA", "ECDSA", "Ed25519"],
                      type: "string"
                    },
                    encoding: {
                      description: "The private key cryptography standards (PKCS) encoding for this\ncertificate's private key to be encoded in.\n\nIf provided, allowed values are `PKCS1` and `PKCS8` standing for PKCS#1\nand PKCS#8, respectively.\nDefaults to `PKCS1` if not specified.",
                      enum: ["PKCS1", "PKCS8"],
                      type: "string"
                    },
                    rotationPolicy: {
                      description: "RotationPolicy controls how private keys should be regenerated when a\nre-issuance is being processed.\n\nIf set to `Never`, a private key will only be generated if one does not\nalready exist in the target `spec.secretName`. If one does exist but it\ndoes not have the correct algorithm or size, a warning will be raised\nto await user intervention.\nIf set to `Always`, a private key matching the specified requirements\nwill be generated whenever a re-issuance occurs.\nDefault is `Never` for backward compatibility.",
                      enum: ["Never", "Always"],
                      type: "string"
                    },
                    size: {
                      description: "Size is the key bit size of the corresponding private key for this certificate.\n\nIf `algorithm` is set to `RSA`, valid values are `2048`, `4096` or `8192`,\nand will default to `2048` if not specified.\nIf `algorithm` is set to `ECDSA`, valid values are `256`, `384` or `521`,\nand will default to `256` if not specified.\nIf `algorithm` is set to `Ed25519`, Size is ignored.\nNo other values are allowed.",
                      type: "integer"
                    }
                  },
                  type: "object"
                },
                renewBefore: {
                  description: "How long before the currently issued certificate's expiry cert-manager should\nrenew the certificate. For example, if a certificate is valid for 60 minutes,\nand `renewBefore=10m`, cert-manager will begin to attempt to renew the certificate\n50 minutes after it was issued (i.e. when there are 10 minutes remaining until\nthe certificate is no longer valid).\n\nNOTE: The actual lifetime of the issued certificate is used to determine the\nrenewal time. If an issuer returns a certificate with a different lifetime than\nthe one requested, cert-manager will use the lifetime of the issued certificate.\n\nIf unset, this defaults to 1/3 of the issued certificate's lifetime.\nMinimum accepted value is 5 minutes.\nValue must be in units accepted by Go time.ParseDuration https://golang.org/pkg/time/#ParseDuration.\nCannot be set if the `renewBeforePercentage` field is set.",
                  type: "string"
                },
                renewBeforePercentage: {
                  description: "`renewBeforePercentage` is like `renewBefore`, except it is a relative percentage\nrather than an absolute duration. For example, if a certificate is valid for 60\nminutes, and  `renewBeforePercentage=25`, cert-manager will begin to attempt to\nrenew the certificate 45 minutes after it was issued (i.e. when there are 15\nminutes (25%) remaining until the certificate is no longer valid).\n\nNOTE: The actual lifetime of the issued certificate is used to determine the\nrenewal time. If an issuer returns a certificate with a different lifetime than\nthe one requested, cert-manager will use the lifetime of the issued certificate.\n\nValue must be an integer in the range (0,100). The minimum effective\n`renewBefore` derived from the `renewBeforePercentage` and `duration` fields is 5\nminutes.\nCannot be set if the `renewBefore` field is set.",
                  format: "int32",
                  type: "integer"
                },
                revisionHistoryLimit: {
                  description: "The maximum number of CertificateRequest revisions that are maintained in\nthe Certificate's history. Each revision represents a single `CertificateRequest`\ncreated by this Certificate, either when it was created, renewed, or Spec\nwas changed. Revisions will be removed by oldest first if the number of\nrevisions exceeds this number.\n\nIf set, revisionHistoryLimit must be a value of `1` or greater.\nIf unset (`nil`), revisions will not be garbage collected.\nDefault value is `nil`.",
                  format: "int32",
                  type: "integer"
                },
                secretName: {
                  description: "Name of the Secret resource that will be automatically created and\nmanaged by this Certificate resource. It will be populated with a\nprivate key and certificate, signed by the denoted issuer. The Secret\nresource lives in the same namespace as the Certificate resource.",
                  type: "string"
                },
                secretTemplate: {
                  description: "Defines annotations and labels to be copied to the Certificate's Secret.\nLabels and annotations on the Secret will be changed as they appear on the\nSecretTemplate when added or removed. SecretTemplate annotations are added\nin conjunction with, and cannot overwrite, the base set of annotations\ncert-manager sets on the Certificate's Secret.",
                  properties: {
                    annotations: {
                      additionalProperties: {
                        type: "string"
                      },
                      description: "Annotations is a key value map to be copied to the target Kubernetes Secret.",
                      type: "object"
                    },
                    labels: {
                      additionalProperties: {
                        type: "string"
                      },
                      description: "Labels is a key value map to be copied to the target Kubernetes Secret.",
                      type: "object"
                    }
                  },
                  type: "object"
                },
                subject: {
                  description: "Requested set of X509 certificate subject attributes.\nMore info: https://datatracker.ietf.org/doc/html/rfc5280#section-4.1.2.6\n\nThe common name attribute is specified separately in the `commonName` field.\nCannot be set if the `literalSubject` field is set.",
                  properties: {
                    countries: {
                      description: "Countries to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    localities: {
                      description: "Cities to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    organizationalUnits: {
                      description: "Organizational Units to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    organizations: {
                      description: "Organizations to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    postalCodes: {
                      description: "Postal codes to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    provinces: {
                      description: "State/Provinces to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    serialNumber: {
                      description: "Serial number to be used on the Certificate.",
                      type: "string"
                    },
                    streetAddresses: {
                      description: "Street addresses to be used on the Certificate.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    }
                  },
                  type: "object"
                },
                uris: {
                  description: "Requested URI subject alternative names.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                usages: {
                  description: "Requested key usages and extended key usages.\nThese usages are used to set the `usages` field on the created CertificateRequest\nresources. If `encodeUsagesInRequest` is unset or set to `true`, the usages\nwill additionally be encoded in the `request` field which contains the CSR blob.\n\nIf unset, defaults to `digital signature` and `key encipherment`.",
                  items: {
                    description: "KeyUsage specifies valid usage contexts for keys.\nSee:\nhttps://tools.ietf.org/html/rfc5280#section-4.2.1.3\nhttps://tools.ietf.org/html/rfc5280#section-4.2.1.12\n\nValid KeyUsage values are as follows:\n\"signing\",\n\"digital signature\",\n\"content commitment\",\n\"key encipherment\",\n\"key agreement\",\n\"data encipherment\",\n\"cert sign\",\n\"crl sign\",\n\"encipher only\",\n\"decipher only\",\n\"any\",\n\"server auth\",\n\"client auth\",\n\"code signing\",\n\"email protection\",\n\"s/mime\",\n\"ipsec end system\",\n\"ipsec tunnel\",\n\"ipsec user\",\n\"timestamping\",\n\"ocsp signing\",\n\"microsoft sgc\",\n\"netscape sgc\"",
                    enum: ["signing", "digital signature", "content commitment", "key encipherment", "key agreement", "data encipherment", "cert sign", "crl sign", "encipher only", "decipher only", "any", "server auth", "client auth", "code signing", "email protection", "s/mime", "ipsec end system", "ipsec tunnel", "ipsec user", "timestamping", "ocsp signing", "microsoft sgc", "netscape sgc"],
                    type: "string"
                  },
                  type: "array"
                }
              },
              required: ["issuerRef", "secretName"],
              type: "object"
            },
            status: {
              description: "Status of the Certificate.\nThis is set and managed automatically.\nRead-only.\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
              properties: {
                conditions: {
                  description: "List of status conditions to indicate the status of certificates.\nKnown condition types are `Ready` and `Issuing`.",
                  items: {
                    description: "CertificateCondition contains condition information for a Certificate.",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the timestamp corresponding to the last status\nchange of this condition.",
                        format: "date-time",
                        type: "string"
                      },
                      message: {
                        description: "Message is a human readable description of the details of the last\ntransition, complementing reason.",
                        type: "string"
                      },
                      observedGeneration: {
                        description: "If set, this represents the .metadata.generation that the condition was\nset based upon.\nFor instance, if .metadata.generation is currently 12, but the\n.status.condition[x].observedGeneration is 9, the condition is out of date\nwith respect to the current state of the Certificate.",
                        format: "int64",
                        type: "integer"
                      },
                      reason: {
                        description: "Reason is a brief machine readable explanation for the condition's last\ntransition.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of (`True`, `False`, `Unknown`).",
                        enum: ["True", "False", "Unknown"],
                        type: "string"
                      },
                      type: {
                        description: "Type of the condition, known values are (`Ready`, `Issuing`).",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array",
                  "x-kubernetes-list-map-keys": ["type"],
                  "x-kubernetes-list-type": "map"
                },
                failedIssuanceAttempts: {
                  description: "The number of continuous failed issuance attempts up till now. This\nfield gets removed (if set) on a successful issuance and gets set to\n1 if unset and an issuance has failed. If an issuance has failed, the\ndelay till the next issuance will be calculated using formula\ntime.Hour * 2 ^ (failedIssuanceAttempts - 1).",
                  type: "integer"
                },
                lastFailureTime: {
                  description: "LastFailureTime is set only if the latest issuance for this\nCertificate failed and contains the time of the failure. If an\nissuance has failed, the delay till the next issuance will be\ncalculated using formula time.Hour * 2 ^ (failedIssuanceAttempts -\n1). If the latest issuance has succeeded this field will be unset.",
                  format: "date-time",
                  type: "string"
                },
                nextPrivateKeySecretName: {
                  description: "The name of the Secret resource containing the private key to be used\nfor the next certificate iteration.\nThe keymanager controller will automatically set this field if the\n`Issuing` condition is set to `True`.\nIt will automatically unset this field when the Issuing condition is\nnot set or False.",
                  type: "string"
                },
                notAfter: {
                  description: "The expiration time of the certificate stored in the secret named\nby this resource in `spec.secretName`.",
                  format: "date-time",
                  type: "string"
                },
                notBefore: {
                  description: "The time after which the certificate stored in the secret named\nby this resource in `spec.secretName` is valid.",
                  format: "date-time",
                  type: "string"
                },
                renewalTime: {
                  description: "RenewalTime is the time at which the certificate will be next\nrenewed.\nIf not set, no upcoming renewal is scheduled.",
                  format: "date-time",
                  type: "string"
                },
                revision: {
                  description: "The current 'revision' of the certificate as issued.\n\nWhen a CertificateRequest resource is created, it will have the\n`cert-manager.io/certificate-revision` set to one greater than the\ncurrent value of this field.\n\nUpon issuance, this field will be set to the value of the annotation\non the CertificateRequest resource used to issue the certificate.\n\nPersisting the value on the CertificateRequest resource allows the\ncertificates controller to know whether a request is part of an old\nissuance or if it is part of the ongoing revision's issuance by\nchecking if the revision value in the annotation is greater than this\nfield.",
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
export const CustomResourceDefinition_ChallengesAcmeCertManagerIo: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    annotations: {
      "helm.sh/resource-policy": "keep"
    },
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "challenges.acme.cert-manager.io"
  },
  spec: {
    group: "acme.cert-manager.io",
    names: {
      categories: ["cert-manager", "cert-manager-acme"],
      kind: "Challenge",
      listKind: "ChallengeList",
      plural: "challenges",
      singular: "challenge"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.state",
        name: "State",
        type: "string"
      }, {
        jsonPath: ".spec.dnsName",
        name: "Domain",
        type: "string"
      }, {
        jsonPath: ".status.reason",
        name: "Reason",
        priority: 1,
        type: "string"
      }, {
        description: "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.",
        jsonPath: ".metadata.creationTimestamp",
        name: "Age",
        type: "date"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "Challenge is a type to represent a Challenge request with an ACME server",
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
              properties: {
                authorizationURL: {
                  description: "The URL to the ACME Authorization resource that this\nchallenge is a part of.",
                  type: "string"
                },
                dnsName: {
                  description: "dnsName is the identifier that this challenge is for, e.g. example.com.\nIf the requested DNSName is a 'wildcard', this field MUST be set to the\nnon-wildcard domain, e.g. for `*.example.com`, it must be `example.com`.",
                  type: "string"
                },
                issuerRef: {
                  description: "References a properly configured ACME-type Issuer which should\nbe used to create this Challenge.\nIf the Issuer does not exist, processing will be retried.\nIf the Issuer is not an 'ACME' Issuer, an error will be returned and the\nChallenge will be marked as failed.",
                  properties: {
                    group: {
                      description: "Group of the resource being referred to.",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the resource being referred to.",
                      type: "string"
                    },
                    name: {
                      description: "Name of the resource being referred to.",
                      type: "string"
                    }
                  },
                  required: ["name"],
                  type: "object"
                },
                key: {
                  description: "The ACME challenge key for this challenge\nFor HTTP01 challenges, this is the value that must be responded with to\ncomplete the HTTP01 challenge in the format:\n`<private key JWK thumbprint>.<key from acme server for challenge>`.\nFor DNS01 challenges, this is the base64 encoded SHA256 sum of the\n`<private key JWK thumbprint>.<key from acme server for challenge>`\ntext that must be set as the TXT record content.",
                  type: "string"
                },
                solver: {
                  description: "Contains the domain solving configuration that should be used to\nsolve this challenge resource.",
                  properties: {
                    dns01: {
                      description: "Configures cert-manager to attempt to complete authorizations by\nperforming the DNS01 challenge flow.",
                      properties: {
                        acmeDNS: {
                          description: "Use the 'ACME DNS' (https://github.com/joohoi/acme-dns) API to manage\nDNS01 challenge records.",
                          properties: {
                            accountSecretRef: {
                              description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            host: {
                              type: "string"
                            }
                          },
                          required: ["accountSecretRef", "host"],
                          type: "object"
                        },
                        akamai: {
                          description: "Use the Akamai DNS zone management API to manage DNS01 challenge records.",
                          properties: {
                            accessTokenSecretRef: {
                              description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            clientSecretSecretRef: {
                              description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            clientTokenSecretRef: {
                              description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            serviceConsumerDomain: {
                              type: "string"
                            }
                          },
                          required: ["accessTokenSecretRef", "clientSecretSecretRef", "clientTokenSecretRef", "serviceConsumerDomain"],
                          type: "object"
                        },
                        azureDNS: {
                          description: "Use the Microsoft Azure DNS API to manage DNS01 challenge records.",
                          properties: {
                            clientID: {
                              description: "Auth: Azure Service Principal:\nThe ClientID of the Azure Service Principal used to authenticate with Azure DNS.\nIf set, ClientSecret and TenantID must also be set.",
                              type: "string"
                            },
                            clientSecretSecretRef: {
                              description: "Auth: Azure Service Principal:\nA reference to a Secret containing the password associated with the Service Principal.\nIf set, ClientID and TenantID must also be set.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            environment: {
                              description: "name of the Azure environment (default AzurePublicCloud)",
                              enum: ["AzurePublicCloud", "AzureChinaCloud", "AzureGermanCloud", "AzureUSGovernmentCloud"],
                              type: "string"
                            },
                            hostedZoneName: {
                              description: "name of the DNS zone that should be used",
                              type: "string"
                            },
                            managedIdentity: {
                              description: "Auth: Azure Workload Identity or Azure Managed Service Identity:\nSettings to enable Azure Workload Identity or Azure Managed Service Identity\nIf set, ClientID, ClientSecret and TenantID must not be set.",
                              properties: {
                                clientID: {
                                  description: "client ID of the managed identity, can not be used at the same time as resourceID",
                                  type: "string"
                                },
                                resourceID: {
                                  description: "resource ID of the managed identity, can not be used at the same time as clientID\nCannot be used for Azure Managed Service Identity",
                                  type: "string"
                                },
                                tenantID: {
                                  description: "tenant ID of the managed identity, can not be used at the same time as resourceID",
                                  type: "string"
                                }
                              },
                              type: "object"
                            },
                            resourceGroupName: {
                              description: "resource group the DNS zone is located in",
                              type: "string"
                            },
                            subscriptionID: {
                              description: "ID of the Azure subscription",
                              type: "string"
                            },
                            tenantID: {
                              description: "Auth: Azure Service Principal:\nThe TenantID of the Azure Service Principal used to authenticate with Azure DNS.\nIf set, ClientID and ClientSecret must also be set.",
                              type: "string"
                            }
                          },
                          required: ["resourceGroupName", "subscriptionID"],
                          type: "object"
                        },
                        cloudDNS: {
                          description: "Use the Google Cloud DNS API to manage DNS01 challenge records.",
                          properties: {
                            hostedZoneName: {
                              description: "HostedZoneName is an optional field that tells cert-manager in which\nCloud DNS zone the challenge record has to be created.\nIf left empty cert-manager will automatically choose a zone.",
                              type: "string"
                            },
                            project: {
                              type: "string"
                            },
                            serviceAccountSecretRef: {
                              description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["project"],
                          type: "object"
                        },
                        cloudflare: {
                          description: "Use the Cloudflare API to manage DNS01 challenge records.",
                          properties: {
                            apiKeySecretRef: {
                              description: "API key to use to authenticate with Cloudflare.\nNote: using an API token to authenticate is now the recommended method\nas it allows greater control of permissions.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            apiTokenSecretRef: {
                              description: "API token used to authenticate with Cloudflare.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            email: {
                              description: "Email of the account, only required when using API key based authentication.",
                              type: "string"
                            }
                          },
                          type: "object"
                        },
                        cnameStrategy: {
                          description: "CNAMEStrategy configures how the DNS01 provider should handle CNAME\nrecords when found in DNS zones.",
                          enum: ["None", "Follow"],
                          type: "string"
                        },
                        digitalocean: {
                          description: "Use the DigitalOcean DNS API to manage DNS01 challenge records.",
                          properties: {
                            tokenSecretRef: {
                              description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["tokenSecretRef"],
                          type: "object"
                        },
                        rfc2136: {
                          description: "Use RFC2136 (\"Dynamic Updates in the Domain Name System\") (https://datatracker.ietf.org/doc/rfc2136/)\nto manage DNS01 challenge records.",
                          properties: {
                            nameserver: {
                              description: "The IP address or hostname of an authoritative DNS server supporting\nRFC2136 in the form host:port. If the host is an IPv6 address it must be\nenclosed in square brackets (e.g [2001:db8::1])\xA0; port is optional.\nThis field is required.",
                              type: "string"
                            },
                            tsigAlgorithm: {
                              description: "The TSIG Algorithm configured in the DNS supporting RFC2136. Used only\nwhen ``tsigSecretSecretRef`` and ``tsigKeyName`` are defined.\nSupported values are (case-insensitive): ``HMACMD5`` (default),\n``HMACSHA1``, ``HMACSHA256`` or ``HMACSHA512``.",
                              type: "string"
                            },
                            tsigKeyName: {
                              description: "The TSIG Key name configured in the DNS.\nIf ``tsigSecretSecretRef`` is defined, this field is required.",
                              type: "string"
                            },
                            tsigSecretSecretRef: {
                              description: "The name of the secret containing the TSIG value.\nIf ``tsigKeyName`` is defined, this field is required.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["nameserver"],
                          type: "object"
                        },
                        route53: {
                          description: "Use the AWS Route53 API to manage DNS01 challenge records.",
                          properties: {
                            accessKeyID: {
                              description: "The AccessKeyID is used for authentication.\nCannot be set when SecretAccessKeyID is set.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                              type: "string"
                            },
                            accessKeyIDSecretRef: {
                              description: "The SecretAccessKey is used for authentication. If set, pull the AWS\naccess key ID from a key within a Kubernetes Secret.\nCannot be set when AccessKeyID is set.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            auth: {
                              description: "Auth configures how cert-manager authenticates.",
                              properties: {
                                kubernetes: {
                                  description: "Kubernetes authenticates with Route53 using AssumeRoleWithWebIdentity\nby passing a bound ServiceAccount token.",
                                  properties: {
                                    serviceAccountRef: {
                                      description: "A reference to a service account that will be used to request a bound\ntoken (also known as \"projected token\"). To use this field, you must\nconfigure an RBAC rule to let cert-manager request a token.",
                                      properties: {
                                        audiences: {
                                          description: "TokenAudiences is an optional list of audiences to include in the\ntoken passed to AWS. The default token consisting of the issuer's namespace\nand name is always included.\nIf unset the audience defaults to `sts.amazonaws.com`.",
                                          items: {
                                            type: "string"
                                          },
                                          type: "array"
                                        },
                                        name: {
                                          description: "Name of the ServiceAccount used to request a token.",
                                          type: "string"
                                        }
                                      },
                                      required: ["name"],
                                      type: "object"
                                    }
                                  },
                                  required: ["serviceAccountRef"],
                                  type: "object"
                                }
                              },
                              required: ["kubernetes"],
                              type: "object"
                            },
                            hostedZoneID: {
                              description: "If set, the provider will manage only this zone in Route53 and will not do a lookup using the route53:ListHostedZonesByName api call.",
                              type: "string"
                            },
                            region: {
                              description: "Override the AWS region.\n\nRoute53 is a global service and does not have regional endpoints but the\nregion specified here (or via environment variables) is used as a hint to\nhelp compute the correct AWS credential scope and partition when it\nconnects to Route53. See:\n- [Amazon Route 53 endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/r53.html)\n- [Global services](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html)\n\nIf you omit this region field, cert-manager will use the region from\nAWS_REGION and AWS_DEFAULT_REGION environment variables, if they are set\nin the cert-manager controller Pod.\n\nThe `region` field is not needed if you use [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html).\nInstead an AWS_REGION environment variable is added to the cert-manager controller Pod by:\n[Amazon EKS Pod Identity Webhook](https://github.com/aws/amazon-eks-pod-identity-webhook).\nIn this case this `region` field value is ignored.\n\nThe `region` field is not needed if you use [EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html).\nInstead an AWS_REGION environment variable is added to the cert-manager controller Pod by:\n[Amazon EKS Pod Identity Agent](https://github.com/aws/eks-pod-identity-agent),\nIn this case this `region` field value is ignored.",
                              type: "string"
                            },
                            role: {
                              description: "Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey\nor the inferred credentials from environment variables, shared credentials file or AWS Instance metadata",
                              type: "string"
                            },
                            secretAccessKeySecretRef: {
                              description: "The SecretAccessKey is used for authentication.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          type: "object"
                        },
                        webhook: {
                          description: "Configure an external webhook based DNS01 challenge solver to manage\nDNS01 challenge records.",
                          properties: {
                            config: {
                              description: "Additional configuration that should be passed to the webhook apiserver\nwhen challenges are processed.\nThis can contain arbitrary JSON data.\nSecret values should not be specified in this stanza.\nIf secret values are needed (e.g. credentials for a DNS service), you\nshould use a SecretKeySelector to reference a Secret resource.\nFor details on the schema of this field, consult the webhook provider\nimplementation's documentation.",
                              "x-kubernetes-preserve-unknown-fields": true
                            },
                            groupName: {
                              description: "The API group name that should be used when POSTing ChallengePayload\nresources to the webhook apiserver.\nThis should be the same as the GroupName specified in the webhook\nprovider implementation.",
                              type: "string"
                            },
                            solverName: {
                              description: "The name of the solver to use, as defined in the webhook provider\nimplementation.\nThis will typically be the name of the provider, e.g. 'cloudflare'.",
                              type: "string"
                            }
                          },
                          required: ["groupName", "solverName"],
                          type: "object"
                        }
                      },
                      type: "object"
                    },
                    http01: {
                      description: "Configures cert-manager to attempt to complete authorizations by\nperforming the HTTP01 challenge flow.\nIt is not possible to obtain certificates for wildcard domain names\n(e.g. `*.example.com`) using the HTTP01 challenge mechanism.",
                      properties: {
                        gatewayHTTPRoute: {
                          description: "The Gateway API is a sig-network community API that models service networking\nin Kubernetes (https://gateway-api.sigs.k8s.io/). The Gateway solver will\ncreate HTTPRoutes with the specified labels in the same namespace as the challenge.\nThis solver is experimental, and fields / behaviour may change in the future.",
                          properties: {
                            labels: {
                              additionalProperties: {
                                type: "string"
                              },
                              description: "Custom labels that will be applied to HTTPRoutes created by cert-manager\nwhile solving HTTP-01 challenges.",
                              type: "object"
                            },
                            parentRefs: {
                              description: "When solving an HTTP-01 challenge, cert-manager creates an HTTPRoute.\ncert-manager needs to know which parentRefs should be used when creating\nthe HTTPRoute. Usually, the parentRef references a Gateway. See:\nhttps://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways",
                              items: {
                                description: "ParentReference identifies an API object (usually a Gateway) that can be considered\na parent of this resource (usually a route). There are two kinds of parent resources\nwith \"Core\" support:\n\n* Gateway (Gateway conformance profile)\n* Service (Mesh conformance profile, ClusterIP Services only)\n\nThis API may be extended in the future to support additional kinds of parent\nresources.\n\nThe API object must be valid in the cluster; the Group and Kind must\nbe registered in the cluster for this reference to be valid.",
                                properties: {
                                  group: {
                                    default: "gateway.networking.k8s.io",
                                    description: "Group is the group of the referent.\nWhen unspecified, \"gateway.networking.k8s.io\" is inferred.\nTo set the core API group (such as for a \"Service\" kind referent),\nGroup must be explicitly set to \"\" (empty string).\n\nSupport: Core",
                                    maxLength: 253,
                                    pattern: "^$|^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
                                    type: "string"
                                  },
                                  kind: {
                                    default: "Gateway",
                                    description: "Kind is kind of the referent.\n\nThere are two kinds of parent resources with \"Core\" support:\n\n* Gateway (Gateway conformance profile)\n* Service (Mesh conformance profile, ClusterIP Services only)\n\nSupport for other resources is Implementation-Specific.",
                                    maxLength: 63,
                                    minLength: 1,
                                    pattern: "^[a-zA-Z]([-a-zA-Z0-9]*[a-zA-Z0-9])?$",
                                    type: "string"
                                  },
                                  name: {
                                    description: "Name is the name of the referent.\n\nSupport: Core",
                                    maxLength: 253,
                                    minLength: 1,
                                    type: "string"
                                  },
                                  namespace: {
                                    description: "Namespace is the namespace of the referent. When unspecified, this refers\nto the local namespace of the Route.\n\nNote that there are specific rules for ParentRefs which cross namespace\nboundaries. Cross-namespace references are only valid if they are explicitly\nallowed by something in the namespace they are referring to. For example:\nGateway has the AllowedRoutes field, and ReferenceGrant provides a\ngeneric way to enable any other kind of cross-namespace reference.\n\n<gateway:experimental:description>\nParentRefs from a Route to a Service in the same namespace are \"producer\"\nroutes, which apply default routing rules to inbound connections from\nany namespace to the Service.\n\nParentRefs from a Route to a Service in a different namespace are\n\"consumer\" routes, and these routing rules are only applied to outbound\nconnections originating from the same namespace as the Route, for which\nthe intended destination of the connections are a Service targeted as a\nParentRef of the Route.\n</gateway:experimental:description>\n\nSupport: Core",
                                    maxLength: 63,
                                    minLength: 1,
                                    pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
                                    type: "string"
                                  },
                                  port: {
                                    description: "Port is the network port this Route targets. It can be interpreted\ndifferently based on the type of parent resource.\n\nWhen the parent resource is a Gateway, this targets all listeners\nlistening on the specified port that also support this kind of Route(and\nselect this Route). It's not recommended to set `Port` unless the\nnetworking behaviors specified in a Route must apply to a specific port\nas opposed to a listener(s) whose port(s) may be changed. When both Port\nand SectionName are specified, the name and port of the selected listener\nmust match both specified values.\n\n<gateway:experimental:description>\nWhen the parent resource is a Service, this targets a specific port in the\nService spec. When both Port (experimental) and SectionName are specified,\nthe name and port of the selected port must match both specified values.\n</gateway:experimental:description>\n\nImplementations MAY choose to support other parent resources.\nImplementations supporting other types of parent resources MUST clearly\ndocument how/if Port is interpreted.\n\nFor the purpose of status, an attachment is considered successful as\nlong as the parent resource accepts it partially. For example, Gateway\nlisteners can restrict which Routes can attach to them by Route kind,\nnamespace, or hostname. If 1 of 2 Gateway listeners accept attachment\nfrom the referencing Route, the Route MUST be considered successfully\nattached. If no Gateway listeners accept attachment from this Route,\nthe Route MUST be considered detached from the Gateway.\n\nSupport: Extended",
                                    format: "int32",
                                    maximum: 65535,
                                    minimum: 1,
                                    type: "integer"
                                  },
                                  sectionName: {
                                    description: "SectionName is the name of a section within the target resource. In the\nfollowing resources, SectionName is interpreted as the following:\n\n* Gateway: Listener name. When both Port (experimental) and SectionName\nare specified, the name and port of the selected listener must match\nboth specified values.\n* Service: Port name. When both Port (experimental) and SectionName\nare specified, the name and port of the selected listener must match\nboth specified values.\n\nImplementations MAY choose to support attaching Routes to other resources.\nIf that is the case, they MUST clearly document how SectionName is\ninterpreted.\n\nWhen unspecified (empty string), this will reference the entire resource.\nFor the purpose of status, an attachment is considered successful if at\nleast one section in the parent resource accepts it. For example, Gateway\nlisteners can restrict which Routes can attach to them by Route kind,\nnamespace, or hostname. If 1 of 2 Gateway listeners accept attachment from\nthe referencing Route, the Route MUST be considered successfully\nattached. If no Gateway listeners accept attachment from this Route, the\nRoute MUST be considered detached from the Gateway.\n\nSupport: Core",
                                    maxLength: 253,
                                    minLength: 1,
                                    pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
                                    type: "string"
                                  }
                                },
                                required: ["name"],
                                type: "object"
                              },
                              type: "array"
                            },
                            podTemplate: {
                              description: "Optional pod template used to configure the ACME challenge solver pods\nused for HTTP01 challenges.",
                              properties: {
                                metadata: {
                                  description: "ObjectMeta overrides for the pod used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                  properties: {
                                    annotations: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "Annotations that should be added to the created ACME HTTP01 solver pods.",
                                      type: "object"
                                    },
                                    labels: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "Labels that should be added to the created ACME HTTP01 solver pods.",
                                      type: "object"
                                    }
                                  },
                                  type: "object"
                                },
                                spec: {
                                  description: "PodSpec defines overrides for the HTTP01 challenge solver pod.\nCheck ACMEChallengeSolverHTTP01IngressPodSpec to find out currently supported fields.\nAll other fields will be ignored.",
                                  properties: {
                                    affinity: {
                                      description: "If specified, the pod's scheduling constraints",
                                      properties: {
                                        nodeAffinity: {
                                          description: "Describes node affinity scheduling rules for the pod.",
                                          properties: {
                                            preferredDuringSchedulingIgnoredDuringExecution: {
                                              description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node matches the corresponding matchExpressions; the\nnode(s) with the highest sum are the most preferred.",
                                              items: {
                                                description: "An empty preferred scheduling term matches all objects with implicit weight 0\n(i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
                                                properties: {
                                                  preference: {
                                                    description: "A node selector term, associated with the corresponding weight.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "A list of node selector requirements by node's labels.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchFields: {
                                                        description: "A list of node selector requirements by node's fields.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  weight: {
                                                    description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
                                                    format: "int32",
                                                    type: "integer"
                                                  }
                                                },
                                                required: ["preference", "weight"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            },
                                            requiredDuringSchedulingIgnoredDuringExecution: {
                                              description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to an update), the system\nmay or may not try to eventually evict the pod from its node.",
                                              properties: {
                                                nodeSelectorTerms: {
                                                  description: "Required. A list of node selector terms. The terms are ORed.",
                                                  items: {
                                                    description: "A null or empty node selector term matches no objects. The requirements of\nthem are ANDed.\nThe TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "A list of node selector requirements by node's labels.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchFields: {
                                                        description: "A list of node selector requirements by node's fields.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  type: "array",
                                                  "x-kubernetes-list-type": "atomic"
                                                }
                                              },
                                              required: ["nodeSelectorTerms"],
                                              type: "object",
                                              "x-kubernetes-map-type": "atomic"
                                            }
                                          },
                                          type: "object"
                                        },
                                        podAffinity: {
                                          description: "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
                                          properties: {
                                            preferredDuringSchedulingIgnoredDuringExecution: {
                                              description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                              items: {
                                                description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                properties: {
                                                  podAffinityTerm: {
                                                    description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                    properties: {
                                                      labelSelector: {
                                                        description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      matchLabelKeys: {
                                                        description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      mismatchLabelKeys: {
                                                        description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaces: {
                                                        description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaceSelector: {
                                                        description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      topologyKey: {
                                                        description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["topologyKey"],
                                                    type: "object"
                                                  },
                                                  weight: {
                                                    description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                    format: "int32",
                                                    type: "integer"
                                                  }
                                                },
                                                required: ["podAffinityTerm", "weight"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            },
                                            requiredDuringSchedulingIgnoredDuringExecution: {
                                              description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                              items: {
                                                description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                properties: {
                                                  labelSelector: {
                                                    description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  matchLabelKeys: {
                                                    description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  mismatchLabelKeys: {
                                                    description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaces: {
                                                    description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaceSelector: {
                                                    description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  topologyKey: {
                                                    description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["topologyKey"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            }
                                          },
                                          type: "object"
                                        },
                                        podAntiAffinity: {
                                          description: "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
                                          properties: {
                                            preferredDuringSchedulingIgnoredDuringExecution: {
                                              description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe anti-affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling anti-affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                              items: {
                                                description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                properties: {
                                                  podAffinityTerm: {
                                                    description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                    properties: {
                                                      labelSelector: {
                                                        description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      matchLabelKeys: {
                                                        description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      mismatchLabelKeys: {
                                                        description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaces: {
                                                        description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaceSelector: {
                                                        description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      topologyKey: {
                                                        description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["topologyKey"],
                                                    type: "object"
                                                  },
                                                  weight: {
                                                    description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                    format: "int32",
                                                    type: "integer"
                                                  }
                                                },
                                                required: ["podAffinityTerm", "weight"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            },
                                            requiredDuringSchedulingIgnoredDuringExecution: {
                                              description: "If the anti-affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the anti-affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                              items: {
                                                description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                properties: {
                                                  labelSelector: {
                                                    description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  matchLabelKeys: {
                                                    description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  mismatchLabelKeys: {
                                                    description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaces: {
                                                    description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaceSelector: {
                                                    description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  topologyKey: {
                                                    description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["topologyKey"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            }
                                          },
                                          type: "object"
                                        }
                                      },
                                      type: "object"
                                    },
                                    imagePullSecrets: {
                                      description: "If specified, the pod's imagePullSecrets",
                                      items: {
                                        description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                                        properties: {
                                          name: {
                                            default: "",
                                            description: "Name of the referent.\nThis field is effectively required, but due to backwards compatibility is\nallowed to be empty. Instances of this type with an empty value here are\nalmost certainly wrong.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                            type: "string"
                                          }
                                        },
                                        type: "object",
                                        "x-kubernetes-map-type": "atomic"
                                      },
                                      type: "array"
                                    },
                                    nodeSelector: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "NodeSelector is a selector which must be true for the pod to fit on a node.\nSelector which must match a node's labels for the pod to be scheduled on that node.\nMore info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
                                      type: "object"
                                    },
                                    priorityClassName: {
                                      description: "If specified, the pod's priorityClassName.",
                                      type: "string"
                                    },
                                    securityContext: {
                                      description: "If specified, the pod's security context",
                                      properties: {
                                        fsGroup: {
                                          description: "A special supplemental group that applies to all containers in a pod.\nSome volume types allow the Kubelet to change the ownership of that volume\nto be owned by the pod:\n\n1. The owning GID will be the FSGroup\n2. The setgid bit is set (new files created in the volume will be owned by FSGroup)\n3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume.\nNote that this field cannot be set when spec.os.name is windows.",
                                          format: "int64",
                                          type: "integer"
                                        },
                                        fsGroupChangePolicy: {
                                          description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume\nbefore being exposed inside Pod. This field will only apply to\nvolume types which support fsGroup based ownership(and permissions).\nIt will have no effect on ephemeral volume types such as: secret, configmaps\nand emptydir.\nValid values are \"OnRootMismatch\" and \"Always\". If not specified, \"Always\" is used.\nNote that this field cannot be set when spec.os.name is windows.",
                                          type: "string"
                                        },
                                        runAsGroup: {
                                          description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                          format: "int64",
                                          type: "integer"
                                        },
                                        runAsNonRoot: {
                                          description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                          type: "boolean"
                                        },
                                        runAsUser: {
                                          description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                          format: "int64",
                                          type: "integer"
                                        },
                                        seccompProfile: {
                                          description: "The seccomp options to use by the containers in this pod.\nNote that this field cannot be set when spec.os.name is windows.",
                                          properties: {
                                            localhostProfile: {
                                              description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                              type: "string"
                                            },
                                            type: {
                                              description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                              type: "string"
                                            }
                                          },
                                          required: ["type"],
                                          type: "object"
                                        },
                                        seLinuxOptions: {
                                          description: "The SELinux context to be applied to all containers.\nIf unspecified, the container runtime will allocate a random SELinux context for each\ncontainer.  May also be set in SecurityContext.  If set in\nboth SecurityContext and PodSecurityContext, the value specified in SecurityContext\ntakes precedence for that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                          properties: {
                                            level: {
                                              description: "Level is SELinux level label that applies to the container.",
                                              type: "string"
                                            },
                                            role: {
                                              description: "Role is a SELinux role label that applies to the container.",
                                              type: "string"
                                            },
                                            type: {
                                              description: "Type is a SELinux type label that applies to the container.",
                                              type: "string"
                                            },
                                            user: {
                                              description: "User is a SELinux user label that applies to the container.",
                                              type: "string"
                                            }
                                          },
                                          type: "object"
                                        },
                                        supplementalGroups: {
                                          description: "A list of groups applied to the first process run in each container, in addition\nto the container's primary GID, the fsGroup (if specified), and group memberships\ndefined in the container image for the uid of the container process. If unspecified,\nno additional groups are added to any container. Note that group memberships\ndefined in the container image for the uid of the container process are still effective,\neven if they are not included in this list.\nNote that this field cannot be set when spec.os.name is windows.",
                                          items: {
                                            format: "int64",
                                            type: "integer"
                                          },
                                          type: "array"
                                        },
                                        sysctls: {
                                          description: "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported\nsysctls (by the container runtime) might fail to launch.\nNote that this field cannot be set when spec.os.name is windows.",
                                          items: {
                                            description: "Sysctl defines a kernel parameter to be set",
                                            properties: {
                                              name: {
                                                description: "Name of a property to set",
                                                type: "string"
                                              },
                                              value: {
                                                description: "Value of a property to set",
                                                type: "string"
                                              }
                                            },
                                            required: ["name", "value"],
                                            type: "object"
                                          },
                                          type: "array"
                                        }
                                      },
                                      type: "object"
                                    },
                                    serviceAccountName: {
                                      description: "If specified, the pod's service account",
                                      type: "string"
                                    },
                                    tolerations: {
                                      description: "If specified, the pod's tolerations.",
                                      items: {
                                        description: "The pod this Toleration is attached to tolerates any taint that matches\nthe triple <key,value,effect> using the matching operator <operator>.",
                                        properties: {
                                          effect: {
                                            description: "Effect indicates the taint effect to match. Empty means match all taint effects.\nWhen specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
                                            type: "string"
                                          },
                                          key: {
                                            description: "Key is the taint key that the toleration applies to. Empty means match all taint keys.\nIf the key is empty, operator must be Exists; this combination means to match all values and all keys.",
                                            type: "string"
                                          },
                                          operator: {
                                            description: "Operator represents a key's relationship to the value.\nValid operators are Exists and Equal. Defaults to Equal.\nExists is equivalent to wildcard for value, so that a pod can\ntolerate all taints of a particular category.",
                                            type: "string"
                                          },
                                          tolerationSeconds: {
                                            description: "TolerationSeconds represents the period of time the toleration (which must be\nof effect NoExecute, otherwise this field is ignored) tolerates the taint. By default,\nit is not set, which means tolerate the taint forever (do not evict). Zero and\nnegative values will be treated as 0 (evict immediately) by the system.",
                                            format: "int64",
                                            type: "integer"
                                          },
                                          value: {
                                            description: "Value is the taint value the toleration matches to.\nIf the operator is Exists, the value should be empty, otherwise just a regular string.",
                                            type: "string"
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
                            },
                            serviceType: {
                              description: "Optional service type for Kubernetes solver service. Supported values\nare NodePort or ClusterIP. If unset, defaults to NodePort.",
                              type: "string"
                            }
                          },
                          type: "object"
                        },
                        ingress: {
                          description: "The ingress based HTTP01 challenge solver will solve challenges by\ncreating or modifying Ingress resources in order to route requests for\n'/.well-known/acme-challenge/XYZ' to 'challenge solver' pods that are\nprovisioned by cert-manager for each Challenge to be completed.",
                          properties: {
                            class: {
                              description: "This field configures the annotation `kubernetes.io/ingress.class` when\ncreating Ingress resources to solve ACME challenges that use this\nchallenge solver. Only one of `class`, `name` or `ingressClassName` may\nbe specified.",
                              type: "string"
                            },
                            ingressClassName: {
                              description: "This field configures the field `ingressClassName` on the created Ingress\nresources used to solve ACME challenges that use this challenge solver.\nThis is the recommended way of configuring the ingress class. Only one of\n`class`, `name` or `ingressClassName` may be specified.",
                              type: "string"
                            },
                            ingressTemplate: {
                              description: "Optional ingress template used to configure the ACME challenge solver\ningress used for HTTP01 challenges.",
                              properties: {
                                metadata: {
                                  description: "ObjectMeta overrides for the ingress used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                  properties: {
                                    annotations: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "Annotations that should be added to the created ACME HTTP01 solver ingress.",
                                      type: "object"
                                    },
                                    labels: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "Labels that should be added to the created ACME HTTP01 solver ingress.",
                                      type: "object"
                                    }
                                  },
                                  type: "object"
                                }
                              },
                              type: "object"
                            },
                            name: {
                              description: "The name of the ingress resource that should have ACME challenge solving\nroutes inserted into it in order to solve HTTP01 challenges.\nThis is typically used in conjunction with ingress controllers like\ningress-gce, which maintains a 1:1 mapping between external IPs and\ningress resources. Only one of `class`, `name` or `ingressClassName` may\nbe specified.",
                              type: "string"
                            },
                            podTemplate: {
                              description: "Optional pod template used to configure the ACME challenge solver pods\nused for HTTP01 challenges.",
                              properties: {
                                metadata: {
                                  description: "ObjectMeta overrides for the pod used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                  properties: {
                                    annotations: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "Annotations that should be added to the created ACME HTTP01 solver pods.",
                                      type: "object"
                                    },
                                    labels: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "Labels that should be added to the created ACME HTTP01 solver pods.",
                                      type: "object"
                                    }
                                  },
                                  type: "object"
                                },
                                spec: {
                                  description: "PodSpec defines overrides for the HTTP01 challenge solver pod.\nCheck ACMEChallengeSolverHTTP01IngressPodSpec to find out currently supported fields.\nAll other fields will be ignored.",
                                  properties: {
                                    affinity: {
                                      description: "If specified, the pod's scheduling constraints",
                                      properties: {
                                        nodeAffinity: {
                                          description: "Describes node affinity scheduling rules for the pod.",
                                          properties: {
                                            preferredDuringSchedulingIgnoredDuringExecution: {
                                              description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node matches the corresponding matchExpressions; the\nnode(s) with the highest sum are the most preferred.",
                                              items: {
                                                description: "An empty preferred scheduling term matches all objects with implicit weight 0\n(i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
                                                properties: {
                                                  preference: {
                                                    description: "A node selector term, associated with the corresponding weight.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "A list of node selector requirements by node's labels.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchFields: {
                                                        description: "A list of node selector requirements by node's fields.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  weight: {
                                                    description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
                                                    format: "int32",
                                                    type: "integer"
                                                  }
                                                },
                                                required: ["preference", "weight"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            },
                                            requiredDuringSchedulingIgnoredDuringExecution: {
                                              description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to an update), the system\nmay or may not try to eventually evict the pod from its node.",
                                              properties: {
                                                nodeSelectorTerms: {
                                                  description: "Required. A list of node selector terms. The terms are ORed.",
                                                  items: {
                                                    description: "A null or empty node selector term matches no objects. The requirements of\nthem are ANDed.\nThe TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "A list of node selector requirements by node's labels.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchFields: {
                                                        description: "A list of node selector requirements by node's fields.",
                                                        items: {
                                                          description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "The label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  type: "array",
                                                  "x-kubernetes-list-type": "atomic"
                                                }
                                              },
                                              required: ["nodeSelectorTerms"],
                                              type: "object",
                                              "x-kubernetes-map-type": "atomic"
                                            }
                                          },
                                          type: "object"
                                        },
                                        podAffinity: {
                                          description: "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
                                          properties: {
                                            preferredDuringSchedulingIgnoredDuringExecution: {
                                              description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                              items: {
                                                description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                properties: {
                                                  podAffinityTerm: {
                                                    description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                    properties: {
                                                      labelSelector: {
                                                        description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      matchLabelKeys: {
                                                        description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      mismatchLabelKeys: {
                                                        description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaces: {
                                                        description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaceSelector: {
                                                        description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      topologyKey: {
                                                        description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["topologyKey"],
                                                    type: "object"
                                                  },
                                                  weight: {
                                                    description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                    format: "int32",
                                                    type: "integer"
                                                  }
                                                },
                                                required: ["podAffinityTerm", "weight"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            },
                                            requiredDuringSchedulingIgnoredDuringExecution: {
                                              description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                              items: {
                                                description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                properties: {
                                                  labelSelector: {
                                                    description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  matchLabelKeys: {
                                                    description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  mismatchLabelKeys: {
                                                    description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaces: {
                                                    description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaceSelector: {
                                                    description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  topologyKey: {
                                                    description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["topologyKey"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            }
                                          },
                                          type: "object"
                                        },
                                        podAntiAffinity: {
                                          description: "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
                                          properties: {
                                            preferredDuringSchedulingIgnoredDuringExecution: {
                                              description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe anti-affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling anti-affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                              items: {
                                                description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                properties: {
                                                  podAffinityTerm: {
                                                    description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                    properties: {
                                                      labelSelector: {
                                                        description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      matchLabelKeys: {
                                                        description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      mismatchLabelKeys: {
                                                        description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaces: {
                                                        description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                        items: {
                                                          type: "string"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      namespaceSelector: {
                                                        description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                        properties: {
                                                          matchExpressions: {
                                                            description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                            items: {
                                                              description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                              properties: {
                                                                key: {
                                                                  description: "key is the label key that the selector applies to.",
                                                                  type: "string"
                                                                },
                                                                operator: {
                                                                  description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                  type: "string"
                                                                },
                                                                values: {
                                                                  description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                  items: {
                                                                    type: "string"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                }
                                                              },
                                                              required: ["key", "operator"],
                                                              type: "object"
                                                            },
                                                            type: "array",
                                                            "x-kubernetes-list-type": "atomic"
                                                          },
                                                          matchLabels: {
                                                            additionalProperties: {
                                                              type: "string"
                                                            },
                                                            description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                            type: "object"
                                                          }
                                                        },
                                                        type: "object",
                                                        "x-kubernetes-map-type": "atomic"
                                                      },
                                                      topologyKey: {
                                                        description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                        type: "string"
                                                      }
                                                    },
                                                    required: ["topologyKey"],
                                                    type: "object"
                                                  },
                                                  weight: {
                                                    description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                    format: "int32",
                                                    type: "integer"
                                                  }
                                                },
                                                required: ["podAffinityTerm", "weight"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            },
                                            requiredDuringSchedulingIgnoredDuringExecution: {
                                              description: "If the anti-affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the anti-affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                              items: {
                                                description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                properties: {
                                                  labelSelector: {
                                                    description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  matchLabelKeys: {
                                                    description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  mismatchLabelKeys: {
                                                    description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaces: {
                                                    description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                    items: {
                                                      type: "string"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  namespaceSelector: {
                                                    description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                    properties: {
                                                      matchExpressions: {
                                                        description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                        items: {
                                                          description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                          properties: {
                                                            key: {
                                                              description: "key is the label key that the selector applies to.",
                                                              type: "string"
                                                            },
                                                            operator: {
                                                              description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                              type: "string"
                                                            },
                                                            values: {
                                                              description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          required: ["key", "operator"],
                                                          type: "object"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      },
                                                      matchLabels: {
                                                        additionalProperties: {
                                                          type: "string"
                                                        },
                                                        description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                        type: "object"
                                                      }
                                                    },
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  },
                                                  topologyKey: {
                                                    description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["topologyKey"],
                                                type: "object"
                                              },
                                              type: "array",
                                              "x-kubernetes-list-type": "atomic"
                                            }
                                          },
                                          type: "object"
                                        }
                                      },
                                      type: "object"
                                    },
                                    imagePullSecrets: {
                                      description: "If specified, the pod's imagePullSecrets",
                                      items: {
                                        description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                                        properties: {
                                          name: {
                                            default: "",
                                            description: "Name of the referent.\nThis field is effectively required, but due to backwards compatibility is\nallowed to be empty. Instances of this type with an empty value here are\nalmost certainly wrong.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                            type: "string"
                                          }
                                        },
                                        type: "object",
                                        "x-kubernetes-map-type": "atomic"
                                      },
                                      type: "array"
                                    },
                                    nodeSelector: {
                                      additionalProperties: {
                                        type: "string"
                                      },
                                      description: "NodeSelector is a selector which must be true for the pod to fit on a node.\nSelector which must match a node's labels for the pod to be scheduled on that node.\nMore info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
                                      type: "object"
                                    },
                                    priorityClassName: {
                                      description: "If specified, the pod's priorityClassName.",
                                      type: "string"
                                    },
                                    securityContext: {
                                      description: "If specified, the pod's security context",
                                      properties: {
                                        fsGroup: {
                                          description: "A special supplemental group that applies to all containers in a pod.\nSome volume types allow the Kubelet to change the ownership of that volume\nto be owned by the pod:\n\n1. The owning GID will be the FSGroup\n2. The setgid bit is set (new files created in the volume will be owned by FSGroup)\n3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume.\nNote that this field cannot be set when spec.os.name is windows.",
                                          format: "int64",
                                          type: "integer"
                                        },
                                        fsGroupChangePolicy: {
                                          description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume\nbefore being exposed inside Pod. This field will only apply to\nvolume types which support fsGroup based ownership(and permissions).\nIt will have no effect on ephemeral volume types such as: secret, configmaps\nand emptydir.\nValid values are \"OnRootMismatch\" and \"Always\". If not specified, \"Always\" is used.\nNote that this field cannot be set when spec.os.name is windows.",
                                          type: "string"
                                        },
                                        runAsGroup: {
                                          description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                          format: "int64",
                                          type: "integer"
                                        },
                                        runAsNonRoot: {
                                          description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                          type: "boolean"
                                        },
                                        runAsUser: {
                                          description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                          format: "int64",
                                          type: "integer"
                                        },
                                        seccompProfile: {
                                          description: "The seccomp options to use by the containers in this pod.\nNote that this field cannot be set when spec.os.name is windows.",
                                          properties: {
                                            localhostProfile: {
                                              description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                              type: "string"
                                            },
                                            type: {
                                              description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                              type: "string"
                                            }
                                          },
                                          required: ["type"],
                                          type: "object"
                                        },
                                        seLinuxOptions: {
                                          description: "The SELinux context to be applied to all containers.\nIf unspecified, the container runtime will allocate a random SELinux context for each\ncontainer.  May also be set in SecurityContext.  If set in\nboth SecurityContext and PodSecurityContext, the value specified in SecurityContext\ntakes precedence for that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                          properties: {
                                            level: {
                                              description: "Level is SELinux level label that applies to the container.",
                                              type: "string"
                                            },
                                            role: {
                                              description: "Role is a SELinux role label that applies to the container.",
                                              type: "string"
                                            },
                                            type: {
                                              description: "Type is a SELinux type label that applies to the container.",
                                              type: "string"
                                            },
                                            user: {
                                              description: "User is a SELinux user label that applies to the container.",
                                              type: "string"
                                            }
                                          },
                                          type: "object"
                                        },
                                        supplementalGroups: {
                                          description: "A list of groups applied to the first process run in each container, in addition\nto the container's primary GID, the fsGroup (if specified), and group memberships\ndefined in the container image for the uid of the container process. If unspecified,\nno additional groups are added to any container. Note that group memberships\ndefined in the container image for the uid of the container process are still effective,\neven if they are not included in this list.\nNote that this field cannot be set when spec.os.name is windows.",
                                          items: {
                                            format: "int64",
                                            type: "integer"
                                          },
                                          type: "array"
                                        },
                                        sysctls: {
                                          description: "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported\nsysctls (by the container runtime) might fail to launch.\nNote that this field cannot be set when spec.os.name is windows.",
                                          items: {
                                            description: "Sysctl defines a kernel parameter to be set",
                                            properties: {
                                              name: {
                                                description: "Name of a property to set",
                                                type: "string"
                                              },
                                              value: {
                                                description: "Value of a property to set",
                                                type: "string"
                                              }
                                            },
                                            required: ["name", "value"],
                                            type: "object"
                                          },
                                          type: "array"
                                        }
                                      },
                                      type: "object"
                                    },
                                    serviceAccountName: {
                                      description: "If specified, the pod's service account",
                                      type: "string"
                                    },
                                    tolerations: {
                                      description: "If specified, the pod's tolerations.",
                                      items: {
                                        description: "The pod this Toleration is attached to tolerates any taint that matches\nthe triple <key,value,effect> using the matching operator <operator>.",
                                        properties: {
                                          effect: {
                                            description: "Effect indicates the taint effect to match. Empty means match all taint effects.\nWhen specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
                                            type: "string"
                                          },
                                          key: {
                                            description: "Key is the taint key that the toleration applies to. Empty means match all taint keys.\nIf the key is empty, operator must be Exists; this combination means to match all values and all keys.",
                                            type: "string"
                                          },
                                          operator: {
                                            description: "Operator represents a key's relationship to the value.\nValid operators are Exists and Equal. Defaults to Equal.\nExists is equivalent to wildcard for value, so that a pod can\ntolerate all taints of a particular category.",
                                            type: "string"
                                          },
                                          tolerationSeconds: {
                                            description: "TolerationSeconds represents the period of time the toleration (which must be\nof effect NoExecute, otherwise this field is ignored) tolerates the taint. By default,\nit is not set, which means tolerate the taint forever (do not evict). Zero and\nnegative values will be treated as 0 (evict immediately) by the system.",
                                            format: "int64",
                                            type: "integer"
                                          },
                                          value: {
                                            description: "Value is the taint value the toleration matches to.\nIf the operator is Exists, the value should be empty, otherwise just a regular string.",
                                            type: "string"
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
                            },
                            serviceType: {
                              description: "Optional service type for Kubernetes solver service. Supported values\nare NodePort or ClusterIP. If unset, defaults to NodePort.",
                              type: "string"
                            }
                          },
                          type: "object"
                        }
                      },
                      type: "object"
                    },
                    selector: {
                      description: "Selector selects a set of DNSNames on the Certificate resource that\nshould be solved using this challenge solver.\nIf not specified, the solver will be treated as the 'default' solver\nwith the lowest priority, i.e. if any other solver has a more specific\nmatch, it will be used instead.",
                      properties: {
                        dnsNames: {
                          description: "List of DNSNames that this solver will be used to solve.\nIf specified and a match is found, a dnsNames selector will take\nprecedence over a dnsZones selector.\nIf multiple solvers match with the same dnsNames value, the solver\nwith the most matching labels in matchLabels will be selected.\nIf neither has more matches, the solver defined earlier in the list\nwill be selected.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        dnsZones: {
                          description: "List of DNSZones that this solver will be used to solve.\nThe most specific DNS zone match specified here will take precedence\nover other DNS zone matches, so a solver specifying sys.example.com\nwill be selected over one specifying example.com for the domain\nwww.sys.example.com.\nIf multiple solvers match with the same dnsZones value, the solver\nwith the most matching labels in matchLabels will be selected.\nIf neither has more matches, the solver defined earlier in the list\nwill be selected.",
                          items: {
                            type: "string"
                          },
                          type: "array"
                        },
                        matchLabels: {
                          additionalProperties: {
                            type: "string"
                          },
                          description: "A label selector that is used to refine the set of certificate's that\nthis challenge solver will apply to.",
                          type: "object"
                        }
                      },
                      type: "object"
                    }
                  },
                  type: "object"
                },
                token: {
                  description: "The ACME challenge token for this challenge.\nThis is the raw value returned from the ACME server.",
                  type: "string"
                },
                type: {
                  description: "The type of ACME challenge this resource represents.\nOne of \"HTTP-01\" or \"DNS-01\".",
                  enum: ["HTTP-01", "DNS-01"],
                  type: "string"
                },
                url: {
                  description: "The URL of the ACME Challenge resource for this challenge.\nThis can be used to lookup details about the status of this challenge.",
                  type: "string"
                },
                wildcard: {
                  description: "wildcard will be true if this challenge is for a wildcard identifier,\nfor example '*.example.com'.",
                  type: "boolean"
                }
              },
              required: ["authorizationURL", "dnsName", "issuerRef", "key", "solver", "token", "type", "url"],
              type: "object"
            },
            status: {
              properties: {
                presented: {
                  description: "presented will be set to true if the challenge values for this challenge\nare currently 'presented'.\nThis *does not* imply the self check is passing. Only that the values\nhave been 'submitted' for the appropriate challenge mechanism (i.e. the\nDNS01 TXT record has been presented, or the HTTP01 configuration has been\nconfigured).",
                  type: "boolean"
                },
                processing: {
                  description: "Used to denote whether this challenge should be processed or not.\nThis field will only be set to true by the 'scheduling' component.\nIt will only be set to false by the 'challenges' controller, after the\nchallenge has reached a final state or timed out.\nIf this field is set to false, the challenge controller will not take\nany more action.",
                  type: "boolean"
                },
                reason: {
                  description: "Contains human readable information on why the Challenge is in the\ncurrent state.",
                  type: "string"
                },
                state: {
                  description: "Contains the current 'state' of the challenge.\nIf not set, the state of the challenge is unknown.",
                  enum: ["valid", "ready", "pending", "processing", "invalid", "expired", "errored"],
                  type: "string"
                }
              },
              type: "object"
            }
          },
          required: ["metadata", "spec"],
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
export const CustomResourceDefinition_ClusterissuersCertManagerIo: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    annotations: {
      "helm.sh/resource-policy": "keep"
    },
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "clusterissuers.cert-manager.io"
  },
  spec: {
    group: "cert-manager.io",
    names: {
      categories: ["cert-manager"],
      kind: "ClusterIssuer",
      listKind: "ClusterIssuerList",
      plural: "clusterissuers",
      singular: "clusterissuer"
    },
    scope: "Cluster",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].message",
        name: "Status",
        priority: 1,
        type: "string"
      }, {
        description: "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.",
        jsonPath: ".metadata.creationTimestamp",
        name: "Age",
        type: "date"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "A ClusterIssuer represents a certificate issuing authority which can be\nreferenced as part of `issuerRef` fields.\nIt is similar to an Issuer, however it is cluster-scoped and therefore can\nbe referenced by resources that exist in *any* namespace, not just the same\nnamespace as the referent.",
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
              description: "Desired state of the ClusterIssuer resource.",
              properties: {
                acme: {
                  description: "ACME configures this issuer to communicate with a RFC8555 (ACME) server\nto obtain signed x509 certificates.",
                  properties: {
                    caBundle: {
                      description: "Base64-encoded bundle of PEM CAs which can be used to validate the certificate\nchain presented by the ACME server.\nMutually exclusive with SkipTLSVerify; prefer using CABundle to prevent various\nkinds of security vulnerabilities.\nIf CABundle and SkipTLSVerify are unset, the system certificate bundle inside\nthe container is used to validate the TLS connection.",
                      format: "byte",
                      type: "string"
                    },
                    disableAccountKeyGeneration: {
                      description: "Enables or disables generating a new ACME account key.\nIf true, the Issuer resource will *not* request a new account but will expect\nthe account key to be supplied via an existing secret.\nIf false, the cert-manager system will generate a new ACME account key\nfor the Issuer.\nDefaults to false.",
                      type: "boolean"
                    },
                    email: {
                      description: "Email is the email address to be associated with the ACME account.\nThis field is optional, but it is strongly recommended to be set.\nIt will be used to contact you in case of issues with your account or\ncertificates, including expiry notification emails.\nThis field may be updated after the account is initially registered.",
                      type: "string"
                    },
                    enableDurationFeature: {
                      description: "Enables requesting a Not After date on certificates that matches the\nduration of the certificate. This is not supported by all ACME servers\nlike Let's Encrypt. If set to true when the ACME server does not support\nit, it will create an error on the Order.\nDefaults to false.",
                      type: "boolean"
                    },
                    externalAccountBinding: {
                      description: "ExternalAccountBinding is a reference to a CA external account of the ACME\nserver.\nIf set, upon registration cert-manager will attempt to associate the given\nexternal account credentials with the registered ACME account.",
                      properties: {
                        keyAlgorithm: {
                          description: "Deprecated: keyAlgorithm field exists for historical compatibility\nreasons and should not be used. The algorithm is now hardcoded to HS256\nin golang/x/crypto/acme.",
                          enum: ["HS256", "HS384", "HS512"],
                          type: "string"
                        },
                        keyID: {
                          description: "keyID is the ID of the CA key that the External Account is bound to.",
                          type: "string"
                        },
                        keySecretRef: {
                          description: "keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes\nSecret which holds the symmetric MAC key of the External Account Binding.\nThe `key` is the index string that is paired with the key data in the\nSecret and should not be confused with the key data itself, or indeed with\nthe External Account Binding keyID above.\nThe secret key stored in the Secret **must** be un-padded, base64 URL\nencoded data.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        }
                      },
                      required: ["keyID", "keySecretRef"],
                      type: "object"
                    },
                    preferredChain: {
                      description: "PreferredChain is the chain to use if the ACME server outputs multiple.\nPreferredChain is no guarantee that this one gets delivered by the ACME\nendpoint.\nFor example, for Let's Encrypt's DST crosssign you would use:\n\"DST Root CA X3\" or \"ISRG Root X1\" for the newer Let's Encrypt root CA.\nThis value picks the first certificate bundle in the combined set of\nACME default and alternative chains that has a root-most certificate with\nthis value as its issuer's commonname.",
                      maxLength: 64,
                      type: "string"
                    },
                    privateKeySecretRef: {
                      description: "PrivateKey is the name of a Kubernetes Secret resource that will be used to\nstore the automatically generated ACME account private key.\nOptionally, a `key` may be specified to select a specific entry within\nthe named Secret resource.\nIf `key` is not specified, a default of `tls.key` will be used.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    server: {
                      description: "Server is the URL used to access the ACME server's 'directory' endpoint.\nFor example, for Let's Encrypt's staging endpoint, you would use:\n\"https://acme-staging-v02.api.letsencrypt.org/directory\".\nOnly ACME v2 endpoints (i.e. RFC 8555) are supported.",
                      type: "string"
                    },
                    skipTLSVerify: {
                      description: "INSECURE: Enables or disables validation of the ACME server TLS certificate.\nIf true, requests to the ACME server will not have the TLS certificate chain\nvalidated.\nMutually exclusive with CABundle; prefer using CABundle to prevent various\nkinds of security vulnerabilities.\nOnly enable this option in development environments.\nIf CABundle and SkipTLSVerify are unset, the system certificate bundle inside\nthe container is used to validate the TLS connection.\nDefaults to false.",
                      type: "boolean"
                    },
                    solvers: {
                      description: "Solvers is a list of challenge solvers that will be used to solve\nACME challenges for the matching domains.\nSolver configurations must be provided in order to obtain certificates\nfrom an ACME server.\nFor more information, see: https://cert-manager.io/docs/configuration/acme/",
                      items: {
                        description: "An ACMEChallengeSolver describes how to solve ACME challenges for the issuer it is part of.\nA selector may be provided to use different solving strategies for different DNS names.\nOnly one of HTTP01 or DNS01 must be provided.",
                        properties: {
                          dns01: {
                            description: "Configures cert-manager to attempt to complete authorizations by\nperforming the DNS01 challenge flow.",
                            properties: {
                              acmeDNS: {
                                description: "Use the 'ACME DNS' (https://github.com/joohoi/acme-dns) API to manage\nDNS01 challenge records.",
                                properties: {
                                  accountSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  host: {
                                    type: "string"
                                  }
                                },
                                required: ["accountSecretRef", "host"],
                                type: "object"
                              },
                              akamai: {
                                description: "Use the Akamai DNS zone management API to manage DNS01 challenge records.",
                                properties: {
                                  accessTokenSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  clientSecretSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  clientTokenSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  serviceConsumerDomain: {
                                    type: "string"
                                  }
                                },
                                required: ["accessTokenSecretRef", "clientSecretSecretRef", "clientTokenSecretRef", "serviceConsumerDomain"],
                                type: "object"
                              },
                              azureDNS: {
                                description: "Use the Microsoft Azure DNS API to manage DNS01 challenge records.",
                                properties: {
                                  clientID: {
                                    description: "Auth: Azure Service Principal:\nThe ClientID of the Azure Service Principal used to authenticate with Azure DNS.\nIf set, ClientSecret and TenantID must also be set.",
                                    type: "string"
                                  },
                                  clientSecretSecretRef: {
                                    description: "Auth: Azure Service Principal:\nA reference to a Secret containing the password associated with the Service Principal.\nIf set, ClientID and TenantID must also be set.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  environment: {
                                    description: "name of the Azure environment (default AzurePublicCloud)",
                                    enum: ["AzurePublicCloud", "AzureChinaCloud", "AzureGermanCloud", "AzureUSGovernmentCloud"],
                                    type: "string"
                                  },
                                  hostedZoneName: {
                                    description: "name of the DNS zone that should be used",
                                    type: "string"
                                  },
                                  managedIdentity: {
                                    description: "Auth: Azure Workload Identity or Azure Managed Service Identity:\nSettings to enable Azure Workload Identity or Azure Managed Service Identity\nIf set, ClientID, ClientSecret and TenantID must not be set.",
                                    properties: {
                                      clientID: {
                                        description: "client ID of the managed identity, can not be used at the same time as resourceID",
                                        type: "string"
                                      },
                                      resourceID: {
                                        description: "resource ID of the managed identity, can not be used at the same time as clientID\nCannot be used for Azure Managed Service Identity",
                                        type: "string"
                                      },
                                      tenantID: {
                                        description: "tenant ID of the managed identity, can not be used at the same time as resourceID",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  resourceGroupName: {
                                    description: "resource group the DNS zone is located in",
                                    type: "string"
                                  },
                                  subscriptionID: {
                                    description: "ID of the Azure subscription",
                                    type: "string"
                                  },
                                  tenantID: {
                                    description: "Auth: Azure Service Principal:\nThe TenantID of the Azure Service Principal used to authenticate with Azure DNS.\nIf set, ClientID and ClientSecret must also be set.",
                                    type: "string"
                                  }
                                },
                                required: ["resourceGroupName", "subscriptionID"],
                                type: "object"
                              },
                              cloudDNS: {
                                description: "Use the Google Cloud DNS API to manage DNS01 challenge records.",
                                properties: {
                                  hostedZoneName: {
                                    description: "HostedZoneName is an optional field that tells cert-manager in which\nCloud DNS zone the challenge record has to be created.\nIf left empty cert-manager will automatically choose a zone.",
                                    type: "string"
                                  },
                                  project: {
                                    type: "string"
                                  },
                                  serviceAccountSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                required: ["project"],
                                type: "object"
                              },
                              cloudflare: {
                                description: "Use the Cloudflare API to manage DNS01 challenge records.",
                                properties: {
                                  apiKeySecretRef: {
                                    description: "API key to use to authenticate with Cloudflare.\nNote: using an API token to authenticate is now the recommended method\nas it allows greater control of permissions.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  apiTokenSecretRef: {
                                    description: "API token used to authenticate with Cloudflare.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  email: {
                                    description: "Email of the account, only required when using API key based authentication.",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              },
                              cnameStrategy: {
                                description: "CNAMEStrategy configures how the DNS01 provider should handle CNAME\nrecords when found in DNS zones.",
                                enum: ["None", "Follow"],
                                type: "string"
                              },
                              digitalocean: {
                                description: "Use the DigitalOcean DNS API to manage DNS01 challenge records.",
                                properties: {
                                  tokenSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                required: ["tokenSecretRef"],
                                type: "object"
                              },
                              rfc2136: {
                                description: "Use RFC2136 (\"Dynamic Updates in the Domain Name System\") (https://datatracker.ietf.org/doc/rfc2136/)\nto manage DNS01 challenge records.",
                                properties: {
                                  nameserver: {
                                    description: "The IP address or hostname of an authoritative DNS server supporting\nRFC2136 in the form host:port. If the host is an IPv6 address it must be\nenclosed in square brackets (e.g [2001:db8::1])\xA0; port is optional.\nThis field is required.",
                                    type: "string"
                                  },
                                  tsigAlgorithm: {
                                    description: "The TSIG Algorithm configured in the DNS supporting RFC2136. Used only\nwhen ``tsigSecretSecretRef`` and ``tsigKeyName`` are defined.\nSupported values are (case-insensitive): ``HMACMD5`` (default),\n``HMACSHA1``, ``HMACSHA256`` or ``HMACSHA512``.",
                                    type: "string"
                                  },
                                  tsigKeyName: {
                                    description: "The TSIG Key name configured in the DNS.\nIf ``tsigSecretSecretRef`` is defined, this field is required.",
                                    type: "string"
                                  },
                                  tsigSecretSecretRef: {
                                    description: "The name of the secret containing the TSIG value.\nIf ``tsigKeyName`` is defined, this field is required.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                required: ["nameserver"],
                                type: "object"
                              },
                              route53: {
                                description: "Use the AWS Route53 API to manage DNS01 challenge records.",
                                properties: {
                                  accessKeyID: {
                                    description: "The AccessKeyID is used for authentication.\nCannot be set when SecretAccessKeyID is set.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                                    type: "string"
                                  },
                                  accessKeyIDSecretRef: {
                                    description: "The SecretAccessKey is used for authentication. If set, pull the AWS\naccess key ID from a key within a Kubernetes Secret.\nCannot be set when AccessKeyID is set.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  auth: {
                                    description: "Auth configures how cert-manager authenticates.",
                                    properties: {
                                      kubernetes: {
                                        description: "Kubernetes authenticates with Route53 using AssumeRoleWithWebIdentity\nby passing a bound ServiceAccount token.",
                                        properties: {
                                          serviceAccountRef: {
                                            description: "A reference to a service account that will be used to request a bound\ntoken (also known as \"projected token\"). To use this field, you must\nconfigure an RBAC rule to let cert-manager request a token.",
                                            properties: {
                                              audiences: {
                                                description: "TokenAudiences is an optional list of audiences to include in the\ntoken passed to AWS. The default token consisting of the issuer's namespace\nand name is always included.\nIf unset the audience defaults to `sts.amazonaws.com`.",
                                                items: {
                                                  type: "string"
                                                },
                                                type: "array"
                                              },
                                              name: {
                                                description: "Name of the ServiceAccount used to request a token.",
                                                type: "string"
                                              }
                                            },
                                            required: ["name"],
                                            type: "object"
                                          }
                                        },
                                        required: ["serviceAccountRef"],
                                        type: "object"
                                      }
                                    },
                                    required: ["kubernetes"],
                                    type: "object"
                                  },
                                  hostedZoneID: {
                                    description: "If set, the provider will manage only this zone in Route53 and will not do a lookup using the route53:ListHostedZonesByName api call.",
                                    type: "string"
                                  },
                                  region: {
                                    description: "Override the AWS region.\n\nRoute53 is a global service and does not have regional endpoints but the\nregion specified here (or via environment variables) is used as a hint to\nhelp compute the correct AWS credential scope and partition when it\nconnects to Route53. See:\n- [Amazon Route 53 endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/r53.html)\n- [Global services](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html)\n\nIf you omit this region field, cert-manager will use the region from\nAWS_REGION and AWS_DEFAULT_REGION environment variables, if they are set\nin the cert-manager controller Pod.\n\nThe `region` field is not needed if you use [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html).\nInstead an AWS_REGION environment variable is added to the cert-manager controller Pod by:\n[Amazon EKS Pod Identity Webhook](https://github.com/aws/amazon-eks-pod-identity-webhook).\nIn this case this `region` field value is ignored.\n\nThe `region` field is not needed if you use [EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html).\nInstead an AWS_REGION environment variable is added to the cert-manager controller Pod by:\n[Amazon EKS Pod Identity Agent](https://github.com/aws/eks-pod-identity-agent),\nIn this case this `region` field value is ignored.",
                                    type: "string"
                                  },
                                  role: {
                                    description: "Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey\nor the inferred credentials from environment variables, shared credentials file or AWS Instance metadata",
                                    type: "string"
                                  },
                                  secretAccessKeySecretRef: {
                                    description: "The SecretAccessKey is used for authentication.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                type: "object"
                              },
                              webhook: {
                                description: "Configure an external webhook based DNS01 challenge solver to manage\nDNS01 challenge records.",
                                properties: {
                                  config: {
                                    description: "Additional configuration that should be passed to the webhook apiserver\nwhen challenges are processed.\nThis can contain arbitrary JSON data.\nSecret values should not be specified in this stanza.\nIf secret values are needed (e.g. credentials for a DNS service), you\nshould use a SecretKeySelector to reference a Secret resource.\nFor details on the schema of this field, consult the webhook provider\nimplementation's documentation.",
                                    "x-kubernetes-preserve-unknown-fields": true
                                  },
                                  groupName: {
                                    description: "The API group name that should be used when POSTing ChallengePayload\nresources to the webhook apiserver.\nThis should be the same as the GroupName specified in the webhook\nprovider implementation.",
                                    type: "string"
                                  },
                                  solverName: {
                                    description: "The name of the solver to use, as defined in the webhook provider\nimplementation.\nThis will typically be the name of the provider, e.g. 'cloudflare'.",
                                    type: "string"
                                  }
                                },
                                required: ["groupName", "solverName"],
                                type: "object"
                              }
                            },
                            type: "object"
                          },
                          http01: {
                            description: "Configures cert-manager to attempt to complete authorizations by\nperforming the HTTP01 challenge flow.\nIt is not possible to obtain certificates for wildcard domain names\n(e.g. `*.example.com`) using the HTTP01 challenge mechanism.",
                            properties: {
                              gatewayHTTPRoute: {
                                description: "The Gateway API is a sig-network community API that models service networking\nin Kubernetes (https://gateway-api.sigs.k8s.io/). The Gateway solver will\ncreate HTTPRoutes with the specified labels in the same namespace as the challenge.\nThis solver is experimental, and fields / behaviour may change in the future.",
                                properties: {
                                  labels: {
                                    additionalProperties: {
                                      type: "string"
                                    },
                                    description: "Custom labels that will be applied to HTTPRoutes created by cert-manager\nwhile solving HTTP-01 challenges.",
                                    type: "object"
                                  },
                                  parentRefs: {
                                    description: "When solving an HTTP-01 challenge, cert-manager creates an HTTPRoute.\ncert-manager needs to know which parentRefs should be used when creating\nthe HTTPRoute. Usually, the parentRef references a Gateway. See:\nhttps://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways",
                                    items: {
                                      description: "ParentReference identifies an API object (usually a Gateway) that can be considered\na parent of this resource (usually a route). There are two kinds of parent resources\nwith \"Core\" support:\n\n* Gateway (Gateway conformance profile)\n* Service (Mesh conformance profile, ClusterIP Services only)\n\nThis API may be extended in the future to support additional kinds of parent\nresources.\n\nThe API object must be valid in the cluster; the Group and Kind must\nbe registered in the cluster for this reference to be valid.",
                                      properties: {
                                        group: {
                                          default: "gateway.networking.k8s.io",
                                          description: "Group is the group of the referent.\nWhen unspecified, \"gateway.networking.k8s.io\" is inferred.\nTo set the core API group (such as for a \"Service\" kind referent),\nGroup must be explicitly set to \"\" (empty string).\n\nSupport: Core",
                                          maxLength: 253,
                                          pattern: "^$|^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
                                          type: "string"
                                        },
                                        kind: {
                                          default: "Gateway",
                                          description: "Kind is kind of the referent.\n\nThere are two kinds of parent resources with \"Core\" support:\n\n* Gateway (Gateway conformance profile)\n* Service (Mesh conformance profile, ClusterIP Services only)\n\nSupport for other resources is Implementation-Specific.",
                                          maxLength: 63,
                                          minLength: 1,
                                          pattern: "^[a-zA-Z]([-a-zA-Z0-9]*[a-zA-Z0-9])?$",
                                          type: "string"
                                        },
                                        name: {
                                          description: "Name is the name of the referent.\n\nSupport: Core",
                                          maxLength: 253,
                                          minLength: 1,
                                          type: "string"
                                        },
                                        namespace: {
                                          description: "Namespace is the namespace of the referent. When unspecified, this refers\nto the local namespace of the Route.\n\nNote that there are specific rules for ParentRefs which cross namespace\nboundaries. Cross-namespace references are only valid if they are explicitly\nallowed by something in the namespace they are referring to. For example:\nGateway has the AllowedRoutes field, and ReferenceGrant provides a\ngeneric way to enable any other kind of cross-namespace reference.\n\n<gateway:experimental:description>\nParentRefs from a Route to a Service in the same namespace are \"producer\"\nroutes, which apply default routing rules to inbound connections from\nany namespace to the Service.\n\nParentRefs from a Route to a Service in a different namespace are\n\"consumer\" routes, and these routing rules are only applied to outbound\nconnections originating from the same namespace as the Route, for which\nthe intended destination of the connections are a Service targeted as a\nParentRef of the Route.\n</gateway:experimental:description>\n\nSupport: Core",
                                          maxLength: 63,
                                          minLength: 1,
                                          pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
                                          type: "string"
                                        },
                                        port: {
                                          description: "Port is the network port this Route targets. It can be interpreted\ndifferently based on the type of parent resource.\n\nWhen the parent resource is a Gateway, this targets all listeners\nlistening on the specified port that also support this kind of Route(and\nselect this Route). It's not recommended to set `Port` unless the\nnetworking behaviors specified in a Route must apply to a specific port\nas opposed to a listener(s) whose port(s) may be changed. When both Port\nand SectionName are specified, the name and port of the selected listener\nmust match both specified values.\n\n<gateway:experimental:description>\nWhen the parent resource is a Service, this targets a specific port in the\nService spec. When both Port (experimental) and SectionName are specified,\nthe name and port of the selected port must match both specified values.\n</gateway:experimental:description>\n\nImplementations MAY choose to support other parent resources.\nImplementations supporting other types of parent resources MUST clearly\ndocument how/if Port is interpreted.\n\nFor the purpose of status, an attachment is considered successful as\nlong as the parent resource accepts it partially. For example, Gateway\nlisteners can restrict which Routes can attach to them by Route kind,\nnamespace, or hostname. If 1 of 2 Gateway listeners accept attachment\nfrom the referencing Route, the Route MUST be considered successfully\nattached. If no Gateway listeners accept attachment from this Route,\nthe Route MUST be considered detached from the Gateway.\n\nSupport: Extended",
                                          format: "int32",
                                          maximum: 65535,
                                          minimum: 1,
                                          type: "integer"
                                        },
                                        sectionName: {
                                          description: "SectionName is the name of a section within the target resource. In the\nfollowing resources, SectionName is interpreted as the following:\n\n* Gateway: Listener name. When both Port (experimental) and SectionName\nare specified, the name and port of the selected listener must match\nboth specified values.\n* Service: Port name. When both Port (experimental) and SectionName\nare specified, the name and port of the selected listener must match\nboth specified values.\n\nImplementations MAY choose to support attaching Routes to other resources.\nIf that is the case, they MUST clearly document how SectionName is\ninterpreted.\n\nWhen unspecified (empty string), this will reference the entire resource.\nFor the purpose of status, an attachment is considered successful if at\nleast one section in the parent resource accepts it. For example, Gateway\nlisteners can restrict which Routes can attach to them by Route kind,\nnamespace, or hostname. If 1 of 2 Gateway listeners accept attachment from\nthe referencing Route, the Route MUST be considered successfully\nattached. If no Gateway listeners accept attachment from this Route, the\nRoute MUST be considered detached from the Gateway.\n\nSupport: Core",
                                          maxLength: 253,
                                          minLength: 1,
                                          pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
                                          type: "string"
                                        }
                                      },
                                      required: ["name"],
                                      type: "object"
                                    },
                                    type: "array"
                                  },
                                  podTemplate: {
                                    description: "Optional pod template used to configure the ACME challenge solver pods\nused for HTTP01 challenges.",
                                    properties: {
                                      metadata: {
                                        description: "ObjectMeta overrides for the pod used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                        properties: {
                                          annotations: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Annotations that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          },
                                          labels: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Labels that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          }
                                        },
                                        type: "object"
                                      },
                                      spec: {
                                        description: "PodSpec defines overrides for the HTTP01 challenge solver pod.\nCheck ACMEChallengeSolverHTTP01IngressPodSpec to find out currently supported fields.\nAll other fields will be ignored.",
                                        properties: {
                                          affinity: {
                                            description: "If specified, the pod's scheduling constraints",
                                            properties: {
                                              nodeAffinity: {
                                                description: "Describes node affinity scheduling rules for the pod.",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node matches the corresponding matchExpressions; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "An empty preferred scheduling term matches all objects with implicit weight 0\n(i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
                                                      properties: {
                                                        preference: {
                                                          description: "A node selector term, associated with the corresponding weight.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        weight: {
                                                          description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["preference", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to an update), the system\nmay or may not try to eventually evict the pod from its node.",
                                                    properties: {
                                                      nodeSelectorTerms: {
                                                        description: "Required. A list of node selector terms. The terms are ORed.",
                                                        items: {
                                                          description: "A null or empty node selector term matches no objects. The requirements of\nthem are ANDed.\nThe TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    required: ["nodeSelectorTerms"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAffinity: {
                                                description: "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAntiAffinity: {
                                                description: "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe anti-affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling anti-affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the anti-affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the anti-affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              }
                                            },
                                            type: "object"
                                          },
                                          imagePullSecrets: {
                                            description: "If specified, the pod's imagePullSecrets",
                                            items: {
                                              description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                                              properties: {
                                                name: {
                                                  default: "",
                                                  description: "Name of the referent.\nThis field is effectively required, but due to backwards compatibility is\nallowed to be empty. Instances of this type with an empty value here are\nalmost certainly wrong.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                                  type: "string"
                                                }
                                              },
                                              type: "object",
                                              "x-kubernetes-map-type": "atomic"
                                            },
                                            type: "array"
                                          },
                                          nodeSelector: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "NodeSelector is a selector which must be true for the pod to fit on a node.\nSelector which must match a node's labels for the pod to be scheduled on that node.\nMore info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
                                            type: "object"
                                          },
                                          priorityClassName: {
                                            description: "If specified, the pod's priorityClassName.",
                                            type: "string"
                                          },
                                          securityContext: {
                                            description: "If specified, the pod's security context",
                                            properties: {
                                              fsGroup: {
                                                description: "A special supplemental group that applies to all containers in a pod.\nSome volume types allow the Kubelet to change the ownership of that volume\nto be owned by the pod:\n\n1. The owning GID will be the FSGroup\n2. The setgid bit is set (new files created in the volume will be owned by FSGroup)\n3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              fsGroupChangePolicy: {
                                                description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume\nbefore being exposed inside Pod. This field will only apply to\nvolume types which support fsGroup based ownership(and permissions).\nIt will have no effect on ephemeral volume types such as: secret, configmaps\nand emptydir.\nValid values are \"OnRootMismatch\" and \"Always\". If not specified, \"Always\" is used.\nNote that this field cannot be set when spec.os.name is windows.",
                                                type: "string"
                                              },
                                              runAsGroup: {
                                                description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              runAsNonRoot: {
                                                description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                                type: "boolean"
                                              },
                                              runAsUser: {
                                                description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              seccompProfile: {
                                                description: "The seccomp options to use by the containers in this pod.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  localhostProfile: {
                                                    description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["type"],
                                                type: "object"
                                              },
                                              seLinuxOptions: {
                                                description: "The SELinux context to be applied to all containers.\nIf unspecified, the container runtime will allocate a random SELinux context for each\ncontainer.  May also be set in SecurityContext.  If set in\nboth SecurityContext and PodSecurityContext, the value specified in SecurityContext\ntakes precedence for that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  level: {
                                                    description: "Level is SELinux level label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  role: {
                                                    description: "Role is a SELinux role label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "Type is a SELinux type label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  user: {
                                                    description: "User is a SELinux user label that applies to the container.",
                                                    type: "string"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              supplementalGroups: {
                                                description: "A list of groups applied to the first process run in each container, in addition\nto the container's primary GID, the fsGroup (if specified), and group memberships\ndefined in the container image for the uid of the container process. If unspecified,\nno additional groups are added to any container. Note that group memberships\ndefined in the container image for the uid of the container process are still effective,\neven if they are not included in this list.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                type: "array"
                                              },
                                              sysctls: {
                                                description: "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported\nsysctls (by the container runtime) might fail to launch.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  description: "Sysctl defines a kernel parameter to be set",
                                                  properties: {
                                                    name: {
                                                      description: "Name of a property to set",
                                                      type: "string"
                                                    },
                                                    value: {
                                                      description: "Value of a property to set",
                                                      type: "string"
                                                    }
                                                  },
                                                  required: ["name", "value"],
                                                  type: "object"
                                                },
                                                type: "array"
                                              }
                                            },
                                            type: "object"
                                          },
                                          serviceAccountName: {
                                            description: "If specified, the pod's service account",
                                            type: "string"
                                          },
                                          tolerations: {
                                            description: "If specified, the pod's tolerations.",
                                            items: {
                                              description: "The pod this Toleration is attached to tolerates any taint that matches\nthe triple <key,value,effect> using the matching operator <operator>.",
                                              properties: {
                                                effect: {
                                                  description: "Effect indicates the taint effect to match. Empty means match all taint effects.\nWhen specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
                                                  type: "string"
                                                },
                                                key: {
                                                  description: "Key is the taint key that the toleration applies to. Empty means match all taint keys.\nIf the key is empty, operator must be Exists; this combination means to match all values and all keys.",
                                                  type: "string"
                                                },
                                                operator: {
                                                  description: "Operator represents a key's relationship to the value.\nValid operators are Exists and Equal. Defaults to Equal.\nExists is equivalent to wildcard for value, so that a pod can\ntolerate all taints of a particular category.",
                                                  type: "string"
                                                },
                                                tolerationSeconds: {
                                                  description: "TolerationSeconds represents the period of time the toleration (which must be\nof effect NoExecute, otherwise this field is ignored) tolerates the taint. By default,\nit is not set, which means tolerate the taint forever (do not evict). Zero and\nnegative values will be treated as 0 (evict immediately) by the system.",
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                value: {
                                                  description: "Value is the taint value the toleration matches to.\nIf the operator is Exists, the value should be empty, otherwise just a regular string.",
                                                  type: "string"
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
                                  },
                                  serviceType: {
                                    description: "Optional service type for Kubernetes solver service. Supported values\nare NodePort or ClusterIP. If unset, defaults to NodePort.",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              },
                              ingress: {
                                description: "The ingress based HTTP01 challenge solver will solve challenges by\ncreating or modifying Ingress resources in order to route requests for\n'/.well-known/acme-challenge/XYZ' to 'challenge solver' pods that are\nprovisioned by cert-manager for each Challenge to be completed.",
                                properties: {
                                  class: {
                                    description: "This field configures the annotation `kubernetes.io/ingress.class` when\ncreating Ingress resources to solve ACME challenges that use this\nchallenge solver. Only one of `class`, `name` or `ingressClassName` may\nbe specified.",
                                    type: "string"
                                  },
                                  ingressClassName: {
                                    description: "This field configures the field `ingressClassName` on the created Ingress\nresources used to solve ACME challenges that use this challenge solver.\nThis is the recommended way of configuring the ingress class. Only one of\n`class`, `name` or `ingressClassName` may be specified.",
                                    type: "string"
                                  },
                                  ingressTemplate: {
                                    description: "Optional ingress template used to configure the ACME challenge solver\ningress used for HTTP01 challenges.",
                                    properties: {
                                      metadata: {
                                        description: "ObjectMeta overrides for the ingress used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                        properties: {
                                          annotations: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Annotations that should be added to the created ACME HTTP01 solver ingress.",
                                            type: "object"
                                          },
                                          labels: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Labels that should be added to the created ACME HTTP01 solver ingress.",
                                            type: "object"
                                          }
                                        },
                                        type: "object"
                                      }
                                    },
                                    type: "object"
                                  },
                                  name: {
                                    description: "The name of the ingress resource that should have ACME challenge solving\nroutes inserted into it in order to solve HTTP01 challenges.\nThis is typically used in conjunction with ingress controllers like\ningress-gce, which maintains a 1:1 mapping between external IPs and\ningress resources. Only one of `class`, `name` or `ingressClassName` may\nbe specified.",
                                    type: "string"
                                  },
                                  podTemplate: {
                                    description: "Optional pod template used to configure the ACME challenge solver pods\nused for HTTP01 challenges.",
                                    properties: {
                                      metadata: {
                                        description: "ObjectMeta overrides for the pod used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                        properties: {
                                          annotations: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Annotations that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          },
                                          labels: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Labels that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          }
                                        },
                                        type: "object"
                                      },
                                      spec: {
                                        description: "PodSpec defines overrides for the HTTP01 challenge solver pod.\nCheck ACMEChallengeSolverHTTP01IngressPodSpec to find out currently supported fields.\nAll other fields will be ignored.",
                                        properties: {
                                          affinity: {
                                            description: "If specified, the pod's scheduling constraints",
                                            properties: {
                                              nodeAffinity: {
                                                description: "Describes node affinity scheduling rules for the pod.",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node matches the corresponding matchExpressions; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "An empty preferred scheduling term matches all objects with implicit weight 0\n(i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
                                                      properties: {
                                                        preference: {
                                                          description: "A node selector term, associated with the corresponding weight.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        weight: {
                                                          description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["preference", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to an update), the system\nmay or may not try to eventually evict the pod from its node.",
                                                    properties: {
                                                      nodeSelectorTerms: {
                                                        description: "Required. A list of node selector terms. The terms are ORed.",
                                                        items: {
                                                          description: "A null or empty node selector term matches no objects. The requirements of\nthem are ANDed.\nThe TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    required: ["nodeSelectorTerms"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAffinity: {
                                                description: "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAntiAffinity: {
                                                description: "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe anti-affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling anti-affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the anti-affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the anti-affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              }
                                            },
                                            type: "object"
                                          },
                                          imagePullSecrets: {
                                            description: "If specified, the pod's imagePullSecrets",
                                            items: {
                                              description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                                              properties: {
                                                name: {
                                                  default: "",
                                                  description: "Name of the referent.\nThis field is effectively required, but due to backwards compatibility is\nallowed to be empty. Instances of this type with an empty value here are\nalmost certainly wrong.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                                  type: "string"
                                                }
                                              },
                                              type: "object",
                                              "x-kubernetes-map-type": "atomic"
                                            },
                                            type: "array"
                                          },
                                          nodeSelector: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "NodeSelector is a selector which must be true for the pod to fit on a node.\nSelector which must match a node's labels for the pod to be scheduled on that node.\nMore info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
                                            type: "object"
                                          },
                                          priorityClassName: {
                                            description: "If specified, the pod's priorityClassName.",
                                            type: "string"
                                          },
                                          securityContext: {
                                            description: "If specified, the pod's security context",
                                            properties: {
                                              fsGroup: {
                                                description: "A special supplemental group that applies to all containers in a pod.\nSome volume types allow the Kubelet to change the ownership of that volume\nto be owned by the pod:\n\n1. The owning GID will be the FSGroup\n2. The setgid bit is set (new files created in the volume will be owned by FSGroup)\n3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              fsGroupChangePolicy: {
                                                description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume\nbefore being exposed inside Pod. This field will only apply to\nvolume types which support fsGroup based ownership(and permissions).\nIt will have no effect on ephemeral volume types such as: secret, configmaps\nand emptydir.\nValid values are \"OnRootMismatch\" and \"Always\". If not specified, \"Always\" is used.\nNote that this field cannot be set when spec.os.name is windows.",
                                                type: "string"
                                              },
                                              runAsGroup: {
                                                description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              runAsNonRoot: {
                                                description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                                type: "boolean"
                                              },
                                              runAsUser: {
                                                description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              seccompProfile: {
                                                description: "The seccomp options to use by the containers in this pod.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  localhostProfile: {
                                                    description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["type"],
                                                type: "object"
                                              },
                                              seLinuxOptions: {
                                                description: "The SELinux context to be applied to all containers.\nIf unspecified, the container runtime will allocate a random SELinux context for each\ncontainer.  May also be set in SecurityContext.  If set in\nboth SecurityContext and PodSecurityContext, the value specified in SecurityContext\ntakes precedence for that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  level: {
                                                    description: "Level is SELinux level label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  role: {
                                                    description: "Role is a SELinux role label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "Type is a SELinux type label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  user: {
                                                    description: "User is a SELinux user label that applies to the container.",
                                                    type: "string"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              supplementalGroups: {
                                                description: "A list of groups applied to the first process run in each container, in addition\nto the container's primary GID, the fsGroup (if specified), and group memberships\ndefined in the container image for the uid of the container process. If unspecified,\nno additional groups are added to any container. Note that group memberships\ndefined in the container image for the uid of the container process are still effective,\neven if they are not included in this list.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                type: "array"
                                              },
                                              sysctls: {
                                                description: "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported\nsysctls (by the container runtime) might fail to launch.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  description: "Sysctl defines a kernel parameter to be set",
                                                  properties: {
                                                    name: {
                                                      description: "Name of a property to set",
                                                      type: "string"
                                                    },
                                                    value: {
                                                      description: "Value of a property to set",
                                                      type: "string"
                                                    }
                                                  },
                                                  required: ["name", "value"],
                                                  type: "object"
                                                },
                                                type: "array"
                                              }
                                            },
                                            type: "object"
                                          },
                                          serviceAccountName: {
                                            description: "If specified, the pod's service account",
                                            type: "string"
                                          },
                                          tolerations: {
                                            description: "If specified, the pod's tolerations.",
                                            items: {
                                              description: "The pod this Toleration is attached to tolerates any taint that matches\nthe triple <key,value,effect> using the matching operator <operator>.",
                                              properties: {
                                                effect: {
                                                  description: "Effect indicates the taint effect to match. Empty means match all taint effects.\nWhen specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
                                                  type: "string"
                                                },
                                                key: {
                                                  description: "Key is the taint key that the toleration applies to. Empty means match all taint keys.\nIf the key is empty, operator must be Exists; this combination means to match all values and all keys.",
                                                  type: "string"
                                                },
                                                operator: {
                                                  description: "Operator represents a key's relationship to the value.\nValid operators are Exists and Equal. Defaults to Equal.\nExists is equivalent to wildcard for value, so that a pod can\ntolerate all taints of a particular category.",
                                                  type: "string"
                                                },
                                                tolerationSeconds: {
                                                  description: "TolerationSeconds represents the period of time the toleration (which must be\nof effect NoExecute, otherwise this field is ignored) tolerates the taint. By default,\nit is not set, which means tolerate the taint forever (do not evict). Zero and\nnegative values will be treated as 0 (evict immediately) by the system.",
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                value: {
                                                  description: "Value is the taint value the toleration matches to.\nIf the operator is Exists, the value should be empty, otherwise just a regular string.",
                                                  type: "string"
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
                                  },
                                  serviceType: {
                                    description: "Optional service type for Kubernetes solver service. Supported values\nare NodePort or ClusterIP. If unset, defaults to NodePort.",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              }
                            },
                            type: "object"
                          },
                          selector: {
                            description: "Selector selects a set of DNSNames on the Certificate resource that\nshould be solved using this challenge solver.\nIf not specified, the solver will be treated as the 'default' solver\nwith the lowest priority, i.e. if any other solver has a more specific\nmatch, it will be used instead.",
                            properties: {
                              dnsNames: {
                                description: "List of DNSNames that this solver will be used to solve.\nIf specified and a match is found, a dnsNames selector will take\nprecedence over a dnsZones selector.\nIf multiple solvers match with the same dnsNames value, the solver\nwith the most matching labels in matchLabels will be selected.\nIf neither has more matches, the solver defined earlier in the list\nwill be selected.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              dnsZones: {
                                description: "List of DNSZones that this solver will be used to solve.\nThe most specific DNS zone match specified here will take precedence\nover other DNS zone matches, so a solver specifying sys.example.com\nwill be selected over one specifying example.com for the domain\nwww.sys.example.com.\nIf multiple solvers match with the same dnsZones value, the solver\nwith the most matching labels in matchLabels will be selected.\nIf neither has more matches, the solver defined earlier in the list\nwill be selected.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              matchLabels: {
                                additionalProperties: {
                                  type: "string"
                                },
                                description: "A label selector that is used to refine the set of certificate's that\nthis challenge solver will apply to.",
                                type: "object"
                              }
                            },
                            type: "object"
                          }
                        },
                        type: "object"
                      },
                      type: "array"
                    }
                  },
                  required: ["privateKeySecretRef", "server"],
                  type: "object"
                },
                ca: {
                  description: "CA configures this issuer to sign certificates using a signing CA keypair\nstored in a Secret resource.\nThis is used to build internal PKIs that are managed by cert-manager.",
                  properties: {
                    crlDistributionPoints: {
                      description: "The CRL distribution points is an X.509 v3 certificate extension which identifies\nthe location of the CRL from which the revocation of this certificate can be checked.\nIf not set, certificates will be issued without distribution points set.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    issuingCertificateURLs: {
                      description: "IssuingCertificateURLs is a list of URLs which this issuer should embed into certificates\nit creates. See https://www.rfc-editor.org/rfc/rfc5280#section-4.2.2.1 for more details.\nAs an example, such a URL might be \"http://ca.domain.com/ca.crt\".",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    ocspServers: {
                      description: "The OCSP server list is an X.509 v3 extension that defines a list of\nURLs of OCSP responders. The OCSP responders can be queried for the\nrevocation status of an issued certificate. If not set, the\ncertificate will be issued with no OCSP servers set. For example, an\nOCSP server URL could be \"http://ocsp.int-x3.letsencrypt.org\".",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    secretName: {
                      description: "SecretName is the name of the secret used to sign Certificates issued\nby this Issuer.",
                      type: "string"
                    }
                  },
                  required: ["secretName"],
                  type: "object"
                },
                selfSigned: {
                  description: "SelfSigned configures this issuer to 'self sign' certificates using the\nprivate key used to create the CertificateRequest object.",
                  properties: {
                    crlDistributionPoints: {
                      description: "The CRL distribution points is an X.509 v3 certificate extension which identifies\nthe location of the CRL from which the revocation of this certificate can be checked.\nIf not set certificate will be issued without CDP. Values are strings.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    }
                  },
                  type: "object"
                },
                vault: {
                  description: "Vault configures this issuer to sign certificates using a HashiCorp Vault\nPKI backend.",
                  properties: {
                    auth: {
                      description: "Auth configures how cert-manager authenticates with the Vault server.",
                      properties: {
                        appRole: {
                          description: "AppRole authenticates with Vault using the App Role auth mechanism,\nwith the role and secret stored in a Kubernetes Secret resource.",
                          properties: {
                            path: {
                              description: "Path where the App Role authentication backend is mounted in Vault, e.g:\n\"approle\"",
                              type: "string"
                            },
                            roleId: {
                              description: "RoleID configured in the App Role authentication backend when setting\nup the authentication backend in Vault.",
                              type: "string"
                            },
                            secretRef: {
                              description: "Reference to a key in a Secret that contains the App Role secret used\nto authenticate with Vault.\nThe `key` field must be specified and denotes which entry within the Secret\nresource is used as the app role secret.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["path", "roleId", "secretRef"],
                          type: "object"
                        },
                        clientCertificate: {
                          description: "ClientCertificate authenticates with Vault by presenting a client\ncertificate during the request's TLS handshake.\nWorks only when using HTTPS protocol.",
                          properties: {
                            mountPath: {
                              description: "The Vault mountPath here is the mount path to use when authenticating with\nVault. For example, setting a value to `/v1/auth/foo`, will use the path\n`/v1/auth/foo/login` to authenticate with Vault. If unspecified, the\ndefault value \"/v1/auth/cert\" will be used.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the certificate role to authenticate against.\nIf not set, matching any certificate role, if available.",
                              type: "string"
                            },
                            secretName: {
                              description: "Reference to Kubernetes Secret of type \"kubernetes.io/tls\" (hence containing\ntls.crt and tls.key) used to authenticate to Vault using TLS client\nauthentication.",
                              type: "string"
                            }
                          },
                          type: "object"
                        },
                        kubernetes: {
                          description: "Kubernetes authenticates with Vault by passing the ServiceAccount\ntoken stored in the named Secret resource to the Vault server.",
                          properties: {
                            mountPath: {
                              description: "The Vault mountPath here is the mount path to use when authenticating with\nVault. For example, setting a value to `/v1/auth/foo`, will use the path\n`/v1/auth/foo/login` to authenticate with Vault. If unspecified, the\ndefault value \"/v1/auth/kubernetes\" will be used.",
                              type: "string"
                            },
                            role: {
                              description: "A required field containing the Vault Role to assume. A Role binds a\nKubernetes ServiceAccount with a set of Vault policies.",
                              type: "string"
                            },
                            secretRef: {
                              description: "The required Secret field containing a Kubernetes ServiceAccount JWT used\nfor authenticating with Vault. Use of 'ambient credentials' is not\nsupported.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            serviceAccountRef: {
                              description: "A reference to a service account that will be used to request a bound\ntoken (also known as \"projected token\"). Compared to using \"secretRef\",\nusing this field means that you don't rely on statically bound tokens. To\nuse this field, you must configure an RBAC rule to let cert-manager\nrequest a token.",
                              properties: {
                                audiences: {
                                  description: "TokenAudiences is an optional list of extra audiences to include in the token passed to Vault. The default token\nconsisting of the issuer's namespace and name is always included.",
                                  items: {
                                    type: "string"
                                  },
                                  type: "array"
                                },
                                name: {
                                  description: "Name of the ServiceAccount used to request a token.",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["role"],
                          type: "object"
                        },
                        tokenSecretRef: {
                          description: "TokenSecretRef authenticates with Vault by presenting a token.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        }
                      },
                      type: "object"
                    },
                    caBundle: {
                      description: "Base64-encoded bundle of PEM CAs which will be used to validate the certificate\nchain presented by Vault. Only used if using HTTPS to connect to Vault and\nignored for HTTP connections.\nMutually exclusive with CABundleSecretRef.\nIf neither CABundle nor CABundleSecretRef are defined, the certificate bundle in\nthe cert-manager controller container is used to validate the TLS connection.",
                      format: "byte",
                      type: "string"
                    },
                    caBundleSecretRef: {
                      description: "Reference to a Secret containing a bundle of PEM-encoded CAs to use when\nverifying the certificate chain presented by Vault when using HTTPS.\nMutually exclusive with CABundle.\nIf neither CABundle nor CABundleSecretRef are defined, the certificate bundle in\nthe cert-manager controller container is used to validate the TLS connection.\nIf no key for the Secret is specified, cert-manager will default to 'ca.crt'.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    clientCertSecretRef: {
                      description: "Reference to a Secret containing a PEM-encoded Client Certificate to use when the\nVault server requires mTLS.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    clientKeySecretRef: {
                      description: "Reference to a Secret containing a PEM-encoded Client Private Key to use when the\nVault server requires mTLS.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    namespace: {
                      description: "Name of the vault namespace. Namespaces is a set of features within Vault Enterprise that allows Vault environments to support Secure Multi-tenancy. e.g: \"ns1\"\nMore about namespaces can be found here https://www.vaultproject.io/docs/enterprise/namespaces",
                      type: "string"
                    },
                    path: {
                      description: "Path is the mount path of the Vault PKI backend's `sign` endpoint, e.g:\n\"my_pki_mount/sign/my-role-name\".",
                      type: "string"
                    },
                    server: {
                      description: "Server is the connection address for the Vault server, e.g: \"https://vault.example.com:8200\".",
                      type: "string"
                    }
                  },
                  required: ["auth", "path", "server"],
                  type: "object"
                },
                venafi: {
                  description: "Venafi configures this issuer to sign certificates using a Venafi TPP\nor Venafi Cloud policy zone.",
                  properties: {
                    cloud: {
                      description: "Cloud specifies the Venafi cloud configuration settings.\nOnly one of TPP or Cloud may be specified.",
                      properties: {
                        apiTokenSecretRef: {
                          description: "APITokenSecretRef is a secret key selector for the Venafi Cloud API token.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        url: {
                          description: "URL is the base URL for Venafi Cloud.\nDefaults to \"https://api.venafi.cloud/v1\".",
                          type: "string"
                        }
                      },
                      required: ["apiTokenSecretRef"],
                      type: "object"
                    },
                    tpp: {
                      description: "TPP specifies Trust Protection Platform configuration settings.\nOnly one of TPP or Cloud may be specified.",
                      properties: {
                        caBundle: {
                          description: "Base64-encoded bundle of PEM CAs which will be used to validate the certificate\nchain presented by the TPP server. Only used if using HTTPS; ignored for HTTP.\nIf undefined, the certificate bundle in the cert-manager controller container\nis used to validate the chain.",
                          format: "byte",
                          type: "string"
                        },
                        caBundleSecretRef: {
                          description: "Reference to a Secret containing a base64-encoded bundle of PEM CAs\nwhich will be used to validate the certificate chain presented by the TPP server.\nOnly used if using HTTPS; ignored for HTTP. Mutually exclusive with CABundle.\nIf neither CABundle nor CABundleSecretRef is defined, the certificate bundle in\nthe cert-manager controller container is used to validate the TLS connection.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        credentialsRef: {
                          description: "CredentialsRef is a reference to a Secret containing the Venafi TPP API credentials.\nThe secret must contain the key 'access-token' for the Access Token Authentication,\nor two keys, 'username' and 'password' for the API Keys Authentication.",
                          properties: {
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        url: {
                          description: "URL is the base URL for the vedsdk endpoint of the Venafi TPP instance,\nfor example: \"https://tpp.example.com/vedsdk\".",
                          type: "string"
                        }
                      },
                      required: ["credentialsRef", "url"],
                      type: "object"
                    },
                    zone: {
                      description: "Zone is the Venafi Policy Zone to use for this issuer.\nAll requests made to the Venafi platform will be restricted by the named\nzone policy.\nThis field is required.",
                      type: "string"
                    }
                  },
                  required: ["zone"],
                  type: "object"
                }
              },
              type: "object"
            },
            status: {
              description: "Status of the ClusterIssuer. This is set and managed automatically.",
              properties: {
                acme: {
                  description: "ACME specific status options.\nThis field should only be set if the Issuer is configured to use an ACME\nserver to issue certificates.",
                  properties: {
                    lastPrivateKeyHash: {
                      description: "LastPrivateKeyHash is a hash of the private key associated with the latest\nregistered ACME account, in order to track changes made to registered account\nassociated with the Issuer",
                      type: "string"
                    },
                    lastRegisteredEmail: {
                      description: "LastRegisteredEmail is the email associated with the latest registered\nACME account, in order to track changes made to registered account\nassociated with the  Issuer",
                      type: "string"
                    },
                    uri: {
                      description: "URI is the unique account identifier, which can also be used to retrieve\naccount details from the CA",
                      type: "string"
                    }
                  },
                  type: "object"
                },
                conditions: {
                  description: "List of status conditions to indicate the status of a CertificateRequest.\nKnown condition types are `Ready`.",
                  items: {
                    description: "IssuerCondition contains condition information for an Issuer.",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the timestamp corresponding to the last status\nchange of this condition.",
                        format: "date-time",
                        type: "string"
                      },
                      message: {
                        description: "Message is a human readable description of the details of the last\ntransition, complementing reason.",
                        type: "string"
                      },
                      observedGeneration: {
                        description: "If set, this represents the .metadata.generation that the condition was\nset based upon.\nFor instance, if .metadata.generation is currently 12, but the\n.status.condition[x].observedGeneration is 9, the condition is out of date\nwith respect to the current state of the Issuer.",
                        format: "int64",
                        type: "integer"
                      },
                      reason: {
                        description: "Reason is a brief machine readable explanation for the condition's last\ntransition.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of (`True`, `False`, `Unknown`).",
                        enum: ["True", "False", "Unknown"],
                        type: "string"
                      },
                      type: {
                        description: "Type of the condition, known values are (`Ready`).",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array",
                  "x-kubernetes-list-map-keys": ["type"],
                  "x-kubernetes-list-type": "map"
                }
              },
              type: "object"
            }
          },
          required: ["spec"],
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
export const CustomResourceDefinition_IssuersCertManagerIo: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    annotations: {
      "helm.sh/resource-policy": "keep"
    },
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "crds",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "issuers.cert-manager.io"
  },
  spec: {
    group: "cert-manager.io",
    names: {
      categories: ["cert-manager"],
      kind: "Issuer",
      listKind: "IssuerList",
      plural: "issuers",
      singular: "issuer"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].status",
        name: "Ready",
        type: "string"
      }, {
        jsonPath: ".status.conditions[?(@.type==\"Ready\")].message",
        name: "Status",
        priority: 1,
        type: "string"
      }, {
        description: "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.",
        jsonPath: ".metadata.creationTimestamp",
        name: "Age",
        type: "date"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "An Issuer represents a certificate issuing authority which can be\nreferenced as part of `issuerRef` fields.\nIt is scoped to a single namespace and can therefore only be referenced by\nresources within the same namespace.",
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
              description: "Desired state of the Issuer resource.",
              properties: {
                acme: {
                  description: "ACME configures this issuer to communicate with a RFC8555 (ACME) server\nto obtain signed x509 certificates.",
                  properties: {
                    caBundle: {
                      description: "Base64-encoded bundle of PEM CAs which can be used to validate the certificate\nchain presented by the ACME server.\nMutually exclusive with SkipTLSVerify; prefer using CABundle to prevent various\nkinds of security vulnerabilities.\nIf CABundle and SkipTLSVerify are unset, the system certificate bundle inside\nthe container is used to validate the TLS connection.",
                      format: "byte",
                      type: "string"
                    },
                    disableAccountKeyGeneration: {
                      description: "Enables or disables generating a new ACME account key.\nIf true, the Issuer resource will *not* request a new account but will expect\nthe account key to be supplied via an existing secret.\nIf false, the cert-manager system will generate a new ACME account key\nfor the Issuer.\nDefaults to false.",
                      type: "boolean"
                    },
                    email: {
                      description: "Email is the email address to be associated with the ACME account.\nThis field is optional, but it is strongly recommended to be set.\nIt will be used to contact you in case of issues with your account or\ncertificates, including expiry notification emails.\nThis field may be updated after the account is initially registered.",
                      type: "string"
                    },
                    enableDurationFeature: {
                      description: "Enables requesting a Not After date on certificates that matches the\nduration of the certificate. This is not supported by all ACME servers\nlike Let's Encrypt. If set to true when the ACME server does not support\nit, it will create an error on the Order.\nDefaults to false.",
                      type: "boolean"
                    },
                    externalAccountBinding: {
                      description: "ExternalAccountBinding is a reference to a CA external account of the ACME\nserver.\nIf set, upon registration cert-manager will attempt to associate the given\nexternal account credentials with the registered ACME account.",
                      properties: {
                        keyAlgorithm: {
                          description: "Deprecated: keyAlgorithm field exists for historical compatibility\nreasons and should not be used. The algorithm is now hardcoded to HS256\nin golang/x/crypto/acme.",
                          enum: ["HS256", "HS384", "HS512"],
                          type: "string"
                        },
                        keyID: {
                          description: "keyID is the ID of the CA key that the External Account is bound to.",
                          type: "string"
                        },
                        keySecretRef: {
                          description: "keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes\nSecret which holds the symmetric MAC key of the External Account Binding.\nThe `key` is the index string that is paired with the key data in the\nSecret and should not be confused with the key data itself, or indeed with\nthe External Account Binding keyID above.\nThe secret key stored in the Secret **must** be un-padded, base64 URL\nencoded data.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        }
                      },
                      required: ["keyID", "keySecretRef"],
                      type: "object"
                    },
                    preferredChain: {
                      description: "PreferredChain is the chain to use if the ACME server outputs multiple.\nPreferredChain is no guarantee that this one gets delivered by the ACME\nendpoint.\nFor example, for Let's Encrypt's DST crosssign you would use:\n\"DST Root CA X3\" or \"ISRG Root X1\" for the newer Let's Encrypt root CA.\nThis value picks the first certificate bundle in the combined set of\nACME default and alternative chains that has a root-most certificate with\nthis value as its issuer's commonname.",
                      maxLength: 64,
                      type: "string"
                    },
                    privateKeySecretRef: {
                      description: "PrivateKey is the name of a Kubernetes Secret resource that will be used to\nstore the automatically generated ACME account private key.\nOptionally, a `key` may be specified to select a specific entry within\nthe named Secret resource.\nIf `key` is not specified, a default of `tls.key` will be used.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    server: {
                      description: "Server is the URL used to access the ACME server's 'directory' endpoint.\nFor example, for Let's Encrypt's staging endpoint, you would use:\n\"https://acme-staging-v02.api.letsencrypt.org/directory\".\nOnly ACME v2 endpoints (i.e. RFC 8555) are supported.",
                      type: "string"
                    },
                    skipTLSVerify: {
                      description: "INSECURE: Enables or disables validation of the ACME server TLS certificate.\nIf true, requests to the ACME server will not have the TLS certificate chain\nvalidated.\nMutually exclusive with CABundle; prefer using CABundle to prevent various\nkinds of security vulnerabilities.\nOnly enable this option in development environments.\nIf CABundle and SkipTLSVerify are unset, the system certificate bundle inside\nthe container is used to validate the TLS connection.\nDefaults to false.",
                      type: "boolean"
                    },
                    solvers: {
                      description: "Solvers is a list of challenge solvers that will be used to solve\nACME challenges for the matching domains.\nSolver configurations must be provided in order to obtain certificates\nfrom an ACME server.\nFor more information, see: https://cert-manager.io/docs/configuration/acme/",
                      items: {
                        description: "An ACMEChallengeSolver describes how to solve ACME challenges for the issuer it is part of.\nA selector may be provided to use different solving strategies for different DNS names.\nOnly one of HTTP01 or DNS01 must be provided.",
                        properties: {
                          dns01: {
                            description: "Configures cert-manager to attempt to complete authorizations by\nperforming the DNS01 challenge flow.",
                            properties: {
                              acmeDNS: {
                                description: "Use the 'ACME DNS' (https://github.com/joohoi/acme-dns) API to manage\nDNS01 challenge records.",
                                properties: {
                                  accountSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  host: {
                                    type: "string"
                                  }
                                },
                                required: ["accountSecretRef", "host"],
                                type: "object"
                              },
                              akamai: {
                                description: "Use the Akamai DNS zone management API to manage DNS01 challenge records.",
                                properties: {
                                  accessTokenSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  clientSecretSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  clientTokenSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  serviceConsumerDomain: {
                                    type: "string"
                                  }
                                },
                                required: ["accessTokenSecretRef", "clientSecretSecretRef", "clientTokenSecretRef", "serviceConsumerDomain"],
                                type: "object"
                              },
                              azureDNS: {
                                description: "Use the Microsoft Azure DNS API to manage DNS01 challenge records.",
                                properties: {
                                  clientID: {
                                    description: "Auth: Azure Service Principal:\nThe ClientID of the Azure Service Principal used to authenticate with Azure DNS.\nIf set, ClientSecret and TenantID must also be set.",
                                    type: "string"
                                  },
                                  clientSecretSecretRef: {
                                    description: "Auth: Azure Service Principal:\nA reference to a Secret containing the password associated with the Service Principal.\nIf set, ClientID and TenantID must also be set.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  environment: {
                                    description: "name of the Azure environment (default AzurePublicCloud)",
                                    enum: ["AzurePublicCloud", "AzureChinaCloud", "AzureGermanCloud", "AzureUSGovernmentCloud"],
                                    type: "string"
                                  },
                                  hostedZoneName: {
                                    description: "name of the DNS zone that should be used",
                                    type: "string"
                                  },
                                  managedIdentity: {
                                    description: "Auth: Azure Workload Identity or Azure Managed Service Identity:\nSettings to enable Azure Workload Identity or Azure Managed Service Identity\nIf set, ClientID, ClientSecret and TenantID must not be set.",
                                    properties: {
                                      clientID: {
                                        description: "client ID of the managed identity, can not be used at the same time as resourceID",
                                        type: "string"
                                      },
                                      resourceID: {
                                        description: "resource ID of the managed identity, can not be used at the same time as clientID\nCannot be used for Azure Managed Service Identity",
                                        type: "string"
                                      },
                                      tenantID: {
                                        description: "tenant ID of the managed identity, can not be used at the same time as resourceID",
                                        type: "string"
                                      }
                                    },
                                    type: "object"
                                  },
                                  resourceGroupName: {
                                    description: "resource group the DNS zone is located in",
                                    type: "string"
                                  },
                                  subscriptionID: {
                                    description: "ID of the Azure subscription",
                                    type: "string"
                                  },
                                  tenantID: {
                                    description: "Auth: Azure Service Principal:\nThe TenantID of the Azure Service Principal used to authenticate with Azure DNS.\nIf set, ClientID and ClientSecret must also be set.",
                                    type: "string"
                                  }
                                },
                                required: ["resourceGroupName", "subscriptionID"],
                                type: "object"
                              },
                              cloudDNS: {
                                description: "Use the Google Cloud DNS API to manage DNS01 challenge records.",
                                properties: {
                                  hostedZoneName: {
                                    description: "HostedZoneName is an optional field that tells cert-manager in which\nCloud DNS zone the challenge record has to be created.\nIf left empty cert-manager will automatically choose a zone.",
                                    type: "string"
                                  },
                                  project: {
                                    type: "string"
                                  },
                                  serviceAccountSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                required: ["project"],
                                type: "object"
                              },
                              cloudflare: {
                                description: "Use the Cloudflare API to manage DNS01 challenge records.",
                                properties: {
                                  apiKeySecretRef: {
                                    description: "API key to use to authenticate with Cloudflare.\nNote: using an API token to authenticate is now the recommended method\nas it allows greater control of permissions.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  apiTokenSecretRef: {
                                    description: "API token used to authenticate with Cloudflare.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  email: {
                                    description: "Email of the account, only required when using API key based authentication.",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              },
                              cnameStrategy: {
                                description: "CNAMEStrategy configures how the DNS01 provider should handle CNAME\nrecords when found in DNS zones.",
                                enum: ["None", "Follow"],
                                type: "string"
                              },
                              digitalocean: {
                                description: "Use the DigitalOcean DNS API to manage DNS01 challenge records.",
                                properties: {
                                  tokenSecretRef: {
                                    description: "A reference to a specific 'key' within a Secret resource.\nIn some instances, `key` is a required field.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                required: ["tokenSecretRef"],
                                type: "object"
                              },
                              rfc2136: {
                                description: "Use RFC2136 (\"Dynamic Updates in the Domain Name System\") (https://datatracker.ietf.org/doc/rfc2136/)\nto manage DNS01 challenge records.",
                                properties: {
                                  nameserver: {
                                    description: "The IP address or hostname of an authoritative DNS server supporting\nRFC2136 in the form host:port. If the host is an IPv6 address it must be\nenclosed in square brackets (e.g [2001:db8::1])\xA0; port is optional.\nThis field is required.",
                                    type: "string"
                                  },
                                  tsigAlgorithm: {
                                    description: "The TSIG Algorithm configured in the DNS supporting RFC2136. Used only\nwhen ``tsigSecretSecretRef`` and ``tsigKeyName`` are defined.\nSupported values are (case-insensitive): ``HMACMD5`` (default),\n``HMACSHA1``, ``HMACSHA256`` or ``HMACSHA512``.",
                                    type: "string"
                                  },
                                  tsigKeyName: {
                                    description: "The TSIG Key name configured in the DNS.\nIf ``tsigSecretSecretRef`` is defined, this field is required.",
                                    type: "string"
                                  },
                                  tsigSecretSecretRef: {
                                    description: "The name of the secret containing the TSIG value.\nIf ``tsigKeyName`` is defined, this field is required.",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                required: ["nameserver"],
                                type: "object"
                              },
                              route53: {
                                description: "Use the AWS Route53 API to manage DNS01 challenge records.",
                                properties: {
                                  accessKeyID: {
                                    description: "The AccessKeyID is used for authentication.\nCannot be set when SecretAccessKeyID is set.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                                    type: "string"
                                  },
                                  accessKeyIDSecretRef: {
                                    description: "The SecretAccessKey is used for authentication. If set, pull the AWS\naccess key ID from a key within a Kubernetes Secret.\nCannot be set when AccessKeyID is set.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  },
                                  auth: {
                                    description: "Auth configures how cert-manager authenticates.",
                                    properties: {
                                      kubernetes: {
                                        description: "Kubernetes authenticates with Route53 using AssumeRoleWithWebIdentity\nby passing a bound ServiceAccount token.",
                                        properties: {
                                          serviceAccountRef: {
                                            description: "A reference to a service account that will be used to request a bound\ntoken (also known as \"projected token\"). To use this field, you must\nconfigure an RBAC rule to let cert-manager request a token.",
                                            properties: {
                                              audiences: {
                                                description: "TokenAudiences is an optional list of audiences to include in the\ntoken passed to AWS. The default token consisting of the issuer's namespace\nand name is always included.\nIf unset the audience defaults to `sts.amazonaws.com`.",
                                                items: {
                                                  type: "string"
                                                },
                                                type: "array"
                                              },
                                              name: {
                                                description: "Name of the ServiceAccount used to request a token.",
                                                type: "string"
                                              }
                                            },
                                            required: ["name"],
                                            type: "object"
                                          }
                                        },
                                        required: ["serviceAccountRef"],
                                        type: "object"
                                      }
                                    },
                                    required: ["kubernetes"],
                                    type: "object"
                                  },
                                  hostedZoneID: {
                                    description: "If set, the provider will manage only this zone in Route53 and will not do a lookup using the route53:ListHostedZonesByName api call.",
                                    type: "string"
                                  },
                                  region: {
                                    description: "Override the AWS region.\n\nRoute53 is a global service and does not have regional endpoints but the\nregion specified here (or via environment variables) is used as a hint to\nhelp compute the correct AWS credential scope and partition when it\nconnects to Route53. See:\n- [Amazon Route 53 endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/r53.html)\n- [Global services](https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html)\n\nIf you omit this region field, cert-manager will use the region from\nAWS_REGION and AWS_DEFAULT_REGION environment variables, if they are set\nin the cert-manager controller Pod.\n\nThe `region` field is not needed if you use [IAM Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html).\nInstead an AWS_REGION environment variable is added to the cert-manager controller Pod by:\n[Amazon EKS Pod Identity Webhook](https://github.com/aws/amazon-eks-pod-identity-webhook).\nIn this case this `region` field value is ignored.\n\nThe `region` field is not needed if you use [EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html).\nInstead an AWS_REGION environment variable is added to the cert-manager controller Pod by:\n[Amazon EKS Pod Identity Agent](https://github.com/aws/eks-pod-identity-agent),\nIn this case this `region` field value is ignored.",
                                    type: "string"
                                  },
                                  role: {
                                    description: "Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey\nor the inferred credentials from environment variables, shared credentials file or AWS Instance metadata",
                                    type: "string"
                                  },
                                  secretAccessKeySecretRef: {
                                    description: "The SecretAccessKey is used for authentication.\nIf neither the Access Key nor Key ID are set, we fall-back to using env\nvars, shared credentials file or AWS Instance metadata,\nsee: https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials",
                                    properties: {
                                      key: {
                                        description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                        type: "string"
                                      },
                                      name: {
                                        description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                        type: "string"
                                      }
                                    },
                                    required: ["name"],
                                    type: "object"
                                  }
                                },
                                type: "object"
                              },
                              webhook: {
                                description: "Configure an external webhook based DNS01 challenge solver to manage\nDNS01 challenge records.",
                                properties: {
                                  config: {
                                    description: "Additional configuration that should be passed to the webhook apiserver\nwhen challenges are processed.\nThis can contain arbitrary JSON data.\nSecret values should not be specified in this stanza.\nIf secret values are needed (e.g. credentials for a DNS service), you\nshould use a SecretKeySelector to reference a Secret resource.\nFor details on the schema of this field, consult the webhook provider\nimplementation's documentation.",
                                    "x-kubernetes-preserve-unknown-fields": true
                                  },
                                  groupName: {
                                    description: "The API group name that should be used when POSTing ChallengePayload\nresources to the webhook apiserver.\nThis should be the same as the GroupName specified in the webhook\nprovider implementation.",
                                    type: "string"
                                  },
                                  solverName: {
                                    description: "The name of the solver to use, as defined in the webhook provider\nimplementation.\nThis will typically be the name of the provider, e.g. 'cloudflare'.",
                                    type: "string"
                                  }
                                },
                                required: ["groupName", "solverName"],
                                type: "object"
                              }
                            },
                            type: "object"
                          },
                          http01: {
                            description: "Configures cert-manager to attempt to complete authorizations by\nperforming the HTTP01 challenge flow.\nIt is not possible to obtain certificates for wildcard domain names\n(e.g. `*.example.com`) using the HTTP01 challenge mechanism.",
                            properties: {
                              gatewayHTTPRoute: {
                                description: "The Gateway API is a sig-network community API that models service networking\nin Kubernetes (https://gateway-api.sigs.k8s.io/). The Gateway solver will\ncreate HTTPRoutes with the specified labels in the same namespace as the challenge.\nThis solver is experimental, and fields / behaviour may change in the future.",
                                properties: {
                                  labels: {
                                    additionalProperties: {
                                      type: "string"
                                    },
                                    description: "Custom labels that will be applied to HTTPRoutes created by cert-manager\nwhile solving HTTP-01 challenges.",
                                    type: "object"
                                  },
                                  parentRefs: {
                                    description: "When solving an HTTP-01 challenge, cert-manager creates an HTTPRoute.\ncert-manager needs to know which parentRefs should be used when creating\nthe HTTPRoute. Usually, the parentRef references a Gateway. See:\nhttps://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways",
                                    items: {
                                      description: "ParentReference identifies an API object (usually a Gateway) that can be considered\na parent of this resource (usually a route). There are two kinds of parent resources\nwith \"Core\" support:\n\n* Gateway (Gateway conformance profile)\n* Service (Mesh conformance profile, ClusterIP Services only)\n\nThis API may be extended in the future to support additional kinds of parent\nresources.\n\nThe API object must be valid in the cluster; the Group and Kind must\nbe registered in the cluster for this reference to be valid.",
                                      properties: {
                                        group: {
                                          default: "gateway.networking.k8s.io",
                                          description: "Group is the group of the referent.\nWhen unspecified, \"gateway.networking.k8s.io\" is inferred.\nTo set the core API group (such as for a \"Service\" kind referent),\nGroup must be explicitly set to \"\" (empty string).\n\nSupport: Core",
                                          maxLength: 253,
                                          pattern: "^$|^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
                                          type: "string"
                                        },
                                        kind: {
                                          default: "Gateway",
                                          description: "Kind is kind of the referent.\n\nThere are two kinds of parent resources with \"Core\" support:\n\n* Gateway (Gateway conformance profile)\n* Service (Mesh conformance profile, ClusterIP Services only)\n\nSupport for other resources is Implementation-Specific.",
                                          maxLength: 63,
                                          minLength: 1,
                                          pattern: "^[a-zA-Z]([-a-zA-Z0-9]*[a-zA-Z0-9])?$",
                                          type: "string"
                                        },
                                        name: {
                                          description: "Name is the name of the referent.\n\nSupport: Core",
                                          maxLength: 253,
                                          minLength: 1,
                                          type: "string"
                                        },
                                        namespace: {
                                          description: "Namespace is the namespace of the referent. When unspecified, this refers\nto the local namespace of the Route.\n\nNote that there are specific rules for ParentRefs which cross namespace\nboundaries. Cross-namespace references are only valid if they are explicitly\nallowed by something in the namespace they are referring to. For example:\nGateway has the AllowedRoutes field, and ReferenceGrant provides a\ngeneric way to enable any other kind of cross-namespace reference.\n\n<gateway:experimental:description>\nParentRefs from a Route to a Service in the same namespace are \"producer\"\nroutes, which apply default routing rules to inbound connections from\nany namespace to the Service.\n\nParentRefs from a Route to a Service in a different namespace are\n\"consumer\" routes, and these routing rules are only applied to outbound\nconnections originating from the same namespace as the Route, for which\nthe intended destination of the connections are a Service targeted as a\nParentRef of the Route.\n</gateway:experimental:description>\n\nSupport: Core",
                                          maxLength: 63,
                                          minLength: 1,
                                          pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
                                          type: "string"
                                        },
                                        port: {
                                          description: "Port is the network port this Route targets. It can be interpreted\ndifferently based on the type of parent resource.\n\nWhen the parent resource is a Gateway, this targets all listeners\nlistening on the specified port that also support this kind of Route(and\nselect this Route). It's not recommended to set `Port` unless the\nnetworking behaviors specified in a Route must apply to a specific port\nas opposed to a listener(s) whose port(s) may be changed. When both Port\nand SectionName are specified, the name and port of the selected listener\nmust match both specified values.\n\n<gateway:experimental:description>\nWhen the parent resource is a Service, this targets a specific port in the\nService spec. When both Port (experimental) and SectionName are specified,\nthe name and port of the selected port must match both specified values.\n</gateway:experimental:description>\n\nImplementations MAY choose to support other parent resources.\nImplementations supporting other types of parent resources MUST clearly\ndocument how/if Port is interpreted.\n\nFor the purpose of status, an attachment is considered successful as\nlong as the parent resource accepts it partially. For example, Gateway\nlisteners can restrict which Routes can attach to them by Route kind,\nnamespace, or hostname. If 1 of 2 Gateway listeners accept attachment\nfrom the referencing Route, the Route MUST be considered successfully\nattached. If no Gateway listeners accept attachment from this Route,\nthe Route MUST be considered detached from the Gateway.\n\nSupport: Extended",
                                          format: "int32",
                                          maximum: 65535,
                                          minimum: 1,
                                          type: "integer"
                                        },
                                        sectionName: {
                                          description: "SectionName is the name of a section within the target resource. In the\nfollowing resources, SectionName is interpreted as the following:\n\n* Gateway: Listener name. When both Port (experimental) and SectionName\nare specified, the name and port of the selected listener must match\nboth specified values.\n* Service: Port name. When both Port (experimental) and SectionName\nare specified, the name and port of the selected listener must match\nboth specified values.\n\nImplementations MAY choose to support attaching Routes to other resources.\nIf that is the case, they MUST clearly document how SectionName is\ninterpreted.\n\nWhen unspecified (empty string), this will reference the entire resource.\nFor the purpose of status, an attachment is considered successful if at\nleast one section in the parent resource accepts it. For example, Gateway\nlisteners can restrict which Routes can attach to them by Route kind,\nnamespace, or hostname. If 1 of 2 Gateway listeners accept attachment from\nthe referencing Route, the Route MUST be considered successfully\nattached. If no Gateway listeners accept attachment from this Route, the\nRoute MUST be considered detached from the Gateway.\n\nSupport: Core",
                                          maxLength: 253,
                                          minLength: 1,
                                          pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$",
                                          type: "string"
                                        }
                                      },
                                      required: ["name"],
                                      type: "object"
                                    },
                                    type: "array"
                                  },
                                  podTemplate: {
                                    description: "Optional pod template used to configure the ACME challenge solver pods\nused for HTTP01 challenges.",
                                    properties: {
                                      metadata: {
                                        description: "ObjectMeta overrides for the pod used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                        properties: {
                                          annotations: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Annotations that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          },
                                          labels: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Labels that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          }
                                        },
                                        type: "object"
                                      },
                                      spec: {
                                        description: "PodSpec defines overrides for the HTTP01 challenge solver pod.\nCheck ACMEChallengeSolverHTTP01IngressPodSpec to find out currently supported fields.\nAll other fields will be ignored.",
                                        properties: {
                                          affinity: {
                                            description: "If specified, the pod's scheduling constraints",
                                            properties: {
                                              nodeAffinity: {
                                                description: "Describes node affinity scheduling rules for the pod.",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node matches the corresponding matchExpressions; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "An empty preferred scheduling term matches all objects with implicit weight 0\n(i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
                                                      properties: {
                                                        preference: {
                                                          description: "A node selector term, associated with the corresponding weight.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        weight: {
                                                          description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["preference", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to an update), the system\nmay or may not try to eventually evict the pod from its node.",
                                                    properties: {
                                                      nodeSelectorTerms: {
                                                        description: "Required. A list of node selector terms. The terms are ORed.",
                                                        items: {
                                                          description: "A null or empty node selector term matches no objects. The requirements of\nthem are ANDed.\nThe TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    required: ["nodeSelectorTerms"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAffinity: {
                                                description: "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAntiAffinity: {
                                                description: "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe anti-affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling anti-affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the anti-affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the anti-affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              }
                                            },
                                            type: "object"
                                          },
                                          imagePullSecrets: {
                                            description: "If specified, the pod's imagePullSecrets",
                                            items: {
                                              description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                                              properties: {
                                                name: {
                                                  default: "",
                                                  description: "Name of the referent.\nThis field is effectively required, but due to backwards compatibility is\nallowed to be empty. Instances of this type with an empty value here are\nalmost certainly wrong.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                                  type: "string"
                                                }
                                              },
                                              type: "object",
                                              "x-kubernetes-map-type": "atomic"
                                            },
                                            type: "array"
                                          },
                                          nodeSelector: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "NodeSelector is a selector which must be true for the pod to fit on a node.\nSelector which must match a node's labels for the pod to be scheduled on that node.\nMore info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
                                            type: "object"
                                          },
                                          priorityClassName: {
                                            description: "If specified, the pod's priorityClassName.",
                                            type: "string"
                                          },
                                          securityContext: {
                                            description: "If specified, the pod's security context",
                                            properties: {
                                              fsGroup: {
                                                description: "A special supplemental group that applies to all containers in a pod.\nSome volume types allow the Kubelet to change the ownership of that volume\nto be owned by the pod:\n\n1. The owning GID will be the FSGroup\n2. The setgid bit is set (new files created in the volume will be owned by FSGroup)\n3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              fsGroupChangePolicy: {
                                                description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume\nbefore being exposed inside Pod. This field will only apply to\nvolume types which support fsGroup based ownership(and permissions).\nIt will have no effect on ephemeral volume types such as: secret, configmaps\nand emptydir.\nValid values are \"OnRootMismatch\" and \"Always\". If not specified, \"Always\" is used.\nNote that this field cannot be set when spec.os.name is windows.",
                                                type: "string"
                                              },
                                              runAsGroup: {
                                                description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              runAsNonRoot: {
                                                description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                                type: "boolean"
                                              },
                                              runAsUser: {
                                                description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              seccompProfile: {
                                                description: "The seccomp options to use by the containers in this pod.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  localhostProfile: {
                                                    description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["type"],
                                                type: "object"
                                              },
                                              seLinuxOptions: {
                                                description: "The SELinux context to be applied to all containers.\nIf unspecified, the container runtime will allocate a random SELinux context for each\ncontainer.  May also be set in SecurityContext.  If set in\nboth SecurityContext and PodSecurityContext, the value specified in SecurityContext\ntakes precedence for that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  level: {
                                                    description: "Level is SELinux level label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  role: {
                                                    description: "Role is a SELinux role label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "Type is a SELinux type label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  user: {
                                                    description: "User is a SELinux user label that applies to the container.",
                                                    type: "string"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              supplementalGroups: {
                                                description: "A list of groups applied to the first process run in each container, in addition\nto the container's primary GID, the fsGroup (if specified), and group memberships\ndefined in the container image for the uid of the container process. If unspecified,\nno additional groups are added to any container. Note that group memberships\ndefined in the container image for the uid of the container process are still effective,\neven if they are not included in this list.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                type: "array"
                                              },
                                              sysctls: {
                                                description: "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported\nsysctls (by the container runtime) might fail to launch.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  description: "Sysctl defines a kernel parameter to be set",
                                                  properties: {
                                                    name: {
                                                      description: "Name of a property to set",
                                                      type: "string"
                                                    },
                                                    value: {
                                                      description: "Value of a property to set",
                                                      type: "string"
                                                    }
                                                  },
                                                  required: ["name", "value"],
                                                  type: "object"
                                                },
                                                type: "array"
                                              }
                                            },
                                            type: "object"
                                          },
                                          serviceAccountName: {
                                            description: "If specified, the pod's service account",
                                            type: "string"
                                          },
                                          tolerations: {
                                            description: "If specified, the pod's tolerations.",
                                            items: {
                                              description: "The pod this Toleration is attached to tolerates any taint that matches\nthe triple <key,value,effect> using the matching operator <operator>.",
                                              properties: {
                                                effect: {
                                                  description: "Effect indicates the taint effect to match. Empty means match all taint effects.\nWhen specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
                                                  type: "string"
                                                },
                                                key: {
                                                  description: "Key is the taint key that the toleration applies to. Empty means match all taint keys.\nIf the key is empty, operator must be Exists; this combination means to match all values and all keys.",
                                                  type: "string"
                                                },
                                                operator: {
                                                  description: "Operator represents a key's relationship to the value.\nValid operators are Exists and Equal. Defaults to Equal.\nExists is equivalent to wildcard for value, so that a pod can\ntolerate all taints of a particular category.",
                                                  type: "string"
                                                },
                                                tolerationSeconds: {
                                                  description: "TolerationSeconds represents the period of time the toleration (which must be\nof effect NoExecute, otherwise this field is ignored) tolerates the taint. By default,\nit is not set, which means tolerate the taint forever (do not evict). Zero and\nnegative values will be treated as 0 (evict immediately) by the system.",
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                value: {
                                                  description: "Value is the taint value the toleration matches to.\nIf the operator is Exists, the value should be empty, otherwise just a regular string.",
                                                  type: "string"
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
                                  },
                                  serviceType: {
                                    description: "Optional service type for Kubernetes solver service. Supported values\nare NodePort or ClusterIP. If unset, defaults to NodePort.",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              },
                              ingress: {
                                description: "The ingress based HTTP01 challenge solver will solve challenges by\ncreating or modifying Ingress resources in order to route requests for\n'/.well-known/acme-challenge/XYZ' to 'challenge solver' pods that are\nprovisioned by cert-manager for each Challenge to be completed.",
                                properties: {
                                  class: {
                                    description: "This field configures the annotation `kubernetes.io/ingress.class` when\ncreating Ingress resources to solve ACME challenges that use this\nchallenge solver. Only one of `class`, `name` or `ingressClassName` may\nbe specified.",
                                    type: "string"
                                  },
                                  ingressClassName: {
                                    description: "This field configures the field `ingressClassName` on the created Ingress\nresources used to solve ACME challenges that use this challenge solver.\nThis is the recommended way of configuring the ingress class. Only one of\n`class`, `name` or `ingressClassName` may be specified.",
                                    type: "string"
                                  },
                                  ingressTemplate: {
                                    description: "Optional ingress template used to configure the ACME challenge solver\ningress used for HTTP01 challenges.",
                                    properties: {
                                      metadata: {
                                        description: "ObjectMeta overrides for the ingress used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                        properties: {
                                          annotations: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Annotations that should be added to the created ACME HTTP01 solver ingress.",
                                            type: "object"
                                          },
                                          labels: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Labels that should be added to the created ACME HTTP01 solver ingress.",
                                            type: "object"
                                          }
                                        },
                                        type: "object"
                                      }
                                    },
                                    type: "object"
                                  },
                                  name: {
                                    description: "The name of the ingress resource that should have ACME challenge solving\nroutes inserted into it in order to solve HTTP01 challenges.\nThis is typically used in conjunction with ingress controllers like\ningress-gce, which maintains a 1:1 mapping between external IPs and\ningress resources. Only one of `class`, `name` or `ingressClassName` may\nbe specified.",
                                    type: "string"
                                  },
                                  podTemplate: {
                                    description: "Optional pod template used to configure the ACME challenge solver pods\nused for HTTP01 challenges.",
                                    properties: {
                                      metadata: {
                                        description: "ObjectMeta overrides for the pod used to solve HTTP01 challenges.\nOnly the 'labels' and 'annotations' fields may be set.\nIf labels or annotations overlap with in-built values, the values here\nwill override the in-built values.",
                                        properties: {
                                          annotations: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Annotations that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          },
                                          labels: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "Labels that should be added to the created ACME HTTP01 solver pods.",
                                            type: "object"
                                          }
                                        },
                                        type: "object"
                                      },
                                      spec: {
                                        description: "PodSpec defines overrides for the HTTP01 challenge solver pod.\nCheck ACMEChallengeSolverHTTP01IngressPodSpec to find out currently supported fields.\nAll other fields will be ignored.",
                                        properties: {
                                          affinity: {
                                            description: "If specified, the pod's scheduling constraints",
                                            properties: {
                                              nodeAffinity: {
                                                description: "Describes node affinity scheduling rules for the pod.",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node matches the corresponding matchExpressions; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "An empty preferred scheduling term matches all objects with implicit weight 0\n(i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
                                                      properties: {
                                                        preference: {
                                                          description: "A node selector term, associated with the corresponding weight.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        weight: {
                                                          description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["preference", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to an update), the system\nmay or may not try to eventually evict the pod from its node.",
                                                    properties: {
                                                      nodeSelectorTerms: {
                                                        description: "Required. A list of node selector terms. The terms are ORed.",
                                                        items: {
                                                          description: "A null or empty node selector term matches no objects. The requirements of\nthem are ANDed.\nThe TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "A list of node selector requirements by node's labels.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchFields: {
                                                              description: "A list of node selector requirements by node's fields.",
                                                              items: {
                                                                description: "A node selector requirement is a selector that contains values, a key, and an operator\nthat relates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "The label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "Represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "An array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. If the operator is Gt or Lt, the values\narray must have a single element, which will be interpreted as an integer.\nThis array is replaced during a strategic merge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        type: "array",
                                                        "x-kubernetes-list-type": "atomic"
                                                      }
                                                    },
                                                    required: ["nodeSelectorTerms"],
                                                    type: "object",
                                                    "x-kubernetes-map-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAffinity: {
                                                description: "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              podAntiAffinity: {
                                                description: "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
                                                properties: {
                                                  preferredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "The scheduler will prefer to schedule pods to nodes that satisfy\nthe anti-affinity expressions specified by this field, but it may choose\na node that violates one or more of the expressions. The node that is\nmost preferred is the one with the greatest sum of weights, i.e.\nfor each node that meets all of the scheduling requirements (resource\nrequest, requiredDuringScheduling anti-affinity expressions, etc.),\ncompute a sum by iterating through the elements of this field and adding\n\"weight\" to the sum if the node has pods which matches the corresponding podAffinityTerm; the\nnode(s) with the highest sum are the most preferred.",
                                                    items: {
                                                      description: "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
                                                      properties: {
                                                        podAffinityTerm: {
                                                          description: "Required. A pod affinity term, associated with the corresponding weight.",
                                                          properties: {
                                                            labelSelector: {
                                                              description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            matchLabelKeys: {
                                                              description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            mismatchLabelKeys: {
                                                              description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaces: {
                                                              description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                              items: {
                                                                type: "string"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            namespaceSelector: {
                                                              description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                              properties: {
                                                                matchExpressions: {
                                                                  description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                                  items: {
                                                                    description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                    properties: {
                                                                      key: {
                                                                        description: "key is the label key that the selector applies to.",
                                                                        type: "string"
                                                                      },
                                                                      operator: {
                                                                        description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                        type: "string"
                                                                      },
                                                                      values: {
                                                                        description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                        items: {
                                                                          type: "string"
                                                                        },
                                                                        type: "array",
                                                                        "x-kubernetes-list-type": "atomic"
                                                                      }
                                                                    },
                                                                    required: ["key", "operator"],
                                                                    type: "object"
                                                                  },
                                                                  type: "array",
                                                                  "x-kubernetes-list-type": "atomic"
                                                                },
                                                                matchLabels: {
                                                                  additionalProperties: {
                                                                    type: "string"
                                                                  },
                                                                  description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                                  type: "object"
                                                                }
                                                              },
                                                              type: "object",
                                                              "x-kubernetes-map-type": "atomic"
                                                            },
                                                            topologyKey: {
                                                              description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                              type: "string"
                                                            }
                                                          },
                                                          required: ["topologyKey"],
                                                          type: "object"
                                                        },
                                                        weight: {
                                                          description: "weight associated with matching the corresponding podAffinityTerm,\nin the range 1-100.",
                                                          format: "int32",
                                                          type: "integer"
                                                        }
                                                      },
                                                      required: ["podAffinityTerm", "weight"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  },
                                                  requiredDuringSchedulingIgnoredDuringExecution: {
                                                    description: "If the anti-affinity requirements specified by this field are not met at\nscheduling time, the pod will not be scheduled onto the node.\nIf the anti-affinity requirements specified by this field cease to be met\nat some point during pod execution (e.g. due to a pod label update), the\nsystem may or may not try to eventually evict the pod from its node.\nWhen there are multiple elements, the lists of nodes corresponding to each\npodAffinityTerm are intersected, i.e. all terms must be satisfied.",
                                                    items: {
                                                      description: "Defines a set of pods (namely those matching the labelSelector\nrelative to the given namespace(s)) that this pod should be\nco-located (affinity) or not co-located (anti-affinity) with,\nwhere co-located is defined as running on a node whose value of\nthe label with key <topologyKey> matches that of any node on which\na pod of the set of pods is running",
                                                      properties: {
                                                        labelSelector: {
                                                          description: "A label query over a set of resources, in this case pods.\nIf it's null, this PodAffinityTerm matches with no Pods.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        matchLabelKeys: {
                                                          description: "MatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key in (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both matchLabelKeys and labelSelector.\nAlso, matchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        mismatchLabelKeys: {
                                                          description: "MismatchLabelKeys is a set of pod label keys to select which pods will\nbe taken into consideration. The keys are used to lookup values from the\nincoming pod labels, those key-value labels are merged with `labelSelector` as `key notin (value)`\nto select the group of existing pods which pods will be taken into consideration\nfor the incoming pod's pod (anti) affinity. Keys that don't exist in the incoming\npod labels will be ignored. The default value is empty.\nThe same key is forbidden to exist in both mismatchLabelKeys and labelSelector.\nAlso, mismatchLabelKeys cannot be set when labelSelector isn't set.\nThis is a beta field and requires enabling MatchLabelKeysInPodAffinity feature gate (enabled by default).",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaces: {
                                                          description: "namespaces specifies a static list of namespace names that the term applies to.\nThe term is applied to the union of the namespaces listed in this field\nand the ones selected by namespaceSelector.\nnull or empty namespaces list and null namespaceSelector means \"this pod's namespace\".",
                                                          items: {
                                                            type: "string"
                                                          },
                                                          type: "array",
                                                          "x-kubernetes-list-type": "atomic"
                                                        },
                                                        namespaceSelector: {
                                                          description: "A label query over the set of namespaces that the term applies to.\nThe term is applied to the union of the namespaces selected by this field\nand the ones listed in the namespaces field.\nnull selector and null or empty namespaces list means \"this pod's namespace\".\nAn empty selector ({}) matches all namespaces.",
                                                          properties: {
                                                            matchExpressions: {
                                                              description: "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
                                                              items: {
                                                                description: "A label selector requirement is a selector that contains values, a key, and an operator that\nrelates the key and values.",
                                                                properties: {
                                                                  key: {
                                                                    description: "key is the label key that the selector applies to.",
                                                                    type: "string"
                                                                  },
                                                                  operator: {
                                                                    description: "operator represents a key's relationship to a set of values.\nValid operators are In, NotIn, Exists and DoesNotExist.",
                                                                    type: "string"
                                                                  },
                                                                  values: {
                                                                    description: "values is an array of string values. If the operator is In or NotIn,\nthe values array must be non-empty. If the operator is Exists or DoesNotExist,\nthe values array must be empty. This array is replaced during a strategic\nmerge patch.",
                                                                    items: {
                                                                      type: "string"
                                                                    },
                                                                    type: "array",
                                                                    "x-kubernetes-list-type": "atomic"
                                                                  }
                                                                },
                                                                required: ["key", "operator"],
                                                                type: "object"
                                                              },
                                                              type: "array",
                                                              "x-kubernetes-list-type": "atomic"
                                                            },
                                                            matchLabels: {
                                                              additionalProperties: {
                                                                type: "string"
                                                              },
                                                              description: "matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels\nmap is equivalent to an element of matchExpressions, whose key field is \"key\", the\noperator is \"In\", and the values array contains only \"value\". The requirements are ANDed.",
                                                              type: "object"
                                                            }
                                                          },
                                                          type: "object",
                                                          "x-kubernetes-map-type": "atomic"
                                                        },
                                                        topologyKey: {
                                                          description: "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching\nthe labelSelector in the specified namespaces, where co-located is defined as running on a node\nwhose value of the label with key topologyKey matches that of any node on which any of the\nselected pods is running.\nEmpty topologyKey is not allowed.",
                                                          type: "string"
                                                        }
                                                      },
                                                      required: ["topologyKey"],
                                                      type: "object"
                                                    },
                                                    type: "array",
                                                    "x-kubernetes-list-type": "atomic"
                                                  }
                                                },
                                                type: "object"
                                              }
                                            },
                                            type: "object"
                                          },
                                          imagePullSecrets: {
                                            description: "If specified, the pod's imagePullSecrets",
                                            items: {
                                              description: "LocalObjectReference contains enough information to let you locate the\nreferenced object inside the same namespace.",
                                              properties: {
                                                name: {
                                                  default: "",
                                                  description: "Name of the referent.\nThis field is effectively required, but due to backwards compatibility is\nallowed to be empty. Instances of this type with an empty value here are\nalmost certainly wrong.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                                  type: "string"
                                                }
                                              },
                                              type: "object",
                                              "x-kubernetes-map-type": "atomic"
                                            },
                                            type: "array"
                                          },
                                          nodeSelector: {
                                            additionalProperties: {
                                              type: "string"
                                            },
                                            description: "NodeSelector is a selector which must be true for the pod to fit on a node.\nSelector which must match a node's labels for the pod to be scheduled on that node.\nMore info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
                                            type: "object"
                                          },
                                          priorityClassName: {
                                            description: "If specified, the pod's priorityClassName.",
                                            type: "string"
                                          },
                                          securityContext: {
                                            description: "If specified, the pod's security context",
                                            properties: {
                                              fsGroup: {
                                                description: "A special supplemental group that applies to all containers in a pod.\nSome volume types allow the Kubelet to change the ownership of that volume\nto be owned by the pod:\n\n1. The owning GID will be the FSGroup\n2. The setgid bit is set (new files created in the volume will be owned by FSGroup)\n3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              fsGroupChangePolicy: {
                                                description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume\nbefore being exposed inside Pod. This field will only apply to\nvolume types which support fsGroup based ownership(and permissions).\nIt will have no effect on ephemeral volume types such as: secret, configmaps\nand emptydir.\nValid values are \"OnRootMismatch\" and \"Always\". If not specified, \"Always\" is used.\nNote that this field cannot be set when spec.os.name is windows.",
                                                type: "string"
                                              },
                                              runAsGroup: {
                                                description: "The GID to run the entrypoint of the container process.\nUses runtime default if unset.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              runAsNonRoot: {
                                                description: "Indicates that the container must run as a non-root user.\nIf true, the Kubelet will validate the image at runtime to ensure that it\ndoes not run as UID 0 (root) and fail to start the container if it does.\nIf unset or false, no such validation will be performed.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence.",
                                                type: "boolean"
                                              },
                                              runAsUser: {
                                                description: "The UID to run the entrypoint of the container process.\nDefaults to user specified in image metadata if unspecified.\nMay also be set in SecurityContext.  If set in both SecurityContext and\nPodSecurityContext, the value specified in SecurityContext takes precedence\nfor that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                format: "int64",
                                                type: "integer"
                                              },
                                              seccompProfile: {
                                                description: "The seccomp options to use by the containers in this pod.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  localhostProfile: {
                                                    description: "localhostProfile indicates a profile defined in a file on the node should be used.\nThe profile must be preconfigured on the node to work.\nMust be a descending path, relative to the kubelet's configured seccomp profile location.\nMust be set if type is \"Localhost\". Must NOT be set for any other type.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "type indicates which kind of seccomp profile will be applied.\nValid options are:\n\nLocalhost - a profile defined in a file on the node should be used.\nRuntimeDefault - the container runtime default profile should be used.\nUnconfined - no profile should be applied.",
                                                    type: "string"
                                                  }
                                                },
                                                required: ["type"],
                                                type: "object"
                                              },
                                              seLinuxOptions: {
                                                description: "The SELinux context to be applied to all containers.\nIf unspecified, the container runtime will allocate a random SELinux context for each\ncontainer.  May also be set in SecurityContext.  If set in\nboth SecurityContext and PodSecurityContext, the value specified in SecurityContext\ntakes precedence for that container.\nNote that this field cannot be set when spec.os.name is windows.",
                                                properties: {
                                                  level: {
                                                    description: "Level is SELinux level label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  role: {
                                                    description: "Role is a SELinux role label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  type: {
                                                    description: "Type is a SELinux type label that applies to the container.",
                                                    type: "string"
                                                  },
                                                  user: {
                                                    description: "User is a SELinux user label that applies to the container.",
                                                    type: "string"
                                                  }
                                                },
                                                type: "object"
                                              },
                                              supplementalGroups: {
                                                description: "A list of groups applied to the first process run in each container, in addition\nto the container's primary GID, the fsGroup (if specified), and group memberships\ndefined in the container image for the uid of the container process. If unspecified,\nno additional groups are added to any container. Note that group memberships\ndefined in the container image for the uid of the container process are still effective,\neven if they are not included in this list.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                type: "array"
                                              },
                                              sysctls: {
                                                description: "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported\nsysctls (by the container runtime) might fail to launch.\nNote that this field cannot be set when spec.os.name is windows.",
                                                items: {
                                                  description: "Sysctl defines a kernel parameter to be set",
                                                  properties: {
                                                    name: {
                                                      description: "Name of a property to set",
                                                      type: "string"
                                                    },
                                                    value: {
                                                      description: "Value of a property to set",
                                                      type: "string"
                                                    }
                                                  },
                                                  required: ["name", "value"],
                                                  type: "object"
                                                },
                                                type: "array"
                                              }
                                            },
                                            type: "object"
                                          },
                                          serviceAccountName: {
                                            description: "If specified, the pod's service account",
                                            type: "string"
                                          },
                                          tolerations: {
                                            description: "If specified, the pod's tolerations.",
                                            items: {
                                              description: "The pod this Toleration is attached to tolerates any taint that matches\nthe triple <key,value,effect> using the matching operator <operator>.",
                                              properties: {
                                                effect: {
                                                  description: "Effect indicates the taint effect to match. Empty means match all taint effects.\nWhen specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
                                                  type: "string"
                                                },
                                                key: {
                                                  description: "Key is the taint key that the toleration applies to. Empty means match all taint keys.\nIf the key is empty, operator must be Exists; this combination means to match all values and all keys.",
                                                  type: "string"
                                                },
                                                operator: {
                                                  description: "Operator represents a key's relationship to the value.\nValid operators are Exists and Equal. Defaults to Equal.\nExists is equivalent to wildcard for value, so that a pod can\ntolerate all taints of a particular category.",
                                                  type: "string"
                                                },
                                                tolerationSeconds: {
                                                  description: "TolerationSeconds represents the period of time the toleration (which must be\nof effect NoExecute, otherwise this field is ignored) tolerates the taint. By default,\nit is not set, which means tolerate the taint forever (do not evict). Zero and\nnegative values will be treated as 0 (evict immediately) by the system.",
                                                  format: "int64",
                                                  type: "integer"
                                                },
                                                value: {
                                                  description: "Value is the taint value the toleration matches to.\nIf the operator is Exists, the value should be empty, otherwise just a regular string.",
                                                  type: "string"
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
                                  },
                                  serviceType: {
                                    description: "Optional service type for Kubernetes solver service. Supported values\nare NodePort or ClusterIP. If unset, defaults to NodePort.",
                                    type: "string"
                                  }
                                },
                                type: "object"
                              }
                            },
                            type: "object"
                          },
                          selector: {
                            description: "Selector selects a set of DNSNames on the Certificate resource that\nshould be solved using this challenge solver.\nIf not specified, the solver will be treated as the 'default' solver\nwith the lowest priority, i.e. if any other solver has a more specific\nmatch, it will be used instead.",
                            properties: {
                              dnsNames: {
                                description: "List of DNSNames that this solver will be used to solve.\nIf specified and a match is found, a dnsNames selector will take\nprecedence over a dnsZones selector.\nIf multiple solvers match with the same dnsNames value, the solver\nwith the most matching labels in matchLabels will be selected.\nIf neither has more matches, the solver defined earlier in the list\nwill be selected.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              dnsZones: {
                                description: "List of DNSZones that this solver will be used to solve.\nThe most specific DNS zone match specified here will take precedence\nover other DNS zone matches, so a solver specifying sys.example.com\nwill be selected over one specifying example.com for the domain\nwww.sys.example.com.\nIf multiple solvers match with the same dnsZones value, the solver\nwith the most matching labels in matchLabels will be selected.\nIf neither has more matches, the solver defined earlier in the list\nwill be selected.",
                                items: {
                                  type: "string"
                                },
                                type: "array"
                              },
                              matchLabels: {
                                additionalProperties: {
                                  type: "string"
                                },
                                description: "A label selector that is used to refine the set of certificate's that\nthis challenge solver will apply to.",
                                type: "object"
                              }
                            },
                            type: "object"
                          }
                        },
                        type: "object"
                      },
                      type: "array"
                    }
                  },
                  required: ["privateKeySecretRef", "server"],
                  type: "object"
                },
                ca: {
                  description: "CA configures this issuer to sign certificates using a signing CA keypair\nstored in a Secret resource.\nThis is used to build internal PKIs that are managed by cert-manager.",
                  properties: {
                    crlDistributionPoints: {
                      description: "The CRL distribution points is an X.509 v3 certificate extension which identifies\nthe location of the CRL from which the revocation of this certificate can be checked.\nIf not set, certificates will be issued without distribution points set.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    issuingCertificateURLs: {
                      description: "IssuingCertificateURLs is a list of URLs which this issuer should embed into certificates\nit creates. See https://www.rfc-editor.org/rfc/rfc5280#section-4.2.2.1 for more details.\nAs an example, such a URL might be \"http://ca.domain.com/ca.crt\".",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    ocspServers: {
                      description: "The OCSP server list is an X.509 v3 extension that defines a list of\nURLs of OCSP responders. The OCSP responders can be queried for the\nrevocation status of an issued certificate. If not set, the\ncertificate will be issued with no OCSP servers set. For example, an\nOCSP server URL could be \"http://ocsp.int-x3.letsencrypt.org\".",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    },
                    secretName: {
                      description: "SecretName is the name of the secret used to sign Certificates issued\nby this Issuer.",
                      type: "string"
                    }
                  },
                  required: ["secretName"],
                  type: "object"
                },
                selfSigned: {
                  description: "SelfSigned configures this issuer to 'self sign' certificates using the\nprivate key used to create the CertificateRequest object.",
                  properties: {
                    crlDistributionPoints: {
                      description: "The CRL distribution points is an X.509 v3 certificate extension which identifies\nthe location of the CRL from which the revocation of this certificate can be checked.\nIf not set certificate will be issued without CDP. Values are strings.",
                      items: {
                        type: "string"
                      },
                      type: "array"
                    }
                  },
                  type: "object"
                },
                vault: {
                  description: "Vault configures this issuer to sign certificates using a HashiCorp Vault\nPKI backend.",
                  properties: {
                    auth: {
                      description: "Auth configures how cert-manager authenticates with the Vault server.",
                      properties: {
                        appRole: {
                          description: "AppRole authenticates with Vault using the App Role auth mechanism,\nwith the role and secret stored in a Kubernetes Secret resource.",
                          properties: {
                            path: {
                              description: "Path where the App Role authentication backend is mounted in Vault, e.g:\n\"approle\"",
                              type: "string"
                            },
                            roleId: {
                              description: "RoleID configured in the App Role authentication backend when setting\nup the authentication backend in Vault.",
                              type: "string"
                            },
                            secretRef: {
                              description: "Reference to a key in a Secret that contains the App Role secret used\nto authenticate with Vault.\nThe `key` field must be specified and denotes which entry within the Secret\nresource is used as the app role secret.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["path", "roleId", "secretRef"],
                          type: "object"
                        },
                        clientCertificate: {
                          description: "ClientCertificate authenticates with Vault by presenting a client\ncertificate during the request's TLS handshake.\nWorks only when using HTTPS protocol.",
                          properties: {
                            mountPath: {
                              description: "The Vault mountPath here is the mount path to use when authenticating with\nVault. For example, setting a value to `/v1/auth/foo`, will use the path\n`/v1/auth/foo/login` to authenticate with Vault. If unspecified, the\ndefault value \"/v1/auth/cert\" will be used.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the certificate role to authenticate against.\nIf not set, matching any certificate role, if available.",
                              type: "string"
                            },
                            secretName: {
                              description: "Reference to Kubernetes Secret of type \"kubernetes.io/tls\" (hence containing\ntls.crt and tls.key) used to authenticate to Vault using TLS client\nauthentication.",
                              type: "string"
                            }
                          },
                          type: "object"
                        },
                        kubernetes: {
                          description: "Kubernetes authenticates with Vault by passing the ServiceAccount\ntoken stored in the named Secret resource to the Vault server.",
                          properties: {
                            mountPath: {
                              description: "The Vault mountPath here is the mount path to use when authenticating with\nVault. For example, setting a value to `/v1/auth/foo`, will use the path\n`/v1/auth/foo/login` to authenticate with Vault. If unspecified, the\ndefault value \"/v1/auth/kubernetes\" will be used.",
                              type: "string"
                            },
                            role: {
                              description: "A required field containing the Vault Role to assume. A Role binds a\nKubernetes ServiceAccount with a set of Vault policies.",
                              type: "string"
                            },
                            secretRef: {
                              description: "The required Secret field containing a Kubernetes ServiceAccount JWT used\nfor authenticating with Vault. Use of 'ambient credentials' is not\nsupported.",
                              properties: {
                                key: {
                                  description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                                  type: "string"
                                },
                                name: {
                                  description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            },
                            serviceAccountRef: {
                              description: "A reference to a service account that will be used to request a bound\ntoken (also known as \"projected token\"). Compared to using \"secretRef\",\nusing this field means that you don't rely on statically bound tokens. To\nuse this field, you must configure an RBAC rule to let cert-manager\nrequest a token.",
                              properties: {
                                audiences: {
                                  description: "TokenAudiences is an optional list of extra audiences to include in the token passed to Vault. The default token\nconsisting of the issuer's namespace and name is always included.",
                                  items: {
                                    type: "string"
                                  },
                                  type: "array"
                                },
                                name: {
                                  description: "Name of the ServiceAccount used to request a token.",
                                  type: "string"
                                }
                              },
                              required: ["name"],
                              type: "object"
                            }
                          },
                          required: ["role"],
                          type: "object"
                        },
                        tokenSecretRef: {
                          description: "TokenSecretRef authenticates with Vault by presenting a token.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        }
                      },
                      type: "object"
                    },
                    caBundle: {
                      description: "Base64-encoded bundle of PEM CAs which will be used to validate the certificate\nchain presented by Vault. Only used if using HTTPS to connect to Vault and\nignored for HTTP connections.\nMutually exclusive with CABundleSecretRef.\nIf neither CABundle nor CABundleSecretRef are defined, the certificate bundle in\nthe cert-manager controller container is used to validate the TLS connection.",
                      format: "byte",
                      type: "string"
                    },
                    caBundleSecretRef: {
                      description: "Reference to a Secret containing a bundle of PEM-encoded CAs to use when\nverifying the certificate chain presented by Vault when using HTTPS.\nMutually exclusive with CABundle.\nIf neither CABundle nor CABundleSecretRef are defined, the certificate bundle in\nthe cert-manager controller container is used to validate the TLS connection.\nIf no key for the Secret is specified, cert-manager will default to 'ca.crt'.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    clientCertSecretRef: {
                      description: "Reference to a Secret containing a PEM-encoded Client Certificate to use when the\nVault server requires mTLS.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    clientKeySecretRef: {
                      description: "Reference to a Secret containing a PEM-encoded Client Private Key to use when the\nVault server requires mTLS.",
                      properties: {
                        key: {
                          description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                          type: "string"
                        },
                        name: {
                          description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                          type: "string"
                        }
                      },
                      required: ["name"],
                      type: "object"
                    },
                    namespace: {
                      description: "Name of the vault namespace. Namespaces is a set of features within Vault Enterprise that allows Vault environments to support Secure Multi-tenancy. e.g: \"ns1\"\nMore about namespaces can be found here https://www.vaultproject.io/docs/enterprise/namespaces",
                      type: "string"
                    },
                    path: {
                      description: "Path is the mount path of the Vault PKI backend's `sign` endpoint, e.g:\n\"my_pki_mount/sign/my-role-name\".",
                      type: "string"
                    },
                    server: {
                      description: "Server is the connection address for the Vault server, e.g: \"https://vault.example.com:8200\".",
                      type: "string"
                    }
                  },
                  required: ["auth", "path", "server"],
                  type: "object"
                },
                venafi: {
                  description: "Venafi configures this issuer to sign certificates using a Venafi TPP\nor Venafi Cloud policy zone.",
                  properties: {
                    cloud: {
                      description: "Cloud specifies the Venafi cloud configuration settings.\nOnly one of TPP or Cloud may be specified.",
                      properties: {
                        apiTokenSecretRef: {
                          description: "APITokenSecretRef is a secret key selector for the Venafi Cloud API token.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        url: {
                          description: "URL is the base URL for Venafi Cloud.\nDefaults to \"https://api.venafi.cloud/v1\".",
                          type: "string"
                        }
                      },
                      required: ["apiTokenSecretRef"],
                      type: "object"
                    },
                    tpp: {
                      description: "TPP specifies Trust Protection Platform configuration settings.\nOnly one of TPP or Cloud may be specified.",
                      properties: {
                        caBundle: {
                          description: "Base64-encoded bundle of PEM CAs which will be used to validate the certificate\nchain presented by the TPP server. Only used if using HTTPS; ignored for HTTP.\nIf undefined, the certificate bundle in the cert-manager controller container\nis used to validate the chain.",
                          format: "byte",
                          type: "string"
                        },
                        caBundleSecretRef: {
                          description: "Reference to a Secret containing a base64-encoded bundle of PEM CAs\nwhich will be used to validate the certificate chain presented by the TPP server.\nOnly used if using HTTPS; ignored for HTTP. Mutually exclusive with CABundle.\nIf neither CABundle nor CABundleSecretRef is defined, the certificate bundle in\nthe cert-manager controller container is used to validate the TLS connection.",
                          properties: {
                            key: {
                              description: "The key of the entry in the Secret resource's `data` field to be used.\nSome instances of this field may be defaulted, in others it may be\nrequired.",
                              type: "string"
                            },
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        credentialsRef: {
                          description: "CredentialsRef is a reference to a Secret containing the Venafi TPP API credentials.\nThe secret must contain the key 'access-token' for the Access Token Authentication,\nor two keys, 'username' and 'password' for the API Keys Authentication.",
                          properties: {
                            name: {
                              description: "Name of the resource being referred to.\nMore info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
                              type: "string"
                            }
                          },
                          required: ["name"],
                          type: "object"
                        },
                        url: {
                          description: "URL is the base URL for the vedsdk endpoint of the Venafi TPP instance,\nfor example: \"https://tpp.example.com/vedsdk\".",
                          type: "string"
                        }
                      },
                      required: ["credentialsRef", "url"],
                      type: "object"
                    },
                    zone: {
                      description: "Zone is the Venafi Policy Zone to use for this issuer.\nAll requests made to the Venafi platform will be restricted by the named\nzone policy.\nThis field is required.",
                      type: "string"
                    }
                  },
                  required: ["zone"],
                  type: "object"
                }
              },
              type: "object"
            },
            status: {
              description: "Status of the Issuer. This is set and managed automatically.",
              properties: {
                acme: {
                  description: "ACME specific status options.\nThis field should only be set if the Issuer is configured to use an ACME\nserver to issue certificates.",
                  properties: {
                    lastPrivateKeyHash: {
                      description: "LastPrivateKeyHash is a hash of the private key associated with the latest\nregistered ACME account, in order to track changes made to registered account\nassociated with the Issuer",
                      type: "string"
                    },
                    lastRegisteredEmail: {
                      description: "LastRegisteredEmail is the email associated with the latest registered\nACME account, in order to track changes made to registered account\nassociated with the  Issuer",
                      type: "string"
                    },
                    uri: {
                      description: "URI is the unique account identifier, which can also be used to retrieve\naccount details from the CA",
                      type: "string"
                    }
                  },
                  type: "object"
                },
                conditions: {
                  description: "List of status conditions to indicate the status of a CertificateRequest.\nKnown condition types are `Ready`.",
                  items: {
                    description: "IssuerCondition contains condition information for an Issuer.",
                    properties: {
                      lastTransitionTime: {
                        description: "LastTransitionTime is the timestamp corresponding to the last status\nchange of this condition.",
                        format: "date-time",
                        type: "string"
                      },
                      message: {
                        description: "Message is a human readable description of the details of the last\ntransition, complementing reason.",
                        type: "string"
                      },
                      observedGeneration: {
                        description: "If set, this represents the .metadata.generation that the condition was\nset based upon.\nFor instance, if .metadata.generation is currently 12, but the\n.status.condition[x].observedGeneration is 9, the condition is out of date\nwith respect to the current state of the Issuer.",
                        format: "int64",
                        type: "integer"
                      },
                      reason: {
                        description: "Reason is a brief machine readable explanation for the condition's last\ntransition.",
                        type: "string"
                      },
                      status: {
                        description: "Status of the condition, one of (`True`, `False`, `Unknown`).",
                        enum: ["True", "False", "Unknown"],
                        type: "string"
                      },
                      type: {
                        description: "Type of the condition, known values are (`Ready`).",
                        type: "string"
                      }
                    },
                    required: ["status", "type"],
                    type: "object"
                  },
                  type: "array",
                  "x-kubernetes-list-map-keys": ["type"],
                  "x-kubernetes-list-type": "map"
                }
              },
              type: "object"
            }
          },
          required: ["spec"],
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
export const CustomResourceDefinition_OrdersAcmeCertManagerIo: ApiextensionsK8sIoV1CustomResourceDefinition = {
  apiVersion: "apiextensions.k8s.io/v1",
  kind: "CustomResourceDefinition",
  metadata: {
    annotations: {
      "helm.sh/resource-policy": "keep"
    },
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "crds",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "orders.acme.cert-manager.io"
  },
  spec: {
    group: "acme.cert-manager.io",
    names: {
      categories: ["cert-manager", "cert-manager-acme"],
      kind: "Order",
      listKind: "OrderList",
      plural: "orders",
      singular: "order"
    },
    scope: "Namespaced",
    versions: [{
      additionalPrinterColumns: [{
        jsonPath: ".status.state",
        name: "State",
        type: "string"
      }, {
        jsonPath: ".spec.issuerRef.name",
        name: "Issuer",
        priority: 1,
        type: "string"
      }, {
        jsonPath: ".status.reason",
        name: "Reason",
        priority: 1,
        type: "string"
      }, {
        description: "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.",
        jsonPath: ".metadata.creationTimestamp",
        name: "Age",
        type: "date"
      }],
      name: "v1",
      schema: {
        openAPIV3Schema: {
          description: "Order is a type to represent an Order with an ACME server",
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
              properties: {
                commonName: {
                  description: "CommonName is the common name as specified on the DER encoded CSR.\nIf specified, this value must also be present in `dnsNames` or `ipAddresses`.\nThis field must match the corresponding field on the DER encoded CSR.",
                  type: "string"
                },
                dnsNames: {
                  description: "DNSNames is a list of DNS names that should be included as part of the Order\nvalidation process.\nThis field must match the corresponding field on the DER encoded CSR.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                duration: {
                  description: "Duration is the duration for the not after date for the requested certificate.\nthis is set on order creation as pe the ACME spec.",
                  type: "string"
                },
                ipAddresses: {
                  description: "IPAddresses is a list of IP addresses that should be included as part of the Order\nvalidation process.\nThis field must match the corresponding field on the DER encoded CSR.",
                  items: {
                    type: "string"
                  },
                  type: "array"
                },
                issuerRef: {
                  description: "IssuerRef references a properly configured ACME-type Issuer which should\nbe used to create this Order.\nIf the Issuer does not exist, processing will be retried.\nIf the Issuer is not an 'ACME' Issuer, an error will be returned and the\nOrder will be marked as failed.",
                  properties: {
                    group: {
                      description: "Group of the resource being referred to.",
                      type: "string"
                    },
                    kind: {
                      description: "Kind of the resource being referred to.",
                      type: "string"
                    },
                    name: {
                      description: "Name of the resource being referred to.",
                      type: "string"
                    }
                  },
                  required: ["name"],
                  type: "object"
                },
                request: {
                  description: "Certificate signing request bytes in DER encoding.\nThis will be used when finalizing the order.\nThis field must be set on the order.",
                  format: "byte",
                  type: "string"
                }
              },
              required: ["issuerRef", "request"],
              type: "object"
            },
            status: {
              properties: {
                authorizations: {
                  description: "Authorizations contains data returned from the ACME server on what\nauthorizations must be completed in order to validate the DNS names\nspecified on the Order.",
                  items: {
                    description: "ACMEAuthorization contains data returned from the ACME server on an\nauthorization that must be completed in order validate a DNS name on an ACME\nOrder resource.",
                    properties: {
                      challenges: {
                        description: "Challenges specifies the challenge types offered by the ACME server.\nOne of these challenge types will be selected when validating the DNS\nname and an appropriate Challenge resource will be created to perform\nthe ACME challenge process.",
                        items: {
                          description: "Challenge specifies a challenge offered by the ACME server for an Order.\nAn appropriate Challenge resource can be created to perform the ACME\nchallenge process.",
                          properties: {
                            token: {
                              description: "Token is the token that must be presented for this challenge.\nThis is used to compute the 'key' that must also be presented.",
                              type: "string"
                            },
                            type: {
                              description: "Type is the type of challenge being offered, e.g. 'http-01', 'dns-01',\n'tls-sni-01', etc.\nThis is the raw value retrieved from the ACME server.\nOnly 'http-01' and 'dns-01' are supported by cert-manager, other values\nwill be ignored.",
                              type: "string"
                            },
                            url: {
                              description: "URL is the URL of this challenge. It can be used to retrieve additional\nmetadata about the Challenge from the ACME server.",
                              type: "string"
                            }
                          },
                          required: ["token", "type", "url"],
                          type: "object"
                        },
                        type: "array"
                      },
                      identifier: {
                        description: "Identifier is the DNS name to be validated as part of this authorization",
                        type: "string"
                      },
                      initialState: {
                        description: "InitialState is the initial state of the ACME authorization when first\nfetched from the ACME server.\nIf an Authorization is already 'valid', the Order controller will not\ncreate a Challenge resource for the authorization. This will occur when\nworking with an ACME server that enables 'authz reuse' (such as Let's\nEncrypt's production endpoint).\nIf not set and 'identifier' is set, the state is assumed to be pending\nand a Challenge will be created.",
                        enum: ["valid", "ready", "pending", "processing", "invalid", "expired", "errored"],
                        type: "string"
                      },
                      url: {
                        description: "URL is the URL of the Authorization that must be completed",
                        type: "string"
                      },
                      wildcard: {
                        description: "Wildcard will be true if this authorization is for a wildcard DNS name.\nIf this is true, the identifier will be the *non-wildcard* version of\nthe DNS name.\nFor example, if '*.example.com' is the DNS name being validated, this\nfield will be 'true' and the 'identifier' field will be 'example.com'.",
                        type: "boolean"
                      }
                    },
                    required: ["url"],
                    type: "object"
                  },
                  type: "array"
                },
                certificate: {
                  description: "Certificate is a copy of the PEM encoded certificate for this Order.\nThis field will be populated after the order has been successfully\nfinalized with the ACME server, and the order has transitioned to the\n'valid' state.",
                  format: "byte",
                  type: "string"
                },
                failureTime: {
                  description: "FailureTime stores the time that this order failed.\nThis is used to influence garbage collection and back-off.",
                  format: "date-time",
                  type: "string"
                },
                finalizeURL: {
                  description: "FinalizeURL of the Order.\nThis is used to obtain certificates for this order once it has been completed.",
                  type: "string"
                },
                reason: {
                  description: "Reason optionally provides more information about a why the order is in\nthe current state.",
                  type: "string"
                },
                state: {
                  description: "State contains the current state of this Order resource.\nStates 'success' and 'expired' are 'final'",
                  enum: ["valid", "ready", "pending", "processing", "invalid", "expired", "errored"],
                  type: "string"
                },
                url: {
                  description: "URL of the Order.\nThis will initially be empty when the resource is first created.\nThe Order controller will populate this field when the Order is first processed.\nThis field will be immutable after it is initially set.",
                  type: "string"
                }
              },
              type: "object"
            }
          },
          required: ["metadata", "spec"],
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
export const ClusterRole_CertManagerCainjector: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["certificates"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["get", "create", "update", "patch"]
  }, {
    apiGroups: ["admissionregistration.k8s.io"],
    resources: ["validatingwebhookconfigurations", "mutatingwebhookconfigurations"],
    verbs: ["get", "list", "watch", "update", "patch"]
  }, {
    apiGroups: ["apiregistration.k8s.io"],
    resources: ["apiservices"],
    verbs: ["get", "list", "watch", "update", "patch"]
  }, {
    apiGroups: ["apiextensions.k8s.io"],
    resources: ["customresourcedefinitions"],
    verbs: ["get", "list", "watch", "update", "patch"]
  }]
};
export const ClusterRole_CertManagerControllerIssuers: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-issuers"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["issuers", "issuers/status"],
    verbs: ["update", "patch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["issuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch", "create", "update", "delete"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }]
};
export const ClusterRole_CertManagerControllerClusterissuers: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-clusterissuers"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["clusterissuers", "clusterissuers/status"],
    verbs: ["update", "patch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["clusterissuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch", "create", "update", "delete"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }]
};
export const ClusterRole_CertManagerControllerCertificates: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-certificates"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "certificates/status", "certificaterequests", "certificaterequests/status"],
    verbs: ["update", "patch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "certificaterequests", "clusterissuers", "issuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["certificates/finalizers", "certificaterequests/finalizers"],
    verbs: ["update"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["orders"],
    verbs: ["create", "delete", "get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch", "create", "update", "delete", "patch"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }]
};
export const ClusterRole_CertManagerControllerOrders: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-orders"
  },
  rules: [{
    apiGroups: ["acme.cert-manager.io"],
    resources: ["orders", "orders/status"],
    verbs: ["update", "patch"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["orders", "challenges"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["clusterissuers", "issuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges"],
    verbs: ["create", "delete"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["orders/finalizers"],
    verbs: ["update"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }]
};
export const ClusterRole_CertManagerControllerChallenges: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-challenges"
  },
  rules: [{
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges", "challenges/status"],
    verbs: ["update", "patch"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["issuers", "clusterissuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }, {
    apiGroups: [""],
    resources: ["pods", "services"],
    verbs: ["get", "list", "watch", "create", "delete"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses"],
    verbs: ["get", "list", "watch", "create", "delete", "update"]
  }, {
    apiGroups: ["gateway.networking.k8s.io"],
    resources: ["httproutes"],
    verbs: ["get", "list", "watch", "create", "delete", "update"]
  }, {
    apiGroups: ["route.openshift.io"],
    resources: ["routes/custom-host"],
    verbs: ["create"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges/finalizers"],
    verbs: ["update"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_CertManagerControllerIngressShim: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-ingress-shim"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "certificaterequests"],
    verbs: ["create", "update", "delete"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "certificaterequests", "issuers", "clusterissuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["networking.k8s.io"],
    resources: ["ingresses/finalizers"],
    verbs: ["update"]
  }, {
    apiGroups: ["gateway.networking.k8s.io"],
    resources: ["gateways", "httproutes"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["gateway.networking.k8s.io"],
    resources: ["gateways/finalizers", "httproutes/finalizers"],
    verbs: ["update"]
  }, {
    apiGroups: [""],
    resources: ["events"],
    verbs: ["create", "patch"]
  }]
};
export const ClusterRole_CertManagerClusterView: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0",
      "rbac.authorization.k8s.io/aggregate-to-cluster-reader": "true"
    },
    name: "cert-manager-cluster-view"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["clusterissuers"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_CertManagerView: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0",
      "rbac.authorization.k8s.io/aggregate-to-admin": "true",
      "rbac.authorization.k8s.io/aggregate-to-cluster-reader": "true",
      "rbac.authorization.k8s.io/aggregate-to-edit": "true",
      "rbac.authorization.k8s.io/aggregate-to-view": "true"
    },
    name: "cert-manager-view"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "certificaterequests", "issuers"],
    verbs: ["get", "list", "watch"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges", "orders"],
    verbs: ["get", "list", "watch"]
  }]
};
export const ClusterRole_CertManagerEdit: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0",
      "rbac.authorization.k8s.io/aggregate-to-admin": "true",
      "rbac.authorization.k8s.io/aggregate-to-edit": "true"
    },
    name: "cert-manager-edit"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["certificates", "certificaterequests", "issuers"],
    verbs: ["create", "delete", "deletecollection", "patch", "update"]
  }, {
    apiGroups: ["cert-manager.io"],
    resources: ["certificates/status"],
    verbs: ["update"]
  }, {
    apiGroups: ["acme.cert-manager.io"],
    resources: ["challenges", "orders"],
    verbs: ["create", "delete", "deletecollection", "patch", "update"]
  }]
};
export const ClusterRole_CertManagerControllerApproveCertManagerIo: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-approve:cert-manager-io"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resourceNames: ["issuers.cert-manager.io/*", "clusterissuers.cert-manager.io/*"],
    resources: ["signers"],
    verbs: ["approve"]
  }]
};
export const ClusterRole_CertManagerControllerCertificatesigningrequests: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-certificatesigningrequests"
  },
  rules: [{
    apiGroups: ["certificates.k8s.io"],
    resources: ["certificatesigningrequests"],
    verbs: ["get", "list", "watch", "update"]
  }, {
    apiGroups: ["certificates.k8s.io"],
    resources: ["certificatesigningrequests/status"],
    verbs: ["update", "patch"]
  }, {
    apiGroups: ["certificates.k8s.io"],
    resourceNames: ["issuers.cert-manager.io/*", "clusterissuers.cert-manager.io/*"],
    resources: ["signers"],
    verbs: ["sign"]
  }, {
    apiGroups: ["authorization.k8s.io"],
    resources: ["subjectaccessreviews"],
    verbs: ["create"]
  }]
};
export const ClusterRole_CertManagerWebhookSubjectaccessreviews: RbacAuthorizationK8sIoV1ClusterRole = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRole",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook:subjectaccessreviews"
  },
  rules: [{
    apiGroups: ["authorization.k8s.io"],
    resources: ["subjectaccessreviews"],
    verbs: ["create"]
  }]
};
export const ClusterRoleBinding_CertManagerCainjector: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-cainjector"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager-cainjector",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerIssuers: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-issuers"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-issuers"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerClusterissuers: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-clusterissuers"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-clusterissuers"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerCertificates: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-certificates"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-certificates"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerOrders: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-orders"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-orders"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerChallenges: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-challenges"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-challenges"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerIngressShim: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-ingress-shim"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-ingress-shim"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerApproveCertManagerIo: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-approve:cert-manager-io"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-approve:cert-manager-io"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerControllerCertificatesigningrequests: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "cert-manager",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-controller-certificatesigningrequests"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-controller-certificatesigningrequests"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const ClusterRoleBinding_CertManagerWebhookSubjectaccessreviews: RbacAuthorizationK8sIoV1ClusterRoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "ClusterRoleBinding",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook:subjectaccessreviews"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "ClusterRole",
    name: "cert-manager-webhook:subjectaccessreviews"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager-webhook",
    namespace: "cert-manager"
  }]
};
export const Role_CertManagerCainjectorLeaderelection: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector:leaderelection",
    namespace: "cert-manager"
  },
  rules: [{
    apiGroups: ["coordination.k8s.io"],
    resourceNames: ["cert-manager-cainjector-leader-election", "cert-manager-cainjector-leader-election-core"],
    resources: ["leases"],
    verbs: ["get", "update", "patch"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resources: ["leases"],
    verbs: ["create"]
  }]
};
export const Role_CertManagerLeaderelection: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager:leaderelection",
    namespace: "cert-manager"
  },
  rules: [{
    apiGroups: ["coordination.k8s.io"],
    resourceNames: ["cert-manager-controller"],
    resources: ["leases"],
    verbs: ["get", "update", "patch"]
  }, {
    apiGroups: ["coordination.k8s.io"],
    resources: ["leases"],
    verbs: ["create"]
  }]
};
export const Role_CertManagerTokenrequest: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-tokenrequest",
    namespace: "cert-manager"
  },
  rules: [{
    apiGroups: [""],
    resourceNames: ["cert-manager"],
    resources: ["serviceaccounts/token"],
    verbs: ["create"]
  }]
};
export const Role_CertManagerWebhookDynamicServing: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook:dynamic-serving",
    namespace: "cert-manager"
  },
  rules: [{
    apiGroups: [""],
    resourceNames: ["cert-manager-webhook-ca"],
    resources: ["secrets"],
    verbs: ["get", "list", "watch", "update"]
  }, {
    apiGroups: [""],
    resources: ["secrets"],
    verbs: ["create"]
  }]
};
export const RoleBinding_CertManagerCainjectorLeaderelection: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector:leaderelection",
    namespace: "cert-manager"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "cert-manager-cainjector:leaderelection"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager-cainjector",
    namespace: "cert-manager"
  }]
};
export const RoleBinding_CertManagerLeaderelection: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager:leaderelection",
    namespace: "cert-manager"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "cert-manager:leaderelection"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const RoleBinding_CertManagerCertManagerTokenrequest: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cert-manager-tokenrequest",
    namespace: "cert-manager"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "cert-manager-tokenrequest"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager",
    namespace: "cert-manager"
  }]
};
export const RoleBinding_CertManagerWebhookDynamicServing: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook:dynamic-serving",
    namespace: "cert-manager"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "cert-manager-webhook:dynamic-serving"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager-webhook",
    namespace: "cert-manager"
  }]
};
export const Service_CertManagerCainjector: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector",
    namespace: "cert-manager"
  },
  spec: {
    ports: [{
      name: "http-metrics",
      port: 9402,
      protocol: "TCP"
    }],
    selector: {
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/name": "cainjector"
    },
    type: "ClusterIP"
  }
};
export const Service_CertManager: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager",
    namespace: "cert-manager"
  },
  spec: {
    ports: [{
      name: "tcp-prometheus-servicemonitor",
      port: 9402,
      protocol: "TCP",
      targetPort: 9402
    }],
    selector: {
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/name": "cert-manager"
    },
    type: "ClusterIP"
  }
};
export const Service_CertManagerWebhook: Service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook",
    namespace: "cert-manager"
  },
  spec: {
    ports: [{
      name: "https",
      port: 443,
      protocol: "TCP",
      targetPort: "https"
    }, {
      name: "metrics",
      port: 9402,
      protocol: "TCP",
      targetPort: "http-metrics"
    }],
    selector: {
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/name": "webhook"
    },
    type: "ClusterIP"
  }
};
export const Deployment_CertManagerCainjector: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      app: "cainjector",
      "app.kubernetes.io/component": "cainjector",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cainjector",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-cainjector",
    namespace: "cert-manager"
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        "app.kubernetes.io/component": "cainjector",
        "app.kubernetes.io/instance": "cert-manager",
        "app.kubernetes.io/name": "cainjector"
      }
    },
    template: {
      metadata: {
        annotations: {
          "prometheus.io/path": "/metrics",
          "prometheus.io/port": "9402",
          "prometheus.io/scrape": "true"
        },
        labels: {
          app: "cainjector",
          "app.kubernetes.io/component": "cainjector",
          "app.kubernetes.io/instance": "cert-manager",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "cainjector",
          "app.kubernetes.io/version": "v1.17.0",
          "helm.sh/chart": "cert-manager-v1.17.0"
        }
      },
      spec: {
        containers: [{
          args: ["--v=2", "--leader-election-namespace=cert-manager"],
          env: [{
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }],
          image: "quay.io/jetstack/cert-manager-cainjector:v1.17.0",
          imagePullPolicy: "IfNotPresent",
          name: "cert-manager-cainjector",
          ports: [{
            containerPort: 9402,
            name: "http-metrics",
            protocol: "TCP"
          }],
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true
          }
        }],
        enableServiceLinks: false,
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        securityContext: {
          runAsNonRoot: true,
          seccompProfile: {
            type: "RuntimeDefault"
          }
        },
        serviceAccountName: "cert-manager-cainjector"
      }
    }
  }
};
export const Deployment_CertManager: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      app: "cert-manager",
      "app.kubernetes.io/component": "controller",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "cert-manager",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager",
    namespace: "cert-manager"
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        "app.kubernetes.io/component": "controller",
        "app.kubernetes.io/instance": "cert-manager",
        "app.kubernetes.io/name": "cert-manager"
      }
    },
    template: {
      metadata: {
        annotations: {
          "prometheus.io/path": "/metrics",
          "prometheus.io/port": "9402",
          "prometheus.io/scrape": "true"
        },
        labels: {
          app: "cert-manager",
          "app.kubernetes.io/component": "controller",
          "app.kubernetes.io/instance": "cert-manager",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "cert-manager",
          "app.kubernetes.io/version": "v1.17.0",
          "helm.sh/chart": "cert-manager-v1.17.0"
        }
      },
      spec: {
        containers: [{
          args: ["--v=2", "--cluster-resource-namespace=$(POD_NAMESPACE)", "--leader-election-namespace=cert-manager", "--acme-http01-solver-image=quay.io/jetstack/cert-manager-acmesolver:v1.17.0", "--max-concurrent-challenges=60"],
          env: [{
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }],
          image: "quay.io/jetstack/cert-manager-controller:v1.17.0",
          imagePullPolicy: "IfNotPresent",
          livenessProbe: {
            failureThreshold: 8,
            httpGet: {
              path: "/livez",
              port: "http-healthz",
              scheme: "HTTP"
            },
            initialDelaySeconds: 10,
            periodSeconds: 10,
            successThreshold: 1,
            timeoutSeconds: 15
          },
          name: "cert-manager-controller",
          ports: [{
            containerPort: 9402,
            name: "http-metrics",
            protocol: "TCP"
          }, {
            containerPort: 9403,
            name: "http-healthz",
            protocol: "TCP"
          }],
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true
          }
        }],
        enableServiceLinks: false,
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        securityContext: {
          runAsNonRoot: true,
          seccompProfile: {
            type: "RuntimeDefault"
          }
        },
        serviceAccountName: "cert-manager"
      }
    }
  }
};
export const Deployment_CertManagerWebhook: AppsV1Deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook",
    namespace: "cert-manager"
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        "app.kubernetes.io/component": "webhook",
        "app.kubernetes.io/instance": "cert-manager",
        "app.kubernetes.io/name": "webhook"
      }
    },
    template: {
      metadata: {
        annotations: {
          "prometheus.io/path": "/metrics",
          "prometheus.io/port": "9402",
          "prometheus.io/scrape": "true"
        },
        labels: {
          app: "webhook",
          "app.kubernetes.io/component": "webhook",
          "app.kubernetes.io/instance": "cert-manager",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "webhook",
          "app.kubernetes.io/version": "v1.17.0",
          "helm.sh/chart": "cert-manager-v1.17.0"
        }
      },
      spec: {
        containers: [{
          args: ["--v=2", "--secure-port=10250", "--dynamic-serving-ca-secret-namespace=$(POD_NAMESPACE)", "--dynamic-serving-ca-secret-name=cert-manager-webhook-ca", "--dynamic-serving-dns-names=cert-manager-webhook", "--dynamic-serving-dns-names=cert-manager-webhook.$(POD_NAMESPACE)", "--dynamic-serving-dns-names=cert-manager-webhook.$(POD_NAMESPACE).svc"],
          env: [{
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }],
          image: "quay.io/jetstack/cert-manager-webhook:v1.17.0",
          imagePullPolicy: "IfNotPresent",
          livenessProbe: {
            failureThreshold: 3,
            httpGet: {
              path: "/livez",
              port: 6080,
              scheme: "HTTP"
            },
            initialDelaySeconds: 60,
            periodSeconds: 10,
            successThreshold: 1,
            timeoutSeconds: 1
          },
          name: "cert-manager-webhook",
          ports: [{
            containerPort: 10250,
            name: "https",
            protocol: "TCP"
          }, {
            containerPort: 6080,
            name: "healthcheck",
            protocol: "TCP"
          }, {
            containerPort: 9402,
            name: "http-metrics",
            protocol: "TCP"
          }],
          readinessProbe: {
            failureThreshold: 3,
            httpGet: {
              path: "/healthz",
              port: 6080,
              scheme: "HTTP"
            },
            initialDelaySeconds: 5,
            periodSeconds: 5,
            successThreshold: 1,
            timeoutSeconds: 1
          },
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true
          }
        }],
        enableServiceLinks: false,
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        securityContext: {
          runAsNonRoot: true,
          seccompProfile: {
            type: "RuntimeDefault"
          }
        },
        serviceAccountName: "cert-manager-webhook"
      }
    }
  }
};
export const MutatingWebhookConfiguration_CertManagerWebhook: AdmissionregistrationK8sIoV1MutatingWebhookConfiguration = {
  apiVersion: "admissionregistration.k8s.io/v1",
  kind: "MutatingWebhookConfiguration",
  metadata: {
    annotations: {
      "cert-manager.io/inject-ca-from-secret": "cert-manager/cert-manager-webhook-ca"
    },
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook"
  },
  webhooks: [{
    admissionReviewVersions: ["v1"],
    clientConfig: {
      service: {
        name: "cert-manager-webhook",
        namespace: "cert-manager",
        path: "/mutate"
      }
    },
    failurePolicy: "Fail",
    matchPolicy: "Equivalent",
    name: "webhook.cert-manager.io",
    rules: [{
      apiGroups: ["cert-manager.io"],
      apiVersions: ["v1"],
      operations: ["CREATE"],
      resources: ["certificaterequests"]
    }],
    sideEffects: "None",
    timeoutSeconds: 30
  }]
};
export const ValidatingWebhookConfiguration_CertManagerWebhook: AdmissionregistrationK8sIoV1ValidatingWebhookConfiguration = {
  apiVersion: "admissionregistration.k8s.io/v1",
  kind: "ValidatingWebhookConfiguration",
  metadata: {
    annotations: {
      "cert-manager.io/inject-ca-from-secret": "cert-manager/cert-manager-webhook-ca"
    },
    labels: {
      app: "webhook",
      "app.kubernetes.io/component": "webhook",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "webhook",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-webhook"
  },
  webhooks: [{
    admissionReviewVersions: ["v1"],
    clientConfig: {
      service: {
        name: "cert-manager-webhook",
        namespace: "cert-manager",
        path: "/validate"
      }
    },
    failurePolicy: "Fail",
    matchPolicy: "Equivalent",
    name: "webhook.cert-manager.io",
    namespaceSelector: {
      matchExpressions: [{
        key: "cert-manager.io/disable-validation",
        operator: "NotIn",
        values: ["true"]
      }]
    },
    rules: [{
      apiGroups: ["cert-manager.io", "acme.cert-manager.io"],
      apiVersions: ["v1"],
      operations: ["CREATE", "UPDATE"],
      resources: ["*/*"]
    }],
    sideEffects: "None",
    timeoutSeconds: 30
  }]
};
export const ServiceAccount_CertManagerStartupapicheck: ServiceAccount = {
  apiVersion: "v1",
  kind: "ServiceAccount",
  metadata: {
    annotations: {
      "helm.sh/hook": "post-install",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded",
      "helm.sh/hook-weight": "-5"
    },
    labels: {
      app: "startupapicheck",
      "app.kubernetes.io/component": "startupapicheck",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "startupapicheck",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-startupapicheck",
    namespace: "cert-manager"
  },
  automountServiceAccountToken: true
};
export const Role_CertManagerStartupapicheckCreateCert: RbacAuthorizationK8sIoV1Role = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "Role",
  metadata: {
    annotations: {
      "helm.sh/hook": "post-install",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded",
      "helm.sh/hook-weight": "-5"
    },
    labels: {
      app: "startupapicheck",
      "app.kubernetes.io/component": "startupapicheck",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "startupapicheck",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-startupapicheck:create-cert",
    namespace: "cert-manager"
  },
  rules: [{
    apiGroups: ["cert-manager.io"],
    resources: ["certificaterequests"],
    verbs: ["create"]
  }]
};
export const RoleBinding_CertManagerStartupapicheckCreateCert: RbacAuthorizationK8sIoV1RoleBinding = {
  apiVersion: "rbac.authorization.k8s.io/v1",
  kind: "RoleBinding",
  metadata: {
    annotations: {
      "helm.sh/hook": "post-install",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded",
      "helm.sh/hook-weight": "-5"
    },
    labels: {
      app: "startupapicheck",
      "app.kubernetes.io/component": "startupapicheck",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "startupapicheck",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-startupapicheck:create-cert",
    namespace: "cert-manager"
  },
  roleRef: {
    apiGroup: "rbac.authorization.k8s.io",
    kind: "Role",
    name: "cert-manager-startupapicheck:create-cert"
  },
  subjects: [{
    kind: "ServiceAccount",
    name: "cert-manager-startupapicheck",
    namespace: "cert-manager"
  }]
};
export const Job_CertManagerStartupapicheck: BatchV1Job = {
  apiVersion: "batch/v1",
  kind: "Job",
  metadata: {
    annotations: {
      "helm.sh/hook": "post-install",
      "helm.sh/hook-delete-policy": "before-hook-creation,hook-succeeded",
      "helm.sh/hook-weight": "1"
    },
    labels: {
      app: "startupapicheck",
      "app.kubernetes.io/component": "startupapicheck",
      "app.kubernetes.io/instance": "cert-manager",
      "app.kubernetes.io/managed-by": "Helm",
      "app.kubernetes.io/name": "startupapicheck",
      "app.kubernetes.io/version": "v1.17.0",
      "helm.sh/chart": "cert-manager-v1.17.0"
    },
    name: "cert-manager-startupapicheck",
    namespace: "cert-manager"
  },
  spec: {
    backoffLimit: 4,
    template: {
      metadata: {
        labels: {
          app: "startupapicheck",
          "app.kubernetes.io/component": "startupapicheck",
          "app.kubernetes.io/instance": "cert-manager",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "startupapicheck",
          "app.kubernetes.io/version": "v1.17.0",
          "helm.sh/chart": "cert-manager-v1.17.0"
        }
      },
      spec: {
        containers: [{
          args: ["check", "api", "--wait=1m", "-v"],
          env: [{
            name: "POD_NAMESPACE",
            valueFrom: {
              fieldRef: {
                fieldPath: "metadata.namespace"
              }
            }
          }],
          image: "quay.io/jetstack/cert-manager-startupapicheck:v1.17.0",
          imagePullPolicy: "IfNotPresent",
          name: "cert-manager-startupapicheck",
          securityContext: {
            allowPrivilegeEscalation: false,
            capabilities: {
              drop: ["ALL"]
            },
            readOnlyRootFilesystem: true
          }
        }],
        enableServiceLinks: false,
        nodeSelector: {
          "kubernetes.io/os": "linux"
        },
        restartPolicy: "OnFailure",
        securityContext: {
          runAsNonRoot: true,
          seccompProfile: {
            type: "RuntimeDefault"
          }
        },
        serviceAccountName: "cert-manager-startupapicheck"
      }
    }
  }
};
export const resources: ReadonlyArray<KubernetesResource> = [ServiceAccount_CertManagerCainjector, ServiceAccount_CertManager, ServiceAccount_CertManagerWebhook, CustomResourceDefinition_CertificaterequestsCertManagerIo, CustomResourceDefinition_CertificatesCertManagerIo, CustomResourceDefinition_ChallengesAcmeCertManagerIo, CustomResourceDefinition_ClusterissuersCertManagerIo, CustomResourceDefinition_IssuersCertManagerIo, CustomResourceDefinition_OrdersAcmeCertManagerIo, ClusterRole_CertManagerCainjector, ClusterRole_CertManagerControllerIssuers, ClusterRole_CertManagerControllerClusterissuers, ClusterRole_CertManagerControllerCertificates, ClusterRole_CertManagerControllerOrders, ClusterRole_CertManagerControllerChallenges, ClusterRole_CertManagerControllerIngressShim, ClusterRole_CertManagerClusterView, ClusterRole_CertManagerView, ClusterRole_CertManagerEdit, ClusterRole_CertManagerControllerApproveCertManagerIo, ClusterRole_CertManagerControllerCertificatesigningrequests, ClusterRole_CertManagerWebhookSubjectaccessreviews, ClusterRoleBinding_CertManagerCainjector, ClusterRoleBinding_CertManagerControllerIssuers, ClusterRoleBinding_CertManagerControllerClusterissuers, ClusterRoleBinding_CertManagerControllerCertificates, ClusterRoleBinding_CertManagerControllerOrders, ClusterRoleBinding_CertManagerControllerChallenges, ClusterRoleBinding_CertManagerControllerIngressShim, ClusterRoleBinding_CertManagerControllerApproveCertManagerIo, ClusterRoleBinding_CertManagerControllerCertificatesigningrequests, ClusterRoleBinding_CertManagerWebhookSubjectaccessreviews, Role_CertManagerCainjectorLeaderelection, Role_CertManagerLeaderelection, Role_CertManagerTokenrequest, Role_CertManagerWebhookDynamicServing, RoleBinding_CertManagerCainjectorLeaderelection, RoleBinding_CertManagerLeaderelection, RoleBinding_CertManagerCertManagerTokenrequest, RoleBinding_CertManagerWebhookDynamicServing, Service_CertManagerCainjector, Service_CertManager, Service_CertManagerWebhook, Deployment_CertManagerCainjector, Deployment_CertManager, Deployment_CertManagerWebhook, MutatingWebhookConfiguration_CertManagerWebhook, ValidatingWebhookConfiguration_CertManagerWebhook, ServiceAccount_CertManagerStartupapicheck, Role_CertManagerStartupapicheckCreateCert, RoleBinding_CertManagerStartupapicheckCreateCert, Job_CertManagerStartupapicheck];
export default {
  resources: resources
};
