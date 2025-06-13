'use client';

import { useCallback, useEffect, useState } from 'react';
import Editor, { loader, type OnMount } from '@monaco-editor/react';
import { AlertCircle, CircleCheck } from 'lucide-react';
import tomorrowNightTheme from 'monaco-themes/themes/Tomorrow-Night.json';
import tomorrowTheme from 'monaco-themes/themes/Tomorrow.json';
import { useTheme } from 'next-themes';

import { generateFakeData, type JSONSchema } from '@/lib/contract/fake-args';
import { isValidJson } from '@/lib/contract/interact';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MonacoEditor = Parameters<OnMount>[0];

const getJsonStatus = (
  value: string
): {
  icon: React.ReactNode;
  message: string;
  className?: string;
} => {
  const { isValid, error } = isValidJson(value);

  if (isValid) {
    return {
      icon: <CircleCheck className="h-4 w-4 text-green-500" />,
      message: 'Valid JSON',
    };
  }

  return {
    icon: <AlertCircle className="h-4 w-4 text-destructive" />,
    message: error || 'Invalid JSON',
    className: 'text-destructive',
  };
};

interface JsonEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  readOnly?: boolean;
  editorClassName?: string;
  containerClassName?: string;
  showLineHighlight?: boolean;
  argsSchema?: JSONSchema;
  onGenerateExample?: () => void;
}

export const JsonEditor = ({
  value: externalValue,
  onChange,
  height = '240px',
  readOnly = false,
  editorClassName,
  containerClassName,
  showLineHighlight = true,
  argsSchema,
  onGenerateExample,
}: JsonEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [internalValue, setInternalValue] = useState(externalValue ?? '');
  const [editor, setEditor] = useState<MonacoEditor>();

  const { theme } = useTheme();

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme('tomorrow', tomorrowTheme as any);
      monaco.editor.defineTheme('tomorrow-night', tomorrowNightTheme as any);
    });
  }, []);

  const handleChange = (newValue: string | undefined) => {
    const value = newValue ?? '';
    setInternalValue(value);
    onChange?.(value);
  };

  const currentValue = externalValue ?? internalValue;

  const handleFormat = useCallback((monacoEditor?: MonacoEditor) => {
    if (monacoEditor) {
      monacoEditor.getAction('editor.action.formatDocument')?.run();
    }
  }, []);

  const handleGenerateExample = useCallback(() => {
    if (!argsSchema || !onChange) return;

    try {
      const fakeData = generateFakeData(argsSchema);

      const jsonString = JSON.stringify(fakeData, null, 2);

      onChange(jsonString);

      onGenerateExample?.();
    } catch (error) {
      console.error('Error generating example:', error);
      onChange('[]');
    }
  }, [argsSchema, onChange, onGenerateExample]);

  const { icon, message, className: statusClassName } = getJsonStatus(currentValue);

  const handleMount: OnMount = (editor, monaco) => {
    setEditor(editor);
    setIsLoading(false);

    editor.addAction({
      id: 'format-json',
      label: 'Format JSON',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      run: () => handleFormat(editor),
    });
  };

  return (
    <>
      <div className={cn('relative overflow-hidden rounded-md border', containerClassName)}>
        {!readOnly && !isLoading && (
          <div className="absolute right-5 top-2 z-10 flex gap-2">
            <TooltipProvider delayDuration={300}>
              {argsSchema && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-7 px-2"
                      variant="outline"
                      type="button"
                      size="sm"
                      onClick={handleGenerateExample}
                    >
                      Generate Example Args
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-body-text">Generate example arguments based on schema</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-7 px-2"
                    variant="outline"
                    type="button"
                    size="sm"
                    onClick={() => handleFormat(editor)}
                    disabled={!currentValue}
                  >
                    Format
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-body-text">Format JSON (Ctrl/Cmd + Shift + F)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <Editor
          height={height}
          language="json"
          value={currentValue}
          onChange={handleChange}
          theme={theme === 'dark' ? 'tomorrow-night' : 'tomorrow'}
          className={editorClassName}
          onMount={handleMount}
          loading="Loading JSON editor..."
          options={{
            lineNumbers: 'off',
            fontSize: 14,
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            minimap: {
              enabled: false,
            },
            folding: true,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            readOnly,
            padding: {
              top: 10,
              bottom: 10,
            },
            renderWhitespace: 'none',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderLineHighlight: showLineHighlight ? 'line' : 'none',
            links: false,
            contextmenu: false,
            quickSuggestions: false,
          }}
        />
      </div>

      {currentValue.trim() && !readOnly && (
        <p
          className={cn(
            'mt-1.5 flex items-center gap-2 text-[0.8rem] leading-tight text-muted-foreground',
            statusClassName
          )}
        >
          {icon}
          {message}
        </p>
      )}
    </>
  );
};
