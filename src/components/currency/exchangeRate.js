
  export function applyExchangeRate(items, rate) {
    if (!items) return items;

    if (Array.isArray(items)) {

      return items.map((item) => ({
        ...item,
        price: Math.round(item.price * rate),
        discountPrice: item.discountPrice
          ? Math.round(item.discountPrice * rate)
          : null,
      }));
    }

    // Single item object

    return {
      ...items,
      price: Math.round(items.price * rate),
      discountPrice: items.discountPrice
        ? Math.round(items.discountPrice * rate)
        : null,
    };
  }