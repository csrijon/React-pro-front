const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
export const formatPrice = (n = 0) => `₹${inr.format(Math.round(n))}`
