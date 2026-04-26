import { CollectionConfig } from 'payload';

const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'status'],
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
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Sold out', value: 'sold_out' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt text',
          localized: true,
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variants',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Variant name',
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          required: true,
        },
        {
          name: 'stock',
          type: 'number',
          label: 'Stock',
          required: true,
          min: 0,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Variant price',
          min: 0,
        },
      ],
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

export default Products;
