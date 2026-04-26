import { CollectionConfig } from 'payload';

const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent'],
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      required: true,
      admin: {
        description: 'Manual URL slug. Admin enters the slug explicitly.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Parent category',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta title',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta description',
          localized: true,
        },
        {
          name: 'metaKeywords',
          type: 'text',
          label: 'Meta keywords',
          localized: true,
        },
      ],
    },
  ],
};

export default Categories;
