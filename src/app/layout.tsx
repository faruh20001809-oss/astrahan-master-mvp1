import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'АстраханьМастер',
  description: 'Мастера по ремонту в Астрахани — вызов в день заявки',
  keywords: ['ремонт в Астрахани', 'сантехник Астрахань', 'электрик Астрахань']
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
