import { writeFileSync } from 'fs';
import { generateOpenApiClient, getDefaultSchemaSDKOptions } from 'schema-sdk';

import schema from './swagger.json';

const options = getDefaultSchemaSDKOptions({
  includePropertyComments: true,
  clientName: 'InterwebClient',
  includeSwaggerUrl: true,
  exclude: [
    '*autoscaling.v2*',
  ],
});
// Apply IntOrString patch once (mutating a cloned schema)
const patchedSchema = JSON.parse(JSON.stringify(schema)) as any;
const intOrString = patchedSchema?.definitions?.['io.k8s.apimachinery.pkg.util.intstr.IntOrString'];
if (intOrString && typeof intOrString === 'object') {
  delete intOrString.type;
  delete intOrString.format;
  intOrString.oneOf = [
    { type: 'string' },
    { type: 'integer', format: 'int32' },
  ];
}

const code = generateOpenApiClient(
  {
    ...options,
    npmApiClient: './client',
    opsIndex: {
      enabled: true,
      emptyGroupLabel: 'core',
    },
    operationNamingStrategy: {
      // aliases: {
      //   listCoreV1PodForAllNamespaces: 'getPods',
      // },
      // renameMap: {
      //   listCoreV1PodForAllNamespaces: 'listPods',
      // },
    },
    paths: {
      //exclude: ['*v1beta1*', '*v2beta1*'],
      excludeRequests: ['head', 'options'],
      excludeTags: [
        'storage_v1beta1',
        '*autoscaling*',
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
      },
    },
  },
  patchedSchema as any
);
writeFileSync(
  __dirname + '/../src/index.ts',
  code
);
