# @kubernetesjs/cli

<p align="center">
  <img src="https://user-images.githubusercontent.com/545047/188804067-28e67e5e-0214-4449-ab04-2e0c564a6885.svg" width="80"><br />
    KubernetesJS CLI
</p>

A command-line interface for interacting with Kubernetes clusters, built with TypeScript.

## Installation

```sh
npm install -g @kubernetesjs/cli
```

## Usage

The CLI provides several commands for managing Kubernetes resources. You can use either `k8s` or `kubernetes` as the command prefix:

```sh
k8s <command> [options]
# or
kubernetes <command> [options]
```

Options:
-  `--client-url`: Kubernetes API server URL (default: http://localhost:8001)


### Available Commands

#### Get
Retrieve information about Kubernetes resources.

```sh
k8s get <resource> [options]
```

#### Apply
Apply configurations to your Kubernetes cluster.

```sh
k8s apply -f <file> [options]
```

#### Delete
Delete resources from your Kubernetes cluster.

```sh
k8s delete <resource> <name> [options]
```

#### Describe
Show detailed information about a specific resource.

```sh
k8s describe <resource> <name> [options]
```

#### Logs
View logs from pods.

```sh
k8s logs <pod-name> [options]
```

#### Port Forward
Forward ports from pods to your local machine.

```sh
k8s port-forward <pod-name> <local-port>:<pod-port> [options]
```

#### Exec
Execute commands in a container.

```sh
k8s exec <pod-name> -- <command> [options]
```

#### Cluster Info
Display information about the current cluster.

```sh
k8s cluster-info
```

#### Config
Manage Kubernetes configuration.

```sh
k8s config [options]
```

## Examples

### Get Pod Information

```sh
k8s get pods
```

### Apply a Configuration File

```sh
k8s apply -f deployment.yaml
```

### View Pod Logs

```sh
k8s logs my-pod
```

### Port Forward to a Service

```sh
k8s port-forward my-pod 8080:80
```

## Configuration

The CLI uses the default Kubernetes configuration from `~/.kube/config`. You can specify a different configuration file using the `--kubeconfig` option.

## Development

When first cloning the repo:

```sh
yarn
# Build the production packages
yarn build
```

For development with source maps:

```sh
yarn
# Build with source maps for better debugging
yarn build:dev
```

## Related

Checkout these related projects:

* [`schema-typescript`](https://github.com/hyperweb-io/schema-typescript/tree/main/packages/schema-typescript)  
  Provides robust tools for handling JSON schemas and converting them to TypeScript interfaces with ease and efficiency.
* [`@schema-typescript/cli`](https://github.com/hyperweb-io/schema-typescript/tree/main/packages/cli)  
  CLI is the command line utility for `schema-typescript`.
* [`schema-sdk`](https://github.com/hyperweb-io/schema-typescript/tree/main/packages/schema-sdk)  
  Provides robust tools for handling OpenAPI schemas and converting them to TypeScript clients with ease and efficiency.
* [`starship`](https://github.com/hyperweb-io/starship) Unified Testing and Development for the Interchain.

## Credits

🛠 Built by Hyperweb — if you like our tools, please checkout and contribute to [our github ⚛️](https://github.com/hyperweb-io)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
