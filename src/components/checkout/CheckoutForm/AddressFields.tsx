'use client';

interface AddressFieldsProps {
  formData: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export default function AddressFields({ formData, onChange, errors = {} }: AddressFieldsProps) {
  return (
    <div className="address-fields">
      <h3>Doručovací adresa</h3>

      <div className="form-group">
        <label htmlFor="street">Ulice a číslo popisné *</label>
        <input
          type="text"
          id="street"
          value={formData.street}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder="Např. Hlavní 123"
          required
        />
        {errors.street && <span className="error">{errors.street}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">Město *</label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            required
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">PSČ *</label>
          <input
            type="text"
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            placeholder="123 45"
            required
          />
          {errors.postalCode && <span className="error">{errors.postalCode}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="country">Země *</label>
        <select
          id="country"
          value={formData.country}
          onChange={(e) => onChange('country', e.target.value)}
          required
        >
          <option value="">Vyberte zemi</option>
          <option value="CZ">Česká republika</option>
          <option value="SK">Slovensko</option>
        </select>
        {errors.country && <span className="error">{errors.country}</span>}
      </div>

      <style jsx>{`
        .address-fields {
          margin-bottom: 2rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        input, select {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .error {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}