'use client';

import { useState } from 'react';
import ContactFields from './ContactFields';
import AddressFields from './AddressFields';

interface CheckoutFormData {
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Address
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CheckoutFormProps {
  onSubmit?: (data: CheckoutFormData) => void;
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'CZ',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Contact validation
    if (!formData.firstName.trim()) newErrors.firstName = 'Jméno je povinné';
    if (!formData.lastName.trim()) newErrors.lastName = 'Příjmení je povinné';
    if (!formData.email.trim()) newErrors.email = 'Email je povinný';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Neplatný email';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon je povinný';

    // Address validation
    if (!formData.street.trim()) newErrors.street = 'Ulice je povinná';
    if (!formData.city.trim()) newErrors.city = 'Město je povinné';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'PSČ je povinné';
    if (!formData.country) newErrors.country = 'Země je povinná';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <ContactFields
        formData={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }}
        onChange={handleFieldChange}
        errors={errors}
      />

      <AddressFields
        formData={{
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        }}
        onChange={handleFieldChange}
        errors={errors}
      />

      <style jsx>{`
        .checkout-form {
          width: 100%;
        }
      `}</style>
    </form>
  );
}
