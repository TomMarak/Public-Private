'use client';

export default function CheckoutForm() {
  return (
    <form className="checkout-form">
      <div className="form-section">
        <h3>Kontaktní údaje</h3>
        {/* TODO: Add contact fields */}
      </div>
      <div className="form-section">
        <h3>Doručovací adresa</h3>
        {/* TODO: Add address fields */}
      </div>
      <div className="form-section">
        <h3>Doprava</h3>
        {/* TODO: Add shipping selector */}
      </div>
      <div className="form-section">
        <h3>Platba</h3>
        {/* TODO: Add payment selector */}
      </div>
      <button type="submit" className="btn-submit">Objednat</button>
    </form>
  );
}
