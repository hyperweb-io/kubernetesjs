'use client'

import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

interface YAMLEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  height?: string
  readOnly?: boolean
}

export function YAMLEditor({ value, onChange, height = '400px', readOnly = false }: YAMLEditorProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme as 'light' | 'dark')
    
    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'light'
      setTheme(newTheme as 'light' | 'dark')
    }
    
    window.addEventListener('storage', handleThemeChange)
    return () => window.removeEventListener('storage', handleThemeChange)
  }, [])
  
  return (
    <div className="border rounded-md overflow-hidden" style={{ height }}>
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={value}
        onChange={onChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          readOnly,
          wordWrap: 'on',
          tabSize: 2,
        }}
      />
    </div>
  )
}
