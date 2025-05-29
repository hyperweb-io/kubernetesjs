import { KubernetesClient } from '../src';

const client = new KubernetesClient({
  restEndpoint: 'http://127.0.0.1:8001'
});

client.listCoreV1NamespacedPod({
  path: {
    namespace: 'default'
  },
  query: {
    // Add any necessary query parameters here
  }
}).then(result => {


  if (result.items && result.items.length) {
    result.items.forEach(item => {
      console.log('NODE:', item?.spec?.nodeName);



      const initContainers = item?.status?.initContainerStatuses?.map(ic => ({
        image: ic.image,
        name: ic.name,
        ready: ic.ready,
        state: ic.state
      }));

      const containers = item?.status?.containerStatuses?.map(c => ({
        image: c.image,
        name: c.name,
        ready: c.ready,
        state: c.state
      }));

      console.log({ containers });
      console.log({ initContainers });
    });
  }
}).catch(reason => {
  console.error('Failed to fetch pods:', reason);
});