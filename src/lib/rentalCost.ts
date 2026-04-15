// Rental cost calculation based on duration
// Daily rate = vehicle price * factor (typically 0.5% - 1% of value per day)
const DAILY_RATE_FACTOR = 0.003; // 0.3% of vehicle value per day
const MIN_DAILY_RATE = 15000; // minimum 15,000 FCFA/day
const WEEKLY_DISCOUNT = 0.15; // 15% discount for 7+ days
const MONTHLY_DISCOUNT = 0.30; // 30% discount for 30+ days

export function calculateRentalCost(vehiclePrice: number, days: number): number {
  if (days <= 0) return 0;

  let dailyRate = Math.max(vehiclePrice * DAILY_RATE_FACTOR, MIN_DAILY_RATE);

  let discount = 0;
  if (days >= 30) {
    discount = MONTHLY_DISCOUNT;
  } else if (days >= 7) {
    discount = WEEKLY_DISCOUNT;
  }

  const totalBeforeDiscount = dailyRate * days;
  const total = Math.round(totalBeforeDiscount * (1 - discount));

  return total;
}

export function getDailyRate(vehiclePrice: number): number {
  return Math.max(Math.round(vehiclePrice * DAILY_RATE_FACTOR), MIN_DAILY_RATE);
}

export function getDiscountLabel(days: number): string | null {
  if (days >= 30) return "-30% (mensuel)";
  if (days >= 7) return "-15% (hebdo)";
  return null;
}
