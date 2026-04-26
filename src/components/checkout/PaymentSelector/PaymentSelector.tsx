'use client';

export default function PaymentSelector() {
  return (
    <div className="payment-selector">
      <label>
        <input type="radio" name="payment" value="card" />
        Kreditní karta
      </label>
      <label>
        <input type="radio" name="payment" value="transfer" />
        Bankovní převod
      </label>
      <label>
        <input type="radio" name="payment" value="cash_on_delivery" />
        Dobírka
      </label>
    </div>
  );
}
