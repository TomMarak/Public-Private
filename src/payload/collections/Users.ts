import { CollectionConfig } from 'payload';

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  timestamps: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      defaultValue: 'customer',
      required: true,
    },
    {
      name: 'addresses',
      type: 'array',
      label: 'Addresses',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Address label',
        },
        {
          name: 'street',
          type: 'text',
          label: 'Street',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Postal code',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Country',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
        },
      ],
    },
  ],
};

export default Users;
