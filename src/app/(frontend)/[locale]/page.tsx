import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Battle Owl</h1>
      <p>Prémiová kosmetika pro muže.</p>
      <Link href="/admin">Přejít do administrace →</Link>
    </main>
  )
}
