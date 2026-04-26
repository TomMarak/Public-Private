import { notFound } from 'next/navigation'

// Pages are served via [locale] routing — this file should never be hit.
export default function Page() {
  notFound()
}
