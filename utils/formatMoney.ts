export const formatSMoney = (
  amount: number | string | null | undefined,
): string => {
  if (amount === null || amount === undefined || amount === "") {
    return "S/ 0.00";
  }

  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericValue)) {
    return "S/ 0.00";
  }

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};
