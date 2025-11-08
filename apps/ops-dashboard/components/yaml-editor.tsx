'use client';

import { useEffect, useMemo, useState } from 'react';

interface YAMLEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  height?: string
  readOnly?: boolean
}

export function YAMLEditor({ value, onChange, height = '400px', readOnly = false }: YAMLEditorProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    
    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'light';
      setTheme(newTheme as 'light' | 'dark');
    };
    
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);
  
  const editorClassName = useMemo(() => {
    const base = 'h-full w-full resize-none p-4 font-mono text-sm outline-none';
    const palette = theme === 'dark'
      ? 'bg-slate-900 text-slate-100'
      : 'bg-white text-slate-900';
    const readOnlyStyles = readOnly ? 'cursor-not-allowed opacity-90' : '';
    return [base, palette, readOnlyStyles].filter(Boolean).join(' ');
  }, [theme, readOnly]);

  return (
    <div className="border rounded-md overflow-hidden" style={{ height }}>
      <textarea
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className={editorClassName}
        style={{ height: '100%' }}
      />
    </div>
  );
}
