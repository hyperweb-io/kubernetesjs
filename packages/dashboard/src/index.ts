import { APIClient, APIClientRequestOpts } from "@interweb/fetch-api-client";
/* io.k8s.api.admissionregistration.v1.MutatingWebhook */
/* MutatingWebhook describes an admission webhook and the resources and operations it applies to. */
export interface MutatingWebhook {
  /* AdmissionReviewVersions is an ordered list of preferred `AdmissionReview` versions the Webhook expects. API server will try to use first version in the list which it supports. If none of the versions specified in this list supported by API server, validation will fail for this object. If a persisted webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail and be subject to the failure policy. */
  admissionReviewVersions: string[];
  /* ClientConfig defines how to communicate with the hook. Required */
  clientConfig: WebhookClientConfig;
  /* FailurePolicy defines how unrecognized errors from the admission endpoint are handled - allowed values are Ignore or Fail. Defaults to Fail. */
  failurePolicy?: string;
  /* matchPolicy defines how the "rules" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".
  
  - Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the webhook.
  
  - Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the webhook.
  
  Defaults to "Equivalent" */
  matchPolicy?: string;
  /* The name of the admission webhook. Name should be fully qualified, e.g., imagepolicy.kubernetes.io, where "imagepolicy" is the name of the webhook, and kubernetes.io is the name of the organization. Required. */
  name: string;
  /* NamespaceSelector decides whether to run the webhook on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the webhook.
  
  For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {
    "matchExpressions": [
      {
        "key": "runlevel",
        "operator": "NotIn",
        "values": [
          "0",
          "1"
        ]
      }
    ]
  }
  
  If instead you want to only run the webhook on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {
    "matchExpressions": [
      {
        "key": "environment",
        "operator": "In",
        "values": [
          "prod",
          "staging"
        ]
      }
    ]
  }
  
  See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.
  
  Default to the empty LabelSelector, which matches everything. */
  namespaceSelector?: LabelSelector;
  /* ObjectSelector decides whether to run the webhook based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the webhook, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything. */
  objectSelector?: LabelSelector;
  /* reinvocationPolicy indicates whether this webhook should be called multiple times as part of a single admission evaluation. Allowed values are "Never" and "IfNeeded".
  
  Never: the webhook will not be called more than once in a single admission evaluation.
  
  IfNeeded: the webhook will be called at least one additional time as part of the admission evaluation if the object being admitted is modified by other admission plugins after the initial webhook call. Webhooks that specify this option *must* be idempotent, able to process objects they previously admitted. Note: * the number of additional invocations is not guaranteed to be exactly one. * if additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again. * webhooks that use this option may be reordered to minimize the number of additional invocations. * to validate an object after all mutations are guaranteed complete, use a validating admission webhook instead.
  
  Defaults to "Never". */
  reinvocationPolicy?: string;
  /* Rules describes what operations on what resources/subresources the webhook cares about. The webhook cares about an operation if it matches _any_ Rule. However, in order to prevent ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks from putting the cluster in a state which cannot be recovered from without completely disabling the plugin, ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks are never called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects. */
  rules?: RuleWithOperations[];
  /* SideEffects states whether this webhook has side effects. Acceptable values are: None, NoneOnDryRun (webhooks created via v1beta1 may also specify Some or Unknown). Webhooks with side effects MUST implement a reconciliation system, since a request may be rejected by a future step in the admission chain and the side effects therefore need to be undone. Requests with the dryRun attribute will be auto-rejected if they match a webhook with sideEffects == Unknown or Some. */
  sideEffects: string;
  /* TimeoutSeconds specifies the timeout for this webhook. After the timeout passes, the webhook call will be ignored or the API call will fail based on the failure policy. The timeout value must be between 1 and 30 seconds. Default to 10 seconds. */
  timeoutSeconds?: number;
}
/* io.k8s.api.admissionregistration.v1.MutatingWebhookConfiguration */
/* MutatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and may change the object. */
export interface MutatingWebhookConfiguration {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata. */
  metadata?: ObjectMeta;
  /* Webhooks is a list of webhooks and the affected resources and operations. */
  webhooks?: MutatingWebhook[];
}
/* io.k8s.api.admissionregistration.v1.MutatingWebhookConfigurationList */
/* MutatingWebhookConfigurationList is a list of MutatingWebhookConfiguration. */
export interface MutatingWebhookConfigurationList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of MutatingWebhookConfiguration. */
  items: MutatingWebhookConfiguration[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.admissionregistration.v1.RuleWithOperations */
/* RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid. */
export interface RuleWithOperations {
  /* APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required. */
  apiGroups?: string[];
  /* APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required. */
  apiVersions?: string[];
  /* Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required. */
  operations?: string[];
  /* Resources is a list of resources this rule applies to.
  
  For example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*\/scale' means all scale subresources. '*\/*' means all resources and their subresources.
  
  If wildcard is present, the validation rule will ensure resources do not overlap with each other.
  
  Depending on the enclosing object, subresources might not be allowed. Required. */
  resources?: string[];
  /* scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*". */
  scope?: string;
}
/* io.k8s.api.admissionregistration.v1.ServiceReference */
/* ServiceReference holds a reference to Service.legacy.k8s.io */
export interface AdmissionServiceReference {
  /* `name` is the name of the service. Required */
  name: string;
  /* `namespace` is the namespace of the service. Required */
  namespace: string;
  /* `path` is an optional URL path which will be sent in any request to this service. */
  path?: string;
  /* If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive). */
  port?: number;
}
/* io.k8s.api.admissionregistration.v1.ValidatingWebhook */
/* ValidatingWebhook describes an admission webhook and the resources and operations it applies to. */
export interface ValidatingWebhook {
  /* AdmissionReviewVersions is an ordered list of preferred `AdmissionReview` versions the Webhook expects. API server will try to use first version in the list which it supports. If none of the versions specified in this list supported by API server, validation will fail for this object. If a persisted webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail and be subject to the failure policy. */
  admissionReviewVersions: string[];
  /* ClientConfig defines how to communicate with the hook. Required */
  clientConfig: WebhookClientConfig;
  /* FailurePolicy defines how unrecognized errors from the admission endpoint are handled - allowed values are Ignore or Fail. Defaults to Fail. */
  failurePolicy?: string;
  /* matchPolicy defines how the "rules" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".
  
  - Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the webhook.
  
  - Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the webhook.
  
  Defaults to "Equivalent" */
  matchPolicy?: string;
  /* The name of the admission webhook. Name should be fully qualified, e.g., imagepolicy.kubernetes.io, where "imagepolicy" is the name of the webhook, and kubernetes.io is the name of the organization. Required. */
  name: string;
  /* NamespaceSelector decides whether to run the webhook on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the webhook.
  
  For example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {
    "matchExpressions": [
      {
        "key": "runlevel",
        "operator": "NotIn",
        "values": [
          "0",
          "1"
        ]
      }
    ]
  }
  
  If instead you want to only run the webhook on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {
    "matchExpressions": [
      {
        "key": "environment",
        "operator": "In",
        "values": [
          "prod",
          "staging"
        ]
      }
    ]
  }
  
  See https://kubernetes.io/docs/concepts/overview/working-with-objects/labels for more examples of label selectors.
  
  Default to the empty LabelSelector, which matches everything. */
  namespaceSelector?: LabelSelector;
  /* ObjectSelector decides whether to run the webhook based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the webhook, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything. */
  objectSelector?: LabelSelector;
  /* Rules describes what operations on what resources/subresources the webhook cares about. The webhook cares about an operation if it matches _any_ Rule. However, in order to prevent ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks from putting the cluster in a state which cannot be recovered from without completely disabling the plugin, ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks are never called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects. */
  rules?: RuleWithOperations[];
  /* SideEffects states whether this webhook has side effects. Acceptable values are: None, NoneOnDryRun (webhooks created via v1beta1 may also specify Some or Unknown). Webhooks with side effects MUST implement a reconciliation system, since a request may be rejected by a future step in the admission chain and the side effects therefore need to be undone. Requests with the dryRun attribute will be auto-rejected if they match a webhook with sideEffects == Unknown or Some. */
  sideEffects: string;
  /* TimeoutSeconds specifies the timeout for this webhook. After the timeout passes, the webhook call will be ignored or the API call will fail based on the failure policy. The timeout value must be between 1 and 30 seconds. Default to 10 seconds. */
  timeoutSeconds?: number;
}
/* io.k8s.api.admissionregistration.v1.ValidatingWebhookConfiguration */
/* ValidatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and object without changing it. */
export interface ValidatingWebhookConfiguration {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata. */
  metadata?: ObjectMeta;
  /* Webhooks is a list of webhooks and the affected resources and operations. */
  webhooks?: ValidatingWebhook[];
}
/* io.k8s.api.admissionregistration.v1.ValidatingWebhookConfigurationList */
/* ValidatingWebhookConfigurationList is a list of ValidatingWebhookConfiguration. */
export interface ValidatingWebhookConfigurationList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of ValidatingWebhookConfiguration. */
  items: ValidatingWebhookConfiguration[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.admissionregistration.v1.WebhookClientConfig */
/* WebhookClientConfig contains the information to make a TLS connection with the webhook */
export interface WebhookClientConfig {
  /* `caBundle` is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used. */
  caBundle?: string;
  /* `service` is a reference to the service for this webhook. Either `service` or `url` must be specified.
  
  If the webhook is running within the cluster, then you should use `service`. */
  service?: AdmissionServiceReference;
  /* `url` gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.
  
  The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.
  
  Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.
  
  The scheme must be "https"; the URL must begin with "https://".
  
  A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.
  
  Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either. */
  url?: string;
}
/* io.k8s.api.apps.v1.ControllerRevision */
/* ControllerRevision implements an immutable snapshot of state data. Clients are responsible for serializing and deserializing the objects that contain their internal state. Once a ControllerRevision has been successfully created, it can not be updated. The API Server will fail validation of all requests that attempt to mutate the Data field. ControllerRevisions may, however, be deleted. Note that, due to its use by both the DaemonSet and StatefulSet controllers for update and rollback, this object is beta. However, it may be subject to name and representation changes in future releases, and clients should not depend on its stability. It is primarily for internal use by controllers. */
export interface ControllerRevision {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Data is the serialized representation of the state. */
  data?: RawExtension;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Revision indicates the revision of the state represented by Data. */
  revision: number;
}
/* io.k8s.api.apps.v1.ControllerRevisionList */
/* ControllerRevisionList is a resource containing a list of ControllerRevision objects. */
export interface ControllerRevisionList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of ControllerRevisions */
  items: ControllerRevision[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.apps.v1.DaemonSet */
/* DaemonSet represents the configuration of a daemon set. */
export interface DaemonSet {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* The desired behavior of this daemon set. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: DaemonSetSpec;
  /* The current status of this daemon set. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: DaemonSetStatus;
}
/* io.k8s.api.apps.v1.DaemonSetCondition */
/* DaemonSetCondition describes the state of a DaemonSet at a certain point. */
export interface DaemonSetCondition {
  /* Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* A human readable message indicating details about the transition. */
  message?: string;
  /* The reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of DaemonSet condition. */
  type: string;
}
/* io.k8s.api.apps.v1.DaemonSetList */
/* DaemonSetList is a collection of daemon sets. */
export interface DaemonSetList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* A list of daemon sets. */
  items: DaemonSet[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.apps.v1.DaemonSetSpec */
/* DaemonSetSpec is the specification of a daemon set. */
export interface DaemonSetSpec {
  /* The minimum number of seconds for which a newly created DaemonSet pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready). */
  minReadySeconds?: number;
  /* The number of old history to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10. */
  revisionHistoryLimit?: number;
  /* A label query over pods that are managed by the daemon set. Must match in order to be controlled. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors */
  selector: LabelSelector;
  /* An object that describes the pod that will be created. The DaemonSet will create exactly one copy of this pod on every node that matches the template's node selector (or on every node if no node selector is specified). More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template */
  template: PodTemplateSpec;
  /* An update strategy to replace existing DaemonSet pods with new pods. */
  updateStrategy?: DaemonSetUpdateStrategy;
}
/* io.k8s.api.apps.v1.DaemonSetStatus */
/* DaemonSetStatus represents the current status of a daemon set. */
export interface DaemonSetStatus {
  /* Count of hash collisions for the DaemonSet. The DaemonSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision. */
  collisionCount?: number;
  /* Represents the latest available observations of a DaemonSet's current state. */
  conditions?: DaemonSetCondition[];
  /* The number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/ */
  currentNumberScheduled: number;
  /* The total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod). More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/ */
  desiredNumberScheduled: number;
  /* The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and available (ready for at least spec.minReadySeconds) */
  numberAvailable?: number;
  /* The number of nodes that are running the daemon pod, but are not supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/ */
  numberMisscheduled: number;
  /* The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and ready. */
  numberReady: number;
  /* The number of nodes that should be running the daemon pod and have none of the daemon pod running and available (ready for at least spec.minReadySeconds) */
  numberUnavailable?: number;
  /* The most recent generation observed by the daemon set controller. */
  observedGeneration?: number;
  /* The total number of nodes that are running updated daemon pod */
  updatedNumberScheduled?: number;
}
/* io.k8s.api.apps.v1.DaemonSetUpdateStrategy */
/* DaemonSetUpdateStrategy is a struct used to control the update strategy for a DaemonSet. */
export interface DaemonSetUpdateStrategy {
  /* Rolling update config params. Present only if type = "RollingUpdate". */
  rollingUpdate?: RollingUpdateDaemonSet;
  /* Type of daemon set update. Can be "RollingUpdate" or "OnDelete". Default is RollingUpdate. */
  type?: string;
}
/* io.k8s.api.apps.v1.Deployment */
/* Deployment enables declarative updates for Pods and ReplicaSets. */
export interface Deployment {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of the Deployment. */
  spec?: DeploymentSpec;
  /* Most recently observed status of the Deployment. */
  status?: DeploymentStatus;
}
/* io.k8s.api.apps.v1.DeploymentCondition */
/* DeploymentCondition describes the state of a deployment at a certain point. */
export interface DeploymentCondition {
  /* Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* The last time this condition was updated. */
  lastUpdateTime?: Time;
  /* A human readable message indicating details about the transition. */
  message?: string;
  /* The reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of deployment condition. */
  type: string;
}
/* io.k8s.api.apps.v1.DeploymentList */
/* DeploymentList is a list of Deployments. */
export interface DeploymentList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of Deployments. */
  items: Deployment[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.apps.v1.DeploymentSpec */
/* DeploymentSpec is the specification of the desired behavior of the Deployment. */
export interface DeploymentSpec {
  /* Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready) */
  minReadySeconds?: number;
  /* Indicates that the deployment is paused. */
  paused?: boolean;
  /* The maximum time in seconds for a deployment to make progress before it is considered to be failed. The deployment controller will continue to process failed deployments and a condition with a ProgressDeadlineExceeded reason will be surfaced in the deployment status. Note that progress will not be estimated during the time a deployment is paused. Defaults to 600s. */
  progressDeadlineSeconds?: number;
  /* Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1. */
  replicas?: number;
  /* The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10. */
  revisionHistoryLimit?: number;
  /* Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment. It must match the pod template's labels. */
  selector: LabelSelector;
  /* The deployment strategy to use to replace existing pods with new ones. */
  strategy?: DeploymentStrategy;
  /* Template describes the pods that will be created. */
  template: PodTemplateSpec;
}
/* io.k8s.api.apps.v1.DeploymentStatus */
/* DeploymentStatus is the most recently observed status of the Deployment. */
export interface DeploymentStatus {
  /* Total number of available pods (ready for at least minReadySeconds) targeted by this deployment. */
  availableReplicas?: number;
  /* Count of hash collisions for the Deployment. The Deployment controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ReplicaSet. */
  collisionCount?: number;
  /* Represents the latest available observations of a deployment's current state. */
  conditions?: DeploymentCondition[];
  /* The generation observed by the deployment controller. */
  observedGeneration?: number;
  /* Total number of ready pods targeted by this deployment. */
  readyReplicas?: number;
  /* Total number of non-terminated pods targeted by this deployment (their labels match the selector). */
  replicas?: number;
  /* Total number of unavailable pods targeted by this deployment. This is the total number of pods that are still required for the deployment to have 100% available capacity. They may either be pods that are running but not yet available or pods that still have not been created. */
  unavailableReplicas?: number;
  /* Total number of non-terminated pods targeted by this deployment that have the desired template spec. */
  updatedReplicas?: number;
}
/* io.k8s.api.apps.v1.DeploymentStrategy */
/* DeploymentStrategy describes how to replace existing pods with new ones. */
export interface DeploymentStrategy {
  /* Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate. */
  rollingUpdate?: RollingUpdateDeployment;
  /* Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate. */
  type?: string;
}
/* io.k8s.api.apps.v1.ReplicaSet */
/* ReplicaSet ensures that a specified number of pod replicas are running at any given time. */
export interface ReplicaSet {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* If the Labels of a ReplicaSet are empty, they are defaulted to be the same as the Pod(s) that the ReplicaSet manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the specification of the desired behavior of the ReplicaSet. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: ReplicaSetSpec;
  /* Status is the most recently observed status of the ReplicaSet. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: ReplicaSetStatus;
}
/* io.k8s.api.apps.v1.ReplicaSetCondition */
/* ReplicaSetCondition describes the state of a replica set at a certain point. */
export interface ReplicaSetCondition {
  /* The last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* A human readable message indicating details about the transition. */
  message?: string;
  /* The reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of replica set condition. */
  type: string;
}
/* io.k8s.api.apps.v1.ReplicaSetList */
/* ReplicaSetList is a collection of ReplicaSets. */
export interface ReplicaSetList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of ReplicaSets. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller */
  items: ReplicaSet[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.apps.v1.ReplicaSetSpec */
/* ReplicaSetSpec is the specification of a ReplicaSet. */
export interface ReplicaSetSpec {
  /* Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready) */
  minReadySeconds?: number;
  /* Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#what-is-a-replicationcontroller */
  replicas?: number;
  /* Selector is a label query over pods that should match the replica count. Label keys and values that must match in order to be controlled by this replica set. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors */
  selector: LabelSelector;
  /* Template is the object that describes the pod that will be created if insufficient replicas are detected. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template */
  template?: PodTemplateSpec;
}
/* io.k8s.api.apps.v1.ReplicaSetStatus */
/* ReplicaSetStatus represents the current status of a ReplicaSet. */
export interface ReplicaSetStatus {
  /* The number of available replicas (ready for at least minReadySeconds) for this replica set. */
  availableReplicas?: number;
  /* Represents the latest available observations of a replica set's current state. */
  conditions?: ReplicaSetCondition[];
  /* The number of pods that have labels matching the labels of the pod template of the replicaset. */
  fullyLabeledReplicas?: number;
  /* ObservedGeneration reflects the generation of the most recently observed ReplicaSet. */
  observedGeneration?: number;
  /* The number of ready replicas for this replica set. */
  readyReplicas?: number;
  /* Replicas is the most recently oberved number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#what-is-a-replicationcontroller */
  replicas: number;
}
/* io.k8s.api.apps.v1.RollingUpdateDaemonSet */
/* Spec to control the desired behavior of daemon set rolling update. */
export interface RollingUpdateDaemonSet {
  /* The maximum number of nodes with an existing available DaemonSet pod that can have an updated DaemonSet pod during during an update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up to a minimum of 1. Default value is 0. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their a new pod created before the old pod is marked as deleted. The update starts by launching new pods on 30% of nodes. Once an updated pod is available (Ready for at least minReadySeconds) the old DaemonSet pod on that node is marked deleted. If the old pod becomes unavailable for any reason (Ready transitions to false, is evicted, or is drained) an updated pod is immediatedly created on that node without considering surge limits. Allowing surge implies the possibility that the resources consumed by the daemonset on any given node can double if the readiness check fails, and so resource intensive daemonsets should take into account that they may cause evictions during disruption. This is beta field and enabled/disabled by DaemonSetUpdateSurge feature gate. */
  maxSurge?: IntOrString;
  /* The maximum number of DaemonSet pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of total number of DaemonSet pods at the start of the update (ex: 10%). Absolute number is calculated from percentage by rounding up. This cannot be 0 if MaxSurge is 0 Default value is 1. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their pods stopped for an update at any given time. The update starts by stopping at most 30% of those DaemonSet pods and then brings up new DaemonSet pods in their place. Once the new pods are available, it then proceeds onto other DaemonSet pods, thus ensuring that at least 70% of original number of DaemonSet pods are available at all times during the update. */
  maxUnavailable?: IntOrString;
}
/* io.k8s.api.apps.v1.RollingUpdateDeployment */
/* Spec to control the desired behavior of rolling update. */
export interface RollingUpdateDeployment {
  /* The maximum number of pods that can be scheduled above the desired number of pods. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up. Defaults to 25%. Example: when this is set to 30%, the new ReplicaSet can be scaled up immediately when the rolling update starts, such that the total number of old and new pods do not exceed 130% of desired pods. Once old pods have been killed, new ReplicaSet can be scaled up further, ensuring that total number of pods running at any time during the update is at most 130% of desired pods. */
  maxSurge?: IntOrString;
  /* The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding down. This can not be 0 if MaxSurge is 0. Defaults to 25%. Example: when this is set to 30%, the old ReplicaSet can be scaled down to 70% of desired pods immediately when the rolling update starts. Once new pods are ready, old ReplicaSet can be scaled down further, followed by scaling up the new ReplicaSet, ensuring that the total number of pods available at all times during the update is at least 70% of desired pods. */
  maxUnavailable?: IntOrString;
}
/* io.k8s.api.apps.v1.RollingUpdateStatefulSetStrategy */
/* RollingUpdateStatefulSetStrategy is used to communicate parameter for RollingUpdateStatefulSetStrategyType. */
export interface RollingUpdateStatefulSetStrategy {
  /* Partition indicates the ordinal at which the StatefulSet should be partitioned. Default value is 0. */
  partition?: number;
}
/* io.k8s.api.apps.v1.StatefulSet */
/* StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.
The StatefulSet guarantees that a given network identity will always map to the same storage identity. */
export interface StatefulSet {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the desired identities of pods in this set. */
  spec?: StatefulSetSpec;
  /* Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time. */
  status?: StatefulSetStatus;
}
/* io.k8s.api.apps.v1.StatefulSetCondition */
/* StatefulSetCondition describes the state of a statefulset at a certain point. */
export interface StatefulSetCondition {
  /* Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* A human readable message indicating details about the transition. */
  message?: string;
  /* The reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of statefulset condition. */
  type: string;
}
/* io.k8s.api.apps.v1.StatefulSetList */
/* StatefulSetList is a collection of StatefulSets. */
export interface StatefulSetList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of stateful sets. */
  items: StatefulSet[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.apps.v1.StatefulSetSpec */
/* A StatefulSetSpec is the specification of a StatefulSet. */
export interface StatefulSetSpec {
  /* Minimum number of seconds for which a newly created pod should be ready without any of its container crashing for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready) This is an alpha field and requires enabling StatefulSetMinReadySeconds feature gate. */
  minReadySeconds?: number;
  /* podManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down. The default policy is `OrderedReady`, where pods are created in increasing order (pod-0, then pod-1, etc) and the controller will wait until each pod is ready before continuing. When scaling down, the pods are removed in the opposite order. The alternative policy is `Parallel` which will create pods in parallel to match the desired scale without waiting, and on scale down will delete all pods at once. */
  podManagementPolicy?: string;
  /* replicas is the desired number of replicas of the given Template. These are replicas in the sense that they are instantiations of the same Template, but individual replicas also have a consistent identity. If unspecified, defaults to 1. */
  replicas?: number;
  /* revisionHistoryLimit is the maximum number of revisions that will be maintained in the StatefulSet's revision history. The revision history consists of all revisions not represented by a currently applied StatefulSetSpec version. The default value is 10. */
  revisionHistoryLimit?: number;
  /* selector is a label query over pods that should match the replica count. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors */
  selector: LabelSelector;
  /* serviceName is the name of the service that governs this StatefulSet. This service must exist before the StatefulSet, and is responsible for the network identity of the set. Pods get DNS/hostnames that follow the pattern: pod-specific-string.serviceName.default.svc.cluster.local where "pod-specific-string" is managed by the StatefulSet controller. */
  serviceName: string;
  /* template is the object that describes the pod that will be created if insufficient replicas are detected. Each pod stamped out by the StatefulSet will fulfill this Template, but have a unique identity from the rest of the StatefulSet. */
  template: PodTemplateSpec;
  /* updateStrategy indicates the StatefulSetUpdateStrategy that will be employed to update Pods in the StatefulSet when a revision is made to Template. */
  updateStrategy?: StatefulSetUpdateStrategy;
  /* volumeClaimTemplates is a list of claims that pods are allowed to reference. The StatefulSet controller is responsible for mapping network identities to claims in a way that maintains the identity of a pod. Every claim in this list must have at least one matching (by name) volumeMount in one container in the template. A claim in this list takes precedence over any volumes in the template, with the same name. */
  volumeClaimTemplates?: PersistentVolumeClaim[];
}
/* io.k8s.api.apps.v1.StatefulSetStatus */
/* StatefulSetStatus represents the current state of a StatefulSet. */
export interface StatefulSetStatus {
  /* Total number of available pods (ready for at least minReadySeconds) targeted by this statefulset. This is an alpha field and requires enabling StatefulSetMinReadySeconds feature gate. Remove omitempty when graduating to beta */
  availableReplicas?: number;
  /* collisionCount is the count of hash collisions for the StatefulSet. The StatefulSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision. */
  collisionCount?: number;
  /* Represents the latest available observations of a statefulset's current state. */
  conditions?: StatefulSetCondition[];
  /* currentReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by currentRevision. */
  currentReplicas?: number;
  /* currentRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas). */
  currentRevision?: string;
  /* observedGeneration is the most recent generation observed for this StatefulSet. It corresponds to the StatefulSet's generation, which is updated on mutation by the API Server. */
  observedGeneration?: number;
  /* readyReplicas is the number of Pods created by the StatefulSet controller that have a Ready Condition. */
  readyReplicas?: number;
  /* replicas is the number of Pods created by the StatefulSet controller. */
  replicas: number;
  /* updateRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas) */
  updateRevision?: string;
  /* updatedReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by updateRevision. */
  updatedReplicas?: number;
}
/* io.k8s.api.apps.v1.StatefulSetUpdateStrategy */
/* StatefulSetUpdateStrategy indicates the strategy that the StatefulSet controller will use to perform updates. It includes any additional parameters necessary to perform the update for the indicated strategy. */
export interface StatefulSetUpdateStrategy {
  /* RollingUpdate is used to communicate parameters when Type is RollingUpdateStatefulSetStrategyType. */
  rollingUpdate?: RollingUpdateStatefulSetStrategy;
  /* Type indicates the type of the StatefulSetUpdateStrategy. Default is RollingUpdate. */
  type?: string;
}
/* io.k8s.api.authentication.v1.BoundObjectReference */
/* BoundObjectReference is a reference to an object that a token is bound to. */
export interface BoundObjectReference {
  /* API version of the referent. */
  apiVersion?: string;
  /* Kind of the referent. Valid kinds are 'Pod' and 'Secret'. */
  kind?: string;
  /* Name of the referent. */
  name?: string;
  /* UID of the referent. */
  uid?: string;
}
/* io.k8s.api.authentication.v1.TokenRequest */
/* TokenRequest requests a token for a given service account. */
export interface TokenRequest {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec holds information about the request being evaluated */
  spec: TokenRequestSpec;
  /* Status is filled in by the server and indicates whether the token can be authenticated. */
  status?: TokenRequestStatus;
}
/* io.k8s.api.authentication.v1.TokenRequestSpec */
/* TokenRequestSpec contains client provided parameters of a token request. */
export interface TokenRequestSpec {
  /* Audiences are the intendend audiences of the token. A recipient of a token must identitfy themself with an identifier in the list of audiences of the token, and otherwise should reject the token. A token issued for multiple audiences may be used to authenticate against any of the audiences listed but implies a high degree of trust between the target audiences. */
  audiences: string[];
  /* BoundObjectRef is a reference to an object that the token will be bound to. The token will only be valid for as long as the bound object exists. NOTE: The API server's TokenReview endpoint will validate the BoundObjectRef, but other audiences may not. Keep ExpirationSeconds small if you want prompt revocation. */
  boundObjectRef?: BoundObjectReference;
  /* ExpirationSeconds is the requested duration of validity of the request. The token issuer may return a token with a different validity duration so a client needs to check the 'expiration' field in a response. */
  expirationSeconds?: number;
}
/* io.k8s.api.authentication.v1.TokenRequestStatus */
/* TokenRequestStatus is the result of a token request. */
export interface TokenRequestStatus {
  /* ExpirationTimestamp is the time of expiration of the returned token. */
  expirationTimestamp: Time;
  /* Token is the opaque bearer token. */
  token: string;
}
/* io.k8s.api.authentication.v1.TokenReview */
/* TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver. */
export interface TokenReview {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec holds information about the request being evaluated */
  spec: TokenReviewSpec;
  /* Status is filled in by the server and indicates whether the request can be authenticated. */
  status?: TokenReviewStatus;
}
/* io.k8s.api.authentication.v1.TokenReviewSpec */
/* TokenReviewSpec is a description of the token authentication request. */
export interface TokenReviewSpec {
  /* Audiences is a list of the identifiers that the resource server presented with the token identifies as. Audience-aware token authenticators will verify that the token was intended for at least one of the audiences in this list. If no audiences are provided, the audience will default to the audience of the Kubernetes apiserver. */
  audiences?: string[];
  /* Token is the opaque bearer token. */
  token?: string;
}
/* io.k8s.api.authentication.v1.TokenReviewStatus */
/* TokenReviewStatus is the result of the token authentication request. */
export interface TokenReviewStatus {
  /* Audiences are audience identifiers chosen by the authenticator that are compatible with both the TokenReview and token. An identifier is any identifier in the intersection of the TokenReviewSpec audiences and the token's audiences. A client of the TokenReview API that sets the spec.audiences field should validate that a compatible audience identifier is returned in the status.audiences field to ensure that the TokenReview server is audience aware. If a TokenReview returns an empty status.audience field where status.authenticated is "true", the token is valid against the audience of the Kubernetes API server. */
  audiences?: string[];
  /* Authenticated indicates that the token was associated with a known user. */
  authenticated?: boolean;
  /* Error indicates that the token couldn't be checked */
  error?: string;
  /* User is the UserInfo associated with the provided token. */
  user?: UserInfo;
}
/* io.k8s.api.authentication.v1.UserInfo */
/* UserInfo holds the information about the user needed to implement the user.Info interface. */
export interface UserInfo {
  /* Any additional information provided by the authenticator. */
  extra?: {
    [key: string]: unknown;
  };
  /* The names of groups this user is a part of. */
  groups?: string[];
  /* A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs. */
  uid?: string;
  /* The name that uniquely identifies this user among all active users. */
  username?: string;
}
/* io.k8s.api.authorization.v1.LocalSubjectAccessReview */
/* LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace. Having a namespace scoped resource makes it much easier to grant namespace scoped policy that includes permissions checking. */
export interface LocalSubjectAccessReview {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec holds information about the request being evaluated.  spec.namespace must be equal to the namespace you made the request against.  If empty, it is defaulted. */
  spec: SubjectAccessReviewSpec;
  /* Status is filled in by the server and indicates whether the request is allowed or not */
  status?: SubjectAccessReviewStatus;
}
/* io.k8s.api.authorization.v1.NonResourceAttributes */
/* NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface */
export interface NonResourceAttributes {
  /* Path is the URL path of the request */
  path?: string;
  /* Verb is the standard HTTP verb */
  verb?: string;
}
/* io.k8s.api.authorization.v1.NonResourceRule */
/* NonResourceRule holds information that describes a rule for the non-resource */
export interface NonResourceRule {
  /* NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path.  "*" means all. */
  nonResourceURLs?: string[];
  /* Verb is a list of kubernetes non-resource API verbs, like: get, post, put, delete, patch, head, options.  "*" means all. */
  verbs: string[];
}
/* io.k8s.api.authorization.v1.ResourceAttributes */
/* ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface */
export interface ResourceAttributes {
  /* Group is the API Group of the Resource.  "*" means all. */
  group?: string;
  /* Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all. */
  name?: string;
  /* Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview */
  namespace?: string;
  /* Resource is one of the existing resource types.  "*" means all. */
  resource?: string;
  /* Subresource is one of the existing resource types.  "" means none. */
  subresource?: string;
  /* Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all. */
  verb?: string;
  /* Version is the API Version of the Resource.  "*" means all. */
  version?: string;
}
/* io.k8s.api.authorization.v1.ResourceRule */
/* ResourceRule is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete. */
export interface ResourceRule {
  /* APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed.  "*" means all. */
  apiGroups?: string[];
  /* ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.  "*" means all. */
  resourceNames?: string[];
  /* Resources is a list of resources this rule applies to.  "*" means all in the specified apiGroups.
   "*\/foo" represents the subresource 'foo' for all resources in the specified apiGroups. */
  resources?: string[];
  /* Verb is a list of kubernetes resource API verbs, like: get, list, watch, create, update, delete, proxy.  "*" means all. */
  verbs: string[];
}
/* io.k8s.api.authorization.v1.SelfSubjectAccessReview */
/* SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action */
export interface SelfSubjectAccessReview {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec holds information about the request being evaluated.  user and groups must be empty */
  spec: SelfSubjectAccessReviewSpec;
  /* Status is filled in by the server and indicates whether the request is allowed or not */
  status?: SubjectAccessReviewStatus;
}
/* io.k8s.api.authorization.v1.SelfSubjectAccessReviewSpec */
/* SelfSubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set */
export interface SelfSubjectAccessReviewSpec {
  /* NonResourceAttributes describes information for a non-resource access request */
  nonResourceAttributes?: NonResourceAttributes;
  /* ResourceAuthorizationAttributes describes information for a resource access request */
  resourceAttributes?: ResourceAttributes;
}
/* io.k8s.api.authorization.v1.SelfSubjectRulesReview */
/* SelfSubjectRulesReview enumerates the set of actions the current user can perform within a namespace. The returned list of actions may be incomplete depending on the server's authorization mode, and any errors experienced during the evaluation. SelfSubjectRulesReview should be used by UIs to show/hide actions, or to quickly let an end user reason about their permissions. It should NOT Be used by external systems to drive authorization decisions as this raises confused deputy, cache lifetime/revocation, and correctness concerns. SubjectAccessReview, and LocalAccessReview are the correct way to defer authorization decisions to the API server. */
export interface SelfSubjectRulesReview {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec holds information about the request being evaluated. */
  spec: SelfSubjectRulesReviewSpec;
  /* Status is filled in by the server and indicates the set of actions a user can perform. */
  status?: SubjectRulesReviewStatus;
}
/* io.k8s.api.authorization.v1.SelfSubjectRulesReviewSpec */
/* SelfSubjectRulesReviewSpec defines the specification for SelfSubjectRulesReview. */
export interface SelfSubjectRulesReviewSpec {
  /* Namespace to evaluate rules for. Required. */
  namespace?: string;
}
/* io.k8s.api.authorization.v1.SubjectAccessReview */
/* SubjectAccessReview checks whether or not a user or group can perform an action. */
export interface SubjectAccessReview {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec holds information about the request being evaluated */
  spec: SubjectAccessReviewSpec;
  /* Status is filled in by the server and indicates whether the request is allowed or not */
  status?: SubjectAccessReviewStatus;
}
/* io.k8s.api.authorization.v1.SubjectAccessReviewSpec */
/* SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set */
export interface SubjectAccessReviewSpec {
  /* Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here. */
  extra?: {
    [key: string]: unknown;
  };
  /* Groups is the groups you're testing for. */
  groups?: string[];
  /* NonResourceAttributes describes information for a non-resource access request */
  nonResourceAttributes?: NonResourceAttributes;
  /* ResourceAuthorizationAttributes describes information for a resource access request */
  resourceAttributes?: ResourceAttributes;
  /* UID information about the requesting user. */
  uid?: string;
  /* User is the user you're testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups */
  user?: string;
}
/* io.k8s.api.authorization.v1.SubjectAccessReviewStatus */
/* SubjectAccessReviewStatus */
export interface SubjectAccessReviewStatus {
  /* Allowed is required. True if the action would be allowed, false otherwise. */
  allowed: boolean;
  /* Denied is optional. True if the action would be denied, otherwise false. If both allowed is false and denied is false, then the authorizer has no opinion on whether to authorize the action. Denied may not be true if Allowed is true. */
  denied?: boolean;
  /* EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request. */
  evaluationError?: string;
  /* Reason is optional.  It indicates why a request was allowed or denied. */
  reason?: string;
}
/* io.k8s.api.authorization.v1.SubjectRulesReviewStatus */
/* SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it's safe to assume the subject has that permission, even if that list is incomplete. */
export interface SubjectRulesReviewStatus {
  /* EvaluationError can appear in combination with Rules. It indicates an error occurred during rule evaluation, such as an authorizer that doesn't support rule evaluation, and that ResourceRules and/or NonResourceRules may be incomplete. */
  evaluationError?: string;
  /* Incomplete is true when the rules returned by this call are incomplete. This is most commonly encountered when an authorizer, such as an external authorizer, doesn't support rules evaluation. */
  incomplete: boolean;
  /* NonResourceRules is the list of actions the subject is allowed to perform on non-resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete. */
  nonResourceRules: NonResourceRule[];
  /* ResourceRules is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete. */
  resourceRules: ResourceRule[];
}
/* io.k8s.api.autoscaling.v1.CrossVersionObjectReference */
/* CrossVersionObjectReference contains enough information to let you identify the referred resource. */
export interface CrossVersionObjectReference {
  /* API version of the referent */
  apiVersion?: string;
  /* Kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds" */
  kind: string;
  /* Name of the referent; More info: http://kubernetes.io/docs/user-guide/identifiers#names */
  name: string;
}
/* io.k8s.api.autoscaling.v1.HorizontalPodAutoscaler */
/* configuration of a horizontal pod autoscaler. */
export interface HorizontalPodAutoscaler {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* behaviour of autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. */
  spec?: HorizontalPodAutoscalerSpec;
  /* current information about the autoscaler. */
  status?: HorizontalPodAutoscalerStatus;
}
/* io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerList */
/* list of horizontal pod autoscaler objects. */
export interface HorizontalPodAutoscalerList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* list of horizontal pod autoscaler objects. */
  items: HorizontalPodAutoscaler[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerSpec */
/* specification of a horizontal pod autoscaler. */
export interface HorizontalPodAutoscalerSpec {
  /* upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas. */
  maxReplicas: number;
  /* minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available. */
  minReplicas?: number;
  /* reference to scaled resource; horizontal pod autoscaler will learn the current resource consumption and will set the desired number of pods by using its Scale subresource. */
  scaleTargetRef: CrossVersionObjectReference;
  /* target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the default autoscaling policy will be used. */
  targetCPUUtilizationPercentage?: number;
}
/* io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerStatus */
/* current status of a horizontal pod autoscaler */
export interface HorizontalPodAutoscalerStatus {
  /* current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU. */
  currentCPUUtilizationPercentage?: number;
  /* current number of replicas of pods managed by this autoscaler. */
  currentReplicas: number;
  /* desired number of replicas of pods managed by this autoscaler. */
  desiredReplicas: number;
  /* last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed. */
  lastScaleTime?: Time;
  /* most recent generation observed by this autoscaler. */
  observedGeneration?: number;
}
/* io.k8s.api.autoscaling.v1.Scale */
/* Scale represents a scaling request for a resource. */
export interface Scale {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata. */
  metadata?: ObjectMeta;
  /* defines the behavior of the scale. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. */
  spec?: ScaleSpec;
  /* current status of the scale. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. Read-only. */
  status?: ScaleStatus;
}
/* io.k8s.api.autoscaling.v1.ScaleSpec */
/* ScaleSpec describes the attributes of a scale subresource. */
export interface ScaleSpec {
  /* desired number of instances for the scaled object. */
  replicas?: number;
}
/* io.k8s.api.autoscaling.v1.ScaleStatus */
/* ScaleStatus represents the current status of a scale subresource. */
export interface ScaleStatus {
  /* actual number of observed instances of the scaled object. */
  replicas: number;
  /* label query over pods that should match the replicas count. This is same as the label selector but in the string format to avoid introspection by clients. The string will be in the same format as the query-param syntax. More info about label selectors: http://kubernetes.io/docs/user-guide/labels#label-selectors */
  selector?: string;
}
/* io.k8s.api.autoscaling.v2beta2.ContainerResourceMetricSource */
/* ContainerResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set. */
export interface ContainerResourceMetricSource {
  /* container is the name of the container in the pods of the scaling target */
  container: string;
  /* name is the name of the resource in question. */
  name: string;
  /* target specifies the target value for the given metric */
  target: MetricTarget;
}
/* io.k8s.api.autoscaling.v2beta2.ContainerResourceMetricStatus */
/* ContainerResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing a single container in each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. */
export interface ContainerResourceMetricStatus {
  /* Container is the name of the container in the pods of the scaling target */
  container: string;
  /* current contains the current value for the given metric */
  current: MetricValueStatus;
  /* Name is the name of the resource in question. */
  name: string;
}
/* io.k8s.api.autoscaling.v2beta2.CrossVersionObjectReference */
/* CrossVersionObjectReference contains enough information to let you identify the referred resource. */
export interface CrossVersionObjectReference {
  /* API version of the referent */
  apiVersion?: string;
  /* Kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds" */
  kind: string;
  /* Name of the referent; More info: http://kubernetes.io/docs/user-guide/identifiers#names */
  name: string;
}
/* io.k8s.api.autoscaling.v2beta2.ExternalMetricSource */
/* ExternalMetricSource indicates how to scale on a metric not associated with any Kubernetes object (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster). */
export interface ExternalMetricSource {
  /* metric identifies the target metric by name and selector */
  metric: MetricIdentifier;
  /* target specifies the target value for the given metric */
  target: MetricTarget;
}
/* io.k8s.api.autoscaling.v2beta2.ExternalMetricStatus */
/* ExternalMetricStatus indicates the current value of a global metric not associated with any Kubernetes object. */
export interface ExternalMetricStatus {
  /* current contains the current value for the given metric */
  current: MetricValueStatus;
  /* metric identifies the target metric by name and selector */
  metric: MetricIdentifier;
}
/* io.k8s.api.autoscaling.v2beta2.HPAScalingPolicy */
/* HPAScalingPolicy is a single policy which must hold true for a specified past interval. */
export interface HPAScalingPolicy {
  /* PeriodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min). */
  periodSeconds: number;
  /* Type is used to specify the scaling policy. */
  type: string;
  /* Value contains the amount of change which is permitted by the policy. It must be greater than zero */
  value: number;
}
/* io.k8s.api.autoscaling.v2beta2.HPAScalingRules */
/* HPAScalingRules configures the scaling behavior for one direction. These Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen. */
export interface HPAScalingRules {
  /* policies is a list of potential scaling polices which can be used during scaling. At least one policy must be specified, otherwise the HPAScalingRules will be discarded as invalid */
  policies?: HPAScalingPolicy[];
  /* selectPolicy is used to specify which policy should be used. If not set, the default value MaxPolicySelect is used. */
  selectPolicy?: string;
  /* StabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long). */
  stabilizationWindowSeconds?: number;
}
/* io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscaler */
/* HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified. */
export interface HorizontalPodAutoscaler {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* metadata is the standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* spec is the specification for the behaviour of the autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. */
  spec?: HorizontalPodAutoscalerSpec;
  /* status is the current information about the autoscaler. */
  status?: HorizontalPodAutoscalerStatus;
}
/* io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerBehavior */
/* HorizontalPodAutoscalerBehavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively). */
export interface HorizontalPodAutoscalerBehavior {
  /* scaleDown is scaling policy for scaling Down. If not set, the default value is to allow to scale down to minReplicas pods, with a 300 second stabilization window (i.e., the highest recommendation for the last 300sec is used). */
  scaleDown?: HPAScalingRules;
  /* scaleUp is scaling policy for scaling Up. If not set, the default value is the higher of:
    * increase no more than 4 pods per 60 seconds
    * double the number of pods per 60 seconds
  No stabilization is used. */
  scaleUp?: HPAScalingRules;
}
/* io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerCondition */
/* HorizontalPodAutoscalerCondition describes the state of a HorizontalPodAutoscaler at a certain point. */
export interface HorizontalPodAutoscalerCondition {
  /* lastTransitionTime is the last time the condition transitioned from one status to another */
  lastTransitionTime?: Time;
  /* message is a human-readable explanation containing details about the transition */
  message?: string;
  /* reason is the reason for the condition's last transition. */
  reason?: string;
  /* status is the status of the condition (True, False, Unknown) */
  status: string;
  /* type describes the current condition */
  type: string;
}
/* io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerList */
/* HorizontalPodAutoscalerList is a list of horizontal pod autoscaler objects. */
export interface HorizontalPodAutoscalerList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is the list of horizontal pod autoscaler objects. */
  items: HorizontalPodAutoscaler[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* metadata is the standard list metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerSpec */
/* HorizontalPodAutoscalerSpec describes the desired functionality of the HorizontalPodAutoscaler. */
export interface HorizontalPodAutoscalerSpec {
  /* behavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively). If not set, the default HPAScalingRules for scale up and scale down are used. */
  behavior?: HorizontalPodAutoscalerBehavior;
  /* maxReplicas is the upper limit for the number of replicas to which the autoscaler can scale up. It cannot be less that minReplicas. */
  maxReplicas: number;
  /* metrics contains the specifications for which to use to calculate the desired replica count (the maximum replica count across all metrics will be used).  The desired replica count is calculated multiplying the ratio between the target value and the current value by the current number of pods.  Ergo, metrics used must decrease as the pod count is increased, and vice-versa.  See the individual metric source types for more information about how each type of metric must respond. If not set, the default metric will be set to 80% average CPU utilization. */
  metrics?: MetricSpec[];
  /* minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available. */
  minReplicas?: number;
  /* scaleTargetRef points to the target resource to scale, and is used to the pods for which metrics should be collected, as well as to actually change the replica count. */
  scaleTargetRef: CrossVersionObjectReference;
}
/* io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerStatus */
/* HorizontalPodAutoscalerStatus describes the current status of a horizontal pod autoscaler. */
export interface HorizontalPodAutoscalerStatus {
  /* conditions is the set of conditions required for this autoscaler to scale its target, and indicates whether or not those conditions are met. */
  conditions: HorizontalPodAutoscalerCondition[];
  /* currentMetrics is the last read state of the metrics used by this autoscaler. */
  currentMetrics?: MetricStatus[];
  /* currentReplicas is current number of replicas of pods managed by this autoscaler, as last seen by the autoscaler. */
  currentReplicas: number;
  /* desiredReplicas is the desired number of replicas of pods managed by this autoscaler, as last calculated by the autoscaler. */
  desiredReplicas: number;
  /* lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods, used by the autoscaler to control how often the number of pods is changed. */
  lastScaleTime?: Time;
  /* observedGeneration is the most recent generation observed by this autoscaler. */
  observedGeneration?: number;
}
/* io.k8s.api.autoscaling.v2beta2.MetricIdentifier */
/* MetricIdentifier defines the name and optionally selector for a metric */
export interface MetricIdentifier {
  /* name is the name of the given metric */
  name: string;
  /* selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics. */
  selector?: LabelSelector;
}
/* io.k8s.api.autoscaling.v2beta2.MetricSpec */
/* MetricSpec specifies how to scale based on a single metric (only `type` and one other matching field should be set at once). */
export interface MetricSpec {
  /* container resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod of the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. This is an alpha feature and can be enabled by the HPAContainerMetrics feature flag. */
  containerResource?: ContainerResourceMetricSource;
  /* external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster). */
  external?: ExternalMetricSource;
  /* object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object). */
  object?: ObjectMetricSource;
  /* pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value. */
  pods?: PodsMetricSource;
  /* resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. */
  resource?: ResourceMetricSource;
  /* type is the type of metric source.  It should be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each mapping to a matching field in the object. Note: "ContainerResource" type is available on when the feature-gate HPAContainerMetrics is enabled */
  type: string;
}
/* io.k8s.api.autoscaling.v2beta2.MetricStatus */
/* MetricStatus describes the last-read state of a single metric. */
export interface MetricStatus {
  /* container resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. */
  containerResource?: ContainerResourceMetricStatus;
  /* external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster). */
  external?: ExternalMetricStatus;
  /* object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object). */
  object?: ObjectMetricStatus;
  /* pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value. */
  pods?: PodsMetricStatus;
  /* resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. */
  resource?: ResourceMetricStatus;
  /* type is the type of metric source.  It will be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each corresponds to a matching field in the object. Note: "ContainerResource" type is available on when the feature-gate HPAContainerMetrics is enabled */
  type: string;
}
/* io.k8s.api.autoscaling.v2beta2.MetricTarget */
/* MetricTarget defines the target value, average value, or average utilization of a specific metric */
export interface MetricTarget {
  /* averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type */
  averageUtilization?: number;
  /* averageValue is the target value of the average of the metric across all relevant pods (as a quantity) */
  averageValue?: Quantity;
  /* type represents whether the metric type is Utilization, Value, or AverageValue */
  type: string;
  /* value is the target value of the metric (as a quantity). */
  value?: Quantity;
}
/* io.k8s.api.autoscaling.v2beta2.MetricValueStatus */
/* MetricValueStatus holds the current value for a metric */
export interface MetricValueStatus {
  /* currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. */
  averageUtilization?: number;
  /* averageValue is the current value of the average of the metric across all relevant pods (as a quantity) */
  averageValue?: Quantity;
  /* value is the current value of the metric (as a quantity). */
  value?: Quantity;
}
/* io.k8s.api.autoscaling.v2beta2.ObjectMetricSource */
/* ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object). */
export interface ObjectMetricSource {
  describedObject: CrossVersionObjectReference;
  /* metric identifies the target metric by name and selector */
  metric: MetricIdentifier;
  /* target specifies the target value for the given metric */
  target: MetricTarget;
}
/* io.k8s.api.autoscaling.v2beta2.ObjectMetricStatus */
/* ObjectMetricStatus indicates the current value of a metric describing a kubernetes object (for example, hits-per-second on an Ingress object). */
export interface ObjectMetricStatus {
  /* current contains the current value for the given metric */
  current: MetricValueStatus;
  describedObject: CrossVersionObjectReference;
  /* metric identifies the target metric by name and selector */
  metric: MetricIdentifier;
}
/* io.k8s.api.autoscaling.v2beta2.PodsMetricSource */
/* PodsMetricSource indicates how to scale on a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value. */
export interface PodsMetricSource {
  /* metric identifies the target metric by name and selector */
  metric: MetricIdentifier;
  /* target specifies the target value for the given metric */
  target: MetricTarget;
}
/* io.k8s.api.autoscaling.v2beta2.PodsMetricStatus */
/* PodsMetricStatus indicates the current value of a metric describing each pod in the current scale target (for example, transactions-processed-per-second). */
export interface PodsMetricStatus {
  /* current contains the current value for the given metric */
  current: MetricValueStatus;
  /* metric identifies the target metric by name and selector */
  metric: MetricIdentifier;
}
/* io.k8s.api.autoscaling.v2beta2.ResourceMetricSource */
/* ResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set. */
export interface ResourceMetricSource {
  /* name is the name of the resource in question. */
  name: string;
  /* target specifies the target value for the given metric */
  target: MetricTarget;
}
/* io.k8s.api.autoscaling.v2beta2.ResourceMetricStatus */
/* ResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. */
export interface ResourceMetricStatus {
  /* current contains the current value for the given metric */
  current: MetricValueStatus;
  /* Name is the name of the resource in question. */
  name: string;
}
/* io.k8s.api.batch.v1.CronJob */
/* CronJob represents the configuration of a single cron job. */
export interface CronJob {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of a cron job, including the schedule. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: CronJobSpec;
  /* Current status of a cron job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: CronJobStatus;
}
/* io.k8s.api.batch.v1.CronJobList */
/* CronJobList is a collection of cron jobs. */
export interface CronJobList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is the list of CronJobs. */
  items: CronJob[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.batch.v1.CronJobSpec */
/* CronJobSpec describes how the job execution will look like and when it will actually run. */
export interface CronJobSpec {
  /* Specifies how to treat concurrent executions of a Job. Valid values are: - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one */
  concurrencyPolicy?: string;
  /* The number of failed finished jobs to retain. Value must be non-negative integer. Defaults to 1. */
  failedJobsHistoryLimit?: number;
  /* Specifies the job that will be created when executing a CronJob. */
  jobTemplate: JobTemplateSpec;
  /* The schedule in Cron format, see https://en.wikipedia.org/wiki/Cron. */
  schedule: string;
  /* Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones. */
  startingDeadlineSeconds?: number;
  /* The number of successful finished jobs to retain. Value must be non-negative integer. Defaults to 3. */
  successfulJobsHistoryLimit?: number;
  /* This flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false. */
  suspend?: boolean;
}
/* io.k8s.api.batch.v1.CronJobStatus */
/* CronJobStatus represents the current state of a cron job. */
export interface CronJobStatus {
  /* A list of pointers to currently running jobs. */
  active?: ObjectReference[];
  /* Information when was the last time the job was successfully scheduled. */
  lastScheduleTime?: Time;
  /* Information when was the last time the job successfully completed. */
  lastSuccessfulTime?: Time;
}
/* io.k8s.api.batch.v1.Job */
/* Job represents the configuration of a single job. */
export interface Job {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: JobSpec;
  /* Current status of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: JobStatus;
}
/* io.k8s.api.batch.v1.JobCondition */
/* JobCondition describes current state of a job. */
export interface JobCondition {
  /* Last time the condition was checked. */
  lastProbeTime?: Time;
  /* Last time the condition transit from one status to another. */
  lastTransitionTime?: Time;
  /* Human readable message indicating details about last transition. */
  message?: string;
  /* (brief) reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of job condition, Complete or Failed. */
  type: string;
}
/* io.k8s.api.batch.v1.JobList */
/* JobList is a collection of jobs. */
export interface JobList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is the list of Jobs. */
  items: Job[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.batch.v1.JobSpec */
/* JobSpec describes how the job execution will look like. */
export interface JobSpec {
  /* Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be positive integer. If a Job is suspended (at creation or through an update), this timer will effectively be stopped and reset when the Job is resumed again. */
  activeDeadlineSeconds?: number;
  /* Specifies the number of retries before marking this job failed. Defaults to 6 */
  backoffLimit?: number;
  /* CompletionMode specifies how Pod completions are tracked. It can be `NonIndexed` (default) or `Indexed`.
  
  `NonIndexed` means that the Job is considered complete when there have been .spec.completions successfully completed Pods. Each Pod completion is homologous to each other.
  
  `Indexed` means that the Pods of a Job get an associated completion index from 0 to (.spec.completions - 1), available in the annotation batch.kubernetes.io/job-completion-index. The Job is considered complete when there is one successfully completed Pod for each index. When value is `Indexed`, .spec.completions must be specified and `.spec.parallelism` must be less than or equal to 10^5. In addition, The Pod name takes the form `$(job-name)-$(index)-$(random-string)`, the Pod hostname takes the form `$(job-name)-$(index)`.
  
  This field is beta-level. More completion modes can be added in the future. If the Job controller observes a mode that it doesn't recognize, the controller skips updates for the Job. */
  completionMode?: string;
  /* Specifies the desired number of successfully finished pods the job should be run with.  Setting to nil means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ */
  completions?: number;
  /* manualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector */
  manualSelector?: boolean;
  /* Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ */
  parallelism?: number;
  /* A label query over pods that should match the pod count. Normally, the system sets this field for you. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors */
  selector?: LabelSelector;
  /* Suspend specifies whether the Job controller should create Pods or not. If a Job is created with suspend set to true, no Pods are created by the Job controller. If a Job is suspended after creation (i.e. the flag goes from false to true), the Job controller will delete all active Pods associated with this Job. Users must design their workload to gracefully handle this. Suspending a Job will reset the StartTime field of the Job, effectively resetting the ActiveDeadlineSeconds timer too. Defaults to false.
  
  This field is beta-level, gated by SuspendJob feature flag (enabled by default). */
  suspend?: boolean;
  /* Describes the pod that will be created when executing a job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ */
  template: PodTemplateSpec;
  /* ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes. This field is alpha-level and is only honored by servers that enable the TTLAfterFinished feature. */
  ttlSecondsAfterFinished?: number;
}
/* io.k8s.api.batch.v1.JobStatus */
/* JobStatus represents the current state of a Job. */
export interface JobStatus {
  /* The number of actively running pods. */
  active?: number;
  /* CompletedIndexes holds the completed indexes when .spec.completionMode = "Indexed" in a text format. The indexes are represented as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7". */
  completedIndexes?: string;
  /* Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. The completion time is only set when the job finishes successfully. */
  completionTime?: Time;
  /* The latest available observations of an object's current state. When a Job fails, one of the conditions will have type "Failed" and status true. When a Job is suspended, one of the conditions will have type "Suspended" and status true; when the Job is resumed, the status of this condition will become false. When a Job is completed, one of the conditions will have type "Complete" and status true. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ */
  conditions?: JobCondition[];
  /* The number of pods which reached phase Failed. */
  failed?: number;
  /* Represents time when the job controller started processing a job. When a Job is created in the suspended state, this field is not set until the first time it is resumed. This field is reset every time a Job is resumed from suspension. It is represented in RFC3339 form and is in UTC. */
  startTime?: Time;
  /* The number of pods which reached phase Succeeded. */
  succeeded?: number;
  /* UncountedTerminatedPods holds the UIDs of Pods that have terminated but the job controller hasn't yet accounted for in the status counters.
  
  The job controller creates pods with a finalizer. When a pod terminates (succeeded or failed), the controller does three steps to account for it in the job status: (1) Add the pod UID to the arrays in this field. (2) Remove the pod finalizer. (3) Remove the pod UID from the arrays while increasing the corresponding
      counter.
  
  This field is alpha-level. The job controller only makes use of this field when the feature gate PodTrackingWithFinalizers is enabled. Old jobs might not be tracked using this field, in which case the field remains null. */
  uncountedTerminatedPods?: UncountedTerminatedPods;
}
/* io.k8s.api.batch.v1.JobTemplateSpec */
/* JobTemplateSpec describes the data a Job should have when created from a template */
export interface JobTemplateSpec {
  /* Standard object's metadata of the jobs created from this template. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of the job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: JobSpec;
}
/* io.k8s.api.batch.v1.UncountedTerminatedPods */
/* UncountedTerminatedPods holds UIDs of Pods that have terminated but haven't been accounted in Job status counters. */
export interface UncountedTerminatedPods {
  /* Failed holds UIDs of failed Pods. */
  failed?: string[];
  /* Succeeded holds UIDs of succeeded Pods. */
  succeeded?: string[];
}
/* io.k8s.api.certificates.v1.CertificateSigningRequest */
/* CertificateSigningRequest objects provide a mechanism to obtain x509 certificates by submitting a certificate signing request, and having it asynchronously approved and issued.

Kubelets use this API to obtain:
 1. client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client-kubelet" signerName).
 2. serving certificates for TLS endpoints kube-apiserver can connect to securely (with the "kubernetes.io/kubelet-serving" signerName).

This API can be used to request client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client" signerName), or to obtain certificates from custom non-Kubernetes signers. */
export interface CertificateSigningRequest {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  metadata?: ObjectMeta;
  /* spec contains the certificate request, and is immutable after creation. Only the request, signerName, expirationSeconds, and usages fields can be set on creation. Other fields are derived by Kubernetes and cannot be modified by users. */
  spec: CertificateSigningRequestSpec;
  /* status contains information about whether the request is approved or denied, and the certificate issued by the signer, or the failure condition indicating signer failure. */
  status?: CertificateSigningRequestStatus;
}
/* io.k8s.api.certificates.v1.CertificateSigningRequestCondition */
/* CertificateSigningRequestCondition describes a condition of a CertificateSigningRequest object */
export interface CertificateSigningRequestCondition {
  /* lastTransitionTime is the time the condition last transitioned from one status to another. If unset, when a new condition type is added or an existing condition's status is changed, the server defaults this to the current time. */
  lastTransitionTime?: Time;
  /* lastUpdateTime is the time of the last update to this condition */
  lastUpdateTime?: Time;
  /* message contains a human readable message with details about the request state */
  message?: string;
  /* reason indicates a brief reason for the request state */
  reason?: string;
  /* status of the condition, one of True, False, Unknown. Approved, Denied, and Failed conditions may not be "False" or "Unknown". */
  status: string;
  /* type of the condition. Known conditions are "Approved", "Denied", and "Failed".
  
  An "Approved" condition is added via the /approval subresource, indicating the request was approved and should be issued by the signer.
  
  A "Denied" condition is added via the /approval subresource, indicating the request was denied and should not be issued by the signer.
  
  A "Failed" condition is added via the /status subresource, indicating the signer failed to issue the certificate.
  
  Approved and Denied conditions are mutually exclusive. Approved, Denied, and Failed conditions cannot be removed once added.
  
  Only one condition of a given type is allowed. */
  type: string;
}
/* io.k8s.api.certificates.v1.CertificateSigningRequestList */
/* CertificateSigningRequestList is a collection of CertificateSigningRequest objects */
export interface CertificateSigningRequestList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is a collection of CertificateSigningRequest objects */
  items: CertificateSigningRequest[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  metadata?: ListMeta;
}
/* io.k8s.api.certificates.v1.CertificateSigningRequestSpec */
/* CertificateSigningRequestSpec contains the certificate request. */
export interface CertificateSigningRequestSpec {
  /* expirationSeconds is the requested duration of validity of the issued certificate. The certificate signer may issue a certificate with a different validity duration so a client must check the delta between the notBefore and and notAfter fields in the issued certificate to determine the actual duration.
  
  The v1.22+ in-tree implementations of the well-known Kubernetes signers will honor this field as long as the requested duration is not greater than the maximum duration they will honor per the --cluster-signing-duration CLI flag to the Kubernetes controller manager.
  
  Certificate signers may not honor this field for various reasons:
  
    1. Old signer that is unaware of the field (such as the in-tree
       implementations prior to v1.22)
    2. Signer whose configured maximum is shorter than the requested duration
    3. Signer whose configured minimum is longer than the requested duration
  
  The minimum valid value for expirationSeconds is 600, i.e. 10 minutes.
  
  As of v1.22, this field is beta and is controlled via the CSRDuration feature gate. */
  expirationSeconds?: number;
  /* extra contains extra attributes of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable. */
  extra?: {
    [key: string]: unknown;
  };
  /* groups contains group membership of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable. */
  groups?: string[];
  /* request contains an x509 certificate signing request encoded in a "CERTIFICATE REQUEST" PEM block. When serialized as JSON or YAML, the data is additionally base64-encoded. */
  request: string;
  /* signerName indicates the requested signer, and is a qualified name.
  
  List/watch requests for CertificateSigningRequests can filter on this field using a "spec.signerName=NAME" fieldSelector.
  
  Well-known Kubernetes signers are:
   1. "kubernetes.io/kube-apiserver-client": issues client certificates that can be used to authenticate to kube-apiserver.
    Requests for this signer are never auto-approved by kube-controller-manager, can be issued by the "csrsigning" controller in kube-controller-manager.
   2. "kubernetes.io/kube-apiserver-client-kubelet": issues client certificates that kubelets use to authenticate to kube-apiserver.
    Requests for this signer can be auto-approved by the "csrapproving" controller in kube-controller-manager, and can be issued by the "csrsigning" controller in kube-controller-manager.
   3. "kubernetes.io/kubelet-serving" issues serving certificates that kubelets use to serve TLS endpoints, which kube-apiserver can connect to securely.
    Requests for this signer are never auto-approved by kube-controller-manager, and can be issued by the "csrsigning" controller in kube-controller-manager.
  
  More details are available at https://k8s.io/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers
  
  Custom signerNames can also be specified. The signer defines:
   1. Trust distribution: how trust (CA bundles) are distributed.
   2. Permitted subjects: and behavior when a disallowed subject is requested.
   3. Required, permitted, or forbidden x509 extensions in the request (including whether subjectAltNames are allowed, which types, restrictions on allowed values) and behavior when a disallowed extension is requested.
   4. Required, permitted, or forbidden key usages / extended key usages.
   5. Expiration/certificate lifetime: whether it is fixed by the signer, configurable by the admin.
   6. Whether or not requests for CA certificates are allowed. */
  signerName: string;
  /* uid contains the uid of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable. */
  uid?: string;
  /* usages specifies a set of key usages requested in the issued certificate.
  
  Requests for TLS client certificates typically request: "digital signature", "key encipherment", "client auth".
  
  Requests for TLS serving certificates typically request: "key encipherment", "digital signature", "server auth".
  
  Valid values are:
   "signing", "digital signature", "content commitment",
   "key encipherment", "key agreement", "data encipherment",
   "cert sign", "crl sign", "encipher only", "decipher only", "any",
   "server auth", "client auth",
   "code signing", "email protection", "s/mime",
   "ipsec end system", "ipsec tunnel", "ipsec user",
   "timestamping", "ocsp signing", "microsoft sgc", "netscape sgc" */
  usages?: string[];
  /* username contains the name of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable. */
  username?: string;
}
/* io.k8s.api.certificates.v1.CertificateSigningRequestStatus */
/* CertificateSigningRequestStatus contains conditions used to indicate approved/denied/failed status of the request, and the issued certificate. */
export interface CertificateSigningRequestStatus {
  /* certificate is populated with an issued certificate by the signer after an Approved condition is present. This field is set via the /status subresource. Once populated, this field is immutable.
  
  If the certificate signing request is denied, a condition of type "Denied" is added and this field remains empty. If the signer cannot issue the certificate, a condition of type "Failed" is added and this field remains empty.
  
  Validation requirements:
   1. certificate must contain one or more PEM blocks.
   2. All PEM blocks must have the "CERTIFICATE" label, contain no headers, and the encoded data
    must be a BER-encoded ASN.1 Certificate structure as described in section 4 of RFC5280.
   3. Non-PEM content may appear before or after the "CERTIFICATE" PEM blocks and is unvalidated,
    to allow for explanatory text as described in section 5.2 of RFC7468.
  
  If more than one PEM block is present, and the definition of the requested spec.signerName does not indicate otherwise, the first block is the issued certificate, and subsequent blocks should be treated as intermediate certificates and presented in TLS handshakes.
  
  The certificate is encoded in PEM format.
  
  When serialized as JSON or YAML, the data is additionally base64-encoded, so it consists of:
  
      base64(
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
      ) */
  certificate?: string;
  /* conditions applied to the request. Known conditions are "Approved", "Denied", and "Failed". */
  conditions?: CertificateSigningRequestCondition[];
}
/* io.k8s.api.coordination.v1.Lease */
/* Lease defines a lease concept. */
export interface Lease {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the Lease. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: LeaseSpec;
}
/* io.k8s.api.coordination.v1.LeaseList */
/* LeaseList is a list of Lease objects. */
export interface LeaseList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of schema objects. */
  items: Lease[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.coordination.v1.LeaseSpec */
/* LeaseSpec is a specification of a Lease. */
export interface LeaseSpec {
  /* acquireTime is a time when the current lease was acquired. */
  acquireTime?: MicroTime;
  /* holderIdentity contains the identity of the holder of a current lease. */
  holderIdentity?: string;
  /* leaseDurationSeconds is a duration that candidates for a lease need to wait to force acquire it. This is measure against time of last observed RenewTime. */
  leaseDurationSeconds?: number;
  /* leaseTransitions is the number of transitions of a lease between holders. */
  leaseTransitions?: number;
  /* renewTime is a time when the current holder of a lease has last updated the lease. */
  renewTime?: MicroTime;
}
/* io.k8s.api.core.v1.AWSElasticBlockStoreVolumeSource */
/* Represents a Persistent Disk resource in AWS.

An AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling. */
export interface AWSElasticBlockStoreVolumeSource {
  /* Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
  fsType?: string;
  /* The partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). */
  partition?: number;
  /* Specify "true" to force and set the ReadOnly property in VolumeMounts to "true". If omitted, the default is "false". More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
  readOnly?: boolean;
  /* Unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
  volumeID: string;
}
/* io.k8s.api.core.v1.Affinity */
/* Affinity is a group of affinity scheduling rules. */
export interface Affinity {
  /* Describes node affinity scheduling rules for the pod. */
  nodeAffinity?: NodeAffinity;
  /* Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)). */
  podAffinity?: PodAffinity;
  /* Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)). */
  podAntiAffinity?: PodAntiAffinity;
}
/* io.k8s.api.core.v1.AttachedVolume */
/* AttachedVolume describes a volume attached to a node */
export interface AttachedVolume {
  /* DevicePath represents the device path where the volume should be available */
  devicePath: string;
  /* Name of the attached volume */
  name: string;
}
/* io.k8s.api.core.v1.AzureDiskVolumeSource */
/* AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. */
export interface AzureDiskVolumeSource {
  /* Host Caching mode: None, Read Only, Read Write. */
  cachingMode?: string;
  /* The Name of the data disk in the blob storage */
  diskName: string;
  /* The URI the data disk in the blob storage */
  diskURI: string;
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* Expected values Shared: multiple blob disks per storage account  Dedicated: single blob disk per storage account  Managed: azure managed data disk (only in managed availability set). defaults to shared */
  kind?: string;
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
}
/* io.k8s.api.core.v1.AzureFilePersistentVolumeSource */
/* AzureFile represents an Azure File Service mount on the host and bind mount to the pod. */
export interface AzureFilePersistentVolumeSource {
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* the name of secret that contains Azure Storage Account Name and Key */
  secretName: string;
  /* the namespace of the secret that contains Azure Storage Account Name and Key default is the same as the Pod */
  secretNamespace?: string;
  /* Share Name */
  shareName: string;
}
/* io.k8s.api.core.v1.AzureFileVolumeSource */
/* AzureFile represents an Azure File Service mount on the host and bind mount to the pod. */
export interface AzureFileVolumeSource {
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* the name of secret that contains Azure Storage Account Name and Key */
  secretName: string;
  /* Share Name */
  shareName: string;
}
/* io.k8s.api.core.v1.Binding */
/* Binding ties one object to another; for example, a pod is bound to a node by a scheduler. Deprecated in 1.7, please use the bindings subresource of pods instead. */
export interface Binding {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* The target object that you want to bind to the standard object. */
  target: ObjectReference;
}
/* io.k8s.api.core.v1.CSIPersistentVolumeSource */
/* Represents storage that is managed by an external CSI volume driver (Beta feature) */
export interface CSIPersistentVolumeSource {
  /* ControllerExpandSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI ControllerExpandVolume call. This is an alpha field and requires enabling ExpandCSIVolumes feature gate. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed. */
  controllerExpandSecretRef?: SecretReference;
  /* ControllerPublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI ControllerPublishVolume and ControllerUnpublishVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed. */
  controllerPublishSecretRef?: SecretReference;
  /* Driver is the name of the driver to use for this volume. Required. */
  driver: string;
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". */
  fsType?: string;
  /* NodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed. */
  nodePublishSecretRef?: SecretReference;
  /* NodeStageSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodeStageVolume and NodeStageVolume and NodeUnstageVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed. */
  nodeStageSecretRef?: SecretReference;
  /* Optional: The value to pass to ControllerPublishVolumeRequest. Defaults to false (read/write). */
  readOnly?: boolean;
  /* Attributes of the volume to publish. */
  volumeAttributes?: {
    [key: string]: unknown;
  };
  /* VolumeHandle is the unique volume name returned by the CSI volume plugin’s CreateVolume to refer to the volume on all subsequent calls. Required. */
  volumeHandle: string;
}
/* io.k8s.api.core.v1.CSIVolumeSource */
/* Represents a source location of a volume to mount, managed by an external CSI driver */
export interface CSIVolumeSource {
  /* Driver is the name of the CSI driver that handles this volume. Consult with your admin for the correct name as registered in the cluster. */
  driver: string;
  /* Filesystem type to mount. Ex. "ext4", "xfs", "ntfs". If not provided, the empty value is passed to the associated CSI driver which will determine the default filesystem to apply. */
  fsType?: string;
  /* NodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed. */
  nodePublishSecretRef?: LocalObjectReference;
  /* Specifies a read-only configuration for the volume. Defaults to false (read/write). */
  readOnly?: boolean;
  /* VolumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values. */
  volumeAttributes?: {
    [key: string]: unknown;
  };
}
/* io.k8s.api.core.v1.Capabilities */
/* Adds and removes POSIX capabilities from running containers. */
export interface Capabilities {
  /* Added capabilities */
  add?: string[];
  /* Removed capabilities */
  drop?: string[];
}
/* io.k8s.api.core.v1.CephFSPersistentVolumeSource */
/* Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling. */
export interface CephFSPersistentVolumeSource {
  /* Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  monitors: string[];
  /* Optional: Used as the mounted root, rather than the full Ceph tree, default is / */
  path?: string;
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  readOnly?: boolean;
  /* Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  secretFile?: string;
  /* Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  secretRef?: SecretReference;
  /* Optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  user?: string;
}
/* io.k8s.api.core.v1.CephFSVolumeSource */
/* Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling. */
export interface CephFSVolumeSource {
  /* Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  monitors: string[];
  /* Optional: Used as the mounted root, rather than the full Ceph tree, default is / */
  path?: string;
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  readOnly?: boolean;
  /* Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  secretFile?: string;
  /* Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  secretRef?: LocalObjectReference;
  /* Optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it */
  user?: string;
}
/* io.k8s.api.core.v1.CinderPersistentVolumeSource */
/* Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling. */
export interface CinderPersistentVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  fsType?: string;
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  readOnly?: boolean;
  /* Optional: points to a secret object containing parameters used to connect to OpenStack. */
  secretRef?: SecretReference;
  /* volume id used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  volumeID: string;
}
/* io.k8s.api.core.v1.CinderVolumeSource */
/* Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling. */
export interface CinderVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  fsType?: string;
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  readOnly?: boolean;
  /* Optional: points to a secret object containing parameters used to connect to OpenStack. */
  secretRef?: LocalObjectReference;
  /* volume id used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  volumeID: string;
}
/* io.k8s.api.core.v1.ClientIPConfig */
/* ClientIPConfig represents the configurations of Client IP based session affinity. */
export interface ClientIPConfig {
  /* timeoutSeconds specifies the seconds of ClientIP type session sticky time. The value must be >0 && <=86400(for 1 day) if ServiceAffinity == "ClientIP". Default value is 10800(for 3 hours). */
  timeoutSeconds?: number;
}
/* io.k8s.api.core.v1.ComponentCondition */
/* Information about the condition of a component. */
export interface ComponentCondition {
  /* Condition error code for a component. For example, a health check error code. */
  error?: string;
  /* Message about the condition for a component. For example, information about a health check. */
  message?: string;
  /* Status of the condition for a component. Valid values for "Healthy": "True", "False", or "Unknown". */
  status: string;
  /* Type of condition for a component. Valid value: "Healthy" */
  type: string;
}
/* io.k8s.api.core.v1.ComponentStatus */
/* ComponentStatus (and ComponentStatusList) holds the cluster validation info. Deprecated: This API is deprecated in v1.19+ */
export interface ComponentStatus {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of component conditions observed */
  conditions?: ComponentCondition[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
}
/* io.k8s.api.core.v1.ComponentStatusList */
/* Status of all the conditions for the component as a list of ComponentStatus objects. Deprecated: This API is deprecated in v1.19+ */
export interface ComponentStatusList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of ComponentStatus objects. */
  items: ComponentStatus[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.ConfigMap */
/* ConfigMap holds configuration data for pods to consume. */
export interface ConfigMap {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* BinaryData contains the binary data. Each key must consist of alphanumeric characters, '-', '_' or '.'. BinaryData can contain byte sequences that are not in the UTF-8 range. The keys stored in BinaryData must not overlap with the ones in the Data field, this is enforced during validation process. Using this field will require 1.10+ apiserver and kubelet. */
  binaryData?: {
    [key: string]: unknown;
  };
  /* Data contains the configuration data. Each key must consist of alphanumeric characters, '-', '_' or '.'. Values with non-UTF-8 byte sequences must use the BinaryData field. The keys stored in Data must not overlap with the keys in the BinaryData field, this is enforced during validation process. */
  data?: {
    [key: string]: unknown;
  };
  /* Immutable, if set to true, ensures that data stored in the ConfigMap cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil. */
  immutable?: boolean;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
}
/* io.k8s.api.core.v1.ConfigMapEnvSource */
/* ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.

The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables. */
export interface ConfigMapEnvSource {
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the ConfigMap must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.ConfigMapKeySelector */
/* Selects a key from a ConfigMap. */
export interface ConfigMapKeySelector {
  /* The key to select. */
  key: string;
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the ConfigMap or its key must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.ConfigMapList */
/* ConfigMapList is a resource containing a list of ConfigMap objects. */
export interface ConfigMapList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of ConfigMaps. */
  items: ConfigMap[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.ConfigMapNodeConfigSource */
/* ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration */
export interface ConfigMapNodeConfigSource {
  /* KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases. */
  kubeletConfigKey: string;
  /* Name is the metadata.name of the referenced ConfigMap. This field is required in all cases. */
  name: string;
  /* Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases. */
  namespace: string;
  /* ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status. */
  resourceVersion?: string;
  /* UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status. */
  uid?: string;
}
/* io.k8s.api.core.v1.ConfigMapProjection */
/* Adapts a ConfigMap into a projected volume.

The contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode. */
export interface ConfigMapProjection {
  /* If unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
  items?: KeyToPath[];
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the ConfigMap or its keys must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.ConfigMapVolumeSource */
/* Adapts a ConfigMap into a volume.

The contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling. */
export interface ConfigMapVolumeSource {
  /* Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. */
  defaultMode?: number;
  /* If unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
  items?: KeyToPath[];
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the ConfigMap or its keys must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.Container */
/* A single application container that you want to run within a pod. */
export interface Container {
  /* Arguments to the entrypoint. The docker image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell */
  args?: string[];
  /* Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell */
  command?: string[];
  /* List of environment variables to set in the container. Cannot be updated. */
  env?: EnvVar[];
  /* List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated. */
  envFrom?: EnvFromSource[];
  /* Docker image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets. */
  image?: string;
  /* Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images */
  imagePullPolicy?: string;
  /* Actions that the management system should take in response to container lifecycle events. Cannot be updated. */
  lifecycle?: Lifecycle;
  /* Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes */
  livenessProbe?: Probe;
  /* Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated. */
  name: string;
  /* List of ports to expose from the container. Exposing a port here gives the system additional information about the network connections a container uses, but is primarily informational. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Cannot be updated. */
  ports?: ContainerPort[];
  /* Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes */
  readinessProbe?: Probe;
  /* Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ */
  resources?: ResourceRequirements;
  /* SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/ */
  securityContext?: SecurityContext;
  /* StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes */
  startupProbe?: Probe;
  /* Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false. */
  stdin?: boolean;
  /* Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false */
  stdinOnce?: boolean;
  /* Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated. */
  terminationMessagePath?: string;
  /* Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated. */
  terminationMessagePolicy?: string;
  /* Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false. */
  tty?: boolean;
  /* volumeDevices is the list of block devices to be used by the container. */
  volumeDevices?: VolumeDevice[];
  /* Pod volumes to mount into the container's filesystem. Cannot be updated. */
  volumeMounts?: VolumeMount[];
  /* Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated. */
  workingDir?: string;
}
/* io.k8s.api.core.v1.ContainerImage */
/* Describe a container image */
export interface ContainerImage {
  /* Names by which this image is known. e.g. ["k8s.gcr.io/hyperkube:v1.0.7", "dockerhub.io/google_containers/hyperkube:v1.0.7"] */
  names?: string[];
  /* The size of the image in bytes. */
  sizeBytes?: number;
}
/* io.k8s.api.core.v1.ContainerPort */
/* ContainerPort represents a network port in a single container. */
export interface ContainerPort {
  /* Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536. */
  containerPort: number;
  /* What host IP to bind the external port to. */
  hostIP?: string;
  /* Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this. */
  hostPort?: number;
  /* If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services. */
  name?: string;
  /* Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP". */
  protocol?: string;
}
/* io.k8s.api.core.v1.ContainerState */
/* ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting. */
export interface ContainerState {
  /* Details about a running container */
  running?: ContainerStateRunning;
  /* Details about a terminated container */
  terminated?: ContainerStateTerminated;
  /* Details about a waiting container */
  waiting?: ContainerStateWaiting;
}
/* io.k8s.api.core.v1.ContainerStateRunning */
/* ContainerStateRunning is a running state of a container. */
export interface ContainerStateRunning {
  /* Time at which the container was last (re-)started */
  startedAt?: Time;
}
/* io.k8s.api.core.v1.ContainerStateTerminated */
/* ContainerStateTerminated is a terminated state of a container. */
export interface ContainerStateTerminated {
  /* Container's ID in the format 'docker://<container_id>' */
  containerID?: string;
  /* Exit status from the last termination of the container */
  exitCode: number;
  /* Time at which the container last terminated */
  finishedAt?: Time;
  /* Message regarding the last termination of the container */
  message?: string;
  /* (brief) reason from the last termination of the container */
  reason?: string;
  /* Signal from the last termination of the container */
  signal?: number;
  /* Time at which previous execution of the container started */
  startedAt?: Time;
}
/* io.k8s.api.core.v1.ContainerStateWaiting */
/* ContainerStateWaiting is a waiting state of a container. */
export interface ContainerStateWaiting {
  /* Message regarding why the container is not yet running. */
  message?: string;
  /* (brief) reason the container is not yet running. */
  reason?: string;
}
/* io.k8s.api.core.v1.ContainerStatus */
/* ContainerStatus contains details for the current status of this container. */
export interface ContainerStatus {
  /* Container's ID in the format 'docker://<container_id>'. */
  containerID?: string;
  /* The image the container is running. More info: https://kubernetes.io/docs/concepts/containers/images */
  image: string;
  /* ImageID of the container's image. */
  imageID: string;
  /* Details about the container's last termination condition. */
  lastState?: ContainerState;
  /* This must be a DNS_LABEL. Each container in a pod must have a unique name. Cannot be updated. */
  name: string;
  /* Specifies whether the container has passed its readiness probe. */
  ready: boolean;
  /* The number of times the container has been restarted, currently based on the number of dead containers that have not yet been removed. Note that this is calculated from dead containers. But those containers are subject to garbage collection. This value will get capped at 5 by GC. */
  restartCount: number;
  /* Specifies whether the container has passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. Is always true when no startupProbe is defined. */
  started?: boolean;
  /* Details about the container's current condition. */
  state?: ContainerState;
}
/* io.k8s.api.core.v1.DaemonEndpoint */
/* DaemonEndpoint contains information about a single Daemon endpoint. */
export interface DaemonEndpoint {
  /* Port number of the given endpoint. */
  Port: number;
}
/* io.k8s.api.core.v1.DownwardAPIProjection */
/* Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode. */
export interface DownwardAPIProjection {
  /* Items is a list of DownwardAPIVolume file */
  items?: DownwardAPIVolumeFile[];
}
/* io.k8s.api.core.v1.DownwardAPIVolumeFile */
/* DownwardAPIVolumeFile represents information to create the file containing the pod field */
export interface DownwardAPIVolumeFile {
  /* Required: Selects a field of the pod: only annotations, labels, name and namespace are supported. */
  fieldRef?: ObjectFieldSelector;
  /* Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. */
  mode?: number;
  /* Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..' */
  path: string;
  /* Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported. */
  resourceFieldRef?: ResourceFieldSelector;
}
/* io.k8s.api.core.v1.DownwardAPIVolumeSource */
/* DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling. */
export interface DownwardAPIVolumeSource {
  /* Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. */
  defaultMode?: number;
  /* Items is a list of downward API volume file */
  items?: DownwardAPIVolumeFile[];
}
/* io.k8s.api.core.v1.EmptyDirVolumeSource */
/* Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling. */
export interface EmptyDirVolumeSource {
  /* What type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir */
  medium?: string;
  /* Total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: http://kubernetes.io/docs/user-guide/volumes#emptydir */
  sizeLimit?: Quantity;
}
/* io.k8s.api.core.v1.EndpointAddress */
/* EndpointAddress is a tuple that describes single IP address. */
export interface EndpointAddress {
  /* The Hostname of this endpoint */
  hostname?: string;
  /* The IP of this endpoint. May not be loopback (127.0.0.0/8), link-local (169.254.0.0/16), or link-local multicast ((224.0.0.0/24). IPv6 is also accepted but not fully supported on all platforms. Also, certain kubernetes components, like kube-proxy, are not IPv6 ready. */
  ip: string;
  /* Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node. */
  nodeName?: string;
  /* Reference to object providing the endpoint. */
  targetRef?: ObjectReference;
}
/* io.k8s.api.core.v1.EndpointPort */
/* EndpointPort is a tuple that describes a single port. */
export interface EndpointPort {
  /* The application protocol for this port. This field follows standard Kubernetes label syntax. Un-prefixed names are reserved for IANA standard service names (as per RFC-6335 and http://www.iana.org/assignments/service-names). Non-standard protocols should use prefixed names such as mycompany.com/my-custom-protocol. */
  appProtocol?: string;
  /* The name of this port.  This must match the 'name' field in the corresponding ServicePort. Must be a DNS_LABEL. Optional only if one port is defined. */
  name?: string;
  /* The port number of the endpoint. */
  port: number;
  /* The IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP. */
  protocol?: string;
}
/* io.k8s.api.core.v1.EndpointSubset */
/* EndpointSubset is a group of addresses with a common set of ports. The expanded set of endpoints is the Cartesian product of Addresses x Ports. For example, given:
  {
    Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
    Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
  }
The resulting set of endpoints can be viewed as:
    a: [ 10.10.1.1:8675, 10.10.2.2:8675 ],
    b: [ 10.10.1.1:309, 10.10.2.2:309 ] */
export interface EndpointSubset {
  /* IP addresses which offer the related ports that are marked as ready. These endpoints should be considered safe for load balancers and clients to utilize. */
  addresses?: EndpointAddress[];
  /* IP addresses which offer the related ports but are not currently marked as ready because they have not yet finished starting, have recently failed a readiness check, or have recently failed a liveness check. */
  notReadyAddresses?: EndpointAddress[];
  /* Port numbers available on the related IP addresses. */
  ports?: EndpointPort[];
}
/* io.k8s.api.core.v1.Endpoints */
/* Endpoints is a collection of endpoints that implement the actual service. Example:
  Name: "mysvc",
  Subsets: [
    {
      Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
      Ports: [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
    },
    {
      Addresses: [{"ip": "10.10.3.3"}],
      Ports: [{"name": "a", "port": 93}, {"name": "b", "port": 76}]
    },
 ] */
export interface Endpoints {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* The set of all endpoints is the union of all subsets. Addresses are placed into subsets according to the IPs they share. A single address with multiple ports, some of which are ready and some of which are not (because they come from different containers) will result in the address being displayed in different subsets for the different ports. No address will appear in both Addresses and NotReadyAddresses in the same subset. Sets of addresses and ports that comprise a service. */
  subsets?: EndpointSubset[];
}
/* io.k8s.api.core.v1.EndpointsList */
/* EndpointsList is a list of endpoints. */
export interface EndpointsList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of endpoints. */
  items: Endpoints[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.EnvFromSource */
/* EnvFromSource represents the source of a set of ConfigMaps */
export interface EnvFromSource {
  /* The ConfigMap to select from */
  configMapRef?: ConfigMapEnvSource;
  /* An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER. */
  prefix?: string;
  /* The Secret to select from */
  secretRef?: SecretEnvSource;
}
/* io.k8s.api.core.v1.EnvVar */
/* EnvVar represents an environment variable present in a Container. */
export interface EnvVar {
  /* Name of the environment variable. Must be a C_IDENTIFIER. */
  name: string;
  /* Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "". */
  value?: string;
  /* Source for the environment variable's value. Cannot be used if value is not empty. */
  valueFrom?: EnvVarSource;
}
/* io.k8s.api.core.v1.EnvVarSource */
/* EnvVarSource represents a source for the value of an EnvVar. */
export interface EnvVarSource {
  /* Selects a key of a ConfigMap. */
  configMapKeyRef?: ConfigMapKeySelector;
  /* Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['<KEY>']`, `metadata.annotations['<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs. */
  fieldRef?: ObjectFieldSelector;
  /* Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported. */
  resourceFieldRef?: ResourceFieldSelector;
  /* Selects a key of a secret in the pod's namespace */
  secretKeyRef?: SecretKeySelector;
}
/* io.k8s.api.core.v1.EphemeralContainer */
/* An EphemeralContainer is a container that may be added temporarily to an existing pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a pod is removed or restarted. If an ephemeral container causes a pod to exceed its resource allocation, the pod may be evicted. Ephemeral containers may not be added by directly updating the pod spec. They must be added via the pod's ephemeralcontainers subresource, and they will appear in the pod spec once added. This is an alpha feature enabled by the EphemeralContainers feature flag. */
export interface EphemeralContainer {
  /* Arguments to the entrypoint. The docker image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell */
  args?: string[];
  /* Entrypoint array. Not executed within a shell. The docker image's ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell */
  command?: string[];
  /* List of environment variables to set in the container. Cannot be updated. */
  env?: EnvVar[];
  /* List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated. */
  envFrom?: EnvFromSource[];
  /* Docker image name. More info: https://kubernetes.io/docs/concepts/containers/images */
  image?: string;
  /* Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images */
  imagePullPolicy?: string;
  /* Lifecycle is not allowed for ephemeral containers. */
  lifecycle?: Lifecycle;
  /* Probes are not allowed for ephemeral containers. */
  livenessProbe?: Probe;
  /* Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers. */
  name: string;
  /* Ports are not allowed for ephemeral containers. */
  ports?: ContainerPort[];
  /* Probes are not allowed for ephemeral containers. */
  readinessProbe?: Probe;
  /* Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod. */
  resources?: ResourceRequirements;
  /* Optional: SecurityContext defines the security options the ephemeral container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. */
  securityContext?: SecurityContext;
  /* Probes are not allowed for ephemeral containers. */
  startupProbe?: Probe;
  /* Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false. */
  stdin?: boolean;
  /* Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false */
  stdinOnce?: boolean;
  /* If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container is run in whatever namespaces are shared for the pod. Note that the container runtime must support this feature. */
  targetContainerName?: string;
  /* Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated. */
  terminationMessagePath?: string;
  /* Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated. */
  terminationMessagePolicy?: string;
  /* Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false. */
  tty?: boolean;
  /* volumeDevices is the list of block devices to be used by the container. */
  volumeDevices?: VolumeDevice[];
  /* Pod volumes to mount into the container's filesystem. Cannot be updated. */
  volumeMounts?: VolumeMount[];
  /* Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated. */
  workingDir?: string;
}
/* io.k8s.api.core.v1.EphemeralVolumeSource */
/* Represents an ephemeral volume that is handled by a normal storage driver. */
export interface EphemeralVolumeSource {
  /* Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `<pod name>-<volume name>` where `<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).
  
  An existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.
  
  This field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.
  
  Required, must not be nil. */
  volumeClaimTemplate?: PersistentVolumeClaimTemplate;
}
/* io.k8s.api.core.v1.Event */
/* Event is a report of an event somewhere in the cluster.  Events have a limited retention time and triggers and messages may evolve with time.  Event consumers should not rely on the timing of an event with a given Reason reflecting a consistent underlying trigger, or the continued existence of events with that Reason.  Events should be treated as informative, best-effort, supplemental data. */
export interface Event {
  /* What action was taken/failed regarding to the Regarding object. */
  action?: string;
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* The number of times this event has occurred. */
  count?: number;
  /* Time when this Event was first observed. */
  eventTime?: MicroTime;
  /* The time at which the event was first recorded. (Time of server receipt is in TypeMeta.) */
  firstTimestamp?: Time;
  /* The object that this event is about. */
  involvedObject: ObjectReference;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* The time at which the most recent occurrence of this event was recorded. */
  lastTimestamp?: Time;
  /* A human-readable description of the status of this operation. */
  message?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata: ObjectMeta;
  /* This should be a short, machine understandable string that gives the reason for the transition into the object's current status. */
  reason?: string;
  /* Optional secondary object for more complex actions. */
  related?: ObjectReference;
  /* Name of the controller that emitted this Event, e.g. `kubernetes.io/kubelet`. */
  reportingComponent?: string;
  /* ID of the controller instance, e.g. `kubelet-xyzf`. */
  reportingInstance?: string;
  /* Data about the Event series this event represents or nil if it's a singleton Event. */
  series?: EventSeries;
  /* The component reporting this event. Should be a short machine understandable string. */
  source?: EventSource;
  /* Type of this event (Normal, Warning), new types could be added in the future */
  type?: string;
}
/* io.k8s.api.core.v1.EventList */
/* EventList is a list of events. */
export interface EventList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of events */
  items: Event[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.EventSeries */
/* EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time. */
export interface EventSeries {
  /* Number of occurrences in this series up to the last heartbeat time */
  count?: number;
  /* Time of the last occurrence observed */
  lastObservedTime?: MicroTime;
}
/* io.k8s.api.core.v1.EventSource */
/* EventSource contains information for an event. */
export interface EventSource {
  /* Component from which the event is generated. */
  component?: string;
  /* Node name on which the event is generated. */
  host?: string;
}
/* io.k8s.api.core.v1.ExecAction */
/* ExecAction describes a "run in container" action. */
export interface ExecAction {
  /* Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy. */
  command?: string[];
}
/* io.k8s.api.core.v1.FCVolumeSource */
/* Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling. */
export interface FCVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* Optional: FC target lun number */
  lun?: number;
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* Optional: FC target worldwide names (WWNs) */
  targetWWNs?: string[];
  /* Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously. */
  wwids?: string[];
}
/* io.k8s.api.core.v1.FlexPersistentVolumeSource */
/* FlexPersistentVolumeSource represents a generic persistent volume resource that is provisioned/attached using an exec based plugin. */
export interface FlexPersistentVolumeSource {
  /* Driver is the name of the driver to use for this volume. */
  driver: string;
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script. */
  fsType?: string;
  /* Optional: Extra command options if any. */
  options?: {
    [key: string]: unknown;
  };
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* Optional: SecretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts. */
  secretRef?: SecretReference;
}
/* io.k8s.api.core.v1.FlexVolumeSource */
/* FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. */
export interface FlexVolumeSource {
  /* Driver is the name of the driver to use for this volume. */
  driver: string;
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script. */
  fsType?: string;
  /* Optional: Extra command options if any. */
  options?: {
    [key: string]: unknown;
  };
  /* Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* Optional: SecretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts. */
  secretRef?: LocalObjectReference;
}
/* io.k8s.api.core.v1.FlockerVolumeSource */
/* Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling. */
export interface FlockerVolumeSource {
  /* Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated */
  datasetName?: string;
  /* UUID of the dataset. This is unique identifier of a Flocker dataset */
  datasetUUID?: string;
}
/* io.k8s.api.core.v1.GCEPersistentDiskVolumeSource */
/* Represents a Persistent Disk resource in Google Compute Engine.

A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling. */
export interface GCEPersistentDiskVolumeSource {
  /* Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
  fsType?: string;
  /* The partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
  partition?: number;
  /* Unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
  pdName: string;
  /* ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
  readOnly?: boolean;
}
/* io.k8s.api.core.v1.GitRepoVolumeSource */
/* Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.

DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container. */
export interface GitRepoVolumeSource {
  /* Target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name. */
  directory?: string;
  /* Repository URL */
  repository: string;
  /* Commit hash for the specified revision. */
  revision?: string;
}
/* io.k8s.api.core.v1.GlusterfsPersistentVolumeSource */
/* Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling. */
export interface GlusterfsPersistentVolumeSource {
  /* EndpointsName is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  endpoints: string;
  /* EndpointsNamespace is the namespace that contains Glusterfs endpoint. If this field is empty, the EndpointNamespace defaults to the same namespace as the bound PVC. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  endpointsNamespace?: string;
  /* Path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  path: string;
  /* ReadOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  readOnly?: boolean;
}
/* io.k8s.api.core.v1.GlusterfsVolumeSource */
/* Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling. */
export interface GlusterfsVolumeSource {
  /* EndpointsName is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  endpoints: string;
  /* Path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  path: string;
  /* ReadOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod */
  readOnly?: boolean;
}
/* io.k8s.api.core.v1.HTTPGetAction */
/* HTTPGetAction describes an action based on HTTP Get requests. */
export interface HTTPGetAction {
  /* Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead. */
  host?: string;
  /* Custom headers to set in the request. HTTP allows repeated headers. */
  httpHeaders?: HTTPHeader[];
  /* Path to access on the HTTP server. */
  path?: string;
  /* Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. */
  port: IntOrString;
  /* Scheme to use for connecting to the host. Defaults to HTTP. */
  scheme?: string;
}
/* io.k8s.api.core.v1.HTTPHeader */
/* HTTPHeader describes a custom header to be used in HTTP probes */
export interface HTTPHeader {
  /* The header field name */
  name: string;
  /* The header field value */
  value: string;
}
/* io.k8s.api.core.v1.Handler */
/* Handler defines a specific action that should be taken */
export interface Handler {
  /* One and only one of the following should be specified. Exec specifies the action to take. */
  exec?: ExecAction;
  /* HTTPGet specifies the http request to perform. */
  httpGet?: HTTPGetAction;
  /* TCPSocket specifies an action involving a TCP port. TCP hooks not yet supported */
  tcpSocket?: TCPSocketAction;
}
/* io.k8s.api.core.v1.HostAlias */
/* HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file. */
export interface HostAlias {
  /* Hostnames for the above IP address. */
  hostnames?: string[];
  /* IP address of the host file entry. */
  ip?: string;
}
/* io.k8s.api.core.v1.HostPathVolumeSource */
/* Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling. */
export interface HostPathVolumeSource {
  /* Path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath */
  path: string;
  /* Type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath */
  type?: string;
}
/* io.k8s.api.core.v1.ISCSIPersistentVolumeSource */
/* ISCSIPersistentVolumeSource represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling. */
export interface ISCSIPersistentVolumeSource {
  /* whether support iSCSI Discovery CHAP authentication */
  chapAuthDiscovery?: boolean;
  /* whether support iSCSI Session CHAP authentication */
  chapAuthSession?: boolean;
  /* Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi */
  fsType?: string;
  /* Custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface <target portal>:<volume name> will be created for the connection. */
  initiatorName?: string;
  /* Target iSCSI Qualified Name. */
  iqn: string;
  /* iSCSI Interface Name that uses an iSCSI transport. Defaults to 'default' (tcp). */
  iscsiInterface?: string;
  /* iSCSI Target Lun number. */
  lun: number;
  /* iSCSI Target Portal List. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260). */
  portals?: string[];
  /* ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. */
  readOnly?: boolean;
  /* CHAP Secret for iSCSI target and initiator authentication */
  secretRef?: SecretReference;
  /* iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260). */
  targetPortal: string;
}
/* io.k8s.api.core.v1.ISCSIVolumeSource */
/* Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling. */
export interface ISCSIVolumeSource {
  /* whether support iSCSI Discovery CHAP authentication */
  chapAuthDiscovery?: boolean;
  /* whether support iSCSI Session CHAP authentication */
  chapAuthSession?: boolean;
  /* Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi */
  fsType?: string;
  /* Custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface <target portal>:<volume name> will be created for the connection. */
  initiatorName?: string;
  /* Target iSCSI Qualified Name. */
  iqn: string;
  /* iSCSI Interface Name that uses an iSCSI transport. Defaults to 'default' (tcp). */
  iscsiInterface?: string;
  /* iSCSI Target Lun number. */
  lun: number;
  /* iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260). */
  portals?: string[];
  /* ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. */
  readOnly?: boolean;
  /* CHAP Secret for iSCSI target and initiator authentication */
  secretRef?: LocalObjectReference;
  /* iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260). */
  targetPortal: string;
}
/* io.k8s.api.core.v1.KeyToPath */
/* Maps a string key to a path within a volume. */
export interface KeyToPath {
  /* The key to project. */
  key: string;
  /* Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. */
  mode?: number;
  /* The relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'. */
  path: string;
}
/* io.k8s.api.core.v1.Lifecycle */
/* Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted. */
export interface Lifecycle {
  /* PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks */
  postStart?: Handler;
  /* PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The reason for termination is passed to the handler. The Pod's termination grace period countdown begins before the PreStop hooked is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period. Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks */
  preStop?: Handler;
}
/* io.k8s.api.core.v1.LimitRange */
/* LimitRange sets resource usage limits for each kind of resource in a Namespace. */
export interface LimitRange {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the limits enforced. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: LimitRangeSpec;
}
/* io.k8s.api.core.v1.LimitRangeItem */
/* LimitRangeItem defines a min/max usage limit for any resource that matches on kind. */
export interface LimitRangeItem {
  /* Default resource requirement limit value by resource name if resource limit is omitted. */
  default?: {
    [key: string]: unknown;
  };
  /* DefaultRequest is the default resource requirement request value by resource name if resource request is omitted. */
  defaultRequest?: {
    [key: string]: unknown;
  };
  /* Max usage constraints on this kind by resource name. */
  max?: {
    [key: string]: unknown;
  };
  /* MaxLimitRequestRatio if specified, the named resource must have a request and limit that are both non-zero where limit divided by request is less than or equal to the enumerated value; this represents the max burst for the named resource. */
  maxLimitRequestRatio?: {
    [key: string]: unknown;
  };
  /* Min usage constraints on this kind by resource name. */
  min?: {
    [key: string]: unknown;
  };
  /* Type of resource that this limit applies to. */
  type: string;
}
/* io.k8s.api.core.v1.LimitRangeList */
/* LimitRangeList is a list of LimitRange items. */
export interface LimitRangeList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of LimitRange objects. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ */
  items: LimitRange[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.LimitRangeSpec */
/* LimitRangeSpec defines a min/max usage limit for resources that match on kind. */
export interface LimitRangeSpec {
  /* Limits is the list of LimitRangeItem objects that are enforced. */
  limits: LimitRangeItem[];
}
/* io.k8s.api.core.v1.LoadBalancerIngress */
/* LoadBalancerIngress represents the status of a load-balancer ingress point: traffic intended for the service should be sent to an ingress point. */
export interface LoadBalancerIngress {
  /* Hostname is set for load-balancer ingress points that are DNS based (typically AWS load-balancers) */
  hostname?: string;
  /* IP is set for load-balancer ingress points that are IP based (typically GCE or OpenStack load-balancers) */
  ip?: string;
  /* Ports is a list of records of service ports If used, every port defined in the service should have an entry in it */
  ports?: PortStatus[];
}
/* io.k8s.api.core.v1.LoadBalancerStatus */
/* LoadBalancerStatus represents the status of a load-balancer. */
export interface LoadBalancerStatus {
  /* Ingress is a list containing ingress points for the load-balancer. Traffic intended for the service should be sent to these ingress points. */
  ingress?: LoadBalancerIngress[];
}
/* io.k8s.api.core.v1.LocalObjectReference */
/* LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace. */
export interface LocalObjectReference {
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
}
/* io.k8s.api.core.v1.LocalVolumeSource */
/* Local represents directly-attached storage with node affinity (Beta feature) */
export interface LocalVolumeSource {
  /* Filesystem type to mount. It applies only when the Path is a block device. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default value is to auto-select a fileystem if unspecified. */
  fsType?: string;
  /* The full path to the volume on the node. It can be either a directory or block device (disk, partition, ...). */
  path: string;
}
/* io.k8s.api.core.v1.NFSVolumeSource */
/* Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling. */
export interface NFSVolumeSource {
  /* Path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
  path: string;
  /* ReadOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
  readOnly?: boolean;
  /* Server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
  server: string;
}
/* io.k8s.api.core.v1.Namespace */
/* Namespace provides a scope for Names. Use of multiple namespaces is optional. */
export interface Namespace {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the behavior of the Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: NamespaceSpec;
  /* Status describes the current status of a Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: NamespaceStatus;
}
/* io.k8s.api.core.v1.NamespaceCondition */
/* NamespaceCondition contains details about state of namespace. */
export interface NamespaceCondition {
  lastTransitionTime?: Time;
  message?: string;
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of namespace controller condition. */
  type: string;
}
/* io.k8s.api.core.v1.NamespaceList */
/* NamespaceList is a list of Namespaces. */
export interface NamespaceList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of Namespace objects in the list. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/ */
  items: Namespace[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.NamespaceSpec */
/* NamespaceSpec describes the attributes on a Namespace. */
export interface NamespaceSpec {
  /* Finalizers is an opaque list of values that must be empty to permanently remove object from storage. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/ */
  finalizers?: string[];
}
/* io.k8s.api.core.v1.NamespaceStatus */
/* NamespaceStatus is information about the current status of a Namespace. */
export interface NamespaceStatus {
  /* Represents the latest available observations of a namespace's current state. */
  conditions?: NamespaceCondition[];
  /* Phase is the current lifecycle phase of the namespace. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/ */
  phase?: string;
}
/* io.k8s.api.core.v1.Node */
/* Node is a worker node in Kubernetes. Each node will have a unique identifier in the cache (i.e. in etcd). */
export interface Node {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the behavior of a node. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: NodeSpec;
  /* Most recently observed status of the node. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: NodeStatus;
}
/* io.k8s.api.core.v1.NodeAddress */
/* NodeAddress contains information for the node's address. */
export interface NodeAddress {
  /* The node address. */
  address: string;
  /* Node address type, one of Hostname, ExternalIP or InternalIP. */
  type: string;
}
/* io.k8s.api.core.v1.NodeAffinity */
/* Node affinity is a group of node affinity scheduling rules. */
export interface NodeAffinity {
  /* The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred. */
  preferredDuringSchedulingIgnoredDuringExecution?: PreferredSchedulingTerm[];
  /* If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node. */
  requiredDuringSchedulingIgnoredDuringExecution?: NodeSelector;
}
/* io.k8s.api.core.v1.NodeCondition */
/* NodeCondition contains condition information for a node. */
export interface NodeCondition {
  /* Last time we got an update on a given condition. */
  lastHeartbeatTime?: Time;
  /* Last time the condition transit from one status to another. */
  lastTransitionTime?: Time;
  /* Human readable message indicating details about last transition. */
  message?: string;
  /* (brief) reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of node condition. */
  type: string;
}
/* io.k8s.api.core.v1.NodeConfigSource */
/* NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22 */
export interface NodeConfigSource {
  /* ConfigMap is a reference to a Node's ConfigMap */
  configMap?: ConfigMapNodeConfigSource;
}
/* io.k8s.api.core.v1.NodeConfigStatus */
/* NodeConfigStatus describes the status of the config assigned by Node.Spec.ConfigSource. */
export interface NodeConfigStatus {
  /* Active reports the checkpointed config the node is actively using. Active will represent either the current version of the Assigned config, or the current LastKnownGood config, depending on whether attempting to use the Assigned config results in an error. */
  active?: NodeConfigSource;
  /* Assigned reports the checkpointed config the node will try to use. When Node.Spec.ConfigSource is updated, the node checkpoints the associated config payload to local disk, along with a record indicating intended config. The node refers to this record to choose its config checkpoint, and reports this record in Assigned. Assigned only updates in the status after the record has been checkpointed to disk. When the Kubelet is restarted, it tries to make the Assigned config the Active config by loading and validating the checkpointed payload identified by Assigned. */
  assigned?: NodeConfigSource;
  /* Error describes any problems reconciling the Spec.ConfigSource to the Active config. Errors may occur, for example, attempting to checkpoint Spec.ConfigSource to the local Assigned record, attempting to checkpoint the payload associated with Spec.ConfigSource, attempting to load or validate the Assigned config, etc. Errors may occur at different points while syncing config. Earlier errors (e.g. download or checkpointing errors) will not result in a rollback to LastKnownGood, and may resolve across Kubelet retries. Later errors (e.g. loading or validating a checkpointed config) will result in a rollback to LastKnownGood. In the latter case, it is usually possible to resolve the error by fixing the config assigned in Spec.ConfigSource. You can find additional information for debugging by searching the error message in the Kubelet log. Error is a human-readable description of the error state; machines can check whether or not Error is empty, but should not rely on the stability of the Error text across Kubelet versions. */
  error?: string;
  /* LastKnownGood reports the checkpointed config the node will fall back to when it encounters an error attempting to use the Assigned config. The Assigned config becomes the LastKnownGood config when the node determines that the Assigned config is stable and correct. This is currently implemented as a 10-minute soak period starting when the local record of Assigned config is updated. If the Assigned config is Active at the end of this period, it becomes the LastKnownGood. Note that if Spec.ConfigSource is reset to nil (use local defaults), the LastKnownGood is also immediately reset to nil, because the local default config is always assumed good. You should not make assumptions about the node's method of determining config stability and correctness, as this may change or become configurable in the future. */
  lastKnownGood?: NodeConfigSource;
}
/* io.k8s.api.core.v1.NodeDaemonEndpoints */
/* NodeDaemonEndpoints lists ports opened by daemons running on the Node. */
export interface NodeDaemonEndpoints {
  /* Endpoint on which Kubelet is listening. */
  kubeletEndpoint?: DaemonEndpoint;
}
/* io.k8s.api.core.v1.NodeList */
/* NodeList is the whole list of all Nodes which have been registered with master. */
export interface NodeList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of nodes */
  items: Node[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.NodeSelector */
/* A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms. */
export interface NodeSelector {
  /* Required. A list of node selector terms. The terms are ORed. */
  nodeSelectorTerms: NodeSelectorTerm[];
}
/* io.k8s.api.core.v1.NodeSelectorRequirement */
/* A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values. */
export interface NodeSelectorRequirement {
  /* The label key that the selector applies to. */
  key: string;
  /* Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt. */
  operator: string;
  /* An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch. */
  values?: string[];
}
/* io.k8s.api.core.v1.NodeSelectorTerm */
/* A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm. */
export interface NodeSelectorTerm {
  /* A list of node selector requirements by node's labels. */
  matchExpressions?: NodeSelectorRequirement[];
  /* A list of node selector requirements by node's fields. */
  matchFields?: NodeSelectorRequirement[];
}
/* io.k8s.api.core.v1.NodeSpec */
/* NodeSpec describes the attributes that a node is created with. */
export interface NodeSpec {
  /* Deprecated. If specified, the source of the node's configuration. The DynamicKubeletConfig feature gate must be enabled for the Kubelet to use this field. This field is deprecated as of 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration */
  configSource?: NodeConfigSource;
  /* Deprecated. Not all kubelets will set this field. Remove field after 1.13. see: https://issues.k8s.io/61966 */
  externalID?: string;
  /* PodCIDR represents the pod IP range assigned to the node. */
  podCIDR?: string;
  /* podCIDRs represents the IP ranges assigned to the node for usage by Pods on that node. If this field is specified, the 0th entry must match the podCIDR field. It may contain at most 1 value for each of IPv4 and IPv6. */
  podCIDRs?: string[];
  /* ID of the node assigned by the cloud provider in the format: <ProviderName>://<ProviderSpecificNodeID> */
  providerID?: string;
  /* If specified, the node's taints. */
  taints?: Taint[];
  /* Unschedulable controls node schedulability of new pods. By default, node is schedulable. More info: https://kubernetes.io/docs/concepts/nodes/node/#manual-node-administration */
  unschedulable?: boolean;
}
/* io.k8s.api.core.v1.NodeStatus */
/* NodeStatus is information about the current status of a node. */
export interface NodeStatus {
  /* List of addresses reachable to the node. Queried from cloud provider, if available. More info: https://kubernetes.io/docs/concepts/nodes/node/#addresses Note: This field is declared as mergeable, but the merge key is not sufficiently unique, which can cause data corruption when it is merged. Callers should instead use a full-replacement patch. See http://pr.k8s.io/79391 for an example. */
  addresses?: NodeAddress[];
  /* Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity. */
  allocatable?: {
    [key: string]: unknown;
  };
  /* Capacity represents the total resources of a node. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity */
  capacity?: {
    [key: string]: unknown;
  };
  /* Conditions is an array of current observed node conditions. More info: https://kubernetes.io/docs/concepts/nodes/node/#condition */
  conditions?: NodeCondition[];
  /* Status of the config assigned to the node via the dynamic Kubelet config feature. */
  config?: NodeConfigStatus;
  /* Endpoints of daemons running on the Node. */
  daemonEndpoints?: NodeDaemonEndpoints;
  /* List of container images on this node */
  images?: ContainerImage[];
  /* Set of ids/uuids to uniquely identify the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#info */
  nodeInfo?: NodeSystemInfo;
  /* NodePhase is the recently observed lifecycle phase of the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#phase The field is never populated, and now is deprecated. */
  phase?: string;
  /* List of volumes that are attached to the node. */
  volumesAttached?: AttachedVolume[];
  /* List of attachable volumes in use (mounted) by the node. */
  volumesInUse?: string[];
}
/* io.k8s.api.core.v1.NodeSystemInfo */
/* NodeSystemInfo is a set of ids/uuids to uniquely identify the node. */
export interface NodeSystemInfo {
  /* The Architecture reported by the node */
  architecture: string;
  /* Boot ID reported by the node. */
  bootID: string;
  /* ContainerRuntime Version reported by the node through runtime remote API (e.g. docker://1.5.0). */
  containerRuntimeVersion: string;
  /* Kernel Version reported by the node from 'uname -r' (e.g. 3.16.0-0.bpo.4-amd64). */
  kernelVersion: string;
  /* KubeProxy Version reported by the node. */
  kubeProxyVersion: string;
  /* Kubelet Version reported by the node. */
  kubeletVersion: string;
  /* MachineID reported by the node. For unique machine identification in the cluster this field is preferred. Learn more from man(5) machine-id: http://man7.org/linux/man-pages/man5/machine-id.5.html */
  machineID: string;
  /* The Operating System reported by the node */
  operatingSystem: string;
  /* OS Image reported by the node from /etc/os-release (e.g. Debian GNU/Linux 7 (wheezy)). */
  osImage: string;
  /* SystemUUID reported by the node. For unique machine identification MachineID is preferred. This field is specific to Red Hat hosts https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid */
  systemUUID: string;
}
/* io.k8s.api.core.v1.ObjectFieldSelector */
/* ObjectFieldSelector selects an APIVersioned field of an object. */
export interface ObjectFieldSelector {
  /* Version of the schema the FieldPath is written in terms of, defaults to "v1". */
  apiVersion?: string;
  /* Path of the field to select in the specified API version. */
  fieldPath: string;
}
/* io.k8s.api.core.v1.ObjectReference */
/* ObjectReference contains enough information to let you inspect or modify the referred object. */
export interface ObjectReference {
  /* API version of the referent. */
  apiVersion?: string;
  /* If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object. */
  fieldPath?: string;
  /* Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/ */
  namespace?: string;
  /* Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency */
  resourceVersion?: string;
  /* UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids */
  uid?: string;
}
/* io.k8s.api.core.v1.PersistentVolume */
/* PersistentVolume (PV) is a storage resource provisioned by an administrator. It is analogous to a node. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes */
export interface PersistentVolume {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes */
  spec?: PersistentVolumeSpec;
  /* Status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes */
  status?: PersistentVolumeStatus;
}
/* io.k8s.api.core.v1.PersistentVolumeClaim */
/* PersistentVolumeClaim is a user's request for and claim to a persistent volume */
export interface PersistentVolumeClaim {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the desired characteristics of a volume requested by a pod author. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
  spec?: PersistentVolumeClaimSpec;
  /* Status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
  status?: PersistentVolumeClaimStatus;
}
/* io.k8s.api.core.v1.PersistentVolumeClaimCondition */
/* PersistentVolumeClaimCondition contails details about state of pvc */
export interface PersistentVolumeClaimCondition {
  /* Last time we probed the condition. */
  lastProbeTime?: Time;
  /* Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* Human-readable message indicating details about last transition. */
  message?: string;
  /* Unique, this should be a short, machine understandable string that gives the reason for condition's last transition. If it reports "ResizeStarted" that means the underlying persistent volume is being resized. */
  reason?: string;
  status: string;
  type: string;
}
/* io.k8s.api.core.v1.PersistentVolumeClaimList */
/* PersistentVolumeClaimList is a list of PersistentVolumeClaim items. */
export interface PersistentVolumeClaimList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* A list of persistent volume claims. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
  items: PersistentVolumeClaim[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.PersistentVolumeClaimSpec */
/* PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes */
export interface PersistentVolumeClaimSpec {
  /* AccessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1 */
  accessModes?: string[];
  /* This field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) If the provisioner or an external controller can support the specified data source, it will create a new volume based on the contents of the specified data source. If the AnyVolumeDataSource feature gate is enabled, this field will always have the same contents as the DataSourceRef field. */
  dataSource?: TypedLocalObjectReference;
  /* Specifies the object from which to populate the volume with data, if a non-empty volume is desired. This may be any local object from a non-empty API group (non core object) or a PersistentVolumeClaim object. When this field is specified, volume binding will only succeed if the type of the specified object matches some installed volume populator or dynamic provisioner. This field will replace the functionality of the DataSource field and as such if both fields are non-empty, they must have the same value. For backwards compatibility, both fields (DataSource and DataSourceRef) will be set to the same value automatically if one of them is empty and the other is non-empty. There are two important differences between DataSource and DataSourceRef: * While DataSource only allows two specific types of objects, DataSourceRef
    allows any non-core object, as well as PersistentVolumeClaim objects.
  * While DataSource ignores disallowed values (dropping them), DataSourceRef
    preserves all values, and generates an error if a disallowed value is
    specified.
  (Alpha) Using this field requires the AnyVolumeDataSource feature gate to be enabled. */
  dataSourceRef?: TypedLocalObjectReference;
  /* Resources represents the minimum resources the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources */
  resources?: ResourceRequirements;
  /* A label query over volumes to consider for binding. */
  selector?: LabelSelector;
  /* Name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1 */
  storageClassName?: string;
  /* volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec. */
  volumeMode?: string;
  /* VolumeName is the binding reference to the PersistentVolume backing this claim. */
  volumeName?: string;
}
/* io.k8s.api.core.v1.PersistentVolumeClaimStatus */
/* PersistentVolumeClaimStatus is the current status of a persistent volume claim. */
export interface PersistentVolumeClaimStatus {
  /* AccessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1 */
  accessModes?: string[];
  /* Represents the actual resources of the underlying volume. */
  capacity?: {
    [key: string]: unknown;
  };
  /* Current Condition of persistent volume claim. If underlying persistent volume is being resized then the Condition will be set to 'ResizeStarted'. */
  conditions?: PersistentVolumeClaimCondition[];
  /* Phase represents the current phase of PersistentVolumeClaim. */
  phase?: string;
}
/* io.k8s.api.core.v1.PersistentVolumeClaimTemplate */
/* PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource. */
export interface PersistentVolumeClaimTemplate {
  /* May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation. */
  metadata?: ObjectMeta;
  /* The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here. */
  spec: PersistentVolumeClaimSpec;
}
/* io.k8s.api.core.v1.PersistentVolumeClaimVolumeSource */
/* PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system). */
export interface PersistentVolumeClaimVolumeSource {
  /* ClaimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
  claimName: string;
  /* Will force the ReadOnly setting in VolumeMounts. Default false. */
  readOnly?: boolean;
}
/* io.k8s.api.core.v1.PersistentVolumeList */
/* PersistentVolumeList is a list of PersistentVolume items. */
export interface PersistentVolumeList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of persistent volumes. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes */
  items: PersistentVolume[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.PersistentVolumeSpec */
/* PersistentVolumeSpec is the specification of a persistent volume. */
export interface PersistentVolumeSpec {
  /* AccessModes contains all ways the volume can be mounted. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes */
  accessModes?: string[];
  /* AWSElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
  awsElasticBlockStore?: AWSElasticBlockStoreVolumeSource;
  /* AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. */
  azureDisk?: AzureDiskVolumeSource;
  /* AzureFile represents an Azure File Service mount on the host and bind mount to the pod. */
  azureFile?: AzureFilePersistentVolumeSource;
  /* A description of the persistent volume's resources and capacity. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity */
  capacity?: {
    [key: string]: unknown;
  };
  /* CephFS represents a Ceph FS mount on the host that shares a pod's lifetime */
  cephfs?: CephFSPersistentVolumeSource;
  /* Cinder represents a cinder volume attached and mounted on kubelets host machine. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  cinder?: CinderPersistentVolumeSource;
  /* ClaimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding */
  claimRef?: ObjectReference;
  /* CSI represents storage that is handled by an external CSI driver (Beta feature). */
  csi?: CSIPersistentVolumeSource;
  /* FC represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod. */
  fc?: FCVolumeSource;
  /* FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. */
  flexVolume?: FlexPersistentVolumeSource;
  /* Flocker represents a Flocker volume attached to a kubelet's host machine and exposed to the pod for its usage. This depends on the Flocker control service being running */
  flocker?: FlockerVolumeSource;
  /* GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
  gcePersistentDisk?: GCEPersistentDiskVolumeSource;
  /* Glusterfs represents a Glusterfs volume that is attached to a host and exposed to the pod. Provisioned by an admin. More info: https://examples.k8s.io/volumes/glusterfs/README.md */
  glusterfs?: GlusterfsPersistentVolumeSource;
  /* HostPath represents a directory on the host. Provisioned by a developer or tester. This is useful for single-node development and testing only! On-host storage is not supported in any way and WILL NOT WORK in a multi-node cluster. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath */
  hostPath?: HostPathVolumeSource;
  /* ISCSI represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin. */
  iscsi?: ISCSIPersistentVolumeSource;
  /* Local represents directly-attached storage with node affinity */
  local?: LocalVolumeSource;
  /* A list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options */
  mountOptions?: string[];
  /* NFS represents an NFS mount on the host. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
  nfs?: NFSVolumeSource;
  /* NodeAffinity defines constraints that limit what nodes this volume can be accessed from. This field influences the scheduling of pods that use this volume. */
  nodeAffinity?: VolumeNodeAffinity;
  /* What happens to a persistent volume when released from its claim. Valid options are Retain (default for manually created PersistentVolumes), Delete (default for dynamically provisioned PersistentVolumes), and Recycle (deprecated). Recycle must be supported by the volume plugin underlying this PersistentVolume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming */
  persistentVolumeReclaimPolicy?: string;
  /* PhotonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine */
  photonPersistentDisk?: PhotonPersistentDiskVolumeSource;
  /* PortworxVolume represents a portworx volume attached and mounted on kubelets host machine */
  portworxVolume?: PortworxVolumeSource;
  /* Quobyte represents a Quobyte mount on the host that shares a pod's lifetime */
  quobyte?: QuobyteVolumeSource;
  /* RBD represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/rbd/README.md */
  rbd?: RBDPersistentVolumeSource;
  /* ScaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes. */
  scaleIO?: ScaleIOPersistentVolumeSource;
  /* Name of StorageClass to which this persistent volume belongs. Empty value means that this volume does not belong to any StorageClass. */
  storageClassName?: string;
  /* StorageOS represents a StorageOS volume that is attached to the kubelet's host machine and mounted into the pod More info: https://examples.k8s.io/volumes/storageos/README.md */
  storageos?: StorageOSPersistentVolumeSource;
  /* volumeMode defines if a volume is intended to be used with a formatted filesystem or to remain in raw block state. Value of Filesystem is implied when not included in spec. */
  volumeMode?: string;
  /* VsphereVolume represents a vSphere volume attached and mounted on kubelets host machine */
  vsphereVolume?: VsphereVirtualDiskVolumeSource;
}
/* io.k8s.api.core.v1.PersistentVolumeStatus */
/* PersistentVolumeStatus is the current status of a persistent volume. */
export interface PersistentVolumeStatus {
  /* A human-readable message indicating details about why the volume is in this state. */
  message?: string;
  /* Phase indicates if a volume is available, bound to a claim, or released by a claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#phase */
  phase?: string;
  /* Reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI. */
  reason?: string;
}
/* io.k8s.api.core.v1.PhotonPersistentDiskVolumeSource */
/* Represents a Photon Controller persistent disk resource. */
export interface PhotonPersistentDiskVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* ID that identifies Photon Controller persistent disk */
  pdID: string;
}
/* io.k8s.api.core.v1.Pod */
/* Pod is a collection of containers that can run on a host. This resource is created by clients and scheduled onto hosts. */
export interface Pod {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: PodSpec;
  /* Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: PodStatus;
}
/* io.k8s.api.core.v1.PodAffinity */
/* Pod affinity is a group of inter pod affinity scheduling rules. */
export interface PodAffinity {
  /* The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred. */
  preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
  /* If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied. */
  requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
}
/* io.k8s.api.core.v1.PodAffinityTerm */
/* Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running */
export interface PodAffinityTerm {
  /* A label query over a set of resources, in this case pods. */
  labelSelector?: LabelSelector;
  /* A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod's namespace". An empty selector ({}) matches all namespaces. This field is beta-level and is only honored when PodAffinityNamespaceSelector feature is enabled. */
  namespaceSelector?: LabelSelector;
  /* namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod's namespace" */
  namespaces?: string[];
  /* This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed. */
  topologyKey: string;
}
/* io.k8s.api.core.v1.PodAntiAffinity */
/* Pod anti affinity is a group of inter pod anti affinity scheduling rules. */
export interface PodAntiAffinity {
  /* The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred. */
  preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
  /* If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied. */
  requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
}
/* io.k8s.api.core.v1.PodCondition */
/* PodCondition contains details for the current condition of this pod. */
export interface PodCondition {
  /* Last time we probed the condition. */
  lastProbeTime?: Time;
  /* Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* Human-readable message indicating details about last transition. */
  message?: string;
  /* Unique, one-word, CamelCase reason for the condition's last transition. */
  reason?: string;
  /* Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions */
  status: string;
  /* Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions */
  type: string;
}
/* io.k8s.api.core.v1.PodDNSConfig */
/* PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy. */
export interface PodDNSConfig {
  /* A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed. */
  nameservers?: string[];
  /* A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy. */
  options?: PodDNSConfigOption[];
  /* A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed. */
  searches?: string[];
}
/* io.k8s.api.core.v1.PodDNSConfigOption */
/* PodDNSConfigOption defines DNS resolver options of a pod. */
export interface PodDNSConfigOption {
  /* Required. */
  name?: string;
  value?: string;
}
/* io.k8s.api.core.v1.PodIP */
/* IP address information for entries in the (plural) PodIPs field. Each entry includes:
   IP: An IP address allocated to the pod. Routable at least within the cluster. */
export interface PodIP {
  /* ip is an IP address (IPv4 or IPv6) assigned to the pod */
  ip?: string;
}
/* io.k8s.api.core.v1.PodList */
/* PodList is a list of Pods. */
export interface PodList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of pods. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md */
  items: Pod[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.PodReadinessGate */
/* PodReadinessGate contains the reference to a pod condition */
export interface PodReadinessGate {
  /* ConditionType refers to a condition in the pod's condition list with matching type. */
  conditionType: string;
}
/* io.k8s.api.core.v1.PodSecurityContext */
/* PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext. */
export interface PodSecurityContext {
  /* A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:
  
  1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----
  
  If unset, the Kubelet will not modify the ownership and permissions of any volume. */
  fsGroup?: number;
  /* fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. */
  fsGroupChangePolicy?: string;
  /* The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. */
  runAsGroup?: number;
  /* Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  runAsNonRoot?: boolean;
  /* The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. */
  runAsUser?: number;
  /* The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. */
  seLinuxOptions?: SELinuxOptions;
  /* The seccomp options to use by the containers in this pod. */
  seccompProfile?: SeccompProfile;
  /* A list of groups applied to the first process run in each container, in addition to the container's primary GID.  If unspecified, no groups will be added to any container. */
  supplementalGroups?: number[];
  /* Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. */
  sysctls?: Sysctl[];
  /* The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  windowsOptions?: WindowsSecurityContextOptions;
}
/* io.k8s.api.core.v1.PodSpec */
/* PodSpec is a description of a pod. */
export interface PodSpec {
  /* Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer. */
  activeDeadlineSeconds?: number;
  /* If specified, the pod's scheduling constraints */
  affinity?: Affinity;
  /* AutomountServiceAccountToken indicates whether a service account token should be automatically mounted. */
  automountServiceAccountToken?: boolean;
  /* List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated. */
  containers: Container[];
  /* Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy. */
  dnsConfig?: PodDNSConfig;
  /* Set DNS policy for the pod. Defaults to "ClusterFirst". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'. */
  dnsPolicy?: string;
  /* EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true. */
  enableServiceLinks?: boolean;
  /* List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource. This field is alpha-level and is only honored by servers that enable the EphemeralContainers feature. */
  ephemeralContainers?: EphemeralContainer[];
  /* HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified. This is only valid for non-hostNetwork pods. */
  hostAliases?: HostAlias[];
  /* Use the host's ipc namespace. Optional: Default to false. */
  hostIPC?: boolean;
  /* Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false. */
  hostNetwork?: boolean;
  /* Use the host's pid namespace. Optional: Default to false. */
  hostPID?: boolean;
  /* Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value. */
  hostname?: string;
  /* ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. For example, in the case of docker, only DockerConfig type secrets are honored. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod */
  imagePullSecrets?: LocalObjectReference[];
  /* List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/ */
  initContainers?: Container[];
  /* NodeName is a request to schedule this pod onto a specific node. If it is non-empty, the scheduler simply schedules this pod onto that node, assuming that it fits resource requirements. */
  nodeName?: string;
  /* NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/ */
  nodeSelector?: {
    [key: string]: unknown;
  };
  /* Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md This field is beta-level as of Kubernetes v1.18, and is only honored by servers that enable the PodOverhead feature. */
  overhead?: {
    [key: string]: unknown;
  };
  /* PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset. This field is beta-level, gated by the NonPreemptingPriority feature-gate. */
  preemptionPolicy?: string;
  /* The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority. */
  priority?: number;
  /* If specified, indicates the pod's priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default. */
  priorityClassName?: string;
  /* If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates */
  readinessGates?: PodReadinessGate[];
  /* Restart policy for all containers within the pod. One of Always, OnFailure, Never. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy */
  restartPolicy?: string;
  /* RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class This is a beta feature as of Kubernetes v1.14. */
  runtimeClassName?: string;
  /* If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler. */
  schedulerName?: string;
  /* SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field. */
  securityContext?: PodSecurityContext;
  /* DeprecatedServiceAccount is a depreciated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead. */
  serviceAccount?: string;
  /* ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/ */
  serviceAccountName?: string;
  /* If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false. */
  setHostnameAsFQDN?: boolean;
  /* Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false. */
  shareProcessNamespace?: boolean;
  /* If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". If not specified, the pod will not have a domainname at all. */
  subdomain?: string;
  /* Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds. */
  terminationGracePeriodSeconds?: number;
  /* If specified, the pod's tolerations. */
  tolerations?: Toleration[];
  /* TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed. */
  topologySpreadConstraints?: TopologySpreadConstraint[];
  /* List of volumes that can be mounted by containers belonging to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes */
  volumes?: Volume[];
}
/* io.k8s.api.core.v1.PodStatus */
/* PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane. */
export interface PodStatus {
  /* Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions */
  conditions?: PodCondition[];
  /* The list has one entry per container in the manifest. Each entry is currently the output of `docker inspect`. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status */
  containerStatuses?: ContainerStatus[];
  /* Status for any ephemeral containers that have run in this pod. This field is alpha-level and is only populated by servers that enable the EphemeralContainers feature. */
  ephemeralContainerStatuses?: ContainerStatus[];
  /* IP address of the host to which the pod is assigned. Empty if not yet scheduled. */
  hostIP?: string;
  /* The list has one entry per init container in the manifest. The most recent successful init container will have ready = true, the most recently started container will have startTime set. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status */
  initContainerStatuses?: ContainerStatus[];
  /* A human readable message indicating details about why the pod is in this condition. */
  message?: string;
  /* nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled. */
  nominatedNodeName?: string;
  /* The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:
  
  Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.
  
  More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase */
  phase?: string;
  /* IP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated. */
  podIP?: string;
  /* podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet. */
  podIPs?: PodIP[];
  /* The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md */
  qosClass?: string;
  /* A brief CamelCase message indicating details about why the pod is in this state. e.g. 'Evicted' */
  reason?: string;
  /* RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod. */
  startTime?: Time;
}
/* io.k8s.api.core.v1.PodTemplate */
/* PodTemplate describes a template for creating copies of a predefined pod. */
export interface PodTemplate {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Template defines the pods that will be created from this pod template. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  template?: PodTemplateSpec;
}
/* io.k8s.api.core.v1.PodTemplateList */
/* PodTemplateList is a list of PodTemplates. */
export interface PodTemplateList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of pod templates */
  items: PodTemplate[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.PodTemplateSpec */
/* PodTemplateSpec describes the data a pod should have when created from a template */
export interface PodTemplateSpec {
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: PodSpec;
}
export interface PortStatus {
  /* Error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified in this file and those shall use
    CamelCase names
  - cloud provider specific error values must have names that comply with the
    format foo.example.com/CamelCase. */
  error?: string;
  /* Port is the port number of the service port of which status is recorded here */
  port: number;
  /* Protocol is the protocol of the service port of which status is recorded here The supported values are: "TCP", "UDP", "SCTP" */
  protocol: string;
}
/* io.k8s.api.core.v1.PortworxVolumeSource */
/* PortworxVolumeSource represents a Portworx volume resource. */
export interface PortworxVolumeSource {
  /* FSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* VolumeID uniquely identifies a Portworx volume */
  volumeID: string;
}
/* io.k8s.api.core.v1.PreferredSchedulingTerm */
/* An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op). */
export interface PreferredSchedulingTerm {
  /* A node selector term, associated with the corresponding weight. */
  preference: NodeSelectorTerm;
  /* Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100. */
  weight: number;
}
/* io.k8s.api.core.v1.Probe */
/* Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic. */
export interface Probe {
  /* One and only one of the following should be specified. Exec specifies the action to take. */
  exec?: ExecAction;
  /* Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1. */
  failureThreshold?: number;
  /* HTTPGet specifies the http request to perform. */
  httpGet?: HTTPGetAction;
  /* Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes */
  initialDelaySeconds?: number;
  /* How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. */
  periodSeconds?: number;
  /* Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1. */
  successThreshold?: number;
  /* TCPSocket specifies an action involving a TCP port. TCP hooks not yet supported */
  tcpSocket?: TCPSocketAction;
  /* Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset. */
  terminationGracePeriodSeconds?: number;
  /* Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes */
  timeoutSeconds?: number;
}
/* io.k8s.api.core.v1.ProjectedVolumeSource */
/* Represents a projected volume source */
export interface ProjectedVolumeSource {
  /* Mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. */
  defaultMode?: number;
  /* list of volume projections */
  sources?: VolumeProjection[];
}
/* io.k8s.api.core.v1.QuobyteVolumeSource */
/* Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling. */
export interface QuobyteVolumeSource {
  /* Group to map volume access to Default is no group */
  group?: string;
  /* ReadOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false. */
  readOnly?: boolean;
  /* Registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes */
  registry: string;
  /* Tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin */
  tenant?: string;
  /* User to map volume access to Defaults to serivceaccount user */
  user?: string;
  /* Volume is a string that references an already created Quobyte volume by name. */
  volume: string;
}
/* io.k8s.api.core.v1.RBDPersistentVolumeSource */
/* Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling. */
export interface RBDPersistentVolumeSource {
  /* Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd */
  fsType?: string;
  /* The rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  image: string;
  /* Keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  keyring?: string;
  /* A collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  monitors: string[];
  /* The rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  pool?: string;
  /* ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  readOnly?: boolean;
  /* SecretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  secretRef?: SecretReference;
  /* The rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  user?: string;
}
/* io.k8s.api.core.v1.RBDVolumeSource */
/* Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling. */
export interface RBDVolumeSource {
  /* Filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd */
  fsType?: string;
  /* The rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  image: string;
  /* Keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  keyring?: string;
  /* A collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  monitors: string[];
  /* The rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  pool?: string;
  /* ReadOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  readOnly?: boolean;
  /* SecretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  secretRef?: LocalObjectReference;
  /* The rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it */
  user?: string;
}
/* io.k8s.api.core.v1.ReplicationController */
/* ReplicationController represents the configuration of a replication controller. */
export interface ReplicationController {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* If the Labels of a ReplicationController are empty, they are defaulted to be the same as the Pod(s) that the replication controller manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the specification of the desired behavior of the replication controller. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: ReplicationControllerSpec;
  /* Status is the most recently observed status of the replication controller. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: ReplicationControllerStatus;
}
/* io.k8s.api.core.v1.ReplicationControllerCondition */
/* ReplicationControllerCondition describes the state of a replication controller at a certain point. */
export interface ReplicationControllerCondition {
  /* The last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* A human readable message indicating details about the transition. */
  message?: string;
  /* The reason for the condition's last transition. */
  reason?: string;
  /* Status of the condition, one of True, False, Unknown. */
  status: string;
  /* Type of replication controller condition. */
  type: string;
}
/* io.k8s.api.core.v1.ReplicationControllerList */
/* ReplicationControllerList is a collection of replication controllers. */
export interface ReplicationControllerList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of replication controllers. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller */
  items: ReplicationController[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.ReplicationControllerSpec */
/* ReplicationControllerSpec is the specification of a replication controller. */
export interface ReplicationControllerSpec {
  /* Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready) */
  minReadySeconds?: number;
  /* Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller */
  replicas?: number;
  /* Selector is a label query over pods that should match the Replicas count. If Selector is empty, it is defaulted to the labels present on the Pod template. Label keys and values that must match in order to be controlled by this replication controller, if empty defaulted to labels on Pod template. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors */
  selector?: {
    [key: string]: unknown;
  };
  /* Template is the object that describes the pod that will be created if insufficient replicas are detected. This takes precedence over a TemplateRef. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template */
  template?: PodTemplateSpec;
}
/* io.k8s.api.core.v1.ReplicationControllerStatus */
/* ReplicationControllerStatus represents the current status of a replication controller. */
export interface ReplicationControllerStatus {
  /* The number of available replicas (ready for at least minReadySeconds) for this replication controller. */
  availableReplicas?: number;
  /* Represents the latest available observations of a replication controller's current state. */
  conditions?: ReplicationControllerCondition[];
  /* The number of pods that have labels matching the labels of the pod template of the replication controller. */
  fullyLabeledReplicas?: number;
  /* ObservedGeneration reflects the generation of the most recently observed replication controller. */
  observedGeneration?: number;
  /* The number of ready replicas for this replication controller. */
  readyReplicas?: number;
  /* Replicas is the most recently oberved number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller */
  replicas: number;
}
/* io.k8s.api.core.v1.ResourceFieldSelector */
/* ResourceFieldSelector represents container resources (cpu, memory) and their output format */
export interface ResourceFieldSelector {
  /* Container name: required for volumes, optional for env vars */
  containerName?: string;
  /* Specifies the output format of the exposed resources, defaults to "1" */
  divisor?: Quantity;
  /* Required: resource to select */
  resource: string;
}
/* io.k8s.api.core.v1.ResourceQuota */
/* ResourceQuota sets aggregate quota restrictions enforced per namespace */
export interface ResourceQuota {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the desired quota. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: ResourceQuotaSpec;
  /* Status defines the actual enforced quota and its current usage. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: ResourceQuotaStatus;
}
/* io.k8s.api.core.v1.ResourceQuotaList */
/* ResourceQuotaList is a list of ResourceQuota items. */
export interface ResourceQuotaList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of ResourceQuota objects. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/ */
  items: ResourceQuota[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.ResourceQuotaSpec */
/* ResourceQuotaSpec defines the desired hard limits to enforce for Quota. */
export interface ResourceQuotaSpec {
  /* hard is the set of desired hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/ */
  hard?: {
    [key: string]: unknown;
  };
  /* scopeSelector is also a collection of filters like scopes that must match each object tracked by a quota but expressed using ScopeSelectorOperator in combination with possible values. For a resource to match, both scopes AND scopeSelector (if specified in spec), must be matched. */
  scopeSelector?: ScopeSelector;
  /* A collection of filters that must match each object tracked by a quota. If not specified, the quota matches all objects. */
  scopes?: string[];
}
/* io.k8s.api.core.v1.ResourceQuotaStatus */
/* ResourceQuotaStatus defines the enforced hard limits and observed use. */
export interface ResourceQuotaStatus {
  /* Hard is the set of enforced hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/ */
  hard?: {
    [key: string]: unknown;
  };
  /* Used is the current observed total usage of the resource in the namespace. */
  used?: {
    [key: string]: unknown;
  };
}
/* io.k8s.api.core.v1.ResourceRequirements */
/* ResourceRequirements describes the compute resource requirements. */
export interface ResourceRequirements {
  /* Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ */
  limits?: {
    [key: string]: unknown;
  };
  /* Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ */
  requests?: {
    [key: string]: unknown;
  };
}
/* io.k8s.api.core.v1.SELinuxOptions */
/* SELinuxOptions are the labels to be applied to the container */
export interface SELinuxOptions {
  /* Level is SELinux level label that applies to the container. */
  level?: string;
  /* Role is a SELinux role label that applies to the container. */
  role?: string;
  /* Type is a SELinux type label that applies to the container. */
  type?: string;
  /* User is a SELinux user label that applies to the container. */
  user?: string;
}
/* io.k8s.api.core.v1.ScaleIOPersistentVolumeSource */
/* ScaleIOPersistentVolumeSource represents a persistent ScaleIO volume */
export interface ScaleIOPersistentVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs" */
  fsType?: string;
  /* The host address of the ScaleIO API Gateway. */
  gateway: string;
  /* The name of the ScaleIO Protection Domain for the configured storage. */
  protectionDomain?: string;
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* SecretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail. */
  secretRef: SecretReference;
  /* Flag to enable/disable SSL communication with Gateway, default false */
  sslEnabled?: boolean;
  /* Indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned. */
  storageMode?: string;
  /* The ScaleIO Storage Pool associated with the protection domain. */
  storagePool?: string;
  /* The name of the storage system as configured in ScaleIO. */
  system: string;
  /* The name of a volume already created in the ScaleIO system that is associated with this volume source. */
  volumeName?: string;
}
/* io.k8s.api.core.v1.ScaleIOVolumeSource */
/* ScaleIOVolumeSource represents a persistent ScaleIO volume */
export interface ScaleIOVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs". */
  fsType?: string;
  /* The host address of the ScaleIO API Gateway. */
  gateway: string;
  /* The name of the ScaleIO Protection Domain for the configured storage. */
  protectionDomain?: string;
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* SecretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail. */
  secretRef: LocalObjectReference;
  /* Flag to enable/disable SSL communication with Gateway, default false */
  sslEnabled?: boolean;
  /* Indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned. */
  storageMode?: string;
  /* The ScaleIO Storage Pool associated with the protection domain. */
  storagePool?: string;
  /* The name of the storage system as configured in ScaleIO. */
  system: string;
  /* The name of a volume already created in the ScaleIO system that is associated with this volume source. */
  volumeName?: string;
}
/* io.k8s.api.core.v1.ScopeSelector */
/* A scope selector represents the AND of the selectors represented by the scoped-resource selector requirements. */
export interface ScopeSelector {
  /* A list of scope selector requirements by scope of the resources. */
  matchExpressions?: ScopedResourceSelectorRequirement[];
}
/* io.k8s.api.core.v1.ScopedResourceSelectorRequirement */
/* A scoped-resource selector requirement is a selector that contains values, a scope name, and an operator that relates the scope name and values. */
export interface ScopedResourceSelectorRequirement {
  /* Represents a scope's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. */
  operator: string;
  /* The name of the scope that the selector applies to. */
  scopeName: string;
  /* An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch. */
  values?: string[];
}
/* io.k8s.api.core.v1.SeccompProfile */
/* SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set. */
export interface SeccompProfile {
  /* localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet's configured seccomp profile location. Must only be set if type is "Localhost". */
  localhostProfile?: string;
  /* type indicates which kind of seccomp profile will be applied. Valid options are:
  
  Localhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied. */
  type: string;
}
/* io.k8s.api.core.v1.Secret */
/* Secret holds secret data of a certain type. The total bytes of the values in the Data field must be less than MaxSecretSize bytes. */
export interface Secret {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Data contains the secret data. Each key must consist of alphanumeric characters, '-', '_' or '.'. The serialized form of the secret data is a base64 encoded string, representing the arbitrary (possibly non-string) data value here. Described in https://tools.ietf.org/html/rfc4648#section-4 */
  data?: {
    [key: string]: unknown;
  };
  /* Immutable, if set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil. */
  immutable?: boolean;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* stringData allows specifying non-binary secret data in string form. It is provided as a write-only input field for convenience. All keys and values are merged into the data field on write, overwriting any existing values. The stringData field is never output when reading from the API. */
  stringData?: {
    [key: string]: unknown;
  };
  /* Used to facilitate programmatic handling of secret data. */
  type?: string;
}
/* io.k8s.api.core.v1.SecretEnvSource */
/* SecretEnvSource selects a Secret to populate the environment variables with.

The contents of the target Secret's Data field will represent the key-value pairs as environment variables. */
export interface SecretEnvSource {
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the Secret must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.SecretKeySelector */
/* SecretKeySelector selects a key of a Secret. */
export interface SecretKeySelector {
  /* The key of the secret to select from.  Must be a valid secret key. */
  key: string;
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the Secret or its key must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.SecretList */
/* SecretList is a list of Secret. */
export interface SecretList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of secret objects. More info: https://kubernetes.io/docs/concepts/configuration/secret */
  items: Secret[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.SecretProjection */
/* Adapts a secret into a projected volume.

The contents of the target Secret's Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode. */
export interface SecretProjection {
  /* If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
  items?: KeyToPath[];
  /* Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name?: string;
  /* Specify whether the Secret or its key must be defined */
  optional?: boolean;
}
/* io.k8s.api.core.v1.SecretReference */
/* SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace */
export interface SecretReference {
  /* Name is unique within a namespace to reference a secret resource. */
  name?: string;
  /* Namespace defines the space within which the secret name must be unique. */
  namespace?: string;
}
/* io.k8s.api.core.v1.SecretVolumeSource */
/* Adapts a Secret into a volume.

The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling. */
export interface SecretVolumeSource {
  /* Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set. */
  defaultMode?: number;
  /* If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'. */
  items?: KeyToPath[];
  /* Specify whether the Secret or its keys must be defined */
  optional?: boolean;
  /* Name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret */
  secretName?: string;
}
/* io.k8s.api.core.v1.SecurityContext */
/* SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence. */
export interface SecurityContext {
  /* AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN */
  allowPrivilegeEscalation?: boolean;
  /* The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. */
  capabilities?: Capabilities;
  /* Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. */
  privileged?: boolean;
  /* procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. */
  procMount?: string;
  /* Whether this container has a read-only root filesystem. Default is false. */
  readOnlyRootFilesystem?: boolean;
  /* The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  runAsGroup?: number;
  /* Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  runAsNonRoot?: boolean;
  /* The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  runAsUser?: number;
  /* The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  seLinuxOptions?: SELinuxOptions;
  /* The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. */
  seccompProfile?: SeccompProfile;
  /* The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  windowsOptions?: WindowsSecurityContextOptions;
}
/* io.k8s.api.core.v1.Service */
/* Service is a named abstraction of software service (for example, mysql) consisting of local port (for example 3306) that the proxy listens on, and the selector that determines which pods will answer requests sent through the proxy. */
export interface Service {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec defines the behavior of a service. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: ServiceSpec;
  /* Most recently observed status of the service. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: ServiceStatus;
}
/* io.k8s.api.core.v1.ServiceAccount */
/* ServiceAccount binds together: * a name, understood by users, and perhaps by peripheral systems, for an identity * a principal that can be authenticated and authorized * a set of secrets */
export interface ServiceAccount {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* AutomountServiceAccountToken indicates whether pods running as this service account should have an API token automatically mounted. Can be overridden at the pod level. */
  automountServiceAccountToken?: boolean;
  /* ImagePullSecrets is a list of references to secrets in the same namespace to use for pulling any images in pods that reference this ServiceAccount. ImagePullSecrets are distinct from Secrets because Secrets can be mounted in the pod, but ImagePullSecrets are only accessed by the kubelet. More info: https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod */
  imagePullSecrets?: LocalObjectReference[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Secrets is the list of secrets allowed to be used by pods running using this ServiceAccount. More info: https://kubernetes.io/docs/concepts/configuration/secret */
  secrets?: ObjectReference[];
}
/* io.k8s.api.core.v1.ServiceAccountList */
/* ServiceAccountList is a list of ServiceAccount objects */
export interface ServiceAccountList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of ServiceAccounts. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/ */
  items: ServiceAccount[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.ServiceAccountTokenProjection */
/* ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise). */
export interface ServiceAccountTokenProjection {
  /* Audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver. */
  audience?: string;
  /* ExpirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes. */
  expirationSeconds?: number;
  /* Path is the path relative to the mount point of the file to project the token into. */
  path: string;
}
/* io.k8s.api.core.v1.ServiceList */
/* ServiceList holds a list of services. */
export interface ServiceList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of services */
  items: Service[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
}
/* io.k8s.api.core.v1.ServicePort */
/* ServicePort contains information on service's port. */
export interface ServicePort {
  /* The application protocol for this port. This field follows standard Kubernetes label syntax. Un-prefixed names are reserved for IANA standard service names (as per RFC-6335 and http://www.iana.org/assignments/service-names). Non-standard protocols should use prefixed names such as mycompany.com/my-custom-protocol. */
  appProtocol?: string;
  /* The name of this port within the service. This must be a DNS_LABEL. All ports within a ServiceSpec must have unique names. When considering the endpoints for a Service, this must match the 'name' field in the EndpointPort. Optional if only one ServicePort is defined on this service. */
  name?: string;
  /* The port on each node on which this service is exposed when type is NodePort or LoadBalancer.  Usually assigned by the system. If a value is specified, in-range, and not in use it will be used, otherwise the operation will fail.  If not specified, a port will be allocated if this Service requires one.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type from NodePort to ClusterIP). More info: https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport */
  nodePort?: number;
  /* The port that will be exposed by this service. */
  port: number;
  /* The IP protocol for this port. Supports "TCP", "UDP", and "SCTP". Default is TCP. */
  protocol?: string;
  /* Number or name of the port to access on the pods targeted by the service. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. If this is a string, it will be looked up as a named port in the target Pod's container ports. If this is not specified, the value of the 'port' field is used (an identity map). This field is ignored for services with clusterIP=None, and should be omitted or set equal to the 'port' field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service */
  targetPort?: IntOrString;
}
/* io.k8s.api.core.v1.ServiceSpec */
/* ServiceSpec describes the attributes that a user creates on a service. */
export interface ServiceSpec {
  /* allocateLoadBalancerNodePorts defines if NodePorts will be automatically allocated for services with type LoadBalancer.  Default is "true". It may be set to "false" if the cluster load-balancer does not rely on NodePorts.  If the caller requests specific NodePorts (by specifying a value), those requests will be respected, regardless of this field. This field may only be set for services with type LoadBalancer and will be cleared if the type is changed to any other type. This field is beta-level and is only honored by servers that enable the ServiceLBNodePortControl feature. */
  allocateLoadBalancerNodePorts?: boolean;
  /* clusterIP is the IP address of the service and is usually assigned randomly. If an address is specified manually, is in-range (as per system configuration), and is not in use, it will be allocated to the service; otherwise creation of the service will fail. This field may not be changed through updates unless the type field is also being changed to ExternalName (which requires this field to be blank) or the type field is being changed from ExternalName (in which case this field may optionally be specified, as describe above).  Valid values are "None", empty string (""), or a valid IP address. Setting this to "None" makes a "headless service" (no virtual IP), which is useful when direct endpoint connections are preferred and proxying is not required.  Only applies to types ClusterIP, NodePort, and LoadBalancer. If this field is specified when creating a Service of type ExternalName, creation will fail. This field will be wiped when updating a Service to type ExternalName. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies */
  clusterIP?: string;
  /* ClusterIPs is a list of IP addresses assigned to this service, and are usually assigned randomly.  If an address is specified manually, is in-range (as per system configuration), and is not in use, it will be allocated to the service; otherwise creation of the service will fail. This field may not be changed through updates unless the type field is also being changed to ExternalName (which requires this field to be empty) or the type field is being changed from ExternalName (in which case this field may optionally be specified, as describe above).  Valid values are "None", empty string (""), or a valid IP address.  Setting this to "None" makes a "headless service" (no virtual IP), which is useful when direct endpoint connections are preferred and proxying is not required.  Only applies to types ClusterIP, NodePort, and LoadBalancer. If this field is specified when creating a Service of type ExternalName, creation will fail. This field will be wiped when updating a Service to type ExternalName.  If this field is not specified, it will be initialized from the clusterIP field.  If this field is specified, clients must ensure that clusterIPs[0] and clusterIP have the same value.
  
  Unless the "IPv6DualStack" feature gate is enabled, this field is limited to one value, which must be the same as the clusterIP field.  If the feature gate is enabled, this field may hold a maximum of two entries (dual-stack IPs, in either order).  These IPs must correspond to the values of the ipFamilies field. Both clusterIPs and ipFamilies are governed by the ipFamilyPolicy field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies */
  clusterIPs?: string[];
  /* externalIPs is a list of IP addresses for which nodes in the cluster will also accept traffic for this service.  These IPs are not managed by Kubernetes.  The user is responsible for ensuring that traffic arrives at a node with this IP.  A common example is external load-balancers that are not part of the Kubernetes system. */
  externalIPs?: string[];
  /* externalName is the external reference that discovery mechanisms will return as an alias for this service (e.g. a DNS CNAME record). No proxying will be involved.  Must be a lowercase RFC-1123 hostname (https://tools.ietf.org/html/rfc1123) and requires `type` to be "ExternalName". */
  externalName?: string;
  /* externalTrafficPolicy denotes if this Service desires to route external traffic to node-local or cluster-wide endpoints. "Local" preserves the client source IP and avoids a second hop for LoadBalancer and Nodeport type services, but risks potentially imbalanced traffic spreading. "Cluster" obscures the client source IP and may cause a second hop to another node, but should have good overall load-spreading. */
  externalTrafficPolicy?: string;
  /* healthCheckNodePort specifies the healthcheck nodePort for the service. This only applies when type is set to LoadBalancer and externalTrafficPolicy is set to Local. If a value is specified, is in-range, and is not in use, it will be used.  If not specified, a value will be automatically allocated.  External systems (e.g. load-balancers) can use this port to determine if a given node holds endpoints for this service or not.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type). */
  healthCheckNodePort?: number;
  /* InternalTrafficPolicy specifies if the cluster internal traffic should be routed to all endpoints or node-local endpoints only. "Cluster" routes internal traffic to a Service to all endpoints. "Local" routes traffic to node-local endpoints only, traffic is dropped if no node-local endpoints are ready. The default value is "Cluster". */
  internalTrafficPolicy?: string;
  /* IPFamilies is a list of IP families (e.g. IPv4, IPv6) assigned to this service, and is gated by the "IPv6DualStack" feature gate.  This field is usually assigned automatically based on cluster configuration and the ipFamilyPolicy field. If this field is specified manually, the requested family is available in the cluster, and ipFamilyPolicy allows it, it will be used; otherwise creation of the service will fail.  This field is conditionally mutable: it allows for adding or removing a secondary IP family, but it does not allow changing the primary IP family of the Service.  Valid values are "IPv4" and "IPv6".  This field only applies to Services of types ClusterIP, NodePort, and LoadBalancer, and does apply to "headless" services.  This field will be wiped when updating a Service to type ExternalName.
  
  This field may hold a maximum of two entries (dual-stack families, in either order).  These families must correspond to the values of the clusterIPs field, if specified. Both clusterIPs and ipFamilies are governed by the ipFamilyPolicy field. */
  ipFamilies?: string[];
  /* IPFamilyPolicy represents the dual-stack-ness requested or required by this Service, and is gated by the "IPv6DualStack" feature gate.  If there is no value provided, then this field will be set to SingleStack. Services can be "SingleStack" (a single IP family), "PreferDualStack" (two IP families on dual-stack configured clusters or a single IP family on single-stack clusters), or "RequireDualStack" (two IP families on dual-stack configured clusters, otherwise fail). The ipFamilies and clusterIPs fields depend on the value of this field.  This field will be wiped when updating a service to type ExternalName. */
  ipFamilyPolicy?: string;
  /* loadBalancerClass is the class of the load balancer implementation this Service belongs to. If specified, the value of this field must be a label-style identifier, with an optional prefix, e.g. "internal-vip" or "example.com/internal-vip". Unprefixed names are reserved for end-users. This field can only be set when the Service type is 'LoadBalancer'. If not set, the default load balancer implementation is used, today this is typically done through the cloud provider integration, but should apply for any default implementation. If set, it is assumed that a load balancer implementation is watching for Services with a matching class. Any default load balancer implementation (e.g. cloud providers) should ignore Services that set this field. This field can only be set when creating or updating a Service to type 'LoadBalancer'. Once set, it can not be changed. This field will be wiped when a service is updated to a non 'LoadBalancer' type. */
  loadBalancerClass?: string;
  /* Only applies to Service Type: LoadBalancer LoadBalancer will get created with the IP specified in this field. This feature depends on whether the underlying cloud-provider supports specifying the loadBalancerIP when a load balancer is created. This field will be ignored if the cloud-provider does not support the feature. */
  loadBalancerIP?: string;
  /* If specified and supported by the platform, this will restrict traffic through the cloud-provider load-balancer will be restricted to the specified client IPs. This field will be ignored if the cloud-provider does not support the feature." More info: https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/ */
  loadBalancerSourceRanges?: string[];
  /* The list of ports that are exposed by this service. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies */
  ports?: ServicePort[];
  /* publishNotReadyAddresses indicates that any agent which deals with endpoints for this Service should disregard any indications of ready/not-ready. The primary use case for setting this field is for a StatefulSet's Headless Service to propagate SRV DNS records for its Pods for the purpose of peer discovery. The Kubernetes controllers that generate Endpoints and EndpointSlice resources for Services interpret this to mean that all endpoints are considered "ready" even if the Pods themselves are not. Agents which consume only Kubernetes generated endpoints through the Endpoints or EndpointSlice resources can safely assume this behavior. */
  publishNotReadyAddresses?: boolean;
  /* Route service traffic to pods with label keys and values matching this selector. If empty or not present, the service is assumed to have an external process managing its endpoints, which Kubernetes will not modify. Only applies to types ClusterIP, NodePort, and LoadBalancer. Ignored if type is ExternalName. More info: https://kubernetes.io/docs/concepts/services-networking/service/ */
  selector?: {
    [key: string]: unknown;
  };
  /* Supports "ClientIP" and "None". Used to maintain session affinity. Enable client IP based session affinity. Must be ClientIP or None. Defaults to None. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies */
  sessionAffinity?: string;
  /* sessionAffinityConfig contains the configurations of session affinity. */
  sessionAffinityConfig?: SessionAffinityConfig;
  /* type determines how the Service is exposed. Defaults to ClusterIP. Valid options are ExternalName, ClusterIP, NodePort, and LoadBalancer. "ClusterIP" allocates a cluster-internal IP address for load-balancing to endpoints. Endpoints are determined by the selector or if that is not specified, by manual construction of an Endpoints object or EndpointSlice objects. If clusterIP is "None", no virtual IP is allocated and the endpoints are published as a set of endpoints rather than a virtual IP. "NodePort" builds on ClusterIP and allocates a port on every node which routes to the same endpoints as the clusterIP. "LoadBalancer" builds on NodePort and creates an external load-balancer (if supported in the current cloud) which routes to the same endpoints as the clusterIP. "ExternalName" aliases this service to the specified externalName. Several other fields do not apply to ExternalName services. More info: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types */
  type?: string;
}
/* io.k8s.api.core.v1.ServiceStatus */
/* ServiceStatus represents the current status of a service. */
export interface ServiceStatus {
  /* Current service state */
  conditions?: Condition[];
  /* LoadBalancer contains the current status of the load-balancer, if one is present. */
  loadBalancer?: LoadBalancerStatus;
}
/* io.k8s.api.core.v1.SessionAffinityConfig */
/* SessionAffinityConfig represents the configurations of session affinity. */
export interface SessionAffinityConfig {
  /* clientIP contains the configurations of Client IP based session affinity. */
  clientIP?: ClientIPConfig;
}
/* io.k8s.api.core.v1.StorageOSPersistentVolumeSource */
/* Represents a StorageOS persistent volume resource. */
export interface StorageOSPersistentVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* SecretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted. */
  secretRef?: ObjectReference;
  /* VolumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace. */
  volumeName?: string;
  /* VolumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created. */
  volumeNamespace?: string;
}
/* io.k8s.api.core.v1.StorageOSVolumeSource */
/* Represents a StorageOS persistent volume resource. */
export interface StorageOSVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. */
  readOnly?: boolean;
  /* SecretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted. */
  secretRef?: LocalObjectReference;
  /* VolumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace. */
  volumeName?: string;
  /* VolumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created. */
  volumeNamespace?: string;
}
/* io.k8s.api.core.v1.Sysctl */
/* Sysctl defines a kernel parameter to be set */
export interface Sysctl {
  /* Name of a property to set */
  name: string;
  /* Value of a property to set */
  value: string;
}
/* io.k8s.api.core.v1.TCPSocketAction */
/* TCPSocketAction describes an action based on opening a socket */
export interface TCPSocketAction {
  /* Optional: Host name to connect to, defaults to the pod IP. */
  host?: string;
  /* Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. */
  port: IntOrString;
}
/* io.k8s.api.core.v1.Taint */
/* The node this Taint is attached to has the "effect" on any pod that does not tolerate the Taint. */
export interface Taint {
  /* Required. The effect of the taint on pods that do not tolerate the taint. Valid effects are NoSchedule, PreferNoSchedule and NoExecute. */
  effect: string;
  /* Required. The taint key to be applied to a node. */
  key: string;
  /* TimeAdded represents the time at which the taint was added. It is only written for NoExecute taints. */
  timeAdded?: Time;
  /* The taint value corresponding to the taint key. */
  value?: string;
}
/* io.k8s.api.core.v1.Toleration */
/* The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>. */
export interface Toleration {
  /* Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute. */
  effect?: string;
  /* Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys. */
  key?: string;
  /* Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category. */
  operator?: string;
  /* TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system. */
  tolerationSeconds?: number;
  /* Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string. */
  value?: string;
}
/* io.k8s.api.core.v1.TopologySelectorLabelRequirement */
/* A topology selector requirement is a selector that matches given label. This is an alpha feature and may change in the future. */
export interface TopologySelectorLabelRequirement {
  /* The label key that the selector applies to. */
  key: string;
  /* An array of string values. One value must match the label to be selected. Each entry in Values is ORed. */
  values: string[];
}
/* io.k8s.api.core.v1.TopologySelectorTerm */
/* A topology selector term represents the result of label queries. A null or empty topology selector term matches no objects. The requirements of them are ANDed. It provides a subset of functionality as NodeSelectorTerm. This is an alpha feature and may change in the future. */
export interface TopologySelectorTerm {
  /* A list of topology selector requirements by labels. */
  matchLabelExpressions?: TopologySelectorLabelRequirement[];
}
/* io.k8s.api.core.v1.TopologySpreadConstraint */
/* TopologySpreadConstraint specifies how to spread matching pods among the given topology. */
export interface TopologySpreadConstraint {
  /* LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain. */
  labelSelector?: LabelSelector;
  /* MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 1/1/0: | zone1 | zone2 | zone3 | |   P   |   P   |       | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 1/1/1; scheduling it onto zone1(zone2) would make the ActualSkew(2-0) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed. */
  maxSkew: number;
  /* TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each <key, value> as a "bucket", and try to put balanced number of pods into each bucket. It's a required field. */
  topologyKey: string;
  /* WhenUnsatisfiable indicates how to deal with a pod if it doesn't satisfy the spread constraint. - DoNotSchedule (default) tells the scheduler not to schedule it. - ScheduleAnyway tells the scheduler to schedule the pod in any location,
    but giving higher precedence to topologies that would help reduce the
    skew.
  A constraint is considered "Unsatisfiable" for an incoming pod if and only if every possible node assigment for that pod would violate "MaxSkew" on some topology. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 3/1/1: | zone1 | zone2 | zone3 | | P P P |   P   |   P   | If WhenUnsatisfiable is set to DoNotSchedule, incoming pod can only be scheduled to zone2(zone3) to become 3/2/1(3/1/2) as ActualSkew(2-1) on zone2(zone3) satisfies MaxSkew(1). In other words, the cluster can still be imbalanced, but scheduler won't make it *more* imbalanced. It's a required field. */
  whenUnsatisfiable: string;
}
/* io.k8s.api.core.v1.TypedLocalObjectReference */
/* TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace. */
export interface TypedLocalObjectReference {
  /* APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required. */
  apiGroup?: string;
  /* Kind is the type of resource being referenced */
  kind: string;
  /* Name is the name of resource being referenced */
  name: string;
}
/* io.k8s.api.core.v1.Volume */
/* Volume represents a named volume in a pod that may be accessed by any container in the pod. */
export interface Volume {
  /* AWSElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore */
  awsElasticBlockStore?: AWSElasticBlockStoreVolumeSource;
  /* AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. */
  azureDisk?: AzureDiskVolumeSource;
  /* AzureFile represents an Azure File Service mount on the host and bind mount to the pod. */
  azureFile?: AzureFileVolumeSource;
  /* CephFS represents a Ceph FS mount on the host that shares a pod's lifetime */
  cephfs?: CephFSVolumeSource;
  /* Cinder represents a cinder volume attached and mounted on kubelets host machine. More info: https://examples.k8s.io/mysql-cinder-pd/README.md */
  cinder?: CinderVolumeSource;
  /* ConfigMap represents a configMap that should populate this volume */
  configMap?: ConfigMapVolumeSource;
  /* CSI (Container Storage Interface) represents ephemeral storage that is handled by certain external CSI drivers (Beta feature). */
  csi?: CSIVolumeSource;
  /* DownwardAPI represents downward API about the pod that should populate this volume */
  downwardAPI?: DownwardAPIVolumeSource;
  /* EmptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir */
  emptyDir?: EmptyDirVolumeSource;
  /* Ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.
  
  Use this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity
     tracking are needed,
  c) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through
     a PersistentVolumeClaim (see EphemeralVolumeSource for more
     information on the connection between this volume type
     and PersistentVolumeClaim).
  
  Use PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.
  
  Use CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.
  
  A pod can use both types of ephemeral volumes and persistent volumes at the same time.
  
  This is a beta feature and only available when the GenericEphemeralVolume feature gate is enabled. */
  ephemeral?: EphemeralVolumeSource;
  /* FC represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod. */
  fc?: FCVolumeSource;
  /* FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. */
  flexVolume?: FlexVolumeSource;
  /* Flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running */
  flocker?: FlockerVolumeSource;
  /* GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk */
  gcePersistentDisk?: GCEPersistentDiskVolumeSource;
  /* GitRepo represents a git repository at a particular revision. DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container. */
  gitRepo?: GitRepoVolumeSource;
  /* Glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/glusterfs/README.md */
  glusterfs?: GlusterfsVolumeSource;
  /* HostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath */
  hostPath?: HostPathVolumeSource;
  /* ISCSI represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://examples.k8s.io/volumes/iscsi/README.md */
  iscsi?: ISCSIVolumeSource;
  /* Volume's name. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names */
  name: string;
  /* NFS represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs */
  nfs?: NFSVolumeSource;
  /* PersistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims */
  persistentVolumeClaim?: PersistentVolumeClaimVolumeSource;
  /* PhotonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine */
  photonPersistentDisk?: PhotonPersistentDiskVolumeSource;
  /* PortworxVolume represents a portworx volume attached and mounted on kubelets host machine */
  portworxVolume?: PortworxVolumeSource;
  /* Items for all in one resources secrets, configmaps, and downward API */
  projected?: ProjectedVolumeSource;
  /* Quobyte represents a Quobyte mount on the host that shares a pod's lifetime */
  quobyte?: QuobyteVolumeSource;
  /* RBD represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/rbd/README.md */
  rbd?: RBDVolumeSource;
  /* ScaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes. */
  scaleIO?: ScaleIOVolumeSource;
  /* Secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret */
  secret?: SecretVolumeSource;
  /* StorageOS represents a StorageOS volume attached and mounted on Kubernetes nodes. */
  storageos?: StorageOSVolumeSource;
  /* VsphereVolume represents a vSphere volume attached and mounted on kubelets host machine */
  vsphereVolume?: VsphereVirtualDiskVolumeSource;
}
/* io.k8s.api.core.v1.VolumeDevice */
/* volumeDevice describes a mapping of a raw block device within a container. */
export interface VolumeDevice {
  /* devicePath is the path inside of the container that the device will be mapped to. */
  devicePath: string;
  /* name must match the name of a persistentVolumeClaim in the pod */
  name: string;
}
/* io.k8s.api.core.v1.VolumeMount */
/* VolumeMount describes a mounting of a Volume within a container. */
export interface VolumeMount {
  /* Path within the container at which the volume should be mounted.  Must not contain ':'. */
  mountPath: string;
  /* mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10. */
  mountPropagation?: string;
  /* This must match the Name of a Volume. */
  name: string;
  /* Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false. */
  readOnly?: boolean;
  /* Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root). */
  subPath?: string;
  /* Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to "" (volume's root). SubPathExpr and SubPath are mutually exclusive. */
  subPathExpr?: string;
}
/* io.k8s.api.core.v1.VolumeNodeAffinity */
/* VolumeNodeAffinity defines constraints that limit what nodes this volume can be accessed from. */
export interface VolumeNodeAffinity {
  /* Required specifies hard node constraints that must be met. */
  required?: NodeSelector;
}
/* io.k8s.api.core.v1.VolumeProjection */
/* Projection that may be projected along with other supported volume types */
export interface VolumeProjection {
  /* information about the configMap data to project */
  configMap?: ConfigMapProjection;
  /* information about the downwardAPI data to project */
  downwardAPI?: DownwardAPIProjection;
  /* information about the secret data to project */
  secret?: SecretProjection;
  /* information about the serviceAccountToken data to project */
  serviceAccountToken?: ServiceAccountTokenProjection;
}
/* io.k8s.api.core.v1.VsphereVirtualDiskVolumeSource */
/* Represents a vSphere volume resource. */
export interface VsphereVirtualDiskVolumeSource {
  /* Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. */
  fsType?: string;
  /* Storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName. */
  storagePolicyID?: string;
  /* Storage Policy Based Management (SPBM) profile name. */
  storagePolicyName?: string;
  /* Path that identifies vSphere volume vmdk */
  volumePath: string;
}
/* io.k8s.api.core.v1.WeightedPodAffinityTerm */
/* The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s) */
export interface WeightedPodAffinityTerm {
  /* Required. A pod affinity term, associated with the corresponding weight. */
  podAffinityTerm: PodAffinityTerm;
  /* weight associated with matching the corresponding podAffinityTerm, in the range 1-100. */
  weight: number;
}
/* io.k8s.api.core.v1.WindowsSecurityContextOptions */
/* WindowsSecurityContextOptions contain Windows-specific options and credentials. */
export interface WindowsSecurityContextOptions {
  /* GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field. */
  gmsaCredentialSpec?: string;
  /* GMSACredentialSpecName is the name of the GMSA credential spec to use. */
  gmsaCredentialSpecName?: string;
  /* HostProcess determines if a container should be run as a 'Host Process' container. This field is alpha-level and will only be honored by components that enable the WindowsHostProcessContainers feature flag. Setting this field without the feature flag will result in errors when validating the Pod. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers).  In addition, if HostProcess is true then HostNetwork must also be set to true. */
  hostProcess?: boolean;
  /* The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. */
  runAsUserName?: string;
}
/* io.k8s.api.discovery.v1.Endpoint */
/* Endpoint represents a single logical "backend" implementing a service. */
export interface Endpoint {
  /* addresses of this endpoint. The contents of this field are interpreted according to the corresponding EndpointSlice addressType field. Consumers must handle different types of addresses in the context of their own capabilities. This must contain at least one address but no more than 100. */
  addresses: string[];
  /* conditions contains information about the current status of the endpoint. */
  conditions?: EndpointConditions;
  /* deprecatedTopology contains topology information part of the v1beta1 API. This field is deprecated, and will be removed when the v1beta1 API is removed (no sooner than kubernetes v1.24).  While this field can hold values, it is not writable through the v1 API, and any attempts to write to it will be silently ignored. Topology information can be found in the zone and nodeName fields instead. */
  deprecatedTopology?: {
    [key: string]: unknown;
  };
  /* hints contains information associated with how an endpoint should be consumed. */
  hints?: EndpointHints;
  /* hostname of this endpoint. This field may be used by consumers of endpoints to distinguish endpoints from each other (e.g. in DNS names). Multiple endpoints which use the same hostname should be considered fungible (e.g. multiple A values in DNS). Must be lowercase and pass DNS Label (RFC 1123) validation. */
  hostname?: string;
  /* nodeName represents the name of the Node hosting this endpoint. This can be used to determine endpoints local to a Node. This field can be enabled with the EndpointSliceNodeName feature gate. */
  nodeName?: string;
  /* targetRef is a reference to a Kubernetes object that represents this endpoint. */
  targetRef?: ObjectReference;
  /* zone is the name of the Zone this endpoint exists in. */
  zone?: string;
}
/* io.k8s.api.discovery.v1.EndpointConditions */
/* EndpointConditions represents the current condition of an endpoint. */
export interface EndpointConditions {
  /* ready indicates that this endpoint is prepared to receive traffic, according to whatever system is managing the endpoint. A nil value indicates an unknown state. In most cases consumers should interpret this unknown state as ready. For compatibility reasons, ready should never be "true" for terminating endpoints. */
  ready?: boolean;
  /* serving is identical to ready except that it is set regardless of the terminating state of endpoints. This condition should be set to true for a ready endpoint that is terminating. If nil, consumers should defer to the ready condition. This field can be enabled with the EndpointSliceTerminatingCondition feature gate. */
  serving?: boolean;
  /* terminating indicates that this endpoint is terminating. A nil value indicates an unknown state. Consumers should interpret this unknown state to mean that the endpoint is not terminating. This field can be enabled with the EndpointSliceTerminatingCondition feature gate. */
  terminating?: boolean;
}
/* io.k8s.api.discovery.v1.EndpointHints */
/* EndpointHints provides hints describing how an endpoint should be consumed. */
export interface EndpointHints {
  /* forZones indicates the zone(s) this endpoint should be consumed by to enable topology aware routing. */
  forZones?: ForZone[];
}
/* io.k8s.api.discovery.v1.EndpointPort */
/* EndpointPort represents a Port used by an EndpointSlice */
export interface DiscoveryEndpointPort {
  /* The application protocol for this port. This field follows standard Kubernetes label syntax. Un-prefixed names are reserved for IANA standard service names (as per RFC-6335 and http://www.iana.org/assignments/service-names). Non-standard protocols should use prefixed names such as mycompany.com/my-custom-protocol. */
  appProtocol?: string;
  /* The name of this port. All ports in an EndpointSlice must have a unique name. If the EndpointSlice is dervied from a Kubernetes service, this corresponds to the Service.ports[].name. Name must either be an empty string or pass DNS_LABEL validation: * must be no more than 63 characters long. * must consist of lower case alphanumeric characters or '-'. * must start and end with an alphanumeric character. Default is empty string. */
  name?: string;
  /* The port number of the endpoint. If this is not specified, ports are not restricted and must be interpreted in the context of the specific consumer. */
  port?: number;
  /* The IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP. */
  protocol?: string;
}
/* io.k8s.api.discovery.v1.EndpointSlice */
/* EndpointSlice represents a subset of the endpoints that implement a service. For a given service there may be multiple EndpointSlice objects, selected by labels, which must be joined to produce the full set of endpoints. */
export interface EndpointSlice {
  /* addressType specifies the type of address carried by this EndpointSlice. All addresses in this slice must be the same type. This field is immutable after creation. The following address types are currently supported: * IPv4: Represents an IPv4 Address. * IPv6: Represents an IPv6 Address. * FQDN: Represents a Fully Qualified Domain Name. */
  addressType: string;
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* endpoints is a list of unique endpoints in this slice. Each slice may include a maximum of 1000 endpoints. */
  endpoints: Endpoint[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ObjectMeta;
  /* ports specifies the list of network ports exposed by each endpoint in this slice. Each port must have a unique name. When ports is empty, it indicates that there are no defined ports. When a port is defined with a nil port value, it indicates "all ports". Each slice may include a maximum of 100 ports. */
  ports?: DiscoveryEndpointPort[];
}
/* io.k8s.api.discovery.v1.EndpointSliceList */
/* EndpointSliceList represents a list of endpoint slices */
export interface EndpointSliceList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* List of endpoint slices */
  items: EndpointSlice[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.discovery.v1.ForZone */
/* ForZone provides information about which zones should consume this endpoint. */
export interface ForZone {
  /* name represents the name of the zone. */
  name: string;
}
/* io.k8s.api.events.v1.EventList */
/* EventList is a list of Event objects. */
export interface EventList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is a list of schema objects. */
  items: Event[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.networking.v1.HTTPIngressPath */
/* HTTPIngressPath associates a path with a backend. Incoming urls matching the path are forwarded to the backend. */
export interface HTTPIngressPath {
  /* Backend defines the referenced service endpoint to which the traffic will be forwarded to. */
  backend: IngressBackend;
  /* Path is matched against the path of an incoming request. Currently it can contain characters disallowed from the conventional "path" part of a URL as defined by RFC 3986. Paths must begin with a '/' and must be present when using PathType with value "Exact" or "Prefix". */
  path?: string;
  /* PathType determines the interpretation of the Path matching. PathType can be one of the following values: * Exact: Matches the URL path exactly. * Prefix: Matches based on a URL path prefix split by '/'. Matching is
    done on a path element by element basis. A path element refers is the
    list of labels in the path split by the '/' separator. A request is a
    match for path p if every p is an element-wise prefix of p of the
    request path. Note that if the last element of the path is a substring
    of the last element in request path, it is not a match (e.g. /foo/bar
    matches /foo/bar/baz, but does not match /foo/barbaz).
  * ImplementationSpecific: Interpretation of the Path matching is up to
    the IngressClass. Implementations can treat this as a separate PathType
    or treat it identically to Prefix or Exact path types.
  Implementations are required to support all path types. */
  pathType: string;
}
/* io.k8s.api.networking.v1.HTTPIngressRuleValue */
/* HTTPIngressRuleValue is a list of http selectors pointing to backends. In the example: http://<host>/<path>?<searchpart> -> backend where where parts of the url correspond to RFC 3986, this resource will be used to match against everything after the last '/' and before the first '?' or '#'. */
export interface HTTPIngressRuleValue {
  /* A collection of paths that map requests to backends. */
  paths: HTTPIngressPath[];
}
/* io.k8s.api.networking.v1.IPBlock */
/* IPBlock describes a particular CIDR (Ex. "192.168.1.1/24","2001:db9::/64") that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The except entry describes CIDRs that should not be included within this rule. */
export interface IPBlock {
  /* CIDR is a string representing the IP Block Valid examples are "192.168.1.1/24" or "2001:db9::/64" */
  cidr: string;
  /* Except is a slice of CIDRs that should not be included within an IP Block Valid examples are "192.168.1.1/24" or "2001:db9::/64" Except values will be rejected if they are outside the CIDR range */
  except?: string[];
}
/* io.k8s.api.networking.v1.Ingress */
/* Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend. An Ingress can be configured to give services externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting etc. */
export interface Ingress {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec is the desired state of the Ingress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: IngressSpec;
  /* Status is the current state of the Ingress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: IngressStatus;
}
/* io.k8s.api.networking.v1.IngressBackend */
/* IngressBackend describes all endpoints for a given service and port. */
export interface IngressBackend {
  /* Resource is an ObjectRef to another Kubernetes resource in the namespace of the Ingress object. If resource is specified, a service.Name and service.Port must not be specified. This is a mutually exclusive setting with "Service". */
  resource?: TypedLocalObjectReference;
  /* Service references a Service as a Backend. This is a mutually exclusive setting with "Resource". */
  service?: IngressServiceBackend;
}
/* io.k8s.api.networking.v1.IngressClass */
/* IngressClass represents the class of the Ingress, referenced by the Ingress Spec. The `ingressclass.kubernetes.io/is-default-class` annotation can be used to indicate that an IngressClass should be considered default. When a single IngressClass resource has this annotation set to true, new Ingress resources without a class specified will be assigned this default class. */
export interface IngressClass {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec is the desired state of the IngressClass. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  spec?: IngressClassSpec;
}
/* io.k8s.api.networking.v1.IngressClassList */
/* IngressClassList is a collection of IngressClasses. */
export interface IngressClassList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of IngressClasses. */
  items: IngressClass[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.networking.v1.IngressClassParametersReference */
/* IngressClassParametersReference identifies an API object. This can be used to specify a cluster or namespace-scoped resource. */
export interface IngressClassParametersReference {
  /* APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required. */
  apiGroup?: string;
  /* Kind is the type of resource being referenced. */
  kind: string;
  /* Name is the name of resource being referenced. */
  name: string;
  /* Namespace is the namespace of the resource being referenced. This field is required when scope is set to "Namespace" and must be unset when scope is set to "Cluster". */
  namespace?: string;
  /* Scope represents if this refers to a cluster or namespace scoped resource. This may be set to "Cluster" (default) or "Namespace". Field can be enabled with IngressClassNamespacedParams feature gate. */
  scope?: string;
}
/* io.k8s.api.networking.v1.IngressClassSpec */
/* IngressClassSpec provides information about the class of an Ingress. */
export interface IngressClassSpec {
  /* Controller refers to the name of the controller that should handle this class. This allows for different "flavors" that are controlled by the same controller. For example, you may have different Parameters for the same implementing controller. This should be specified as a domain-prefixed path no more than 250 characters in length, e.g. "acme.io/ingress-controller". This field is immutable. */
  controller?: string;
  /* Parameters is a link to a custom resource containing additional configuration for the controller. This is optional if the controller does not require extra parameters. */
  parameters?: IngressClassParametersReference;
}
/* io.k8s.api.networking.v1.IngressList */
/* IngressList is a collection of Ingress. */
export interface IngressList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of Ingress. */
  items: Ingress[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.networking.v1.IngressRule */
/* IngressRule represents the rules mapping the paths under a specified host to the related backend services. Incoming requests are first evaluated for a host match, then routed to the backend associated with the matching IngressRuleValue. */
export interface IngressRule {
  /* Host is the fully qualified domain name of a network host, as defined by RFC 3986. Note the following deviations from the "host" part of the URI as defined in RFC 3986: 1. IPs are not allowed. Currently an IngressRuleValue can only apply to
     the IP in the Spec of the parent Ingress.
  2. The `:` delimiter is not respected because ports are not allowed.
  	  Currently the port of an Ingress is implicitly :80 for http and
  	  :443 for https.
  Both these may change in the future. Incoming requests are matched against the host before the IngressRuleValue. If the host is unspecified, the Ingress routes all traffic based on the specified IngressRuleValue.
  
  Host can be "precise" which is a domain name without the terminating dot of a network host (e.g. "foo.bar.com") or "wildcard", which is a domain name prefixed with a single wildcard label (e.g. "*.foo.com"). The wildcard character '*' must appear by itself as the first DNS label and matches only a single label. You cannot have a wildcard label by itself (e.g. Host == "*"). Requests will be matched against the Host field in the following way: 1. If Host is precise, the request matches this rule if the http host header is equal to Host. 2. If Host is a wildcard, then the request matches this rule if the http host header is to equal to the suffix (removing the first label) of the wildcard rule. */
  host?: string;
  http?: HTTPIngressRuleValue;
}
/* io.k8s.api.networking.v1.IngressServiceBackend */
/* IngressServiceBackend references a Kubernetes Service as a Backend. */
export interface IngressServiceBackend {
  /* Name is the referenced service. The service must exist in the same namespace as the Ingress object. */
  name: string;
  /* Port of the referenced service. A port name or port number is required for a IngressServiceBackend. */
  port?: ServiceBackendPort;
}
/* io.k8s.api.networking.v1.IngressSpec */
/* IngressSpec describes the Ingress the user wishes to exist. */
export interface IngressSpec {
  /* DefaultBackend is the backend that should handle requests that don't match any rule. If Rules are not specified, DefaultBackend must be specified. If DefaultBackend is not set, the handling of requests that do not match any of the rules will be up to the Ingress controller. */
  defaultBackend?: IngressBackend;
  /* IngressClassName is the name of the IngressClass cluster resource. The associated IngressClass defines which controller will implement the resource. This replaces the deprecated `kubernetes.io/ingress.class` annotation. For backwards compatibility, when that annotation is set, it must be given precedence over this field. The controller may emit a warning if the field and annotation have different values. Implementations of this API should ignore Ingresses without a class specified. An IngressClass resource may be marked as default, which can be used to set a default value for this field. For more information, refer to the IngressClass documentation. */
  ingressClassName?: string;
  /* A list of host rules used to configure the Ingress. If unspecified, or no rule matches, all traffic is sent to the default backend. */
  rules?: IngressRule[];
  /* TLS configuration. Currently the Ingress only supports a single TLS port, 443. If multiple members of this list specify different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension, if the ingress controller fulfilling the ingress supports SNI. */
  tls?: IngressTLS[];
}
/* io.k8s.api.networking.v1.IngressStatus */
/* IngressStatus describe the current state of the Ingress. */
export interface IngressStatus {
  /* LoadBalancer contains the current status of the load-balancer. */
  loadBalancer?: LoadBalancerStatus;
}
/* io.k8s.api.networking.v1.IngressTLS */
/* IngressTLS describes the transport layer security associated with an Ingress. */
export interface IngressTLS {
  /* Hosts are a list of hosts included in the TLS certificate. The values in this list must match the name/s used in the tlsSecret. Defaults to the wildcard host setting for the loadbalancer controller fulfilling this Ingress, if left unspecified. */
  hosts?: string[];
  /* SecretName is the name of the secret used to terminate TLS traffic on port 443. Field is left optional to allow TLS routing based on SNI hostname alone. If the SNI host in a listener conflicts with the "Host" header field used by an IngressRule, the SNI host is used for termination and value of the Host header is used for routing. */
  secretName?: string;
}
/* io.k8s.api.networking.v1.NetworkPolicy */
/* NetworkPolicy describes what network traffic is allowed for a set of Pods */
export interface NetworkPolicy {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior for this NetworkPolicy. */
  spec?: NetworkPolicySpec;
}
/* io.k8s.api.networking.v1.NetworkPolicyEgressRule */
/* NetworkPolicyEgressRule describes a particular set of traffic that is allowed out of pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and to. This type is beta-level in 1.8 */
export interface NetworkPolicyEgressRule {
  /* List of destination ports for outgoing traffic. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list. */
  ports?: NetworkPolicyPort[];
  /* List of destinations for outgoing traffic of pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all destinations (traffic not restricted by destination). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the to list. */
  to?: NetworkPolicyPeer[];
}
/* io.k8s.api.networking.v1.NetworkPolicyIngressRule */
/* NetworkPolicyIngressRule describes a particular set of traffic that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and from. */
export interface NetworkPolicyIngressRule {
  /* List of sources which should be able to access the pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all sources (traffic not restricted by source). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the from list. */
  from?: NetworkPolicyPeer[];
  /* List of ports which should be made accessible on the pods selected for this rule. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list. */
  ports?: NetworkPolicyPort[];
}
/* io.k8s.api.networking.v1.NetworkPolicyList */
/* NetworkPolicyList is a list of NetworkPolicy objects. */
export interface NetworkPolicyList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of schema objects. */
  items: NetworkPolicy[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.networking.v1.NetworkPolicyPeer */
/* NetworkPolicyPeer describes a peer to allow traffic to/from. Only certain combinations of fields are allowed */
export interface NetworkPolicyPeer {
  /* IPBlock defines policy on a particular IPBlock. If this field is set then neither of the other fields can be. */
  ipBlock?: IPBlock;
  /* Selects Namespaces using cluster-scoped labels. This field follows standard label selector semantics; if present but empty, it selects all namespaces.
  
  If PodSelector is also set, then the NetworkPolicyPeer as a whole selects the Pods matching PodSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects all Pods in the Namespaces selected by NamespaceSelector. */
  namespaceSelector?: LabelSelector;
  /* This is a label selector which selects Pods. This field follows standard label selector semantics; if present but empty, it selects all pods.
  
  If NamespaceSelector is also set, then the NetworkPolicyPeer as a whole selects the Pods matching PodSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects the Pods matching PodSelector in the policy's own Namespace. */
  podSelector?: LabelSelector;
}
/* io.k8s.api.networking.v1.NetworkPolicyPort */
/* NetworkPolicyPort describes a port to allow traffic on */
export interface NetworkPolicyPort {
  /* If set, indicates that the range of ports from port to endPort, inclusive, should be allowed by the policy. This field cannot be defined if the port field is not defined or if the port field is defined as a named (string) port. The endPort must be equal or greater than port. This feature is in Beta state and is enabled by default. It can be disabled using the Feature Gate "NetworkPolicyEndPort". */
  endPort?: number;
  /* The port on the given protocol. This can either be a numerical or named port on a pod. If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched. */
  port?: IntOrString;
  /* The protocol (TCP, UDP, or SCTP) which traffic must match. If not specified, this field defaults to TCP. */
  protocol?: string;
}
/* io.k8s.api.networking.v1.NetworkPolicySpec */
/* NetworkPolicySpec provides the specification of a NetworkPolicy */
export interface NetworkPolicySpec {
  /* List of egress rules to be applied to the selected pods. Outgoing traffic is allowed if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic matches at least one egress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy limits all outgoing traffic (and serves solely to ensure that the pods it selects are isolated by default). This field is beta-level in 1.8 */
  egress?: NetworkPolicyEgressRule[];
  /* List of ingress rules to be applied to the selected pods. Traffic is allowed to a pod if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic source is the pod's local node, OR if the traffic matches at least one ingress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy does not allow any traffic (and serves solely to ensure that the pods it selects are isolated by default) */
  ingress?: NetworkPolicyIngressRule[];
  /* Selects the pods to which this NetworkPolicy object applies. The array of ingress rules is applied to any pods selected by this field. Multiple network policies can select the same set of pods. In this case, the ingress rules for each are combined additively. This field is NOT optional and follows standard label selector semantics. An empty podSelector matches all pods in this namespace. */
  podSelector: LabelSelector;
  /* List of rule types that the NetworkPolicy relates to. Valid options are ["Ingress"], ["Egress"], or ["Ingress", "Egress"]. If this field is not specified, it will default based on the existence of Ingress or Egress rules; policies that contain an Egress section are assumed to affect Egress, and all policies (whether or not they contain an Ingress section) are assumed to affect Ingress. If you want to write an egress-only policy, you must explicitly specify policyTypes [ "Egress" ]. Likewise, if you want to write a policy that specifies that no egress is allowed, you must specify a policyTypes value that include "Egress" (since such a policy would not include an Egress section and would otherwise default to just [ "Ingress" ]). This field is beta-level in 1.8 */
  policyTypes?: string[];
}
/* io.k8s.api.networking.v1.ServiceBackendPort */
/* ServiceBackendPort is the service port being referenced. */
export interface ServiceBackendPort {
  /* Name is the name of the port on the Service. This is a mutually exclusive setting with "Number". */
  name?: string;
  /* Number is the numerical port number (e.g. 80) on the Service. This is a mutually exclusive setting with "Name". */
  number?: number;
}
/* io.k8s.api.node.v1.Overhead */
/* Overhead structure represents the resource overhead associated with running a pod. */
export interface Overhead {
  /* PodFixed represents the fixed resource overhead associated with running a pod. */
  podFixed?: {
    [key: string]: unknown;
  };
}
/* io.k8s.api.node.v1.RuntimeClass */
/* RuntimeClass defines a class of container runtime supported in the cluster. The RuntimeClass is used to determine which container runtime is used to run all containers in a pod. RuntimeClasses are manually defined by a user or cluster provisioner, and referenced in the PodSpec. The Kubelet is responsible for resolving the RuntimeClassName reference before running the pod.  For more details, see https://kubernetes.io/docs/concepts/containers/runtime-class/ */
export interface RuntimeClass {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Handler specifies the underlying runtime and configuration that the CRI implementation will use to handle pods of this class. The possible values are specific to the node & CRI configuration.  It is assumed that all handlers are available on every node, and handlers of the same name are equivalent on every node. For example, a handler called "runc" might specify that the runc OCI runtime (using native Linux containers) will be used to run the containers in a pod. The Handler must be lowercase, conform to the DNS Label (RFC 1123) requirements, and is immutable. */
  handler: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. For more details, see
   https://kubernetes.io/docs/concepts/scheduling-eviction/pod-overhead/
  This field is in beta starting v1.18 and is only honored by servers that enable the PodOverhead feature. */
  overhead?: Overhead;
  /* Scheduling holds the scheduling constraints to ensure that pods running with this RuntimeClass are scheduled to nodes that support it. If scheduling is nil, this RuntimeClass is assumed to be supported by all nodes. */
  scheduling?: Scheduling;
}
/* io.k8s.api.node.v1.RuntimeClassList */
/* RuntimeClassList is a list of RuntimeClass objects. */
export interface RuntimeClassList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of schema objects. */
  items: RuntimeClass[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.node.v1.Scheduling */
/* Scheduling specifies the scheduling constraints for nodes supporting a RuntimeClass. */
export interface Scheduling {
  /* nodeSelector lists labels that must be present on nodes that support this RuntimeClass. Pods using this RuntimeClass can only be scheduled to a node matched by this selector. The RuntimeClass nodeSelector is merged with a pod's existing nodeSelector. Any conflicts will cause the pod to be rejected in admission. */
  nodeSelector?: {
    [key: string]: unknown;
  };
  /* tolerations are appended (excluding duplicates) to pods running with this RuntimeClass during admission, effectively unioning the set of nodes tolerated by the pod and the RuntimeClass. */
  tolerations?: Toleration[];
}
/* io.k8s.api.policy.v1.Eviction */
/* Eviction evicts a pod from its node subject to certain policies and safety constraints. This is a subresource of Pod.  A request to cause such an eviction is created by POSTing to .../pods/<pod name>/evictions. */
export interface Eviction {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* DeleteOptions may be provided */
  deleteOptions?: DeleteOptions;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* ObjectMeta describes the pod that is being evicted. */
  metadata?: ObjectMeta;
}
/* io.k8s.api.policy.v1.PodDisruptionBudget */
/* PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods */
export interface PodDisruptionBudget {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired behavior of the PodDisruptionBudget. */
  spec?: PodDisruptionBudgetSpec;
  /* Most recently observed status of the PodDisruptionBudget. */
  status?: PodDisruptionBudgetStatus;
}
/* io.k8s.api.policy.v1.PodDisruptionBudgetList */
/* PodDisruptionBudgetList is a collection of PodDisruptionBudgets. */
export interface PodDisruptionBudgetList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of PodDisruptionBudgets */
  items: PodDisruptionBudget[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.policy.v1.PodDisruptionBudgetSpec */
/* PodDisruptionBudgetSpec is a description of a PodDisruptionBudget. */
export interface PodDisruptionBudgetSpec {
  /* An eviction is allowed if at most "maxUnavailable" pods selected by "selector" are unavailable after the eviction, i.e. even in absence of the evicted pod. For example, one can prevent all voluntary evictions by specifying 0. This is a mutually exclusive setting with "minAvailable". */
  maxUnavailable?: IntOrString;
  /* An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%". */
  minAvailable?: IntOrString;
  /* Label query over pods whose evictions are managed by the disruption budget. A null selector will match no pods, while an empty ({}) selector will select all pods within the namespace. */
  selector?: LabelSelector;
}
/* io.k8s.api.policy.v1.PodDisruptionBudgetStatus */
/* PodDisruptionBudgetStatus represents information about the status of a PodDisruptionBudget. Status may trail the actual state of a system. */
export interface PodDisruptionBudgetStatus {
  /* Conditions contain conditions for PDB. The disruption controller sets the DisruptionAllowed condition. The following are known values for the reason field (additional reasons could be added in the future): - SyncFailed: The controller encountered an error and wasn't able to compute
                the number of allowed disruptions. Therefore no disruptions are
                allowed and the status of the condition will be False.
  - InsufficientPods: The number of pods are either at or below the number
                      required by the PodDisruptionBudget. No disruptions are
                      allowed and the status of the condition will be False.
  - SufficientPods: There are more pods than required by the PodDisruptionBudget.
                    The condition will be True, and the number of allowed
                    disruptions are provided by the disruptionsAllowed property. */
  conditions?: Condition[];
  /* current number of healthy pods */
  currentHealthy: number;
  /* minimum desired number of healthy pods */
  desiredHealthy: number;
  /* DisruptedPods contains information about pods whose eviction was processed by the API server eviction subresource handler but has not yet been observed by the PodDisruptionBudget controller. A pod will be in this map from the time when the API server processed the eviction request to the time when the pod is seen by PDB controller as having been marked for deletion (or after a timeout). The key in the map is the name of the pod and the value is the time when the API server processed the eviction request. If the deletion didn't occur and a pod is still there it will be removed from the list automatically by PodDisruptionBudget controller after some time. If everything goes smooth this map should be empty for the most of the time. Large number of entries in the map may indicate problems with pod deletions. */
  disruptedPods?: {
    [key: string]: unknown;
  };
  /* Number of pod disruptions that are currently allowed. */
  disruptionsAllowed: number;
  /* total number of pods counted by this disruption budget */
  expectedPods: number;
  /* Most recent generation observed when updating this PDB status. DisruptionsAllowed and other status information is valid only if observedGeneration equals to PDB's object generation. */
  observedGeneration?: number;
}
/* io.k8s.api.rbac.v1.AggregationRule */
/* AggregationRule describes how to locate ClusterRoles to aggregate into the ClusterRole */
export interface AggregationRule {
  /* ClusterRoleSelectors holds a list of selectors which will be used to find ClusterRoles and create the rules. If any of the selectors match, then the ClusterRole's permissions will be added */
  clusterRoleSelectors?: LabelSelector[];
}
/* io.k8s.api.rbac.v1.ClusterRole */
/* ClusterRole is a cluster level, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding or ClusterRoleBinding. */
export interface ClusterRole {
  /* AggregationRule is an optional field that describes how to build the Rules for this ClusterRole. If AggregationRule is set, then the Rules are controller managed and direct changes to Rules will be stomped by the controller. */
  aggregationRule?: AggregationRule;
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ObjectMeta;
  /* Rules holds all the PolicyRules for this ClusterRole */
  rules?: PolicyRule[];
}
/* io.k8s.api.rbac.v1.ClusterRoleBinding */
/* ClusterRoleBinding references a ClusterRole, but not contain it.  It can reference a ClusterRole in the global namespace, and adds who information via Subject. */
export interface ClusterRoleBinding {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ObjectMeta;
  /* RoleRef can only reference a ClusterRole in the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error. */
  roleRef: RoleRef;
  /* Subjects holds references to the objects the role applies to. */
  subjects?: Subject[];
}
/* io.k8s.api.rbac.v1.ClusterRoleBindingList */
/* ClusterRoleBindingList is a collection of ClusterRoleBindings */
export interface ClusterRoleBindingList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of ClusterRoleBindings */
  items: ClusterRoleBinding[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.rbac.v1.ClusterRoleList */
/* ClusterRoleList is a collection of ClusterRoles */
export interface ClusterRoleList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of ClusterRoles */
  items: ClusterRole[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.rbac.v1.PolicyRule */
/* PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to. */
export interface PolicyRule {
  /* APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. */
  apiGroups?: string[];
  /* NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path Since non-resource URLs are not namespaced, this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both. */
  nonResourceURLs?: string[];
  /* ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed. */
  resourceNames?: string[];
  /* Resources is a list of resources this rule applies to. '*' represents all resources. */
  resources?: string[];
  /* Verbs is a list of Verbs that apply to ALL the ResourceKinds and AttributeRestrictions contained in this rule. '*' represents all verbs. */
  verbs: string[];
}
/* io.k8s.api.rbac.v1.Role */
/* Role is a namespaced, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding. */
export interface Role {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ObjectMeta;
  /* Rules holds all the PolicyRules for this Role */
  rules?: PolicyRule[];
}
/* io.k8s.api.rbac.v1.RoleBinding */
/* RoleBinding references a role, but does not contain it.  It can reference a Role in the same namespace or a ClusterRole in the global namespace. It adds who information via Subjects and namespace information by which namespace it exists in.  RoleBindings in a given namespace only have effect in that namespace. */
export interface RoleBinding {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ObjectMeta;
  /* RoleRef can reference a Role in the current namespace or a ClusterRole in the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error. */
  roleRef: RoleRef;
  /* Subjects holds references to the objects the role applies to. */
  subjects?: Subject[];
}
/* io.k8s.api.rbac.v1.RoleBindingList */
/* RoleBindingList is a collection of RoleBindings */
export interface RoleBindingList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of RoleBindings */
  items: RoleBinding[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.rbac.v1.RoleList */
/* RoleList is a collection of Roles */
export interface RoleList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is a list of Roles */
  items: Role[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. */
  metadata?: ListMeta;
}
/* io.k8s.api.rbac.v1.RoleRef */
/* RoleRef contains information that points to the role being used */
export interface RoleRef {
  /* APIGroup is the group for the resource being referenced */
  apiGroup: string;
  /* Kind is the type of resource being referenced */
  kind: string;
  /* Name is the name of resource being referenced */
  name: string;
}
/* io.k8s.api.rbac.v1.Subject */
/* Subject contains a reference to the object or user identities a role binding applies to.  This can either hold a direct API object reference, or a value for non-objects such as user and group names. */
export interface Subject {
  /* APIGroup holds the API group of the referenced subject. Defaults to "" for ServiceAccount subjects. Defaults to "rbac.authorization.k8s.io" for User and Group subjects. */
  apiGroup?: string;
  /* Kind of object being referenced. Values defined by this API group are "User", "Group", and "ServiceAccount". If the Authorizer does not recognized the kind value, the Authorizer should report an error. */
  kind: string;
  /* Name of the object being referenced. */
  name: string;
  /* Namespace of the referenced object.  If the object kind is non-namespace, such as "User" or "Group", and this value is not empty the Authorizer should report an error. */
  namespace?: string;
}
/* io.k8s.api.scheduling.v1.PriorityClass */
/* PriorityClass defines mapping from a priority class name to the priority integer value. The value can be any valid integer. */
export interface PriorityClass {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* description is an arbitrary string that usually provides guidelines on when this priority class should be used. */
  description?: string;
  /* globalDefault specifies whether this PriorityClass should be considered as the default priority for pods that do not have any priority class. Only one PriorityClass can be marked as `globalDefault`. However, if more than one PriorityClasses exists with their `globalDefault` field set to true, the smallest value of such global default PriorityClasses will be used as the default priority. */
  globalDefault?: boolean;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset. This field is beta-level, gated by the NonPreemptingPriority feature-gate. */
  preemptionPolicy?: string;
  /* The value of this priority class. This is the actual priority that pods receive when they have the name of this class in their pod spec. */
  value: number;
}
/* io.k8s.api.scheduling.v1.PriorityClassList */
/* PriorityClassList is a collection of priority classes. */
export interface PriorityClassList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is the list of PriorityClasses */
  items: PriorityClass[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.storage.v1.CSIDriver */
/* CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed on the cluster. Kubernetes attach detach controller uses this object to determine whether attach is required. Kubelet uses this object to determine whether pod information needs to be passed on mount. CSIDriver objects are non-namespaced. */
export interface CSIDriver {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object metadata. metadata.Name indicates the name of the CSI driver that this object refers to; it MUST be the same name returned by the CSI GetPluginName() call for that driver. The driver name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), dots (.), and alphanumerics between. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the CSI Driver. */
  spec: CSIDriverSpec;
}
/* io.k8s.api.storage.v1.CSIDriverList */
/* CSIDriverList is a collection of CSIDriver objects. */
export interface CSIDriverList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is the list of CSIDriver */
  items: CSIDriver[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.storage.v1.CSIDriverSpec */
/* CSIDriverSpec is the specification of a CSIDriver. */
export interface CSIDriverSpec {
  /* attachRequired indicates this CSI volume driver requires an attach operation (because it implements the CSI ControllerPublishVolume() method), and that the Kubernetes attach detach controller should call the attach volume interface which checks the volumeattachment status and waits until the volume is attached before proceeding to mounting. The CSI external-attacher coordinates with CSI volume driver and updates the volumeattachment status when the attach operation is complete. If the CSIDriverRegistry feature gate is enabled and the value is specified to false, the attach operation will be skipped. Otherwise the attach operation will be called.
  
  This field is immutable. */
  attachRequired?: boolean;
  /* Defines if the underlying volume supports changing ownership and permission of the volume before being mounted. Refer to the specific FSGroupPolicy values for additional details. This field is beta, and is only honored by servers that enable the CSIVolumeFSGroupPolicy feature gate.
  
  This field is immutable.
  
  Defaults to ReadWriteOnceWithFSType, which will examine each volume to determine if Kubernetes should modify ownership and permissions of the volume. With the default policy the defined fsGroup will only be applied if a fstype is defined and the volume's access mode contains ReadWriteOnce. */
  fsGroupPolicy?: string;
  /* If set to true, podInfoOnMount indicates this CSI volume driver requires additional pod information (like podName, podUID, etc.) during mount operations. If set to false, pod information will not be passed on mount. Default is false. The CSI driver specifies podInfoOnMount as part of driver deployment. If true, Kubelet will pass pod information as VolumeContext in the CSI NodePublishVolume() calls. The CSI driver is responsible for parsing and validating the information passed in as VolumeContext. The following VolumeConext will be passed if podInfoOnMount is set to true. This list might grow, but the prefix will be used. "csi.storage.k8s.io/pod.name": pod.Name "csi.storage.k8s.io/pod.namespace": pod.Namespace "csi.storage.k8s.io/pod.uid": string(pod.UID) "csi.storage.k8s.io/ephemeral": "true" if the volume is an ephemeral inline volume
                                  defined by a CSIVolumeSource, otherwise "false"
  
  "csi.storage.k8s.io/ephemeral" is a new feature in Kubernetes 1.16. It is only required for drivers which support both the "Persistent" and "Ephemeral" VolumeLifecycleMode. Other drivers can leave pod info disabled and/or ignore this field. As Kubernetes 1.15 doesn't support this field, drivers can only support one mode when deployed on such a cluster and the deployment determines which mode that is, for example via a command line parameter of the driver.
  
  This field is immutable. */
  podInfoOnMount?: boolean;
  /* RequiresRepublish indicates the CSI driver wants `NodePublishVolume` being periodically called to reflect any possible change in the mounted volume. This field defaults to false.
  
  Note: After a successful initial NodePublishVolume call, subsequent calls to NodePublishVolume should only update the contents of the volume. New mount points will not be seen by a running container. */
  requiresRepublish?: boolean;
  /* If set to true, storageCapacity indicates that the CSI volume driver wants pod scheduling to consider the storage capacity that the driver deployment will report by creating CSIStorageCapacity objects with capacity information.
  
  The check can be enabled immediately when deploying a driver. In that case, provisioning new volumes with late binding will pause until the driver deployment has published some suitable CSIStorageCapacity object.
  
  Alternatively, the driver can be deployed with the field unset or false and it can be flipped later when storage capacity information has been published.
  
  This field is immutable.
  
  This is a beta field and only available when the CSIStorageCapacity feature is enabled. The default is false. */
  storageCapacity?: boolean;
  /* TokenRequests indicates the CSI driver needs pods' service account tokens it is mounting volume for to do necessary authentication. Kubelet will pass the tokens in VolumeContext in the CSI NodePublishVolume calls. The CSI driver should parse and validate the following VolumeContext: "csi.storage.k8s.io/serviceAccount.tokens": {
    "<audience>": {
      "token": <token>,
      "expirationTimestamp": <expiration timestamp in RFC3339>,
    },
    ...
  }
  
  Note: Audience in each TokenRequest should be different and at most one token is empty string. To receive a new token after expiry, RequiresRepublish can be used to trigger NodePublishVolume periodically. */
  tokenRequests?: TokenRequest[];
  /* volumeLifecycleModes defines what kind of volumes this CSI volume driver supports. The default if the list is empty is "Persistent", which is the usage defined by the CSI specification and implemented in Kubernetes via the usual PV/PVC mechanism. The other mode is "Ephemeral". In this mode, volumes are defined inline inside the pod spec with CSIVolumeSource and their lifecycle is tied to the lifecycle of that pod. A driver has to be aware of this because it is only going to get a NodePublishVolume call for such a volume. For more information about implementing this mode, see https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html A driver can support one or more of these modes and more modes may be added in the future. This field is beta.
  
  This field is immutable. */
  volumeLifecycleModes?: string[];
}
/* io.k8s.api.storage.v1.CSINode */
/* CSINode holds information about all CSI drivers installed on a node. CSI drivers do not need to create the CSINode object directly. As long as they use the node-driver-registrar sidecar container, the kubelet will automatically populate the CSINode object for the CSI driver as part of kubelet plugin registration. CSINode has the same name as a node. If the object is missing, it means either there are no CSI Drivers available on the node, or the Kubelet version is low enough that it doesn't create this object. CSINode has an OwnerReference that points to the corresponding node object. */
export interface CSINode {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* metadata.name must be the Kubernetes node name. */
  metadata?: ObjectMeta;
  /* spec is the specification of CSINode */
  spec: CSINodeSpec;
}
/* io.k8s.api.storage.v1.CSINodeDriver */
/* CSINodeDriver holds information about the specification of one CSI driver installed on a node */
export interface CSINodeDriver {
  /* allocatable represents the volume resources of a node that are available for scheduling. This field is beta. */
  allocatable?: VolumeNodeResources;
  /* This is the name of the CSI driver that this object refers to. This MUST be the same name returned by the CSI GetPluginName() call for that driver. */
  name: string;
  /* nodeID of the node from the driver point of view. This field enables Kubernetes to communicate with storage systems that do not share the same nomenclature for nodes. For example, Kubernetes may refer to a given node as "node1", but the storage system may refer to the same node as "nodeA". When Kubernetes issues a command to the storage system to attach a volume to a specific node, it can use this field to refer to the node name using the ID that the storage system will understand, e.g. "nodeA" instead of "node1". This field is required. */
  nodeID: string;
  /* topologyKeys is the list of keys supported by the driver. When a driver is initialized on a cluster, it provides a set of topology keys that it understands (e.g. "company.com/zone", "company.com/region"). When a driver is initialized on a node, it provides the same topology keys along with values. Kubelet will expose these topology keys as labels on its own node object. When Kubernetes does topology aware provisioning, it can use this list to determine which labels it should retrieve from the node object and pass back to the driver. It is possible for different nodes to use different topology keys. This can be empty if driver does not support topology. */
  topologyKeys?: string[];
}
/* io.k8s.api.storage.v1.CSINodeList */
/* CSINodeList is a collection of CSINode objects. */
export interface CSINodeList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items is the list of CSINode */
  items: CSINode[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.storage.v1.CSINodeSpec */
/* CSINodeSpec holds information about the specification of all CSI drivers installed on a node */
export interface CSINodeSpec {
  /* drivers is a list of information of all CSI Drivers existing on a node. If all drivers in the list are uninstalled, this can become empty. */
  drivers: CSINodeDriver[];
}
/* io.k8s.api.storage.v1.StorageClass */
/* StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.

StorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name. */
export interface StorageClass {
  /* AllowVolumeExpansion shows whether the storage class allow volume expand */
  allowVolumeExpansion?: boolean;
  /* Restrict the node topologies where volumes can be dynamically provisioned. Each volume plugin defines its own supported topology specifications. An empty TopologySelectorTerm list means there is no topology restriction. This field is only honored by servers that enable the VolumeScheduling feature. */
  allowedTopologies?: TopologySelectorTerm[];
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Dynamically provisioned PersistentVolumes of this storage class are created with these mountOptions, e.g. ["ro", "soft"]. Not validated - mount of the PVs will simply fail if one is invalid. */
  mountOptions?: string[];
  /* Parameters holds the parameters for the provisioner that should create volumes of this storage class. */
  parameters?: {
    [key: string]: unknown;
  };
  /* Provisioner indicates the type of the provisioner. */
  provisioner: string;
  /* Dynamically provisioned PersistentVolumes of this storage class are created with this reclaimPolicy. Defaults to Delete. */
  reclaimPolicy?: string;
  /* VolumeBindingMode indicates how PersistentVolumeClaims should be provisioned and bound.  When unset, VolumeBindingImmediate is used. This field is only honored by servers that enable the VolumeScheduling feature. */
  volumeBindingMode?: string;
}
/* io.k8s.api.storage.v1.StorageClassList */
/* StorageClassList is a collection of storage classes. */
export interface StorageClassList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of StorageClasses */
  items: StorageClass[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.storage.v1.TokenRequest */
/* TokenRequest contains parameters of a service account token. */
export interface TokenRequest {
  /* Audience is the intended audience of the token in "TokenRequestSpec". It will default to the audiences of kube apiserver. */
  audience: string;
  /* ExpirationSeconds is the duration of validity of the token in "TokenRequestSpec". It has the same default value of "ExpirationSeconds" in "TokenRequestSpec". */
  expirationSeconds?: number;
}
/* io.k8s.api.storage.v1.VolumeAttachment */
/* VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node.

VolumeAttachment objects are non-namespaced. */
export interface VolumeAttachment {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Specification of the desired attach/detach volume behavior. Populated by the Kubernetes system. */
  spec: VolumeAttachmentSpec;
  /* Status of the VolumeAttachment request. Populated by the entity completing the attach or detach operation, i.e. the external-attacher. */
  status?: VolumeAttachmentStatus;
}
/* io.k8s.api.storage.v1.VolumeAttachmentList */
/* VolumeAttachmentList is a collection of VolumeAttachment objects. */
export interface VolumeAttachmentList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of VolumeAttachments */
  items: VolumeAttachment[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.api.storage.v1.VolumeAttachmentSource */
/* VolumeAttachmentSource represents a volume that should be attached. Right now only PersistenVolumes can be attached via external attacher, in future we may allow also inline volumes in pods. Exactly one member can be set. */
export interface VolumeAttachmentSource {
  /* inlineVolumeSpec contains all the information necessary to attach a persistent volume defined by a pod's inline VolumeSource. This field is populated only for the CSIMigration feature. It contains translated fields from a pod's inline VolumeSource to a PersistentVolumeSpec. This field is beta-level and is only honored by servers that enabled the CSIMigration feature. */
  inlineVolumeSpec?: PersistentVolumeSpec;
  /* Name of the persistent volume to attach. */
  persistentVolumeName?: string;
}
/* io.k8s.api.storage.v1.VolumeAttachmentSpec */
/* VolumeAttachmentSpec is the specification of a VolumeAttachment request. */
export interface VolumeAttachmentSpec {
  /* Attacher indicates the name of the volume driver that MUST handle this request. This is the name returned by GetPluginName(). */
  attacher: string;
  /* The node that the volume should be attached to. */
  nodeName: string;
  /* Source represents the volume that should be attached. */
  source: VolumeAttachmentSource;
}
/* io.k8s.api.storage.v1.VolumeAttachmentStatus */
/* VolumeAttachmentStatus is the status of a VolumeAttachment request. */
export interface VolumeAttachmentStatus {
  /* The last error encountered during attach operation, if any. This field must only be set by the entity completing the attach operation, i.e. the external-attacher. */
  attachError?: VolumeError;
  /* Indicates the volume is successfully attached. This field must only be set by the entity completing the attach operation, i.e. the external-attacher. */
  attached: boolean;
  /* Upon successful attach, this field is populated with any information returned by the attach operation that must be passed into subsequent WaitForAttach or Mount calls. This field must only be set by the entity completing the attach operation, i.e. the external-attacher. */
  attachmentMetadata?: {
    [key: string]: unknown;
  };
  /* The last error encountered during detach operation, if any. This field must only be set by the entity completing the detach operation, i.e. the external-attacher. */
  detachError?: VolumeError;
}
/* io.k8s.api.storage.v1.VolumeError */
/* VolumeError captures an error encountered during a volume operation. */
export interface VolumeError {
  /* String detailing the error encountered during Attach or Detach operation. This string may be logged, so it should not contain sensitive information. */
  message?: string;
  /* Time the error was encountered. */
  time?: Time;
}
/* io.k8s.api.storage.v1.VolumeNodeResources */
/* VolumeNodeResources is a set of resource limits for scheduling of volumes. */
export interface VolumeNodeResources {
  /* Maximum number of unique volumes managed by the CSI driver that can be used on a node. A volume that is both attached and mounted on a node is considered to be used once, not twice. The same rule applies for a unique volume that is shared among multiple pods on the same node. If this field is not specified, then the supported number of volumes on this node is unbounded. */
  count?: number;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceColumnDefinition */
/* CustomResourceColumnDefinition specifies a column for server side printing. */
export interface CustomResourceColumnDefinition {
  /* description is a human readable description of this column. */
  description?: string;
  /* format is an optional OpenAPI type definition for this column. The 'name' format is applied to the primary identifier column to assist in clients identifying column is the resource name. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details. */
  format?: string;
  /* jsonPath is a simple JSON path (i.e. with array notation) which is evaluated against each custom resource to produce the value for this column. */
  jsonPath: string;
  /* name is a human readable name for the column. */
  name: string;
  /* priority is an integer defining the relative importance of this column compared to others. Lower numbers are considered higher priority. Columns that may be omitted in limited space scenarios should be given a priority greater than 0. */
  priority?: number;
  /* type is an OpenAPI type definition for this column. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details. */
  type: string;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceConversion */
/* CustomResourceConversion describes how to convert different versions of a CR. */
export interface CustomResourceConversion {
  /* strategy specifies how custom resources are converted between versions. Allowed values are: - `None`: The converter only change the apiVersion and would not touch any other field in the custom resource. - `Webhook`: API Server will call to an external webhook to do the conversion. Additional information
    is needed for this option. This requires spec.preserveUnknownFields to be false, and spec.conversion.webhook to be set. */
  strategy: string;
  /* webhook describes how to call the conversion webhook. Required when `strategy` is set to `Webhook`. */
  webhook?: WebhookConversion;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinition */
/* CustomResourceDefinition represents a resource that should be exposed on the API server.  Its name MUST be in the format <.spec.name>.<.spec.group>. */
export interface CustomResourceDefinition {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* spec describes how the user wants the resources to appear */
  spec: CustomResourceDefinitionSpec;
  /* status indicates the actual state of the CustomResourceDefinition */
  status?: CustomResourceDefinitionStatus;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionCondition */
/* CustomResourceDefinitionCondition contains details for the current condition of this pod. */
export interface CustomResourceDefinitionCondition {
  /* lastTransitionTime last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* message is a human-readable message indicating details about last transition. */
  message?: string;
  /* reason is a unique, one-word, CamelCase reason for the condition's last transition. */
  reason?: string;
  /* status is the status of the condition. Can be True, False, Unknown. */
  status: string;
  /* type is the type of the condition. Types include Established, NamesAccepted and Terminating. */
  type: string;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionList */
/* CustomResourceDefinitionList is a list of CustomResourceDefinition objects. */
export interface CustomResourceDefinitionList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* items list individual CustomResourceDefinition objects */
  items: CustomResourceDefinition[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionNames */
/* CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition */
export interface CustomResourceDefinitionNames {
  /* categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`. */
  categories?: string[];
  /* kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls. */
  kind: string;
  /* listKind is the serialized kind of the list for this resource. Defaults to "`kind`List". */
  listKind?: string;
  /* plural is the plural name of the resource to serve. The custom resources are served under `/apis/<group>/<version>/.../<plural>`. Must match the name of the CustomResourceDefinition (in the form `<names.plural>.<group>`). Must be all lowercase. */
  plural: string;
  /* shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get <shortname>`. It must be all lowercase. */
  shortNames?: string[];
  /* singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`. */
  singular?: string;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec */
/* CustomResourceDefinitionSpec describes how a user wants their resource to appear */
export interface CustomResourceDefinitionSpec {
  /* conversion defines conversion settings for the CRD. */
  conversion?: CustomResourceConversion;
  /* group is the API group of the defined custom resource. The custom resources are served under `/apis/<group>/...`. Must match the name of the CustomResourceDefinition (in the form `<names.plural>.<group>`). */
  group: string;
  /* names specify the resource and kind names for the custom resource. */
  names: CustomResourceDefinitionNames;
  /* preserveUnknownFields indicates that object fields which are not specified in the OpenAPI schema should be preserved when persisting to storage. apiVersion, kind, metadata and known fields inside metadata are always preserved. This field is deprecated in favor of setting `x-preserve-unknown-fields` to true in `spec.versions[*].schema.openAPIV3Schema`. See https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#pruning-versus-preserving-unknown-fields for details. */
  preserveUnknownFields?: boolean;
  /* scope indicates whether the defined custom resource is cluster- or namespace-scoped. Allowed values are `Cluster` and `Namespaced`. */
  scope: string;
  /* versions is the list of all API versions of the defined custom resource. Version names are used to compute the order in which served versions are listed in API discovery. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10. */
  versions: CustomResourceDefinitionVersion[];
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionStatus */
/* CustomResourceDefinitionStatus indicates the state of the CustomResourceDefinition */
export interface CustomResourceDefinitionStatus {
  /* acceptedNames are the names that are actually being used to serve discovery. They may be different than the names in spec. */
  acceptedNames?: CustomResourceDefinitionNames;
  /* conditions indicate state for particular aspects of a CustomResourceDefinition */
  conditions?: CustomResourceDefinitionCondition[];
  /* storedVersions lists all versions of CustomResources that were ever persisted. Tracking these versions allows a migration path for stored versions in etcd. The field is mutable so a migration controller can finish a migration to another version (ensuring no old objects are left in storage), and then remove the rest of the versions from this list. Versions may not be removed from `spec.versions` while they exist in this list. */
  storedVersions?: string[];
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionVersion */
/* CustomResourceDefinitionVersion describes a version for CRD. */
export interface CustomResourceDefinitionVersion {
  /* additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If no columns are specified, a single column displaying the age of the custom resource is used. */
  additionalPrinterColumns?: CustomResourceColumnDefinition[];
  /* deprecated indicates this version of the custom resource API is deprecated. When set to true, API requests to this version receive a warning header in the server response. Defaults to false. */
  deprecated?: boolean;
  /* deprecationWarning overrides the default warning returned to API clients. May only be set when `deprecated` is true. The default warning indicates this version is deprecated and recommends use of the newest served version of equal or greater stability, if one exists. */
  deprecationWarning?: string;
  /* name is the version name, e.g. “v1”, “v2beta1”, etc. The custom resources are served under this version at `/apis/<group>/<version>/...` if `served` is true. */
  name: string;
  /* schema describes the schema used for validation, pruning, and defaulting of this version of the custom resource. */
  schema?: CustomResourceValidation;
  /* served is a flag enabling/disabling this version from being served via REST APIs */
  served: boolean;
  /* storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true. */
  storage: boolean;
  /* subresources specify what subresources this version of the defined custom resource have. */
  subresources?: CustomResourceSubresources;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceScale */
/* CustomResourceSubresourceScale defines how to serve the scale subresource for CustomResources. */
export interface CustomResourceSubresourceScale {
  /* labelSelectorPath defines the JSON path inside of a custom resource that corresponds to Scale `status.selector`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status` or `.spec`. Must be set to work with HorizontalPodAutoscaler. The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form. More info: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource If there is no value under the given path in the custom resource, the `status.selector` value in the `/scale` subresource will default to the empty string. */
  labelSelectorPath?: string;
  /* specReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `spec.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.spec`. If there is no value under the given path in the custom resource, the `/scale` subresource will return an error on GET. */
  specReplicasPath: string;
  /* statusReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `status.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status`. If there is no value under the given path in the custom resource, the `status.replicas` value in the `/scale` subresource will default to 0. */
  statusReplicasPath: string;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceStatus */
/* CustomResourceSubresourceStatus defines how to serve the status subresource for CustomResources. Status is represented by the `.status` JSON path inside of a CustomResource. When set, * exposes a /status subresource for the custom resource * PUT requests to the /status subresource take a custom resource object, and ignore changes to anything except the status stanza * PUT/POST/PATCH requests to the custom resource ignore changes to the status stanza */
export type CustomResourceSubresourceStatus = {
  [key: string]: unknown;
};
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresources */
/* CustomResourceSubresources defines the status and scale subresources for CustomResources. */
export interface CustomResourceSubresources {
  /* scale indicates the custom resource should serve a `/scale` subresource that returns an `autoscaling/v1` Scale object. */
  scale?: CustomResourceSubresourceScale;
  /* status indicates the custom resource should serve a `/status` subresource. When enabled: 1. requests to the custom resource primary endpoint ignore changes to the `status` stanza of the object. 2. requests to the custom resource `/status` subresource ignore changes to anything other than the `status` stanza of the object. */
  status?: CustomResourceSubresourceStatus;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceValidation */
/* CustomResourceValidation is a list of validation methods for CustomResources. */
export interface CustomResourceValidation {
  /* openAPIV3Schema is the OpenAPI v3 schema to use for validation and pruning. */
  openAPIV3Schema?: JSONSchemaProps;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ExternalDocumentation */
/* ExternalDocumentation allows referencing an external resource for extended documentation. */
export interface ExternalDocumentation {
  description?: string;
  url?: string;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON */
/* JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil. */
export type JSON = any;
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps */
/* JSONSchemaProps is a JSON-Schema following Specification Draft 4 (http://json-schema.org/). */
export interface JSONSchemaProps {
  $ref?: string;
  $schema?: string;
  additionalItems?: JSONSchemaPropsOrBool;
  additionalProperties?: JSONSchemaPropsOrBool;
  allOf?: JSONSchemaProps[];
  anyOf?: JSONSchemaProps[];
  /* default is a default value for undefined object fields. Defaulting is a beta feature under the CustomResourceDefaulting feature gate. Defaulting requires spec.preserveUnknownFields to be false. */
  default?: JSON;
  definitions?: {
    [key: string]: unknown;
  };
  dependencies?: {
    [key: string]: unknown;
  };
  description?: string;
  enum?: JSON[];
  example?: JSON;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  externalDocs?: ExternalDocumentation;
  /* format is an OpenAPI v3 format string. Unknown formats are ignored. The following formats are validated:
  
  - bsonobjectid: a bson object ID, i.e. a 24 characters hex string - uri: an URI as parsed by Golang net/url.ParseRequestURI - email: an email address as parsed by Golang net/mail.ParseAddress - hostname: a valid representation for an Internet host name, as defined by RFC 1034, section 3.1 [RFC1034]. - ipv4: an IPv4 IP as parsed by Golang net.ParseIP - ipv6: an IPv6 IP as parsed by Golang net.ParseIP - cidr: a CIDR as parsed by Golang net.ParseCIDR - mac: a MAC address as parsed by Golang net.ParseMAC - uuid: an UUID that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid3: an UUID3 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid4: an UUID4 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - uuid5: an UUID5 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - isbn: an ISBN10 or ISBN13 number string like "0321751043" or "978-0321751041" - isbn10: an ISBN10 number string like "0321751043" - isbn13: an ISBN13 number string like "978-0321751041" - creditcard: a credit card number defined by the regex ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$ with any non digit characters mixed in - ssn: a U.S. social security number following the regex ^\d{3}[- ]?\d{2}[- ]?\d{4}$ - hexcolor: an hexadecimal color code like "#FFFFFF: following the regex ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$ - rgbcolor: an RGB color code like rgb like "rgb(255,255,2559" - byte: base64 encoded binary data - password: any kind of string - date: a date string like "2006-01-02" as defined by full-date in RFC3339 - duration: a duration string like "22 ns" as parsed by Golang time.ParseDuration or compatible with Scala duration format - datetime: a date time string like "2014-12-15T19:30:20.000Z" as defined by date-time in RFC3339. */
  format?: string;
  id?: string;
  items?: JSONSchemaPropsOrArray;
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  minimum?: number;
  multipleOf?: number;
  not?: JSONSchemaProps;
  nullable?: boolean;
  oneOf?: JSONSchemaProps[];
  pattern?: string;
  patternProperties?: {
    [key: string]: unknown;
  };
  properties?: {
    [key: string]: unknown;
  };
  required?: string[];
  title?: string;
  type?: string;
  uniqueItems?: boolean;
  /* x-kubernetes-embedded-resource defines that the value is an embedded Kubernetes runtime.Object, with TypeMeta and ObjectMeta. The type must be object. It is allowed to further restrict the embedded object. kind, apiVersion and metadata are validated automatically. x-kubernetes-preserve-unknown-fields is allowed to be true, but does not have to be if the object is fully specified (up to kind, apiVersion, metadata). */
  "x-kubernetes-embedded-resource"?: boolean;
  /* x-kubernetes-int-or-string specifies that this value is either an integer or a string. If this is true, an empty type is allowed and type as child of anyOf is permitted if following one of the following patterns:
  
  1) anyOf:
     - type: integer
     - type: string
  2) allOf:
     - anyOf:
       - type: integer
       - type: string
     - ... zero or more */
  "x-kubernetes-int-or-string"?: boolean;
  /* x-kubernetes-list-map-keys annotates an array with the x-kubernetes-list-type `map` by specifying the keys used as the index of the map.
  
  This tag MUST only be used on lists that have the "x-kubernetes-list-type" extension set to "map". Also, the values specified for this attribute must be a scalar typed field of the child structure (no nesting is supported).
  
  The properties specified must either be required or have a default value, to ensure those properties are present for all list items. */
  "x-kubernetes-list-map-keys"?: string[];
  /* x-kubernetes-list-type annotates an array to further describe its topology. This extension must only be used on lists and may have 3 possible values:
  
  1) `atomic`: the list is treated as a single entity, like a scalar.
       Atomic lists will be entirely replaced when updated. This extension
       may be used on any type of list (struct, scalar, ...).
  2) `set`:
       Sets are lists that must not have multiple items with the same value. Each
       value must be a scalar, an object with x-kubernetes-map-type `atomic` or an
       array with x-kubernetes-list-type `atomic`.
  3) `map`:
       These lists are like maps in that their elements have a non-index key
       used to identify them. Order is preserved upon merge. The map tag
       must only be used on a list with elements of type object.
  Defaults to atomic for arrays. */
  "x-kubernetes-list-type"?: string;
  /* x-kubernetes-map-type annotates an object to further describe its topology. This extension must only be used when type is object and may have 2 possible values:
  
  1) `granular`:
       These maps are actual maps (key-value pairs) and each fields are independent
       from each other (they can each be manipulated by separate actors). This is
       the default behaviour for all maps.
  2) `atomic`: the list is treated as a single entity, like a scalar.
       Atomic maps will be entirely replaced when updated. */
  "x-kubernetes-map-type"?: string;
  /* x-kubernetes-preserve-unknown-fields stops the API server decoding step from pruning fields which are not specified in the validation schema. This affects fields recursively, but switches back to normal pruning behaviour if nested properties or additionalProperties are specified in the schema. This can either be true or undefined. False is forbidden. */
  "x-kubernetes-preserve-unknown-fields"?: boolean;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrArray */
/* JSONSchemaPropsOrArray represents a value that can either be a JSONSchemaProps or an array of JSONSchemaProps. Mainly here for serialization purposes. */
export type JSONSchemaPropsOrArray = any;
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrBool */
/* JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property. */
export type JSONSchemaPropsOrBool = any;
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrStringArray */
/* JSONSchemaPropsOrStringArray represents a JSONSchemaProps or a string array. */
export type JSONSchemaPropsOrStringArray = any;
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ServiceReference */
/* ServiceReference holds a reference to Service.legacy.k8s.io */
export interface ApiExtServiceReference {
  /* name is the name of the service. Required */
  name: string;
  /* namespace is the namespace of the service. Required */
  namespace: string;
  /* path is an optional URL path at which the webhook will be contacted. */
  path?: string;
  /* port is an optional service port at which the webhook will be contacted. `port` should be a valid port number (1-65535, inclusive). Defaults to 443 for backward compatibility. */
  port?: number;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookClientConfig */
/* WebhookClientConfig contains the information to make a TLS connection with the webhook. */
export interface ApiExtWebhookClientConfig {
  /* caBundle is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used. */
  caBundle?: string;
  /* service is a reference to the service for this webhook. Either service or url must be specified.
  
  If the webhook is running within the cluster, then you should use `service`. */
  service?: ApiExtServiceReference;
  /* url gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.
  
  The `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.
  
  Please note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.
  
  The scheme must be "https"; the URL must begin with "https://".
  
  A path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.
  
  Attempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either. */
  url?: string;
}
/* io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookConversion */
/* WebhookConversion describes how to call a conversion webhook */
export interface WebhookConversion {
  /* clientConfig is the instructions for how to call the webhook if strategy is `Webhook`. */
  clientConfig?: ApiExtWebhookClientConfig;
  /* conversionReviewVersions is an ordered list of preferred `ConversionReview` versions the Webhook expects. The API server will use the first version in the list which it supports. If none of the versions specified in this list are supported by API server, conversion will fail for the custom resource. If a persisted Webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail. */
  conversionReviewVersions: string[];
}
/* io.k8s.apimachinery.pkg.api.resource.Quantity */
/* Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.

The serialization format is:

<quantity>        ::= <signedNumber><suffix>
  (Note that <suffix> may be empty, from the "" case in <decimalSI>.)
<digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
  (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
<decimalSI>       ::= m | "" | k | M | G | T | P | E
  (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
<decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber>

No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.

When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.

Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
  a. No precision is lost
  b. No fractional digits will be emitted
  c. The exponent (or suffix) is as large as possible.
The sign will be omitted unless the number is negative.

Examples:
  1.5 will be serialized as "1500m"
  1.5Gi will be serialized as "1536Mi"

Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.

Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)

This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation. */
export type Quantity = string;
/* io.k8s.apimachinery.pkg.apis.meta.v1.APIGroup */
/* APIGroup contains the name, the supported versions, and the preferred version of a group. */
export interface APIGroup {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* name is the name of the group. */
  name: string;
  /* preferredVersion is the version preferred by the API server, which probably is the storage version. */
  preferredVersion?: GroupVersionForDiscovery;
  /* a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP. */
  serverAddressByClientCIDRs?: ServerAddressByClientCIDR[];
  /* versions are the versions supported in this group. */
  versions: GroupVersionForDiscovery[];
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.APIGroupList */
/* APIGroupList is a list of APIGroup, to allow clients to discover the API at /apis. */
export interface APIGroupList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* groups is a list of APIGroup. */
  groups: APIGroup[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.APIResource */
/* APIResource specifies the name of a resource and whether it is namespaced. */
export interface APIResource {
  /* categories is a list of the grouped resources this resource belongs to (e.g. 'all') */
  categories?: string[];
  /* group is the preferred group of the resource.  Empty implies the group of the containing resource list. For subresources, this may have a different value, for example: Scale". */
  group?: string;
  /* kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo') */
  kind: string;
  /* name is the plural name of the resource. */
  name: string;
  /* namespaced indicates if a resource is namespaced or not. */
  namespaced: boolean;
  /* shortNames is a list of suggested short names of the resource. */
  shortNames?: string[];
  /* singularName is the singular name of the resource.  This allows clients to handle plural and singular opaquely. The singularName is more correct for reporting status on a single item and both singular and plural are allowed from the kubectl CLI interface. */
  singularName: string;
  /* The hash value of the storage version, the version this resource is converted to when written to the data store. Value must be treated as opaque by clients. Only equality comparison on the value is valid. This is an alpha feature and may change or be removed in the future. The field is populated by the apiserver only if the StorageVersionHash feature gate is enabled. This field will remain optional even if it graduates. */
  storageVersionHash?: string;
  /* verbs is a list of supported kube verbs (this includes get, list, watch, create, update, patch, delete, deletecollection, and proxy) */
  verbs: string[];
  /* version is the preferred version of the resource.  Empty implies the version of the containing resource list For subresources, this may have a different value, for example: v1 (while inside a v1beta1 version of the core resource's group)". */
  version?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.APIResourceList */
/* APIResourceList is a list of APIResource, it is used to expose the name of the resources supported in a specific group and version, and if the resource is namespaced. */
export interface APIResourceList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* groupVersion is the group and version this APIResourceList is for. */
  groupVersion: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* resources contains the name of the resources and if they are namespaced. */
  resources: APIResource[];
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.APIVersions */
/* APIVersions lists the versions that are available, to allow clients to discover the API at /api, which is the root path of the legacy v1 API. */
export interface APIVersions {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP. */
  serverAddressByClientCIDRs: ServerAddressByClientCIDR[];
  /* versions are the api versions that are available. */
  versions: string[];
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.Condition */
/* Condition contains details for one aspect of the current state of this API Resource. */
export interface Condition {
  /* lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable. */
  lastTransitionTime: Time;
  /* message is a human readable message indicating details about the transition. This may be an empty string. */
  message: string;
  /* observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance. */
  observedGeneration?: number;
  /* reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. */
  reason: string;
  /* status of the condition, one of True, False, Unknown. */
  status: string;
  /* type of condition in CamelCase or in foo.example.com/CamelCase. */
  type: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.DeleteOptions */
/* DeleteOptions may be provided when deleting an API object. */
export interface DeleteOptions {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed */
  dryRun?: string[];
  /* The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately. */
  gracePeriodSeconds?: number;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both. */
  orphanDependents?: boolean;
  /* Must be fulfilled before a deletion is carried out. If not possible, a 409 Conflict status will be returned. */
  preconditions?: Preconditions;
  /* Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground. */
  propagationPolicy?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.FieldsV1 */
/* FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.

Each key is either a '.' representing the field itself, and will always map to an empty set, or a string representing a sub-field or item. The string will follow one of these four formats: 'f:<name>', where <name> is the name of a field in a struct, or key in a map 'v:<value>', where <value> is the exact json formatted value of a list item 'i:<index>', where <index> is position of a item in a list 'k:<keys>', where <keys> is a map of  a list item's key fields to their unique values If a key maps to an empty Fields value, the field that key represents is part of the set.

The exact format is defined in sigs.k8s.io/structured-merge-diff */
export type FieldsV1 = {
  [key: string]: unknown;
};
/* io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery */
/* GroupVersion contains the "group/version" and "version" string of a version. It is made a struct to keep extensibility. */
export interface GroupVersionForDiscovery {
  /* groupVersion specifies the API group and version in the form "group/version" */
  groupVersion: string;
  /* version specifies the version in the form of "version". This is to save the clients the trouble of splitting the GroupVersion. */
  version: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector */
/* A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects. */
export interface LabelSelector {
  /* matchExpressions is a list of label selector requirements. The requirements are ANDed. */
  matchExpressions?: LabelSelectorRequirement[];
  /* matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed. */
  matchLabels?: {
    [key: string]: unknown;
  };
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement */
/* A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values. */
export interface LabelSelectorRequirement {
  /* key is the label key that the selector applies to. */
  key: string;
  /* operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist. */
  operator: string;
  /* values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch. */
  values?: string[];
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta */
/* ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}. */
export interface ListMeta {
  /* continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message. */
  continue?: string;
  /* remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact. */
  remainingItemCount?: number;
  /* String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency */
  resourceVersion?: string;
  /* selfLink is a URL representing this object. Populated by the system. Read-only.
  
  DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release. */
  selfLink?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.ManagedFieldsEntry */
/* ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to. */
export interface ManagedFieldsEntry {
  /* APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted. */
  apiVersion?: string;
  /* FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1" */
  fieldsType?: string;
  /* FieldsV1 holds the first JSON version format as described in the "FieldsV1" type. */
  fieldsV1?: FieldsV1;
  /* Manager is an identifier of the workflow managing these fields. */
  manager?: string;
  /* Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'. */
  operation?: string;
  /* Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource. */
  subresource?: string;
  /* Time is timestamp of when these fields were set. It should always be empty if Operation is 'Apply' */
  time?: Time;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime */
/* MicroTime is version of Time with microsecond level precision. */
export type MicroTime = string;
/* io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta */
/* ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create. */
export interface ObjectMeta {
  /* Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: http://kubernetes.io/docs/user-guide/annotations */
  annotations?: {
    [key: string]: unknown;
  };
  /* The name of the cluster which the object belongs to. This is used to distinguish resources with same name and namespace in different clusters. This field is not set anywhere right now and apiserver is going to ignore it if set in create or update request. */
  clusterName?: string;
  /* CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
  
  Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  creationTimestamp?: Time;
  /* Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only. */
  deletionGracePeriodSeconds?: number;
  /* DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.
  
  Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  deletionTimestamp?: Time;
  /* Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list. */
  finalizers?: string[];
  /* GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.
  
  If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header).
  
  Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency */
  generateName?: string;
  /* A sequence number representing a specific generation of the desired state. Populated by the system. Read-only. */
  generation?: number;
  /* Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: http://kubernetes.io/docs/user-guide/labels */
  labels?: {
    [key: string]: unknown;
  };
  /* ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like "ci-cd". The set of fields is always in the version that the workflow used when modifying the object. */
  managedFields?: ManagedFieldsEntry[];
  /* Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/identifiers#names */
  name?: string;
  /* Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.
  
  Must be a DNS_LABEL. Cannot be updated. More info: http://kubernetes.io/docs/user-guide/namespaces */
  namespace?: string;
  /* List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller. */
  ownerReferences?: OwnerReference[];
  /* An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.
  
  Populated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency */
  resourceVersion?: string;
  /* SelfLink is a URL representing this object. Populated by the system. Read-only.
  
  DEPRECATED Kubernetes will stop propagating this field in 1.20 release and the field is planned to be removed in 1.21 release. */
  selfLink?: string;
  /* UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.
  
  Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/identifiers#uids */
  uid?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference */
/* OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field. */
export interface OwnerReference {
  /* API version of the referent. */
  apiVersion: string;
  /* If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned. */
  blockOwnerDeletion?: boolean;
  /* If true, this reference points to the managing controller. */
  controller?: boolean;
  /* Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind: string;
  /* Name of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#names */
  name: string;
  /* UID of the referent. More info: http://kubernetes.io/docs/user-guide/identifiers#uids */
  uid: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.Patch */
/* Patch is provided to give a concrete name and type to the Kubernetes PATCH request body. */
export type Patch = {
  [key: string]: unknown;
};
/* io.k8s.apimachinery.pkg.apis.meta.v1.Preconditions */
/* Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out. */
export interface Preconditions {
  /* Specifies the target ResourceVersion */
  resourceVersion?: string;
  /* Specifies the target UID. */
  uid?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR */
/* ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match. */
export interface ServerAddressByClientCIDR {
  /* The CIDR with which clients can match their IP to figure out the server address that they should use. */
  clientCIDR: string;
  /* Address of this server, suitable for a client that matches the above CIDR. This can be a hostname, hostname:port, IP or IP:port. */
  serverAddress: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.Status */
/* Status is a return value for calls that don't return other objects. */
export interface Status {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Suggested HTTP return code for this status, 0 if not set. */
  code?: number;
  /* Extended data associated with the reason.  Each reason may define its own extended details. This field is optional and the data returned is not guaranteed to conform to any schema except that defined by the reason type. */
  details?: StatusDetails;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* A human-readable description of the status of this operation. */
  message?: string;
  /* Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  metadata?: ListMeta;
  /* A machine-readable description of why this operation is in the "Failure" status. If this value is empty there is no information available. A Reason clarifies an HTTP status code but does not override it. */
  reason?: string;
  /* Status of the operation. One of: "Success" or "Failure". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status */
  status?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.StatusCause */
/* StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered. */
export interface StatusCause {
  /* The field of the resource that has caused this error, as named by its JSON serialization. May include dot and postfix notation for nested attributes. Arrays are zero-indexed.  Fields may appear more than once in an array of causes due to fields having multiple errors. Optional.
  
  Examples:
    "name" - the field "name" on the current resource
    "items[0].name" - the field "name" on the first array entry in "items" */
  field?: string;
  /* A human-readable description of the cause of the error.  This field may be presented as-is to a reader. */
  message?: string;
  /* A machine-readable description of the cause of the error. If this value is empty there is no information available. */
  reason?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.StatusDetails */
/* StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined. */
export interface StatusDetails {
  /* The Causes array includes more details associated with the StatusReason failure. Not all StatusReasons may provide detailed causes. */
  causes?: StatusCause[];
  /* The group attribute of the resource associated with the status StatusReason. */
  group?: string;
  /* The kind attribute of the resource associated with the status StatusReason. On some operations may differ from the requested resource Kind. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described). */
  name?: string;
  /* If specified, the time in seconds before the operation should be retried. Some errors may indicate the client must take an alternate action - for those errors this field may indicate how long to wait before taking the alternate action. */
  retryAfterSeconds?: number;
  /* UID of the resource. (when there is a single resource which can be described). More info: http://kubernetes.io/docs/user-guide/identifiers#uids */
  uid?: string;
}
/* io.k8s.apimachinery.pkg.apis.meta.v1.Time */
/* Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers. */
export type Time = string;
/* io.k8s.apimachinery.pkg.apis.meta.v1.WatchEvent */
/* Event represents a single event to a watched resource. */
export interface WatchEvent {
  /* Object is:
   * If Type is Added or Modified: the new state of the object.
   * If Type is Deleted: the state of the object immediately before deletion.
   * If Type is Error: *Status is recommended; other types may make sense
     depending on context. */
  object: RawExtension;
  type: string;
}
/* io.k8s.apimachinery.pkg.runtime.RawExtension */
/* RawExtension is used to hold extensions in external versions.

To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.

// Internal package: type MyAPIObject struct {
	runtime.TypeMeta `json:",inline"`
	MyPlugin runtime.Object `json:"myPlugin"`
} type PluginA struct {
	AOption string `json:"aOption"`
}

// External package: type MyAPIObject struct {
	runtime.TypeMeta `json:",inline"`
	MyPlugin runtime.RawExtension `json:"myPlugin"`
} type PluginA struct {
	AOption string `json:"aOption"`
}

// On the wire, the JSON will look something like this: {
	"kind":"MyAPIObject",
	"apiVersion":"v1",
	"myPlugin": {
		"kind":"PluginA",
		"aOption":"foo",
	},
}

So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.) */
export type RawExtension = {
  [key: string]: unknown;
};
/* io.k8s.apimachinery.pkg.util.intstr.IntOrString */
/* IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number. */
export type IntOrString = string;
/* io.k8s.apimachinery.pkg.version.Info */
/* Info contains versioning information. how we'll want to distribute that information. */
export interface Info {
  buildDate: string;
  compiler: string;
  gitCommit: string;
  gitTreeState: string;
  gitVersion: string;
  goVersion: string;
  major: string;
  minor: string;
  platform: string;
}
/* io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIService */
/* APIService represents a server for a particular GroupVersion. Name must be "version.group". */
export interface APIService {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ObjectMeta;
  /* Spec contains information for locating and communicating with a server */
  spec?: APIServiceSpec;
  /* Status contains derived information about an API server */
  status?: APIServiceStatus;
}
/* io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceCondition */
/* APIServiceCondition describes the state of an APIService at a particular point */
export interface APIServiceCondition {
  /* Last time the condition transitioned from one status to another. */
  lastTransitionTime?: Time;
  /* Human-readable message indicating details about last transition. */
  message?: string;
  /* Unique, one-word, CamelCase reason for the condition's last transition. */
  reason?: string;
  /* Status is the status of the condition. Can be True, False, Unknown. */
  status: string;
  /* Type is the type of the condition. */
  type: string;
}
/* io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceList */
/* APIServiceList is a list of APIService objects. */
export interface APIServiceList {
  /* APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources */
  apiVersion?: string;
  /* Items is the list of APIService */
  items: APIService[];
  /* Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds */
  kind?: string;
  /* Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata */
  metadata?: ListMeta;
}
/* io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceSpec */
/* APIServiceSpec contains information for locating and communicating with a server. Only https is supported, though you are able to disable certificate verification. */
export interface APIServiceSpec {
  /* CABundle is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. If unspecified, system trust roots on the apiserver are used. */
  caBundle?: string;
  /* Group is the API group name this server hosts */
  group?: string;
  /* GroupPriorityMininum is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones. Note that other versions of this group might specify even higher GroupPriorityMininum values such that the whole group gets a higher priority. The primary sort is based on GroupPriorityMinimum, ordered highest number to lowest (20 before 10). The secondary sort is based on the alphabetical comparison of the name of the object.  (v1.bar before v1.foo) We'd recommend something like: *.k8s.io (except extensions) at 18000 and PaaSes (OpenShift, Deis) are recommended to be in the 2000s */
  groupPriorityMinimum: number;
  /* InsecureSkipTLSVerify disables TLS certificate verification when communicating with this server. This is strongly discouraged.  You should use the CABundle instead. */
  insecureSkipTLSVerify?: boolean;
  /* Service is a reference to the service for this API server.  It must communicate on port 443. If the Service is nil, that means the handling for the API groupversion is handled locally on this server. The call will simply delegate to the normal handler chain to be fulfilled. */
  service?: ServiceReference;
  /* Version is the API version this server hosts.  For example, "v1" */
  version?: string;
  /* VersionPriority controls the ordering of this API version inside of its group.  Must be greater than zero. The primary sort is based on VersionPriority, ordered highest to lowest (20 before 10). Since it's inside of a group, the number can be small, probably in the 10s. In case of equal version priorities, the version string will be used to compute the order inside a group. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10. */
  versionPriority: number;
}
/* io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceStatus */
/* APIServiceStatus contains derived information about an API server */
export interface APIServiceStatus {
  /* Current service state of apiService. */
  conditions?: APIServiceCondition[];
}
/* io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.ServiceReference */
/* ServiceReference holds a reference to Service.legacy.k8s.io */
export interface ServiceReference {
  /* Name is the name of the service */
  name?: string;
  /* Namespace is the namespace of the service */
  namespace?: string;
  /* If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive). */
  port?: number;
}
export interface GetServiceAccountIssuerOpenIDConfigurationRequest {}
export interface GetCoreAPIVersionsRequest {}
export interface GetCoreV1APIResourcesRequest {}
export interface ListCoreV1ComponentStatusRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ReadCoreV1ComponentStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ListCoreV1ConfigMapForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1EndpointsForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1EventForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1LimitRangeForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1NamespaceRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateCoreV1NamespaceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: Namespace;
}
export interface CreateCoreV1NamespacedBindingRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  path: {
    namespace: string;
  };
  body: Binding;
}
export interface ListCoreV1NamespacedConfigMapRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedConfigMapRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: ConfigMap;
}
export interface DeleteCoreV1CollectionNamespacedConfigMapRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedConfigMapRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedConfigMapRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ConfigMap;
}
export interface DeleteCoreV1NamespacedConfigMapRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedConfigMapRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedEndpointsRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedEndpointsRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Endpoints;
}
export interface DeleteCoreV1CollectionNamespacedEndpointsRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedEndpointsRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedEndpointsRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Endpoints;
}
export interface DeleteCoreV1NamespacedEndpointsRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedEndpointsRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedEventRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Event;
}
export interface DeleteCoreV1CollectionNamespacedEventRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedEventRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Event;
}
export interface DeleteCoreV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedLimitRangeRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedLimitRangeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: LimitRange;
}
export interface DeleteCoreV1CollectionNamespacedLimitRangeRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedLimitRangeRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedLimitRangeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: LimitRange;
}
export interface DeleteCoreV1NamespacedLimitRangeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedLimitRangeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: PersistentVolumeClaim;
}
export interface DeleteCoreV1CollectionNamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: PersistentVolumeClaim;
}
export interface DeleteCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadCoreV1NamespacedPersistentVolumeClaimStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedPersistentVolumeClaimStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: PersistentVolumeClaim;
}
export interface PatchCoreV1NamespacedPersistentVolumeClaimStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedPodRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedPodRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Pod;
}
export interface DeleteCoreV1CollectionNamespacedPodRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedPodRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedPodRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Pod;
}
export interface DeleteCoreV1NamespacedPodRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedPodRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ConnectCoreV1GetNamespacedPodAttachRequest {
  query: {
    container?: string;
    stderr?: boolean;
    stdin?: boolean;
    stdout?: boolean;
    tty?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PostNamespacedPodAttachRequest {
  query: {
    container?: string;
    stderr?: boolean;
    stdin?: boolean;
    stdout?: boolean;
    tty?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedPodBindingRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Binding;
}
export interface CreateCoreV1NamespacedPodEvictionRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Eviction;
}
export interface ConnectCoreV1GetNamespacedPodExecRequest {
  query: {
    command?: string;
    container?: string;
    stderr?: boolean;
    stdin?: boolean;
    stdout?: boolean;
    tty?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PostNamespacedPodExecRequest {
  query: {
    command?: string;
    container?: string;
    stderr?: boolean;
    stdin?: boolean;
    stdout?: boolean;
    tty?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedPodLogRequest {
  query: {
    container?: string;
    follow?: boolean;
    insecureSkipTLSVerifyBackend?: boolean;
    limitBytes?: number;
    pretty?: string;
    previous?: boolean;
    sinceSeconds?: number;
    tailLines?: number;
    timestamps?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1GetNamespacedPodPortforwardRequest {
  query: {
    ports?: number;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PostNamespacedPodPortforwardRequest {
  query: {
    ports?: number;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1GetNamespacedPodProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PostNamespacedPodProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PutNamespacedPodProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1DeleteNamespacedPodProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PatchNamespacedPodProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1GetNamespacedPodProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1PostNamespacedPodProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1PutNamespacedPodProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1DeleteNamespacedPodProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1PatchNamespacedPodProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ReadCoreV1NamespacedPodStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedPodStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Pod;
}
export interface PatchCoreV1NamespacedPodStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedPodTemplateRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedPodTemplateRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: PodTemplate;
}
export interface DeleteCoreV1CollectionNamespacedPodTemplateRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedPodTemplateRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedPodTemplateRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: PodTemplate;
}
export interface DeleteCoreV1NamespacedPodTemplateRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedPodTemplateRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: ReplicationController;
}
export interface DeleteCoreV1CollectionNamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ReplicationController;
}
export interface DeleteCoreV1NamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedReplicationControllerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadCoreV1NamespacedReplicationControllerScaleRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedReplicationControllerScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Scale;
}
export interface PatchCoreV1NamespacedReplicationControllerScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadCoreV1NamespacedReplicationControllerStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedReplicationControllerStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ReplicationController;
}
export interface PatchCoreV1NamespacedReplicationControllerStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: ResourceQuota;
}
export interface DeleteCoreV1CollectionNamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ResourceQuota;
}
export interface DeleteCoreV1NamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedResourceQuotaRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadCoreV1NamespacedResourceQuotaStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedResourceQuotaStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ResourceQuota;
}
export interface PatchCoreV1NamespacedResourceQuotaStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedSecretRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedSecretRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Secret;
}
export interface DeleteCoreV1CollectionNamespacedSecretRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedSecretRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedSecretRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Secret;
}
export interface DeleteCoreV1NamespacedSecretRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedSecretRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListCoreV1NamespacedServiceAccountRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedServiceAccountRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: ServiceAccount;
}
export interface DeleteCoreV1CollectionNamespacedServiceAccountRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoreV1NamespacedServiceAccountRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedServiceAccountRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ServiceAccount;
}
export interface DeleteCoreV1NamespacedServiceAccountRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedServiceAccountRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface CreateCoreV1NamespacedServiceAccountTokenRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: TokenRequest;
}
export interface ListCoreV1NamespacedServiceRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoreV1NamespacedServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Service;
}
export interface ReadCoreV1NamespacedServiceRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Service;
}
export interface DeleteCoreV1NamespacedServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoreV1NamespacedServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ConnectCoreV1GetNamespacedServiceProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PostNamespacedServiceProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PutNamespacedServiceProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1DeleteNamespacedServiceProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1PatchNamespacedServiceProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ConnectCoreV1GetNamespacedServiceProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1PostNamespacedServiceProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1PutNamespacedServiceProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1DeleteNamespacedServiceProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ConnectCoreV1PatchNamespacedServiceProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    namespace: string;
    path: string;
  };
}
export interface ReadCoreV1NamespacedServiceStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoreV1NamespacedServiceStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Service;
}
export interface PatchCoreV1NamespacedServiceStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadCoreV1NamespaceRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCoreV1NamespaceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: Namespace;
}
export interface DeleteCoreV1NamespaceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchCoreV1NamespaceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReplaceCoreV1NamespaceFinalizeRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  path: {
    name: string;
  };
  body: Namespace;
}
export interface ReadCoreV1NamespaceStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCoreV1NamespaceStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: Namespace;
}
export interface PatchCoreV1NamespaceStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListCoreV1NodeRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateCoreV1NodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: Node;
}
export interface DeleteCoreV1CollectionNodeRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadCoreV1NodeRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCoreV1NodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: Node;
}
export interface DeleteCoreV1NodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchCoreV1NodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ConnectCoreV1GetNodeProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
  };
}
export interface ConnectCoreV1PostNodeProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
  };
}
export interface ConnectCoreV1PutNodeProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
  };
}
export interface ConnectCoreV1DeleteNodeProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
  };
}
export interface ConnectCoreV1PatchNodeProxyRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
  };
}
export interface ConnectCoreV1GetNodeProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    path: string;
  };
}
export interface ConnectCoreV1PostNodeProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    path: string;
  };
}
export interface ConnectCoreV1PutNodeProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    path: string;
  };
}
export interface ConnectCoreV1DeleteNodeProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    path: string;
  };
}
export interface ConnectCoreV1PatchNodeProxyWithPathRequest {
  query: {
    path?: string;
  };
  path: {
    name: string;
    path: string;
  };
}
export interface ReadCoreV1NodeStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCoreV1NodeStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: Node;
}
export interface PatchCoreV1NodeStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListCoreV1PersistentVolumeClaimForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1PersistentVolumeRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateCoreV1PersistentVolumeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: PersistentVolume;
}
export interface DeleteCoreV1CollectionPersistentVolumeRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadCoreV1PersistentVolumeRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCoreV1PersistentVolumeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: PersistentVolume;
}
export interface DeleteCoreV1PersistentVolumeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchCoreV1PersistentVolumeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReadCoreV1PersistentVolumeStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCoreV1PersistentVolumeStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: PersistentVolume;
}
export interface PatchCoreV1PersistentVolumeStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListCoreV1PodForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1PodTemplateForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1ReplicationControllerForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1ResourceQuotaForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1SecretForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1ServiceAccountForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoreV1ServiceForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1ConfigMapListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1EndpointsListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1EventListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1LimitRangeListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1NamespaceListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1NamespacedConfigMapListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedConfigMapRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedEndpointsListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedEndpointsRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedEventListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedEventRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedLimitRangeListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedLimitRangeRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedPersistentVolumeClaimListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedPersistentVolumeClaimRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedPodListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedPodRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedPodTemplateListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedPodTemplateRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedReplicationControllerListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedReplicationControllerRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedResourceQuotaListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedResourceQuotaRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedSecretListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedSecretRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedServiceAccountListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedServiceAccountRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedServiceListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoreV1NamespacedServiceRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchCoreV1NamespaceRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchCoreV1NodeListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1NodeRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchCoreV1PersistentVolumeClaimListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1PersistentVolumeListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1PersistentVolumeRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchCoreV1PodListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1PodTemplateListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1ReplicationControllerListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1ResourceQuotaListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1SecretListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1ServiceAccountListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoreV1ServiceListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface GetAPIVersionsRequest {}
export interface GetAdmissionregistrationAPIGroupRequest {}
export interface GetAdmissionregistrationV1APIResourcesRequest {}
export interface ListAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: MutatingWebhookConfiguration;
}
export interface DeleteAdmissionregistrationV1CollectionMutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: MutatingWebhookConfiguration;
}
export interface DeleteAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: ValidatingWebhookConfiguration;
}
export interface DeleteAdmissionregistrationV1CollectionValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: ValidatingWebhookConfiguration;
}
export interface DeleteAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchAdmissionregistrationV1MutatingWebhookConfigurationListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAdmissionregistrationV1MutatingWebhookConfigurationRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchAdmissionregistrationV1ValidatingWebhookConfigurationListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAdmissionregistrationV1ValidatingWebhookConfigurationRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface GetApiextensionsAPIGroupRequest {}
export interface GetApiextensionsV1APIResourcesRequest {}
export interface ListApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: CustomResourceDefinition;
}
export interface DeleteApiextensionsV1CollectionCustomResourceDefinitionRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CustomResourceDefinition;
}
export interface DeleteApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReadApiextensionsV1CustomResourceDefinitionStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceApiextensionsV1CustomResourceDefinitionStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CustomResourceDefinition;
}
export interface PatchApiextensionsV1CustomResourceDefinitionStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchApiextensionsV1CustomResourceDefinitionListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchApiextensionsV1CustomResourceDefinitionRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface GetApiregistrationAPIGroupRequest {}
export interface GetApiregistrationV1APIResourcesRequest {}
export interface ListApiregistrationV1APIServiceRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateApiregistrationV1APIServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: APIService;
}
export interface DeleteApiregistrationV1CollectionAPIServiceRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadApiregistrationV1APIServiceRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceApiregistrationV1APIServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: APIService;
}
export interface DeleteApiregistrationV1APIServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchApiregistrationV1APIServiceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReadApiregistrationV1APIServiceStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceApiregistrationV1APIServiceStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: APIService;
}
export interface PatchApiregistrationV1APIServiceStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchApiregistrationV1APIServiceListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchApiregistrationV1APIServiceRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface GetAppsAPIGroupRequest {}
export interface GetAppsV1APIResourcesRequest {}
export interface ListAppsV1ControllerRevisionForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListAppsV1DaemonSetForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListAppsV1DeploymentForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListAppsV1NamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAppsV1NamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: ControllerRevision;
}
export interface DeleteAppsV1CollectionNamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAppsV1NamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ControllerRevision;
}
export interface DeleteAppsV1NamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAppsV1NamespacedControllerRevisionRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListAppsV1NamespacedDaemonSetRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAppsV1NamespacedDaemonSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: DaemonSet;
}
export interface DeleteAppsV1CollectionNamespacedDaemonSetRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAppsV1NamespacedDaemonSetRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedDaemonSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: DaemonSet;
}
export interface DeleteAppsV1NamespacedDaemonSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAppsV1NamespacedDaemonSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedDaemonSetStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedDaemonSetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: DaemonSet;
}
export interface PatchAppsV1NamespacedDaemonSetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListAppsV1NamespacedDeploymentRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAppsV1NamespacedDeploymentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Deployment;
}
export interface DeleteAppsV1CollectionNamespacedDeploymentRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAppsV1NamespacedDeploymentRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedDeploymentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Deployment;
}
export interface DeleteAppsV1NamespacedDeploymentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAppsV1NamespacedDeploymentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedDeploymentScaleRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedDeploymentScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Scale;
}
export interface PatchAppsV1NamespacedDeploymentScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedDeploymentStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedDeploymentStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Deployment;
}
export interface PatchAppsV1NamespacedDeploymentStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListAppsV1NamespacedReplicaSetRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAppsV1NamespacedReplicaSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: ReplicaSet;
}
export interface DeleteAppsV1CollectionNamespacedReplicaSetRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAppsV1NamespacedReplicaSetRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedReplicaSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ReplicaSet;
}
export interface DeleteAppsV1NamespacedReplicaSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAppsV1NamespacedReplicaSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedReplicaSetScaleRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedReplicaSetScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Scale;
}
export interface PatchAppsV1NamespacedReplicaSetScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedReplicaSetStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedReplicaSetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: ReplicaSet;
}
export interface PatchAppsV1NamespacedReplicaSetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListAppsV1NamespacedStatefulSetRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAppsV1NamespacedStatefulSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: StatefulSet;
}
export interface DeleteAppsV1CollectionNamespacedStatefulSetRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAppsV1NamespacedStatefulSetRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedStatefulSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: StatefulSet;
}
export interface DeleteAppsV1NamespacedStatefulSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAppsV1NamespacedStatefulSetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedStatefulSetScaleRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedStatefulSetScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Scale;
}
export interface PatchAppsV1NamespacedStatefulSetScaleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAppsV1NamespacedStatefulSetStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAppsV1NamespacedStatefulSetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: StatefulSet;
}
export interface PatchAppsV1NamespacedStatefulSetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListAppsV1ReplicaSetForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListAppsV1StatefulSetForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAppsV1ControllerRevisionListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAppsV1DaemonSetListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAppsV1DeploymentListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAppsV1NamespacedControllerRevisionListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedControllerRevisionRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedDaemonSetListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedDaemonSetRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedDeploymentListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedDeploymentRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedReplicaSetListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedReplicaSetRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedStatefulSetListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAppsV1NamespacedStatefulSetRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchAppsV1ReplicaSetListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAppsV1StatefulSetListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface GetAuthenticationAPIGroupRequest {}
export interface GetAuthenticationV1APIResourcesRequest {}
export interface CreateAuthenticationV1TokenReviewRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  body: TokenReview;
}
export interface GetAuthorizationAPIGroupRequest {}
export interface GetAuthorizationV1APIResourcesRequest {}
export interface CreateAuthorizationV1NamespacedLocalSubjectAccessReviewRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  path: {
    namespace: string;
  };
  body: LocalSubjectAccessReview;
}
export interface CreateAuthorizationV1SelfSubjectAccessReviewRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  body: SelfSubjectAccessReview;
}
export interface CreateAuthorizationV1SelfSubjectRulesReviewRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  body: SelfSubjectRulesReview;
}
export interface CreateAuthorizationV1SubjectAccessReviewRequest {
  query: {
    dryRun?: string;
    fieldManager?: string;
    pretty?: string;
  };
  body: SubjectAccessReview;
}
export interface GetAutoscalingAPIGroupRequest {}
export interface GetAutoscalingV1APIResourcesRequest {}
export interface ListAutoscalingV1HorizontalPodAutoscalerForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: HorizontalPodAutoscaler;
}
export interface DeleteAutoscalingV1CollectionNamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: HorizontalPodAutoscaler;
}
export interface DeleteAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: HorizontalPodAutoscaler;
}
export interface PatchAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface WatchAutoscalingV1HorizontalPodAutoscalerListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAutoscalingV1NamespacedHorizontalPodAutoscalerListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAutoscalingV1NamespacedHorizontalPodAutoscalerRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface GetAutoscalingV2beta2APIResourcesRequest {}
export interface ListAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: HorizontalPodAutoscaler;
}
export interface DeleteAutoscalingV2beta2CollectionNamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: HorizontalPodAutoscaler;
}
export interface DeleteAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: HorizontalPodAutoscaler;
}
export interface PatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface WatchAutoscalingV2beta2HorizontalPodAutoscalerListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface GetBatchAPIGroupRequest {}
export interface GetBatchV1APIResourcesRequest {}
export interface ListBatchV1CronJobForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListBatchV1JobForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListBatchV1NamespacedCronJobRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateBatchV1NamespacedCronJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: CronJob;
}
export interface DeleteBatchV1CollectionNamespacedCronJobRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadBatchV1NamespacedCronJobRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceBatchV1NamespacedCronJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: CronJob;
}
export interface DeleteBatchV1NamespacedCronJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchBatchV1NamespacedCronJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadBatchV1NamespacedCronJobStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceBatchV1NamespacedCronJobStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: CronJob;
}
export interface PatchBatchV1NamespacedCronJobStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListBatchV1NamespacedJobRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateBatchV1NamespacedJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Job;
}
export interface DeleteBatchV1CollectionNamespacedJobRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadBatchV1NamespacedJobRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceBatchV1NamespacedJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Job;
}
export interface DeleteBatchV1NamespacedJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchBatchV1NamespacedJobRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadBatchV1NamespacedJobStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceBatchV1NamespacedJobStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Job;
}
export interface PatchBatchV1NamespacedJobStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface WatchBatchV1CronJobListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchBatchV1JobListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchBatchV1NamespacedCronJobListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchBatchV1NamespacedCronJobRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchBatchV1NamespacedJobListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchBatchV1NamespacedJobRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface GetCertificatesAPIGroupRequest {}
export interface GetCertificatesV1APIResourcesRequest {}
export interface ListCertificatesV1CertificateSigningRequestRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateCertificatesV1CertificateSigningRequestRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: CertificateSigningRequest;
}
export interface DeleteCertificatesV1CollectionCertificateSigningRequestRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadCertificatesV1CertificateSigningRequestRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCertificatesV1CertificateSigningRequestRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CertificateSigningRequest;
}
export interface DeleteCertificatesV1CertificateSigningRequestRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchCertificatesV1CertificateSigningRequestRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReadCertificatesV1CertificateSigningRequestApprovalRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCertificatesV1CertificateSigningRequestApprovalRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CertificateSigningRequest;
}
export interface PatchCertificatesV1CertificateSigningRequestApprovalRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReadCertificatesV1CertificateSigningRequestStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceCertificatesV1CertificateSigningRequestStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CertificateSigningRequest;
}
export interface PatchCertificatesV1CertificateSigningRequestStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchCertificatesV1CertificateSigningRequestListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCertificatesV1CertificateSigningRequestRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface GetCoordinationAPIGroupRequest {}
export interface GetCoordinationV1APIResourcesRequest {}
export interface ListCoordinationV1LeaseForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListCoordinationV1NamespacedLeaseRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateCoordinationV1NamespacedLeaseRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Lease;
}
export interface DeleteCoordinationV1CollectionNamespacedLeaseRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadCoordinationV1NamespacedLeaseRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceCoordinationV1NamespacedLeaseRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Lease;
}
export interface DeleteCoordinationV1NamespacedLeaseRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchCoordinationV1NamespacedLeaseRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface WatchCoordinationV1LeaseListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchCoordinationV1NamespacedLeaseListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchCoordinationV1NamespacedLeaseRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface GetDiscoveryAPIGroupRequest {}
export interface GetDiscoveryV1APIResourcesRequest {}
export interface ListDiscoveryV1EndpointSliceForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: EndpointSlice;
}
export interface DeleteDiscoveryV1CollectionNamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: EndpointSlice;
}
export interface DeleteDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface WatchDiscoveryV1EndpointSliceListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchDiscoveryV1NamespacedEndpointSliceListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchDiscoveryV1NamespacedEndpointSliceRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface GetEventsAPIGroupRequest {}
export interface GetEventsV1APIResourcesRequest {}
export interface ListEventsV1EventForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListEventsV1NamespacedEventRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateEventsV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Event;
}
export interface DeleteEventsV1CollectionNamespacedEventRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadEventsV1NamespacedEventRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceEventsV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Event;
}
export interface DeleteEventsV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchEventsV1NamespacedEventRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface WatchEventsV1EventListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchEventsV1NamespacedEventListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchEventsV1NamespacedEventRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface GetFlowcontrolApiserverAPIGroupRequest {}
export interface GetNetworkingAPIGroupRequest {}
export interface GetNetworkingV1APIResourcesRequest {}
export interface ListNetworkingV1IngressClassRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateNetworkingV1IngressClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: IngressClass;
}
export interface DeleteNetworkingV1CollectionIngressClassRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadNetworkingV1IngressClassRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceNetworkingV1IngressClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: IngressClass;
}
export interface DeleteNetworkingV1IngressClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchNetworkingV1IngressClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListNetworkingV1IngressForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListNetworkingV1NamespacedIngressRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateNetworkingV1NamespacedIngressRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Ingress;
}
export interface DeleteNetworkingV1CollectionNamespacedIngressRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadNetworkingV1NamespacedIngressRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceNetworkingV1NamespacedIngressRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Ingress;
}
export interface DeleteNetworkingV1NamespacedIngressRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchNetworkingV1NamespacedIngressRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadNetworkingV1NamespacedIngressStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceNetworkingV1NamespacedIngressStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Ingress;
}
export interface PatchNetworkingV1NamespacedIngressStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: NetworkPolicy;
}
export interface DeleteNetworkingV1CollectionNamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: NetworkPolicy;
}
export interface DeleteNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListNetworkingV1NetworkPolicyForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchNetworkingV1IngressClassListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchNetworkingV1IngressClassRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchNetworkingV1IngressListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchNetworkingV1NamespacedIngressListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchNetworkingV1NamespacedIngressRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchNetworkingV1NamespacedNetworkPolicyListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchNetworkingV1NamespacedNetworkPolicyRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchNetworkingV1NetworkPolicyListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface GetNodeAPIGroupRequest {}
export interface GetNodeV1APIResourcesRequest {}
export interface ListNodeV1RuntimeClassRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateNodeV1RuntimeClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: RuntimeClass;
}
export interface DeleteNodeV1CollectionRuntimeClassRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadNodeV1RuntimeClassRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceNodeV1RuntimeClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: RuntimeClass;
}
export interface DeleteNodeV1RuntimeClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchNodeV1RuntimeClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchNodeV1RuntimeClassListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchNodeV1RuntimeClassRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface GetPolicyAPIGroupRequest {}
export interface GetPolicyV1APIResourcesRequest {}
export interface ListPolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreatePolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: PodDisruptionBudget;
}
export interface DeletePolicyV1CollectionNamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadPolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplacePolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: PodDisruptionBudget;
}
export interface DeletePolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchPolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ReadPolicyV1NamespacedPodDisruptionBudgetStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplacePolicyV1NamespacedPodDisruptionBudgetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: PodDisruptionBudget;
}
export interface PatchPolicyV1NamespacedPodDisruptionBudgetStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListPolicyV1PodDisruptionBudgetForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchPolicyV1NamespacedPodDisruptionBudgetListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchPolicyV1NamespacedPodDisruptionBudgetRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchPolicyV1PodDisruptionBudgetListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface GetRbacAuthorizationAPIGroupRequest {}
export interface GetRbacAuthorizationV1APIResourcesRequest {}
export interface ListRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: ClusterRoleBinding;
}
export interface DeleteRbacAuthorizationV1CollectionClusterRoleBindingRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: ClusterRoleBinding;
}
export interface DeleteRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListRbacAuthorizationV1ClusterRoleRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateRbacAuthorizationV1ClusterRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: ClusterRole;
}
export interface DeleteRbacAuthorizationV1CollectionClusterRoleRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadRbacAuthorizationV1ClusterRoleRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceRbacAuthorizationV1ClusterRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: ClusterRole;
}
export interface DeleteRbacAuthorizationV1ClusterRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchRbacAuthorizationV1ClusterRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: RoleBinding;
}
export interface DeleteRbacAuthorizationV1CollectionNamespacedRoleBindingRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: RoleBinding;
}
export interface DeleteRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface CreateRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    namespace: string;
  };
  body: Role;
}
export interface DeleteRbacAuthorizationV1CollectionNamespacedRoleRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
  path: {
    namespace: string;
  };
}
export interface ReadRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface ReplaceRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Role;
}
export interface DeleteRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface PatchRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
  body: Patch;
}
export interface ListRbacAuthorizationV1RoleBindingForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface ListRbacAuthorizationV1RoleForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchRbacAuthorizationV1ClusterRoleBindingListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchRbacAuthorizationV1ClusterRoleBindingRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchRbacAuthorizationV1ClusterRoleListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchRbacAuthorizationV1ClusterRoleRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchRbacAuthorizationV1NamespacedRoleBindingListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchRbacAuthorizationV1NamespacedRoleBindingRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchRbacAuthorizationV1NamespacedRoleListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    namespace: string;
  };
}
export interface WatchRbacAuthorizationV1NamespacedRoleRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
    namespace: string;
  };
}
export interface WatchRbacAuthorizationV1RoleBindingListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchRbacAuthorizationV1RoleListForAllNamespacesRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface GetSchedulingAPIGroupRequest {}
export interface GetSchedulingV1APIResourcesRequest {}
export interface ListSchedulingV1PriorityClassRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateSchedulingV1PriorityClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: PriorityClass;
}
export interface DeleteSchedulingV1CollectionPriorityClassRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadSchedulingV1PriorityClassRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceSchedulingV1PriorityClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: PriorityClass;
}
export interface DeleteSchedulingV1PriorityClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchSchedulingV1PriorityClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchSchedulingV1PriorityClassListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchSchedulingV1PriorityClassRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface GetStorageAPIGroupRequest {}
export interface GetStorageV1APIResourcesRequest {}
export interface ListStorageV1CSIDriverRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateStorageV1CSIDriverRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: CSIDriver;
}
export interface DeleteStorageV1CollectionCSIDriverRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadStorageV1CSIDriverRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceStorageV1CSIDriverRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CSIDriver;
}
export interface DeleteStorageV1CSIDriverRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchStorageV1CSIDriverRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListStorageV1CSINodeRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateStorageV1CSINodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: CSINode;
}
export interface DeleteStorageV1CollectionCSINodeRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadStorageV1CSINodeRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceStorageV1CSINodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: CSINode;
}
export interface DeleteStorageV1CSINodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchStorageV1CSINodeRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListStorageV1StorageClassRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateStorageV1StorageClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: StorageClass;
}
export interface DeleteStorageV1CollectionStorageClassRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadStorageV1StorageClassRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceStorageV1StorageClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: StorageClass;
}
export interface DeleteStorageV1StorageClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchStorageV1StorageClassRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ListStorageV1VolumeAttachmentRequest {
  query: {
    pretty?: string;
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface CreateStorageV1VolumeAttachmentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  body: VolumeAttachment;
}
export interface DeleteStorageV1CollectionVolumeAttachmentRequest {
  query: {
    pretty?: string;
    continue?: string;
    dryRun?: string;
    fieldSelector?: string;
    gracePeriodSeconds?: number;
    labelSelector?: string;
    limit?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
  };
}
export interface ReadStorageV1VolumeAttachmentRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceStorageV1VolumeAttachmentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: VolumeAttachment;
}
export interface DeleteStorageV1VolumeAttachmentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    gracePeriodSeconds?: number;
    orphanDependents?: boolean;
    propagationPolicy?: string;
  };
  path: {
    name: string;
  };
}
export interface PatchStorageV1VolumeAttachmentRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface ReadStorageV1VolumeAttachmentStatusRequest {
  query: {
    pretty?: string;
  };
  path: {
    name: string;
  };
}
export interface ReplaceStorageV1VolumeAttachmentStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
  };
  path: {
    name: string;
  };
  body: VolumeAttachment;
}
export interface PatchStorageV1VolumeAttachmentStatusRequest {
  query: {
    pretty?: string;
    dryRun?: string;
    fieldManager?: string;
    force?: boolean;
  };
  path: {
    name: string;
  };
  body: Patch;
}
export interface WatchStorageV1CSIDriverListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchStorageV1CSIDriverRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchStorageV1CSINodeListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchStorageV1CSINodeRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchStorageV1StorageClassListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchStorageV1StorageClassRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface WatchStorageV1VolumeAttachmentListRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
}
export interface WatchStorageV1VolumeAttachmentRequest {
  query: {
    allowWatchBookmarks?: boolean;
    continue?: string;
    fieldSelector?: string;
    labelSelector?: string;
    limit?: number;
    pretty?: string;
    resourceVersion?: string;
    resourceVersionMatch?: string;
    timeoutSeconds?: number;
    watch?: boolean;
  };
  path: {
    name: string;
  };
}
export interface LogFileListHandlerRequest {}
export interface LogFileHandlerRequest {
  path: {
    logpath: string;
  };
}
export interface GetServiceAccountIssuerOpenIDKeysetRequest {}
export interface GetCodeVersionRequest {}
export class KubernetesClient extends APIClient {
  constructor(options) {
    super(options);
  }
  async getSwaggerJSON() {
    const path = "/openapi/v2";
    return this.get(path);
  }
  async getServiceAccountIssuerOpenIDConfiguration(params: GetServiceAccountIssuerOpenIDConfigurationRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/.well-known/openid-configuration/`;
    return await this.get<string>(path, null, null, opts);
  }
  async getCoreAPIVersions(params: GetCoreAPIVersionsRequest, opts?: APIClientRequestOpts): Promise<APIVersions> {
    const path = `/api/`;
    return await this.get<APIVersions>(path, null, null, opts);
  }
  async getCoreV1APIResources(params: GetCoreV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/api/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listCoreV1ComponentStatus(params: ListCoreV1ComponentStatusRequest, opts?: APIClientRequestOpts): Promise<ComponentStatusList> {
    const path = `/api/v1/componentstatuses`;
    return await this.get<ComponentStatusList>(path, null, null, opts);
  }
  async readCoreV1ComponentStatus(params: ReadCoreV1ComponentStatusRequest, opts?: APIClientRequestOpts): Promise<ComponentStatus> {
    const path = `/api/v1/componentstatuses/${params.path.name}`;
    return await this.get<ComponentStatus>(path, null, null, opts);
  }
  async listCoreV1ConfigMapForAllNamespaces(params: ListCoreV1ConfigMapForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ConfigMapList> {
    const path = `/api/v1/configmaps`;
    return await this.get<ConfigMapList>(path, null, null, opts);
  }
  async listCoreV1EndpointsForAllNamespaces(params: ListCoreV1EndpointsForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EndpointsList> {
    const path = `/api/v1/endpoints`;
    return await this.get<EndpointsList>(path, null, null, opts);
  }
  async listCoreV1EventForAllNamespaces(params: ListCoreV1EventForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EventList> {
    const path = `/api/v1/events`;
    return await this.get<EventList>(path, null, null, opts);
  }
  async listCoreV1LimitRangeForAllNamespaces(params: ListCoreV1LimitRangeForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<LimitRangeList> {
    const path = `/api/v1/limitranges`;
    return await this.get<LimitRangeList>(path, null, null, opts);
  }
  async listCoreV1Namespace(params: ListCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<NamespaceList> {
    const path = `/api/v1/namespaces`;
    return await this.get<NamespaceList>(path, params.query, null, opts);
  }
  async createCoreV1Namespace(params: CreateCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces`;
    return await this.post<Namespace>(path, params.query, params.body, opts);
  }
  async createCoreV1NamespacedBinding(params: CreateCoreV1NamespacedBindingRequest, opts?: APIClientRequestOpts): Promise<Binding> {
    const path = `/api/v1/namespaces/${params.path.namespace}/bindings`;
    return await this.post<Binding>(path, null, params.body, opts);
  }
  async listCoreV1NamespacedConfigMap(params: ListCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMapList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps`;
    return await this.get<ConfigMapList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedConfigMap(params: CreateCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps`;
    return await this.post<ConfigMap>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedConfigMap(params: DeleteCoreV1CollectionNamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedConfigMap(params: ReadCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps/${params.path.name}`;
    return await this.get<ConfigMap>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedConfigMap(params: ReplaceCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps/${params.path.name}`;
    return await this.put<ConfigMap>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedConfigMap(params: DeleteCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedConfigMap(params: PatchCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap> {
    const path = `/api/v1/namespaces/${params.path.namespace}/configmaps/${params.path.name}`;
    return await this.patch<ConfigMap>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedEndpoints(params: ListCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<EndpointsList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints`;
    return await this.get<EndpointsList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedEndpoints(params: CreateCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints`;
    return await this.post<Endpoints>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedEndpoints(params: DeleteCoreV1CollectionNamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedEndpoints(params: ReadCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints/${params.path.name}`;
    return await this.get<Endpoints>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedEndpoints(params: ReplaceCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints/${params.path.name}`;
    return await this.put<Endpoints>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedEndpoints(params: DeleteCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedEndpoints(params: PatchCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints> {
    const path = `/api/v1/namespaces/${params.path.namespace}/endpoints/${params.path.name}`;
    return await this.patch<Endpoints>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedEvent(params: ListCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<EventList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events`;
    return await this.get<EventList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedEvent(params: CreateCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events`;
    return await this.post<Event>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedEvent(params: DeleteCoreV1CollectionNamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedEvent(params: ReadCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.get<Event>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedEvent(params: ReplaceCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.put<Event>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedEvent(params: DeleteCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedEvent(params: PatchCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/api/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.patch<Event>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedLimitRange(params: ListCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRangeList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges`;
    return await this.get<LimitRangeList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedLimitRange(params: CreateCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges`;
    return await this.post<LimitRange>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedLimitRange(params: DeleteCoreV1CollectionNamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedLimitRange(params: ReadCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges/${params.path.name}`;
    return await this.get<LimitRange>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedLimitRange(params: ReplaceCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges/${params.path.name}`;
    return await this.put<LimitRange>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedLimitRange(params: DeleteCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedLimitRange(params: PatchCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange> {
    const path = `/api/v1/namespaces/${params.path.namespace}/limitranges/${params.path.name}`;
    return await this.patch<LimitRange>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedPersistentVolumeClaim(params: ListCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaimList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims`;
    return await this.get<PersistentVolumeClaimList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedPersistentVolumeClaim(params: CreateCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims`;
    return await this.post<PersistentVolumeClaim>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedPersistentVolumeClaim(params: DeleteCoreV1CollectionNamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedPersistentVolumeClaim(params: ReadCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}`;
    return await this.get<PersistentVolumeClaim>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedPersistentVolumeClaim(params: ReplaceCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}`;
    return await this.put<PersistentVolumeClaim>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedPersistentVolumeClaim(params: DeleteCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}`;
    return await this.delete<PersistentVolumeClaim>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedPersistentVolumeClaim(params: PatchCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}`;
    return await this.patch<PersistentVolumeClaim>(path, params.query, params.body, opts);
  }
  async readCoreV1NamespacedPersistentVolumeClaimStatus(params: ReadCoreV1NamespacedPersistentVolumeClaimStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}/status`;
    return await this.get<PersistentVolumeClaim>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedPersistentVolumeClaimStatus(params: ReplaceCoreV1NamespacedPersistentVolumeClaimStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}/status`;
    return await this.put<PersistentVolumeClaim>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespacedPersistentVolumeClaimStatus(params: PatchCoreV1NamespacedPersistentVolumeClaimStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim> {
    const path = `/api/v1/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}/status`;
    return await this.patch<PersistentVolumeClaim>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedPod(params: ListCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<PodList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods`;
    return await this.get<PodList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedPod(params: CreateCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods`;
    return await this.post<Pod>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedPod(params: DeleteCoreV1CollectionNamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedPod(params: ReadCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}`;
    return await this.get<Pod>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedPod(params: ReplaceCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}`;
    return await this.put<Pod>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedPod(params: DeleteCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}`;
    return await this.delete<Pod>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedPod(params: PatchCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}`;
    return await this.patch<Pod>(path, params.query, params.body, opts);
  }
  async connectCoreV1GetNamespacedPodAttach(params: ConnectCoreV1GetNamespacedPodAttachRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/attach`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedPodAttach(params: ConnectCoreV1PostNamespacedPodAttachRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/attach`;
    return await this.post<string>(path, null, null, opts);
  }
  async createCoreV1NamespacedPodBinding(params: CreateCoreV1NamespacedPodBindingRequest, opts?: APIClientRequestOpts): Promise<Binding> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/binding`;
    return await this.post<Binding>(path, null, params.body, opts);
  }
  async createCoreV1NamespacedPodEviction(params: CreateCoreV1NamespacedPodEvictionRequest, opts?: APIClientRequestOpts): Promise<Eviction> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/eviction`;
    return await this.post<Eviction>(path, null, params.body, opts);
  }
  async connectCoreV1GetNamespacedPodExec(params: ConnectCoreV1GetNamespacedPodExecRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/exec`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedPodExec(params: ConnectCoreV1PostNamespacedPodExecRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/exec`;
    return await this.post<string>(path, null, null, opts);
  }
  async readCoreV1NamespacedPodLog(params: ReadCoreV1NamespacedPodLogRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/log`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1GetNamespacedPodPortforward(params: ConnectCoreV1GetNamespacedPodPortforwardRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/portforward`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedPodPortforward(params: ConnectCoreV1PostNamespacedPodPortforwardRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/portforward`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1GetNamespacedPodProxy(params: ConnectCoreV1GetNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedPodProxy(params: ConnectCoreV1PostNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1PutNamespacedPodProxy(params: ConnectCoreV1PutNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy`;
    return await this.put<string>(path, null, null, opts);
  }
  async connectCoreV1DeleteNamespacedPodProxy(params: ConnectCoreV1DeleteNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy`;
    return await this.delete<string>(path, null, null, opts);
  }
  async connectCoreV1PatchNamespacedPodProxy(params: ConnectCoreV1PatchNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy`;
    return await this.patch<string>(path, null, null, opts);
  }
  async connectCoreV1GetNamespacedPodProxyWithPath(params: ConnectCoreV1GetNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy/${params.path.path}`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedPodProxyWithPath(params: ConnectCoreV1PostNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy/${params.path.path}`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1PutNamespacedPodProxyWithPath(params: ConnectCoreV1PutNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy/${params.path.path}`;
    return await this.put<string>(path, null, null, opts);
  }
  async connectCoreV1DeleteNamespacedPodProxyWithPath(params: ConnectCoreV1DeleteNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy/${params.path.path}`;
    return await this.delete<string>(path, null, null, opts);
  }
  async connectCoreV1PatchNamespacedPodProxyWithPath(params: ConnectCoreV1PatchNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/proxy/${params.path.path}`;
    return await this.patch<string>(path, null, null, opts);
  }
  async readCoreV1NamespacedPodStatus(params: ReadCoreV1NamespacedPodStatusRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/status`;
    return await this.get<Pod>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedPodStatus(params: ReplaceCoreV1NamespacedPodStatusRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/status`;
    return await this.put<Pod>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespacedPodStatus(params: PatchCoreV1NamespacedPodStatusRequest, opts?: APIClientRequestOpts): Promise<Pod> {
    const path = `/api/v1/namespaces/${params.path.namespace}/pods/${params.path.name}/status`;
    return await this.patch<Pod>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedPodTemplate(params: ListCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplateList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates`;
    return await this.get<PodTemplateList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedPodTemplate(params: CreateCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates`;
    return await this.post<PodTemplate>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedPodTemplate(params: DeleteCoreV1CollectionNamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedPodTemplate(params: ReadCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates/${params.path.name}`;
    return await this.get<PodTemplate>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedPodTemplate(params: ReplaceCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates/${params.path.name}`;
    return await this.put<PodTemplate>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedPodTemplate(params: DeleteCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates/${params.path.name}`;
    return await this.delete<PodTemplate>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedPodTemplate(params: PatchCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate> {
    const path = `/api/v1/namespaces/${params.path.namespace}/podtemplates/${params.path.name}`;
    return await this.patch<PodTemplate>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedReplicationController(params: ListCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationControllerList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers`;
    return await this.get<ReplicationControllerList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedReplicationController(params: CreateCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers`;
    return await this.post<ReplicationController>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedReplicationController(params: DeleteCoreV1CollectionNamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedReplicationController(params: ReadCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}`;
    return await this.get<ReplicationController>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedReplicationController(params: ReplaceCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}`;
    return await this.put<ReplicationController>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedReplicationController(params: DeleteCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedReplicationController(params: PatchCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}`;
    return await this.patch<ReplicationController>(path, params.query, params.body, opts);
  }
  async readCoreV1NamespacedReplicationControllerScale(params: ReadCoreV1NamespacedReplicationControllerScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}/scale`;
    return await this.get<Scale>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedReplicationControllerScale(params: ReplaceCoreV1NamespacedReplicationControllerScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}/scale`;
    return await this.put<Scale>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespacedReplicationControllerScale(params: PatchCoreV1NamespacedReplicationControllerScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}/scale`;
    return await this.patch<Scale>(path, params.query, params.body, opts);
  }
  async readCoreV1NamespacedReplicationControllerStatus(params: ReadCoreV1NamespacedReplicationControllerStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}/status`;
    return await this.get<ReplicationController>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedReplicationControllerStatus(params: ReplaceCoreV1NamespacedReplicationControllerStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}/status`;
    return await this.put<ReplicationController>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespacedReplicationControllerStatus(params: PatchCoreV1NamespacedReplicationControllerStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicationController> {
    const path = `/api/v1/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}/status`;
    return await this.patch<ReplicationController>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedResourceQuota(params: ListCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuotaList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas`;
    return await this.get<ResourceQuotaList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedResourceQuota(params: CreateCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas`;
    return await this.post<ResourceQuota>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedResourceQuota(params: DeleteCoreV1CollectionNamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedResourceQuota(params: ReadCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}`;
    return await this.get<ResourceQuota>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedResourceQuota(params: ReplaceCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}`;
    return await this.put<ResourceQuota>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedResourceQuota(params: DeleteCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}`;
    return await this.delete<ResourceQuota>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedResourceQuota(params: PatchCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}`;
    return await this.patch<ResourceQuota>(path, params.query, params.body, opts);
  }
  async readCoreV1NamespacedResourceQuotaStatus(params: ReadCoreV1NamespacedResourceQuotaStatusRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}/status`;
    return await this.get<ResourceQuota>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedResourceQuotaStatus(params: ReplaceCoreV1NamespacedResourceQuotaStatusRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}/status`;
    return await this.put<ResourceQuota>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespacedResourceQuotaStatus(params: PatchCoreV1NamespacedResourceQuotaStatusRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota> {
    const path = `/api/v1/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}/status`;
    return await this.patch<ResourceQuota>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedSecret(params: ListCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<SecretList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets`;
    return await this.get<SecretList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedSecret(params: CreateCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets`;
    return await this.post<Secret>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedSecret(params: DeleteCoreV1CollectionNamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedSecret(params: ReadCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets/${params.path.name}`;
    return await this.get<Secret>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedSecret(params: ReplaceCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets/${params.path.name}`;
    return await this.put<Secret>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedSecret(params: DeleteCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedSecret(params: PatchCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret> {
    const path = `/api/v1/namespaces/${params.path.namespace}/secrets/${params.path.name}`;
    return await this.patch<Secret>(path, params.query, params.body, opts);
  }
  async listCoreV1NamespacedServiceAccount(params: ListCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccountList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts`;
    return await this.get<ServiceAccountList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedServiceAccount(params: CreateCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts`;
    return await this.post<ServiceAccount>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNamespacedServiceAccount(params: DeleteCoreV1CollectionNamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1NamespacedServiceAccount(params: ReadCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts/${params.path.name}`;
    return await this.get<ServiceAccount>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedServiceAccount(params: ReplaceCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts/${params.path.name}`;
    return await this.put<ServiceAccount>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedServiceAccount(params: DeleteCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts/${params.path.name}`;
    return await this.delete<ServiceAccount>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedServiceAccount(params: PatchCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts/${params.path.name}`;
    return await this.patch<ServiceAccount>(path, params.query, params.body, opts);
  }
  async createCoreV1NamespacedServiceAccountToken(params: CreateCoreV1NamespacedServiceAccountTokenRequest, opts?: APIClientRequestOpts): Promise<TokenRequest> {
    const path = `/api/v1/namespaces/${params.path.namespace}/serviceaccounts/${params.path.name}/token`;
    return await this.post<TokenRequest>(path, null, params.body, opts);
  }
  async listCoreV1NamespacedService(params: ListCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<ServiceList> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services`;
    return await this.get<ServiceList>(path, params.query, null, opts);
  }
  async createCoreV1NamespacedService(params: CreateCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services`;
    return await this.post<Service>(path, params.query, params.body, opts);
  }
  async readCoreV1NamespacedService(params: ReadCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}`;
    return await this.get<Service>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedService(params: ReplaceCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}`;
    return await this.put<Service>(path, params.query, params.body, opts);
  }
  async deleteCoreV1NamespacedService(params: DeleteCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1NamespacedService(params: PatchCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}`;
    return await this.patch<Service>(path, params.query, params.body, opts);
  }
  async connectCoreV1GetNamespacedServiceProxy(params: ConnectCoreV1GetNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedServiceProxy(params: ConnectCoreV1PostNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1PutNamespacedServiceProxy(params: ConnectCoreV1PutNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy`;
    return await this.put<string>(path, null, null, opts);
  }
  async connectCoreV1DeleteNamespacedServiceProxy(params: ConnectCoreV1DeleteNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy`;
    return await this.delete<string>(path, null, null, opts);
  }
  async connectCoreV1PatchNamespacedServiceProxy(params: ConnectCoreV1PatchNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy`;
    return await this.patch<string>(path, null, null, opts);
  }
  async connectCoreV1GetNamespacedServiceProxyWithPath(params: ConnectCoreV1GetNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy/${params.path.path}`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNamespacedServiceProxyWithPath(params: ConnectCoreV1PostNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy/${params.path.path}`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1PutNamespacedServiceProxyWithPath(params: ConnectCoreV1PutNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy/${params.path.path}`;
    return await this.put<string>(path, null, null, opts);
  }
  async connectCoreV1DeleteNamespacedServiceProxyWithPath(params: ConnectCoreV1DeleteNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy/${params.path.path}`;
    return await this.delete<string>(path, null, null, opts);
  }
  async connectCoreV1PatchNamespacedServiceProxyWithPath(params: ConnectCoreV1PatchNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/proxy/${params.path.path}`;
    return await this.patch<string>(path, null, null, opts);
  }
  async readCoreV1NamespacedServiceStatus(params: ReadCoreV1NamespacedServiceStatusRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/status`;
    return await this.get<Service>(path, null, null, opts);
  }
  async replaceCoreV1NamespacedServiceStatus(params: ReplaceCoreV1NamespacedServiceStatusRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/status`;
    return await this.put<Service>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespacedServiceStatus(params: PatchCoreV1NamespacedServiceStatusRequest, opts?: APIClientRequestOpts): Promise<Service> {
    const path = `/api/v1/namespaces/${params.path.namespace}/services/${params.path.name}/status`;
    return await this.patch<Service>(path, params.query, params.body, opts);
  }
  async readCoreV1Namespace(params: ReadCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}`;
    return await this.get<Namespace>(path, null, null, opts);
  }
  async replaceCoreV1Namespace(params: ReplaceCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}`;
    return await this.put<Namespace>(path, params.query, params.body, opts);
  }
  async deleteCoreV1Namespace(params: DeleteCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/namespaces/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1Namespace(params: PatchCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}`;
    return await this.patch<Namespace>(path, params.query, params.body, opts);
  }
  async replaceCoreV1NamespaceFinalize(params: ReplaceCoreV1NamespaceFinalizeRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}/finalize`;
    return await this.put<Namespace>(path, null, params.body, opts);
  }
  async readCoreV1NamespaceStatus(params: ReadCoreV1NamespaceStatusRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}/status`;
    return await this.get<Namespace>(path, null, null, opts);
  }
  async replaceCoreV1NamespaceStatus(params: ReplaceCoreV1NamespaceStatusRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}/status`;
    return await this.put<Namespace>(path, params.query, params.body, opts);
  }
  async patchCoreV1NamespaceStatus(params: PatchCoreV1NamespaceStatusRequest, opts?: APIClientRequestOpts): Promise<Namespace> {
    const path = `/api/v1/namespaces/${params.path.name}/status`;
    return await this.patch<Namespace>(path, params.query, params.body, opts);
  }
  async listCoreV1Node(params: ListCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<NodeList> {
    const path = `/api/v1/nodes`;
    return await this.get<NodeList>(path, params.query, null, opts);
  }
  async createCoreV1Node(params: CreateCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes`;
    return await this.post<Node>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionNode(params: DeleteCoreV1CollectionNodeRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/nodes`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1Node(params: ReadCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes/${params.path.name}`;
    return await this.get<Node>(path, null, null, opts);
  }
  async replaceCoreV1Node(params: ReplaceCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes/${params.path.name}`;
    return await this.put<Node>(path, params.query, params.body, opts);
  }
  async deleteCoreV1Node(params: DeleteCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/nodes/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoreV1Node(params: PatchCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes/${params.path.name}`;
    return await this.patch<Node>(path, params.query, params.body, opts);
  }
  async connectCoreV1GetNodeProxy(params: ConnectCoreV1GetNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNodeProxy(params: ConnectCoreV1PostNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1PutNodeProxy(params: ConnectCoreV1PutNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy`;
    return await this.put<string>(path, null, null, opts);
  }
  async connectCoreV1DeleteNodeProxy(params: ConnectCoreV1DeleteNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy`;
    return await this.delete<string>(path, null, null, opts);
  }
  async connectCoreV1PatchNodeProxy(params: ConnectCoreV1PatchNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy`;
    return await this.patch<string>(path, null, null, opts);
  }
  async connectCoreV1GetNodeProxyWithPath(params: ConnectCoreV1GetNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy/${params.path.path}`;
    return await this.get<string>(path, null, null, opts);
  }
  async connectCoreV1PostNodeProxyWithPath(params: ConnectCoreV1PostNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy/${params.path.path}`;
    return await this.post<string>(path, null, null, opts);
  }
  async connectCoreV1PutNodeProxyWithPath(params: ConnectCoreV1PutNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy/${params.path.path}`;
    return await this.put<string>(path, null, null, opts);
  }
  async connectCoreV1DeleteNodeProxyWithPath(params: ConnectCoreV1DeleteNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy/${params.path.path}`;
    return await this.delete<string>(path, null, null, opts);
  }
  async connectCoreV1PatchNodeProxyWithPath(params: ConnectCoreV1PatchNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/api/v1/nodes/${params.path.name}/proxy/${params.path.path}`;
    return await this.patch<string>(path, null, null, opts);
  }
  async readCoreV1NodeStatus(params: ReadCoreV1NodeStatusRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes/${params.path.name}/status`;
    return await this.get<Node>(path, null, null, opts);
  }
  async replaceCoreV1NodeStatus(params: ReplaceCoreV1NodeStatusRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes/${params.path.name}/status`;
    return await this.put<Node>(path, params.query, params.body, opts);
  }
  async patchCoreV1NodeStatus(params: PatchCoreV1NodeStatusRequest, opts?: APIClientRequestOpts): Promise<Node> {
    const path = `/api/v1/nodes/${params.path.name}/status`;
    return await this.patch<Node>(path, params.query, params.body, opts);
  }
  async listCoreV1PersistentVolumeClaimForAllNamespaces(params: ListCoreV1PersistentVolumeClaimForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaimList> {
    const path = `/api/v1/persistentvolumeclaims`;
    return await this.get<PersistentVolumeClaimList>(path, null, null, opts);
  }
  async listCoreV1PersistentVolume(params: ListCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeList> {
    const path = `/api/v1/persistentvolumes`;
    return await this.get<PersistentVolumeList>(path, params.query, null, opts);
  }
  async createCoreV1PersistentVolume(params: CreateCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes`;
    return await this.post<PersistentVolume>(path, params.query, params.body, opts);
  }
  async deleteCoreV1CollectionPersistentVolume(params: DeleteCoreV1CollectionPersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/api/v1/persistentvolumes`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoreV1PersistentVolume(params: ReadCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}`;
    return await this.get<PersistentVolume>(path, null, null, opts);
  }
  async replaceCoreV1PersistentVolume(params: ReplaceCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}`;
    return await this.put<PersistentVolume>(path, params.query, params.body, opts);
  }
  async deleteCoreV1PersistentVolume(params: DeleteCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}`;
    return await this.delete<PersistentVolume>(path, params.query, null, opts);
  }
  async patchCoreV1PersistentVolume(params: PatchCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}`;
    return await this.patch<PersistentVolume>(path, params.query, params.body, opts);
  }
  async readCoreV1PersistentVolumeStatus(params: ReadCoreV1PersistentVolumeStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}/status`;
    return await this.get<PersistentVolume>(path, null, null, opts);
  }
  async replaceCoreV1PersistentVolumeStatus(params: ReplaceCoreV1PersistentVolumeStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}/status`;
    return await this.put<PersistentVolume>(path, params.query, params.body, opts);
  }
  async patchCoreV1PersistentVolumeStatus(params: PatchCoreV1PersistentVolumeStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume> {
    const path = `/api/v1/persistentvolumes/${params.path.name}/status`;
    return await this.patch<PersistentVolume>(path, params.query, params.body, opts);
  }
  async getPods(params: ListCoreV1PodForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodList> {
    const path = `/api/v1/pods`;
    return await this.get<PodList>(path, null, null, opts);
  }
  async listPods(params: ListCoreV1PodForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodList> {
    const path = `/api/v1/pods`;
    return await this.get<PodList>(path, null, null, opts);
  }
  async listCoreV1PodTemplateForAllNamespaces(params: ListCoreV1PodTemplateForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodTemplateList> {
    const path = `/api/v1/podtemplates`;
    return await this.get<PodTemplateList>(path, null, null, opts);
  }
  async listCoreV1ReplicationControllerForAllNamespaces(params: ListCoreV1ReplicationControllerForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ReplicationControllerList> {
    const path = `/api/v1/replicationcontrollers`;
    return await this.get<ReplicationControllerList>(path, null, null, opts);
  }
  async listCoreV1ResourceQuotaForAllNamespaces(params: ListCoreV1ResourceQuotaForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ResourceQuotaList> {
    const path = `/api/v1/resourcequotas`;
    return await this.get<ResourceQuotaList>(path, null, null, opts);
  }
  async listCoreV1SecretForAllNamespaces(params: ListCoreV1SecretForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<SecretList> {
    const path = `/api/v1/secrets`;
    return await this.get<SecretList>(path, null, null, opts);
  }
  async listCoreV1ServiceAccountForAllNamespaces(params: ListCoreV1ServiceAccountForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ServiceAccountList> {
    const path = `/api/v1/serviceaccounts`;
    return await this.get<ServiceAccountList>(path, null, null, opts);
  }
  async listCoreV1ServiceForAllNamespaces(params: ListCoreV1ServiceForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ServiceList> {
    const path = `/api/v1/services`;
    return await this.get<ServiceList>(path, null, null, opts);
  }
  async watchCoreV1ConfigMapListForAllNamespaces(params: WatchCoreV1ConfigMapListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/configmaps`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1EndpointsListForAllNamespaces(params: WatchCoreV1EndpointsListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/endpoints`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1EventListForAllNamespaces(params: WatchCoreV1EventListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/events`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1LimitRangeListForAllNamespaces(params: WatchCoreV1LimitRangeListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/limitranges`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespaceList(params: WatchCoreV1NamespaceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedConfigMapList(params: WatchCoreV1NamespacedConfigMapListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/configmaps`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedConfigMap(params: WatchCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/configmaps/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedEndpointsList(params: WatchCoreV1NamespacedEndpointsListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/endpoints`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedEndpoints(params: WatchCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/endpoints/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedEventList(params: WatchCoreV1NamespacedEventListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/events`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedEvent(params: WatchCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedLimitRangeList(params: WatchCoreV1NamespacedLimitRangeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/limitranges`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedLimitRange(params: WatchCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/limitranges/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedPersistentVolumeClaimList(params: WatchCoreV1NamespacedPersistentVolumeClaimListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/persistentvolumeclaims`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedPersistentVolumeClaim(params: WatchCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/persistentvolumeclaims/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedPodList(params: WatchCoreV1NamespacedPodListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/pods`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedPod(params: WatchCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/pods/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedPodTemplateList(params: WatchCoreV1NamespacedPodTemplateListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/podtemplates`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedPodTemplate(params: WatchCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/podtemplates/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedReplicationControllerList(params: WatchCoreV1NamespacedReplicationControllerListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/replicationcontrollers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedReplicationController(params: WatchCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/replicationcontrollers/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedResourceQuotaList(params: WatchCoreV1NamespacedResourceQuotaListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/resourcequotas`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedResourceQuota(params: WatchCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/resourcequotas/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedSecretList(params: WatchCoreV1NamespacedSecretListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/secrets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedSecret(params: WatchCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/secrets/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedServiceAccountList(params: WatchCoreV1NamespacedServiceAccountListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/serviceaccounts`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedServiceAccount(params: WatchCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/serviceaccounts/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedServiceList(params: WatchCoreV1NamespacedServiceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/services`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NamespacedService(params: WatchCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.namespace}/services/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1Namespace(params: WatchCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/namespaces/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1NodeList(params: WatchCoreV1NodeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/nodes`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1Node(params: WatchCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/nodes/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1PersistentVolumeClaimListForAllNamespaces(params: WatchCoreV1PersistentVolumeClaimListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/persistentvolumeclaims`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1PersistentVolumeList(params: WatchCoreV1PersistentVolumeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/persistentvolumes`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1PersistentVolume(params: WatchCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/persistentvolumes/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1PodListForAllNamespaces(params: WatchCoreV1PodListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/pods`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1PodTemplateListForAllNamespaces(params: WatchCoreV1PodTemplateListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/podtemplates`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1ReplicationControllerListForAllNamespaces(params: WatchCoreV1ReplicationControllerListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/replicationcontrollers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1ResourceQuotaListForAllNamespaces(params: WatchCoreV1ResourceQuotaListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/resourcequotas`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1SecretListForAllNamespaces(params: WatchCoreV1SecretListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/secrets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1ServiceAccountListForAllNamespaces(params: WatchCoreV1ServiceAccountListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/serviceaccounts`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoreV1ServiceListForAllNamespaces(params: WatchCoreV1ServiceListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/api/v1/watch/services`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getAPIVersions(params: GetAPIVersionsRequest, opts?: APIClientRequestOpts): Promise<APIGroupList> {
    const path = `/apis/`;
    return await this.get<APIGroupList>(path, null, null, opts);
  }
  async getAdmissionregistrationAPIGroup(params: GetAdmissionregistrationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/admissionregistration.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getAdmissionregistrationV1APIResources(params: GetAdmissionregistrationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/admissionregistration.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listAdmissionregistrationV1MutatingWebhookConfiguration(params: ListAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfigurationList> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations`;
    return await this.get<MutatingWebhookConfigurationList>(path, params.query, null, opts);
  }
  async createAdmissionregistrationV1MutatingWebhookConfiguration(params: CreateAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations`;
    return await this.post<MutatingWebhookConfiguration>(path, params.query, params.body, opts);
  }
  async deleteAdmissionregistrationV1CollectionMutatingWebhookConfiguration(params: DeleteAdmissionregistrationV1CollectionMutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAdmissionregistrationV1MutatingWebhookConfiguration(params: ReadAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/${params.path.name}`;
    return await this.get<MutatingWebhookConfiguration>(path, null, null, opts);
  }
  async replaceAdmissionregistrationV1MutatingWebhookConfiguration(params: ReplaceAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/${params.path.name}`;
    return await this.put<MutatingWebhookConfiguration>(path, params.query, params.body, opts);
  }
  async deleteAdmissionregistrationV1MutatingWebhookConfiguration(params: DeleteAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAdmissionregistrationV1MutatingWebhookConfiguration(params: PatchAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/${params.path.name}`;
    return await this.patch<MutatingWebhookConfiguration>(path, params.query, params.body, opts);
  }
  async listAdmissionregistrationV1ValidatingWebhookConfiguration(params: ListAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfigurationList> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations`;
    return await this.get<ValidatingWebhookConfigurationList>(path, params.query, null, opts);
  }
  async createAdmissionregistrationV1ValidatingWebhookConfiguration(params: CreateAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations`;
    return await this.post<ValidatingWebhookConfiguration>(path, params.query, params.body, opts);
  }
  async deleteAdmissionregistrationV1CollectionValidatingWebhookConfiguration(params: DeleteAdmissionregistrationV1CollectionValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAdmissionregistrationV1ValidatingWebhookConfiguration(params: ReadAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/${params.path.name}`;
    return await this.get<ValidatingWebhookConfiguration>(path, null, null, opts);
  }
  async replaceAdmissionregistrationV1ValidatingWebhookConfiguration(params: ReplaceAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/${params.path.name}`;
    return await this.put<ValidatingWebhookConfiguration>(path, params.query, params.body, opts);
  }
  async deleteAdmissionregistrationV1ValidatingWebhookConfiguration(params: DeleteAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAdmissionregistrationV1ValidatingWebhookConfiguration(params: PatchAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration> {
    const path = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/${params.path.name}`;
    return await this.patch<ValidatingWebhookConfiguration>(path, params.query, params.body, opts);
  }
  async watchAdmissionregistrationV1MutatingWebhookConfigurationList(params: WatchAdmissionregistrationV1MutatingWebhookConfigurationListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/admissionregistration.k8s.io/v1/watch/mutatingwebhookconfigurations`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAdmissionregistrationV1MutatingWebhookConfiguration(params: WatchAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/admissionregistration.k8s.io/v1/watch/mutatingwebhookconfigurations/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAdmissionregistrationV1ValidatingWebhookConfigurationList(params: WatchAdmissionregistrationV1ValidatingWebhookConfigurationListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/admissionregistration.k8s.io/v1/watch/validatingwebhookconfigurations`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAdmissionregistrationV1ValidatingWebhookConfiguration(params: WatchAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/admissionregistration.k8s.io/v1/watch/validatingwebhookconfigurations/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getApiextensionsAPIGroup(params: GetApiextensionsAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/apiextensions.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getApiextensionsV1APIResources(params: GetApiextensionsV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/apiextensions.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listApiextensionsV1CustomResourceDefinition(params: ListApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinitionList> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions`;
    return await this.get<CustomResourceDefinitionList>(path, params.query, null, opts);
  }
  async createApiextensionsV1CustomResourceDefinition(params: CreateApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions`;
    return await this.post<CustomResourceDefinition>(path, params.query, params.body, opts);
  }
  async deleteApiextensionsV1CollectionCustomResourceDefinition(params: DeleteApiextensionsV1CollectionCustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readApiextensionsV1CustomResourceDefinition(params: ReadApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}`;
    return await this.get<CustomResourceDefinition>(path, null, null, opts);
  }
  async replaceApiextensionsV1CustomResourceDefinition(params: ReplaceApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}`;
    return await this.put<CustomResourceDefinition>(path, params.query, params.body, opts);
  }
  async deleteApiextensionsV1CustomResourceDefinition(params: DeleteApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchApiextensionsV1CustomResourceDefinition(params: PatchApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}`;
    return await this.patch<CustomResourceDefinition>(path, params.query, params.body, opts);
  }
  async readApiextensionsV1CustomResourceDefinitionStatus(params: ReadApiextensionsV1CustomResourceDefinitionStatusRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}/status`;
    return await this.get<CustomResourceDefinition>(path, null, null, opts);
  }
  async replaceApiextensionsV1CustomResourceDefinitionStatus(params: ReplaceApiextensionsV1CustomResourceDefinitionStatusRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}/status`;
    return await this.put<CustomResourceDefinition>(path, params.query, params.body, opts);
  }
  async patchApiextensionsV1CustomResourceDefinitionStatus(params: PatchApiextensionsV1CustomResourceDefinitionStatusRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition> {
    const path = `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${params.path.name}/status`;
    return await this.patch<CustomResourceDefinition>(path, params.query, params.body, opts);
  }
  async watchApiextensionsV1CustomResourceDefinitionList(params: WatchApiextensionsV1CustomResourceDefinitionListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apiextensions.k8s.io/v1/watch/customresourcedefinitions`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchApiextensionsV1CustomResourceDefinition(params: WatchApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apiextensions.k8s.io/v1/watch/customresourcedefinitions/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getApiregistrationAPIGroup(params: GetApiregistrationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/apiregistration.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getApiregistrationV1APIResources(params: GetApiregistrationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/apiregistration.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listApiregistrationV1APIService(params: ListApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIServiceList> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices`;
    return await this.get<APIServiceList>(path, params.query, null, opts);
  }
  async createApiregistrationV1APIService(params: CreateApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices`;
    return await this.post<APIService>(path, params.query, params.body, opts);
  }
  async deleteApiregistrationV1CollectionAPIService(params: DeleteApiregistrationV1CollectionAPIServiceRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readApiregistrationV1APIService(params: ReadApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}`;
    return await this.get<APIService>(path, null, null, opts);
  }
  async replaceApiregistrationV1APIService(params: ReplaceApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}`;
    return await this.put<APIService>(path, params.query, params.body, opts);
  }
  async deleteApiregistrationV1APIService(params: DeleteApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchApiregistrationV1APIService(params: PatchApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}`;
    return await this.patch<APIService>(path, params.query, params.body, opts);
  }
  async readApiregistrationV1APIServiceStatus(params: ReadApiregistrationV1APIServiceStatusRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}/status`;
    return await this.get<APIService>(path, null, null, opts);
  }
  async replaceApiregistrationV1APIServiceStatus(params: ReplaceApiregistrationV1APIServiceStatusRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}/status`;
    return await this.put<APIService>(path, params.query, params.body, opts);
  }
  async patchApiregistrationV1APIServiceStatus(params: PatchApiregistrationV1APIServiceStatusRequest, opts?: APIClientRequestOpts): Promise<APIService> {
    const path = `/apis/apiregistration.k8s.io/v1/apiservices/${params.path.name}/status`;
    return await this.patch<APIService>(path, params.query, params.body, opts);
  }
  async watchApiregistrationV1APIServiceList(params: WatchApiregistrationV1APIServiceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apiregistration.k8s.io/v1/watch/apiservices`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchApiregistrationV1APIService(params: WatchApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apiregistration.k8s.io/v1/watch/apiservices/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getAppsAPIGroup(params: GetAppsAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/apps/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getAppsV1APIResources(params: GetAppsV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/apps/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listAppsV1ControllerRevisionForAllNamespaces(params: ListAppsV1ControllerRevisionForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ControllerRevisionList> {
    const path = `/apis/apps/v1/controllerrevisions`;
    return await this.get<ControllerRevisionList>(path, null, null, opts);
  }
  async listAppsV1DaemonSetForAllNamespaces(params: ListAppsV1DaemonSetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<DaemonSetList> {
    const path = `/apis/apps/v1/daemonsets`;
    return await this.get<DaemonSetList>(path, null, null, opts);
  }
  async listAppsV1DeploymentForAllNamespaces(params: ListAppsV1DeploymentForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<DeploymentList> {
    const path = `/apis/apps/v1/deployments`;
    return await this.get<DeploymentList>(path, null, null, opts);
  }
  async listAppsV1NamespacedControllerRevision(params: ListAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevisionList> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions`;
    return await this.get<ControllerRevisionList>(path, params.query, null, opts);
  }
  async createAppsV1NamespacedControllerRevision(params: CreateAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions`;
    return await this.post<ControllerRevision>(path, params.query, params.body, opts);
  }
  async deleteAppsV1CollectionNamespacedControllerRevision(params: DeleteAppsV1CollectionNamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAppsV1NamespacedControllerRevision(params: ReadAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions/${params.path.name}`;
    return await this.get<ControllerRevision>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedControllerRevision(params: ReplaceAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions/${params.path.name}`;
    return await this.put<ControllerRevision>(path, params.query, params.body, opts);
  }
  async deleteAppsV1NamespacedControllerRevision(params: DeleteAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAppsV1NamespacedControllerRevision(params: PatchAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/controllerrevisions/${params.path.name}`;
    return await this.patch<ControllerRevision>(path, params.query, params.body, opts);
  }
  async listAppsV1NamespacedDaemonSet(params: ListAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSetList> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets`;
    return await this.get<DaemonSetList>(path, params.query, null, opts);
  }
  async createAppsV1NamespacedDaemonSet(params: CreateAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets`;
    return await this.post<DaemonSet>(path, params.query, params.body, opts);
  }
  async deleteAppsV1CollectionNamespacedDaemonSet(params: DeleteAppsV1CollectionNamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAppsV1NamespacedDaemonSet(params: ReadAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}`;
    return await this.get<DaemonSet>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedDaemonSet(params: ReplaceAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}`;
    return await this.put<DaemonSet>(path, params.query, params.body, opts);
  }
  async deleteAppsV1NamespacedDaemonSet(params: DeleteAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAppsV1NamespacedDaemonSet(params: PatchAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}`;
    return await this.patch<DaemonSet>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedDaemonSetStatus(params: ReadAppsV1NamespacedDaemonSetStatusRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}/status`;
    return await this.get<DaemonSet>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedDaemonSetStatus(params: ReplaceAppsV1NamespacedDaemonSetStatusRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}/status`;
    return await this.put<DaemonSet>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedDaemonSetStatus(params: PatchAppsV1NamespacedDaemonSetStatusRequest, opts?: APIClientRequestOpts): Promise<DaemonSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/daemonsets/${params.path.name}/status`;
    return await this.patch<DaemonSet>(path, params.query, params.body, opts);
  }
  async listAppsV1NamespacedDeployment(params: ListAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<DeploymentList> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments`;
    return await this.get<DeploymentList>(path, params.query, null, opts);
  }
  async createAppsV1NamespacedDeployment(params: CreateAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments`;
    return await this.post<Deployment>(path, params.query, params.body, opts);
  }
  async deleteAppsV1CollectionNamespacedDeployment(params: DeleteAppsV1CollectionNamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAppsV1NamespacedDeployment(params: ReadAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}`;
    return await this.get<Deployment>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedDeployment(params: ReplaceAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}`;
    return await this.put<Deployment>(path, params.query, params.body, opts);
  }
  async deleteAppsV1NamespacedDeployment(params: DeleteAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAppsV1NamespacedDeployment(params: PatchAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}`;
    return await this.patch<Deployment>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedDeploymentScale(params: ReadAppsV1NamespacedDeploymentScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}/scale`;
    return await this.get<Scale>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedDeploymentScale(params: ReplaceAppsV1NamespacedDeploymentScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}/scale`;
    return await this.put<Scale>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedDeploymentScale(params: PatchAppsV1NamespacedDeploymentScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}/scale`;
    return await this.patch<Scale>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedDeploymentStatus(params: ReadAppsV1NamespacedDeploymentStatusRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}/status`;
    return await this.get<Deployment>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedDeploymentStatus(params: ReplaceAppsV1NamespacedDeploymentStatusRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}/status`;
    return await this.put<Deployment>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedDeploymentStatus(params: PatchAppsV1NamespacedDeploymentStatusRequest, opts?: APIClientRequestOpts): Promise<Deployment> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/deployments/${params.path.name}/status`;
    return await this.patch<Deployment>(path, params.query, params.body, opts);
  }
  async listAppsV1NamespacedReplicaSet(params: ListAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSetList> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets`;
    return await this.get<ReplicaSetList>(path, params.query, null, opts);
  }
  async createAppsV1NamespacedReplicaSet(params: CreateAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets`;
    return await this.post<ReplicaSet>(path, params.query, params.body, opts);
  }
  async deleteAppsV1CollectionNamespacedReplicaSet(params: DeleteAppsV1CollectionNamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAppsV1NamespacedReplicaSet(params: ReadAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}`;
    return await this.get<ReplicaSet>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedReplicaSet(params: ReplaceAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}`;
    return await this.put<ReplicaSet>(path, params.query, params.body, opts);
  }
  async deleteAppsV1NamespacedReplicaSet(params: DeleteAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAppsV1NamespacedReplicaSet(params: PatchAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}`;
    return await this.patch<ReplicaSet>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedReplicaSetScale(params: ReadAppsV1NamespacedReplicaSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}/scale`;
    return await this.get<Scale>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedReplicaSetScale(params: ReplaceAppsV1NamespacedReplicaSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}/scale`;
    return await this.put<Scale>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedReplicaSetScale(params: PatchAppsV1NamespacedReplicaSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}/scale`;
    return await this.patch<Scale>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedReplicaSetStatus(params: ReadAppsV1NamespacedReplicaSetStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}/status`;
    return await this.get<ReplicaSet>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedReplicaSetStatus(params: ReplaceAppsV1NamespacedReplicaSetStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}/status`;
    return await this.put<ReplicaSet>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedReplicaSetStatus(params: PatchAppsV1NamespacedReplicaSetStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/replicasets/${params.path.name}/status`;
    return await this.patch<ReplicaSet>(path, params.query, params.body, opts);
  }
  async listAppsV1NamespacedStatefulSet(params: ListAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSetList> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets`;
    return await this.get<StatefulSetList>(path, params.query, null, opts);
  }
  async createAppsV1NamespacedStatefulSet(params: CreateAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets`;
    return await this.post<StatefulSet>(path, params.query, params.body, opts);
  }
  async deleteAppsV1CollectionNamespacedStatefulSet(params: DeleteAppsV1CollectionNamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAppsV1NamespacedStatefulSet(params: ReadAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}`;
    return await this.get<StatefulSet>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedStatefulSet(params: ReplaceAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}`;
    return await this.put<StatefulSet>(path, params.query, params.body, opts);
  }
  async deleteAppsV1NamespacedStatefulSet(params: DeleteAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAppsV1NamespacedStatefulSet(params: PatchAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}`;
    return await this.patch<StatefulSet>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedStatefulSetScale(params: ReadAppsV1NamespacedStatefulSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}/scale`;
    return await this.get<Scale>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedStatefulSetScale(params: ReplaceAppsV1NamespacedStatefulSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}/scale`;
    return await this.put<Scale>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedStatefulSetScale(params: PatchAppsV1NamespacedStatefulSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}/scale`;
    return await this.patch<Scale>(path, params.query, params.body, opts);
  }
  async readAppsV1NamespacedStatefulSetStatus(params: ReadAppsV1NamespacedStatefulSetStatusRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}/status`;
    return await this.get<StatefulSet>(path, null, null, opts);
  }
  async replaceAppsV1NamespacedStatefulSetStatus(params: ReplaceAppsV1NamespacedStatefulSetStatusRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}/status`;
    return await this.put<StatefulSet>(path, params.query, params.body, opts);
  }
  async patchAppsV1NamespacedStatefulSetStatus(params: PatchAppsV1NamespacedStatefulSetStatusRequest, opts?: APIClientRequestOpts): Promise<StatefulSet> {
    const path = `/apis/apps/v1/namespaces/${params.path.namespace}/statefulsets/${params.path.name}/status`;
    return await this.patch<StatefulSet>(path, params.query, params.body, opts);
  }
  async listAppsV1ReplicaSetForAllNamespaces(params: ListAppsV1ReplicaSetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ReplicaSetList> {
    const path = `/apis/apps/v1/replicasets`;
    return await this.get<ReplicaSetList>(path, null, null, opts);
  }
  async listAppsV1StatefulSetForAllNamespaces(params: ListAppsV1StatefulSetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<StatefulSetList> {
    const path = `/apis/apps/v1/statefulsets`;
    return await this.get<StatefulSetList>(path, null, null, opts);
  }
  async watchAppsV1ControllerRevisionListForAllNamespaces(params: WatchAppsV1ControllerRevisionListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/controllerrevisions`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1DaemonSetListForAllNamespaces(params: WatchAppsV1DaemonSetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/daemonsets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1DeploymentListForAllNamespaces(params: WatchAppsV1DeploymentListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/deployments`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedControllerRevisionList(params: WatchAppsV1NamespacedControllerRevisionListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/controllerrevisions`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedControllerRevision(params: WatchAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/controllerrevisions/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedDaemonSetList(params: WatchAppsV1NamespacedDaemonSetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/daemonsets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedDaemonSet(params: WatchAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/daemonsets/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedDeploymentList(params: WatchAppsV1NamespacedDeploymentListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/deployments`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedDeployment(params: WatchAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/deployments/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedReplicaSetList(params: WatchAppsV1NamespacedReplicaSetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/replicasets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedReplicaSet(params: WatchAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/replicasets/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedStatefulSetList(params: WatchAppsV1NamespacedStatefulSetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/statefulsets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1NamespacedStatefulSet(params: WatchAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/namespaces/${params.path.namespace}/statefulsets/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1ReplicaSetListForAllNamespaces(params: WatchAppsV1ReplicaSetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/replicasets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAppsV1StatefulSetListForAllNamespaces(params: WatchAppsV1StatefulSetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/apps/v1/watch/statefulsets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getAuthenticationAPIGroup(params: GetAuthenticationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/authentication.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getAuthenticationV1APIResources(params: GetAuthenticationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/authentication.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async createAuthenticationV1TokenReview(params: CreateAuthenticationV1TokenReviewRequest, opts?: APIClientRequestOpts): Promise<TokenReview> {
    const path = `/apis/authentication.k8s.io/v1/tokenreviews`;
    return await this.post<TokenReview>(path, null, params.body, opts);
  }
  async getAuthorizationAPIGroup(params: GetAuthorizationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/authorization.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getAuthorizationV1APIResources(params: GetAuthorizationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/authorization.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async createAuthorizationV1NamespacedLocalSubjectAccessReview(params: CreateAuthorizationV1NamespacedLocalSubjectAccessReviewRequest, opts?: APIClientRequestOpts): Promise<LocalSubjectAccessReview> {
    const path = `/apis/authorization.k8s.io/v1/namespaces/${params.path.namespace}/localsubjectaccessreviews`;
    return await this.post<LocalSubjectAccessReview>(path, null, params.body, opts);
  }
  async createAuthorizationV1SelfSubjectAccessReview(params: CreateAuthorizationV1SelfSubjectAccessReviewRequest, opts?: APIClientRequestOpts): Promise<SelfSubjectAccessReview> {
    const path = `/apis/authorization.k8s.io/v1/selfsubjectaccessreviews`;
    return await this.post<SelfSubjectAccessReview>(path, null, params.body, opts);
  }
  async createAuthorizationV1SelfSubjectRulesReview(params: CreateAuthorizationV1SelfSubjectRulesReviewRequest, opts?: APIClientRequestOpts): Promise<SelfSubjectRulesReview> {
    const path = `/apis/authorization.k8s.io/v1/selfsubjectrulesreviews`;
    return await this.post<SelfSubjectRulesReview>(path, null, params.body, opts);
  }
  async createAuthorizationV1SubjectAccessReview(params: CreateAuthorizationV1SubjectAccessReviewRequest, opts?: APIClientRequestOpts): Promise<SubjectAccessReview> {
    const path = `/apis/authorization.k8s.io/v1/subjectaccessreviews`;
    return await this.post<SubjectAccessReview>(path, null, params.body, opts);
  }
  async getAutoscalingAPIGroup(params: GetAutoscalingAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/autoscaling/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getAutoscalingV1APIResources(params: GetAutoscalingV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/autoscaling/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listAutoscalingV1HorizontalPodAutoscalerForAllNamespaces(params: ListAutoscalingV1HorizontalPodAutoscalerForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList> {
    const path = `/apis/autoscaling/v1/horizontalpodautoscalers`;
    return await this.get<HorizontalPodAutoscalerList>(path, null, null, opts);
  }
  async listAutoscalingV1NamespacedHorizontalPodAutoscaler(params: ListAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.get<HorizontalPodAutoscalerList>(path, params.query, null, opts);
  }
  async createAutoscalingV1NamespacedHorizontalPodAutoscaler(params: CreateAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.post<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async deleteAutoscalingV1CollectionNamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV1CollectionNamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAutoscalingV1NamespacedHorizontalPodAutoscaler(params: ReadAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.get<HorizontalPodAutoscaler>(path, null, null, opts);
  }
  async replaceAutoscalingV1NamespacedHorizontalPodAutoscaler(params: ReplaceAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.put<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async deleteAutoscalingV1NamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAutoscalingV1NamespacedHorizontalPodAutoscaler(params: PatchAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.patch<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async readAutoscalingV1NamespacedHorizontalPodAutoscalerStatus(params: ReadAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}/status`;
    return await this.get<HorizontalPodAutoscaler>(path, null, null, opts);
  }
  async replaceAutoscalingV1NamespacedHorizontalPodAutoscalerStatus(params: ReplaceAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}/status`;
    return await this.put<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async patchAutoscalingV1NamespacedHorizontalPodAutoscalerStatus(params: PatchAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v1/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}/status`;
    return await this.patch<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async watchAutoscalingV1HorizontalPodAutoscalerListForAllNamespaces(params: WatchAutoscalingV1HorizontalPodAutoscalerListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/autoscaling/v1/watch/horizontalpodautoscalers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAutoscalingV1NamespacedHorizontalPodAutoscalerList(params: WatchAutoscalingV1NamespacedHorizontalPodAutoscalerListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/autoscaling/v1/watch/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAutoscalingV1NamespacedHorizontalPodAutoscaler(params: WatchAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/autoscaling/v1/watch/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getAutoscalingV2beta2APIResources(params: GetAutoscalingV2beta2APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/autoscaling/v2beta2/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespaces(params: ListAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList> {
    const path = `/apis/autoscaling/v2beta2/horizontalpodautoscalers`;
    return await this.get<HorizontalPodAutoscalerList>(path, null, null, opts);
  }
  async listAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: ListAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.get<HorizontalPodAutoscalerList>(path, params.query, null, opts);
  }
  async createAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: CreateAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.post<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async deleteAutoscalingV2beta2CollectionNamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV2beta2CollectionNamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: ReadAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.get<HorizontalPodAutoscaler>(path, null, null, opts);
  }
  async replaceAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: ReplaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.put<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async deleteAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: PatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.patch<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async readAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatus(params: ReadAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}/status`;
    return await this.get<HorizontalPodAutoscaler>(path, null, null, opts);
  }
  async replaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatus(params: ReplaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}/status`;
    return await this.put<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async patchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatus(params: PatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler> {
    const path = `/apis/autoscaling/v2beta2/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}/status`;
    return await this.patch<HorizontalPodAutoscaler>(path, params.query, params.body, opts);
  }
  async watchAutoscalingV2beta2HorizontalPodAutoscalerListForAllNamespaces(params: WatchAutoscalingV2beta2HorizontalPodAutoscalerListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/autoscaling/v2beta2/watch/horizontalpodautoscalers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerList(params: WatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/autoscaling/v2beta2/watch/namespaces/${params.path.namespace}/horizontalpodautoscalers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: WatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/autoscaling/v2beta2/watch/namespaces/${params.path.namespace}/horizontalpodautoscalers/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getBatchAPIGroup(params: GetBatchAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/batch/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getBatchV1APIResources(params: GetBatchV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/batch/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listBatchV1CronJobForAllNamespaces(params: ListBatchV1CronJobForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<CronJobList> {
    const path = `/apis/batch/v1/cronjobs`;
    return await this.get<CronJobList>(path, null, null, opts);
  }
  async listBatchV1JobForAllNamespaces(params: ListBatchV1JobForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<JobList> {
    const path = `/apis/batch/v1/jobs`;
    return await this.get<JobList>(path, null, null, opts);
  }
  async listBatchV1NamespacedCronJob(params: ListBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJobList> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs`;
    return await this.get<CronJobList>(path, params.query, null, opts);
  }
  async createBatchV1NamespacedCronJob(params: CreateBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs`;
    return await this.post<CronJob>(path, params.query, params.body, opts);
  }
  async deleteBatchV1CollectionNamespacedCronJob(params: DeleteBatchV1CollectionNamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readBatchV1NamespacedCronJob(params: ReadBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}`;
    return await this.get<CronJob>(path, null, null, opts);
  }
  async replaceBatchV1NamespacedCronJob(params: ReplaceBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}`;
    return await this.put<CronJob>(path, params.query, params.body, opts);
  }
  async deleteBatchV1NamespacedCronJob(params: DeleteBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchBatchV1NamespacedCronJob(params: PatchBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}`;
    return await this.patch<CronJob>(path, params.query, params.body, opts);
  }
  async readBatchV1NamespacedCronJobStatus(params: ReadBatchV1NamespacedCronJobStatusRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}/status`;
    return await this.get<CronJob>(path, null, null, opts);
  }
  async replaceBatchV1NamespacedCronJobStatus(params: ReplaceBatchV1NamespacedCronJobStatusRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}/status`;
    return await this.put<CronJob>(path, params.query, params.body, opts);
  }
  async patchBatchV1NamespacedCronJobStatus(params: PatchBatchV1NamespacedCronJobStatusRequest, opts?: APIClientRequestOpts): Promise<CronJob> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/cronjobs/${params.path.name}/status`;
    return await this.patch<CronJob>(path, params.query, params.body, opts);
  }
  async listBatchV1NamespacedJob(params: ListBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<JobList> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs`;
    return await this.get<JobList>(path, params.query, null, opts);
  }
  async createBatchV1NamespacedJob(params: CreateBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs`;
    return await this.post<Job>(path, params.query, params.body, opts);
  }
  async deleteBatchV1CollectionNamespacedJob(params: DeleteBatchV1CollectionNamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readBatchV1NamespacedJob(params: ReadBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}`;
    return await this.get<Job>(path, null, null, opts);
  }
  async replaceBatchV1NamespacedJob(params: ReplaceBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}`;
    return await this.put<Job>(path, params.query, params.body, opts);
  }
  async deleteBatchV1NamespacedJob(params: DeleteBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchBatchV1NamespacedJob(params: PatchBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}`;
    return await this.patch<Job>(path, params.query, params.body, opts);
  }
  async readBatchV1NamespacedJobStatus(params: ReadBatchV1NamespacedJobStatusRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}/status`;
    return await this.get<Job>(path, null, null, opts);
  }
  async replaceBatchV1NamespacedJobStatus(params: ReplaceBatchV1NamespacedJobStatusRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}/status`;
    return await this.put<Job>(path, params.query, params.body, opts);
  }
  async patchBatchV1NamespacedJobStatus(params: PatchBatchV1NamespacedJobStatusRequest, opts?: APIClientRequestOpts): Promise<Job> {
    const path = `/apis/batch/v1/namespaces/${params.path.namespace}/jobs/${params.path.name}/status`;
    return await this.patch<Job>(path, params.query, params.body, opts);
  }
  async watchBatchV1CronJobListForAllNamespaces(params: WatchBatchV1CronJobListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/batch/v1/watch/cronjobs`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchBatchV1JobListForAllNamespaces(params: WatchBatchV1JobListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/batch/v1/watch/jobs`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchBatchV1NamespacedCronJobList(params: WatchBatchV1NamespacedCronJobListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/batch/v1/watch/namespaces/${params.path.namespace}/cronjobs`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchBatchV1NamespacedCronJob(params: WatchBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/batch/v1/watch/namespaces/${params.path.namespace}/cronjobs/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchBatchV1NamespacedJobList(params: WatchBatchV1NamespacedJobListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/batch/v1/watch/namespaces/${params.path.namespace}/jobs`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchBatchV1NamespacedJob(params: WatchBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/batch/v1/watch/namespaces/${params.path.namespace}/jobs/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getCertificatesAPIGroup(params: GetCertificatesAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/certificates.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getCertificatesV1APIResources(params: GetCertificatesV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/certificates.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listCertificatesV1CertificateSigningRequest(params: ListCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequestList> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests`;
    return await this.get<CertificateSigningRequestList>(path, params.query, null, opts);
  }
  async createCertificatesV1CertificateSigningRequest(params: CreateCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests`;
    return await this.post<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async deleteCertificatesV1CollectionCertificateSigningRequest(params: DeleteCertificatesV1CollectionCertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCertificatesV1CertificateSigningRequest(params: ReadCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}`;
    return await this.get<CertificateSigningRequest>(path, null, null, opts);
  }
  async replaceCertificatesV1CertificateSigningRequest(params: ReplaceCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}`;
    return await this.put<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async deleteCertificatesV1CertificateSigningRequest(params: DeleteCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCertificatesV1CertificateSigningRequest(params: PatchCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}`;
    return await this.patch<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async readCertificatesV1CertificateSigningRequestApproval(params: ReadCertificatesV1CertificateSigningRequestApprovalRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}/approval`;
    return await this.get<CertificateSigningRequest>(path, null, null, opts);
  }
  async replaceCertificatesV1CertificateSigningRequestApproval(params: ReplaceCertificatesV1CertificateSigningRequestApprovalRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}/approval`;
    return await this.put<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async patchCertificatesV1CertificateSigningRequestApproval(params: PatchCertificatesV1CertificateSigningRequestApprovalRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}/approval`;
    return await this.patch<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async readCertificatesV1CertificateSigningRequestStatus(params: ReadCertificatesV1CertificateSigningRequestStatusRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}/status`;
    return await this.get<CertificateSigningRequest>(path, null, null, opts);
  }
  async replaceCertificatesV1CertificateSigningRequestStatus(params: ReplaceCertificatesV1CertificateSigningRequestStatusRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}/status`;
    return await this.put<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async patchCertificatesV1CertificateSigningRequestStatus(params: PatchCertificatesV1CertificateSigningRequestStatusRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest> {
    const path = `/apis/certificates.k8s.io/v1/certificatesigningrequests/${params.path.name}/status`;
    return await this.patch<CertificateSigningRequest>(path, params.query, params.body, opts);
  }
  async watchCertificatesV1CertificateSigningRequestList(params: WatchCertificatesV1CertificateSigningRequestListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/certificates.k8s.io/v1/watch/certificatesigningrequests`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCertificatesV1CertificateSigningRequest(params: WatchCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/certificates.k8s.io/v1/watch/certificatesigningrequests/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getCoordinationAPIGroup(params: GetCoordinationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/coordination.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getCoordinationV1APIResources(params: GetCoordinationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/coordination.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listCoordinationV1LeaseForAllNamespaces(params: ListCoordinationV1LeaseForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<LeaseList> {
    const path = `/apis/coordination.k8s.io/v1/leases`;
    return await this.get<LeaseList>(path, null, null, opts);
  }
  async listCoordinationV1NamespacedLease(params: ListCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<LeaseList> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases`;
    return await this.get<LeaseList>(path, params.query, null, opts);
  }
  async createCoordinationV1NamespacedLease(params: CreateCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases`;
    return await this.post<Lease>(path, params.query, params.body, opts);
  }
  async deleteCoordinationV1CollectionNamespacedLease(params: DeleteCoordinationV1CollectionNamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readCoordinationV1NamespacedLease(params: ReadCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases/${params.path.name}`;
    return await this.get<Lease>(path, null, null, opts);
  }
  async replaceCoordinationV1NamespacedLease(params: ReplaceCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases/${params.path.name}`;
    return await this.put<Lease>(path, params.query, params.body, opts);
  }
  async deleteCoordinationV1NamespacedLease(params: DeleteCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchCoordinationV1NamespacedLease(params: PatchCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease> {
    const path = `/apis/coordination.k8s.io/v1/namespaces/${params.path.namespace}/leases/${params.path.name}`;
    return await this.patch<Lease>(path, params.query, params.body, opts);
  }
  async watchCoordinationV1LeaseListForAllNamespaces(params: WatchCoordinationV1LeaseListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/coordination.k8s.io/v1/watch/leases`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoordinationV1NamespacedLeaseList(params: WatchCoordinationV1NamespacedLeaseListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/coordination.k8s.io/v1/watch/namespaces/${params.path.namespace}/leases`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchCoordinationV1NamespacedLease(params: WatchCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/coordination.k8s.io/v1/watch/namespaces/${params.path.namespace}/leases/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getDiscoveryAPIGroup(params: GetDiscoveryAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/discovery.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getDiscoveryV1APIResources(params: GetDiscoveryV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/discovery.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listDiscoveryV1EndpointSliceForAllNamespaces(params: ListDiscoveryV1EndpointSliceForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EndpointSliceList> {
    const path = `/apis/discovery.k8s.io/v1/endpointslices`;
    return await this.get<EndpointSliceList>(path, null, null, opts);
  }
  async listDiscoveryV1NamespacedEndpointSlice(params: ListDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSliceList> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices`;
    return await this.get<EndpointSliceList>(path, params.query, null, opts);
  }
  async createDiscoveryV1NamespacedEndpointSlice(params: CreateDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices`;
    return await this.post<EndpointSlice>(path, params.query, params.body, opts);
  }
  async deleteDiscoveryV1CollectionNamespacedEndpointSlice(params: DeleteDiscoveryV1CollectionNamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readDiscoveryV1NamespacedEndpointSlice(params: ReadDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices/${params.path.name}`;
    return await this.get<EndpointSlice>(path, null, null, opts);
  }
  async replaceDiscoveryV1NamespacedEndpointSlice(params: ReplaceDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices/${params.path.name}`;
    return await this.put<EndpointSlice>(path, params.query, params.body, opts);
  }
  async deleteDiscoveryV1NamespacedEndpointSlice(params: DeleteDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchDiscoveryV1NamespacedEndpointSlice(params: PatchDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice> {
    const path = `/apis/discovery.k8s.io/v1/namespaces/${params.path.namespace}/endpointslices/${params.path.name}`;
    return await this.patch<EndpointSlice>(path, params.query, params.body, opts);
  }
  async watchDiscoveryV1EndpointSliceListForAllNamespaces(params: WatchDiscoveryV1EndpointSliceListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/discovery.k8s.io/v1/watch/endpointslices`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchDiscoveryV1NamespacedEndpointSliceList(params: WatchDiscoveryV1NamespacedEndpointSliceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/discovery.k8s.io/v1/watch/namespaces/${params.path.namespace}/endpointslices`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchDiscoveryV1NamespacedEndpointSlice(params: WatchDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/discovery.k8s.io/v1/watch/namespaces/${params.path.namespace}/endpointslices/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getEventsAPIGroup(params: GetEventsAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/events.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getEventsV1APIResources(params: GetEventsV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/events.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listEventsV1EventForAllNamespaces(params: ListEventsV1EventForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EventList> {
    const path = `/apis/events.k8s.io/v1/events`;
    return await this.get<EventList>(path, null, null, opts);
  }
  async listEventsV1NamespacedEvent(params: ListEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<EventList> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events`;
    return await this.get<EventList>(path, params.query, null, opts);
  }
  async createEventsV1NamespacedEvent(params: CreateEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events`;
    return await this.post<Event>(path, params.query, params.body, opts);
  }
  async deleteEventsV1CollectionNamespacedEvent(params: DeleteEventsV1CollectionNamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readEventsV1NamespacedEvent(params: ReadEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.get<Event>(path, null, null, opts);
  }
  async replaceEventsV1NamespacedEvent(params: ReplaceEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.put<Event>(path, params.query, params.body, opts);
  }
  async deleteEventsV1NamespacedEvent(params: DeleteEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchEventsV1NamespacedEvent(params: PatchEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event> {
    const path = `/apis/events.k8s.io/v1/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.patch<Event>(path, params.query, params.body, opts);
  }
  async watchEventsV1EventListForAllNamespaces(params: WatchEventsV1EventListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/events.k8s.io/v1/watch/events`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchEventsV1NamespacedEventList(params: WatchEventsV1NamespacedEventListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/events.k8s.io/v1/watch/namespaces/${params.path.namespace}/events`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchEventsV1NamespacedEvent(params: WatchEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/events.k8s.io/v1/watch/namespaces/${params.path.namespace}/events/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getFlowcontrolApiserverAPIGroup(params: GetFlowcontrolApiserverAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/flowcontrol.apiserver.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getNetworkingAPIGroup(params: GetNetworkingAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/networking.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getNetworkingV1APIResources(params: GetNetworkingV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/networking.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listNetworkingV1IngressClass(params: ListNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClassList> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses`;
    return await this.get<IngressClassList>(path, params.query, null, opts);
  }
  async createNetworkingV1IngressClass(params: CreateNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses`;
    return await this.post<IngressClass>(path, params.query, params.body, opts);
  }
  async deleteNetworkingV1CollectionIngressClass(params: DeleteNetworkingV1CollectionIngressClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readNetworkingV1IngressClass(params: ReadNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses/${params.path.name}`;
    return await this.get<IngressClass>(path, null, null, opts);
  }
  async replaceNetworkingV1IngressClass(params: ReplaceNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses/${params.path.name}`;
    return await this.put<IngressClass>(path, params.query, params.body, opts);
  }
  async deleteNetworkingV1IngressClass(params: DeleteNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchNetworkingV1IngressClass(params: PatchNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass> {
    const path = `/apis/networking.k8s.io/v1/ingressclasses/${params.path.name}`;
    return await this.patch<IngressClass>(path, params.query, params.body, opts);
  }
  async listNetworkingV1IngressForAllNamespaces(params: ListNetworkingV1IngressForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<IngressList> {
    const path = `/apis/networking.k8s.io/v1/ingresses`;
    return await this.get<IngressList>(path, null, null, opts);
  }
  async listNetworkingV1NamespacedIngress(params: ListNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<IngressList> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses`;
    return await this.get<IngressList>(path, params.query, null, opts);
  }
  async createNetworkingV1NamespacedIngress(params: CreateNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses`;
    return await this.post<Ingress>(path, params.query, params.body, opts);
  }
  async deleteNetworkingV1CollectionNamespacedIngress(params: DeleteNetworkingV1CollectionNamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readNetworkingV1NamespacedIngress(params: ReadNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}`;
    return await this.get<Ingress>(path, null, null, opts);
  }
  async replaceNetworkingV1NamespacedIngress(params: ReplaceNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}`;
    return await this.put<Ingress>(path, params.query, params.body, opts);
  }
  async deleteNetworkingV1NamespacedIngress(params: DeleteNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchNetworkingV1NamespacedIngress(params: PatchNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}`;
    return await this.patch<Ingress>(path, params.query, params.body, opts);
  }
  async readNetworkingV1NamespacedIngressStatus(params: ReadNetworkingV1NamespacedIngressStatusRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}/status`;
    return await this.get<Ingress>(path, null, null, opts);
  }
  async replaceNetworkingV1NamespacedIngressStatus(params: ReplaceNetworkingV1NamespacedIngressStatusRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}/status`;
    return await this.put<Ingress>(path, params.query, params.body, opts);
  }
  async patchNetworkingV1NamespacedIngressStatus(params: PatchNetworkingV1NamespacedIngressStatusRequest, opts?: APIClientRequestOpts): Promise<Ingress> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/ingresses/${params.path.name}/status`;
    return await this.patch<Ingress>(path, params.query, params.body, opts);
  }
  async listNetworkingV1NamespacedNetworkPolicy(params: ListNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicyList> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies`;
    return await this.get<NetworkPolicyList>(path, params.query, null, opts);
  }
  async createNetworkingV1NamespacedNetworkPolicy(params: CreateNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies`;
    return await this.post<NetworkPolicy>(path, params.query, params.body, opts);
  }
  async deleteNetworkingV1CollectionNamespacedNetworkPolicy(params: DeleteNetworkingV1CollectionNamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readNetworkingV1NamespacedNetworkPolicy(params: ReadNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies/${params.path.name}`;
    return await this.get<NetworkPolicy>(path, null, null, opts);
  }
  async replaceNetworkingV1NamespacedNetworkPolicy(params: ReplaceNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies/${params.path.name}`;
    return await this.put<NetworkPolicy>(path, params.query, params.body, opts);
  }
  async deleteNetworkingV1NamespacedNetworkPolicy(params: DeleteNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchNetworkingV1NamespacedNetworkPolicy(params: PatchNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy> {
    const path = `/apis/networking.k8s.io/v1/namespaces/${params.path.namespace}/networkpolicies/${params.path.name}`;
    return await this.patch<NetworkPolicy>(path, params.query, params.body, opts);
  }
  async listNetworkingV1NetworkPolicyForAllNamespaces(params: ListNetworkingV1NetworkPolicyForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicyList> {
    const path = `/apis/networking.k8s.io/v1/networkpolicies`;
    return await this.get<NetworkPolicyList>(path, null, null, opts);
  }
  async watchNetworkingV1IngressClassList(params: WatchNetworkingV1IngressClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/ingressclasses`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1IngressClass(params: WatchNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/ingressclasses/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1IngressListForAllNamespaces(params: WatchNetworkingV1IngressListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/ingresses`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1NamespacedIngressList(params: WatchNetworkingV1NamespacedIngressListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/namespaces/${params.path.namespace}/ingresses`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1NamespacedIngress(params: WatchNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/namespaces/${params.path.namespace}/ingresses/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1NamespacedNetworkPolicyList(params: WatchNetworkingV1NamespacedNetworkPolicyListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/namespaces/${params.path.namespace}/networkpolicies`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1NamespacedNetworkPolicy(params: WatchNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/namespaces/${params.path.namespace}/networkpolicies/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNetworkingV1NetworkPolicyListForAllNamespaces(params: WatchNetworkingV1NetworkPolicyListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/networking.k8s.io/v1/watch/networkpolicies`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getNodeAPIGroup(params: GetNodeAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/node.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getNodeV1APIResources(params: GetNodeV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/node.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listNodeV1RuntimeClass(params: ListNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClassList> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses`;
    return await this.get<RuntimeClassList>(path, params.query, null, opts);
  }
  async createNodeV1RuntimeClass(params: CreateNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses`;
    return await this.post<RuntimeClass>(path, params.query, params.body, opts);
  }
  async deleteNodeV1CollectionRuntimeClass(params: DeleteNodeV1CollectionRuntimeClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readNodeV1RuntimeClass(params: ReadNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses/${params.path.name}`;
    return await this.get<RuntimeClass>(path, null, null, opts);
  }
  async replaceNodeV1RuntimeClass(params: ReplaceNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses/${params.path.name}`;
    return await this.put<RuntimeClass>(path, params.query, params.body, opts);
  }
  async deleteNodeV1RuntimeClass(params: DeleteNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchNodeV1RuntimeClass(params: PatchNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass> {
    const path = `/apis/node.k8s.io/v1/runtimeclasses/${params.path.name}`;
    return await this.patch<RuntimeClass>(path, params.query, params.body, opts);
  }
  async watchNodeV1RuntimeClassList(params: WatchNodeV1RuntimeClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/node.k8s.io/v1/watch/runtimeclasses`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchNodeV1RuntimeClass(params: WatchNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/node.k8s.io/v1/watch/runtimeclasses/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getPolicyAPIGroup(params: GetPolicyAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/policy/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getPolicyV1APIResources(params: GetPolicyV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/policy/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listPolicyV1NamespacedPodDisruptionBudget(params: ListPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudgetList> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets`;
    return await this.get<PodDisruptionBudgetList>(path, params.query, null, opts);
  }
  async createPolicyV1NamespacedPodDisruptionBudget(params: CreatePolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets`;
    return await this.post<PodDisruptionBudget>(path, params.query, params.body, opts);
  }
  async deletePolicyV1CollectionNamespacedPodDisruptionBudget(params: DeletePolicyV1CollectionNamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readPolicyV1NamespacedPodDisruptionBudget(params: ReadPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}`;
    return await this.get<PodDisruptionBudget>(path, null, null, opts);
  }
  async replacePolicyV1NamespacedPodDisruptionBudget(params: ReplacePolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}`;
    return await this.put<PodDisruptionBudget>(path, params.query, params.body, opts);
  }
  async deletePolicyV1NamespacedPodDisruptionBudget(params: DeletePolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchPolicyV1NamespacedPodDisruptionBudget(params: PatchPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}`;
    return await this.patch<PodDisruptionBudget>(path, params.query, params.body, opts);
  }
  async readPolicyV1NamespacedPodDisruptionBudgetStatus(params: ReadPolicyV1NamespacedPodDisruptionBudgetStatusRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}/status`;
    return await this.get<PodDisruptionBudget>(path, null, null, opts);
  }
  async replacePolicyV1NamespacedPodDisruptionBudgetStatus(params: ReplacePolicyV1NamespacedPodDisruptionBudgetStatusRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}/status`;
    return await this.put<PodDisruptionBudget>(path, params.query, params.body, opts);
  }
  async patchPolicyV1NamespacedPodDisruptionBudgetStatus(params: PatchPolicyV1NamespacedPodDisruptionBudgetStatusRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget> {
    const path = `/apis/policy/v1/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}/status`;
    return await this.patch<PodDisruptionBudget>(path, params.query, params.body, opts);
  }
  async listPolicyV1PodDisruptionBudgetForAllNamespaces(params: ListPolicyV1PodDisruptionBudgetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudgetList> {
    const path = `/apis/policy/v1/poddisruptionbudgets`;
    return await this.get<PodDisruptionBudgetList>(path, null, null, opts);
  }
  async watchPolicyV1NamespacedPodDisruptionBudgetList(params: WatchPolicyV1NamespacedPodDisruptionBudgetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/policy/v1/watch/namespaces/${params.path.namespace}/poddisruptionbudgets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchPolicyV1NamespacedPodDisruptionBudget(params: WatchPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/policy/v1/watch/namespaces/${params.path.namespace}/poddisruptionbudgets/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchPolicyV1PodDisruptionBudgetListForAllNamespaces(params: WatchPolicyV1PodDisruptionBudgetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/policy/v1/watch/poddisruptionbudgets`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getRbacAuthorizationAPIGroup(params: GetRbacAuthorizationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/rbac.authorization.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getRbacAuthorizationV1APIResources(params: GetRbacAuthorizationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listRbacAuthorizationV1ClusterRoleBinding(params: ListRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBindingList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`;
    return await this.get<ClusterRoleBindingList>(path, params.query, null, opts);
  }
  async createRbacAuthorizationV1ClusterRoleBinding(params: CreateRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`;
    return await this.post<ClusterRoleBinding>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1CollectionClusterRoleBinding(params: DeleteRbacAuthorizationV1CollectionClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readRbacAuthorizationV1ClusterRoleBinding(params: ReadRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${params.path.name}`;
    return await this.get<ClusterRoleBinding>(path, null, null, opts);
  }
  async replaceRbacAuthorizationV1ClusterRoleBinding(params: ReplaceRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${params.path.name}`;
    return await this.put<ClusterRoleBinding>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1ClusterRoleBinding(params: DeleteRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchRbacAuthorizationV1ClusterRoleBinding(params: PatchRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${params.path.name}`;
    return await this.patch<ClusterRoleBinding>(path, params.query, params.body, opts);
  }
  async listRbacAuthorizationV1ClusterRole(params: ListRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles`;
    return await this.get<ClusterRoleList>(path, params.query, null, opts);
  }
  async createRbacAuthorizationV1ClusterRole(params: CreateRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles`;
    return await this.post<ClusterRole>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1CollectionClusterRole(params: DeleteRbacAuthorizationV1CollectionClusterRoleRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readRbacAuthorizationV1ClusterRole(params: ReadRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles/${params.path.name}`;
    return await this.get<ClusterRole>(path, null, null, opts);
  }
  async replaceRbacAuthorizationV1ClusterRole(params: ReplaceRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles/${params.path.name}`;
    return await this.put<ClusterRole>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1ClusterRole(params: DeleteRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchRbacAuthorizationV1ClusterRole(params: PatchRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole> {
    const path = `/apis/rbac.authorization.k8s.io/v1/clusterroles/${params.path.name}`;
    return await this.patch<ClusterRole>(path, params.query, params.body, opts);
  }
  async listRbacAuthorizationV1NamespacedRoleBinding(params: ListRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBindingList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings`;
    return await this.get<RoleBindingList>(path, params.query, null, opts);
  }
  async createRbacAuthorizationV1NamespacedRoleBinding(params: CreateRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings`;
    return await this.post<RoleBinding>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1CollectionNamespacedRoleBinding(params: DeleteRbacAuthorizationV1CollectionNamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readRbacAuthorizationV1NamespacedRoleBinding(params: ReadRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings/${params.path.name}`;
    return await this.get<RoleBinding>(path, null, null, opts);
  }
  async replaceRbacAuthorizationV1NamespacedRoleBinding(params: ReplaceRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings/${params.path.name}`;
    return await this.put<RoleBinding>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1NamespacedRoleBinding(params: DeleteRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchRbacAuthorizationV1NamespacedRoleBinding(params: PatchRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/rolebindings/${params.path.name}`;
    return await this.patch<RoleBinding>(path, params.query, params.body, opts);
  }
  async listRbacAuthorizationV1NamespacedRole(params: ListRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<RoleList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles`;
    return await this.get<RoleList>(path, params.query, null, opts);
  }
  async createRbacAuthorizationV1NamespacedRole(params: CreateRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles`;
    return await this.post<Role>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1CollectionNamespacedRole(params: DeleteRbacAuthorizationV1CollectionNamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readRbacAuthorizationV1NamespacedRole(params: ReadRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles/${params.path.name}`;
    return await this.get<Role>(path, null, null, opts);
  }
  async replaceRbacAuthorizationV1NamespacedRole(params: ReplaceRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles/${params.path.name}`;
    return await this.put<Role>(path, params.query, params.body, opts);
  }
  async deleteRbacAuthorizationV1NamespacedRole(params: DeleteRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchRbacAuthorizationV1NamespacedRole(params: PatchRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role> {
    const path = `/apis/rbac.authorization.k8s.io/v1/namespaces/${params.path.namespace}/roles/${params.path.name}`;
    return await this.patch<Role>(path, params.query, params.body, opts);
  }
  async listRbacAuthorizationV1RoleBindingForAllNamespaces(params: ListRbacAuthorizationV1RoleBindingForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<RoleBindingList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/rolebindings`;
    return await this.get<RoleBindingList>(path, null, null, opts);
  }
  async listRbacAuthorizationV1RoleForAllNamespaces(params: ListRbacAuthorizationV1RoleForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<RoleList> {
    const path = `/apis/rbac.authorization.k8s.io/v1/roles`;
    return await this.get<RoleList>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1ClusterRoleBindingList(params: WatchRbacAuthorizationV1ClusterRoleBindingListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/clusterrolebindings`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1ClusterRoleBinding(params: WatchRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/clusterrolebindings/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1ClusterRoleList(params: WatchRbacAuthorizationV1ClusterRoleListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/clusterroles`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1ClusterRole(params: WatchRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/clusterroles/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1NamespacedRoleBindingList(params: WatchRbacAuthorizationV1NamespacedRoleBindingListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/namespaces/${params.path.namespace}/rolebindings`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1NamespacedRoleBinding(params: WatchRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/namespaces/${params.path.namespace}/rolebindings/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1NamespacedRoleList(params: WatchRbacAuthorizationV1NamespacedRoleListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/namespaces/${params.path.namespace}/roles`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1NamespacedRole(params: WatchRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/namespaces/${params.path.namespace}/roles/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1RoleBindingListForAllNamespaces(params: WatchRbacAuthorizationV1RoleBindingListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/rolebindings`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchRbacAuthorizationV1RoleListForAllNamespaces(params: WatchRbacAuthorizationV1RoleListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/rbac.authorization.k8s.io/v1/watch/roles`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getSchedulingAPIGroup(params: GetSchedulingAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/scheduling.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getSchedulingV1APIResources(params: GetSchedulingV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/scheduling.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listSchedulingV1PriorityClass(params: ListSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClassList> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses`;
    return await this.get<PriorityClassList>(path, params.query, null, opts);
  }
  async createSchedulingV1PriorityClass(params: CreateSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses`;
    return await this.post<PriorityClass>(path, params.query, params.body, opts);
  }
  async deleteSchedulingV1CollectionPriorityClass(params: DeleteSchedulingV1CollectionPriorityClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readSchedulingV1PriorityClass(params: ReadSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses/${params.path.name}`;
    return await this.get<PriorityClass>(path, null, null, opts);
  }
  async replaceSchedulingV1PriorityClass(params: ReplaceSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses/${params.path.name}`;
    return await this.put<PriorityClass>(path, params.query, params.body, opts);
  }
  async deleteSchedulingV1PriorityClass(params: DeleteSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses/${params.path.name}`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async patchSchedulingV1PriorityClass(params: PatchSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass> {
    const path = `/apis/scheduling.k8s.io/v1/priorityclasses/${params.path.name}`;
    return await this.patch<PriorityClass>(path, params.query, params.body, opts);
  }
  async watchSchedulingV1PriorityClassList(params: WatchSchedulingV1PriorityClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/scheduling.k8s.io/v1/watch/priorityclasses`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchSchedulingV1PriorityClass(params: WatchSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/scheduling.k8s.io/v1/watch/priorityclasses/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async getStorageAPIGroup(params: GetStorageAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup> {
    const path = `/apis/storage.k8s.io/`;
    return await this.get<APIGroup>(path, null, null, opts);
  }
  async getStorageV1APIResources(params: GetStorageV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList> {
    const path = `/apis/storage.k8s.io/v1/`;
    return await this.get<APIResourceList>(path, null, null, opts);
  }
  async listStorageV1CSIDriver(params: ListStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriverList> {
    const path = `/apis/storage.k8s.io/v1/csidrivers`;
    return await this.get<CSIDriverList>(path, params.query, null, opts);
  }
  async createStorageV1CSIDriver(params: CreateStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver> {
    const path = `/apis/storage.k8s.io/v1/csidrivers`;
    return await this.post<CSIDriver>(path, params.query, params.body, opts);
  }
  async deleteStorageV1CollectionCSIDriver(params: DeleteStorageV1CollectionCSIDriverRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/storage.k8s.io/v1/csidrivers`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readStorageV1CSIDriver(params: ReadStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver> {
    const path = `/apis/storage.k8s.io/v1/csidrivers/${params.path.name}`;
    return await this.get<CSIDriver>(path, null, null, opts);
  }
  async replaceStorageV1CSIDriver(params: ReplaceStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver> {
    const path = `/apis/storage.k8s.io/v1/csidrivers/${params.path.name}`;
    return await this.put<CSIDriver>(path, params.query, params.body, opts);
  }
  async deleteStorageV1CSIDriver(params: DeleteStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver> {
    const path = `/apis/storage.k8s.io/v1/csidrivers/${params.path.name}`;
    return await this.delete<CSIDriver>(path, params.query, null, opts);
  }
  async patchStorageV1CSIDriver(params: PatchStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver> {
    const path = `/apis/storage.k8s.io/v1/csidrivers/${params.path.name}`;
    return await this.patch<CSIDriver>(path, params.query, params.body, opts);
  }
  async listStorageV1CSINode(params: ListStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINodeList> {
    const path = `/apis/storage.k8s.io/v1/csinodes`;
    return await this.get<CSINodeList>(path, params.query, null, opts);
  }
  async createStorageV1CSINode(params: CreateStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode> {
    const path = `/apis/storage.k8s.io/v1/csinodes`;
    return await this.post<CSINode>(path, params.query, params.body, opts);
  }
  async deleteStorageV1CollectionCSINode(params: DeleteStorageV1CollectionCSINodeRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/storage.k8s.io/v1/csinodes`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readStorageV1CSINode(params: ReadStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode> {
    const path = `/apis/storage.k8s.io/v1/csinodes/${params.path.name}`;
    return await this.get<CSINode>(path, null, null, opts);
  }
  async replaceStorageV1CSINode(params: ReplaceStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode> {
    const path = `/apis/storage.k8s.io/v1/csinodes/${params.path.name}`;
    return await this.put<CSINode>(path, params.query, params.body, opts);
  }
  async deleteStorageV1CSINode(params: DeleteStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode> {
    const path = `/apis/storage.k8s.io/v1/csinodes/${params.path.name}`;
    return await this.delete<CSINode>(path, params.query, null, opts);
  }
  async patchStorageV1CSINode(params: PatchStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode> {
    const path = `/apis/storage.k8s.io/v1/csinodes/${params.path.name}`;
    return await this.patch<CSINode>(path, params.query, params.body, opts);
  }
  async listStorageV1StorageClass(params: ListStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClassList> {
    const path = `/apis/storage.k8s.io/v1/storageclasses`;
    return await this.get<StorageClassList>(path, params.query, null, opts);
  }
  async createStorageV1StorageClass(params: CreateStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass> {
    const path = `/apis/storage.k8s.io/v1/storageclasses`;
    return await this.post<StorageClass>(path, params.query, params.body, opts);
  }
  async deleteStorageV1CollectionStorageClass(params: DeleteStorageV1CollectionStorageClassRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/storage.k8s.io/v1/storageclasses`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readStorageV1StorageClass(params: ReadStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass> {
    const path = `/apis/storage.k8s.io/v1/storageclasses/${params.path.name}`;
    return await this.get<StorageClass>(path, null, null, opts);
  }
  async replaceStorageV1StorageClass(params: ReplaceStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass> {
    const path = `/apis/storage.k8s.io/v1/storageclasses/${params.path.name}`;
    return await this.put<StorageClass>(path, params.query, params.body, opts);
  }
  async deleteStorageV1StorageClass(params: DeleteStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass> {
    const path = `/apis/storage.k8s.io/v1/storageclasses/${params.path.name}`;
    return await this.delete<StorageClass>(path, params.query, null, opts);
  }
  async patchStorageV1StorageClass(params: PatchStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass> {
    const path = `/apis/storage.k8s.io/v1/storageclasses/${params.path.name}`;
    return await this.patch<StorageClass>(path, params.query, params.body, opts);
  }
  async listStorageV1VolumeAttachment(params: ListStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachmentList> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments`;
    return await this.get<VolumeAttachmentList>(path, params.query, null, opts);
  }
  async createStorageV1VolumeAttachment(params: CreateStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments`;
    return await this.post<VolumeAttachment>(path, params.query, params.body, opts);
  }
  async deleteStorageV1CollectionVolumeAttachment(params: DeleteStorageV1CollectionVolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<Status> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments`;
    return await this.delete<Status>(path, params.query, null, opts);
  }
  async readStorageV1VolumeAttachment(params: ReadStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}`;
    return await this.get<VolumeAttachment>(path, null, null, opts);
  }
  async replaceStorageV1VolumeAttachment(params: ReplaceStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}`;
    return await this.put<VolumeAttachment>(path, params.query, params.body, opts);
  }
  async deleteStorageV1VolumeAttachment(params: DeleteStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}`;
    return await this.delete<VolumeAttachment>(path, params.query, null, opts);
  }
  async patchStorageV1VolumeAttachment(params: PatchStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}`;
    return await this.patch<VolumeAttachment>(path, params.query, params.body, opts);
  }
  async readStorageV1VolumeAttachmentStatus(params: ReadStorageV1VolumeAttachmentStatusRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}/status`;
    return await this.get<VolumeAttachment>(path, null, null, opts);
  }
  async replaceStorageV1VolumeAttachmentStatus(params: ReplaceStorageV1VolumeAttachmentStatusRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}/status`;
    return await this.put<VolumeAttachment>(path, params.query, params.body, opts);
  }
  async patchStorageV1VolumeAttachmentStatus(params: PatchStorageV1VolumeAttachmentStatusRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment> {
    const path = `/apis/storage.k8s.io/v1/volumeattachments/${params.path.name}/status`;
    return await this.patch<VolumeAttachment>(path, params.query, params.body, opts);
  }
  async watchStorageV1CSIDriverList(params: WatchStorageV1CSIDriverListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/csidrivers`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1CSIDriver(params: WatchStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/csidrivers/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1CSINodeList(params: WatchStorageV1CSINodeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/csinodes`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1CSINode(params: WatchStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/csinodes/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1StorageClassList(params: WatchStorageV1StorageClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/storageclasses`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1StorageClass(params: WatchStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/storageclasses/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1VolumeAttachmentList(params: WatchStorageV1VolumeAttachmentListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/volumeattachments`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async watchStorageV1VolumeAttachment(params: WatchStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<WatchEvent> {
    const path = `/apis/storage.k8s.io/v1/watch/volumeattachments/${params.path.name}`;
    return await this.get<WatchEvent>(path, null, null, opts);
  }
  async logFileListHandler(params: LogFileListHandlerRequest, opts?: APIClientRequestOpts): Promise<any> {
    const path = `/logs/`;
    return await this.get<any>(path, null, null, opts);
  }
  async logFileHandler(params: LogFileHandlerRequest, opts?: APIClientRequestOpts): Promise<any> {
    const path = `/logs/${params.path.logpath}`;
    return await this.get<any>(path, null, null, opts);
  }
  async getServiceAccountIssuerOpenIDKeyset(params: GetServiceAccountIssuerOpenIDKeysetRequest, opts?: APIClientRequestOpts): Promise<string> {
    const path = `/openid/v1/jwks/`;
    return await this.get<string>(path, null, null, opts);
  }
  async getCodeVersion(params: GetCodeVersionRequest, opts?: APIClientRequestOpts): Promise<Info> {
    const path = `/version/`;
    return await this.get<Info>(path, null, null, opts);
  }
}