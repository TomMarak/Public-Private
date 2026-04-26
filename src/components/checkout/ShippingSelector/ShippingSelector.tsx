'use client';

interface ShippingSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const shippingOptions = [
  {
    id: 'zasilkovna',
    name: 'Zásilkovna',
    price: 49,
    description: 'Doručení na výdejní místo Zásilkovny',
  },
  {
    id: 'ppl',
    name: 'PPL',
    price: 89,
    description: 'Doručení na adresu kurýrem PPL',
  },
  {
    id: 'pickup',
    name: 'Osobní odběr',
    price: 0,
    description: 'Osobní odběr v naší prodejně',
  },
];

export default function ShippingSelector({ selectedMethod, onMethodChange }: ShippingSelectorProps) {
  return (
    <div className="shipping-selector">
      <h3>Doprava</h3>
      <div className="shipping-options">
        {shippingOptions.map((option) => (
          <label key={option.id} className={`shipping-option ${selectedMethod === option.id ? 'selected' : ''}`}>
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => onMethodChange(e.target.value)}
            />
            <div className="option-content">
              <div className="option-header">
                <span className="option-name">{option.name}</span>
                <span className="option-price">{option.price} Kč</span>
              </div>
              <div className="option-description">{option.description}</div>
            </div>
          </label>
        ))}
      </div>

      <style jsx>{`
        .shipping-selector {
          margin-bottom: 2rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .shipping-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .shipping-option {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shipping-option:hover {
          border-color: #d1d5db;
        }

        .shipping-option.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .shipping-option input[type="radio"] {
          margin-right: 0.75rem;
          margin-top: 0.125rem;
          accent-color: #3b82f6;
        }

        .option-content {
          flex: 1;
        }

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .option-name {
          font-weight: 500;
          color: #374151;
        }

        .option-price {
          font-weight: 600;
          color: #111827;
        }

        .option-description {
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
