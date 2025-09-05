import { writeFileSync } from 'fs';
import { generateOpenApiClient,getDefaultSchemaSDKOptions } from 'schema-sdk';

import schema from './swagger.json';

const options = getDefaultSchemaSDKOptions({
  includePropertyComments: true,
  clientName: 'InterwebClient',
  includeSwaggerUrl: true,
  exclude: [
    '*.v1beta1.*',
    '*.v2beta1.*',
    'io.k8s.api.events.v1.EventSeries',
    'io.k8s.api.events.v1.Event',
    '*autoscaling.v2*',
  ],
  jsonpatch: [
    {
      op: 'remove',
      path: '/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString/type'
    },
    {
      op: 'remove',
      path: '/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString/format'
    },
    {
      op: 'add',
      path: '/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString/oneOf',
      value: [
        { type: 'string' },
        { type: 'integer', format: 'int32' }
      ]
    }
  ]
});
const code = generateOpenApiClient(
  {
    ...options,
    npmApiClient: './client',
    operationNamingStrategy: {
      // aliases: {
      //   listCoreV1PodForAllNamespaces: 'getPods',
      // },
      // renameMap: {
      //   listCoreV1PodForAllNamespaces: 'listPods',
      // },
    },
    paths: {
      exclude: ['*v1beta1*', '*v2beta1*'],
      excludeRequests: ['head', 'options'],
      excludeTags: [
        'storage_v1beta1',
        '*v1beta1',
        '*v2beta1',
        '*v1beta1*',
        '*v2beta1*',
        '*autoscaling*'
      ],
    },
    includeTypeComments: true,
    includeMethodComments: true,
    includePropertyComments: false,
    mergedParams: false,
    namingStrategy: {
      useLastSegment: true,
      renameMap: {
        'io.k8s.api.discovery.v1.EndpointPort': 'DiscoveryEndpointPort',
        'io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ServiceReference':
          'ApiExtServiceReference',
        'io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookClientConfig':
          'ApiExtWebhookClientConfig',
        'io.k8s.api.admissionregistration.v1.ServiceReference':
          'AdmissionServiceReference',
        'dev.knative.internal.networking.v1alpha1.Certificate':
          'KnativeCertificate',
        'dev.knative.internal.networking.v1alpha1.CertificateList':
          'KnativeCertificateList',
        'dev.knative.internal.networking.v1alpha1.Ingress':
          'KnativeIngress',
        'dev.knative.internal.networking.v1alpha1.IngressList':
          'KnativeIngressList',
        'dev.knative.serving.v1.Service':
          'KnativeService',
        'dev.knative.serving.v1.ServiceList':
          'KnativeServiceList',
      },
    },
  },
  schema as any
);
writeFileSync(
  __dirname + '/../src/index.ts',
  code
);
