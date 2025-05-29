"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, RefreshCw, Terminal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useKubernetes } from "@/hooks/use-kubernetes";
import { useRouter } from "next/navigation";

interface PodListProps {
  pods: any[];
  isLoading: boolean;
  error: string | null;
}

export function PodList({ pods, isLoading, error }: PodListProps) {
  const { client, namespace } = useKubernetes();
  const router = useRouter();
  const [deletingPod, setDeletingPod] = useState<string | null>(null);

  const handleDeletePod = async (podName: string) => {
    setDeletingPod(podName);
    try {
      await client.deleteCoreV1NamespacedPod({
        path: {
          name: podName,
          namespace
        }
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete pod:", error);
    } finally {
      setDeletingPod(null);
    }
  };

  const handleViewLogs = (podName: string) => {
    router.push(`/logs?pod=${podName}&namespace=${namespace}`);
  };

  const handleExecTerminal = (podName: string) => {
    router.push(`/terminal?pod=${podName}&namespace=${namespace}`);
  };

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>Error loading pods: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ready</TableHead>
            <TableHead>Restarts</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={6}>
                  <div className="h-6 w-full animate-pulse rounded bg-muted"></div>
                </TableCell>
              </TableRow>
            ))
          ) : pods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No pods found in the {namespace} namespace
              </TableCell>
            </TableRow>
          ) : (
            pods.map((pod) => {
              const podName = pod.metadata.name;
              const status = pod.status.phase;
              const containerStatuses = pod.status.containerStatuses || [];
              const readyContainers = containerStatuses.filter(c => c.ready).length;
              const totalContainers = containerStatuses.length;
              const restarts = containerStatuses.reduce((sum, c) => sum + (c.restartCount || 0), 0);
              const creationTimestamp = new Date(pod.metadata.creationTimestamp);
              const age = getAge(creationTimestamp);
              
              return (
                <TableRow key={podName}>
                  <TableCell className="font-medium">{podName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(status)}
                      className="capitalize"
                    >
                      {status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{`${readyContainers}/${totalContainers}`}</TableCell>
                  <TableCell>{restarts}</TableCell>
                  <TableCell>{age}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewLogs(podName)}>
                          <Terminal className="mr-2 h-4 w-4" />
                          View Logs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExecTerminal(podName)}>
                          <Terminal className="mr-2 h-4 w-4" />
                          Exec Terminal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeletePod(podName)}
                          disabled={deletingPod === podName}
                          className="text-destructive focus:text-destructive"
                        >
                          {deletingPod === podName ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="mr-2 h-4 w-4" />
                          )}
                          Delete Pod
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusVariant(status: string): "default" | "success" | "warning" | "destructive" {
  switch (status.toLowerCase()) {
    case "running":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "destructive";
    default:
      return "default";
  }
}

function getAge(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec}s`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;
  
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d`;
}
