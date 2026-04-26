import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './importMap'
import config from '@payload-config'
import type { ServerFunctionClient } from 'payload'

type Args = {
  children: React.ReactNode
}

export default async function Layout({ children }: Args) {
  const serverFunction: ServerFunctionClient = async (args) => {
    'use server'
    return handleServerFunctions({
      ...args,
      config,
      importMap,
    })
  }

  return RootLayout({
    config,
    children,
    importMap,
    serverFunction,
  })
}
