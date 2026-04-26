import path from 'path';
import { buildConfig } from '@payloadcms/next/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import { en } from '@payloadcms/ui/languages/en';
import { cs } from '@payloadcms/ui/languages/cs';

export default buildConfig({
  editor: slateEditor({}),
  collections: [
    // Collections will be imported here
  ],
  globals: [
    // Globals will be imported here
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    url: process.env.DATABASE_URL || '',
    idType: 'uuid',
  }),
  i18n: {
    supportedLanguages: {
      en,
      cs,
    },
  },
});
