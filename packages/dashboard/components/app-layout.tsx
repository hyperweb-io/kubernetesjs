'use client';

import { useState } from 'react';
import { AdaptiveLayout } from '@/components/adaptive-layout';
import { AIChatAgentic } from '@/components/ai-chat-agentic';

export function AppLayout({ children }: { children: React.ReactNode }) {
  // Chat state management
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(400);
  const [chatLayoutMode, setChatLayoutMode] = useState<'floating' | 'snapped'>('floating');

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <>
      <AdaptiveLayout
        onChatToggle={handleChatToggle}
        chatVisible={chatOpen}
        chatLayoutMode={chatLayoutMode}
        chatWidth={chatWidth}
      >
        {children}
      </AdaptiveLayout>

      <AIChatAgentic
        isOpen={chatOpen}
        onToggle={handleChatToggle}
        width={chatWidth}
        onWidthChange={setChatWidth}
        layoutMode={chatLayoutMode}
        onLayoutModeChange={setChatLayoutMode}
      />
    </>
  );
}
