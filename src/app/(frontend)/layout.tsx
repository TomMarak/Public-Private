import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Battle Owl - Česká značka péče o vousy',
  description: 'Prémiová kosmetika pro muže. Péče o vousy, vlasy a kůži.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
