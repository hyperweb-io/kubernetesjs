"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, AlertCircle } from "lucide-react";

interface YamlEditorProps {
  yaml: string;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  saveError: string | null;
  onSave: (yaml: string) => void;
}

export function YamlEditor({ 
  yaml, 
  isLoading, 
  error, 
  isSaving, 
  saveError, 
  onSave 
}: YamlEditorProps) {
  const [editedYaml, setEditedYaml] = useState(yaml);
  
  useEffect(() => {
    setEditedYaml(yaml);
  }, [yaml]);

  const handleSave = () => {
    onSave(editedYaml);
  };

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p>Error loading resource: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 h-[500px] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 relative">
              <textarea
                className="w-full h-full p-4 font-mono text-sm resize-none bg-background border-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                value={editedYaml}
                onChange={(e) => setEditedYaml(e.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="flex items-center justify-between p-2 border-t">
              <div>
                {saveError && (
                  <div className="text-destructive text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {saveError}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isLoading || isSaving}
                size="sm"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
