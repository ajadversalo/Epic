import type { ReactNode } from 'react';
import './globals.css';
import './explorer.css';
import './graphql-explorer.css';
import './ai-explorer.css';

export const metadata = { title: 'StackLab', description: 'A hands-on full-stack systems lab' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
