export function applyExchangeRate(items: any, rate: number) {
  if (!items) return items;

  const transform = (item: any) => {
    // Preserve original prices as basePrice if not already present
    // This ensures we always calculate from the same foundation
    const basePrice = item.basePrice !== undefined ? item.basePrice : item.price;
    const baseDiscountPrice = item.baseDiscountPrice !== undefined 
      ? item.baseDiscountPrice 
      : (item.discountPrice === undefined || item.discountPrice === null ? null : item.discountPrice);

    return {
      ...item,
      basePrice,
      baseDiscountPrice,
      price: Math.round(basePrice * rate),
      discountPrice: baseDiscountPrice !== null ? Math.round(baseDiscountPrice * rate) : null,
    };
  };

  if (Array.isArray(items)) {
    return items.map(transform);
  }

  return transform(items);
}