import React from 'react';
import { Logo } from '@/components/icons';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline text-foreground">
                    Event Splitter
                </h1>
            </div>
        </div>
        {children}
      </div>
    </main>
  );
}
