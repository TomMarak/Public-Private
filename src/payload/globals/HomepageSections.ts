import { GlobalConfig } from 'payload';

const HomepageSections: GlobalConfig = {
  slug: 'homepageSections',
  label: 'Homepage Sections',
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Homepage sections',
      minRows: 1,
      fields: [
        {
          name: 'sectionType',
          type: 'select',
          label: 'Section type',
          options: [
            { label: 'Featured products', value: 'featured_products' },
            { label: 'Category banner', value: 'category_banner' },
            { label: 'Promo banner', value: 'promo_banner' },
          ],
          required: true,
        },
        {
          name: 'featuredProducts',
          type: 'relationship',
          relationTo: 'products',
          label: 'Featured products',
          hasMany: true,
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'featured_products',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          label: 'Category',
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'category_banner',
          },
        },
        {
          name: 'bannerTitle',
          type: 'text',
          label: 'Banner title',
          localized: true,
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'category_banner',
          },
        },
        {
          name: 'bannerDescription',
          type: 'textarea',
          label: 'Banner description',
          localized: true,
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'category_banner',
          },
        },
        {
          name: 'promoTitle',
          type: 'text',
          label: 'Promo title',
          localized: true,
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'promo_banner',
          },
        },
        {
          name: 'promoDescription',
          type: 'textarea',
          label: 'Promo description',
          localized: true,
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'promo_banner',
          },
        },
        {
          name: 'promoButtonText',
          type: 'text',
          label: 'Promo button text',
          localized: true,
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'promo_banner',
          },
        },
        {
          name: 'promoButtonUrl',
          type: 'text',
          label: 'Promo button URL',
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType === 'promo_banner',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL',
          admin: {
            condition: ({ siblingData }) => siblingData?.sectionType !== 'featured_products',
          },
        },
      ],
    },
  ],
};

export default HomepageSections;
