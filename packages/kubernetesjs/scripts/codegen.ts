import { writeFileSync } from 'fs';
import { getDefaultSchemaSDKOptions, generateOpenApiClient } from 'schema-sdk';
import schema from './swagger.json';

const options = getDefaultSchemaSDKOptions({
  includePropertyComments: true,
  clientName: 'KubernetesClient',
  includeSwaggerUrl: true,
  exclude: [
    '*.v1beta1.*',
    '*.v2beta1.*',
    'io.k8s.api.events.v1.EventSeries',
    'io.k8s.api.events.v1.Event',
    'io.k8s.api.flowcontrol*',
  ],
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
      exclude: ['*flowschema*', '*v1beta1*', '*v2beta1*'],
      excludeRequests: ['head', 'options'],
      excludeTags: [
        'storage_v1beta1',
        '*v1beta1',
        '*v2beta1',
        '*v1beta1*',
        '*v2beta1*',
      ],
    },
    includeTypeComments: true,
    includeMethodComments: true,
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
      },
    },
  },
  schema as any
);
writeFileSync(
  __dirname + '/../src/index.ts',
  code
);