import { APIClient, APIClientRequestOpts } from "./client";
export interface MutatingWebhook {
    admissionReviewVersions: string[];
    clientConfig: WebhookClientConfig;
    failurePolicy?: string;
    matchPolicy?: string;
    name: string;
    namespaceSelector?: LabelSelector;
    objectSelector?: LabelSelector;
    reinvocationPolicy?: string;
    rules?: RuleWithOperations[];
    sideEffects: string;
    timeoutSeconds?: number;
}
export interface MutatingWebhookConfiguration {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    webhooks?: MutatingWebhook[];
}
export interface MutatingWebhookConfigurationList {
    apiVersion?: string;
    items: MutatingWebhookConfiguration[];
    kind?: string;
    metadata?: ListMeta;
}
export interface RuleWithOperations {
    apiGroups?: string[];
    apiVersions?: string[];
    operations?: string[];
    resources?: string[];
    scope?: string;
}
export interface AdmissionServiceReference {
    name: string;
    namespace: string;
    path?: string;
    port?: number;
}
export interface ValidatingWebhook {
    admissionReviewVersions: string[];
    clientConfig: WebhookClientConfig;
    failurePolicy?: string;
    matchPolicy?: string;
    name: string;
    namespaceSelector?: LabelSelector;
    objectSelector?: LabelSelector;
    rules?: RuleWithOperations[];
    sideEffects: string;
    timeoutSeconds?: number;
}
export interface ValidatingWebhookConfiguration {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    webhooks?: ValidatingWebhook[];
}
export interface ValidatingWebhookConfigurationList {
    apiVersion?: string;
    items: ValidatingWebhookConfiguration[];
    kind?: string;
    metadata?: ListMeta;
}
export interface WebhookClientConfig {
    caBundle?: string;
    service?: AdmissionServiceReference;
    url?: string;
}
export interface ControllerRevision {
    apiVersion?: string;
    data?: RawExtension;
    kind?: string;
    metadata?: ObjectMeta;
    revision: number;
}
export interface ControllerRevisionList {
    apiVersion?: string;
    items: ControllerRevision[];
    kind?: string;
    metadata?: ListMeta;
}
export interface DaemonSet {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: DaemonSetSpec;
    status?: DaemonSetStatus;
}
export interface DaemonSetCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface DaemonSetList {
    apiVersion?: string;
    items: DaemonSet[];
    kind?: string;
    metadata?: ListMeta;
}
export interface DaemonSetSpec {
    minReadySeconds?: number;
    revisionHistoryLimit?: number;
    selector: LabelSelector;
    template: PodTemplateSpec;
    updateStrategy?: DaemonSetUpdateStrategy;
}
export interface DaemonSetStatus {
    collisionCount?: number;
    conditions?: DaemonSetCondition[];
    currentNumberScheduled: number;
    desiredNumberScheduled: number;
    numberAvailable?: number;
    numberMisscheduled: number;
    numberReady: number;
    numberUnavailable?: number;
    observedGeneration?: number;
    updatedNumberScheduled?: number;
}
export interface DaemonSetUpdateStrategy {
    rollingUpdate?: RollingUpdateDaemonSet;
    type?: string;
}
export interface Deployment {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: DeploymentSpec;
    status?: DeploymentStatus;
}
export interface DeploymentCondition {
    lastTransitionTime?: Time;
    lastUpdateTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface DeploymentList {
    apiVersion?: string;
    items: Deployment[];
    kind?: string;
    metadata?: ListMeta;
}
export interface DeploymentSpec {
    minReadySeconds?: number;
    paused?: boolean;
    progressDeadlineSeconds?: number;
    replicas?: number;
    revisionHistoryLimit?: number;
    selector: LabelSelector;
    strategy?: DeploymentStrategy;
    template: PodTemplateSpec;
}
export interface DeploymentStatus {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: DeploymentCondition[];
    observedGeneration?: number;
    readyReplicas?: number;
    replicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
}
export interface DeploymentStrategy {
    rollingUpdate?: RollingUpdateDeployment;
    type?: string;
}
export interface ReplicaSet {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: ReplicaSetSpec;
    status?: ReplicaSetStatus;
}
export interface ReplicaSetCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface ReplicaSetList {
    apiVersion?: string;
    items: ReplicaSet[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ReplicaSetSpec {
    minReadySeconds?: number;
    replicas?: number;
    selector: LabelSelector;
    template?: PodTemplateSpec;
}
export interface ReplicaSetStatus {
    availableReplicas?: number;
    conditions?: ReplicaSetCondition[];
    fullyLabeledReplicas?: number;
    observedGeneration?: number;
    readyReplicas?: number;
    replicas: number;
}
export interface RollingUpdateDaemonSet {
    maxSurge?: IntOrString;
    maxUnavailable?: IntOrString;
}
export interface RollingUpdateDeployment {
    maxSurge?: IntOrString;
    maxUnavailable?: IntOrString;
}
export interface RollingUpdateStatefulSetStrategy {
    partition?: number;
}
export interface StatefulSet {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: StatefulSetSpec;
    status?: StatefulSetStatus;
}
export interface StatefulSetCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface StatefulSetList {
    apiVersion?: string;
    items: StatefulSet[];
    kind?: string;
    metadata?: ListMeta;
}
export interface StatefulSetSpec {
    minReadySeconds?: number;
    podManagementPolicy?: string;
    replicas?: number;
    revisionHistoryLimit?: number;
    selector: LabelSelector;
    serviceName: string;
    template: PodTemplateSpec;
    updateStrategy?: StatefulSetUpdateStrategy;
    volumeClaimTemplates?: PersistentVolumeClaim[];
}
export interface StatefulSetStatus {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: StatefulSetCondition[];
    currentReplicas?: number;
    currentRevision?: string;
    observedGeneration?: number;
    readyReplicas?: number;
    replicas: number;
    updateRevision?: string;
    updatedReplicas?: number;
}
export interface StatefulSetUpdateStrategy {
    rollingUpdate?: RollingUpdateStatefulSetStrategy;
    type?: string;
}
export interface BoundObjectReference {
    apiVersion?: string;
    kind?: string;
    name?: string;
    uid?: string;
}
export interface TokenRequest {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: TokenRequestSpec;
    status?: TokenRequestStatus;
}
export interface TokenRequestSpec {
    audiences: string[];
    boundObjectRef?: BoundObjectReference;
    expirationSeconds?: number;
}
export interface TokenRequestStatus {
    expirationTimestamp: Time;
    token: string;
}
export interface TokenReview {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: TokenReviewSpec;
    status?: TokenReviewStatus;
}
export interface TokenReviewSpec {
    audiences?: string[];
    token?: string;
}
export interface TokenReviewStatus {
    audiences?: string[];
    authenticated?: boolean;
    error?: string;
    user?: UserInfo;
}
export interface UserInfo {
    extra?: {
        [key: string]: unknown;
    };
    groups?: string[];
    uid?: string;
    username?: string;
}
export interface LocalSubjectAccessReview {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: SubjectAccessReviewSpec;
    status?: SubjectAccessReviewStatus;
}
export interface NonResourceAttributes {
    path?: string;
    verb?: string;
}
export interface NonResourceRule {
    nonResourceURLs?: string[];
    verbs: string[];
}
export interface ResourceAttributes {
    group?: string;
    name?: string;
    namespace?: string;
    resource?: string;
    subresource?: string;
    verb?: string;
    version?: string;
}
export interface ResourceRule {
    apiGroups?: string[];
    resourceNames?: string[];
    resources?: string[];
    verbs: string[];
}
export interface SelfSubjectAccessReview {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: SelfSubjectAccessReviewSpec;
    status?: SubjectAccessReviewStatus;
}
export interface SelfSubjectAccessReviewSpec {
    nonResourceAttributes?: NonResourceAttributes;
    resourceAttributes?: ResourceAttributes;
}
export interface SelfSubjectRulesReview {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: SelfSubjectRulesReviewSpec;
    status?: SubjectRulesReviewStatus;
}
export interface SelfSubjectRulesReviewSpec {
    namespace?: string;
}
export interface SubjectAccessReview {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: SubjectAccessReviewSpec;
    status?: SubjectAccessReviewStatus;
}
export interface SubjectAccessReviewSpec {
    extra?: {
        [key: string]: unknown;
    };
    groups?: string[];
    nonResourceAttributes?: NonResourceAttributes;
    resourceAttributes?: ResourceAttributes;
    uid?: string;
    user?: string;
}
export interface SubjectAccessReviewStatus {
    allowed: boolean;
    denied?: boolean;
    evaluationError?: string;
    reason?: string;
}
export interface SubjectRulesReviewStatus {
    evaluationError?: string;
    incomplete: boolean;
    nonResourceRules: NonResourceRule[];
    resourceRules: ResourceRule[];
}
export interface CrossVersionObjectReference {
    apiVersion?: string;
    kind: string;
    name: string;
}
export interface HorizontalPodAutoscaler {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: HorizontalPodAutoscalerSpec;
    status?: HorizontalPodAutoscalerStatus;
}
export interface HorizontalPodAutoscalerList {
    apiVersion?: string;
    items: HorizontalPodAutoscaler[];
    kind?: string;
    metadata?: ListMeta;
}
export interface HorizontalPodAutoscalerSpec {
    maxReplicas: number;
    minReplicas?: number;
    scaleTargetRef: CrossVersionObjectReference;
    targetCPUUtilizationPercentage?: number;
}
export interface HorizontalPodAutoscalerStatus {
    currentCPUUtilizationPercentage?: number;
    currentReplicas: number;
    desiredReplicas: number;
    lastScaleTime?: Time;
    observedGeneration?: number;
}
export interface Scale {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: ScaleSpec;
    status?: ScaleStatus;
}
export interface ScaleSpec {
    replicas?: number;
}
export interface ScaleStatus {
    replicas: number;
    selector?: string;
}
export interface ContainerResourceMetricSource {
    container: string;
    name: string;
    target: MetricTarget;
}
export interface ContainerResourceMetricStatus {
    container: string;
    current: MetricValueStatus;
    name: string;
}
export interface CrossVersionObjectReference {
    apiVersion?: string;
    kind: string;
    name: string;
}
export interface ExternalMetricSource {
    metric: MetricIdentifier;
    target: MetricTarget;
}
export interface ExternalMetricStatus {
    current: MetricValueStatus;
    metric: MetricIdentifier;
}
export interface HPAScalingPolicy {
    periodSeconds: number;
    type: string;
    value: number;
}
export interface HPAScalingRules {
    policies?: HPAScalingPolicy[];
    selectPolicy?: string;
    stabilizationWindowSeconds?: number;
}
export interface HorizontalPodAutoscaler {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: HorizontalPodAutoscalerSpec;
    status?: HorizontalPodAutoscalerStatus;
}
export interface HorizontalPodAutoscalerBehavior {
    scaleDown?: HPAScalingRules;
    scaleUp?: HPAScalingRules;
}
export interface HorizontalPodAutoscalerCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface HorizontalPodAutoscalerList {
    apiVersion?: string;
    items: HorizontalPodAutoscaler[];
    kind?: string;
    metadata?: ListMeta;
}
export interface HorizontalPodAutoscalerSpec {
    behavior?: HorizontalPodAutoscalerBehavior;
    maxReplicas: number;
    metrics?: MetricSpec[];
    minReplicas?: number;
    scaleTargetRef: CrossVersionObjectReference;
}
export interface HorizontalPodAutoscalerStatus {
    conditions: HorizontalPodAutoscalerCondition[];
    currentMetrics?: MetricStatus[];
    currentReplicas: number;
    desiredReplicas: number;
    lastScaleTime?: Time;
    observedGeneration?: number;
}
export interface MetricIdentifier {
    name: string;
    selector?: LabelSelector;
}
export interface MetricSpec {
    containerResource?: ContainerResourceMetricSource;
    external?: ExternalMetricSource;
    object?: ObjectMetricSource;
    pods?: PodsMetricSource;
    resource?: ResourceMetricSource;
    type: string;
}
export interface MetricStatus {
    containerResource?: ContainerResourceMetricStatus;
    external?: ExternalMetricStatus;
    object?: ObjectMetricStatus;
    pods?: PodsMetricStatus;
    resource?: ResourceMetricStatus;
    type: string;
}
export interface MetricTarget {
    averageUtilization?: number;
    averageValue?: Quantity;
    type: string;
    value?: Quantity;
}
export interface MetricValueStatus {
    averageUtilization?: number;
    averageValue?: Quantity;
    value?: Quantity;
}
export interface ObjectMetricSource {
    describedObject: CrossVersionObjectReference;
    metric: MetricIdentifier;
    target: MetricTarget;
}
export interface ObjectMetricStatus {
    current: MetricValueStatus;
    describedObject: CrossVersionObjectReference;
    metric: MetricIdentifier;
}
export interface PodsMetricSource {
    metric: MetricIdentifier;
    target: MetricTarget;
}
export interface PodsMetricStatus {
    current: MetricValueStatus;
    metric: MetricIdentifier;
}
export interface ResourceMetricSource {
    name: string;
    target: MetricTarget;
}
export interface ResourceMetricStatus {
    current: MetricValueStatus;
    name: string;
}
export interface CronJob {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: CronJobSpec;
    status?: CronJobStatus;
}
export interface CronJobList {
    apiVersion?: string;
    items: CronJob[];
    kind?: string;
    metadata?: ListMeta;
}
export interface CronJobSpec {
    concurrencyPolicy?: string;
    failedJobsHistoryLimit?: number;
    jobTemplate: JobTemplateSpec;
    schedule: string;
    startingDeadlineSeconds?: number;
    successfulJobsHistoryLimit?: number;
    suspend?: boolean;
}
export interface CronJobStatus {
    active?: ObjectReference[];
    lastScheduleTime?: Time;
    lastSuccessfulTime?: Time;
}
export interface Job {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: JobSpec;
    status?: JobStatus;
}
export interface JobCondition {
    lastProbeTime?: Time;
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface JobList {
    apiVersion?: string;
    items: Job[];
    kind?: string;
    metadata?: ListMeta;
}
export interface JobSpec {
    activeDeadlineSeconds?: number;
    backoffLimit?: number;
    completionMode?: string;
    completions?: number;
    manualSelector?: boolean;
    parallelism?: number;
    selector?: LabelSelector;
    suspend?: boolean;
    template: PodTemplateSpec;
    ttlSecondsAfterFinished?: number;
}
export interface JobStatus {
    active?: number;
    completedIndexes?: string;
    completionTime?: Time;
    conditions?: JobCondition[];
    failed?: number;
    startTime?: Time;
    succeeded?: number;
    uncountedTerminatedPods?: UncountedTerminatedPods;
}
export interface JobTemplateSpec {
    metadata?: ObjectMeta;
    spec?: JobSpec;
}
export interface UncountedTerminatedPods {
    failed?: string[];
    succeeded?: string[];
}
export interface CertificateSigningRequest {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: CertificateSigningRequestSpec;
    status?: CertificateSigningRequestStatus;
}
export interface CertificateSigningRequestCondition {
    lastTransitionTime?: Time;
    lastUpdateTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface CertificateSigningRequestList {
    apiVersion?: string;
    items: CertificateSigningRequest[];
    kind?: string;
    metadata?: ListMeta;
}
export interface CertificateSigningRequestSpec {
    expirationSeconds?: number;
    extra?: {
        [key: string]: unknown;
    };
    groups?: string[];
    request: string;
    signerName: string;
    uid?: string;
    usages?: string[];
    username?: string;
}
export interface CertificateSigningRequestStatus {
    certificate?: string;
    conditions?: CertificateSigningRequestCondition[];
}
export interface Lease {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: LeaseSpec;
}
export interface LeaseList {
    apiVersion?: string;
    items: Lease[];
    kind?: string;
    metadata?: ListMeta;
}
export interface LeaseSpec {
    acquireTime?: MicroTime;
    holderIdentity?: string;
    leaseDurationSeconds?: number;
    leaseTransitions?: number;
    renewTime?: MicroTime;
}
export interface AWSElasticBlockStoreVolumeSource {
    fsType?: string;
    partition?: number;
    readOnly?: boolean;
    volumeID: string;
}
export interface Affinity {
    nodeAffinity?: NodeAffinity;
    podAffinity?: PodAffinity;
    podAntiAffinity?: PodAntiAffinity;
}
export interface AttachedVolume {
    devicePath: string;
    name: string;
}
export interface AzureDiskVolumeSource {
    cachingMode?: string;
    diskName: string;
    diskURI: string;
    fsType?: string;
    kind?: string;
    readOnly?: boolean;
}
export interface AzureFilePersistentVolumeSource {
    readOnly?: boolean;
    secretName: string;
    secretNamespace?: string;
    shareName: string;
}
export interface AzureFileVolumeSource {
    readOnly?: boolean;
    secretName: string;
    shareName: string;
}
export interface Binding {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    target: ObjectReference;
}
export interface CSIPersistentVolumeSource {
    controllerExpandSecretRef?: SecretReference;
    controllerPublishSecretRef?: SecretReference;
    driver: string;
    fsType?: string;
    nodePublishSecretRef?: SecretReference;
    nodeStageSecretRef?: SecretReference;
    readOnly?: boolean;
    volumeAttributes?: {
        [key: string]: unknown;
    };
    volumeHandle: string;
}
export interface CSIVolumeSource {
    driver: string;
    fsType?: string;
    nodePublishSecretRef?: LocalObjectReference;
    readOnly?: boolean;
    volumeAttributes?: {
        [key: string]: unknown;
    };
}
export interface Capabilities {
    add?: string[];
    drop?: string[];
}
export interface CephFSPersistentVolumeSource {
    monitors: string[];
    path?: string;
    readOnly?: boolean;
    secretFile?: string;
    secretRef?: SecretReference;
    user?: string;
}
export interface CephFSVolumeSource {
    monitors: string[];
    path?: string;
    readOnly?: boolean;
    secretFile?: string;
    secretRef?: LocalObjectReference;
    user?: string;
}
export interface CinderPersistentVolumeSource {
    fsType?: string;
    readOnly?: boolean;
    secretRef?: SecretReference;
    volumeID: string;
}
export interface CinderVolumeSource {
    fsType?: string;
    readOnly?: boolean;
    secretRef?: LocalObjectReference;
    volumeID: string;
}
export interface ClientIPConfig {
    timeoutSeconds?: number;
}
export interface ComponentCondition {
    error?: string;
    message?: string;
    status: string;
    type: string;
}
export interface ComponentStatus {
    apiVersion?: string;
    conditions?: ComponentCondition[];
    kind?: string;
    metadata?: ObjectMeta;
}
export interface ComponentStatusList {
    apiVersion?: string;
    items: ComponentStatus[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ConfigMap {
    apiVersion?: string;
    binaryData?: {
        [key: string]: unknown;
    };
    data?: {
        [key: string]: unknown;
    };
    immutable?: boolean;
    kind?: string;
    metadata?: ObjectMeta;
}
export interface ConfigMapEnvSource {
    name?: string;
    optional?: boolean;
}
export interface ConfigMapKeySelector {
    key: string;
    name?: string;
    optional?: boolean;
}
export interface ConfigMapList {
    apiVersion?: string;
    items: ConfigMap[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ConfigMapNodeConfigSource {
    kubeletConfigKey: string;
    name: string;
    namespace: string;
    resourceVersion?: string;
    uid?: string;
}
export interface ConfigMapProjection {
    items?: KeyToPath[];
    name?: string;
    optional?: boolean;
}
export interface ConfigMapVolumeSource {
    defaultMode?: number;
    items?: KeyToPath[];
    name?: string;
    optional?: boolean;
}
export interface Container {
    args?: string[];
    command?: string[];
    env?: EnvVar[];
    envFrom?: EnvFromSource[];
    image?: string;
    imagePullPolicy?: string;
    lifecycle?: Lifecycle;
    livenessProbe?: Probe;
    name: string;
    ports?: ContainerPort[];
    readinessProbe?: Probe;
    resources?: ResourceRequirements;
    securityContext?: SecurityContext;
    startupProbe?: Probe;
    stdin?: boolean;
    stdinOnce?: boolean;
    terminationMessagePath?: string;
    terminationMessagePolicy?: string;
    tty?: boolean;
    volumeDevices?: VolumeDevice[];
    volumeMounts?: VolumeMount[];
    workingDir?: string;
}
export interface ContainerImage {
    names?: string[];
    sizeBytes?: number;
}
export interface ContainerPort {
    containerPort: number;
    hostIP?: string;
    hostPort?: number;
    name?: string;
    protocol?: string;
}
export interface ContainerState {
    running?: ContainerStateRunning;
    terminated?: ContainerStateTerminated;
    waiting?: ContainerStateWaiting;
}
export interface ContainerStateRunning {
    startedAt?: Time;
}
export interface ContainerStateTerminated {
    containerID?: string;
    exitCode: number;
    finishedAt?: Time;
    message?: string;
    reason?: string;
    signal?: number;
    startedAt?: Time;
}
export interface ContainerStateWaiting {
    message?: string;
    reason?: string;
}
export interface ContainerStatus {
    containerID?: string;
    image: string;
    imageID: string;
    lastState?: ContainerState;
    name: string;
    ready: boolean;
    restartCount: number;
    started?: boolean;
    state?: ContainerState;
}
export interface DaemonEndpoint {
    Port: number;
}
export interface DownwardAPIProjection {
    items?: DownwardAPIVolumeFile[];
}
export interface DownwardAPIVolumeFile {
    fieldRef?: ObjectFieldSelector;
    mode?: number;
    path: string;
    resourceFieldRef?: ResourceFieldSelector;
}
export interface DownwardAPIVolumeSource {
    defaultMode?: number;
    items?: DownwardAPIVolumeFile[];
}
export interface EmptyDirVolumeSource {
    medium?: string;
    sizeLimit?: Quantity;
}
export interface EndpointAddress {
    hostname?: string;
    ip: string;
    nodeName?: string;
    targetRef?: ObjectReference;
}
export interface EndpointPort {
    appProtocol?: string;
    name?: string;
    port: number;
    protocol?: string;
}
export interface EndpointSubset {
    addresses?: EndpointAddress[];
    notReadyAddresses?: EndpointAddress[];
    ports?: EndpointPort[];
}
export interface Endpoints {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    subsets?: EndpointSubset[];
}
export interface EndpointsList {
    apiVersion?: string;
    items: Endpoints[];
    kind?: string;
    metadata?: ListMeta;
}
export interface EnvFromSource {
    configMapRef?: ConfigMapEnvSource;
    prefix?: string;
    secretRef?: SecretEnvSource;
}
export interface EnvVar {
    name: string;
    value?: string;
    valueFrom?: EnvVarSource;
}
export interface EnvVarSource {
    configMapKeyRef?: ConfigMapKeySelector;
    fieldRef?: ObjectFieldSelector;
    resourceFieldRef?: ResourceFieldSelector;
    secretKeyRef?: SecretKeySelector;
}
export interface EphemeralContainer {
    args?: string[];
    command?: string[];
    env?: EnvVar[];
    envFrom?: EnvFromSource[];
    image?: string;
    imagePullPolicy?: string;
    lifecycle?: Lifecycle;
    livenessProbe?: Probe;
    name: string;
    ports?: ContainerPort[];
    readinessProbe?: Probe;
    resources?: ResourceRequirements;
    securityContext?: SecurityContext;
    startupProbe?: Probe;
    stdin?: boolean;
    stdinOnce?: boolean;
    targetContainerName?: string;
    terminationMessagePath?: string;
    terminationMessagePolicy?: string;
    tty?: boolean;
    volumeDevices?: VolumeDevice[];
    volumeMounts?: VolumeMount[];
    workingDir?: string;
}
export interface EphemeralVolumeSource {
    volumeClaimTemplate?: PersistentVolumeClaimTemplate;
}
export interface Event {
    action?: string;
    apiVersion?: string;
    count?: number;
    eventTime?: MicroTime;
    firstTimestamp?: Time;
    involvedObject: ObjectReference;
    kind?: string;
    lastTimestamp?: Time;
    message?: string;
    metadata: ObjectMeta;
    reason?: string;
    related?: ObjectReference;
    reportingComponent?: string;
    reportingInstance?: string;
    series?: EventSeries;
    source?: EventSource;
    type?: string;
}
export interface EventList {
    apiVersion?: string;
    items: Event[];
    kind?: string;
    metadata?: ListMeta;
}
export interface EventSeries {
    count?: number;
    lastObservedTime?: MicroTime;
}
export interface EventSource {
    component?: string;
    host?: string;
}
export interface ExecAction {
    command?: string[];
}
export interface FCVolumeSource {
    fsType?: string;
    lun?: number;
    readOnly?: boolean;
    targetWWNs?: string[];
    wwids?: string[];
}
export interface FlexPersistentVolumeSource {
    driver: string;
    fsType?: string;
    options?: {
        [key: string]: unknown;
    };
    readOnly?: boolean;
    secretRef?: SecretReference;
}
export interface FlexVolumeSource {
    driver: string;
    fsType?: string;
    options?: {
        [key: string]: unknown;
    };
    readOnly?: boolean;
    secretRef?: LocalObjectReference;
}
export interface FlockerVolumeSource {
    datasetName?: string;
    datasetUUID?: string;
}
export interface GCEPersistentDiskVolumeSource {
    fsType?: string;
    partition?: number;
    pdName: string;
    readOnly?: boolean;
}
export interface GitRepoVolumeSource {
    directory?: string;
    repository: string;
    revision?: string;
}
export interface GlusterfsPersistentVolumeSource {
    endpoints: string;
    endpointsNamespace?: string;
    path: string;
    readOnly?: boolean;
}
export interface GlusterfsVolumeSource {
    endpoints: string;
    path: string;
    readOnly?: boolean;
}
export interface HTTPGetAction {
    host?: string;
    httpHeaders?: HTTPHeader[];
    path?: string;
    port: IntOrString;
    scheme?: string;
}
export interface HTTPHeader {
    name: string;
    value: string;
}
export interface Handler {
    exec?: ExecAction;
    httpGet?: HTTPGetAction;
    tcpSocket?: TCPSocketAction;
}
export interface HostAlias {
    hostnames?: string[];
    ip?: string;
}
export interface HostPathVolumeSource {
    path: string;
    type?: string;
}
export interface ISCSIPersistentVolumeSource {
    chapAuthDiscovery?: boolean;
    chapAuthSession?: boolean;
    fsType?: string;
    initiatorName?: string;
    iqn: string;
    iscsiInterface?: string;
    lun: number;
    portals?: string[];
    readOnly?: boolean;
    secretRef?: SecretReference;
    targetPortal: string;
}
export interface ISCSIVolumeSource {
    chapAuthDiscovery?: boolean;
    chapAuthSession?: boolean;
    fsType?: string;
    initiatorName?: string;
    iqn: string;
    iscsiInterface?: string;
    lun: number;
    portals?: string[];
    readOnly?: boolean;
    secretRef?: LocalObjectReference;
    targetPortal: string;
}
export interface KeyToPath {
    key: string;
    mode?: number;
    path: string;
}
export interface Lifecycle {
    postStart?: Handler;
    preStop?: Handler;
}
export interface LimitRange {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: LimitRangeSpec;
}
export interface LimitRangeItem {
    default?: {
        [key: string]: unknown;
    };
    defaultRequest?: {
        [key: string]: unknown;
    };
    max?: {
        [key: string]: unknown;
    };
    maxLimitRequestRatio?: {
        [key: string]: unknown;
    };
    min?: {
        [key: string]: unknown;
    };
    type: string;
}
export interface LimitRangeList {
    apiVersion?: string;
    items: LimitRange[];
    kind?: string;
    metadata?: ListMeta;
}
export interface LimitRangeSpec {
    limits: LimitRangeItem[];
}
export interface LoadBalancerIngress {
    hostname?: string;
    ip?: string;
    ports?: PortStatus[];
}
export interface LoadBalancerStatus {
    ingress?: LoadBalancerIngress[];
}
export interface LocalObjectReference {
    name?: string;
}
export interface LocalVolumeSource {
    fsType?: string;
    path: string;
}
export interface NFSVolumeSource {
    path: string;
    readOnly?: boolean;
    server: string;
}
export interface Namespace {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: NamespaceSpec;
    status?: NamespaceStatus;
}
export interface NamespaceCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface NamespaceList {
    apiVersion?: string;
    items: Namespace[];
    kind?: string;
    metadata?: ListMeta;
}
export interface NamespaceSpec {
    finalizers?: string[];
}
export interface NamespaceStatus {
    conditions?: NamespaceCondition[];
    phase?: string;
}
export interface Node {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: NodeSpec;
    status?: NodeStatus;
}
export interface NodeAddress {
    address: string;
    type: string;
}
export interface NodeAffinity {
    preferredDuringSchedulingIgnoredDuringExecution?: PreferredSchedulingTerm[];
    requiredDuringSchedulingIgnoredDuringExecution?: NodeSelector;
}
export interface NodeCondition {
    lastHeartbeatTime?: Time;
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface NodeConfigSource {
    configMap?: ConfigMapNodeConfigSource;
}
export interface NodeConfigStatus {
    active?: NodeConfigSource;
    assigned?: NodeConfigSource;
    error?: string;
    lastKnownGood?: NodeConfigSource;
}
export interface NodeDaemonEndpoints {
    kubeletEndpoint?: DaemonEndpoint;
}
export interface NodeList {
    apiVersion?: string;
    items: Node[];
    kind?: string;
    metadata?: ListMeta;
}
export interface NodeSelector {
    nodeSelectorTerms: NodeSelectorTerm[];
}
export interface NodeSelectorRequirement {
    key: string;
    operator: string;
    values?: string[];
}
export interface NodeSelectorTerm {
    matchExpressions?: NodeSelectorRequirement[];
    matchFields?: NodeSelectorRequirement[];
}
export interface NodeSpec {
    configSource?: NodeConfigSource;
    externalID?: string;
    podCIDR?: string;
    podCIDRs?: string[];
    providerID?: string;
    taints?: Taint[];
    unschedulable?: boolean;
}
export interface NodeStatus {
    addresses?: NodeAddress[];
    allocatable?: {
        [key: string]: unknown;
    };
    capacity?: {
        [key: string]: unknown;
    };
    conditions?: NodeCondition[];
    config?: NodeConfigStatus;
    daemonEndpoints?: NodeDaemonEndpoints;
    images?: ContainerImage[];
    nodeInfo?: NodeSystemInfo;
    phase?: string;
    volumesAttached?: AttachedVolume[];
    volumesInUse?: string[];
}
export interface NodeSystemInfo {
    architecture: string;
    bootID: string;
    containerRuntimeVersion: string;
    kernelVersion: string;
    kubeProxyVersion: string;
    kubeletVersion: string;
    machineID: string;
    operatingSystem: string;
    osImage: string;
    systemUUID: string;
}
export interface ObjectFieldSelector {
    apiVersion?: string;
    fieldPath: string;
}
export interface ObjectReference {
    apiVersion?: string;
    fieldPath?: string;
    kind?: string;
    name?: string;
    namespace?: string;
    resourceVersion?: string;
    uid?: string;
}
export interface PersistentVolume {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: PersistentVolumeSpec;
    status?: PersistentVolumeStatus;
}
export interface PersistentVolumeClaim {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: PersistentVolumeClaimSpec;
    status?: PersistentVolumeClaimStatus;
}
export interface PersistentVolumeClaimCondition {
    lastProbeTime?: Time;
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface PersistentVolumeClaimList {
    apiVersion?: string;
    items: PersistentVolumeClaim[];
    kind?: string;
    metadata?: ListMeta;
}
export interface PersistentVolumeClaimSpec {
    accessModes?: string[];
    dataSource?: TypedLocalObjectReference;
    dataSourceRef?: TypedLocalObjectReference;
    resources?: ResourceRequirements;
    selector?: LabelSelector;
    storageClassName?: string;
    volumeMode?: string;
    volumeName?: string;
}
export interface PersistentVolumeClaimStatus {
    accessModes?: string[];
    capacity?: {
        [key: string]: unknown;
    };
    conditions?: PersistentVolumeClaimCondition[];
    phase?: string;
}
export interface PersistentVolumeClaimTemplate {
    metadata?: ObjectMeta;
    spec: PersistentVolumeClaimSpec;
}
export interface PersistentVolumeClaimVolumeSource {
    claimName: string;
    readOnly?: boolean;
}
export interface PersistentVolumeList {
    apiVersion?: string;
    items: PersistentVolume[];
    kind?: string;
    metadata?: ListMeta;
}
export interface PersistentVolumeSpec {
    accessModes?: string[];
    awsElasticBlockStore?: AWSElasticBlockStoreVolumeSource;
    azureDisk?: AzureDiskVolumeSource;
    azureFile?: AzureFilePersistentVolumeSource;
    capacity?: {
        [key: string]: unknown;
    };
    cephfs?: CephFSPersistentVolumeSource;
    cinder?: CinderPersistentVolumeSource;
    claimRef?: ObjectReference;
    csi?: CSIPersistentVolumeSource;
    fc?: FCVolumeSource;
    flexVolume?: FlexPersistentVolumeSource;
    flocker?: FlockerVolumeSource;
    gcePersistentDisk?: GCEPersistentDiskVolumeSource;
    glusterfs?: GlusterfsPersistentVolumeSource;
    hostPath?: HostPathVolumeSource;
    iscsi?: ISCSIPersistentVolumeSource;
    local?: LocalVolumeSource;
    mountOptions?: string[];
    nfs?: NFSVolumeSource;
    nodeAffinity?: VolumeNodeAffinity;
    persistentVolumeReclaimPolicy?: string;
    photonPersistentDisk?: PhotonPersistentDiskVolumeSource;
    portworxVolume?: PortworxVolumeSource;
    quobyte?: QuobyteVolumeSource;
    rbd?: RBDPersistentVolumeSource;
    scaleIO?: ScaleIOPersistentVolumeSource;
    storageClassName?: string;
    storageos?: StorageOSPersistentVolumeSource;
    volumeMode?: string;
    vsphereVolume?: VsphereVirtualDiskVolumeSource;
}
export interface PersistentVolumeStatus {
    message?: string;
    phase?: string;
    reason?: string;
}
export interface PhotonPersistentDiskVolumeSource {
    fsType?: string;
    pdID: string;
}
export interface Pod {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: PodSpec;
    status?: PodStatus;
}
export interface PodAffinity {
    preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
    requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
}
export interface PodAffinityTerm {
    labelSelector?: LabelSelector;
    namespaceSelector?: LabelSelector;
    namespaces?: string[];
    topologyKey: string;
}
export interface PodAntiAffinity {
    preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
    requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
}
export interface PodCondition {
    lastProbeTime?: Time;
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface PodDNSConfig {
    nameservers?: string[];
    options?: PodDNSConfigOption[];
    searches?: string[];
}
export interface PodDNSConfigOption {
    name?: string;
    value?: string;
}
export interface PodIP {
    ip?: string;
}
export interface PodList {
    apiVersion?: string;
    items: Pod[];
    kind?: string;
    metadata?: ListMeta;
}
export interface PodReadinessGate {
    conditionType: string;
}
export interface PodSecurityContext {
    fsGroup?: number;
    fsGroupChangePolicy?: string;
    runAsGroup?: number;
    runAsNonRoot?: boolean;
    runAsUser?: number;
    seLinuxOptions?: SELinuxOptions;
    seccompProfile?: SeccompProfile;
    supplementalGroups?: number[];
    sysctls?: Sysctl[];
    windowsOptions?: WindowsSecurityContextOptions;
}
export interface PodSpec {
    activeDeadlineSeconds?: number;
    affinity?: Affinity;
    automountServiceAccountToken?: boolean;
    containers: Container[];
    dnsConfig?: PodDNSConfig;
    dnsPolicy?: string;
    enableServiceLinks?: boolean;
    ephemeralContainers?: EphemeralContainer[];
    hostAliases?: HostAlias[];
    hostIPC?: boolean;
    hostNetwork?: boolean;
    hostPID?: boolean;
    hostname?: string;
    imagePullSecrets?: LocalObjectReference[];
    initContainers?: Container[];
    nodeName?: string;
    nodeSelector?: {
        [key: string]: unknown;
    };
    overhead?: {
        [key: string]: unknown;
    };
    preemptionPolicy?: string;
    priority?: number;
    priorityClassName?: string;
    readinessGates?: PodReadinessGate[];
    restartPolicy?: string;
    runtimeClassName?: string;
    schedulerName?: string;
    securityContext?: PodSecurityContext;
    serviceAccount?: string;
    serviceAccountName?: string;
    setHostnameAsFQDN?: boolean;
    shareProcessNamespace?: boolean;
    subdomain?: string;
    terminationGracePeriodSeconds?: number;
    tolerations?: Toleration[];
    topologySpreadConstraints?: TopologySpreadConstraint[];
    volumes?: Volume[];
}
export interface PodStatus {
    conditions?: PodCondition[];
    containerStatuses?: ContainerStatus[];
    ephemeralContainerStatuses?: ContainerStatus[];
    hostIP?: string;
    initContainerStatuses?: ContainerStatus[];
    message?: string;
    nominatedNodeName?: string;
    phase?: string;
    podIP?: string;
    podIPs?: PodIP[];
    qosClass?: string;
    reason?: string;
    startTime?: Time;
}
export interface PodTemplate {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    template?: PodTemplateSpec;
}
export interface PodTemplateList {
    apiVersion?: string;
    items: PodTemplate[];
    kind?: string;
    metadata?: ListMeta;
}
export interface PodTemplateSpec {
    metadata?: ObjectMeta;
    spec?: PodSpec;
}
export interface PortStatus {
    error?: string;
    port: number;
    protocol: string;
}
export interface PortworxVolumeSource {
    fsType?: string;
    readOnly?: boolean;
    volumeID: string;
}
export interface PreferredSchedulingTerm {
    preference: NodeSelectorTerm;
    weight: number;
}
export interface Probe {
    exec?: ExecAction;
    failureThreshold?: number;
    httpGet?: HTTPGetAction;
    initialDelaySeconds?: number;
    periodSeconds?: number;
    successThreshold?: number;
    tcpSocket?: TCPSocketAction;
    terminationGracePeriodSeconds?: number;
    timeoutSeconds?: number;
}
export interface ProjectedVolumeSource {
    defaultMode?: number;
    sources?: VolumeProjection[];
}
export interface QuobyteVolumeSource {
    group?: string;
    readOnly?: boolean;
    registry: string;
    tenant?: string;
    user?: string;
    volume: string;
}
export interface RBDPersistentVolumeSource {
    fsType?: string;
    image: string;
    keyring?: string;
    monitors: string[];
    pool?: string;
    readOnly?: boolean;
    secretRef?: SecretReference;
    user?: string;
}
export interface RBDVolumeSource {
    fsType?: string;
    image: string;
    keyring?: string;
    monitors: string[];
    pool?: string;
    readOnly?: boolean;
    secretRef?: LocalObjectReference;
    user?: string;
}
export interface ReplicationController {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: ReplicationControllerSpec;
    status?: ReplicationControllerStatus;
}
export interface ReplicationControllerCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface ReplicationControllerList {
    apiVersion?: string;
    items: ReplicationController[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ReplicationControllerSpec {
    minReadySeconds?: number;
    replicas?: number;
    selector?: {
        [key: string]: unknown;
    };
    template?: PodTemplateSpec;
}
export interface ReplicationControllerStatus {
    availableReplicas?: number;
    conditions?: ReplicationControllerCondition[];
    fullyLabeledReplicas?: number;
    observedGeneration?: number;
    readyReplicas?: number;
    replicas: number;
}
export interface ResourceFieldSelector {
    containerName?: string;
    divisor?: Quantity;
    resource: string;
}
export interface ResourceQuota {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: ResourceQuotaSpec;
    status?: ResourceQuotaStatus;
}
export interface ResourceQuotaList {
    apiVersion?: string;
    items: ResourceQuota[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ResourceQuotaSpec {
    hard?: {
        [key: string]: unknown;
    };
    scopeSelector?: ScopeSelector;
    scopes?: string[];
}
export interface ResourceQuotaStatus {
    hard?: {
        [key: string]: unknown;
    };
    used?: {
        [key: string]: unknown;
    };
}
export interface ResourceRequirements {
    limits?: {
        [key: string]: unknown;
    };
    requests?: {
        [key: string]: unknown;
    };
}
export interface SELinuxOptions {
    level?: string;
    role?: string;
    type?: string;
    user?: string;
}
export interface ScaleIOPersistentVolumeSource {
    fsType?: string;
    gateway: string;
    protectionDomain?: string;
    readOnly?: boolean;
    secretRef: SecretReference;
    sslEnabled?: boolean;
    storageMode?: string;
    storagePool?: string;
    system: string;
    volumeName?: string;
}
export interface ScaleIOVolumeSource {
    fsType?: string;
    gateway: string;
    protectionDomain?: string;
    readOnly?: boolean;
    secretRef: LocalObjectReference;
    sslEnabled?: boolean;
    storageMode?: string;
    storagePool?: string;
    system: string;
    volumeName?: string;
}
export interface ScopeSelector {
    matchExpressions?: ScopedResourceSelectorRequirement[];
}
export interface ScopedResourceSelectorRequirement {
    operator: string;
    scopeName: string;
    values?: string[];
}
export interface SeccompProfile {
    localhostProfile?: string;
    type: string;
}
export interface Secret {
    apiVersion?: string;
    data?: {
        [key: string]: unknown;
    };
    immutable?: boolean;
    kind?: string;
    metadata?: ObjectMeta;
    stringData?: {
        [key: string]: unknown;
    };
    type?: string;
}
export interface SecretEnvSource {
    name?: string;
    optional?: boolean;
}
export interface SecretKeySelector {
    key: string;
    name?: string;
    optional?: boolean;
}
export interface SecretList {
    apiVersion?: string;
    items: Secret[];
    kind?: string;
    metadata?: ListMeta;
}
export interface SecretProjection {
    items?: KeyToPath[];
    name?: string;
    optional?: boolean;
}
export interface SecretReference {
    name?: string;
    namespace?: string;
}
export interface SecretVolumeSource {
    defaultMode?: number;
    items?: KeyToPath[];
    optional?: boolean;
    secretName?: string;
}
export interface SecurityContext {
    allowPrivilegeEscalation?: boolean;
    capabilities?: Capabilities;
    privileged?: boolean;
    procMount?: string;
    readOnlyRootFilesystem?: boolean;
    runAsGroup?: number;
    runAsNonRoot?: boolean;
    runAsUser?: number;
    seLinuxOptions?: SELinuxOptions;
    seccompProfile?: SeccompProfile;
    windowsOptions?: WindowsSecurityContextOptions;
}
export interface Service {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: ServiceSpec;
    status?: ServiceStatus;
}
export interface ServiceAccount {
    apiVersion?: string;
    automountServiceAccountToken?: boolean;
    imagePullSecrets?: LocalObjectReference[];
    kind?: string;
    metadata?: ObjectMeta;
    secrets?: ObjectReference[];
}
export interface ServiceAccountList {
    apiVersion?: string;
    items: ServiceAccount[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ServiceAccountTokenProjection {
    audience?: string;
    expirationSeconds?: number;
    path: string;
}
export interface ServiceList {
    apiVersion?: string;
    items: Service[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ServicePort {
    appProtocol?: string;
    name?: string;
    nodePort?: number;
    port: number;
    protocol?: string;
    targetPort?: IntOrString;
}
export interface ServiceSpec {
    allocateLoadBalancerNodePorts?: boolean;
    clusterIP?: string;
    clusterIPs?: string[];
    externalIPs?: string[];
    externalName?: string;
    externalTrafficPolicy?: string;
    healthCheckNodePort?: number;
    internalTrafficPolicy?: string;
    ipFamilies?: string[];
    ipFamilyPolicy?: string;
    loadBalancerClass?: string;
    loadBalancerIP?: string;
    loadBalancerSourceRanges?: string[];
    ports?: ServicePort[];
    publishNotReadyAddresses?: boolean;
    selector?: {
        [key: string]: unknown;
    };
    sessionAffinity?: string;
    sessionAffinityConfig?: SessionAffinityConfig;
    type?: string;
}
export interface ServiceStatus {
    conditions?: Condition[];
    loadBalancer?: LoadBalancerStatus;
}
export interface SessionAffinityConfig {
    clientIP?: ClientIPConfig;
}
export interface StorageOSPersistentVolumeSource {
    fsType?: string;
    readOnly?: boolean;
    secretRef?: ObjectReference;
    volumeName?: string;
    volumeNamespace?: string;
}
export interface StorageOSVolumeSource {
    fsType?: string;
    readOnly?: boolean;
    secretRef?: LocalObjectReference;
    volumeName?: string;
    volumeNamespace?: string;
}
export interface Sysctl {
    name: string;
    value: string;
}
export interface TCPSocketAction {
    host?: string;
    port: IntOrString;
}
export interface Taint {
    effect: string;
    key: string;
    timeAdded?: Time;
    value?: string;
}
export interface Toleration {
    effect?: string;
    key?: string;
    operator?: string;
    tolerationSeconds?: number;
    value?: string;
}
export interface TopologySelectorLabelRequirement {
    key: string;
    values: string[];
}
export interface TopologySelectorTerm {
    matchLabelExpressions?: TopologySelectorLabelRequirement[];
}
export interface TopologySpreadConstraint {
    labelSelector?: LabelSelector;
    maxSkew: number;
    topologyKey: string;
    whenUnsatisfiable: string;
}
export interface TypedLocalObjectReference {
    apiGroup?: string;
    kind: string;
    name: string;
}
export interface Volume {
    awsElasticBlockStore?: AWSElasticBlockStoreVolumeSource;
    azureDisk?: AzureDiskVolumeSource;
    azureFile?: AzureFileVolumeSource;
    cephfs?: CephFSVolumeSource;
    cinder?: CinderVolumeSource;
    configMap?: ConfigMapVolumeSource;
    csi?: CSIVolumeSource;
    downwardAPI?: DownwardAPIVolumeSource;
    emptyDir?: EmptyDirVolumeSource;
    ephemeral?: EphemeralVolumeSource;
    fc?: FCVolumeSource;
    flexVolume?: FlexVolumeSource;
    flocker?: FlockerVolumeSource;
    gcePersistentDisk?: GCEPersistentDiskVolumeSource;
    gitRepo?: GitRepoVolumeSource;
    glusterfs?: GlusterfsVolumeSource;
    hostPath?: HostPathVolumeSource;
    iscsi?: ISCSIVolumeSource;
    name: string;
    nfs?: NFSVolumeSource;
    persistentVolumeClaim?: PersistentVolumeClaimVolumeSource;
    photonPersistentDisk?: PhotonPersistentDiskVolumeSource;
    portworxVolume?: PortworxVolumeSource;
    projected?: ProjectedVolumeSource;
    quobyte?: QuobyteVolumeSource;
    rbd?: RBDVolumeSource;
    scaleIO?: ScaleIOVolumeSource;
    secret?: SecretVolumeSource;
    storageos?: StorageOSVolumeSource;
    vsphereVolume?: VsphereVirtualDiskVolumeSource;
}
export interface VolumeDevice {
    devicePath: string;
    name: string;
}
export interface VolumeMount {
    mountPath: string;
    mountPropagation?: string;
    name: string;
    readOnly?: boolean;
    subPath?: string;
    subPathExpr?: string;
}
export interface VolumeNodeAffinity {
    required?: NodeSelector;
}
export interface VolumeProjection {
    configMap?: ConfigMapProjection;
    downwardAPI?: DownwardAPIProjection;
    secret?: SecretProjection;
    serviceAccountToken?: ServiceAccountTokenProjection;
}
export interface VsphereVirtualDiskVolumeSource {
    fsType?: string;
    storagePolicyID?: string;
    storagePolicyName?: string;
    volumePath: string;
}
export interface WeightedPodAffinityTerm {
    podAffinityTerm: PodAffinityTerm;
    weight: number;
}
export interface WindowsSecurityContextOptions {
    gmsaCredentialSpec?: string;
    gmsaCredentialSpecName?: string;
    hostProcess?: boolean;
    runAsUserName?: string;
}
export interface Endpoint {
    addresses: string[];
    conditions?: EndpointConditions;
    deprecatedTopology?: {
        [key: string]: unknown;
    };
    hints?: EndpointHints;
    hostname?: string;
    nodeName?: string;
    targetRef?: ObjectReference;
    zone?: string;
}
export interface EndpointConditions {
    ready?: boolean;
    serving?: boolean;
    terminating?: boolean;
}
export interface EndpointHints {
    forZones?: ForZone[];
}
export interface DiscoveryEndpointPort {
    appProtocol?: string;
    name?: string;
    port?: number;
    protocol?: string;
}
export interface EndpointSlice {
    addressType: string;
    apiVersion?: string;
    endpoints: Endpoint[];
    kind?: string;
    metadata?: ObjectMeta;
    ports?: DiscoveryEndpointPort[];
}
export interface EndpointSliceList {
    apiVersion?: string;
    items: EndpointSlice[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ForZone {
    name: string;
}
export interface EventList {
    apiVersion?: string;
    items: Event[];
    kind?: string;
    metadata?: ListMeta;
}
export interface HTTPIngressPath {
    backend: IngressBackend;
    path?: string;
    pathType: string;
}
export interface HTTPIngressRuleValue {
    paths: HTTPIngressPath[];
}
export interface IPBlock {
    cidr: string;
    except?: string[];
}
export interface Ingress {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: IngressSpec;
    status?: IngressStatus;
}
export interface IngressBackend {
    resource?: TypedLocalObjectReference;
    service?: IngressServiceBackend;
}
export interface IngressClass {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: IngressClassSpec;
}
export interface IngressClassList {
    apiVersion?: string;
    items: IngressClass[];
    kind?: string;
    metadata?: ListMeta;
}
export interface IngressClassParametersReference {
    apiGroup?: string;
    kind: string;
    name: string;
    namespace?: string;
    scope?: string;
}
export interface IngressClassSpec {
    controller?: string;
    parameters?: IngressClassParametersReference;
}
export interface IngressList {
    apiVersion?: string;
    items: Ingress[];
    kind?: string;
    metadata?: ListMeta;
}
export interface IngressRule {
    host?: string;
    http?: HTTPIngressRuleValue;
}
export interface IngressServiceBackend {
    name: string;
    port?: ServiceBackendPort;
}
export interface IngressSpec {
    defaultBackend?: IngressBackend;
    ingressClassName?: string;
    rules?: IngressRule[];
    tls?: IngressTLS[];
}
export interface IngressStatus {
    loadBalancer?: LoadBalancerStatus;
}
export interface IngressTLS {
    hosts?: string[];
    secretName?: string;
}
export interface NetworkPolicy {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: NetworkPolicySpec;
}
export interface NetworkPolicyEgressRule {
    ports?: NetworkPolicyPort[];
    to?: NetworkPolicyPeer[];
}
export interface NetworkPolicyIngressRule {
    from?: NetworkPolicyPeer[];
    ports?: NetworkPolicyPort[];
}
export interface NetworkPolicyList {
    apiVersion?: string;
    items: NetworkPolicy[];
    kind?: string;
    metadata?: ListMeta;
}
export interface NetworkPolicyPeer {
    ipBlock?: IPBlock;
    namespaceSelector?: LabelSelector;
    podSelector?: LabelSelector;
}
export interface NetworkPolicyPort {
    endPort?: number;
    port?: IntOrString;
    protocol?: string;
}
export interface NetworkPolicySpec {
    egress?: NetworkPolicyEgressRule[];
    ingress?: NetworkPolicyIngressRule[];
    podSelector: LabelSelector;
    policyTypes?: string[];
}
export interface ServiceBackendPort {
    name?: string;
    number?: number;
}
export interface Overhead {
    podFixed?: {
        [key: string]: unknown;
    };
}
export interface RuntimeClass {
    apiVersion?: string;
    handler: string;
    kind?: string;
    metadata?: ObjectMeta;
    overhead?: Overhead;
    scheduling?: Scheduling;
}
export interface RuntimeClassList {
    apiVersion?: string;
    items: RuntimeClass[];
    kind?: string;
    metadata?: ListMeta;
}
export interface Scheduling {
    nodeSelector?: {
        [key: string]: unknown;
    };
    tolerations?: Toleration[];
}
export interface Eviction {
    apiVersion?: string;
    deleteOptions?: DeleteOptions;
    kind?: string;
    metadata?: ObjectMeta;
}
export interface PodDisruptionBudget {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: PodDisruptionBudgetSpec;
    status?: PodDisruptionBudgetStatus;
}
export interface PodDisruptionBudgetList {
    apiVersion?: string;
    items: PodDisruptionBudget[];
    kind?: string;
    metadata?: ListMeta;
}
export interface PodDisruptionBudgetSpec {
    maxUnavailable?: IntOrString;
    minAvailable?: IntOrString;
    selector?: LabelSelector;
}
export interface PodDisruptionBudgetStatus {
    conditions?: Condition[];
    currentHealthy: number;
    desiredHealthy: number;
    disruptedPods?: {
        [key: string]: unknown;
    };
    disruptionsAllowed: number;
    expectedPods: number;
    observedGeneration?: number;
}
export interface AggregationRule {
    clusterRoleSelectors?: LabelSelector[];
}
export interface ClusterRole {
    aggregationRule?: AggregationRule;
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    rules?: PolicyRule[];
}
export interface ClusterRoleBinding {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    roleRef: RoleRef;
    subjects?: Subject[];
}
export interface ClusterRoleBindingList {
    apiVersion?: string;
    items: ClusterRoleBinding[];
    kind?: string;
    metadata?: ListMeta;
}
export interface ClusterRoleList {
    apiVersion?: string;
    items: ClusterRole[];
    kind?: string;
    metadata?: ListMeta;
}
export interface PolicyRule {
    apiGroups?: string[];
    nonResourceURLs?: string[];
    resourceNames?: string[];
    resources?: string[];
    verbs: string[];
}
export interface Role {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    rules?: PolicyRule[];
}
export interface RoleBinding {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    roleRef: RoleRef;
    subjects?: Subject[];
}
export interface RoleBindingList {
    apiVersion?: string;
    items: RoleBinding[];
    kind?: string;
    metadata?: ListMeta;
}
export interface RoleList {
    apiVersion?: string;
    items: Role[];
    kind?: string;
    metadata?: ListMeta;
}
export interface RoleRef {
    apiGroup: string;
    kind: string;
    name: string;
}
export interface Subject {
    apiGroup?: string;
    kind: string;
    name: string;
    namespace?: string;
}
export interface PriorityClass {
    apiVersion?: string;
    description?: string;
    globalDefault?: boolean;
    kind?: string;
    metadata?: ObjectMeta;
    preemptionPolicy?: string;
    value: number;
}
export interface PriorityClassList {
    apiVersion?: string;
    items: PriorityClass[];
    kind?: string;
    metadata?: ListMeta;
}
export interface CSIDriver {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: CSIDriverSpec;
}
export interface CSIDriverList {
    apiVersion?: string;
    items: CSIDriver[];
    kind?: string;
    metadata?: ListMeta;
}
export interface CSIDriverSpec {
    attachRequired?: boolean;
    fsGroupPolicy?: string;
    podInfoOnMount?: boolean;
    requiresRepublish?: boolean;
    storageCapacity?: boolean;
    tokenRequests?: TokenRequest[];
    volumeLifecycleModes?: string[];
}
export interface CSINode {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: CSINodeSpec;
}
export interface CSINodeDriver {
    allocatable?: VolumeNodeResources;
    name: string;
    nodeID: string;
    topologyKeys?: string[];
}
export interface CSINodeList {
    apiVersion?: string;
    items: CSINode[];
    kind?: string;
    metadata?: ListMeta;
}
export interface CSINodeSpec {
    drivers: CSINodeDriver[];
}
export interface StorageClass {
    allowVolumeExpansion?: boolean;
    allowedTopologies?: TopologySelectorTerm[];
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    mountOptions?: string[];
    parameters?: {
        [key: string]: unknown;
    };
    provisioner: string;
    reclaimPolicy?: string;
    volumeBindingMode?: string;
}
export interface StorageClassList {
    apiVersion?: string;
    items: StorageClass[];
    kind?: string;
    metadata?: ListMeta;
}
export interface TokenRequest {
    audience: string;
    expirationSeconds?: number;
}
export interface VolumeAttachment {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: VolumeAttachmentSpec;
    status?: VolumeAttachmentStatus;
}
export interface VolumeAttachmentList {
    apiVersion?: string;
    items: VolumeAttachment[];
    kind?: string;
    metadata?: ListMeta;
}
export interface VolumeAttachmentSource {
    inlineVolumeSpec?: PersistentVolumeSpec;
    persistentVolumeName?: string;
}
export interface VolumeAttachmentSpec {
    attacher: string;
    nodeName: string;
    source: VolumeAttachmentSource;
}
export interface VolumeAttachmentStatus {
    attachError?: VolumeError;
    attached: boolean;
    attachmentMetadata?: {
        [key: string]: unknown;
    };
    detachError?: VolumeError;
}
export interface VolumeError {
    message?: string;
    time?: Time;
}
export interface VolumeNodeResources {
    count?: number;
}
export interface CustomResourceColumnDefinition {
    description?: string;
    format?: string;
    jsonPath: string;
    name: string;
    priority?: number;
    type: string;
}
export interface CustomResourceConversion {
    strategy: string;
    webhook?: WebhookConversion;
}
export interface CustomResourceDefinition {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec: CustomResourceDefinitionSpec;
    status?: CustomResourceDefinitionStatus;
}
export interface CustomResourceDefinitionCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface CustomResourceDefinitionList {
    apiVersion?: string;
    items: CustomResourceDefinition[];
    kind?: string;
    metadata?: ListMeta;
}
export interface CustomResourceDefinitionNames {
    categories?: string[];
    kind: string;
    listKind?: string;
    plural: string;
    shortNames?: string[];
    singular?: string;
}
export interface CustomResourceDefinitionSpec {
    conversion?: CustomResourceConversion;
    group: string;
    names: CustomResourceDefinitionNames;
    preserveUnknownFields?: boolean;
    scope: string;
    versions: CustomResourceDefinitionVersion[];
}
export interface CustomResourceDefinitionStatus {
    acceptedNames?: CustomResourceDefinitionNames;
    conditions?: CustomResourceDefinitionCondition[];
    storedVersions?: string[];
}
export interface CustomResourceDefinitionVersion {
    additionalPrinterColumns?: CustomResourceColumnDefinition[];
    deprecated?: boolean;
    deprecationWarning?: string;
    name: string;
    schema?: CustomResourceValidation;
    served: boolean;
    storage: boolean;
    subresources?: CustomResourceSubresources;
}
export interface CustomResourceSubresourceScale {
    labelSelectorPath?: string;
    specReplicasPath: string;
    statusReplicasPath: string;
}
export type CustomResourceSubresourceStatus = {
    [key: string]: unknown;
};
export interface CustomResourceSubresources {
    scale?: CustomResourceSubresourceScale;
    status?: CustomResourceSubresourceStatus;
}
export interface CustomResourceValidation {
    openAPIV3Schema?: JSONSchemaProps;
}
export interface ExternalDocumentation {
    description?: string;
    url?: string;
}
export type JSON = any;
export interface JSONSchemaProps {
    $ref?: string;
    $schema?: string;
    additionalItems?: JSONSchemaPropsOrBool;
    additionalProperties?: JSONSchemaPropsOrBool;
    allOf?: JSONSchemaProps[];
    anyOf?: JSONSchemaProps[];
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
    "x-kubernetes-embedded-resource"?: boolean;
    "x-kubernetes-int-or-string"?: boolean;
    "x-kubernetes-list-map-keys"?: string[];
    "x-kubernetes-list-type"?: string;
    "x-kubernetes-map-type"?: string;
    "x-kubernetes-preserve-unknown-fields"?: boolean;
}
export type JSONSchemaPropsOrArray = any;
export type JSONSchemaPropsOrBool = any;
export type JSONSchemaPropsOrStringArray = any;
export interface ApiExtServiceReference {
    name: string;
    namespace: string;
    path?: string;
    port?: number;
}
export interface ApiExtWebhookClientConfig {
    caBundle?: string;
    service?: ApiExtServiceReference;
    url?: string;
}
export interface WebhookConversion {
    clientConfig?: ApiExtWebhookClientConfig;
    conversionReviewVersions: string[];
}
export type Quantity = string;
export interface APIGroup {
    apiVersion?: string;
    kind?: string;
    name: string;
    preferredVersion?: GroupVersionForDiscovery;
    serverAddressByClientCIDRs?: ServerAddressByClientCIDR[];
    versions: GroupVersionForDiscovery[];
}
export interface APIGroupList {
    apiVersion?: string;
    groups: APIGroup[];
    kind?: string;
}
export interface APIResource {
    categories?: string[];
    group?: string;
    kind: string;
    name: string;
    namespaced: boolean;
    shortNames?: string[];
    singularName: string;
    storageVersionHash?: string;
    verbs: string[];
    version?: string;
}
export interface APIResourceList {
    apiVersion?: string;
    groupVersion: string;
    kind?: string;
    resources: APIResource[];
}
export interface APIVersions {
    apiVersion?: string;
    kind?: string;
    serverAddressByClientCIDRs: ServerAddressByClientCIDR[];
    versions: string[];
}
export interface Condition {
    lastTransitionTime: Time;
    message: string;
    observedGeneration?: number;
    reason: string;
    status: string;
    type: string;
}
export interface DeleteOptions {
    apiVersion?: string;
    dryRun?: string[];
    gracePeriodSeconds?: number;
    kind?: string;
    orphanDependents?: boolean;
    preconditions?: Preconditions;
    propagationPolicy?: string;
}
export type FieldsV1 = {
    [key: string]: unknown;
};
export interface GroupVersionForDiscovery {
    groupVersion: string;
    version: string;
}
export interface LabelSelector {
    matchExpressions?: LabelSelectorRequirement[];
    matchLabels?: {
        [key: string]: unknown;
    };
}
export interface LabelSelectorRequirement {
    key: string;
    operator: string;
    values?: string[];
}
export interface ListMeta {
    continue?: string;
    remainingItemCount?: number;
    resourceVersion?: string;
    selfLink?: string;
}
export interface ManagedFieldsEntry {
    apiVersion?: string;
    fieldsType?: string;
    fieldsV1?: FieldsV1;
    manager?: string;
    operation?: string;
    subresource?: string;
    time?: Time;
}
export type MicroTime = string;
export interface ObjectMeta {
    annotations?: {
        [key: string]: unknown;
    };
    clusterName?: string;
    creationTimestamp?: Time;
    deletionGracePeriodSeconds?: number;
    deletionTimestamp?: Time;
    finalizers?: string[];
    generateName?: string;
    generation?: number;
    labels?: {
        [key: string]: unknown;
    };
    managedFields?: ManagedFieldsEntry[];
    name?: string;
    namespace?: string;
    ownerReferences?: OwnerReference[];
    resourceVersion?: string;
    selfLink?: string;
    uid?: string;
}
export interface OwnerReference {
    apiVersion: string;
    blockOwnerDeletion?: boolean;
    controller?: boolean;
    kind: string;
    name: string;
    uid: string;
}
export type Patch = {
    [key: string]: unknown;
};
export interface Preconditions {
    resourceVersion?: string;
    uid?: string;
}
export interface ServerAddressByClientCIDR {
    clientCIDR: string;
    serverAddress: string;
}
export interface Status {
    apiVersion?: string;
    code?: number;
    details?: StatusDetails;
    kind?: string;
    message?: string;
    metadata?: ListMeta;
    reason?: string;
    status?: string;
}
export interface StatusCause {
    field?: string;
    message?: string;
    reason?: string;
}
export interface StatusDetails {
    causes?: StatusCause[];
    group?: string;
    kind?: string;
    name?: string;
    retryAfterSeconds?: number;
    uid?: string;
}
export type Time = string;
export interface WatchEvent {
    object: RawExtension;
    type: string;
}
export type RawExtension = {
    [key: string]: unknown;
};
export type IntOrString = string;
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
export interface APIService {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMeta;
    spec?: APIServiceSpec;
    status?: APIServiceStatus;
}
export interface APIServiceCondition {
    lastTransitionTime?: Time;
    message?: string;
    reason?: string;
    status: string;
    type: string;
}
export interface APIServiceList {
    apiVersion?: string;
    items: APIService[];
    kind?: string;
    metadata?: ListMeta;
}
export interface APIServiceSpec {
    caBundle?: string;
    group?: string;
    groupPriorityMinimum: number;
    insecureSkipTLSVerify?: boolean;
    service?: ServiceReference;
    version?: string;
    versionPriority: number;
}
export interface APIServiceStatus {
    conditions?: APIServiceCondition[];
}
export interface ServiceReference {
    name?: string;
    namespace?: string;
    port?: number;
}
export interface GetServiceAccountIssuerOpenIDConfigurationRequest {
}
export interface GetCoreAPIVersionsRequest {
}
export interface GetCoreV1APIResourcesRequest {
}
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
export interface GetAPIVersionsRequest {
}
export interface GetAdmissionregistrationAPIGroupRequest {
}
export interface GetAdmissionregistrationV1APIResourcesRequest {
}
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
export interface GetApiextensionsAPIGroupRequest {
}
export interface GetApiextensionsV1APIResourcesRequest {
}
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
export interface GetApiregistrationAPIGroupRequest {
}
export interface GetApiregistrationV1APIResourcesRequest {
}
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
export interface GetAppsAPIGroupRequest {
}
export interface GetAppsV1APIResourcesRequest {
}
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
export interface GetAuthenticationAPIGroupRequest {
}
export interface GetAuthenticationV1APIResourcesRequest {
}
export interface CreateAuthenticationV1TokenReviewRequest {
    query: {
        dryRun?: string;
        fieldManager?: string;
        pretty?: string;
    };
    body: TokenReview;
}
export interface GetAuthorizationAPIGroupRequest {
}
export interface GetAuthorizationV1APIResourcesRequest {
}
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
export interface GetAutoscalingAPIGroupRequest {
}
export interface GetAutoscalingV1APIResourcesRequest {
}
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
export interface GetAutoscalingV2beta2APIResourcesRequest {
}
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
export interface GetBatchAPIGroupRequest {
}
export interface GetBatchV1APIResourcesRequest {
}
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
export interface GetCertificatesAPIGroupRequest {
}
export interface GetCertificatesV1APIResourcesRequest {
}
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
export interface GetCoordinationAPIGroupRequest {
}
export interface GetCoordinationV1APIResourcesRequest {
}
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
export interface GetDiscoveryAPIGroupRequest {
}
export interface GetDiscoveryV1APIResourcesRequest {
}
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
export interface GetEventsAPIGroupRequest {
}
export interface GetEventsV1APIResourcesRequest {
}
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
export interface GetFlowcontrolApiserverAPIGroupRequest {
}
export interface GetNetworkingAPIGroupRequest {
}
export interface GetNetworkingV1APIResourcesRequest {
}
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
export interface GetNodeAPIGroupRequest {
}
export interface GetNodeV1APIResourcesRequest {
}
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
export interface GetPolicyAPIGroupRequest {
}
export interface GetPolicyV1APIResourcesRequest {
}
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
export interface GetRbacAuthorizationAPIGroupRequest {
}
export interface GetRbacAuthorizationV1APIResourcesRequest {
}
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
export interface GetSchedulingAPIGroupRequest {
}
export interface GetSchedulingV1APIResourcesRequest {
}
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
export interface GetStorageAPIGroupRequest {
}
export interface GetStorageV1APIResourcesRequest {
}
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
export interface LogFileListHandlerRequest {
}
export interface LogFileHandlerRequest {
    path: {
        logpath: string;
    };
}
export interface GetServiceAccountIssuerOpenIDKeysetRequest {
}
export interface GetCodeVersionRequest {
}
export declare class KubernetesClient extends APIClient {
    constructor(options: any);
    getSwaggerJSON(): Promise<unknown>;
    getServiceAccountIssuerOpenIDConfiguration(params: GetServiceAccountIssuerOpenIDConfigurationRequest, opts?: APIClientRequestOpts): Promise<string>;
    getCoreAPIVersions(params: GetCoreAPIVersionsRequest, opts?: APIClientRequestOpts): Promise<APIVersions>;
    getCoreV1APIResources(params: GetCoreV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listCoreV1ComponentStatus(params: ListCoreV1ComponentStatusRequest, opts?: APIClientRequestOpts): Promise<ComponentStatusList>;
    readCoreV1ComponentStatus(params: ReadCoreV1ComponentStatusRequest, opts?: APIClientRequestOpts): Promise<ComponentStatus>;
    listCoreV1ConfigMapForAllNamespaces(params: ListCoreV1ConfigMapForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ConfigMapList>;
    listCoreV1EndpointsForAllNamespaces(params: ListCoreV1EndpointsForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EndpointsList>;
    listCoreV1EventForAllNamespaces(params: ListCoreV1EventForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EventList>;
    listCoreV1LimitRangeForAllNamespaces(params: ListCoreV1LimitRangeForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<LimitRangeList>;
    listCoreV1Namespace(params: ListCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<NamespaceList>;
    createCoreV1Namespace(params: CreateCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    createCoreV1NamespacedBinding(params: CreateCoreV1NamespacedBindingRequest, opts?: APIClientRequestOpts): Promise<Binding>;
    listCoreV1NamespacedConfigMap(params: ListCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMapList>;
    createCoreV1NamespacedConfigMap(params: CreateCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap>;
    deleteCoreV1CollectionNamespacedConfigMap(params: DeleteCoreV1CollectionNamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedConfigMap(params: ReadCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap>;
    replaceCoreV1NamespacedConfigMap(params: ReplaceCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap>;
    deleteCoreV1NamespacedConfigMap(params: DeleteCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedConfigMap(params: PatchCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<ConfigMap>;
    listCoreV1NamespacedEndpoints(params: ListCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<EndpointsList>;
    createCoreV1NamespacedEndpoints(params: CreateCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints>;
    deleteCoreV1CollectionNamespacedEndpoints(params: DeleteCoreV1CollectionNamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedEndpoints(params: ReadCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints>;
    replaceCoreV1NamespacedEndpoints(params: ReplaceCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints>;
    deleteCoreV1NamespacedEndpoints(params: DeleteCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedEndpoints(params: PatchCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<Endpoints>;
    listCoreV1NamespacedEvent(params: ListCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<EventList>;
    createCoreV1NamespacedEvent(params: CreateCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    deleteCoreV1CollectionNamespacedEvent(params: DeleteCoreV1CollectionNamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedEvent(params: ReadCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    replaceCoreV1NamespacedEvent(params: ReplaceCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    deleteCoreV1NamespacedEvent(params: DeleteCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedEvent(params: PatchCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    listCoreV1NamespacedLimitRange(params: ListCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRangeList>;
    createCoreV1NamespacedLimitRange(params: CreateCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange>;
    deleteCoreV1CollectionNamespacedLimitRange(params: DeleteCoreV1CollectionNamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedLimitRange(params: ReadCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange>;
    replaceCoreV1NamespacedLimitRange(params: ReplaceCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange>;
    deleteCoreV1NamespacedLimitRange(params: DeleteCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedLimitRange(params: PatchCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<LimitRange>;
    listCoreV1NamespacedPersistentVolumeClaim(params: ListCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaimList>;
    createCoreV1NamespacedPersistentVolumeClaim(params: CreateCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    deleteCoreV1CollectionNamespacedPersistentVolumeClaim(params: DeleteCoreV1CollectionNamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedPersistentVolumeClaim(params: ReadCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    replaceCoreV1NamespacedPersistentVolumeClaim(params: ReplaceCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    deleteCoreV1NamespacedPersistentVolumeClaim(params: DeleteCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    patchCoreV1NamespacedPersistentVolumeClaim(params: PatchCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    readCoreV1NamespacedPersistentVolumeClaimStatus(params: ReadCoreV1NamespacedPersistentVolumeClaimStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    replaceCoreV1NamespacedPersistentVolumeClaimStatus(params: ReplaceCoreV1NamespacedPersistentVolumeClaimStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    patchCoreV1NamespacedPersistentVolumeClaimStatus(params: PatchCoreV1NamespacedPersistentVolumeClaimStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaim>;
    listCoreV1NamespacedPod(params: ListCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<PodList>;
    createCoreV1NamespacedPod(params: CreateCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    deleteCoreV1CollectionNamespacedPod(params: DeleteCoreV1CollectionNamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedPod(params: ReadCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    replaceCoreV1NamespacedPod(params: ReplaceCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    deleteCoreV1NamespacedPod(params: DeleteCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    patchCoreV1NamespacedPod(params: PatchCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    connectCoreV1GetNamespacedPodAttach(params: ConnectCoreV1GetNamespacedPodAttachRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedPodAttach(params: ConnectCoreV1PostNamespacedPodAttachRequest, opts?: APIClientRequestOpts): Promise<string>;
    createCoreV1NamespacedPodBinding(params: CreateCoreV1NamespacedPodBindingRequest, opts?: APIClientRequestOpts): Promise<Binding>;
    createCoreV1NamespacedPodEviction(params: CreateCoreV1NamespacedPodEvictionRequest, opts?: APIClientRequestOpts): Promise<Eviction>;
    connectCoreV1GetNamespacedPodExec(params: ConnectCoreV1GetNamespacedPodExecRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedPodExec(params: ConnectCoreV1PostNamespacedPodExecRequest, opts?: APIClientRequestOpts): Promise<string>;
    readCoreV1NamespacedPodLog(params: ReadCoreV1NamespacedPodLogRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1GetNamespacedPodPortforward(params: ConnectCoreV1GetNamespacedPodPortforwardRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedPodPortforward(params: ConnectCoreV1PostNamespacedPodPortforwardRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1GetNamespacedPodProxy(params: ConnectCoreV1GetNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedPodProxy(params: ConnectCoreV1PostNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PutNamespacedPodProxy(params: ConnectCoreV1PutNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1DeleteNamespacedPodProxy(params: ConnectCoreV1DeleteNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PatchNamespacedPodProxy(params: ConnectCoreV1PatchNamespacedPodProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1GetNamespacedPodProxyWithPath(params: ConnectCoreV1GetNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedPodProxyWithPath(params: ConnectCoreV1PostNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PutNamespacedPodProxyWithPath(params: ConnectCoreV1PutNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1DeleteNamespacedPodProxyWithPath(params: ConnectCoreV1DeleteNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PatchNamespacedPodProxyWithPath(params: ConnectCoreV1PatchNamespacedPodProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    readCoreV1NamespacedPodStatus(params: ReadCoreV1NamespacedPodStatusRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    replaceCoreV1NamespacedPodStatus(params: ReplaceCoreV1NamespacedPodStatusRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    patchCoreV1NamespacedPodStatus(params: PatchCoreV1NamespacedPodStatusRequest, opts?: APIClientRequestOpts): Promise<Pod>;
    listCoreV1NamespacedPodTemplate(params: ListCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplateList>;
    createCoreV1NamespacedPodTemplate(params: CreateCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate>;
    deleteCoreV1CollectionNamespacedPodTemplate(params: DeleteCoreV1CollectionNamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedPodTemplate(params: ReadCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate>;
    replaceCoreV1NamespacedPodTemplate(params: ReplaceCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate>;
    deleteCoreV1NamespacedPodTemplate(params: DeleteCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate>;
    patchCoreV1NamespacedPodTemplate(params: PatchCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<PodTemplate>;
    listCoreV1NamespacedReplicationController(params: ListCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationControllerList>;
    createCoreV1NamespacedReplicationController(params: CreateCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    deleteCoreV1CollectionNamespacedReplicationController(params: DeleteCoreV1CollectionNamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedReplicationController(params: ReadCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    replaceCoreV1NamespacedReplicationController(params: ReplaceCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    deleteCoreV1NamespacedReplicationController(params: DeleteCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedReplicationController(params: PatchCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    readCoreV1NamespacedReplicationControllerScale(params: ReadCoreV1NamespacedReplicationControllerScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    replaceCoreV1NamespacedReplicationControllerScale(params: ReplaceCoreV1NamespacedReplicationControllerScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    patchCoreV1NamespacedReplicationControllerScale(params: PatchCoreV1NamespacedReplicationControllerScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    readCoreV1NamespacedReplicationControllerStatus(params: ReadCoreV1NamespacedReplicationControllerStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    replaceCoreV1NamespacedReplicationControllerStatus(params: ReplaceCoreV1NamespacedReplicationControllerStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    patchCoreV1NamespacedReplicationControllerStatus(params: PatchCoreV1NamespacedReplicationControllerStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicationController>;
    listCoreV1NamespacedResourceQuota(params: ListCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuotaList>;
    createCoreV1NamespacedResourceQuota(params: CreateCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    deleteCoreV1CollectionNamespacedResourceQuota(params: DeleteCoreV1CollectionNamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedResourceQuota(params: ReadCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    replaceCoreV1NamespacedResourceQuota(params: ReplaceCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    deleteCoreV1NamespacedResourceQuota(params: DeleteCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    patchCoreV1NamespacedResourceQuota(params: PatchCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    readCoreV1NamespacedResourceQuotaStatus(params: ReadCoreV1NamespacedResourceQuotaStatusRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    replaceCoreV1NamespacedResourceQuotaStatus(params: ReplaceCoreV1NamespacedResourceQuotaStatusRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    patchCoreV1NamespacedResourceQuotaStatus(params: PatchCoreV1NamespacedResourceQuotaStatusRequest, opts?: APIClientRequestOpts): Promise<ResourceQuota>;
    listCoreV1NamespacedSecret(params: ListCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<SecretList>;
    createCoreV1NamespacedSecret(params: CreateCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret>;
    deleteCoreV1CollectionNamespacedSecret(params: DeleteCoreV1CollectionNamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedSecret(params: ReadCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret>;
    replaceCoreV1NamespacedSecret(params: ReplaceCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret>;
    deleteCoreV1NamespacedSecret(params: DeleteCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedSecret(params: PatchCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<Secret>;
    listCoreV1NamespacedServiceAccount(params: ListCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccountList>;
    createCoreV1NamespacedServiceAccount(params: CreateCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount>;
    deleteCoreV1CollectionNamespacedServiceAccount(params: DeleteCoreV1CollectionNamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1NamespacedServiceAccount(params: ReadCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount>;
    replaceCoreV1NamespacedServiceAccount(params: ReplaceCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount>;
    deleteCoreV1NamespacedServiceAccount(params: DeleteCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount>;
    patchCoreV1NamespacedServiceAccount(params: PatchCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<ServiceAccount>;
    createCoreV1NamespacedServiceAccountToken(params: CreateCoreV1NamespacedServiceAccountTokenRequest, opts?: APIClientRequestOpts): Promise<TokenRequest>;
    listCoreV1NamespacedService(params: ListCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<ServiceList>;
    createCoreV1NamespacedService(params: CreateCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service>;
    readCoreV1NamespacedService(params: ReadCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service>;
    replaceCoreV1NamespacedService(params: ReplaceCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service>;
    deleteCoreV1NamespacedService(params: DeleteCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1NamespacedService(params: PatchCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<Service>;
    connectCoreV1GetNamespacedServiceProxy(params: ConnectCoreV1GetNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedServiceProxy(params: ConnectCoreV1PostNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PutNamespacedServiceProxy(params: ConnectCoreV1PutNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1DeleteNamespacedServiceProxy(params: ConnectCoreV1DeleteNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PatchNamespacedServiceProxy(params: ConnectCoreV1PatchNamespacedServiceProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1GetNamespacedServiceProxyWithPath(params: ConnectCoreV1GetNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNamespacedServiceProxyWithPath(params: ConnectCoreV1PostNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PutNamespacedServiceProxyWithPath(params: ConnectCoreV1PutNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1DeleteNamespacedServiceProxyWithPath(params: ConnectCoreV1DeleteNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PatchNamespacedServiceProxyWithPath(params: ConnectCoreV1PatchNamespacedServiceProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    readCoreV1NamespacedServiceStatus(params: ReadCoreV1NamespacedServiceStatusRequest, opts?: APIClientRequestOpts): Promise<Service>;
    replaceCoreV1NamespacedServiceStatus(params: ReplaceCoreV1NamespacedServiceStatusRequest, opts?: APIClientRequestOpts): Promise<Service>;
    patchCoreV1NamespacedServiceStatus(params: PatchCoreV1NamespacedServiceStatusRequest, opts?: APIClientRequestOpts): Promise<Service>;
    readCoreV1Namespace(params: ReadCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    replaceCoreV1Namespace(params: ReplaceCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    deleteCoreV1Namespace(params: DeleteCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1Namespace(params: PatchCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    replaceCoreV1NamespaceFinalize(params: ReplaceCoreV1NamespaceFinalizeRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    readCoreV1NamespaceStatus(params: ReadCoreV1NamespaceStatusRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    replaceCoreV1NamespaceStatus(params: ReplaceCoreV1NamespaceStatusRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    patchCoreV1NamespaceStatus(params: PatchCoreV1NamespaceStatusRequest, opts?: APIClientRequestOpts): Promise<Namespace>;
    listCoreV1Node(params: ListCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<NodeList>;
    createCoreV1Node(params: CreateCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node>;
    deleteCoreV1CollectionNode(params: DeleteCoreV1CollectionNodeRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1Node(params: ReadCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node>;
    replaceCoreV1Node(params: ReplaceCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node>;
    deleteCoreV1Node(params: DeleteCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoreV1Node(params: PatchCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<Node>;
    connectCoreV1GetNodeProxy(params: ConnectCoreV1GetNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNodeProxy(params: ConnectCoreV1PostNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PutNodeProxy(params: ConnectCoreV1PutNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1DeleteNodeProxy(params: ConnectCoreV1DeleteNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PatchNodeProxy(params: ConnectCoreV1PatchNodeProxyRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1GetNodeProxyWithPath(params: ConnectCoreV1GetNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PostNodeProxyWithPath(params: ConnectCoreV1PostNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PutNodeProxyWithPath(params: ConnectCoreV1PutNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1DeleteNodeProxyWithPath(params: ConnectCoreV1DeleteNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    connectCoreV1PatchNodeProxyWithPath(params: ConnectCoreV1PatchNodeProxyWithPathRequest, opts?: APIClientRequestOpts): Promise<string>;
    readCoreV1NodeStatus(params: ReadCoreV1NodeStatusRequest, opts?: APIClientRequestOpts): Promise<Node>;
    replaceCoreV1NodeStatus(params: ReplaceCoreV1NodeStatusRequest, opts?: APIClientRequestOpts): Promise<Node>;
    patchCoreV1NodeStatus(params: PatchCoreV1NodeStatusRequest, opts?: APIClientRequestOpts): Promise<Node>;
    listCoreV1PersistentVolumeClaimForAllNamespaces(params: ListCoreV1PersistentVolumeClaimForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeClaimList>;
    listCoreV1PersistentVolume(params: ListCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolumeList>;
    createCoreV1PersistentVolume(params: CreateCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    deleteCoreV1CollectionPersistentVolume(params: DeleteCoreV1CollectionPersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoreV1PersistentVolume(params: ReadCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    replaceCoreV1PersistentVolume(params: ReplaceCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    deleteCoreV1PersistentVolume(params: DeleteCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    patchCoreV1PersistentVolume(params: PatchCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    readCoreV1PersistentVolumeStatus(params: ReadCoreV1PersistentVolumeStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    replaceCoreV1PersistentVolumeStatus(params: ReplaceCoreV1PersistentVolumeStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    patchCoreV1PersistentVolumeStatus(params: PatchCoreV1PersistentVolumeStatusRequest, opts?: APIClientRequestOpts): Promise<PersistentVolume>;
    getPods(params: ListCoreV1PodForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodList>;
    listPods(params: ListCoreV1PodForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodList>;
    listCoreV1PodTemplateForAllNamespaces(params: ListCoreV1PodTemplateForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodTemplateList>;
    listCoreV1ReplicationControllerForAllNamespaces(params: ListCoreV1ReplicationControllerForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ReplicationControllerList>;
    listCoreV1ResourceQuotaForAllNamespaces(params: ListCoreV1ResourceQuotaForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ResourceQuotaList>;
    listCoreV1SecretForAllNamespaces(params: ListCoreV1SecretForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<SecretList>;
    listCoreV1ServiceAccountForAllNamespaces(params: ListCoreV1ServiceAccountForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ServiceAccountList>;
    listCoreV1ServiceForAllNamespaces(params: ListCoreV1ServiceForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ServiceList>;
    watchCoreV1ConfigMapListForAllNamespaces(params: WatchCoreV1ConfigMapListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1EndpointsListForAllNamespaces(params: WatchCoreV1EndpointsListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1EventListForAllNamespaces(params: WatchCoreV1EventListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1LimitRangeListForAllNamespaces(params: WatchCoreV1LimitRangeListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespaceList(params: WatchCoreV1NamespaceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedConfigMapList(params: WatchCoreV1NamespacedConfigMapListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedConfigMap(params: WatchCoreV1NamespacedConfigMapRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedEndpointsList(params: WatchCoreV1NamespacedEndpointsListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedEndpoints(params: WatchCoreV1NamespacedEndpointsRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedEventList(params: WatchCoreV1NamespacedEventListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedEvent(params: WatchCoreV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedLimitRangeList(params: WatchCoreV1NamespacedLimitRangeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedLimitRange(params: WatchCoreV1NamespacedLimitRangeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedPersistentVolumeClaimList(params: WatchCoreV1NamespacedPersistentVolumeClaimListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedPersistentVolumeClaim(params: WatchCoreV1NamespacedPersistentVolumeClaimRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedPodList(params: WatchCoreV1NamespacedPodListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedPod(params: WatchCoreV1NamespacedPodRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedPodTemplateList(params: WatchCoreV1NamespacedPodTemplateListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedPodTemplate(params: WatchCoreV1NamespacedPodTemplateRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedReplicationControllerList(params: WatchCoreV1NamespacedReplicationControllerListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedReplicationController(params: WatchCoreV1NamespacedReplicationControllerRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedResourceQuotaList(params: WatchCoreV1NamespacedResourceQuotaListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedResourceQuota(params: WatchCoreV1NamespacedResourceQuotaRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedSecretList(params: WatchCoreV1NamespacedSecretListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedSecret(params: WatchCoreV1NamespacedSecretRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedServiceAccountList(params: WatchCoreV1NamespacedServiceAccountListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedServiceAccount(params: WatchCoreV1NamespacedServiceAccountRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedServiceList(params: WatchCoreV1NamespacedServiceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NamespacedService(params: WatchCoreV1NamespacedServiceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1Namespace(params: WatchCoreV1NamespaceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1NodeList(params: WatchCoreV1NodeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1Node(params: WatchCoreV1NodeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1PersistentVolumeClaimListForAllNamespaces(params: WatchCoreV1PersistentVolumeClaimListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1PersistentVolumeList(params: WatchCoreV1PersistentVolumeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1PersistentVolume(params: WatchCoreV1PersistentVolumeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1PodListForAllNamespaces(params: WatchCoreV1PodListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1PodTemplateListForAllNamespaces(params: WatchCoreV1PodTemplateListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1ReplicationControllerListForAllNamespaces(params: WatchCoreV1ReplicationControllerListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1ResourceQuotaListForAllNamespaces(params: WatchCoreV1ResourceQuotaListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1SecretListForAllNamespaces(params: WatchCoreV1SecretListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1ServiceAccountListForAllNamespaces(params: WatchCoreV1ServiceAccountListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoreV1ServiceListForAllNamespaces(params: WatchCoreV1ServiceListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getAPIVersions(params: GetAPIVersionsRequest, opts?: APIClientRequestOpts): Promise<APIGroupList>;
    getAdmissionregistrationAPIGroup(params: GetAdmissionregistrationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getAdmissionregistrationV1APIResources(params: GetAdmissionregistrationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listAdmissionregistrationV1MutatingWebhookConfiguration(params: ListAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfigurationList>;
    createAdmissionregistrationV1MutatingWebhookConfiguration(params: CreateAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration>;
    deleteAdmissionregistrationV1CollectionMutatingWebhookConfiguration(params: DeleteAdmissionregistrationV1CollectionMutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAdmissionregistrationV1MutatingWebhookConfiguration(params: ReadAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration>;
    replaceAdmissionregistrationV1MutatingWebhookConfiguration(params: ReplaceAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration>;
    deleteAdmissionregistrationV1MutatingWebhookConfiguration(params: DeleteAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAdmissionregistrationV1MutatingWebhookConfiguration(params: PatchAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<MutatingWebhookConfiguration>;
    listAdmissionregistrationV1ValidatingWebhookConfiguration(params: ListAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfigurationList>;
    createAdmissionregistrationV1ValidatingWebhookConfiguration(params: CreateAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration>;
    deleteAdmissionregistrationV1CollectionValidatingWebhookConfiguration(params: DeleteAdmissionregistrationV1CollectionValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAdmissionregistrationV1ValidatingWebhookConfiguration(params: ReadAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration>;
    replaceAdmissionregistrationV1ValidatingWebhookConfiguration(params: ReplaceAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration>;
    deleteAdmissionregistrationV1ValidatingWebhookConfiguration(params: DeleteAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAdmissionregistrationV1ValidatingWebhookConfiguration(params: PatchAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<ValidatingWebhookConfiguration>;
    watchAdmissionregistrationV1MutatingWebhookConfigurationList(params: WatchAdmissionregistrationV1MutatingWebhookConfigurationListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAdmissionregistrationV1MutatingWebhookConfiguration(params: WatchAdmissionregistrationV1MutatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAdmissionregistrationV1ValidatingWebhookConfigurationList(params: WatchAdmissionregistrationV1ValidatingWebhookConfigurationListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAdmissionregistrationV1ValidatingWebhookConfiguration(params: WatchAdmissionregistrationV1ValidatingWebhookConfigurationRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getApiextensionsAPIGroup(params: GetApiextensionsAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getApiextensionsV1APIResources(params: GetApiextensionsV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listApiextensionsV1CustomResourceDefinition(params: ListApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinitionList>;
    createApiextensionsV1CustomResourceDefinition(params: CreateApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    deleteApiextensionsV1CollectionCustomResourceDefinition(params: DeleteApiextensionsV1CollectionCustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readApiextensionsV1CustomResourceDefinition(params: ReadApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    replaceApiextensionsV1CustomResourceDefinition(params: ReplaceApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    deleteApiextensionsV1CustomResourceDefinition(params: DeleteApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchApiextensionsV1CustomResourceDefinition(params: PatchApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    readApiextensionsV1CustomResourceDefinitionStatus(params: ReadApiextensionsV1CustomResourceDefinitionStatusRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    replaceApiextensionsV1CustomResourceDefinitionStatus(params: ReplaceApiextensionsV1CustomResourceDefinitionStatusRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    patchApiextensionsV1CustomResourceDefinitionStatus(params: PatchApiextensionsV1CustomResourceDefinitionStatusRequest, opts?: APIClientRequestOpts): Promise<CustomResourceDefinition>;
    watchApiextensionsV1CustomResourceDefinitionList(params: WatchApiextensionsV1CustomResourceDefinitionListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchApiextensionsV1CustomResourceDefinition(params: WatchApiextensionsV1CustomResourceDefinitionRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getApiregistrationAPIGroup(params: GetApiregistrationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getApiregistrationV1APIResources(params: GetApiregistrationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listApiregistrationV1APIService(params: ListApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIServiceList>;
    createApiregistrationV1APIService(params: CreateApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    deleteApiregistrationV1CollectionAPIService(params: DeleteApiregistrationV1CollectionAPIServiceRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readApiregistrationV1APIService(params: ReadApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    replaceApiregistrationV1APIService(params: ReplaceApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    deleteApiregistrationV1APIService(params: DeleteApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchApiregistrationV1APIService(params: PatchApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    readApiregistrationV1APIServiceStatus(params: ReadApiregistrationV1APIServiceStatusRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    replaceApiregistrationV1APIServiceStatus(params: ReplaceApiregistrationV1APIServiceStatusRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    patchApiregistrationV1APIServiceStatus(params: PatchApiregistrationV1APIServiceStatusRequest, opts?: APIClientRequestOpts): Promise<APIService>;
    watchApiregistrationV1APIServiceList(params: WatchApiregistrationV1APIServiceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchApiregistrationV1APIService(params: WatchApiregistrationV1APIServiceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getAppsAPIGroup(params: GetAppsAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getAppsV1APIResources(params: GetAppsV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listAppsV1ControllerRevisionForAllNamespaces(params: ListAppsV1ControllerRevisionForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ControllerRevisionList>;
    listAppsV1DaemonSetForAllNamespaces(params: ListAppsV1DaemonSetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<DaemonSetList>;
    listAppsV1DeploymentForAllNamespaces(params: ListAppsV1DeploymentForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<DeploymentList>;
    listAppsV1NamespacedControllerRevision(params: ListAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevisionList>;
    createAppsV1NamespacedControllerRevision(params: CreateAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision>;
    deleteAppsV1CollectionNamespacedControllerRevision(params: DeleteAppsV1CollectionNamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAppsV1NamespacedControllerRevision(params: ReadAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision>;
    replaceAppsV1NamespacedControllerRevision(params: ReplaceAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision>;
    deleteAppsV1NamespacedControllerRevision(params: DeleteAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAppsV1NamespacedControllerRevision(params: PatchAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<ControllerRevision>;
    listAppsV1NamespacedDaemonSet(params: ListAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSetList>;
    createAppsV1NamespacedDaemonSet(params: CreateAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    deleteAppsV1CollectionNamespacedDaemonSet(params: DeleteAppsV1CollectionNamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAppsV1NamespacedDaemonSet(params: ReadAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    replaceAppsV1NamespacedDaemonSet(params: ReplaceAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    deleteAppsV1NamespacedDaemonSet(params: DeleteAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAppsV1NamespacedDaemonSet(params: PatchAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    readAppsV1NamespacedDaemonSetStatus(params: ReadAppsV1NamespacedDaemonSetStatusRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    replaceAppsV1NamespacedDaemonSetStatus(params: ReplaceAppsV1NamespacedDaemonSetStatusRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    patchAppsV1NamespacedDaemonSetStatus(params: PatchAppsV1NamespacedDaemonSetStatusRequest, opts?: APIClientRequestOpts): Promise<DaemonSet>;
    listAppsV1NamespacedDeployment(params: ListAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<DeploymentList>;
    createAppsV1NamespacedDeployment(params: CreateAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    deleteAppsV1CollectionNamespacedDeployment(params: DeleteAppsV1CollectionNamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAppsV1NamespacedDeployment(params: ReadAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    replaceAppsV1NamespacedDeployment(params: ReplaceAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    deleteAppsV1NamespacedDeployment(params: DeleteAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAppsV1NamespacedDeployment(params: PatchAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    readAppsV1NamespacedDeploymentScale(params: ReadAppsV1NamespacedDeploymentScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    replaceAppsV1NamespacedDeploymentScale(params: ReplaceAppsV1NamespacedDeploymentScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    patchAppsV1NamespacedDeploymentScale(params: PatchAppsV1NamespacedDeploymentScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    readAppsV1NamespacedDeploymentStatus(params: ReadAppsV1NamespacedDeploymentStatusRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    replaceAppsV1NamespacedDeploymentStatus(params: ReplaceAppsV1NamespacedDeploymentStatusRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    patchAppsV1NamespacedDeploymentStatus(params: PatchAppsV1NamespacedDeploymentStatusRequest, opts?: APIClientRequestOpts): Promise<Deployment>;
    listAppsV1NamespacedReplicaSet(params: ListAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSetList>;
    createAppsV1NamespacedReplicaSet(params: CreateAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    deleteAppsV1CollectionNamespacedReplicaSet(params: DeleteAppsV1CollectionNamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAppsV1NamespacedReplicaSet(params: ReadAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    replaceAppsV1NamespacedReplicaSet(params: ReplaceAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    deleteAppsV1NamespacedReplicaSet(params: DeleteAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAppsV1NamespacedReplicaSet(params: PatchAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    readAppsV1NamespacedReplicaSetScale(params: ReadAppsV1NamespacedReplicaSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    replaceAppsV1NamespacedReplicaSetScale(params: ReplaceAppsV1NamespacedReplicaSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    patchAppsV1NamespacedReplicaSetScale(params: PatchAppsV1NamespacedReplicaSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    readAppsV1NamespacedReplicaSetStatus(params: ReadAppsV1NamespacedReplicaSetStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    replaceAppsV1NamespacedReplicaSetStatus(params: ReplaceAppsV1NamespacedReplicaSetStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    patchAppsV1NamespacedReplicaSetStatus(params: PatchAppsV1NamespacedReplicaSetStatusRequest, opts?: APIClientRequestOpts): Promise<ReplicaSet>;
    listAppsV1NamespacedStatefulSet(params: ListAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSetList>;
    createAppsV1NamespacedStatefulSet(params: CreateAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    deleteAppsV1CollectionNamespacedStatefulSet(params: DeleteAppsV1CollectionNamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAppsV1NamespacedStatefulSet(params: ReadAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    replaceAppsV1NamespacedStatefulSet(params: ReplaceAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    deleteAppsV1NamespacedStatefulSet(params: DeleteAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAppsV1NamespacedStatefulSet(params: PatchAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    readAppsV1NamespacedStatefulSetScale(params: ReadAppsV1NamespacedStatefulSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    replaceAppsV1NamespacedStatefulSetScale(params: ReplaceAppsV1NamespacedStatefulSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    patchAppsV1NamespacedStatefulSetScale(params: PatchAppsV1NamespacedStatefulSetScaleRequest, opts?: APIClientRequestOpts): Promise<Scale>;
    readAppsV1NamespacedStatefulSetStatus(params: ReadAppsV1NamespacedStatefulSetStatusRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    replaceAppsV1NamespacedStatefulSetStatus(params: ReplaceAppsV1NamespacedStatefulSetStatusRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    patchAppsV1NamespacedStatefulSetStatus(params: PatchAppsV1NamespacedStatefulSetStatusRequest, opts?: APIClientRequestOpts): Promise<StatefulSet>;
    listAppsV1ReplicaSetForAllNamespaces(params: ListAppsV1ReplicaSetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<ReplicaSetList>;
    listAppsV1StatefulSetForAllNamespaces(params: ListAppsV1StatefulSetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<StatefulSetList>;
    watchAppsV1ControllerRevisionListForAllNamespaces(params: WatchAppsV1ControllerRevisionListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1DaemonSetListForAllNamespaces(params: WatchAppsV1DaemonSetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1DeploymentListForAllNamespaces(params: WatchAppsV1DeploymentListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedControllerRevisionList(params: WatchAppsV1NamespacedControllerRevisionListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedControllerRevision(params: WatchAppsV1NamespacedControllerRevisionRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedDaemonSetList(params: WatchAppsV1NamespacedDaemonSetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedDaemonSet(params: WatchAppsV1NamespacedDaemonSetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedDeploymentList(params: WatchAppsV1NamespacedDeploymentListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedDeployment(params: WatchAppsV1NamespacedDeploymentRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedReplicaSetList(params: WatchAppsV1NamespacedReplicaSetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedReplicaSet(params: WatchAppsV1NamespacedReplicaSetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedStatefulSetList(params: WatchAppsV1NamespacedStatefulSetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1NamespacedStatefulSet(params: WatchAppsV1NamespacedStatefulSetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1ReplicaSetListForAllNamespaces(params: WatchAppsV1ReplicaSetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAppsV1StatefulSetListForAllNamespaces(params: WatchAppsV1StatefulSetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getAuthenticationAPIGroup(params: GetAuthenticationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getAuthenticationV1APIResources(params: GetAuthenticationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    createAuthenticationV1TokenReview(params: CreateAuthenticationV1TokenReviewRequest, opts?: APIClientRequestOpts): Promise<TokenReview>;
    getAuthorizationAPIGroup(params: GetAuthorizationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getAuthorizationV1APIResources(params: GetAuthorizationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    createAuthorizationV1NamespacedLocalSubjectAccessReview(params: CreateAuthorizationV1NamespacedLocalSubjectAccessReviewRequest, opts?: APIClientRequestOpts): Promise<LocalSubjectAccessReview>;
    createAuthorizationV1SelfSubjectAccessReview(params: CreateAuthorizationV1SelfSubjectAccessReviewRequest, opts?: APIClientRequestOpts): Promise<SelfSubjectAccessReview>;
    createAuthorizationV1SelfSubjectRulesReview(params: CreateAuthorizationV1SelfSubjectRulesReviewRequest, opts?: APIClientRequestOpts): Promise<SelfSubjectRulesReview>;
    createAuthorizationV1SubjectAccessReview(params: CreateAuthorizationV1SubjectAccessReviewRequest, opts?: APIClientRequestOpts): Promise<SubjectAccessReview>;
    getAutoscalingAPIGroup(params: GetAutoscalingAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getAutoscalingV1APIResources(params: GetAutoscalingV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listAutoscalingV1HorizontalPodAutoscalerForAllNamespaces(params: ListAutoscalingV1HorizontalPodAutoscalerForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList>;
    listAutoscalingV1NamespacedHorizontalPodAutoscaler(params: ListAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList>;
    createAutoscalingV1NamespacedHorizontalPodAutoscaler(params: CreateAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    deleteAutoscalingV1CollectionNamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV1CollectionNamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAutoscalingV1NamespacedHorizontalPodAutoscaler(params: ReadAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    replaceAutoscalingV1NamespacedHorizontalPodAutoscaler(params: ReplaceAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    deleteAutoscalingV1NamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAutoscalingV1NamespacedHorizontalPodAutoscaler(params: PatchAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    readAutoscalingV1NamespacedHorizontalPodAutoscalerStatus(params: ReadAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    replaceAutoscalingV1NamespacedHorizontalPodAutoscalerStatus(params: ReplaceAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    patchAutoscalingV1NamespacedHorizontalPodAutoscalerStatus(params: PatchAutoscalingV1NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    watchAutoscalingV1HorizontalPodAutoscalerListForAllNamespaces(params: WatchAutoscalingV1HorizontalPodAutoscalerListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAutoscalingV1NamespacedHorizontalPodAutoscalerList(params: WatchAutoscalingV1NamespacedHorizontalPodAutoscalerListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAutoscalingV1NamespacedHorizontalPodAutoscaler(params: WatchAutoscalingV1NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getAutoscalingV2beta2APIResources(params: GetAutoscalingV2beta2APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespaces(params: ListAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList>;
    listAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: ListAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscalerList>;
    createAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: CreateAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    deleteAutoscalingV2beta2CollectionNamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV2beta2CollectionNamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: ReadAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    replaceAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: ReplaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    deleteAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: DeleteAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: PatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    readAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatus(params: ReadAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    replaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatus(params: ReplaceAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    patchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatus(params: PatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerStatusRequest, opts?: APIClientRequestOpts): Promise<HorizontalPodAutoscaler>;
    watchAutoscalingV2beta2HorizontalPodAutoscalerListForAllNamespaces(params: WatchAutoscalingV2beta2HorizontalPodAutoscalerListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerList(params: WatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchAutoscalingV2beta2NamespacedHorizontalPodAutoscaler(params: WatchAutoscalingV2beta2NamespacedHorizontalPodAutoscalerRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getBatchAPIGroup(params: GetBatchAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getBatchV1APIResources(params: GetBatchV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listBatchV1CronJobForAllNamespaces(params: ListBatchV1CronJobForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<CronJobList>;
    listBatchV1JobForAllNamespaces(params: ListBatchV1JobForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<JobList>;
    listBatchV1NamespacedCronJob(params: ListBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJobList>;
    createBatchV1NamespacedCronJob(params: CreateBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    deleteBatchV1CollectionNamespacedCronJob(params: DeleteBatchV1CollectionNamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readBatchV1NamespacedCronJob(params: ReadBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    replaceBatchV1NamespacedCronJob(params: ReplaceBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    deleteBatchV1NamespacedCronJob(params: DeleteBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchBatchV1NamespacedCronJob(params: PatchBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    readBatchV1NamespacedCronJobStatus(params: ReadBatchV1NamespacedCronJobStatusRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    replaceBatchV1NamespacedCronJobStatus(params: ReplaceBatchV1NamespacedCronJobStatusRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    patchBatchV1NamespacedCronJobStatus(params: PatchBatchV1NamespacedCronJobStatusRequest, opts?: APIClientRequestOpts): Promise<CronJob>;
    listBatchV1NamespacedJob(params: ListBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<JobList>;
    createBatchV1NamespacedJob(params: CreateBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job>;
    deleteBatchV1CollectionNamespacedJob(params: DeleteBatchV1CollectionNamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readBatchV1NamespacedJob(params: ReadBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job>;
    replaceBatchV1NamespacedJob(params: ReplaceBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job>;
    deleteBatchV1NamespacedJob(params: DeleteBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchBatchV1NamespacedJob(params: PatchBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<Job>;
    readBatchV1NamespacedJobStatus(params: ReadBatchV1NamespacedJobStatusRequest, opts?: APIClientRequestOpts): Promise<Job>;
    replaceBatchV1NamespacedJobStatus(params: ReplaceBatchV1NamespacedJobStatusRequest, opts?: APIClientRequestOpts): Promise<Job>;
    patchBatchV1NamespacedJobStatus(params: PatchBatchV1NamespacedJobStatusRequest, opts?: APIClientRequestOpts): Promise<Job>;
    watchBatchV1CronJobListForAllNamespaces(params: WatchBatchV1CronJobListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchBatchV1JobListForAllNamespaces(params: WatchBatchV1JobListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchBatchV1NamespacedCronJobList(params: WatchBatchV1NamespacedCronJobListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchBatchV1NamespacedCronJob(params: WatchBatchV1NamespacedCronJobRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchBatchV1NamespacedJobList(params: WatchBatchV1NamespacedJobListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchBatchV1NamespacedJob(params: WatchBatchV1NamespacedJobRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getCertificatesAPIGroup(params: GetCertificatesAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getCertificatesV1APIResources(params: GetCertificatesV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listCertificatesV1CertificateSigningRequest(params: ListCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequestList>;
    createCertificatesV1CertificateSigningRequest(params: CreateCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    deleteCertificatesV1CollectionCertificateSigningRequest(params: DeleteCertificatesV1CollectionCertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCertificatesV1CertificateSigningRequest(params: ReadCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    replaceCertificatesV1CertificateSigningRequest(params: ReplaceCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    deleteCertificatesV1CertificateSigningRequest(params: DeleteCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCertificatesV1CertificateSigningRequest(params: PatchCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    readCertificatesV1CertificateSigningRequestApproval(params: ReadCertificatesV1CertificateSigningRequestApprovalRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    replaceCertificatesV1CertificateSigningRequestApproval(params: ReplaceCertificatesV1CertificateSigningRequestApprovalRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    patchCertificatesV1CertificateSigningRequestApproval(params: PatchCertificatesV1CertificateSigningRequestApprovalRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    readCertificatesV1CertificateSigningRequestStatus(params: ReadCertificatesV1CertificateSigningRequestStatusRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    replaceCertificatesV1CertificateSigningRequestStatus(params: ReplaceCertificatesV1CertificateSigningRequestStatusRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    patchCertificatesV1CertificateSigningRequestStatus(params: PatchCertificatesV1CertificateSigningRequestStatusRequest, opts?: APIClientRequestOpts): Promise<CertificateSigningRequest>;
    watchCertificatesV1CertificateSigningRequestList(params: WatchCertificatesV1CertificateSigningRequestListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCertificatesV1CertificateSigningRequest(params: WatchCertificatesV1CertificateSigningRequestRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getCoordinationAPIGroup(params: GetCoordinationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getCoordinationV1APIResources(params: GetCoordinationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listCoordinationV1LeaseForAllNamespaces(params: ListCoordinationV1LeaseForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<LeaseList>;
    listCoordinationV1NamespacedLease(params: ListCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<LeaseList>;
    createCoordinationV1NamespacedLease(params: CreateCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease>;
    deleteCoordinationV1CollectionNamespacedLease(params: DeleteCoordinationV1CollectionNamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readCoordinationV1NamespacedLease(params: ReadCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease>;
    replaceCoordinationV1NamespacedLease(params: ReplaceCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease>;
    deleteCoordinationV1NamespacedLease(params: DeleteCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchCoordinationV1NamespacedLease(params: PatchCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<Lease>;
    watchCoordinationV1LeaseListForAllNamespaces(params: WatchCoordinationV1LeaseListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoordinationV1NamespacedLeaseList(params: WatchCoordinationV1NamespacedLeaseListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchCoordinationV1NamespacedLease(params: WatchCoordinationV1NamespacedLeaseRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getDiscoveryAPIGroup(params: GetDiscoveryAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getDiscoveryV1APIResources(params: GetDiscoveryV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listDiscoveryV1EndpointSliceForAllNamespaces(params: ListDiscoveryV1EndpointSliceForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EndpointSliceList>;
    listDiscoveryV1NamespacedEndpointSlice(params: ListDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSliceList>;
    createDiscoveryV1NamespacedEndpointSlice(params: CreateDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice>;
    deleteDiscoveryV1CollectionNamespacedEndpointSlice(params: DeleteDiscoveryV1CollectionNamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readDiscoveryV1NamespacedEndpointSlice(params: ReadDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice>;
    replaceDiscoveryV1NamespacedEndpointSlice(params: ReplaceDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice>;
    deleteDiscoveryV1NamespacedEndpointSlice(params: DeleteDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchDiscoveryV1NamespacedEndpointSlice(params: PatchDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<EndpointSlice>;
    watchDiscoveryV1EndpointSliceListForAllNamespaces(params: WatchDiscoveryV1EndpointSliceListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchDiscoveryV1NamespacedEndpointSliceList(params: WatchDiscoveryV1NamespacedEndpointSliceListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchDiscoveryV1NamespacedEndpointSlice(params: WatchDiscoveryV1NamespacedEndpointSliceRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getEventsAPIGroup(params: GetEventsAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getEventsV1APIResources(params: GetEventsV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listEventsV1EventForAllNamespaces(params: ListEventsV1EventForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<EventList>;
    listEventsV1NamespacedEvent(params: ListEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<EventList>;
    createEventsV1NamespacedEvent(params: CreateEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    deleteEventsV1CollectionNamespacedEvent(params: DeleteEventsV1CollectionNamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readEventsV1NamespacedEvent(params: ReadEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    replaceEventsV1NamespacedEvent(params: ReplaceEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    deleteEventsV1NamespacedEvent(params: DeleteEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchEventsV1NamespacedEvent(params: PatchEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<Event>;
    watchEventsV1EventListForAllNamespaces(params: WatchEventsV1EventListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchEventsV1NamespacedEventList(params: WatchEventsV1NamespacedEventListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchEventsV1NamespacedEvent(params: WatchEventsV1NamespacedEventRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getFlowcontrolApiserverAPIGroup(params: GetFlowcontrolApiserverAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getNetworkingAPIGroup(params: GetNetworkingAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getNetworkingV1APIResources(params: GetNetworkingV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listNetworkingV1IngressClass(params: ListNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClassList>;
    createNetworkingV1IngressClass(params: CreateNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass>;
    deleteNetworkingV1CollectionIngressClass(params: DeleteNetworkingV1CollectionIngressClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readNetworkingV1IngressClass(params: ReadNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass>;
    replaceNetworkingV1IngressClass(params: ReplaceNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass>;
    deleteNetworkingV1IngressClass(params: DeleteNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchNetworkingV1IngressClass(params: PatchNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<IngressClass>;
    listNetworkingV1IngressForAllNamespaces(params: ListNetworkingV1IngressForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<IngressList>;
    listNetworkingV1NamespacedIngress(params: ListNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<IngressList>;
    createNetworkingV1NamespacedIngress(params: CreateNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    deleteNetworkingV1CollectionNamespacedIngress(params: DeleteNetworkingV1CollectionNamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readNetworkingV1NamespacedIngress(params: ReadNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    replaceNetworkingV1NamespacedIngress(params: ReplaceNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    deleteNetworkingV1NamespacedIngress(params: DeleteNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchNetworkingV1NamespacedIngress(params: PatchNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    readNetworkingV1NamespacedIngressStatus(params: ReadNetworkingV1NamespacedIngressStatusRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    replaceNetworkingV1NamespacedIngressStatus(params: ReplaceNetworkingV1NamespacedIngressStatusRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    patchNetworkingV1NamespacedIngressStatus(params: PatchNetworkingV1NamespacedIngressStatusRequest, opts?: APIClientRequestOpts): Promise<Ingress>;
    listNetworkingV1NamespacedNetworkPolicy(params: ListNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicyList>;
    createNetworkingV1NamespacedNetworkPolicy(params: CreateNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy>;
    deleteNetworkingV1CollectionNamespacedNetworkPolicy(params: DeleteNetworkingV1CollectionNamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readNetworkingV1NamespacedNetworkPolicy(params: ReadNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy>;
    replaceNetworkingV1NamespacedNetworkPolicy(params: ReplaceNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy>;
    deleteNetworkingV1NamespacedNetworkPolicy(params: DeleteNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchNetworkingV1NamespacedNetworkPolicy(params: PatchNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicy>;
    listNetworkingV1NetworkPolicyForAllNamespaces(params: ListNetworkingV1NetworkPolicyForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<NetworkPolicyList>;
    watchNetworkingV1IngressClassList(params: WatchNetworkingV1IngressClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1IngressClass(params: WatchNetworkingV1IngressClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1IngressListForAllNamespaces(params: WatchNetworkingV1IngressListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1NamespacedIngressList(params: WatchNetworkingV1NamespacedIngressListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1NamespacedIngress(params: WatchNetworkingV1NamespacedIngressRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1NamespacedNetworkPolicyList(params: WatchNetworkingV1NamespacedNetworkPolicyListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1NamespacedNetworkPolicy(params: WatchNetworkingV1NamespacedNetworkPolicyRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNetworkingV1NetworkPolicyListForAllNamespaces(params: WatchNetworkingV1NetworkPolicyListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getNodeAPIGroup(params: GetNodeAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getNodeV1APIResources(params: GetNodeV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listNodeV1RuntimeClass(params: ListNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClassList>;
    createNodeV1RuntimeClass(params: CreateNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass>;
    deleteNodeV1CollectionRuntimeClass(params: DeleteNodeV1CollectionRuntimeClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readNodeV1RuntimeClass(params: ReadNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass>;
    replaceNodeV1RuntimeClass(params: ReplaceNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass>;
    deleteNodeV1RuntimeClass(params: DeleteNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchNodeV1RuntimeClass(params: PatchNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<RuntimeClass>;
    watchNodeV1RuntimeClassList(params: WatchNodeV1RuntimeClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchNodeV1RuntimeClass(params: WatchNodeV1RuntimeClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getPolicyAPIGroup(params: GetPolicyAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getPolicyV1APIResources(params: GetPolicyV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listPolicyV1NamespacedPodDisruptionBudget(params: ListPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudgetList>;
    createPolicyV1NamespacedPodDisruptionBudget(params: CreatePolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    deletePolicyV1CollectionNamespacedPodDisruptionBudget(params: DeletePolicyV1CollectionNamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readPolicyV1NamespacedPodDisruptionBudget(params: ReadPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    replacePolicyV1NamespacedPodDisruptionBudget(params: ReplacePolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    deletePolicyV1NamespacedPodDisruptionBudget(params: DeletePolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchPolicyV1NamespacedPodDisruptionBudget(params: PatchPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    readPolicyV1NamespacedPodDisruptionBudgetStatus(params: ReadPolicyV1NamespacedPodDisruptionBudgetStatusRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    replacePolicyV1NamespacedPodDisruptionBudgetStatus(params: ReplacePolicyV1NamespacedPodDisruptionBudgetStatusRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    patchPolicyV1NamespacedPodDisruptionBudgetStatus(params: PatchPolicyV1NamespacedPodDisruptionBudgetStatusRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudget>;
    listPolicyV1PodDisruptionBudgetForAllNamespaces(params: ListPolicyV1PodDisruptionBudgetForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<PodDisruptionBudgetList>;
    watchPolicyV1NamespacedPodDisruptionBudgetList(params: WatchPolicyV1NamespacedPodDisruptionBudgetListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchPolicyV1NamespacedPodDisruptionBudget(params: WatchPolicyV1NamespacedPodDisruptionBudgetRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchPolicyV1PodDisruptionBudgetListForAllNamespaces(params: WatchPolicyV1PodDisruptionBudgetListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getRbacAuthorizationAPIGroup(params: GetRbacAuthorizationAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getRbacAuthorizationV1APIResources(params: GetRbacAuthorizationV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listRbacAuthorizationV1ClusterRoleBinding(params: ListRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBindingList>;
    createRbacAuthorizationV1ClusterRoleBinding(params: CreateRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding>;
    deleteRbacAuthorizationV1CollectionClusterRoleBinding(params: DeleteRbacAuthorizationV1CollectionClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readRbacAuthorizationV1ClusterRoleBinding(params: ReadRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding>;
    replaceRbacAuthorizationV1ClusterRoleBinding(params: ReplaceRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding>;
    deleteRbacAuthorizationV1ClusterRoleBinding(params: DeleteRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchRbacAuthorizationV1ClusterRoleBinding(params: PatchRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleBinding>;
    listRbacAuthorizationV1ClusterRole(params: ListRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRoleList>;
    createRbacAuthorizationV1ClusterRole(params: CreateRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole>;
    deleteRbacAuthorizationV1CollectionClusterRole(params: DeleteRbacAuthorizationV1CollectionClusterRoleRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readRbacAuthorizationV1ClusterRole(params: ReadRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole>;
    replaceRbacAuthorizationV1ClusterRole(params: ReplaceRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole>;
    deleteRbacAuthorizationV1ClusterRole(params: DeleteRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchRbacAuthorizationV1ClusterRole(params: PatchRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<ClusterRole>;
    listRbacAuthorizationV1NamespacedRoleBinding(params: ListRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBindingList>;
    createRbacAuthorizationV1NamespacedRoleBinding(params: CreateRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding>;
    deleteRbacAuthorizationV1CollectionNamespacedRoleBinding(params: DeleteRbacAuthorizationV1CollectionNamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readRbacAuthorizationV1NamespacedRoleBinding(params: ReadRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding>;
    replaceRbacAuthorizationV1NamespacedRoleBinding(params: ReplaceRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding>;
    deleteRbacAuthorizationV1NamespacedRoleBinding(params: DeleteRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchRbacAuthorizationV1NamespacedRoleBinding(params: PatchRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<RoleBinding>;
    listRbacAuthorizationV1NamespacedRole(params: ListRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<RoleList>;
    createRbacAuthorizationV1NamespacedRole(params: CreateRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role>;
    deleteRbacAuthorizationV1CollectionNamespacedRole(params: DeleteRbacAuthorizationV1CollectionNamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readRbacAuthorizationV1NamespacedRole(params: ReadRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role>;
    replaceRbacAuthorizationV1NamespacedRole(params: ReplaceRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role>;
    deleteRbacAuthorizationV1NamespacedRole(params: DeleteRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchRbacAuthorizationV1NamespacedRole(params: PatchRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<Role>;
    listRbacAuthorizationV1RoleBindingForAllNamespaces(params: ListRbacAuthorizationV1RoleBindingForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<RoleBindingList>;
    listRbacAuthorizationV1RoleForAllNamespaces(params: ListRbacAuthorizationV1RoleForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<RoleList>;
    watchRbacAuthorizationV1ClusterRoleBindingList(params: WatchRbacAuthorizationV1ClusterRoleBindingListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1ClusterRoleBinding(params: WatchRbacAuthorizationV1ClusterRoleBindingRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1ClusterRoleList(params: WatchRbacAuthorizationV1ClusterRoleListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1ClusterRole(params: WatchRbacAuthorizationV1ClusterRoleRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1NamespacedRoleBindingList(params: WatchRbacAuthorizationV1NamespacedRoleBindingListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1NamespacedRoleBinding(params: WatchRbacAuthorizationV1NamespacedRoleBindingRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1NamespacedRoleList(params: WatchRbacAuthorizationV1NamespacedRoleListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1NamespacedRole(params: WatchRbacAuthorizationV1NamespacedRoleRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1RoleBindingListForAllNamespaces(params: WatchRbacAuthorizationV1RoleBindingListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchRbacAuthorizationV1RoleListForAllNamespaces(params: WatchRbacAuthorizationV1RoleListForAllNamespacesRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getSchedulingAPIGroup(params: GetSchedulingAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getSchedulingV1APIResources(params: GetSchedulingV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listSchedulingV1PriorityClass(params: ListSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClassList>;
    createSchedulingV1PriorityClass(params: CreateSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass>;
    deleteSchedulingV1CollectionPriorityClass(params: DeleteSchedulingV1CollectionPriorityClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readSchedulingV1PriorityClass(params: ReadSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass>;
    replaceSchedulingV1PriorityClass(params: ReplaceSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass>;
    deleteSchedulingV1PriorityClass(params: DeleteSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    patchSchedulingV1PriorityClass(params: PatchSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<PriorityClass>;
    watchSchedulingV1PriorityClassList(params: WatchSchedulingV1PriorityClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchSchedulingV1PriorityClass(params: WatchSchedulingV1PriorityClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    getStorageAPIGroup(params: GetStorageAPIGroupRequest, opts?: APIClientRequestOpts): Promise<APIGroup>;
    getStorageV1APIResources(params: GetStorageV1APIResourcesRequest, opts?: APIClientRequestOpts): Promise<APIResourceList>;
    listStorageV1CSIDriver(params: ListStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriverList>;
    createStorageV1CSIDriver(params: CreateStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver>;
    deleteStorageV1CollectionCSIDriver(params: DeleteStorageV1CollectionCSIDriverRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readStorageV1CSIDriver(params: ReadStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver>;
    replaceStorageV1CSIDriver(params: ReplaceStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver>;
    deleteStorageV1CSIDriver(params: DeleteStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver>;
    patchStorageV1CSIDriver(params: PatchStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<CSIDriver>;
    listStorageV1CSINode(params: ListStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINodeList>;
    createStorageV1CSINode(params: CreateStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode>;
    deleteStorageV1CollectionCSINode(params: DeleteStorageV1CollectionCSINodeRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readStorageV1CSINode(params: ReadStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode>;
    replaceStorageV1CSINode(params: ReplaceStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode>;
    deleteStorageV1CSINode(params: DeleteStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode>;
    patchStorageV1CSINode(params: PatchStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<CSINode>;
    listStorageV1StorageClass(params: ListStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClassList>;
    createStorageV1StorageClass(params: CreateStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass>;
    deleteStorageV1CollectionStorageClass(params: DeleteStorageV1CollectionStorageClassRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readStorageV1StorageClass(params: ReadStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass>;
    replaceStorageV1StorageClass(params: ReplaceStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass>;
    deleteStorageV1StorageClass(params: DeleteStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass>;
    patchStorageV1StorageClass(params: PatchStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<StorageClass>;
    listStorageV1VolumeAttachment(params: ListStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachmentList>;
    createStorageV1VolumeAttachment(params: CreateStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    deleteStorageV1CollectionVolumeAttachment(params: DeleteStorageV1CollectionVolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<Status>;
    readStorageV1VolumeAttachment(params: ReadStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    replaceStorageV1VolumeAttachment(params: ReplaceStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    deleteStorageV1VolumeAttachment(params: DeleteStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    patchStorageV1VolumeAttachment(params: PatchStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    readStorageV1VolumeAttachmentStatus(params: ReadStorageV1VolumeAttachmentStatusRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    replaceStorageV1VolumeAttachmentStatus(params: ReplaceStorageV1VolumeAttachmentStatusRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    patchStorageV1VolumeAttachmentStatus(params: PatchStorageV1VolumeAttachmentStatusRequest, opts?: APIClientRequestOpts): Promise<VolumeAttachment>;
    watchStorageV1CSIDriverList(params: WatchStorageV1CSIDriverListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1CSIDriver(params: WatchStorageV1CSIDriverRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1CSINodeList(params: WatchStorageV1CSINodeListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1CSINode(params: WatchStorageV1CSINodeRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1StorageClassList(params: WatchStorageV1StorageClassListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1StorageClass(params: WatchStorageV1StorageClassRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1VolumeAttachmentList(params: WatchStorageV1VolumeAttachmentListRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    watchStorageV1VolumeAttachment(params: WatchStorageV1VolumeAttachmentRequest, opts?: APIClientRequestOpts): Promise<WatchEvent>;
    logFileListHandler(params: LogFileListHandlerRequest, opts?: APIClientRequestOpts): Promise<any>;
    logFileHandler(params: LogFileHandlerRequest, opts?: APIClientRequestOpts): Promise<any>;
    getServiceAccountIssuerOpenIDKeyset(params: GetServiceAccountIssuerOpenIDKeysetRequest, opts?: APIClientRequestOpts): Promise<string>;
    getCodeVersion(params: GetCodeVersionRequest, opts?: APIClientRequestOpts): Promise<Info>;
}
