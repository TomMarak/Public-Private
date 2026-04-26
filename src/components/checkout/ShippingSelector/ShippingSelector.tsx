'use client';

export default function ShippingSelector() {
  return (
    <div className="shipping-selector">
      <label>
        <input type="radio" name="shipping" value="zasilkovna" />
        Zásilkovna
      </label>
      <label>
        <input type="radio" name="shipping" value="ppl" />
        PPL
      </label>
      <label>
        <input type="radio" name="shipping" value="pickup" />
        Osobní odběr
      </label>
    </div>
  );
}
