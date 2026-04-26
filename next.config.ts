import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const config: NextConfig = {
  // Your Next.js config here
};

export default withPayload(config);
