export function calculatePrice(carType, tint) {
  let basePrice = 120;
  if (carType === "SUV" || carType === "Truck") basePrice += 20;
  if (tint === 5) basePrice += 30;
  return basePrice;
}
