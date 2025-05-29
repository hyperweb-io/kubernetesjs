"use client";

import { useState } from "react";
import { MoreHorizontal, Trash, RefreshCw, Scale, Edit } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeploymentListProps {
  deployments: any[];
  isLoading: boolean;
  error: string | null;
}

export function DeploymentList({ deployments, isLoading, error }: DeploymentListProps) {
  const { client, namespace } = useKubernetes();
  const router = useRouter();
  const [deletingDeployment, setDeletingDeployment] = useState<string | null>(null);
  const [scalingDeployment, setScalingDeployment] = useState<string | null>(null);
  const [replicaCount, setReplicaCount] = useState<number>(1);
  const [isScaleDialogOpen, setIsScaleDialogOpen] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<any>(null);

  const handleDeleteDeployment = async (deploymentName: string) => {
    setDeletingDeployment(deploymentName);
    try {
      await client.deleteAppsV1NamespacedDeployment({
        path: {
          name: deploymentName,
          namespace
        }
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete deployment:", error);
    } finally {
      setDeletingDeployment(null);
    }
  };

  const handleScaleDeployment = async () => {
    if (!selectedDeployment) return;
    
    setScalingDeployment(selectedDeployment.metadata.name);
    try {
      const deployment = await client.readAppsV1NamespacedDeployment({
        path: {
          name: selectedDeployment.metadata.name,
          namespace
        }
      });
      
      deployment.spec.replicas = replicaCount;
      
      await client.patchAppsV1NamespacedDeployment({
        path: {
          name: selectedDeployment.metadata.name,
          namespace
        },
        body: {
          spec: {
            replicas: replicaCount
          }
        }
      });
      
      setIsScaleDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to scale deployment:", error);
    } finally {
      setScalingDeployment(null);
    }
  };

  const handleOpenScaleDialog = (deployment: any) => {
    setSelectedDeployment(deployment);
    setReplicaCount(deployment.spec.replicas || 1);
    setIsScaleDialogOpen(true);
  };

  const handleEditYaml = (deploymentName: string) => {
    router.push(`/yaml-editor?resource=deployment&name=${deploymentName}&namespace=${namespace}`);
  };

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>Error loading deployments: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Replicas</TableHead>
              <TableHead>Ready</TableHead>
              <TableHead>Up-to-date</TableHead>
              <TableHead>Available</TableHead>
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
            ) : deployments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No deployments found in the {namespace} namespace
                </TableCell>
              </TableRow>
            ) : (
              deployments.map((deployment) => {
                const deploymentName = deployment.metadata.name;
                const replicas = deployment.spec.replicas || 0;
                const status = deployment.status || {};
                const readyReplicas = status.readyReplicas || 0;
                const updatedReplicas = status.updatedReplicas || 0;
                const availableReplicas = status.availableReplicas || 0;
                const creationTimestamp = new Date(deployment.metadata.creationTimestamp);
                const age = getAge(creationTimestamp);
                
                return (
                  <TableRow key={deploymentName}>
                    <TableCell className="font-medium">{deploymentName}</TableCell>
                    <TableCell>{replicas}</TableCell>
                    <TableCell>{`${readyReplicas}/${replicas}`}</TableCell>
                    <TableCell>{updatedReplicas}</TableCell>
                    <TableCell>{availableReplicas}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleOpenScaleDialog(deployment)}>
                            <Scale className="mr-2 h-4 w-4" />
                            Scale
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditYaml(deploymentName)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit YAML
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDeployment(deploymentName)}
                            disabled={deletingDeployment === deploymentName}
                            className="text-destructive focus:text-destructive"
                          >
                            {deletingDeployment === deploymentName ? (
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

      <Dialog open={isScaleDialogOpen} onOpenChange={setIsScaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scale Deployment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={selectedDeployment?.metadata.name || ""}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="replicas" className="text-right">
                Replicas
              </Label>
              <Input
                id="replicas"
                type="number"
                min="0"
                value={replicaCount}
                onChange={(e) => setReplicaCount(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsScaleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleScaleDeployment}
              disabled={scalingDeployment === selectedDeployment?.metadata.name}
            >
              {scalingDeployment === selectedDeployment?.metadata.name ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scaling...
                </>
              ) : (
                "Scale"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
