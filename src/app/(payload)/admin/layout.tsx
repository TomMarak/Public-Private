import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './importMap'
import config from '@payload-config'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  return RootLayout({
    config,
    children,
    importMap,
    serverFunction: null as any,
  })
}