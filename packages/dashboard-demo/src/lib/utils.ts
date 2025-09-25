import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'Just now';
}

export function validateKubernetesName(name: string): boolean {
  const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
  return regex.test(name) && name.length <= 63;
}

export function validateNamespace(namespace: string): boolean {
  return validateKubernetesName(namespace);
}

export function parseResourceQuantity(quantity: string): number {
  const units = {
    'Ki': 1024,
    'Mi': 1024 ** 2,
    'Gi': 1024 ** 3,
    'Ti': 1024 ** 4,
    'k': 1000,
    'M': 1000 ** 2,
    'G': 1000 ** 3,
    'T': 1000 ** 4,
    'm': 0.001,
  };

  const match = quantity.match(/^(\d+(?:\.\d+)?)([a-zA-Z]*)$/);
  if (!match) return 0;

  const [, valueStr, unit] = match;
  const value = parseFloat(valueStr);

  if (unit && units[unit as keyof typeof units]) {
    return value * units[unit as keyof typeof units];
  }

  return value;
}
