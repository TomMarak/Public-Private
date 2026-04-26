'use client';

export default function ObjednavkaPotvrzenaPage() {
  return (
    <div className="success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1>Objednávka přijata</h1>
          <p>Děkujeme za vaši objednávku! Obdržíte potvrzení emailem.</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            Pokračovat v nákupu
          </button>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
        }

        .container {
          max-width: 600px;
          padding: 2rem;
        }

        .success-content {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0 auto 1.5rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #111827;
        }

        p {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-primary:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}