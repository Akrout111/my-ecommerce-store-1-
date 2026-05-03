"use client";

import dynamic from 'next/dynamic';

const StyleAssistant = dynamic(
  () => import('@/components/ai/StyleAssistant').then((m) => ({ default: m.StyleAssistant })),
  { ssr: false }
);

export function StyleAssistantLoader() {
  return <StyleAssistant />;
}
