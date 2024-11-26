export function formatNumberWithTwoDecimals(
  value: number | null | undefined
): string {
  if (value != undefined && value) {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  }
  return "0.00";
}
