// ==== Contract routes constants ====
export type ContractTabId = 'home' | 'create' | 'deploy' | 'interact' | 'faucet' | 'contracts' | 'assets';

export const CONTRACT_TABS: { value: ContractTabId; label: string; href: string }[] = [
  {
    value: 'home',
    label: 'Playground',
    href: '/d/playground',
  },
  {
    value: 'create',
    label: 'Editor',
    href: '/d/playground/create',
  },
  {
    value: 'deploy',
    label: 'Deploy',
    href: '/d/playground/deploy',
  },
  {
    value: 'interact',
    label: 'Interact',
    href: '/d/playground/interact',
  },
  {
    value: 'contracts',
    label: 'Contracts',
    href: '/d/playground/contracts',
  },
  {
    value: 'faucet',
    label: 'Faucet',
    href: '/d/playground/faucet',
  },
  {
    value: 'assets',
    label: 'Assets',
    href: '/d/playground/assets',
  },
] as const;

// ==== App routes ====
export const routes = {
  home: '/',
  playground: {
    index: CONTRACT_TABS.find((tab) => tab.value === 'home')!.href,
    create: CONTRACT_TABS.find((tab) => tab.value === 'create')!.href,
    deploy: CONTRACT_TABS.find((tab) => tab.value === 'deploy')!.href,
    interact: CONTRACT_TABS.find((tab) => tab.value === 'interact')!.href,
    faucet: CONTRACT_TABS.find((tab) => tab.value === 'faucet')!.href,
    assets: CONTRACT_TABS.find((tab) => tab.value === 'assets')!.href,
    contracts: CONTRACT_TABS.find((tab) => tab.value === 'contracts')!.href,
  },
} as const;

type RouteValue = string | Record<string, unknown> | ((...args: string[]) => string);

type FlattenRoutes<T extends Record<string, RouteValue>, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends (...args: string[]) => string
    ? T[K]
    : T[K] extends string
    ? `${Prefix}${T[K]}`
    : T[K] extends Record<string, RouteValue>
    ? FlattenRoutes<T[K], `${Prefix}${K & string}/`>
    : never;
}[keyof T];

export type AppRoute = FlattenRoutes<typeof routes>;
