import path from 'path';
import { buildConfig } from '@payloadcms/next/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import { en } from '@payloadcms/ui/languages/en';
import { cs } from '@payloadcms/ui/languages/cs';
import { s3Storage } from '@payloadcms/storage-s3';

import { getDatabaseUrl } from './src/lib/db';
import Products from './src/payload/collections/Products';
import Categories from './src/payload/collections/Categories';
import Orders from './src/payload/collections/Orders';
import Users from './src/payload/collections/Users';
import Redirects from './src/payload/collections/Redirects';
import Media from './src/payload/collections/Media';
import HomepageSections from './src/payload/globals/HomepageSections';

export default buildConfig({
  editor: slateEditor({}),
  collections: [Products, Categories, Orders, Users, Redirects, Media],
  globals: [HomepageSections],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    url: getDatabaseUrl(),
    idType: 'uuid',
  }),
  i18n: {
    supportedLanguages: {
      en,
      cs,
    },
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.R2_BUCKET_NAME || '',
      config: {
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
});
