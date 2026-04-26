import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'
import config from '@payload-config'

export const generateMetadata = ({ params, searchParams }: { params: any, searchParams: any }) =>
  generatePageMetadata({ params, searchParams, config })

const Page = ({ params, searchParams }: { params: any, searchParams: any }) =>
  RootPage({ config, params, searchParams, importMap })

export default Page