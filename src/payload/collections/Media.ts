import { CollectionConfig } from 'payload';

const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  upload: {
    // Disable static directory since we're using S3/R2
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      localized: true,
    },
  ],
};

export default Media;