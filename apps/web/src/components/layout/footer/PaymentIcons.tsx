export function PaymentIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#1A1F71] text-white text-xs font-semibold">
        Visa
      </span>
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#EB001B] text-white text-xs font-semibold">
        Mastercard
      </span>
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#32BCAD] text-white text-xs font-semibold">
        PIX
      </span>
      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#004CA3] text-white text-xs font-semibold">
        Boleto
      </span>
    </div>
  );
}
