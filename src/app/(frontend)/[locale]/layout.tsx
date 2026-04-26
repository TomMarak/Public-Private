import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import type { ReactNode } from 'react'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <>{children}</>
}
