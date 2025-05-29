"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ResourceHeader } from "@/components/resources/resource-header";
import { YamlEditor } from "@/components/yaml-editor/yaml-editor";
import { useKubernetes } from "@/hooks/use-kubernetes";

export default function YamlEditorPage() {
  const searchParams = useSearchParams();
  const resourceType = searchParams.get("resource") || "";
  const resourceName = searchParams.get("name") || "";
  const resourceNamespace = searchParams.get("namespace") || "";
  
  const { client, namespace } = useKubernetes();
  const [yaml, setYaml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResource() {
      if (!resourceType || !resourceName) {
        setError("Resource type and name are required");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        let response;
        const ns = resourceNamespace || namespace;
        
        switch (resourceType.toLowerCase()) {
          case "pod":
            response = await client.readCoreV1NamespacedPod({
              path: { name: resourceName, namespace: ns }
            });
            break;
          case "deployment":
            response = await client.readAppsV1NamespacedDeployment({
              path: { name: resourceName, namespace: ns }
            });
            break;
          case "service":
            response = await client.readCoreV1NamespacedService({
              path: { name: resourceName, namespace: ns }
            });
            break;
          default:
            throw new Error(`Unsupported resource type: ${resourceType}`);
        }
        
        setYaml(JSON.stringify(response, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch resource");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResource();
  }, [client, namespace, resourceType, resourceName, resourceNamespace]);

  const handleSave = async (updatedYaml: string) => {
    if (!resourceType || !resourceName) {
      setSaveError("Resource type and name are required");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    
    try {
      const ns = resourceNamespace || namespace;
      const resourceObject = JSON.parse(updatedYaml);
      
      switch (resourceType.toLowerCase()) {
        case "pod":
          await client.replaceCoreV1NamespacedPod({
            path: { name: resourceName, namespace: ns },
            body: resourceObject
          });
          break;
        case "deployment":
          await client.replaceAppsV1NamespacedDeployment({
            path: { name: resourceName, namespace: ns },
            body: resourceObject
          });
          break;
        case "service":
          await client.replaceCoreV1NamespacedService({
            path: { name: resourceName, namespace: ns },
            body: resourceObject
          });
          break;
        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }
      
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update resource");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ResourceHeader 
        title={`Edit ${resourceType}: ${resourceName}`} 
        description={`Edit YAML for ${resourceType} in the ${resourceNamespace || namespace} namespace`}
      />
      
      <YamlEditor 
        yaml={yaml}
        isLoading={isLoading}
        error={error}
        isSaving={isSaving}
        saveError={saveError}
        onSave={handleSave}
      />
    </div>
  );
}
