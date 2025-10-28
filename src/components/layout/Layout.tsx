import { type ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};
