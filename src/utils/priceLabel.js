const quoted = new Set(['month', 'meal', 'service']);

export function hasQuotedPrice(listing) {
  return quoted.has(listing?.pricePeriod);
}

export function priceLabel(listing) {
  const period = listing?.pricePeriod;
  if (period === 'ask') return { main: 'Ask there', sub: 'No published rate' };
  if (period === 'id') return { main: 'Your ID', sub: 'Student access' };
  if (period === 'fare') return { main: 'Fare card', sub: 'Token vs smartcard' };
  const amount = Number(listing?.price || 0).toLocaleString('en-IN');
  if (period === 'month') return { main: `₹${amount}`, sub: '/mo' };
  if (period === 'meal') return { main: `₹${amount}`, sub: '/meal' };
  if (period === 'service') return { main: `₹${amount}`, sub: '' };
  return { main: `₹${amount}`, sub: '' };
}

export function compareQuotedPrice(a, b, direction) {
  const ap = hasQuotedPrice(a) ? Number(a.price) : null;
  const bp = hasQuotedPrice(b) ? Number(b.price) : null;
  if (ap == null && bp == null) return 0;
  if (ap == null) return 1;
  if (bp == null) return -1;
  return direction * (ap - bp);
}
