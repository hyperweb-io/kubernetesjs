"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, RefreshCw, Edit, ExternalLink } from "lucide-react";
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

interface ServiceListProps {
  services: any[];
  isLoading: boolean;
  error: string | null;
}

export function ServiceList({ services, isLoading, error }: ServiceListProps) {
  const { client, namespace } = useKubernetes();
  const router = useRouter();
  const [deletingService, setDeletingService] = useState<string | null>(null);

  const handleDeleteService = async (serviceName: string) => {
    setDeletingService(serviceName);
    try {
      await client.deleteCoreV1NamespacedService({
        path: {
          name: serviceName,
          namespace
        }
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setDeletingService(null);
    }
  };

  const handleEditYaml = (serviceName: string) => {
    router.push(`/yaml-editor?resource=service&name=${serviceName}&namespace=${namespace}`);
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "ClusterIP":
        return <Badge variant="secondary">ClusterIP</Badge>;
      case "NodePort":
        return <Badge variant="success">NodePort</Badge>;
      case "LoadBalancer":
        return <Badge variant="default">LoadBalancer</Badge>;
      case "ExternalName":
        return <Badge variant="outline">ExternalName</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>Error loading services: {error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Cluster IP</TableHead>
            <TableHead>External IP</TableHead>
            <TableHead>Ports</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={7}>
                  <div className="h-6 w-full animate-pulse rounded bg-muted"></div>
                </TableCell>
              </TableRow>
            ))
          ) : services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No services found in the {namespace} namespace
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => {
              const serviceName = service.metadata.name;
              const serviceType = service.spec.type || "ClusterIP";
              const clusterIP = service.spec.clusterIP || "-";
              const externalIPs = service.spec.externalIPs || [];
              const loadBalancerIPs = service.status?.loadBalancer?.ingress?.map((ing: any) => ing.ip || ing.hostname) || [];
              const externalIP = [...externalIPs, ...loadBalancerIPs].join(", ") || "-";
              const ports = service.spec.ports || [];
              const creationTimestamp = new Date(service.metadata.creationTimestamp);
              const age = getAge(creationTimestamp);
              
              return (
                <TableRow key={serviceName}>
                  <TableCell className="font-medium">{serviceName}</TableCell>
                  <TableCell>{getServiceTypeLabel(serviceType)}</TableCell>
                  <TableCell>{clusterIP}</TableCell>
                  <TableCell>{externalIP}</TableCell>
                  <TableCell>
                    {ports.map((port: any, index: number) => (
                      <div key={index} className="text-xs">
                        {port.port}:{port.targetPort}/{port.protocol}
                      </div>
                    ))}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditYaml(serviceName)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit YAML
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteService(serviceName)}
                          disabled={deletingService === serviceName}
                          className="text-destructive focus:text-destructive"
                        >
                          {deletingService === serviceName ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="mr-2 h-4 w-4" />
                          )}
                          Delete
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
