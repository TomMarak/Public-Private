export default function ProductBadge({ status }: { status: 'sold_out' | 'new' | 'sale' }) {
  if (status === 'sold_out') {
    return <div className="badge badge-sold-out">Vyprodáno</div>;
  }
  return <div className={`badge badge-${status}`}>{status}</div>;
}
