"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKubernetes } from "@/hooks/use-kubernetes";
import { PlusCircle, Loader2 } from "lucide-react";

export function DeploymentWizard() {
  const { client, namespace } = useKubernetes();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [replicas, setReplicas] = useState(1);
  const [port, setPort] = useState(80);
  
  const [envVars, setEnvVars] = useState<Array<{ name: string; value: string }>>([
    { name: "", value: "" }
  ]);
  
  const addEnvVar = () => {
    setEnvVars([...envVars, { name: "", value: "" }]);
  };
  
  const updateEnvVar = (index: number, field: "name" | "value", value: string) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };
  
  const removeEnvVar = (index: number) => {
    const updated = [...envVars];
    updated.splice(index, 1);
    setEnvVars(updated);
  };
  
  const resetForm = () => {
    setName("");
    setImage("");
    setReplicas(1);
    setPort(80);
    setEnvVars([{ name: "", value: "" }]);
    setDeploymentError(null);
  };
  
  const handleDeploy = async () => {
    if (!name || !image) {
      setDeploymentError("Name and image are required");
      return;
    }
    
    setIsDeploying(true);
    setDeploymentError(null);
    
    try {
      const filteredEnvVars = envVars.filter(env => env.name && env.value);
      
      const deploymentManifest = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          name,
          namespace
        },
        spec: {
          replicas,
          selector: {
            matchLabels: {
              app: name
            }
          },
          template: {
            metadata: {
              labels: {
                app: name
              }
            },
            spec: {
              containers: [
                {
                  name: name,
                  image,
                  ports: [
                    {
                      containerPort: port
                    }
                  ],
                  env: filteredEnvVars.map(env => ({
                    name: env.name,
                    value: env.value
                  }))
                }
              ]
            }
          }
        }
      };
      
      await client.createAppsV1NamespacedDeployment({
        path: { namespace },
        body: deploymentManifest
      });
      
      if (port) {
        const serviceManifest = {
          apiVersion: "v1",
          kind: "Service",
          metadata: {
            name,
            namespace
          },
          spec: {
            selector: {
              app: name
            },
            ports: [
              {
                port,
                targetPort: port
              }
            ]
          }
        };
        
        await client.createCoreV1NamespacedService({
          path: { namespace },
          body: serviceManifest
        });
      }
      
      setOpen(false);
      resetForm();
      router.push("/resources/deployments");
      
    } catch (err) {
      setDeploymentError(err instanceof Error ? err.message : "Failed to create deployment");
    } finally {
      setIsDeploying(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Deployment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Deployment</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="nginx:latest"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="replicas" className="text-right">
                Replicas
              </Label>
              <Input
                id="replicas"
                type="number"
                min="1"
                value={replicas}
                onChange={(e) => setReplicas(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="port" className="text-right">
                Port
              </Label>
              <Input
                id="port"
                type="number"
                min="1"
                max="65535"
                value={port}
                onChange={(e) => setPort(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Environment Variables</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addEnvVar}
                >
                  Add Variable
                </Button>
              </div>
              
              {envVars.map((env, index) => (
                <div key={index} className="grid grid-cols-5 gap-2">
                  <Input
                    placeholder="Name"
                    value={env.name}
                    onChange={(e) => updateEnvVar(index, "name", e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    placeholder="Value"
                    value={env.value}
                    onChange={(e) => updateEnvVar(index, "value", e.target.value)}
                    className="col-span-2"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeEnvVar(index)}
                    disabled={envVars.length === 1}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {deploymentError && (
          <div className="text-sm text-destructive mt-2">
            {deploymentError}
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeploy} disabled={isDeploying}>
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
