export interface AppBuildTimeConfig {
  rpcUrl?: string;
  faucetUrl?: string;
  registryUrl?: string;
  s3BucketUrl?: string;
  s3TarballName?: string;
}

const BASE_URL = 'hyperweb-devnet-1-genesis.hyperweb-devnet-1.hyperweb.build';
const RPC_URL = `https://rpc.${BASE_URL}`;
const REST_URL = `https://rest.${BASE_URL}`;
const REGISTRY_URL = `https://registry.hyperweb-devnet-1.hyperweb.build`;

export const appBuildTimeConfig: Readonly<AppBuildTimeConfig> = Object.freeze({
  rpcUrl: RPC_URL,
  faucetUrl: `${REST_URL}/faucet`,
  registryUrl: REGISTRY_URL,
  s3BucketUrl: `https://hyperweb-playground.s3.amazonaws.com/create-hyperweb-app`,
  s3TarballName: `latest.tar.gz`,
});
