"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NamespaceSelector } from "@/components/namespace-selector";

interface ResourceHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
}

export function ResourceHeader({ title, description, onRefresh }: ResourceHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <NamespaceSelector />
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        )}
      </div>
    </div>
  );
}
