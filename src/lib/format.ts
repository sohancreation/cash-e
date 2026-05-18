export const taka = (cents: number) =>
  "৳ " + (cents / 100).toLocaleString("en-BD", { maximumFractionDigits: 2 });

export const normalizePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return "880" + digits.slice(1);
  return "880" + digits;
};

export const phoneToEmail = (phone: string) => `${normalizePhone(phone)}@cashe.app`;
