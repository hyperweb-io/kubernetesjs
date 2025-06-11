'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { fs } from '@zenfs/core'
import 'xterm/css/xterm.css'

interface TerminalProps {
  className?: string
  visible?: boolean
}

export function Terminal({ className, visible = true }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const [currentPath, setCurrentPath] = useState('/project')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentCommand, setCurrentCommand] = useState('')

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        cursorAccent: '#1e1e1e',
        selection: '#264f78',
        black: '#1e1e1e',
        red: '#f44747',
        green: '#608b4e',
        yellow: '#dcdcaa',
        blue: '#569cd6',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#d4d4d4',
        brightBlack: '#808080',
        brightRed: '#f44747',
        brightGreen: '#608b4e',
        brightYellow: '#dcdcaa',
        brightBlue: '#569cd6',
        brightMagenta: '#c678dd',
        brightCyan: '#56b6c2',
        brightWhite: '#ffffff'
      }
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    term.open(terminalRef.current)
    
    // Delay fit to ensure terminal has proper dimensions
    setTimeout(() => {
      try {
        if (visible && terminalRef.current?.offsetWidth && terminalRef.current?.offsetHeight) {
          fitAddon.fit()
        }
      } catch (error) {
        console.warn('Terminal fit failed:', error)
      }
    }, 100)

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Welcome message
    term.writeln('\x1b[1;32mWeb IDE Terminal\x1b[0m')
    term.writeln('Type \x1b[1;36mhelp\x1b[0m for available commands')
    term.writeln('')
    promptUser()

    // Handle input
    term.onData((data) => {
      handleInput(data)
    })

    // Handle resize
    const handleResize = () => {
      try {
        if (fitAddon && terminalRef.current && visible && terminalRef.current.offsetWidth && terminalRef.current.offsetHeight) {
          fitAddon.fit()
        }
      } catch (error) {
        console.warn('Terminal resize failed:', error)
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [])

  // Handle visibility changes
  useEffect(() => {
    if (visible && fitAddonRef.current && terminalRef.current?.offsetWidth && terminalRef.current?.offsetHeight) {
      setTimeout(() => {
        try {
          fitAddonRef.current?.fit()
        } catch (error) {
          console.warn('Terminal visibility fit failed:', error)
        }
      }, 100)
    }
  }, [visible])

  const promptUser = () => {
    if (xtermRef.current) {
      xtermRef.current.write(`\r\n\x1b[1;34m${currentPath}\x1b[0m $ `)
    }
  }

  const handleInput = (data: string) => {
    const term = xtermRef.current
    if (!term) return

    const code = data.charCodeAt(0)

    if (code === 13) {
      // Enter key
      executeCommand(currentCommand)
      setCommandHistory([...commandHistory, currentCommand])
      setHistoryIndex(-1)
      setCurrentCommand('')
    } else if (code === 127) {
      // Backspace
      if (currentCommand.length > 0) {
        term.write('\b \b')
        setCurrentCommand(currentCommand.slice(0, -1))
      }
    } else if (code === 27) {
      // Escape sequences (arrows)
      if (data === '\x1b[A') {
        // Up arrow
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1
          const cmd = commandHistory[commandHistory.length - 1 - newIndex]
          // Clear current line
          term.write(`\r\x1b[K\x1b[1;34m${currentPath}\x1b[0m $ ${cmd}`)
          setCurrentCommand(cmd)
          setHistoryIndex(newIndex)
        }
      } else if (data === '\x1b[B') {
        // Down arrow
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          const cmd = commandHistory[commandHistory.length - 1 - newIndex]
          term.write(`\r\x1b[K\x1b[1;34m${currentPath}\x1b[0m $ ${cmd}`)
          setCurrentCommand(cmd)
          setHistoryIndex(newIndex)
        } else if (historyIndex === 0) {
          term.write(`\r\x1b[K\x1b[1;34m${currentPath}\x1b[0m $ `)
          setCurrentCommand('')
          setHistoryIndex(-1)
        }
      }
    } else if (code < 32) {
      // Other control characters
      return
    } else {
      // Regular character
      term.write(data)
      setCurrentCommand(currentCommand + data)
    }
  }

  const executeCommand = async (command: string) => {
    const term = xtermRef.current
    if (!term) return

    term.writeln('')

    const parts = command.trim().split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    try {
      switch (cmd) {
        case '':
          break

        case 'help':
          term.writeln('Available commands:')
          term.writeln('  \x1b[1;36mls\x1b[0m [path]      - List directory contents')
          term.writeln('  \x1b[1;36mcat\x1b[0m <file>     - Display file contents')
          term.writeln('  \x1b[1;36mecho\x1b[0m <text>    - Display text')
          term.writeln('  \x1b[1;36mpwd\x1b[0m            - Print working directory')
          term.writeln('  \x1b[1;36mcd\x1b[0m <path>      - Change directory')
          term.writeln('  \x1b[1;36mmkdir\x1b[0m <name>   - Create directory')
          term.writeln('  \x1b[1;36mtouch\x1b[0m <name>   - Create empty file')
          term.writeln('  \x1b[1;36mrm\x1b[0m <path>      - Remove file or directory')
          term.writeln('  \x1b[1;36mclear\x1b[0m          - Clear terminal')
          term.writeln('  \x1b[1;36mhelp\x1b[0m           - Show this help')
          break

        case 'pwd':
          term.writeln(currentPath)
          break

        case 'ls':
          const targetPath = args.length > 0 ? resolvePath(args[0]) : currentPath
          const entries = await fs.promises.readdir(targetPath)
          
          for (const entry of entries) {
            const fullPath = `${targetPath}/${entry}`.replace('//', '/')
            const stats = await fs.promises.stat(fullPath)
            if (stats.isDirectory()) {
              term.writeln(`\x1b[1;34m${entry}/\x1b[0m`)
            } else {
              term.writeln(entry)
            }
          }
          break

        case 'cat':
          if (args.length === 0) {
            term.writeln('\x1b[1;31mError: cat requires a file argument\x1b[0m')
          } else {
            const filePath = resolvePath(args[0])
            const content = await fs.promises.readFile(filePath, 'utf8')
            term.writeln(content)
          }
          break

        case 'echo':
          term.writeln(args.join(' '))
          break

        case 'cd':
          if (args.length === 0) {
            setCurrentPath('/project')
          } else {
            const newPath = resolvePath(args[0])
            const stats = await fs.promises.stat(newPath)
            if (stats.isDirectory()) {
              setCurrentPath(newPath)
            } else {
              term.writeln(`\x1b[1;31mError: ${args[0]} is not a directory\x1b[0m`)
            }
          }
          break

        case 'mkdir':
          if (args.length === 0) {
            term.writeln('\x1b[1;31mError: mkdir requires a directory name\x1b[0m')
          } else {
            const dirPath = resolvePath(args[0])
            await fs.promises.mkdir(dirPath)
            term.writeln(`Created directory: ${args[0]}`)
          }
          break

        case 'touch':
          if (args.length === 0) {
            term.writeln('\x1b[1;31mError: touch requires a file name\x1b[0m')
          } else {
            const filePath = resolvePath(args[0])
            await fs.promises.writeFile(filePath, '')
            term.writeln(`Created file: ${args[0]}`)
          }
          break

        case 'rm':
          if (args.length === 0) {
            term.writeln('\x1b[1;31mError: rm requires a file or directory argument\x1b[0m')
          } else {
            const targetPath = resolvePath(args[0])
            const stats = await fs.promises.stat(targetPath)
            if (stats.isDirectory()) {
              await fs.promises.rmdir(targetPath)
            } else {
              await fs.promises.unlink(targetPath)
            }
            term.writeln(`Removed: ${args[0]}`)
          }
          break

        case 'clear':
          term.clear()
          break

        default:
          term.writeln(`\x1b[1;31mCommand not found: ${cmd}\x1b[0m`)
          term.writeln('Type \x1b[1;36mhelp\x1b[0m for available commands')
      }
    } catch (error: any) {
      term.writeln(`\x1b[1;31mError: ${error.message}\x1b[0m`)
    }

    promptUser()
  }

  const resolvePath = (path: string): string => {
    if (path.startsWith('/')) {
      return path
    }
    if (path === '.') {
      return currentPath
    }
    if (path === '..') {
      const parts = currentPath.split('/')
      return parts.slice(0, -1).join('/') || '/'
    }
    return `${currentPath}/${path}`.replace('//', '/')
  }

  return <div ref={terminalRef} className={className} />
}