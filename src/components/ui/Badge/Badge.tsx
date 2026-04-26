export default function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
