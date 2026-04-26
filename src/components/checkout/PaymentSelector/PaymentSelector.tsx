'use client';

interface PaymentSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const paymentOptions = [
  {
    id: 'card',
    name: 'Kreditní karta',
    description: 'Platba kartou online přes Stripe',
  },
  {
    id: 'transfer',
    name: 'Bankovní převod',
    description: 'Platba převodem na účet, objednávka se zpracuje po přijetí platby',
  },
  {
    id: 'cash_on_delivery',
    name: 'Dobírka',
    description: 'Platba při převzetí zásilky kurýrovi',
  },
];

export default function PaymentSelector({ selectedMethod, onMethodChange }: PaymentSelectorProps) {
  return (
    <div className="payment-selector">
      <h3>Platba</h3>
      <div className="payment-options">
        {paymentOptions.map((option) => (
          <label key={option.id} className={`payment-option ${selectedMethod === option.id ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => onMethodChange(e.target.value)}
            />
            <div className="option-content">
              <div className="option-name">{option.name}</div>
              <div className="option-description">{option.description}</div>
            </div>
          </label>
        ))}
      </div>

      <style jsx>{`
        .payment-selector {
          margin-bottom: 2rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .payment-option {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-option:hover {
          border-color: #d1d5db;
        }

        .payment-option.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .payment-option input[type="radio"] {
          margin-right: 0.75rem;
          margin-top: 0.125rem;
          accent-color: #3b82f6;
        }

        .option-content {
          flex: 1;
        }

        .option-name {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .option-description {
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
