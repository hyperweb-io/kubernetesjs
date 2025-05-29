"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Layers, 
  Box, 
  Server, 
  Terminal, 
  FileCode, 
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Pods", href: "/resources/pods", icon: Box },
    { name: "Services", href: "/resources/services", icon: Server },
    { name: "Deployments", href: "/resources/deployments", icon: Layers },
    { name: "Logs", href: "/logs", icon: Terminal },
    { name: "YAML Editor", href: "/yaml-editor", icon: FileCode },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">KubernetesJS</h1>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="ml-auto h-8 w-8"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
