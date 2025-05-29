"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKubernetes } from "@/hooks/use-kubernetes";

interface TerminalProps {
  podName: string;
  containerName?: string;
  namespace?: string;
}

export function Terminal({ podName, containerName, namespace: ns }: TerminalProps) {
  const { client, namespace } = useKubernetes();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectToTerminal = async () => {
      try {
        setError(null);
        
        let container = containerName;
        if (!container) {
          const pod = await client.readCoreV1NamespacedPod({
            path: { name: podName, namespace: ns || namespace }
          });
          container = pod.spec?.containers?.[0]?.name;
          if (!container) {
            throw new Error("No container found in pod");
          }
        }
        
        const socketUrl = `/api/v1/namespaces/${ns || namespace}/pods/${podName}/exec?container=${container}&stdin=true&stdout=true&stderr=true&tty=true&command=sh`;
        
        console.log(`Connecting to terminal: ${socketUrl}`);
        
        setConnected(true);
        setOutput(prev => [...prev, "Connected to container terminal.\n$ "]);
        
        return () => {
          if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
          }
          setConnected(false);
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect to terminal");
        setConnected(false);
      }
    };
    
    connectToTerminal();
  }, [client, namespace, podName, containerName, ns]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      
      const command = input;
      setInput("");
      
      setOutput(prev => [...prev, command]);
      
      setTimeout(() => {
        if (command === "ls") {
          setOutput(prev => [...prev, "bin  dev  etc  home  lib  proc  sys  tmp  usr  var\n$ "]);
        } else if (command === "pwd") {
          setOutput(prev => [...prev, "/\n$ "]);
        } else if (command === "exit") {
          setOutput(prev => [...prev, "Session terminated.\n"]);
          setConnected(false);
        } else {
          setOutput(prev => [...prev, `sh: ${command}: command not found\n$ `]);
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <Card className="h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">
          Terminal: {podName} {containerName ? `/ ${containerName}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="p-4 text-destructive">
            <p>Error connecting to terminal: {error}</p>
          </div>
        ) : (
          <div className="relative h-[400px] flex flex-col">
            <div 
              ref={terminalRef}
              className="flex-1 bg-black text-green-500 p-4 font-mono text-sm overflow-auto"
            >
              {output.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            {connected && (
              <div className="border-t border-border p-2">
                <textarea
                  className="w-full bg-black text-green-500 font-mono text-sm p-2 focus:outline-none resize-none"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type commands here..."
                  disabled={!connected}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
