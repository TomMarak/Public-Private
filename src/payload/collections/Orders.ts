import { CollectionConfig } from 'payload';

const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'customer'],
  },
  timestamps: true,
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Order number',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated order number.',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Customer',
    },
    {
      name: 'guestEmail',
      type: 'email',
      label: 'Guest email',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Order items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Product',
          required: true,
        },
        {
          name: 'variantName',
          type: 'text',
          label: 'Variant name',
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Quantity',
          required: true,
          min: 1,
        },
        {
          name: 'priceAtPurchase',
          type: 'number',
          label: 'Price at purchase',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping address',
      fields: [
        { name: 'name', type: 'text', label: 'Full name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'phone', type: 'text', label: 'Phone', required: true },
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'postalCode', type: 'text', label: 'Postal code', required: true },
        { name: 'country', type: 'text', label: 'Country', required: true },
      ],
    },
    {
      name: 'shippingMethod',
      type: 'select',
      label: 'Shipping method',
      options: [
        { label: 'Zásilkovna', value: 'zasilkovna' },
        { label: 'PPL', value: 'ppl' },
        { label: 'Pickup', value: 'pickup' },
      ],
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Payment method',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'Bank transfer', value: 'transfer' },
        { label: 'Cash on delivery', value: 'cash_on_delivery' },
      ],
      required: true,
    },
    {
      name: 'paymentId',
      type: 'text',
      label: 'Payment ID',
    },
    {
      name: 'subtotal',
      type: 'number',
      label: 'Subtotal',
      required: true,
      min: 0,
    },
    {
      name: 'tax',
      type: 'number',
      label: 'Tax',
      required: true,
      min: 0,
    },
    {
      name: 'shipping',
      type: 'number',
      label: 'Shipping cost',
      required: true,
      min: 0,
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total',
      required: true,
      min: 0,
    },
  ],
};

export default Orders;
