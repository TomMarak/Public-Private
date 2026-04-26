import { CollectionConfig } from 'payload';

const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: 'Redirect',
    plural: 'Redirects',
  },
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type', 'isActive'],
  },
  timestamps: true,
  fields: [
    {
      name: 'from',
      type: 'text',
      label: 'From',
      required: true,
      admin: {
        description: 'Source path for the redirect.',
      },
    },
    {
      name: 'to',
      type: 'text',
      label: 'To',
      required: true,
      admin: {
        description: 'Destination path for the redirect.',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Redirect type',
      options: [
        { label: '301', value: '301' },
        { label: '302', value: '302' },
      ],
      defaultValue: '301',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Is active',
      defaultValue: true,
    },
  ],
};

export default Redirects;
