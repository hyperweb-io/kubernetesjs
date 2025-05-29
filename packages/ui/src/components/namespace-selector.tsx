"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useKubernetes } from "@/hooks/use-kubernetes";

export function NamespaceSelector() {
  const { client, namespace, setNamespace } = useKubernetes();
  const [open, setOpen] = useState(false);
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchNamespaces() {
      setIsLoading(true);
      try {
        const response = await client.listCoreV1Namespace({
          query: {}
        });
        
        const namespaceNames = response.items?.map(ns => ns.metadata.name) || [];
        setNamespaces(namespaceNames);
      } catch (error) {
        console.error("Failed to fetch namespaces:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNamespaces();
  }, [client]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : namespace}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search namespace..." />
          <CommandEmpty>No namespace found.</CommandEmpty>
          <CommandGroup>
            {namespaces.map((ns) => (
              <CommandItem
                key={ns}
                value={ns}
                onSelect={(currentValue) => {
                  setNamespace(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    namespace === ns ? "opacity-100" : "opacity-0"
                  )}
                />
                {ns}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
