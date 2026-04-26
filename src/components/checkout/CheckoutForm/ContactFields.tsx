'use client';

interface ContactFieldsProps {
  formData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export default function ContactFields({ formData, onChange, errors = {} }: ContactFieldsProps) {
  return (
    <div className="contact-fields">
      <h3>Kontaktní údaje</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Jméno *</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Příjmení *</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            required
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Telefon *</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          required
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <style jsx>{`
        .contact-fields {
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
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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