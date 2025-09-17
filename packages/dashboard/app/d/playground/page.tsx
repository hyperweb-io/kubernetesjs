'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coins, // Faucet
  DatabaseZap, // Query
  FilePlus, // Create
  FileText, // Contracts
  Play, // Execute
  Rocket, // Deploy
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Create Contract',
    description: 'Start building contracts from scratch or templates.',
    href: '/d/playground/create',
    icon: FilePlus,
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Explore Contracts',
    description: 'Browse and interact with contracts created by the community.',
    href: '/d/playground/contracts',
    icon: FileText,
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Deploy Contract',
    description: 'Deploy your compiled contracts to the selected network.',
    href: '/d/playground/deploy',
    icon: Rocket,
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Execute Message',
    description: 'Interact with contracts by sending execute messages.',
    href: '/d/playground/interact?tab=execute',
    icon: Play,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    title: 'Query State',
    description: 'Read current data and state directly from contracts.',
    href: '/d/playground/interact?tab=query',
    icon: DatabaseZap,
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'Faucet',
    description: 'Get testnet tokens needed for deployment and execution.',
    href: '/d/playground/faucet',
    icon: Coins,
    bgColor: 'bg-pink-50 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
];

function ContractPlaygroundIndex() {
  return (
    <div className="container mx-auto max-w-5xl px-4 pb-8 pt-4 md:pb-12 md:pt-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:mb-12 md:text-4xl">
        Explore the Playground
      </h1>

      <div className="relative rounded-xl border border-border/40 bg-card/50 p-6 shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              href={feature.href}
              key={feature.href}
              passHref
              className="block rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] focus:scale-[1.02] focus:outline-none
                                  focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <Card
                className="flex h-full flex-col overflow-hidden border transition-colors duration-200 hover:border-primary/60
                                      dark:hover:border-primary/60"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContractPlaygroundIndex;
